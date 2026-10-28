import 'server-only';
import { Redis } from '@upstash/redis';
import type { GuardStore } from './guard.server';
import { ChatError } from './policy';
// Short outage backoff avoids hammering an exhausted free store; it never permits AI.
let unavailableUntil=0;
export function createStore(url:string,token:string):GuardStore {
 const redis=new Redis({url,token,retry:false,automaticDeserialization:false,signal:()=>AbortSignal.timeout(2000)});
 return {async eval(script,keys,args){
  if(Date.now()<unavailableUntil)throw new ChatError('unavailable',503);
  try{return await redis.eval(script,keys,args);}catch{unavailableUntil=Date.now()+5000;throw new ChatError('unavailable',503);}
 }};
}
