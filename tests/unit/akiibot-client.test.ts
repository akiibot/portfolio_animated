import {expect,it} from 'vitest';
import {restoreConversation} from '@/components/akiibot/client-state';
it('rejects malformed saved state and executable saved links',()=>{
 expect(restoreConversation('{oops',Date.now())).toBeNull();
 expect(restoreConversation(JSON.stringify({messages:[{id:'a',role:'assistant',text:'hi',sources:[{id:'x',label:'x',href:'javascript:alert(1)'}]}],draft:'',remainingMessages:null}),Date.now())).toBeNull();
 expect(restoreConversation(JSON.stringify({messages:[null],draft:'',remainingMessages:null}),Date.now())).toBeNull();
 expect(restoreConversation(JSON.stringify({messages:[],draft:'Hello',remainingMessages:12}),Date.now())?.draft).toBe('Hello');
});
