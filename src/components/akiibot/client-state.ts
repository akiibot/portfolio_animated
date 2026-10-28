import type { DisplayMessage } from '@/lib/akiibot/types';
export type StoredConversation={messages:DisplayMessage[];draft:string;sessionToken?:string;expiresAt?:number;historyToken?:string;remainingMessages:number|null};
export function safeLink(href:unknown):boolean {
 if(typeof href!=='string')return false;
 if(/^\/(?:#[a-z-]+|projects\/[a-z0-9-]+|resume\/[a-zA-Z0-9._-]+\.pdf)$/.test(href))return true;
 try{const u=new URL(href);return u.protocol==='https:'&&['github.com','linkedin.com','www.findmypaw.app','jointly-ai-merge.vercel.app','localrelay-test.vercel.app','notfullyblissful.itch.io'].includes(u.hostname);}catch{return false;}
}
export function validMessages(value:unknown):value is DisplayMessage[]{
 if(!Array.isArray(value)||value.length>30)return false;
 return value.every(m=>m&&typeof m==='object'&&typeof m.id==='string'&&m.id.length<=80&&['user','assistant'].includes(m.role)&&typeof m.text==='string'&&[...m.text].length<=1800&&(!m.mood||['answering','unsure','happy'].includes(m.mood))&&(!m.sources||(Array.isArray(m.sources)&&m.sources.length<=3&&m.sources.every((s:{id:unknown;label:unknown;href:unknown})=>s&&typeof s.id==='string'&&typeof s.label==='string'&&s.label.length<=120&&safeLink(s.href))))&&(!m.suggestions||(Array.isArray(m.suggestions)&&m.suggestions.length<=3&&m.suggestions.every((s:unknown)=>typeof s==='string'&&[...s].length<=120))));
}
export function restoreConversation(raw:string,now:number):StoredConversation|null{
 if(raw.length>160000)return null;
 try{const s=JSON.parse(raw);if(!validMessages(s.messages)||typeof s.draft!=='string'||s.draft.length>4800||!(s.remainingMessages===null||(Number.isInteger(s.remainingMessages)&&s.remainingMessages>=0&&s.remainingMessages<=15)))return null;
 if((s.sessionToken!==undefined&&(typeof s.sessionToken!=='string'||s.sessionToken.length>2048))||(s.historyToken!==undefined&&(typeof s.historyToken!=='string'||s.historyToken.length>18000)))return null;
 if(s.expiresAt!==undefined&&(typeof s.expiresAt!=='number'||s.expiresAt<=now))return {messages:[],draft:s.draft,remainingMessages:null};
 return s;
 }catch{return null;}
}
