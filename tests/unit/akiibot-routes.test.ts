import { expect, it, vi } from 'vitest';
import { createChatHandler, createSessionHandler } from '@/lib/akiibot/handlers.server';
import { SessionSigner } from '@/lib/akiibot/session.server';
import type { Guard } from '@/lib/akiibot/guard.server';
import { ChatError } from '@/lib/akiibot/policy';
const secret='test-secret-'.repeat(5), signer=new SessionSigner(secret), now=Date.now();
const token=signer.issueSession('browser',now), cookie=signer.signBrowser('browser',now);
function request(body:unknown={},origin='http://127.0.0.1:3100'){return new Request('http://127.0.0.1:3100/api/akiibot/chat',{method:'POST',headers:{origin,'sec-fetch-site':'same-origin','content-type':'application/json',cookie:`akiibot-browser=${cookie}`},body:JSON.stringify(body)});}
function setup(){
 const generate=vi.fn(async()=>({raw:{answer:'Vallet is a testnet prototype.',sourceIds:['vallet'],suggestions:[],mood:'answering'},usage:{inputTokens:100,billableOutputTokens:30}}));
 const guard={admitSessionCreation:vi.fn(async()=>({allowed:true,retryAfterSeconds:60})),admitAttempt:vi.fn(async()=>({allowed:true as const,lease:{id:'l',browser:'browser',session:'s',now}})),reserveCost:vi.fn(async()=>({id:'l',key:'r',monthKey:'m',reservedMicroUsd:10000,inputTokens:500})),finishAttempt:vi.fn<Guard['finishAttempt']>(async()=>14)};
 const deps={config:{secret,origins:['http://127.0.0.1:3100'],deployment:'local' as const},guard,vertex:{countInputTokens:vi.fn(async()=>500),generate},signer};return {deps,generate,guard};
}
const body=()=>({message:'Explain Vallet',sessionToken:token,requestId:crypto.randomUUID()});
it('returns grounded sources and signed history only after admission and settlement',async()=>{
 const {deps,generate,guard}=setup();const r=await createChatHandler(deps)(request(body()));expect(r.status).toBe(200);
 const result=await r.json();expect(result.sources[0].href).toBe('/projects/vallet');expect(result.remainingMessages).toBe(14);expect(result.historyToken).toBeTruthy();expect(generate).toHaveBeenCalledOnce();expect(guard.finishAttempt).toHaveBeenCalledOnce();
});
it('rejects cross-site, forged history, model overrides and oversized bodies before provider calls',async()=>{
 for(const r of [request(body(),'https://evil.test'),request({...body(),historyToken:'forged'}),request({...body(),model:'other'}),request({...body(),message:'x'.repeat(25000)})]){const {deps,generate}=setup();expect((await createChatHandler(deps)(r)).status).toBeGreaterThanOrEqual(400);expect(generate).not.toHaveBeenCalled();expect(deps.vertex.countInputTokens).not.toHaveBeenCalled();}
});
it('never calls Gemini without a shared allowance or on duplicate requests',async()=>{
 for(const code of ['duplicate','session_limit','budget_exhausted','unavailable'] as const){const {deps,generate}=setup();deps.guard.admitAttempt.mockImplementation(async()=>{throw new ChatError(code,503);});expect((await createChatHandler(deps)(request(body()))).status).toBe(503);expect(generate).not.toHaveBeenCalled();}
});
it('retains charges and safe fallback for malformed billable output',async()=>{
 const {deps,guard}=setup();deps.vertex.generate.mockResolvedValue({raw:{answer:'bad',sourceIds:['evil'],suggestions:[],mood:'answering'},usage:{inputTokens:100,billableOutputTokens:30}});
 const r=await createChatHandler(deps)(request(body()));expect(r.status).toBe(503);expect((await r.json()).fallbackLinks).toHaveLength(3);expect(guard.finishAttempt.mock.calls[0][3]).toBe(false);
});
it('issues a limited session cookie without a model call',async()=>{
 const {deps,generate}=setup();const r=await createSessionHandler(deps)(request({}));expect(r.status).toBe(200);expect(r.headers.get('set-cookie')).toContain('HttpOnly');expect(generate).not.toHaveBeenCalled();
});
