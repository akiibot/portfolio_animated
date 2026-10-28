import { it, expect } from 'vitest';
import { SessionSigner } from '@/lib/akiibot/session.server';
import { readBoundedJson, verifyOrigin, validateChatBody } from '@/lib/akiibot/policy';
const signer=new SessionSigner('test-secret-'.repeat(5));
it('rejects modified, expired, cross-browser and cross-session state',()=>{
  const token=signer.issueSession('browser',1000);
  const s=signer.verifySession(token,'browser',2000);
  expect(()=>signer.verifySession(token+'x','browser',2000)).toThrow();
  expect(()=>signer.verifySession(token,'other',2000)).toThrow();
  expect(()=>signer.verifySession(token,'browser',1000+8*3600_000)).toThrow();
  const h=signer.signHistory([{user:'Hi',assistant:'Hello'}],s.sessionId);
  expect(()=>signer.verifyHistory(h,'other')).toThrow();
  expect(signer.verifyHistory(h,s.sessionId)).toHaveLength(1);
});
it('bounds multilingual signed history and cookie signatures',()=>{
 const h=signer.signHistory(Array.from({length:4},()=>({user:'😄'.repeat(1200),assistant:'😄'.repeat(1800)})),'session');
 expect(Buffer.byteLength(JSON.stringify(signer.verifyHistory(h,'session')))).toBeLessThan(12288);
 const c=signer.signBrowser('browser',1000);
 expect(signer.verifyBrowser(c,2000)).toBe('browser');
 expect(()=>signer.verifyBrowser(c+'x',2000)).toThrow();
});
it('rejects oversize actual bytes, unknown roles and cross-site origins',async()=>{
 const request=new Request('https://portfolio.test/api',{method:'POST',body:'x'.repeat(25000)});
 await expect(readBoundedJson(request)).rejects.toThrow();
 expect(()=>validateChatBody({message:'Hi',sessionToken:'x',requestId:crypto.randomUUID(),role:'system'})).toThrow();
 expect(()=>verifyOrigin(new Request('https://portfolio.test/api',{headers:{origin:'https://evil.test','sec-fetch-site':'same-origin'}}),['https://portfolio.test'])).toThrow();
 expect(()=>verifyOrigin(new Request('https://portfolio.test/api',{headers:{origin:'https://portfolio.test','sec-fetch-site':'same-origin','content-type':'application/json'}}),['https://portfolio.test'])).not.toThrow();
});
