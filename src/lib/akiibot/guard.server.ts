import 'server-only';
import { randomUUID } from 'node:crypto';
import { ChatError, policy } from './policy';
import type { ErrorCode, TokenUsage } from './types';
export interface GuardStore {eval(script:string,keys:string[],args:(string|number)[]):Promise<unknown>}
export type Lease={id:string;browser:string;session:string;now:number};
export type Reservation={id:string;key:string;monthKey:string;reservedMicroUsd:number;inputTokens:number};
type Attempt={browserId:string;sessionId:string;ipHash:string;requestId:string;now:number};
type Admission={allowed:true;lease:Lease}|{allowed:false;code:ErrorCode;retryAfterSeconds?:number};
// All gates use Redis atomic scripts; no per-instance counters authorize AI requests.
const admit=`
local p=KEYS[1]; local now=tonumber(ARGV[1]); local b=ARGV[2]; local s=ARGV[3]; local ip=ARGV[4];local rid=ARGV[5];local id=ARGV[6]
local function deny(code,retry) return cjson.encode({allowed=false,code=code,retryAfterSeconds=retry}) end
local function count(k,limit,ttl)
 local n=tonumber(redis.call('GET',k) or '0');if n>=limit then return false end
 redis.call('INCR',k);redis.call('EXPIRE',k,ttl);return true
end
if not count(p..'ip-hour:'..ip..':'..math.floor(now/3600000),60,3600) or not count(p..'ip-day:'..ip,120,86400) then return deny('rate_limited',60) end
if redis.call('EXISTS',p..'request:'..b..':'..rid)==1 then return deny('duplicate',2) end
if tonumber(redis.call('GET',p..'success-session:'..s) or '0')>=15 then return deny('session_limit',0) end
redis.call('ZREMRANGEBYSCORE',p..'success-browser:'..b,'-inf',now-86400000)
if redis.call('ZCARD',p..'success-browser:'..b)>=30 then return deny('session_limit',0) end
local bucket=p..'bucket:'..b
local tokens=tonumber(redis.call('HGET',bucket,'tokens') or '6');local last=tonumber(redis.call('HGET',bucket,'last') or now)
tokens=math.min(6,tokens+math.max(0,now-last)/10000)
if tokens<1 then return deny('rate_limited',math.ceil((1-tokens)*10)) end
redis.call('ZREMRANGEBYSCORE',p..'active','-inf',now)
if redis.call('EXISTS',p..'active-browser:'..b)==1 or redis.call('ZCARD',p..'active')>=4 then return deny('busy',2) end
redis.call('HSET',bucket,'tokens',tokens-1,'last',now);redis.call('EXPIRE',bucket,120)
redis.call('SET',p..'request:'..b..':'..rid,1,'EX',86400)
redis.call('SET',p..'active-browser:'..b,id,'PX',45000)
redis.call('ZADD',p..'active',now+45000,id);redis.call('EXPIRE',p..'active',60)
return cjson.encode({allowed=true})`;
const reserve=`
local amount=tonumber(ARGV[1]);local cap=tonumber(ARGV[2]);local used=tonumber(redis.call('GET',KEYS[1]) or '0')
if redis.call('EXISTS',KEYS[2])==1 then return 0 end
if used+amount>cap then return 0 end
redis.call('INCRBY',KEYS[1],amount);redis.call('EXPIRE',KEYS[1],7776000)
redis.call('SET',KEYS[2],amount,'EX',7776000);return 1`;
const finish=`
local p=KEYS[1];local id=ARGV[1];local b=ARGV[2];local s=ARGV[3];local now=tonumber(ARGV[4]);local success=ARGV[5]=='1'
local first=true
if KEYS[2]~='' then
 local reserved=tonumber(redis.call('GET',KEYS[2]) or '-1')
 if reserved<0 then first=false else
  local actual=tonumber(ARGV[6]);if actual>=0 and actual<=reserved then redis.call('DECRBY',KEYS[3],reserved-actual) end
  redis.call('SET',KEYS[2],-1,'EX',7776000)
 end
end
if success and first then
 redis.call('INCR',p..'success-session:'..s);redis.call('EXPIRE',p..'success-session:'..s,28800)
 redis.call('ZADD',p..'success-browser:'..b,now,id);redis.call('EXPIRE',p..'success-browser:'..b,86400)
end
if redis.call('GET',p..'active-browser:'..b)==id then redis.call('DEL',p..'active-browser:'..b) end
redis.call('ZREM',p..'active',id)
return tonumber(redis.call('GET',p..'success-session:'..s) or '0')`;
const issue=`
local b=tonumber(redis.call('GET',KEYS[1]) or '0');local ip=tonumber(redis.call('GET',KEYS[2]) or '0')
if b>=12 or ip>=60 then return 0 end
redis.call('INCR',KEYS[1]);redis.call('EXPIRE',KEYS[1],3600);redis.call('INCR',KEYS[2]);redis.call('EXPIRE',KEYS[2],3600);return 1`;
export class Guard {
 constructor(private store:GuardStore,private prefix:string,private scope:string){}
 async admitSessionCreation(i:{browserId:string;ipHash:string;now:number}){const h=Math.floor(i.now/3600000);return {allowed:Number(await this.store.eval(issue,[`${this.prefix}issue-b:${i.browserId}:${h}`,`${this.prefix}issue-ip:${i.ipHash}:${h}`],[]))===1,retryAfterSeconds:60};}
 async admitAttempt(i:Attempt):Promise<Admission>{
  const id=randomUUID();const raw=await this.store.eval(admit,[this.prefix],[i.now,i.browserId,i.sessionId,i.ipHash,i.requestId,id]);
  const result=JSON.parse(String(raw)) as {allowed:boolean;code:ErrorCode;retryAfterSeconds?:number};
  return result.allowed?{allowed:true,lease:{id,browser:i.browserId,session:i.sessionId,now:i.now}}:{allowed:false,code:result.code,retryAfterSeconds:result.retryAfterSeconds};
 }
 async reserveCost(lease:Lease,inputTokens:number,now:number):Promise<Reservation>{
  if(!Number.isSafeInteger(inputTokens)||inputTokens<1||inputTokens>policy.maxInput)throw new ChatError('unavailable',503);
  const monthKey=this.scope+'month:'+new Date(now).toISOString().slice(0,7);const key=this.scope+'reservation:'+lease.id;
  const reservedMicroUsd=Math.ceil(inputTokens*policy.inputMicro+policy.maxOutput*policy.outputMicro);
  if(Number(await this.store.eval(reserve,[monthKey,key],[reservedMicroUsd,policy.budgetMicro]))!==1)throw new ChatError('budget_exhausted',503);
  return {id:lease.id,key,monthKey,reservedMicroUsd,inputTokens};
 }
 async finishAttempt(lease:Lease,r:Reservation|undefined,usage:TokenUsage|undefined,success:boolean):Promise<number>{
  let actual=-1;
  if(r&&usage&&Number.isSafeInteger(usage.inputTokens)&&Number.isSafeInteger(usage.billableOutputTokens)&&usage.inputTokens>=0&&usage.inputTokens<=r.inputTokens&&usage.billableOutputTokens>=0&&usage.billableOutputTokens<=policy.maxOutput)actual=Math.ceil(usage.inputTokens*policy.inputMicro+usage.billableOutputTokens*policy.outputMicro);
  if(success&&(actual<0||!r))throw new ChatError('unavailable',503);
  const count=await this.store.eval(finish,[this.prefix,r?.key||'',r?.monthKey||''],[lease.id,lease.browser,lease.session,lease.now,success?1:0,actual]);return Math.max(0,15-Number(count));
 }
 async spent(now:number):Promise<number>{return Number(await this.store.eval("return tonumber(redis.call('GET',KEYS[1]) or '0')",[this.scope+'month:'+new Date(now).toISOString().slice(0,7)],[]));}
}
