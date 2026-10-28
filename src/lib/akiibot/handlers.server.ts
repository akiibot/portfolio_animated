import 'server-only';
import { randomUUID } from 'node:crypto';
import { fallbackLinks } from '@/content/akiibot';
import { buildKnowledge, selectKnowledge } from './knowledge';
import { ChatError, policy, readBoundedJson, trustedClientIdentity, validateChatBody, verifyOrigin } from './policy';
import { validateReply } from './reply.server';
import type { ServerConfig } from './config.server';
import type { Guard, Lease, Reservation } from './guard.server';
import type { SessionSigner } from './session.server';
import type { VertexGateway, GenerationInput } from './vertex.server';
import type { ChatFailure, ErrorCode, TokenUsage } from './types';
type Dependencies={config:Pick<ServerConfig,'secret'|'origins'|'deployment'>;guard:Pick<Guard,'admitSessionCreation'|'admitAttempt'|'reserveCost'|'finishAttempt'>;signer:SessionSigner;vertex:VertexGateway};
const cookieName='akiibot-browser';
const copy:Record<ErrorCode,string>={invalid_request:'Please send a question of up to 1,200 characters.',forbidden:'Please open Akiibot from the portfolio website.',session_expired:'This chat session has expired. Start a new chat when you’re ready.',rate_limited:'A little breather—please try again shortly.',session_limit:"That's my chat limit for this visit. You can still explore Akib's projects or contact him directly.",busy:'I’m finishing another reply. Please try again in a moment.',duplicate:'That request was already received. If the reply was interrupted, you can retry.',budget_exhausted:'AI replies are resting for now. You can still explore the projects or contact Akib.',unavailable:'I couldn’t finish that reply. Your question is safe to retry, and these links still work.',timeout:'That reply was interrupted. Please try again when you’re ready.'};
export function failure(error:unknown):Response{
 const e=error instanceof ChatError?error:new ChatError('unavailable',503);
 const body:ChatFailure={code:e.code,message:copy[e.code],fallbackLinks,...(e.retryAfterSeconds?{retryAfterSeconds:e.retryAfterSeconds}:{})};
 return Response.json(body,{status:e.status,headers:{'Cache-Control':'no-store',...(e.retryAfterSeconds?{'Retry-After':String(e.retryAfterSeconds)}:{})}});
}
function browser(req:Request,signer:SessionSigner,now:number):string|undefined{
 const cookie=req.headers.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith(cookieName+'='))?.slice(cookieName.length+1);
 if(!cookie)return undefined;try{return signer.verifyBrowser(cookie,now);}catch{return undefined;}
}
export function createSessionHandler(d:Dependencies){return async(req:Request)=>{
 try{
  verifyOrigin(req,d.config.origins);const body=await readBoundedJson(req);if(!body||typeof body!=='object'||Array.isArray(body)||Object.keys(body).length)throw new ChatError('invalid_request');
  const now=Date.now(),id=browser(req,d.signer,now)||randomUUID(),ip=trustedClientIdentity(req,d.config.deployment,d.config.secret,now);
  const allowed=await d.guard.admitSessionCreation({browserId:id,ipHash:ip.ipHash,now});if(!allowed.allowed)throw new ChatError('rate_limited',429,allowed.retryAfterSeconds);
  return Response.json({sessionToken:d.signer.issueSession(id,now),expiresAt:now+policy.sessionMs},{headers:{'Cache-Control':'no-store','Set-Cookie':`${cookieName}=${d.signer.signBrowser(id,now)}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400${d.config.deployment==='vercel'?'; Secure':''}`}});
 }catch(e){return failure(e);}
};}
export function createChatHandler(d:Dependencies){return async(req:Request)=>{
 let lease:Lease|undefined,reservation:Reservation|undefined,usage:TokenUsage|undefined,finished=false;
 const signal=AbortSignal.any([req.signal,AbortSignal.timeout(25000)]);
 try{
  verifyOrigin(req,d.config.origins);const body=validateChatBody(await readBoundedJson(req));const now=Date.now(),id=browser(req,d.signer,now);if(!id)throw new ChatError('session_expired',403);
  const s=d.signer.verifySession(body.sessionToken,id,now),turns=d.signer.verifyHistory(body.historyToken,s.sessionId),ip=trustedClientIdentity(req,d.config.deployment,d.config.secret,now);
  const a=await d.guard.admitAttempt({browserId:id,sessionId:s.sessionId,ipHash:ip.ipHash,requestId:body.requestId,now});if(!a.allowed)throw new ChatError(a.code,a.code==='budget_exhausted'?503:429,a.retryAfterSeconds);lease=a.lease;
  const k=buildKnowledge();let input:GenerationInput={instruction:k.instruction,facts:selectKnowledge(k,body.message,turns),turns,message:body.message};
  let count=await d.vertex.countInputTokens(input,signal);
  if(count>policy.maxInput){input={...input,facts:k.facts,turns:[]};count=await d.vertex.countInputTokens(input,signal);}
  if(count>policy.maxInput)throw new ChatError('unavailable',503);
  signal.throwIfAborted();reservation=await d.guard.reserveCost(lease,count,now);signal.throwIfAborted();
  const generated=await d.vertex.generate(input,signal);usage=generated.usage;signal.throwIfAborted();const reply=validateReply(generated.raw,k.sources);
  const historyToken=d.signer.signHistory([...input.turns,{user:body.message,assistant:reply.answer}],s.sessionId);
  const remainingMessages=await d.guard.finishAttempt(lease,reservation,usage,true);finished=true;
  return Response.json({...reply,historyToken,remainingMessages},{headers:{'Cache-Control':'no-store'}});
 }catch(e){return failure(signal.aborted?new ChatError('timeout',504):e);}
 finally{if(lease&&!finished){try{await d.guard.finishAttempt(lease,reservation,usage,false);}catch{/* Keep full reservation on uncertain settlement; never retry generation. */}}}
};}
