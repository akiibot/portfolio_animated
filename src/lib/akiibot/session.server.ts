import 'server-only';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { ChatError, policy } from './policy';
import type { HistoryTurn } from './types';
const turnsSchema=z.array(z.object({user:z.string().max(4800),assistant:z.string().max(7200)}).strict()).max(3);
export class SessionSigner {
 constructor(private secret:string){if(Buffer.byteLength(secret)<32)throw new Error('Session secret too short');}
 private sign(kind:string,data:unknown):string {const body=Buffer.from(JSON.stringify(data)).toString('base64url');return body+'.'+createHmac('sha256',this.secret).update(kind+':'+body).digest('base64url');}
 private read(kind:string,token:string,max=policy.maxHistory+1024):unknown {
  if(token.length>18000)throw new ChatError('session_expired',403);
  const [body,sig,extra]=token.split('.');if(!body||!sig||extra||!/^[\w-]+$/.test(body)||!/^[\w-]+$/.test(sig))throw new ChatError('session_expired',403);
  const expected=createHmac('sha256',this.secret).update(kind+':'+body).digest(); const actual=Buffer.from(sig,'base64url');
  if(actual.length!==expected.length||!timingSafeEqual(actual,expected))throw new ChatError('session_expired',403);
  const bytes=Buffer.from(body,'base64url');if(bytes.length>max)throw new ChatError('session_expired',403);
  try{return JSON.parse(bytes.toString('utf8'));}catch{throw new ChatError('session_expired',403);}
 }
 signBrowser(browserId:string,now:number):string{return this.sign('browser',{browserId,expiresAt:now+86400000});}
 verifyBrowser(token:string,now:number):string {const d=z.object({browserId:z.string().min(1).max(80),expiresAt:z.number()}).parse(this.read('browser',token,2048));if(d.expiresAt<=now)throw new ChatError('session_expired',403);return d.browserId;}
 issueSession(browserId:string,now:number):string{return this.sign('session',{browserId,sessionId:randomUUID(),expiresAt:now+policy.sessionMs});}
 verifySession(token:string,browserId:string,now:number):{sessionId:string;expiresAt:number}{
  const d=z.object({browserId:z.string(),sessionId:z.uuid(),expiresAt:z.number()}).parse(this.read('session',token,2048));
  if(d.browserId!==browserId||d.expiresAt<=now)throw new ChatError('session_expired',403);return d;
 }
 signHistory(turns:HistoryTurn[],sessionId:string):string{
  const bounded=turns.slice(-3);while(Buffer.byteLength(JSON.stringify({sessionId,turns:bounded}))>policy.maxHistory)bounded.shift();
  return this.sign('history',{sessionId,turns:bounded});
 }
 verifyHistory(token:string|undefined,sessionId:string):HistoryTurn[]{
  if(!token)return []; const d=z.object({sessionId:z.string(),turns:turnsSchema}).strict().parse(this.read('history',token));
  if(d.sessionId!==sessionId)throw new ChatError('session_expired',403);return d.turns;
 }
}
