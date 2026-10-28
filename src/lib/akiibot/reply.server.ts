import 'server-only';
import { z } from 'zod';
import type { ChatReply, SourceLink } from './types';
export const replySchema=z.object({answer:z.string().trim().min(1).refine(s=>[...s].length<=1800),sourceIds:z.array(z.string().max(80)).max(3),suggestions:z.array(z.string().trim().min(1).refine(s=>[...s].length<=120)).max(3),mood:z.enum(['answering','unsure','happy'])}).strict();
export const modelSchema={type:'object',properties:{answer:{type:'string'},sourceIds:{type:'array',items:{type:'string'},maxItems:3},suggestions:{type:'array',items:{type:'string'},maxItems:3},mood:{type:'string',enum:['answering','unsure','happy']}},required:['answer','sourceIds','suggestions','mood'],additionalProperties:false};
export function validateReply(raw:unknown,sources:ReadonlyMap<string,SourceLink>):Omit<ChatReply,'historyToken'|'remainingMessages'> {
  const parsed=replySchema.parse(raw);
  const links=[...new Set(parsed.sourceIds)].map(id=>{ const s=sources.get(id); if(!s)throw new Error('Unknown source'); return s; });
  return {answer:parsed.answer,sources:links,suggestions:parsed.suggestions,mood:parsed.mood};
}
