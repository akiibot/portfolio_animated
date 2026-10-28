import { it,expect } from 'vitest';
import { providerPayload } from '@/lib/akiibot/vertex.server';
it('fixes generation bounds, low reasoning, schema and no tools',()=>{
 const p=providerPayload({instruction:'Guide',facts:'Public facts',turns:[{user:'Hi',assistant:'Hello'}],message:'Backend skills?'});
 expect(p.config.maxOutputTokens).toBe(1024);expect(p.config.thinkingConfig?.thinkingLevel).toBe('LOW');expect(p.config.httpOptions?.retryOptions?.attempts).toBe(1);expect(p.config.tools).toBeUndefined();expect(p.contents.map(x=>x.role)).toEqual(['user','model','user']);expect(p.config.responseJsonSchema).toBeTruthy();
});
