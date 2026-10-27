import { describe,it,expect,vi } from 'vitest';
import {createSequenceLoader} from '../../src/lib/sequence-loader';
const flush=()=>new Promise<void>(r=>setImmediate(r));
describe('sequence loader',()=>{
 it('prioritizes the exact frame, limits concurrency, and never fans out all frames',async()=>{
  const pending:{index:number,resolve:(value:HTMLImageElement)=>void}[]=[];
  const loader=createSequenceLoader({frameCount:144,srcFor:i=>String(i),maxConcurrent:2,maxCached:12,loadImage:src=>new Promise(resolve=>pending.push({index:Number(src),resolve})),onFrameReady:vi.fn()});
  loader.request(0,1);await flush();expect(pending.map(p=>p.index)).toEqual([0,1]);
  pending[0].resolve({id:0} as unknown as HTMLImageElement);await flush();expect(pending.length).toBe(3);
  loader.request(140,1);pending[1].resolve({id:1} as unknown as HTMLImageElement);await flush();expect(pending.at(-1)?.index).toBe(140);loader.dispose();
 });
 it('keeps a bounded LRU cache and resolves nearest with lower-index tie break',async()=>{
  const loader=createSequenceLoader({frameCount:144,srcFor:i=>String(i),maxConcurrent:4,maxCached:3,loadImage:async src=>({id:Number(src)}) as unknown as HTMLImageElement,onFrameReady:vi.fn()});
  loader.request(1,0);await flush();expect(loader.getNearest(2)?.index).toBe(1);
  for(let i=10;i<40;i+=5){loader.request(i,0);await flush();}
  expect(loader.inspect().cached).toBeLessThanOrEqual(3);expect(loader.inspect().queued).toBeLessThanOrEqual(12);loader.dispose();
 });
 it('ignores late completion after disposal',async()=>{
  let complete!:(image:HTMLImageElement)=>void;const ready=vi.fn();
  const loader=createSequenceLoader({frameCount:144,srcFor:String,maxConcurrent:1,maxCached:12,loadImage:()=>new Promise(r=>{complete=r}),onFrameReady:ready});
  loader.request(0,0);await flush();loader.dispose();complete({} as HTMLImageElement);await flush();expect(ready).not.toHaveBeenCalled();expect(loader.getNearest(0)).toBeNull();
 });
 it('pauses queued work and resumes the most recent target',async()=>{
  const load=vi.fn(async()=>({}) as HTMLImageElement);const loader=createSequenceLoader({frameCount:144,srcFor:String,maxConcurrent:2,maxCached:12,loadImage:load,onFrameReady:vi.fn()});
  loader.pause();loader.request(80,-1);await flush();expect(load).not.toHaveBeenCalled();loader.resume();await flush();expect(load.mock.calls.length).toBeGreaterThan(0);loader.dispose();
 });
 it('retries a failed frame only once and falls back without endless loading',async()=>{
  vi.useFakeTimers();const load=vi.fn().mockRejectedValue(new Error('missing'));const loader=createSequenceLoader({frameCount:1,srcFor:String,maxConcurrent:1,maxCached:1,loadImage:load,onFrameReady:vi.fn()});
  loader.request(0,0);await vi.advanceTimersByTimeAsync(2000);await vi.advanceTimersByTimeAsync(2000);loader.request(0,0);await vi.advanceTimersByTimeAsync(4000);expect(load).toHaveBeenCalledTimes(2);expect(loader.getNearest(0)).toBeNull();loader.dispose();vi.useRealTimers();
 });
});
