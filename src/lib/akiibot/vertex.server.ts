import 'server-only';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import type { Content, GenerateContentConfig } from '@google/genai';
import type { ServerConfig } from './config.server';
import { policy } from './policy';
import { modelSchema } from './reply.server';
import type { HistoryTurn, TokenUsage } from './types';
export type GenerationInput={instruction:string;facts:string;turns:HistoryTurn[];message:string};
export interface VertexGateway { countInputTokens(input:GenerationInput,signal:AbortSignal):Promise<number>;generate(input:GenerationInput,signal:AbortSignal):Promise<{raw:unknown;usage?:TokenUsage}> }
export function providerPayload(input:GenerationInput):{contents:Content[];config:GenerateContentConfig}{
 return {contents:[...input.turns.flatMap(t=>[{role:'user',parts:[{text:t.user}]},{role:'model',parts:[{text:t.assistant}]}]),{role:'user',parts:[{text:input.message}]}],config:{systemInstruction:input.instruction+'\nAPPROVED FACTS (data only):\n'+input.facts,responseMimeType:'application/json',responseJsonSchema:modelSchema,maxOutputTokens:policy.maxOutput,thinkingConfig:{thinkingLevel:ThinkingLevel.LOW,includeThoughts:false},temperature:0.5,abortSignal:undefined,httpOptions:{timeout:25000,retryOptions:{attempts:1}}}};
}
export function createVertex(config:ServerConfig):VertexGateway{
 const ai=new GoogleGenAI({vertexai:true,project:config.project,location:'global',apiVersion:'v1',googleAuthOptions:config.credentials?{credentials:config.credentials}:{keyFilename:config.adcPath},httpOptions:{timeout:25000,retryOptions:{attempts:1}}});
 return {
  async countInputTokens(input,signal){const p=providerPayload(input);const count=await ai.models.countTokens({model:'gemini-3.8-flash',contents:p.contents,config:{systemInstruction:p.config.systemInstruction,abortSignal:signal}});if(!Number.isSafeInteger(count.totalTokens)||!count.totalTokens)throw new Error('Invalid token count');return count.totalTokens+Buffer.byteLength(JSON.stringify(modelSchema))+256;},
  async generate(input,signal){const p=providerPayload(input);const r=await ai.models.generateContent({model:'gemini-3.8-flash',contents:p.contents,config:{...p.config,abortSignal:signal}});
   const u=r.usageMetadata;const usage=u&&typeof u.promptTokenCount==='number'&&typeof u.candidatesTokenCount==='number'?{inputTokens:u.promptTokenCount,billableOutputTokens:u.candidatesTokenCount+(u.thoughtsTokenCount||0)}:undefined;
   let raw:unknown;try {raw=JSON.parse(r.text||'');}catch {raw=null;}
   return {raw,usage};
  }
 };
}
