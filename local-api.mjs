import {seed,score,dimensions} from './content.mjs';
const key='attention-island-beta-v1';const id=()=>crypto.randomUUID();
function read(){try{return JSON.parse(localStorage.getItem(key))||{passes:[],reports:[],orders:[]}}catch{return {passes:[],reports:[],orders:[]}}}
function save(s){localStorage.setItem(key,JSON.stringify(s))}
export async function localApi(path,body){const u=new URL(path,'https://beta.invalid/'),s=read(),p=u.pathname;
if(p==='catalog'||p==='/catalog')return {version:2,test:{...seed,price:990,status:'published'},dimensions,demo:true};
if(p==='feedback'||p==='/feedback'){if(!s.passes.some(x=>x.id===body.pass))throw Error('未找到测试记录');if(!['midpoint_reached','continue','pause_selected','pause_reasons','saved_initial'].includes(body.type))throw Error('反馈类型不支持');s.feedback=s.feedback||[];s.feedback.push({pass:body.pass,type:body.type,reasons:body.reasons||[],other:body.other||'',created:new Date().toISOString()});save(s);return {ok:true}}
if(p==='me'||p==='/me')return s;
if(p==='prebuy'||p==='/prebuy'){if(body.branch!=='adult')throw Error('仅供18岁及以上成人');if(body.method&&!['wechat','alipay'].includes(body.method))throw Error('支付方式不支持');let pass=s.passes.find(x=>!x.attempt&&x.version===2);if(!pass){pass={id:id(),branch:'adult',age:'',version:2,attempt:null};s.passes.push(pass);s.orders.push({id:pass.id,amount:990,status:'demo_paid',method:body.method||'wechat',created:new Date().toLocaleString()});save(s)}return {pass:pass.id,demo:true}}
if(p==='access'||p==='/access'){const pass=s.passes.find(x=>x.id===u.searchParams.get('pass'));if(!pass)throw Error('请先进入免费内测');return {...pass,pass:pass.id,content:seed}}
if(p==='submit'||p==='/submit'){const pass=s.passes.find(x=>x.id===body.pass);if(!pass)throw Error('请先进入免费内测');if(pass.attempt)return {id:pass.attempt};const result=score(body.answers);if(!Array.isArray(body.background)||body.background.length!==5||body.background.some(x=>!Number.isInteger(x)||x<0||x>4))throw Error('请完成背景问题');const r={id:id(),version:2,branch:'adult',age:'',goal:body.goal,created:new Date().toLocaleString(),...result,role:result.role===null?null:seed.roles[result.role],paid:true,report:structuredClone(seed.report),background:body.background,price:990,title:seed.title};pass.attempt=r.id;s.reports.unshift(r);save(s);return {id:r.id}}
if(p==='report'||p==='/report'){const r=s.reports.find(x=>x.id===u.searchParams.get('id'));if(!r)throw Error('报告不在当前浏览器中，请在完成测试的设备上查看');return r}
if(p==='delete-data'||p==='/delete-data'){localStorage.removeItem(key);return {ok:true}}
if(p==='invite'||p==='/invite')throw Error('静态内测版暂不支持跨设备搭子配对，请使用“复制测试链接”邀请朋友');
throw Error('静态内测版不提供此服务');
}
