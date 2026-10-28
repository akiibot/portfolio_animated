import { expect, it } from 'vitest';
import { buildKnowledge, selectKnowledge } from '@/lib/akiibot/knowledge';
import { validateReply } from '@/lib/akiibot/reply.server';
it('keeps attribution and prototype caveats and resolves only approved links', () => {
  const k=buildKnowledge();
  expect(selectKnowledge(k,'Explain Vallet',[])).toContain('testnet');
  expect(selectKnowledge(k,'LocalRelay',[])).toContain('simulation');
  const r=validateReply({answer:'Hello',sourceIds:['contact'],suggestions:[],mood:'answering'}, k.sources);
  expect(r.sources[0].href).toBe('/#contact');
  expect(()=>validateReply({answer:'Hello',sourceIds:['javascript:alert(1)'],suggestions:[],mood:'happy'},k.sources)).toThrow();
  expect(()=>validateReply({answer:'x'.repeat(1801),sourceIds:[],suggestions:[],mood:'happy'},k.sources)).toThrow();
  expect(()=>validateReply({answer:'Hi',url:'https://evil.test',sourceIds:[],suggestions:[],mood:'happy'},k.sources)).toThrow();
});
