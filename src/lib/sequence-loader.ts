export type Direction = -1 | 0 | 1;
type Options = {frameCount:number;srcFor:(index:number)=>string;maxConcurrent:number;maxCached:number;loadImage:(src:string)=>Promise<HTMLImageElement>;onFrameReady:(index:number)=>void};
export function createSequenceLoader(options:Options){
 const cache=new Map<number,HTMLImageElement>();const active=new Set<number>();const failures=new Map<number,number>();const retries=new Map<number,ReturnType<typeof setTimeout>>();
 let queue:number[]=[];let desired:number[]=[];let paused=false;let disposed=false;
 const valid=(i:number)=>i>=0&&i<options.frameCount;
 function pump(){
  if(paused||disposed)return;
  while(active.size<options.maxConcurrent&&queue.length){
   const index=queue.shift()!;
   if(cache.has(index)||active.has(index)||(failures.get(index)||0)>=2||retries.has(index))continue;
   active.add(index);
   Promise.resolve().then(()=>options.loadImage(options.srcFor(index))).then(image=>{
    if(disposed)return;
    cache.set(index,image);while(cache.size>options.maxCached)cache.delete(cache.keys().next().value!);
    options.onFrameReady(index);
   }).catch(()=>{
    if(disposed)return;
    const count=(failures.get(index)||0)+1;failures.set(index,count);
    if(count===1)retries.set(index,setTimeout(()=>{retries.delete(index);if(!disposed&&desired.includes(index)){queue.unshift(index);pump();}},2000));
   }).finally(()=>{active.delete(index);pump();});
  }
 }
 return {
  request(index:number,direction:Direction){
   if(disposed||!Number.isFinite(index))return;
   index=Math.min(options.frameCount-1,Math.max(0,Math.floor(index)));
   desired=Array.from(new Set([index,...(direction?[index+direction,index+2*direction,index-direction]:[])])).filter(valid);
   queue=desired.filter(i=>!cache.has(i)&&!active.has(i)).slice(0,12);pump();
  },
  getNearest(index:number){
   if(disposed||!cache.size)return null;
   const key=[...cache.keys()].sort((a,b)=>Math.abs(a-index)-Math.abs(b-index)||a-b)[0];
   const image=cache.get(key)!;cache.delete(key);cache.set(key,image);return {index:key,image};
  },
  pause(){paused=true;},resume(){if(!disposed){paused=false;pump();}},
  dispose(){disposed=true;queue=[];desired=[];cache.clear();retries.forEach(clearTimeout);retries.clear();},
  inspect(){return {cached:cache.size,queued:queue.length,inFlight:active.size};}
 };
}
export type SequenceLoader=ReturnType<typeof createSequenceLoader>;
export function loadSequenceImage(src:string):Promise<HTMLImageElement>{return new Promise((resolve,reject)=>{const image=new Image();image.decoding='async';image.onload=()=>{image.decode().then(()=>resolve(image),reject);};image.onerror=()=>reject(new Error('Frame unavailable'));image.src=src;});}
