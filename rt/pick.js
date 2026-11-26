/* 피킹 지시서 v55 · 2026-11-26 — 루티 관리자 화면에서 북마크로 불러 씀 */
(function(){function pick(){
const API='https://api-prod.flowfix.co.kr/api/v1/admin/orders',CK='flowfix-admin-access-token',VER='v55 · 2026-11-26',MOB='https://hanunpark.github.io/zonescan/pick.html',GAS0='https://script.google.com/macros/s/AKfycby33E3x2WOVkZd_Kh4LSumPMT-KKbNa292E9WNKKTdx40WjCxsVgpSTq2R7oJby6XDF/exec';
const $=s=>document.querySelector(s),esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const LS=(k,v)=>{try{if(v===undefined)return JSON.parse(localStorage.getItem('tcpk_'+k)||'null');if(v===null)localStorage.removeItem('tcpk_'+k);else localStorage.setItem('tcpk_'+k,JSON.stringify(v))}catch(e){return null}};
const pad=n=>String(n).padStart(2,'0'),ymd=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const addD=(s,n)=>{const d=new Date(s+'T00:00:00');d.setDate(d.getDate()+n);return ymd(d)};
const dow=s=>'일월화수목금토'[new Date(s+'T00:00:00').getDay()];
const nowS=()=>{const d=new Date();return ymd(d)+' '+pad(d.getHours())+':'+pad(d.getMinutes())};
const WS={PENDING_RECEIPT:'접수대기',RECEIPT_CONFIRMED:'접수확정',GATHERING_INBOUND_COMPLETED:'집하입고',INBOUND_COMPLETED:'입고완료',DRIVER_OUTBOUND_COMPLETED:'기사출고',WORK_IN_PROGRESS:'작업중',WORK_COMPLETED:'작업완료',RETURN_COMPLETED:'반납완료',CANCELLED:'취소'};
const OKS=['INBOUND_COMPLETED','GATHERING_INBOUND_COMPLETED'],OUTS=['DRIVER_OUTBOUND_COMPLETED','WORK_IN_PROGRESS','WORK_COMPLETED','RETURN_COMPLETED'];
const CEN0=['경기광주FDC','경산FDC','광주FDC','남양주FDC','아산FDC','원주FDC','원주FDC(B2B)','인천FDC','일산FDC','일산FDC(일반설치)','전주FDC','제주FDC','청주FDC','청주FDC(B2B)','화성FDC'];
const zc=(a,b)=>(a||'￿').localeCompare(b||'￿','ko',{numeric:true}),kc=(a,b)=>String(a).localeCompare(String(b),'ko');
function token(){const c=document.cookie.split(';').map(x=>x.trim()).find(x=>x.indexOf(CK+'=')===0);return c?decodeURIComponent(c.slice(CK.length+1)):''}
async function api(path,q){const tk=token();if(!tk)throw new Error('LOGIN');const r=await fetch(API+path+q,{headers:{Authorization:'Bearer '+tk}});
 if(r.status===401||r.status===403)throw new Error('LOGIN');if(!r.ok)throw new Error('서버 응답 '+r.status);return (await r.json()).data||{}}
const S={date:addD(ymd(new Date()),1),center:LS('center')||'일산FDC',rows:[],un:0,out:0,drv:new Set(),off:new Set(),noDup:false,at:'',who:LS('who')||'',busy:false,tab:'make',cur:null,shared:null,gas:''};
const GK0='%%GK%%';S.gas=LS('gas')||(GAS0.indexOf('%%')<0?GAS0:'');S.gk=LS('gk')||(GK0.indexOf('%%')<0?GK0:'');
const jfetch=async(u,o,tries)=>{tries=tries||3;for(let n=0;;n++){let t='',net=false;try{const r=await fetch(u,o);t=await r.text();return JSON.parse(t)}catch(e){net=!t}if(n<tries-1){await new Promise(r=>setTimeout(r,[1200,2500,4000][n]||4000));continue}const er=new Error(net?'통신 상태를 확인해 주세요.':'구글 서버가 잠시 응답하지 않습니다 (서버 오류). 잠시 뒤 다시 시도해 주세요.');er.srv=!net;throw er}};
async function gget(q){const j=await jfetch(S.gas+'?'+q+'&t='+encodeURIComponent(S.gk),{redirect:'follow'});if(!j.ok)throw new Error(j.err||'공유 저장소 오류');return j}
async function gpost(b){b.t=S.gk;const safe=b.a==='iss_set'||(b.a==='trk_set'&&!b.info)||b.a==='check';const idem=safe||b.a==='link'&&b.reuse;for(let n=0;;n++){let j;try{j=await jfetch(S.gas,{method:'POST',body:JSON.stringify(b),redirect:'follow'},idem?(b.a==='link'?5:3):1)}catch(e){throw new Error(e.srv?'구글 서버가 잠시 응답하지 않아 저장하지 못했을 수 있습니다. 잠시 뒤 새로고침으로 확인해 주세요.':'통신 실패 — 저장되지 않았을 수 있습니다. 새로고침으로 확인해 주세요.')}if(j.busy&&safe&&n<1){await new Promise(r=>setTimeout(r,1500));continue}if(!j.ok)throw new Error(j.err||'공유 저장소 오류');return j}}

document.head.insertAdjacentHTML('beforeend',`<meta name="viewport" content="width=device-width,initial-scale=1"><style>
*{box-sizing:border-box}[hidden]{display:none!important}body{margin:0;background:#eef1f5;color:#111;font:14px/1.5 "Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",sans-serif}
.bar{position:sticky;top:0;z-index:5;background:#10223a;color:#fff;display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;padding:10px 16px}
.bar b{font-size:16px}.ver{font-size:11px;opacity:.7}.bar label,.bar2 label{display:flex;gap:6px;align-items:center}
input,select,button{font:inherit;height:34px;border-radius:6px;border:1px solid #c5ccd6;padding:0 8px;background:#fff;color:#111}
input[type=checkbox]{width:16px;height:16px}button{cursor:pointer}button.pri{background:#ff7a1a;border-color:#ff7a1a;color:#fff;font-weight:700}
.tabs{display:inline-flex;border:1px solid #ffffff55;border-radius:7px;overflow:hidden}.tabs button{border:0;border-radius:0;background:transparent;color:#fff}.tabs button.on{background:#fff;color:#10223a;font-weight:700}
.bar2{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;padding:10px 16px;background:#fff;border-bottom:1px solid #d9e1ea}
details{position:relative}summary{cursor:pointer;height:34px;line-height:32px;border:1px solid #c5ccd6;border-radius:6px;padding:0 10px;list-style:none;background:#fff}
details>div{position:absolute;z-index:6;top:38px;left:0;background:#fff;border:1px solid #c5ccd6;border-radius:8px;padding:8px 10px;min-width:220px;max-height:360px;overflow:auto;box-shadow:0 6px 20px #0002}
details label{padding:3px 0;white-space:nowrap}
.lk{background:none;border:0;color:#2a6fb0;text-decoration:underline;height:auto;padding:0 4px}
#sum{padding:10px 16px 0;display:flex;flex-wrap:wrap;gap:6px 18px}#sum b{font-size:17px}.mu{color:#666}
#dup{margin:10px 16px 0;padding:10px 14px;border-radius:8px;background:#fff1e6;border:1px solid #ff7a1a;color:#9a3412;font-weight:600}
#msg{margin:40px auto;max-width:560px;background:#fff;border-radius:10px;padding:24px;text-align:center}
.wrap{display:grid;grid-template-columns:minmax(0,520px) minmax(0,1fr);gap:16px;padding:12px 16px 40px;align-items:start}
@media(max-width:1100px){.wrap{grid-template-columns:minmax(0,1fr)}}
.panel{background:#fff;border-radius:10px;padding:10px 12px;position:sticky;top:64px;max-height:calc(100vh - 80px);overflow:auto}
.panel h5{font-size:14px;margin:12px 0 4px;display:flex;gap:8px;align-items:center}.panel h5:first-child{margin-top:2px}
.panel table{width:100%;border-collapse:collapse;font-size:12.5px}.panel td{border-bottom:1px solid #eef0f4;padding:5px 4px;vertical-align:top}
.panel tr.offr td{color:#aaa}.panel tr.sel td{background:#fff4ea}.lt{font-size:12px;color:#555;margin-bottom:6px}
.dh{font-weight:800;font-size:15px;margin:14px 0 4px;padding-bottom:3px;border-bottom:2px solid #10223a}.dh:first-of-type{margin-top:0}
.sb{height:28px;font-size:12.5px;padding:0 8px}
.sheet{background:#fff;width:210mm;max-width:100%;margin:0 auto 14px;padding:11mm 11mm 9mm;box-shadow:0 2px 12px #0002;font-size:11.5px}
.sheet h3{font-size:19px;margin:0}.hd{display:flex;justify-content:space-between;gap:12px;border-bottom:2px solid #111;padding-bottom:6px}
.hd small{color:#555}.no{text-align:right;font-size:11px}.no b{display:block;font-size:15px}
.meta{display:grid;grid-template-columns:1.3fr 1fr 1.3fr .8fr;border:1px solid #111;border-top:0;margin-bottom:8px}.meta div{padding:4px 7px;border-right:1px solid #bbb}.meta div:last-child{border:0}
.meta span{display:block;font-size:10px;color:#555}.meta b{font-size:12.5px}.meta .big b{font-size:17px}
.sm{display:flex;flex-wrap:wrap;gap:4px 16px;margin:0 0 6px}.sm b{font-size:14px}.dw{color:#c2410c;font-weight:700}
.sheet h4{font-size:12.5px;margin:12px 0 5px;padding-left:6px;border-left:4px solid #111}
.sheet table{width:100%;border-collapse:collapse}.sheet th{background:#eee;border:1px solid #999;padding:4px 5px;text-align:left;white-space:nowrap;font-size:11px}
.sheet td{border:1px solid #bbb;padding:4px 5px;vertical-align:middle}.sheet thead{display:table-header-group}.sheet tr{break-inside:avoid}
.c{text-align:center}.n{text-align:right;white-space:nowrap}.z{font-weight:700;font-size:12.5px;white-space:nowrap}.g{color:#666;font-size:10.5px}
.bx{display:inline-block;width:11px;height:11px;border:1.3px solid #111;vertical-align:-2px;margin-right:3px}.wb{display:inline-block;white-space:nowrap;margin:1px 7px 1px 0}
.tg{display:inline-block;font-size:10px;font-weight:700;border:1px solid #c2410c;color:#c2410c;border-radius:3px;padding:0 3px;margin:1px 2px 1px 0;white-space:nowrap}.tg.b{border-color:#2a6fb0;color:#2a6fb0}
.drh td{background:#10223a;color:#fff;font-weight:700;font-size:12px}.tot td{font-weight:700;background:#f3f3f3}
.sign{display:grid;grid-template-columns:repeat(3,1fr);border:1px solid #111;margin-top:12px;break-inside:avoid}.sign div{padding:5px 7px 26px;border-right:1px solid #999;font-size:10.5px}.sign div:last-child{border:0}
.ft{display:flex;justify-content:space-between;font-size:9.5px;color:#555;margin-top:6px}
.cp{font-size:11.5px;line-height:1.25;padding:9mm 9mm 8mm}.cp h3{font-size:17px}.cp .hd{padding-bottom:4px}.cp .no{font-size:11px}.cp .no b{font-size:14px}
.cp .meta{grid-template-columns:1.35fr .9fr 1fr 1.3fr .7fr;margin-bottom:5px}.cp .meta div{padding:2px 6px}.cp .meta .big b{font-size:16px}.cp .sm{margin:0 0 4px;font-size:11.5px}.cp .sm b{font-size:13px}
.cp h4{font-size:12px;margin:8px 0 3px}.cp table{table-layout:fixed}.cp th{padding:2px 4px;font-size:10.5px;border:0;border-bottom:1.5px solid #111;background:#e9e9e9}
.cp td{border:0;border-bottom:1px solid #d4d4d4;padding:2px 4px;line-height:1.22;overflow-wrap:anywhere}.cp tr.zb td{background:#f4f4f4}.cp td.z{font-size:12px;background:#fff!important;border-right:1px solid #d4d4d4;vertical-align:top;white-space:normal}
.cp .veh{font-size:12.5px}.cp .sup{font-size:10.5px}
.hd h3 .dk{font-size:12px;font-weight:700;border:1.5px solid #000;border-radius:3px;padding:0 5px;margin-left:4px;vertical-align:2px}
.cl2{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:break-all}.vc{white-space:normal}.vc .veh{white-space:nowrap}.vc .tg{margin:1px 0 1px 3px}.cp .card .ch span{max-width:60%;text-align:right}.cp .pn{font-size:10.8px}.cp .pn .g{font-size:9.5px}.cp .q{font-size:13px;font-weight:800}.cp .wbs{font:11px/1.25 ui-monospace,Menlo,Consolas,monospace}.cp .wbg{display:flex;align-items:flex-start}.cp .wbl{display:grid;grid-template-columns:repeat(3,max-content);column-gap:5px;row-gap:1px}.cp .wbl.f{grid-template-columns:repeat(2,max-content)}.cp .wbs .wb{white-space:nowrap;margin:0}.cp .pre{color:#777;font-size:9px;margin-right:3px;letter-spacing:-.3px;line-height:14px;flex:none}
.cp .wb{margin:0 4px 0 0}.cp .bx{width:10px;height:10px;margin-right:2px}.cp .tg{font-size:9.5px;padding:0 2px;margin:0 0 0 3px;vertical-align:1px}
.cp .tot td{background:#eee;border-top:1.5px solid #111}.cp .cards{display:grid;grid-template-columns:1fr 1fr;gap:6px 10px}.cp .card{break-inside:avoid;border:1px solid #999;border-radius:3px}
.cp .ch{background:#10223a;color:#fff;padding:3px 6px;font-size:11.5px;display:flex;gap:6px;align-items:baseline;flex-wrap:wrap}.cp .ch span{margin-left:auto;font-size:10px;opacity:.85}.cp .card td{font-size:11px}.cp .card .veh{font-size:12px}.cp .cz{font-weight:700;font-size:11px;white-space:nowrap}
.cp .tg.o{background:#c2410c;color:#fff;border-color:#c2410c}.cp .tmpb{display:inline-block;background:#c2410c;color:#fff;border-radius:4px;padding:0 8px;font-size:15px;vertical-align:2px}.cp.tmp .hd{border-bottom:3px double #c2410c}
#who.req{border-color:#d92d20;background:#fff1f0}.lf{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:6px 0 2px;font-size:12.5px}.lf input,.lf select{height:28px;font-size:12.5px}.lf button{height:28px}
.flr{display:flex;flex-wrap:wrap;gap:5px;margin:2px 0 4px}.fl{height:26px;font-size:12px;padding:0 8px;border-radius:999px}.fl.on{background:#2e9e5b;border-color:#2e9e5b;color:#fff}.fl small{opacity:.9}
.tkl{font-size:12.5px;padding:3px 0;border-top:1px dashed #dde2ea}.tkl.cx{opacity:.5;text-decoration:line-through}.bd2{font-size:11px;font-weight:700;background:#10223a;color:#fff;border-radius:999px;padding:0 7px}
.wrap.lw{grid-template-columns:minmax(0,1.5fr) minmax(0,1fr)}.wrap.lw .panel{background:#eef1f6;padding:10px 12px 14px}.pv{position:sticky;top:64px;max-height:calc(100vh - 80px);overflow:auto}.pvz{zoom:.6}
@media(max-width:1100px){.wrap.lw{grid-template-columns:minmax(0,1fr)}.pv{position:static;max-height:none}}
.spin{font-size:11.5px;color:#b45309;font-weight:700}.lchips{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:8px 0 2px;font-size:12.5px}.lchips button{height:28px;border-radius:999px;padding:0 12px;font-size:12.5px}.lchips button.on{background:#10223a;border-color:#10223a;color:#fff}.lchips .mu{margin-left:auto}
.wrap.lw .dh{position:sticky;top:-10px;z-index:2;background:#eef1f6;margin:14px 0 8px;padding:6px 0 4px;font-size:15px}.dh small{font-weight:600;color:#667;font-size:12px;margin-left:4px}
.lc{background:#fff;border:1px solid #d5dbe5;border-left:6px solid #10223a;border-radius:8px;padding:9px 12px 9px 11px;margin:0 0 10px;cursor:pointer;display:grid;grid-template-columns:minmax(0,1fr) auto;column-gap:10px;row-gap:5px;box-shadow:0 1px 2px #0000000d}
.lc:hover{border-color:#8fa0b8;border-left-color:#10223a}.lc.tmp{border-left-color:#e08a00}.lc.tmp:hover{border-left-color:#e08a00}.lc.sel{outline:2px solid #f47a20;outline-offset:1px;background:#fffaf5}
.lc>*{grid-column:1}.lc .lca{grid-column:2;grid-row:1/span 2;display:flex;gap:6px;align-items:flex-start}
.lc1{display:flex;align-items:center;gap:8px;flex-wrap:wrap}.lc1 .ty{font-size:11px;font-weight:800;color:#fff;background:#10223a;border-radius:4px;padding:1px 7px}.lc.tmp .ty{background:#e08a00}.lc1 .no{font-size:15px;letter-spacing:.2px}.lc1 .rn{font-size:12px;color:#556}.lc1 .pco{font-size:11px;font-weight:700;color:#b45309;border:1px solid #e9b877;border-radius:4px;padding:0 5px}.lc1 .qty{margin-left:auto;font-size:13px;white-space:nowrap}.lc1 .qty b{font-size:15px}
.lc2{display:flex;flex-wrap:wrap;gap:2px 0;font-size:12px;color:#445}.lc2>span:not(:last-child)::after{content:'·';margin:0 7px;color:#aab}.lc2 .nw{color:#d92d20;font-style:normal}.lc2 .pg i{display:inline-block;width:46px;height:6px;background:#e3e7ee;border-radius:3px;margin-right:5px;vertical-align:middle;overflow:hidden}.lc2 .pg u{display:block;height:100%;background:#2e9e5b}
.lr{grid-column:1/-1!important;display:grid;grid-template-columns:38px minmax(0,1fr);align-items:start;border-top:1px solid #edf0f4;padding-top:6px}.lr .lb{font-size:11px;font-weight:800;color:#778;padding-top:5px}.lr .flr{margin:0}
.tks{font-size:12.5px;padding-top:3px}.tks .tkl{border:0;background:#f0f5fc;border-radius:6px;padding:4px 8px;margin-bottom:4px;display:flex;flex-wrap:wrap;gap:2px 10px;align-items:center}.bd2.wn{background:#c2410c}
.fl{background:#fff;border:1px solid #c5ccd8;color:#334}.fl.on{font-weight:700}
.okind{display:flex;gap:8px}.okind button{height:auto;padding:8px 16px;border-radius:10px;font-size:15px;font-weight:800;text-align:left;line-height:1.25}.okind button b{font-size:17px;margin-left:4px}.okind button small{display:block;font-size:11.5px;font-weight:500;color:#667}.okind button.on{background:#10223a;border-color:#10223a;color:#fff}.okind button.on small{color:#cfd8e6}
.tk.dv .ty{font-size:11px;font-weight:800;color:#fff;background:#10223a;border-radius:4px;padding:1px 7px}.tk.dv .ty.t{background:#e08a00}.dvs{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.dvs span{background:#f0f5fc;border-radius:6px;padding:3px 9px;font-size:12.5px}
.pg i{display:inline-block;width:60px;height:6px;background:#e3e7ee;border-radius:3px;margin-right:5px;vertical-align:middle;overflow:hidden}.pg u{display:block;height:100%;background:#2e9e5b}.lc1 .pk{font-size:11px;font-weight:800;color:#fff;background:#2e9e5b;border-radius:4px;padding:1px 7px}
.tk .inf span.br{flex-basis:100%}.lk.del{color:#c2410c}.tk .rel{font-size:12.5px;margin-top:4px}.tk .rel .dw{margin-top:2px}.rpn{font-size:12px;font-weight:800;color:#c2410c;margin-top:3px}
.memo{border:2px solid #000;border-radius:4px;padding:4px 8px;margin:0 0 6px;font-size:12px}.memo b{font-size:12.5px}.memo div{white-space:pre-wrap;font-weight:600}.memo .g{font-weight:400}.cp .memo{font-size:11px;padding:3px 7px;margin:0 0 5px}
.cp .ship{border:1.5px solid #10223a;border-radius:4px;padding:3px 7px;margin:0 0 5px;font-size:11px}.cp .sh1{display:flex;flex-wrap:wrap;gap:3px 8px;align-items:center}.cp .sk{font-weight:800;border:1px solid #10223a;border-radius:3px;padding:0 5px}.cp .sk.t{background:#10223a;color:#fff;-webkit-print-color-adjust:exact;print-color-adjust:exact}.cp .sh2{border-top:1px dashed #99a;margin-top:3px;padding-top:2px;line-height:1.45}.cp .tg.k{background:#10223a;color:#fff;border-color:#10223a;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.shx{background:#f0f5fc;border-radius:8px;padding:8px 10px;margin:10px 0;font-size:12.5px}.shx>div{border-top:1px dashed #c5d2e6;margin-top:6px;padding-top:6px}.sho{display:grid;gap:8px;margin:12px 0}.sho button{height:auto;text-align:left;padding:9px 12px;border-radius:9px}.sho button b{font-size:14.5px}.sho button small{display:block;font-size:12px;font-weight:400;opacity:.85}
.fcar{margin:10px 0;font-size:12.5px;max-height:190px;overflow:auto;border:1px solid #dde2ea;border-radius:8px;padding:8px}.fcar label{display:block;padding:3px 0}
.dti{display:inline-flex;align-items:center;gap:4px}.dti select{height:32px}
#mgw{position:fixed;left:0;right:0;bottom:0;top:var(--bh,58px);z-index:5;background:#eef1f5}#mgw iframe{width:100%;height:100%;border:0;display:block}
.wb.kp .kv{display:inline-block;background:#000;color:#fff;padding:0 3px;border-radius:2px;line-height:13px;-webkit-print-color-adjust:exact;print-color-adjust:exact}.wb.kp .kv i{font-style:normal;font-size:8.5px;font-weight:700;letter-spacing:-.3px}.wb.kp .kv b{font-size:12.5px;font-weight:900;letter-spacing:.2px}.tg.kp{background:#000;color:#fff;border-color:#000;-webkit-print-color-adjust:exact;print-color-adjust:exact}
.ttl{display:flex;flex-direction:column;line-height:1.15}.ttl .ver{margin:2px 0 0!important;font-size:10.5px;opacity:.7}
.tk{background:#fff;border-radius:10px;padding:12px 14px;margin:0 0 12px;border-left:6px solid #9aa7b6}.tk.s1{border-color:#ff7a1a}.tk.s2{border-color:#2a6fb0}.tk.s3{border-color:#2e9e5b}.tk.sx{opacity:.55}
.tk h5{margin:0;font-size:15px;display:flex;flex-wrap:wrap;gap:6px 12px;align-items:baseline}.tk .bd{font-size:12px;font-weight:700;border-radius:999px;padding:1px 9px;background:#10223a;color:#fff}
.tk .inf{display:flex;flex-wrap:wrap;gap:2px 16px;font-size:13px;margin:4px 0 8px}.tk .inf b{font-size:14px}
.stp{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0}.stp button{height:auto;min-height:40px;padding:3px 10px;line-height:1.2;text-align:left;font-size:12.5px}.stp button.on{background:#2e9e5b;border-color:#2e9e5b;color:#fff}.stp small{display:block;font-size:11px;opacity:.9}
.tk table{width:100%;border-collapse:collapse;font-size:12.5px;margin-top:6px}.tk td,.tk th{border-bottom:1px solid #e6e9ef;padding:3px 5px;text-align:left}.tk tr.ld td{background:#eaf7ef}
.tkf{display:grid;grid-template-columns:110px 1fr;gap:6px 8px;align-items:center;margin:8px 0}.tkf input{width:100%}
.cp .sign{margin-top:8px}.cp .sign div{padding:3px 6px 18px}
@media print{.cp tr.zb td{-webkit-print-color-adjust:exact;print-color-adjust:exact}.cp .ch,.cp th{-webkit-print-color-adjust:exact;print-color-adjust:exact}}

#mo{position:fixed;inset:0;background:#0008;z-index:20;display:flex;align-items:center;justify-content:center;padding:16px}#mo>div{background:#fff;border-radius:12px;padding:18px;width:min(560px,100%);max-height:92vh;overflow:auto}
#mo h3{margin:0 0 8px}#mo textarea{width:100%;height:96px;font:12px/1.4 monospace;border:1px solid #c5ccd6;border-radius:6px;padding:6px}#qr{display:flex;justify-content:center;margin:10px 0}
@page{size:A4;margin:9mm}
@media print{body{background:#fff}.noprint,#mo{display:none!important}.wrap{display:block;padding:0}.sheet{box-shadow:none;margin:0;padding:0;width:auto}.drh{break-after:avoid}}
</style>`);
/* 겉모양(대시보드와 같은 색·글자 규칙). A4 지시서(.sheet)에는 적용하지 않음 — 인쇄물은 그대로. PC는 컴퓨터 설정 따라 다크 모드 */
document.documentElement.classList.add('pc');
document.head.insertAdjacentHTML('beforeend',`<style id="shell">
:root{--bg:#fff;--sub:#f5f6f9;--ink:#171a26;--ink2:#565b70;--mute:#8b90a3;--line:#e6e8ef;--line2:#c9cde0;--acc:#4b5fe0;--acch:#3f51c9;--soft:#eef0ff;--good:#0a7d3c;--goodbg:#e6f6ec;--warn:#8a5a00;--warnbg:#fff4d6;--crit:#c0302f;--critbg:#fdeaea;--hd:#1b1d33;--hdmu:#aab0cf;--onacc:#fff;--card:#fff}
@media(prefers-color-scheme:dark){html.pc{--bg:#14151d;--sub:#1c1e2a;--ink:#eff0f6;--ink2:#c0c3d4;--mute:#888da3;--line:#2c2f43;--line2:#3a3e57;--acc:#8b9bff;--acch:#a3b0ff;--soft:#23274a;--good:#4cc77e;--goodbg:#143122;--warn:#f5b93a;--warnbg:#3a2e0c;--crit:#f07878;--critbg:#3c1b1b;--hd:#0f1018;--onacc:#10121c;--card:#1a1c27}}
body{background:var(--sub);color:var(--ink);font:13.5px/1.5 -apple-system,"Apple SD Gothic Neo","Pretendard","Noto Sans KR","Malgun Gothic",sans-serif;font-variant-numeric:tabular-nums}
.bar{background:var(--hd);padding:8px 16px;gap:8px 12px}.bar .ver,.ttl .ver{color:var(--hdmu);opacity:1}
input,select,button,summary{border-color:var(--line2);background:var(--bg);color:var(--ink);border-radius:8px}button:hover{border-color:var(--mute)}
button.pri{background:var(--acc);border-color:var(--acc);color:var(--onacc);font-weight:600}button.pri:hover{background:var(--acch)}
.tabs{border:0;gap:2px;border-radius:0}.tabs button{color:var(--hdmu);border-radius:8px!important;height:32px;padding:0 12px;font-weight:500}.tabs button:hover{color:#fff}.tabs button.on{background:#2f3354;color:#fff;font-weight:600}.vh b{white-space:nowrap}.ad{white-space:nowrap;font-size:13px;color:var(--ink2,#565b70)}.tabs button.aux{margin-left:12px;position:relative;color:#d9b36a}.tabs button.aux::before{content:'';position:absolute;left:-7px;top:8px;bottom:8px;width:1px;background:#ffffff33}.tabs button.aux.on{background:#5a3f0a;color:#ffd98a}
.bar2{background:var(--bg);border-bottom:1px solid var(--line)}details>div{background:var(--bg);border-color:var(--line2)}
.lk{color:var(--acc)}.lk.del{color:var(--crit)}.mu{color:var(--ink2)}#sum{color:var(--ink)}
#dup{background:var(--warnbg);border-color:var(--warn);color:var(--warn)}#msg{background:var(--card);border:1px solid var(--line)}
.panel{background:var(--card);border:1px solid var(--line)}.panel td{border-bottom-color:var(--line)}.panel tr.sel td{background:var(--soft)}.panel tr.offr td{color:var(--mute)}.lt{color:var(--ink2)}
.dh{border-bottom:1px solid var(--line2);font-weight:700}.fl{background:var(--bg);border-color:var(--line2);color:var(--ink)}.fl.on{background:var(--goodbg);border-color:var(--good);color:var(--good)}
.lchips button.on,.okind button.on{background:var(--soft);border-color:var(--acc);color:var(--acc)}.okind button.on small{color:var(--acc)}
.shx,.tks .tkl,.dvs span{background:var(--sub);border:1px solid var(--line)}.fcar{border-color:var(--line)}.spin{color:var(--warn)}
#mo{background:rgba(15,17,30,.55)}#mo>div{background:var(--bg);color:var(--ink);box-shadow:0 10px 40px rgba(0,0,0,.3)}#mo textarea{border-color:var(--line2);background:var(--bg)}
#mgw{background:var(--sub)}#who.req{border-color:var(--crit);background:var(--critbg)}
.wrap.lw .panel{background:var(--sub)}.sheet{color:#111}
</style>`);
document.title='피킹 지시서';
document.body.innerHTML=`<div class="bar noprint"><div class="ttl"><b>피킹 지시서</b><span class="ver">${VER}</span></div><div class="tabs"><button data-t="make">지시서 만들기</button><button data-t="list">지시서 목록 <span id="lc"></span></button><button data-t="trk">출고 관리</button><button data-t="ntc">공지 <span id="nc"></span></button><button data-t="tmp" class="aux" title="기사가 정해지지 않아 정식 발행이 안 될 때만 쓰는 임시 작업">기사 미확정 임시 피킹</button></div><button id="gs" style="height:30px;font-size:12.5px"></button>
<span id="mk" style="display:contents"><label>출고예정일(약속일) <input type="date" id="dt"></label><label>거점 <select id="cen"></select></label><button id="go" class="pri">조회</button><span id="st" style="font-size:13px"></span></span></div>
<div class="bar2 noprint" id="opt" hidden><details id="sd"><summary>거래처 <span id="sn"></span></summary><div id="sups"></div></details><details id="dd"><summary>기사(메인기사) <span id="dn"></span></summary><div id="drvs"></div></details>
<label><input type="checkbox" id="nd"> 이미 발행한 운송장 빼기</label><label>발행자 <input id="who" size="7" placeholder="필수"></label><label>피킹 마감 <select id="due">${Array.from({length:48},(_,i)=>pad(i>>1)+':'+(i%2?'30':'00')).map(x=>`<option${x==='08:00'?' selected':''}>${x}</option>`).join('')}</select></label>
<button id="tp" class="pri" hidden>임시 지시서 인쇄</button><button id="ts" class="pri" hidden>임시 전달하기 (링크)</button><button id="pr" class="pri">발행 + 인쇄</button><button id="iss">발행만</button><button id="csv">엑셀(CSV)</button><span id="hi" style="font-size:12.5px;color:#555"></span></div>
<div id="sum" class="noprint"></div><div id="dup" class="noprint" hidden></div>
<div id="main"></div>`;
$('#dt').value=S.date;$('#who').value=S.who;$('#who').classList.toggle('req',!S.who);
const fillCen=L=>{$('#cen').innerHTML=L.map(c=>`<option${c===S.center?' selected':''}>${esc(c)}</option>`).join('')};
fillCen(CEN0);
api('/filter-options','?driverUnassignedOnly=false').then(d=>{const L=(d.centerName||[]).map(x=>typeof x==='string'?x:String(x&&(x.name||x.value)||'')).filter(Boolean);if(L.length)fillCen(L)}).catch(()=>{});

function cls(r){const w=r.waybillStatus,o=r.orderStatus;
 if(w==='CANCELLED'||o==='CANCELLED')return 'cx';
 if(r.driverOutboundCompletedDate||OUTS.indexOf(w)>=0)return 'out';
 if(r.cancelRequestedByType)return 'creq';
 if(OKS.indexOf(w)>=0||(w==='RECEIPT_CONFIRMED'&&atC(r)))return 'ok';return 'noinv'}
const atC=r=>String(r.inventoryLocation||'').replace(/^FDC\s*/,'').trim()===(r.centerName||S.center);
/* 보관품 판정 — 루티 화면의 '판매지점' 칸 = API salesBranch (2026-11-25 확인, 그리드 열 정의 accessorKey). 값이 "보관품"이면 보관품 재출고로 보고 운송장번호(외부)를 반전 표기. 공급처(purchaseSupplierName)는 더 이상 보지 않음 */
function isKeep(r){return typeof r.salesBranch==='string'&&r.salesBranch.replace(/\s/g,'')==='보관품'} // 2026-11-25 규칙 변경: 루티 '판매지점'(salesBranch) = "보관품" 이면 운송장번호(외부) 표기 (이전: 공급처 purchaseSupplierName = '보관품 출고')
function slim(r){const m=r.orderSpecificationMetadata||{},md=r.mainDriver&&r.mainDriver.name||'';
 /* 판매지점이 '보관품'이면 보관품 재출고 — 표기는 운송장번호(외부), 색 반전 */
 return{wb:String(r.waybillNumber||''),kp:isKeep(r),xw:String(r.externalWaybillNumber||''),on:r.orderNumber||'',veh:m.vehicleNumber||r.recipientName||'',model:m.vehicleModel||'',sup:r.supplierName||'',pn:r.productName||'',sku:r.sku||'',zone:r.zoneCode||'',
  drv:md,ad:String(r.orderAppointedDate||'').slice(0,10),cen:r.centerName||'',sub:r.hasSubDriver==='Y',ws:r.waybillStatus||'',k:cls(r),ri:r.waybillStatus==='RECEIPT_CONFIRMED'}}
const hk=()=>'h_'+S.center+'_'+S.date,histL=()=>LS(hk())||[];
/* 취소한 지시서는 중복 확인에서 뺀다 */
const CX=new Set();function cxOk(h){const no=h&&h.M&&h.M.no;return !(no&&CX.has(no))&&!(h&&h.fl&&h.fl.cancel)}
function hist(){const L=histL().filter(cxOk);if(!S.gas||!S.shared)return L;S.shared.forEach(x=>{if((x.fl||{}).cancel&&x.M)CX.add(x.M.no)});const sh=S.shared.filter(x=>!(x.fl||{}).cancel).map(x=>({n:x.n,at:x.at,who:x.who,items:x.items,M:x.M,shared:1})),ns=new Set(sh.map(x=>x.M&&x.M.no));return sh.concat(L.filter(h=>!h.shared&&!(h.M&&ns.has(h.M.no))))}
function dupMap(){if(S.tmp)return S.tmpD||new Map();const M=new Map();hist().forEach(h=>h.items.forEach(w=>{if(!M.has(w))M.set(w,[]);M.get(w).push((h.M&&h.M.tmp?'임시'+h.n:h.n))}));return M}
function allIssued(){const L=[];try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.indexOf('tcpk_h_')===0){const a=JSON.parse(localStorage.getItem(k)||'[]');a.forEach((h,j)=>L.push({key:k.slice(5),idx:j,h}))}}}catch(e){}return L}
function prune(){const lim=addD(ymd(new Date()),-120);try{const ks=[];for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k&&k.indexOf('tcpk_h_')===0&&k.slice(-10)<lim)ks.push(k)}ks.forEach(k=>localStorage.removeItem(k))}catch(e){}}
prune();
const lcnt=()=>{$('#lc').textContent='('+allIssued().length+')'};lcnt();

async function load(){if(S.busy)return;S.busy=true;S.date=$('#dt').value;S.center=$('#cen').value;LS('center',S.center);$('#st').textContent='불러오는 중…';
 try{const q='?driverUnassignedOnly=false&from='+S.date+'&to='+S.date+'&dateType=orderAppointedDate&centerNames='+encodeURIComponent(S.center)+'&size=1000';
  let p=1,tp=1;const R=[];let un=0,out=0;
  do{if(p>1)await new Promise(z=>setTimeout(z,300));const d=await api('',q+'&page='+p);tp=Math.min(d.totalPages||1,20);
   for(const it of d.items||[]){if(it.serviceMethod!=='교체출고'||(it.centerName&&it.centerName!==S.center))continue;const x=slim(it);
    if(x.k==='cx')continue;if(x.k==='out'){out++;continue}if(!x.drv){un++;continue}R.push(x)}p++}while(p<=tp);
  S.rows=R;S.un=un;S.out=out;S.at=nowS();S.off=new Set();S.drv=new Set(R.map(r=>r.drv));S.sup=new Set(R.map(r=>r.sup));S.shared=null;
  if(S.gas){try{S.shared=(await gget('a=list&c='+encodeURIComponent(S.center)+'&from='+S.date+'&to='+S.date)).items}catch(e){S.shared=null;$('#st').textContent='공유 저장소 연결 실패 — 이 PC 기록만으로 중복 확인'}}
  $('#st').textContent=($('#st').textContent.indexOf('실패')>0?$('#st').textContent+' · ':'')+'조회 '+S.at;$('#opt').hidden=false;drvBox();render()}
 catch(e){$('#st').textContent='';$('#main').innerHTML='<div id="msg">'+(e.message==='LOGIN'?'루티 로그인이 만료되었습니다. 루티 화면에서 다시 로그인한 뒤 북마크를 다시 눌러주세요.':'불러오지 못했습니다: '+esc(e.message))+'</div>'}
 S.busy=false}
function boxes(){const mk=(id,key,nm,unit)=>{const C={};S.rows.filter(r=>key==='drv'?S.sup.has(r.sup):true).forEach(r=>C[r[key]]=(C[r[key]]||0)+1);const L=Object.keys(C).sort(kc),cur=S[key];
  $(id).innerHTML=`<label><input type="checkbox" data-all${L.every(v=>cur.has(v))?' checked':''}> <b>전체</b></label>`+L.map(v=>`<label><input type="checkbox" value="${esc(v)}"${cur.has(v)?' checked':''}> ${esc(nm(v))} <span class="g">${C[v]}${unit}</span></label>`).join('')};
 mk('#sups','sup',v=>v||'(거래처 없음)','본');mk('#drvs','drv',v=>v||'미배정','본');lab()}
const drvBox=boxes;
function lab(){const t=(id,sid,key,u)=>{const n=$(id).querySelectorAll('input[value]').length,k=[...$(id).querySelectorAll('input[value]')].filter(x=>x.checked).length;$(sid).textContent=k===n?'전체 '+n+u:k+u+' 선택'};t('#drvs','#dn','drv','명');t('#sups','#sn','sup','곳')}
['#drvs','#sups'].forEach(id=>$(id).addEventListener('change',e=>{const key=id==='#drvs'?'drv':'sup',i=e.target,all=[...$(id).querySelectorAll('input[value]')];
 if(i.hasAttribute('data-all'))all.forEach(x=>x.checked=i.checked);all.forEach(x=>x.checked?S[key].add(x.value):S[key].delete(x.value));
 $(id).querySelector('[data-all]').checked=all.every(x=>x.checked);if(key==='sup')boxes();else lab();render()}));

function view(){const H=S.tmp?[]:hist(),D=dupMap(),no=H.filter(h=>!(h.M&&h.M.tmp)).reduce((m,h)=>Math.max(m,h.n||0),0)+1;
 const vis=S.rows.filter(r=>S.drv.has(r.drv)&&S.sup.has(r.sup)),sel=vis.filter(r=>!S.off.has(r.on)&&!(S.noDup&&D.has(r.wb)));
 const ok=sel.filter(r=>r.k==='ok'),ex=sel.filter(r=>r.k!=='ok');
 return{H,D,no,vis,ok,ex,dupN:ok.filter(r=>D.has(r.wb)).length}}
const NO=(c,d,no)=>'PK-'+d.replace(/-/g,'')+'-'+c.replace(/FDC.*/,'')+'-'+pad(no);
function model(V){const G=new Map();
 V.ok.forEach(r=>{const key=r.on+'|'+r.zone+'|'+r.pn+'|'+r.ad+'|'+(r.ot||'')+'|'+(r.kp?'K':'');let g=G.get(key);if(!g)G.set(key,g={zone:r.zone,veh:r.veh,model:r.model,sup:r.sup,pn:r.pn,drv:r.drv,sub:r.sub,ad:r.ad,ot:r.ot||'',on:r.on,w:[],dup:[],ri:0,kp:r.kp?1:0,xw:{}});if(r.kp)g.xw[r.wb]=r.xw||'';g.w.push(r.wb);if(r.ri)g.ri++;(V.D.get(r.wb)||[]).forEach(n=>{if(g.dup.indexOf(n)<0)g.dup.push(n)})});
 const lines=[...G.values()].sort((a,b)=>zc(a.zone,b.zone)||kc(a.veh,b.veh)||kc(a.pn,b.pn));lines.forEach(g=>{g.w.sort();g.dup.sort((a,b)=>kc(a,b))});
 const exm=new Map();V.ex.forEach(r=>{const k=[r.k==='noinv'?'미입고':'취소요청',r.drv,r.sup,r.veh,r.pn,WS[r.ws]||r.ws].join('|');exm.set(k,(exm.get(k)||0)+1)});
 const allD=[...new Set(S.rows.filter(r=>S.sup.has(r.sup)).map(r=>r.drv))].every(d=>S.drv.has(d)),allS=new Set(S.rows.map(r=>r.sup)).size===S.sup.size,dset=[...new Set(S.rows.filter(r=>S.sup.has(r.sup)&&S.drv.has(r.drv)).map(r=>r.drv))];
 const ds=[...new Set(V.ok.map(r=>r.ad).filter(Boolean))].sort(),tmpNo=S.tmp?'TMP-'+ymd(new Date()).replace(/-/g,'')+'-'+String(S.center).replace(/FDC.*/,'').split(',')[0]+'-(발행 전)':'';
 return{v:1,tmp:!!S.tmp,tmpInfo:S.tmp?S.tmpInfo:null,dates:ds,no:S.tmp?tmpNo:NO(S.center,S.date,V.no),n:S.tmp?0:V.no,date:S.tmp?(ds[0]||S.date):S.date,center:S.center,at:S.at,issued:'',who:S.who,due:$('#due').value||'',
  drvLabel:allD?'전체 '+dset.filter(Boolean).length+'명'+(dset.includes('')?' + 미배정':''):dset.map(d=>d||'미배정').sort(kc).join(', '),supLabel:allS?'전체':[...S.sup].sort(kc).join(', '),lines,ex:[...exm.entries()].map(([k,n])=>k.split('|').concat([n])),
  dupN:V.dupN,prev:V.H.map(x=>x.n+'차 '+x.at.slice(5)).join(', '),un:S.un,out:S.out}}
const dupTag=a=>a&&a.length?`<span class="tg">중복${a.join('·')}</span>`:'';
const SZ=/(\d{3}\/\d{2}Z?R\d{2})/;
function pnParts(pn,veh){let p=String(pn||'');if(veh)p=p.split(veh).join('').trim();const i=p.indexOf('_'),main=(i>=0?p.slice(0,i):p).trim(),tail=i>=0?p.slice(i+1).trim():'';return{main,tail}}
const pnHtml=(pn,veh)=>{const x=pnParts(pn,veh);return esc(x.main||pn).replace(SZ,'<b>$1</b>')+(x.tail?` <span class="g">${esc(x.tail)}</span>`:'')};
const sizeOf=pn=>{const m=String(pn||'').match(SZ);return m?m[1]:pnParts(pn).main};
let GP='';
/* 보관품 재출고: 운송장번호(외부)를 줄이지 않고 그대로, 검은 바탕 흰 글자 (외부번호가 없으면 루티 번호에 *) */
/* 보관품: '*앞자리~' 작게 + 끝4자리 크게 (예 *6001~7453). 외부번호 없으면 루티 번호로 대체 */
function kpParts(g,w){const x=String((g.xw&&g.xw[w])||w),d=x.replace(/\D/g,''),h=x.indexOf('-')>0?x.slice(0,x.indexOf('-')):d.slice(0,4);return{h:'*'+h+'~',t:d.slice(-4)}}
function kpTxt(g,w){const p=kpParts(g,w);return p.h+p.t}
function wbHtml(w,g){if(g&&g.kp)return `<div class="wbg"><span class="wbl f">${w.map(x=>{const p=kpParts(g,x);return `<span class="wb kp"><span class="bx"></span><span class="kv"><i>${esc(p.h)}</i><b>${esc(p.t)}</b></span></span>`}).join('')}</span></div>`;const n=w[0].length,same=w.every(x=>x.length===n&&x.slice(0,-4)===w[0].slice(0,-4))&&n>4;
 return same?`<div class="wbg"><span class="pre">${esc(w[0].slice(GP.length,-4))}</span><span class="wbl">${w.map(x=>`<span class="wb"><span class="bx"></span><b>${esc(x.slice(-4))}</b></span>`).join('')}</span></div>`
  :`<div class="wbg"><span class="wbl f">${w.map(x=>`<span class="wb"><span class="bx"></span>${esc(x.slice(GP.length))}</span>`).join('')}</span></div>`}
const supS=s=>String(s||'').replace(/\s*\(.*?\)\s*/g,' ').replace(/주식회사|유한회사|㈜|\(주\)/g,'').replace(/\s+/g,' ').trim();
/* 차량 대수는 수취인(차량번호) 기준 — 같은 차량에 주문이 여러 건이어도 1대 (2026-11-26) */
const VK=g=>String(g.veh||'').replace(/\s/g,'')||String(g.on||'');
function sheet(M){{const all=M.lines.filter(g=>!g.kp).flatMap(g=>g.w);let p=all[0]||'';for(const w of all)while(p&&w.indexOf(p)!==0)p=p.slice(0,-1);const i=p.indexOf('-');GP=i>0&&all.every(w=>w.length>i+5)?p.slice(0,i+1):''}
 const lines=M.lines,dl=[...new Set(lines.map(g=>g.drv))].sort((a,b)=>a?(b?kc(a,b):-1):1),tot=lines.reduce((s,g)=>s+g.w.length,0),cars=new Set(lines.map(VK)).size,zn=new Set(lines.map(g=>g.zone).filter(Boolean)).size;
 const dn=d=>d||'미배정',ml=(M.dates||[]).length>1;
 let h=`<div class="sheet cp${M.tmp?' tmp':''}"><div class="hd"><div><h3>${M.tmp?'<span class="tmpb">임시</span> ':''}${M.title?esc(M.title)+' <span class="dk">피킹 지시서</span>':'피킹 지시서'}${M.tmp?' <span style="font-size:13px;font-weight:600">— 루티 화면 체크건 · 기사 배정 전</span>':''}</h3><small>${M.tmp?'루티 화면 체크건 · 기사 배정 전 포함':'기사 배정분'} · 입고완료 + 접수확정(재고위치=거점) · 조회 ${esc(M.at)} · ${M.issued?'발행 '+esc(M.issued):'미발행 미리보기'}${M.who?' · '+esc(M.who):''}</small></div><div class="no">${esc(M.no)}<b>${M.tmp?(M.issued?'임시 '+M.n+'차':'임시 (발행 전)'):M.n+'차'+(M.issued?'':' (발행 전)')}</b></div></div>
 <div class="meta"><div class="big"><span>출고예정일 (약속일)</span><b>${ml?esc(M.dates[0].slice(5)+' ~ '+M.dates[M.dates.length-1].slice(5))+' <span style="font-size:11px">(여러 날짜)</span>':M.date+' ('+dow(M.date)+')'}</b></div><div><span>거점</span><b>${esc(M.center)}</b></div><div><span>거래처</span><b>${esc(M.supLabel||'전체')}</b></div><div><span>기사 (메인)</span><b>${esc(M.drvLabel)}</b></div><div><span>피킹 마감</span><b>${esc(M.due||'-')}</b></div></div>
 <div class="sm"><span>기사 <b>${dl.filter(Boolean).length}</b>명${dl.includes('')?' + 미배정':''}</span><span>차량 <b>${cars}</b>대</span><span>운송장 <b>${tot}</b>본</span><span>존 <b>${zn}</b>곳</span>${M.dupN?`<span class="dw">⚠ 이전 발행분 ${M.dupN}본 포함 — ${esc(M.prev)}</span>`:''}</div>${shipHtml(M)}${memoHtml(M)}`;
 if(!lines.length)h+='<p>피킹할 대상이 없습니다.</p>';
 else{const span=[];for(let i=0;i<lines.length;){let j=i;while(j<lines.length&&lines[j].zone===lines[i].zone)j++;span[i]=j-i;for(let k=i+1;k<j;k++)span[k]=0;i=j}
  h+=`<h4>① 피킹 동선표 — 존코드 순으로 찾아가 꺼내기 (운송장 꺼내면 □ 체크)${GP?` <span class="g" style="font-weight:400">· 운송장 앞자리 <b>${esc(GP)}</b> 생략 · 회색 = 공통 앞자리, 굵게 = 끝 4자리</span>`:''}</h4><table class="t1"><colgroup><col style="width:4%"><col style="width:10%"><col style="width:13%"><col style="width:7.5%"><col><col style="width:4.5%"><col style="width:10%"><col style="width:24%"></colgroup>
  <thead><tr><th class="c">No</th><th>존코드</th><th>차량번호 · 차종</th><th>업체</th><th>제품명</th><th class="n">수량</th><th>메인기사</th><th>운송장</th></tr></thead><tbody>
  ${lines.map((g,i)=>`<tr class="${i%2?'zb':''}"><td class="c g">${i+1}</td>${span[i]?`<td class="z"${span[i]>1?` rowspan="${span[i]}"`:''}>${esc(g.zone||'존 미지정')}</td>`:''}<td><b class="veh">${esc(g.veh)}</b>${tkTag(M,g.on)}${g.model?` <span class="g">${esc(g.model)}</span>`:''}${ml&&g.ad?` <span class="tg">${esc(g.ad.slice(5))}</span>`:''}</td><td class="sup"><span class="cl2">${esc(supS(g.sup))}</span></td><td class="pn">${pnHtml(g.pn,g.veh)}${g.kp?' <span class="tg kp">보관품 재출고</span>':''}${g.ot?`<span class="tg o">${esc(g.ot)}</span>`:''}${dupTag(g.dup)}${g.ri?'<span class="tg b">접수확정</span>':''}</td><td class="n q">${g.w.length}</td><td class="vc"><b>${esc(dn(g.drv))}</b>${g.sub?'<span class="tg b">서브Y</span>':''}</td><td class="wbs">${wbHtml(g.w,g)}</td></tr>`).join('')}
  <tr class="tot"><td colspan="5">합계 · 차량 ${cars}대 · 기사 ${dl.length}명</td><td class="n">${tot}</td><td colspan="2"></td></tr></tbody></table>
  <h4>② 기사별 · 제품별 수량 — 꺼낸 제품을 기사별로 모으기 (모으면 □ 체크)</h4><div class="cards">
  ${dl.map(d=>{const L=lines.filter(g=>g.drv===d).sort((a,b)=>kc(a.veh,b.veh)||zc(a.zone,b.zone)),n=L.reduce((s,g)=>s+g.w.length,0),sup=[...new Set(L.map(g=>supS(g.sup)))];
   return `<div class="card"><div class="ch"><b>${esc(dn(d))}</b> 차량 ${new Set(L.map(VK)).size}대 · <b>${n}본</b><span>${esc(sup.map(s=>s+' '+L.filter(g=>supS(g.sup)===s).reduce((a,g)=>a+g.w.length,0)).join(' · '))}</span></div><table><colgroup><col style="width:7%"><col style="width:31%"><col style="width:18%"><col style="width:19%"><col style="width:17%"><col style="width:8%"></colgroup><tbody>
   ${(()=>{const m=new Map();L.forEach(g=>{const k=VK(g)+'|'+supS(g.sup)+'|'+sizeOf(g.pn)+'|'+(g.ot||'').split('·')[0];let x=m.get(k);if(!x)m.set(k,x={on:g.on,veh:g.veh,sup:g.sup,pn:g.pn,sub:g.sub,ot:g.ot,zs:[],w:[]});if(x.zs.indexOf(g.zone||'-')<0)x.zs.push(g.zone||'-');x.w=x.w.concat(g.w);if(g.sub)x.sub=true});return [...m.values()].map(x=>(x.zone=x.zs.join(', '),x.multi=x.zs.length>1,x))})().map((g,i)=>`<tr class="${i%2?'zb':''}"><td class="c" style="width:18px"><span class="bx"></span></td><td class="vc"><b class="veh">${esc(g.veh)}</b>${tkTag(M,g.on)}${g.sub?'<span class="tg b">서브</span>':''}${g.ot?'<span class="tg o">'+esc(g.ot.split('·')[0])+'</span>':''}</td><td class="g"><span class="cl2">${esc(supS(g.sup))}</span></td><td><b>${esc(sizeOf(g.pn))}</b></td><td class="cz"${g.multi?' style="white-space:normal"':''}>${esc(g.zone||'-')}</td><td class="n q">${g.w.length}</td></tr>`).join('')}</tbody></table></div>`}).join('')}</div>`}
 if(M.ex&&M.ex.length)h+=`<h4>예외 — 배정됐지만 꺼낼 수 없는 건 (재고위치가 이 거점이 아님 등)</h4><table class="t3"><thead><tr><th>구분</th><th>메인기사</th><th>업체</th><th>차량번호</th><th>제품명</th><th>운송장상태</th><th class="n">본</th></tr></thead><tbody>${M.ex.map(x=>`<tr><td class="dw">${esc(x[0])}</td><td>${esc(x[1])}</td><td>${esc(supS(x[2]))}</td><td><b>${esc(x[3])}</b></td><td>${pnHtml(x[4],x[3])}</td><td>${esc(x[5])}</td><td class="n">${x[6]}</td></tr>`).join('')}</tbody></table>`;
 h+=`<p class="g" style="margin:6px 0 0">${M.tmp?`루티 화면 체크 ${M.tmpInfo.badge}건 중 — 교체출고 외 작업유형 ${M.tmpInfo.other}건(교체회수 ${M.tmpInfo.rec}건 포함) 제외 · 운송장 없는 접수대기 ${M.tmpInfo.noWb}건 제외 · 취소 ${M.tmpInfo.cx}건 제외 · <b>출고건 ${M.tmpInfo.out}본 · 미입고 ${M.tmpInfo.ni||0}본 · 취소요청 ${M.tmpInfo.cq||0}본 포함(별도 표기)</b> · 기사는 배정 전이라 바뀔 수 있음`:`미배정 ${M.un}본은 피킹하지 않음 · 이미 기사출고 ${M.out}본 제외`}</p><div class="sign"><div>피킹자 · 시각</div><div>검수자 · 시각</div><div>인수기사 · 시각</div></div><div class="ft"><span>${esc(M.no)} · ${M.tmp?'임시':M.n+'차'} · ${VER}</span><span>${esc(M.center)} · 출고예정일 ${M.date}</span></div></div>`;
 return h}
function list(V){const by=new Map();V.vis.forEach(r=>{if(!by.has(r.drv))by.set(r.drv,new Map());const m=by.get(r.drv);if(!m.has(r.on))m.set(r.on,[]);m.get(r.on).push(r)});
 let h='<div class="lt">발행할 차량을 고르세요. 체크를 풀면 지시서에서 빠집니다.</div>';
 [...by.keys()].sort(kc).forEach(d=>{const m=by.get(d),ons=[...m.keys()],on=ons.filter(o=>!S.off.has(o)).length;
  h+=`<h5><input type="checkbox" data-d="${esc(d)}"${on===ons.length?' checked':''}> ${esc(d||'미배정')} <span class="g">${ons.length}대 · ${[...m.values()].reduce((s,a)=>s+a.length,0)}본</span></h5><table>`;
  const ad0=o=>m.get(o).map(r=>r.ad||'9999').sort()[0];ons.sort((a,b)=>(S.tmp?kc(ad0(a),ad0(b)):0)||zc(m.get(a)[0].zone,m.get(b)[0].zone)).forEach(o=>{const a=m.get(o),z=[...new Set(a.map(r=>r.zone||'-'))].join(', '),ni=a.filter(r=>r.k!=='ok').length,du=a.filter(r=>V.D.has(r.wb)).length;
   /* 임시 피킹: 존코드는 지시서에 있으므로 목록에서는 빼고, 수량 오른쪽에 약속일만 */
   const ads=[...new Set(a.map(r=>r.ad).filter(Boolean))].sort(),adH=S.tmp?`<td class="ad">${ads.map(d=>esc(d.slice(5).replace('-','/'))+' ('+dow(d)+')').join('<br>')||'-'}</td>`:'';
   h+=`<tr class="${S.off.has(o)?'offr':''}"><td style="width:22px"><input type="checkbox" data-o="${esc(o)}"${S.off.has(o)?'':' checked'}></td><td class="vh"><b>${esc(a[0].veh)}</b><br><span class="g">${esc(a[0].sup)}</span></td>${S.tmp?'':`<td class="z" style="font-size:12px">${esc(z)}</td>`}<td>${esc(a[0].pn)}${a.some(r=>r.pn!==a[0].pn)?' 외':''}</td><td class="n">${a.length}본</td>${adH}<td>${a.some(r=>r.sub)?'<span class="tg b">서브 Y</span>':''}${du?`<span class="tg">중복 ${du}</span>`:''}${ni?`<span class="tg">${a.find(r=>r.k!=='ok').k==='creq'?'취소요청':'미입고'} ${ni}</span>`:''}</td></tr>`});
  h+='</table>'});
 return h}
function render(){if(S.tab==='list')return renderList();if(!S.at)return;const V=view(),M=model(V),cars=new Set(V.ok.map(r=>String(r.veh||'').replace(/\s/g,'')||r.on)).size;
 if(S.tmp){const I=S.tmpInfo,dn=V.ok.filter(r=>V.D.has(r.wb)).length;$('#sum').innerHTML=`<span>임시 대상 <b>${V.ok.length}</b>본 · 차량 <b>${cars}</b>대</span><span class="mu">루티 체크 ${I.badge}건 · 교체회수 등 ${I.other}건 제외 · 접수대기(운송장 없음) ${I.noWb}건 제외 · 출고건 ${I.out}본 · 미입고 ${I.ni}본 · 취소요청 ${I.cq}본 포함(별도 표기) · 읽은 시각 ${esc(S.at)}</span>${V.ex.length?`<span class="dw">꺼낼 수 없는 건 ${V.ex.length}본</span>`:''}`;
  const d=$('#dup');d.hidden=!dn;if(dn)d.innerHTML=`⚠ 이 중 ${dn}본은 이미 발행된 지시서(정식·임시)에 들어 있습니다 — ${S.noDup?'지금은 빼고 발행합니다.':'지시서에 "중복"으로 표기됩니다.'}`;$('#hi').innerHTML='임시 지시서도 발행하면 지시서 목록·중복 기록에 남습니다 <button class="lk" data-goto="list">목록 보기</button>';
  const sc=($('#list')||{}).scrollTop||0;$('#main').innerHTML=`<div class="wrap"><div id="list" class="panel noprint">${list(V)}</div><div>${sheet(M)}</div></div>`;$('#list').scrollTop=sc;return}
 $('#sum').innerHTML=`<span>지시 대상 <b>${V.ok.length}</b>본 · 차량 <b>${cars}</b>대</span><span class="mu">배정 전체 ${S.rows.length}본 · 미배정 ${S.un}본 피킹 안 함 · 기사출고 ${S.out}본 제외</span>${V.ex.length?`<span class="dw">꺼낼 수 없는 건 ${V.ex.length}본</span>`:''}`;
 const allDup=S.rows.filter(r=>S.drv.has(r.drv)&&!S.off.has(r.on)&&r.k==='ok'&&V.D.has(r.wb)).length;
 const d=$('#dup');d.hidden=!allDup;if(allDup)d.innerHTML=`⚠ 선택한 대상 중 ${allDup}본은 이미 발행한 지시서에 들어 있습니다 (${V.H.map(x=>x.n+'차 '+esc(x.at.slice(5))+' · '+x.items.length+'본').join(' / ')}). ${S.noDup?'지금은 빼고 발행합니다.':'지시서에 "중복"으로 표기됩니다.'}`;
 $('#hi').innerHTML=V.H.length?`이 날짜·거점 발행 ${V.H.length}건 <button class="lk" data-goto="list">목록 보기</button>`:'아직 발행 기록 없음';
 const sc=($('#list')||{}).scrollTop||0;
 $('#main').innerHTML=`<div class="wrap"><div id="list" class="panel noprint">${list(V)}</div><div>${sheet(M)}</div></div>`;$('#list').scrollTop=sc}

function needWho(){const w=$('#who');S.who=w.value.trim();LS('who',S.who);w.classList.toggle('req',!S.who);if(S.who)return true;alert('발행자 이름을 입력해야 발행할 수 있습니다.\n위쪽 [발행자] 칸에 이름을 적어 주세요.');w.focus();return false}
async function issue(){if(!needWho())return null;const V=view();if(!V.ok.length){alert('꺼낼 대상(기사 배정·입고)이 없습니다.');return null}
 if(V.dupN&&!confirm('이미 발행한 운송장 '+V.dupN+'본이 포함되어 있습니다.\n지시서에 "중복"으로 표기해 발행할까요?'))return null;
 const M=model(V),items=V.ok.map(r=>r.wb);M.issued=nowS();let shared=0;
 if(M.tmp){const c0=String(S.center).replace(/FDC.*/,'').split(',')[0];M.n=histL().filter(h=>h.M&&h.M.tmp).length+1;M.no='TMP-'+M.date.replace(/-/g,'')+'-'+c0+'-'+pad(M.n);
  if(S.gas&&!(await gasNew())){alert('임시 지시서를 공유 목록에 올리려면 Apps Script 코드를 v1.3으로 갱신해야 합니다.\n지금은 이 PC에만 기록합니다.');const H0=histL();H0.push({n:M.n,at:M.issued,who:S.who,drv:[...S.drv],items,M,shared:0});LS(hk(),H0);lcnt();tmpMark(items,M.n);return M}}
 if(S.gas){try{const known=(S.shared||[]).map(x=>x.no).concat(LIST.filter(x=>x.src==='srv').map(x=>x.M.no));let r=await gpost({a:'issue',M,items,known});if(r.conflict){const tx=r.conflict.map(c=>c.no+' ('+(c.who||'이름 없음')+') — '+c.n+'본 겹침').join('\n');if(!confirm('조회한 뒤에 다른 사용자가 같은 운송장을 먼저 발행했습니다.\n\n'+tx+'\n\n[확인] 그래도 발행 (중복 표기 없이 나갑니다)\n[취소] 발행하지 않고 다시 조회 — 중복 표기가 반영됩니다')){if(!S.tmp)load();return null}r=await gpost({a:'issue',M,items,known,force:1})}M.no=r.no;M.n=r.n;M.issued=r.issued||M.issued;shared=1;(S.shared=S.shared||[]).push({no:M.no,n:M.n,at:M.issued,who:S.who,items,M})}
  catch(e){alert('공유 저장소에 기록하지 못했습니다 ('+e.message+').\n이 PC에만 기록하고 계속합니다.')}}
 const H=histL();H.push({n:M.n,at:M.issued,who:S.who,drv:[...S.drv],items,M,shared});LS(hk(),H);lcnt();if(M.tmp)tmpMark(items,M.n);return M}
function tmpMark(items,n){const D=S.tmpD||(S.tmpD=new Map());items.forEach(w=>{const a=D.get(w)||[];a.push('임시'+n);D.set(w,a)})}
async function gasNew(){if(S.gv==null){try{S.gv=(await gget('a=ping')).v||''}catch(e){S.gv=''}}return S.gv&&S.gv!=='v1'}
function printM(M){const box=document.createElement('div');box.id='pp';box.innerHTML=sheet(M);
 const st=document.createElement('style');st.textContent='@media print{body>*:not(#pp){display:none!important}#pp .sheet{box-shadow:none;margin:0;padding:0;width:auto}}@media screen{#pp{display:none}}';
 document.body.appendChild(st);document.body.appendChild(box);setTimeout(()=>{window.print();box.remove();st.remove()},80)}

let LIST=[],LNOTE='',LTR=[];const LF={from:ymd(new Date()),to:ymd(new Date()),center:'',type:''};
const FL=[['print','지시서 출력'],['wo','출고 운송장 출력'],['wr','회수 운송장 출력']];
function trkOf(M){const w=new Set(M.lines.flatMap(g=>g.w));return LTR.filter(t=>!t.st.cancel&&t.lines.some(g=>g.w.some(x=>w.has(x)))).map(t=>({t,n:t.lines.reduce((s,g)=>s+g.w.filter(x=>w.has(x)).length,0)}))}
function fmtAt(s){s=String(s||'');if(/^\d{4}-\d\d-\d\d/.test(s))return s.slice(5,16).replace('T',' ');const d=new Date(s);return isNaN(d)?s.slice(0,16):pad(d.getMonth()+1)+'-'+pad(d.getDate())+' '+pad(d.getHours())+':'+pad(d.getMinutes())}
const LC={};let LSEQ=0,PEND=0,LBUSY=false;
function lkey(){return LF.from+'|'+LF.to}
function lcSave(){const c=LC[lkey()];if(c)LS('lcache',c)}
function curId(){const x=S.cur!=null&&LIST[S.cur];return x?x.src+'|'+x.M.no+'|'+(x.key||'')+'|'+(x.idx==null?'':x.idx):null}
function lbuild(srv,trk,err){const loc=allIssued().filter(x=>x.h.M).map(x=>({src:'loc',key:x.key,idx:x.idx,M:x.h.M,at:x.h.at,who:x.h.who,n:x.h.n,cnt:x.h.items.length,shared:x.h.shared,fl:x.h.fl||{}})).filter(x=>x.M.date>=LF.from&&x.M.date<=LF.to);
 const sv=(srv||[]).filter(x=>x.M).map(x=>({src:'srv',raw:x,M:x.M,at:x.M.issued||x.at,who:x.who,n:x.n,cnt:x.cnt,chk:x.checked,fl:x.fl||{}})),ns=new Set(sv.map(x=>x.M.no));
 LTR=trk||[];LIST=sv.concat(loc.filter(x=>!(x.shared&&ns.has(x.M.no))&&!(srv&&x.shared))).sort((a,b)=>kc(b.M.date,a.M.date)||kc(String(b.at),String(a.at)));
 LNOTE=S.gas?(srv?'공유 목록 (모든 PC 발행분)':'⚠ 공유 저장소 연결 실패 ('+esc(err)+') — 이 PC 기록만 표시'):'이 PC 크롬 기록 (공유 설정 전)'}
function lfetch(){return Promise.all([gget('a=list&from='+LF.from+'&to='+LF.to).then(r=>r.items),gget('a=trk_list&from='+addD(LF.from,-7)+'&to='+addD(LF.to,31)).then(r=>r.items).catch(()=>[])]).then(([srv,trk])=>{const c={k:LF.from+'|'+LF.to,srv,trk};return c})}
function flHtml(x,i){return FL.map(([k,l])=>{const f=(x.fl||{})[k];return `<button class="fl${f?' on':''}" data-fl="${i}|${k}" title="${f?esc('체크: '+(f.by||'이름 없음')+' · '+f.at)+' — ':''}누르면 체크/해제">${f?'✓':'☐'} ${l}${f?` <small>${esc(fmtAt(f.at))}</small>`:''}</button>`}).join('')}
function setFlag(x,key,on){const old=x.fl||{};x.fl=Object.assign({},old);if(on)x.fl[key]={at:nowS(),by:S.who};else delete x.fl[key];
 if(x.src!=='srv'){const a=LS(x.key)||[],h=a[x.idx];if(h){h.fl=x.fl;LS(x.key,a)}return Promise.resolve()}
 if(x.raw)x.raw.fl=x.fl;lcSave();PEND++;x.pn=(x.pn||0)+1;
 x.q=(x.q||Promise.resolve()).then(()=>gpost({a:'iss_set',no:x.M.no,key,on:on?1:0,by:S.who})).then(r=>{PEND--;if(!--x.pn){x.fl=r.fl||x.fl;if(x.raw)x.raw.fl=x.fl;lcSave()}}).catch(e=>{PEND--;x.pn--;x.fl=old;if(x.raw)x.raw.fl=old;lcSave();alert('저장 실패 — 체크를 되돌렸습니다: '+e.message+(/unknown action/.test(e.message)?'\nApps Script 코드를 최신본으로 갱신·재배포해 주세요.':''));if(S.tab==='list')renderList(false);if(S.tab==='trk'){if(x.raw)x.raw.fl=old;tdraw()}});return x.q}
function renderList(f){$('#opt').hidden=true;$('#sum').innerHTML='';$('#dup').hidden=true;
 if(f===false){ldraw();return Promise.resolve()}
 const seq=++LSEQ,key=lkey();
 if(!S.gas){lbuild(null,[],'');LBUSY=false;ldraw();return Promise.resolve()}
 let c=LC[key];if(!c){const s=LS('lcache');if(s&&s.k===key)c=LC[key]=s}
 if(c){const id=curId();lbuild(c.srv,c.trk,'');S.cur=id?LIST.findIndex((x,i)=>{S.cur=i;return curId()===id}):null;if(S.cur<0)S.cur=null;LBUSY=true;ldraw()}else $('#main').innerHTML='<div id="msg">공유 목록을 불러오는 중…</div>';
 return lfetch().then(n=>{LC[key]=n;LS('lcache',n);if(seq!==LSEQ||S.tab!=='list'||lkey()!==key)return;LBUSY=false;if(PEND>0){ldraw();return}const id=curId();lbuild(n.srv,n.trk,'');S.cur=null;if(id){const j=LIST.findIndex((x,i)=>{S.cur=i;return curId()===id});S.cur=j<0?null:j}ldraw()}).catch(e=>{if(seq!==LSEQ||S.tab!=='list')return;LBUSY=false;if(c){LNOTE='⚠ 새로 불러오지 못했습니다 ('+esc(e.message)+') — 마지막으로 받은 목록';ldraw()}else{lbuild(null,[],e.message);ldraw()}})}
function ldraw(){if(S.tab!=='list')return;const pn=$('.panel'),sc=pn?pn.scrollTop:0;
 const cs=[...new Set(LIST.map(x=>x.M.center).concat(LF.center?[LF.center]:[]))].sort(kc);
 const note=`<div class="lt">${LNOTE} ${S.gas?'<button class="lk" id="lr">새로고침</button> <button class="lk" id="lwh">관리 페이지 링크</button>':''} ${LBUSY?'<span class="spin">최신 내용 확인 중…</span>':''}</div><div class="lf">거점 <select id="lfc"><option value="">전체</option>${cs.map(c=>`<option${c===LF.center?' selected':''}>${esc(c)}</option>`).join('')}</select> 출고예정일 <input type="date" id="lff" value="${LF.from}">~<input type="date" id="lft" value="${LF.to}"><button id="lfg" class="sb pri">조회</button><button class="sb" data-lq="0">오늘</button><button class="sb" data-lq="1">내일</button><button class="sb" data-lq="14">±14일</button></div>`;
 const bind=()=>{const c=$('#lfc');if(!c)return;c.onchange=()=>{LF.center=c.value;S.cur=null;ldraw()};$('#lfg').onclick=()=>{const a=$('#lff').value,b=$('#lft').value;if(!a||!b||a>b){alert('날짜 구간을 확인해 주세요. (시작일 ≤ 종료일)');return}LF.from=a;LF.to=b;S.cur=null;renderList()};document.querySelectorAll('[data-lq]').forEach(b=>b.onclick=()=>{const t=ymd(new Date()),q=+b.dataset.lq;LF.from=q===14?addD(t,-14):addD(t,q);LF.to=q===14?addD(t,14):addD(t,q);S.cur=null;renderList()});const lr=$('#lr');if(lr)lr.onclick=()=>renderList();const lw=$('#lwh');if(lw)lw.onclick=()=>whLink();
  document.querySelectorAll('[data-lt]').forEach(b=>b.onclick=()=>{LF.type=b.dataset.lt;S.cur=null;ldraw()});const p=$('.panel');if(p)p.scrollTop=sc};
 const inC=x=>!LF.center||x.M.center===LF.center,inT=x=>!LF.type||(LF.type==='tmp')===!!x.M.tmp,B=LIST.filter(inC),VN=B.filter(inT).length;
 const chips=`<div class="lchips">${[['','전체',B.length],['pk','정식',B.filter(x=>!x.M.tmp).length],['tmp','임시',B.filter(x=>x.M.tmp).length]].map(([k,l,c])=>`<button data-lt="${k}" class="${(LF.type||'')===k?'on':''}">${l} <b>${c}</b></button>`).join('')}<span class="mu">지시서 미출력 <b>${B.filter(x=>!(x.fl||{}).print).length}</b> · 용차 없음 <b>${B.filter(x=>!trkOf(x.M).length).length}</b></span></div>`;
 if(!VN){$('#main').innerHTML='<div class="wrap lw"><div class="panel noprint">'+note+chips+'<div class="mu" style="padding:14px 4px">이 조건에 발행한 지시서가 없습니다.</div></div><div></div></div>';bind();return}
 let h='',pd='';
 LIST.forEach((x,i)=>{const M=x.M,d=M.date;if(!inC(x)||!inT(x))return;if(d!==pd){h+=`<div class="dh">출고예정일 ${d} (${dow(d)}) <small>${B.filter(y=>inT(y)&&y.M.date===d).length}건</small></div>`;pd=d}
  const n=M.lines.reduce((s,g)=>s+g.w.length,0),cars=new Set(M.lines.map(VK)).size,sel=S.cur===i,T=trkOf(M),pc=n?Math.round((x.chk||0)/n*100):0;
  h+=`<div class="lc${M.tmp?' tmp':''}${sel?' sel':''}" data-v="${i}">
  <div class="lc1"><span class="ty">${M.tmp?'임시':'정식'}</span><b class="no">${esc(M.no)}</b><span class="rn">${M.n}차</span>${(x.fl||{}).pick||(n&&(x.chk||0)>=n)?'<span class="pk">피킹 완료</span>':''}${x.src==='srv'?'':'<span class="pco" title="공유 저장소에 올라가지 않아 다른 PC에서는 보이지 않습니다">이 PC만</span>'}<span class="qty"><b>${cars}</b>대 · <b>${n}</b>본</span></div>
  <div class="lc2"><span>${esc(M.center)}</span><span>${esc(M.drvLabel)}</span><span>발행 ${esc(fmtAt(x.at))}</span><span>발행자 ${x.who?'<b>'+esc(x.who)+'</b>':'<i class="nw">기록 없음</i>'}</span>${x.src==='srv'?`<span class="pg" title="폰 피킹 체크"><i><u style="width:${pc}%"></u></i>폰 체크 ${x.chk||0}/${n}</span>`:''}</div>
  <div class="lr"><span class="lb">출력</span><div><div class="flr">${flHtml(x,i)}</div>${(()=>{const p=(x.fl||{}).print;if(!p)return '';const ch=T.some(({t})=>String((t.st.upd||{}).at||'')>String(p.at)||String(t.at||'').slice(0,16)>String(p.at));return ch?'<div class="rpn">용차 정보가 출력 뒤에 바뀜 — 재출력 필요</div>':''})()}</div></div>
  <div class="lr"><span class="lb">용차</span><div class="tks">${T.map(({t,n:tn})=>`<div class="tkl${t.st.cancel?' cx':''}"><b>${esc(t.id)}</b><span class="bd2${t.plate?'':' wn'}">${esc(t.status)}</span><span>${esc(t.plate||'차량 미배정')} ${esc(t.driver)}</span><span>상차 <b>${dtS(t.loadAt)}</b> → 하차 <b>${dtS(t.unloadAt)}</b></span><span>하차지 <b>${esc(t.dest||'-')}</b></span><span>받는 기사 <b>${esc(t.recv||'-')}</b></span><span>${tn}/${n}본</span><button class="lk" data-te="${esc(t.id)}">수정</button><button class="lk del" data-td="${esc(t.id)}|${i}">삭제</button></div>`).join('')+(T.length?'<button class="lk" data-ta="'+i+'">용차 추가·변경</button>':'<span class="mu">등록 없음 (기사출고)</span> <button class="lk" data-ta="'+i+'">용차 등록</button>')}</div></div>
  <div class="lca"><button class="sb" data-v="${i}">보기</button><button class="sb pri" data-s="${i}">전달하기</button></div></div>`});
 const cur=S.cur!=null&&LIST[S.cur];if(cur&&S.gas)cur.M.tk=tkInfo(cur.M,LTR);
 $('#main').innerHTML=`<div class="wrap lw"><div class="panel noprint">${note}${chips}${h}</div><div class="pv">${cur?`<div class="noprint" style="display:flex;gap:8px;justify-content:center;margin-bottom:10px"><button id="rp" class="pri">이 지시서 다시 인쇄</button><button id="sd" class="pri">전달하기</button><button id="ra">용차 등록·변경</button></div><div class="pvz">`+sheet(cur.M)+'</div>':'<div id="msg">왼쪽 목록에서 지시서를 누르면 여기에 미리보기가 나옵니다.</div>'}</div></div>`;
 if(cur){$('#ra').onclick=()=>trkReg(cur.M.lines,cur.M,cur.M.no);$('#rp').onclick=()=>{printM(cur.M);setFlag(cur,'print',1);ldraw()};$('#sd').onclick=()=>send(cur.M)}bind()}

function obj(M,drv){const lines=drv!=null?M.lines.filter(g=>g.drv===drv):M.lines,D=[...new Set(lines.map(g=>g.drv))].sort(kc),P=[...new Set(lines.map(g=>g.sup))];
 return{v:1,no:M.no,n:M.n,d:M.date,c:M.center,i:M.issued,w:M.who,u:M.due,t:M.tmp?1:0,f:drv!=null?(drv||'미배정'):M.drvLabel,D,P,L:lines.map(g=>[g.zone,P.indexOf(g.sup),g.veh,g.model,g.pn,D.indexOf(g.drv),g.w,g.on,g.ri||0,g.sub?1:0,g.ot||'',g.kp?1:0,g.kp?g.xw:0]),X:(M.ex||[]).filter(x=>drv==null||x[1]===drv).map(x=>[x[0],x[1],x[3],x[4],x[6]])}}
async function longUrl(o){const bytes=new TextEncoder().encode(JSON.stringify(o));let out=bytes,z='0';
 if(window.CompressionStream){out=new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(new CompressionStream('deflate-raw'))).arrayBuffer());z='1'}
 let s='';for(let i=0;i<out.length;i+=8192)s+=String.fromCharCode.apply(null,out.subarray(i,i+8192));
 return MOB+'#'+z+btoa(s).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
const LINKS={};
async function linkFor(M,drv){const o=obj(M,drv),k=M.no+'|'+(drv==null?'*':drv);if(LINKS[k])return LINKS[k];
 if(S.gas){try{const r=await gpost({a:'link',key:M.no,target:drv==null?'전체':(drv||'미배정'),o});return LINKS[k]={url:MOB+'?k='+r.id,short:1}}catch(e){return{url:await longUrl(o),short:0,err:e.message}}}
 return{url:await longUrl(o),short:0}}
function loadQR(){return window.QRCode?Promise.resolve():new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
function send(M){document.querySelectorAll('#mo').forEach(x=>x.remove());const D=[...new Set(M.lines.map(g=>g.drv))].sort(kc),mo=document.createElement('div');mo.id='mo';
 mo.innerHTML=`<div><h3>${M.tmp?'임시 ':''}피킹 지시서 전달 — ${esc(M.no)}${M.tmp?'':' · '+M.n+'차'}</h3>${false?'':''}<div class="mu"><b>창고 관리자</b>에게는 [관리자용 메시지 복사]를 쓰세요 — 지시서 목록·출고 관리 화면에서 이 지시서가 표시되어 열립니다.<br><b>피킹 작업자·기사</b>에게는 [메시지 복사] — 이 지시서 한 장만 보입니다. 설치·로그인은 없습니다.</div>
 <p><b>대상</b> <select id="sto"><option value="">전체 (${D.length}명)</option>${D.map((d,i)=>`<option value="${i}">${esc(d||'미배정')}</option>`).join('')}</select></p>
 <div class="mu">카톡 등에 붙여넣을 메시지</div><textarea id="stx" readonly></textarea>
 <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="pri" id="swh">관리자용 메시지 복사</button><button id="scp">메시지 복사</button><button id="slk">링크만 복사</button><button id="sop">새 탭에서 미리 보기</button><button id="scl" style="margin-left:auto">닫기</button></div><div id="sms" class="mu" style="margin-top:6px"></div><div id="qr"></div><div class="mu" style="text-align:center">PC 화면의 QR을 폰 카메라로 찍어도 열립니다</div></div>`;
 document.body.appendChild(mo);let url='';const TT=M.title||((((LIST.find(x=>x.M.no===M.no)||{}).fl||{}).title||{}).text)||'';
 const upd=async()=>{const sv=$('#sto').value,d=sv===''?null:D[+sv],L=d!=null?M.lines.filter(g=>g.drv===d):M.lines,n=L.reduce((s,g)=>s+g.w.length,0);$('#stx').value='링크 만드는 중…';$('#sms').textContent='';
  const r=await linkFor(M,d);url=r.url;
  $('#stx').value=`${M.tmp?'[임시] ':''}${TT||'피킹 지시서 전달'} — ${M.no}${M.tmp?'':' · '+M.n+'차'}\n${M.date.slice(5).replace('-','/')}(${dow(M.date)}) 출고 · ${M.center} · ${d==null?M.drvLabel:(d||'미배정')} · 차량 ${new Set(L.map(VK)).size}대 ${n}본\n${url}`;
  $('#sms').textContent=r.short?'짧은 링크 '+url.length+'자':(r.err?'⚠ 공유 저장소 연결 실패 — 긴 링크로 만들었습니다 ('+r.err+')':'긴 링크 '+url.length+'자 — [공유 설정]을 하면 짧은 링크가 됩니다');const q=$('#qr');q.innerHTML='';
  try{await loadQR();if(url.length<=2300)new QRCode(q,{text:url,width:200,height:200,correctLevel:QRCode.CorrectLevel.L});else q.innerHTML='<div class="mu">링크가 길어 QR 대신 메시지로 보내세요</div>'}catch(e){q.innerHTML=''}};
 const cp=(t,b)=>{const ok=()=>{const o=b.textContent;b.textContent='복사됨 ✓';$('#sms').textContent='복사되었습니다 — 카톡에 붙여넣으세요';setTimeout(()=>{b.textContent=o},1500)};
  let done=false;try{const ta=document.createElement('textarea');ta.value=t;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;left:-9999px;top:0';mo.appendChild(ta);ta.focus();ta.select();ta.setSelectionRange(0,t.length);done=document.execCommand('copy');ta.remove()}catch(e){}
  if(done){ok();return}if(navigator.clipboard)navigator.clipboard.writeText(t).then(ok,()=>{$('#sms').textContent='자동 복사가 막혔습니다. 위 칸을 길게 눌러 직접 복사하세요.'});else $('#sms').textContent='자동 복사가 막혔습니다. 위 칸에서 직접 복사하세요.'};
 $('#swh').onclick=e=>{cp(`${M.tmp?'[임시] ':''}${TT||'피킹 지시서'} — ${M.no}${M.tmp?'':' · '+M.n+'차'}\n${M.date.slice(5).replace('-','/')}(${dow(M.date)}) 출고 · ${M.center} · 차량 ${new Set(M.lines.map(VK)).size}대 ${M.lines.reduce((s,g)=>s+g.w.length,0)}본\n지시서 목록에서 열기: ${WH}?no=${encodeURIComponent(M.no)}`,e.target)};$('#swh').hidden=!S.gas;$('#sto').onchange=upd;$('#scp').onclick=e=>{if(url)cp($('#stx').value,e.target)};$('#slk').onclick=e=>{if(url)cp(url,e.target)};$('#sop').onclick=()=>{if(!url)return;const w=window.open(url,'_blank');if(!w)$('#sms').textContent='팝업이 막혔습니다. 링크만 복사해 주소창에 붙여넣으세요.'};$('#scl').onclick=()=>mo.remove();mo.onclick=e=>{if(e.target===mo)mo.remove()};upd()}
function gsLabel(){const on=S.gas&&S.gk;$('#gs').textContent=on?'공유 저장소 연결됨':(S.gas?'PC 키 입력 필요':'공유 설정 (짧은 링크)');$('#gs').style.cssText='height:28px;font-size:12px;border-radius:999px;'+(on?'background:transparent;border:1px solid #2f6b4a;color:#7fd9a3':S.gas?'background:#f5b93a;border:1px solid #f5b93a;color:#3d2800;font-weight:600':'background:transparent;border:1px solid #3a3e5e;color:#dfe2f3')}
if(S.gas&&!S.gk)S.gas='';
gsLabel();
$('#gs').onclick=async()=>{const v=prompt('Apps Script 웹 앱 주소(https://script.google.com/macros/s/…/exec)를 붙여넣으세요.\n비우고 확인하면 공유를 끕니다.',S.gas||'');if(v===null)return;const u=v.trim();
 if(!u){S.gas='';LS('gas',null);gsLabel();return}
 if(!/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(u)){alert('주소 형식이 맞지 않습니다. …/exec 로 끝나는 웹 앱 주소를 넣어 주세요.');return}
 const k=prompt('PC 키를 붙여넣으세요.\n(Apps Script에서 setup 실행 후 실행 로그에 나오는 "PC 키")',S.gk||'');if(k===null)return;
 const old=[S.gas,S.gk];S.gas=u;S.gk=k.trim();try{const r=await (await fetch(u+'?a=auth&t='+encodeURIComponent(S.gk))).json();if(!r.ok)throw new Error('PC 키가 맞지 않습니다');LS('gas',u);LS('gk',S.gk);gsLabel();alert('연결되었습니다. 이제 발행 기록과 링크가 공유 저장소를 씁니다.');if(S.tab==='list')renderList();else if(S.at)load()}catch(e){[S.gas,S.gk]=old;alert('연결 실패: '+e.message+'\n웹 앱을 새 버전으로 배포했는지, 액세스 권한이 "모든 사용자"인지 확인해 주세요.')}};

$('#main').addEventListener('change',e=>{const t=e.target;if(t.dataset.o){t.checked?S.off.delete(t.dataset.o):S.off.add(t.dataset.o);render()}
 else if(t.dataset.d!==undefined){S.rows.filter(r=>r.drv===t.dataset.d).forEach(r=>t.checked?S.off.delete(r.on):S.off.add(r.on));render()}});
document.addEventListener('click',e=>{const t=e.target;
 const q=S.tab==='list'&&t.closest&&t.closest('[data-fl],[data-ta],[data-te],[data-td]');
 if(q){const t=q;
  if(t.dataset.fl){const [i,k]=t.dataset.fl.split('|'),x=LIST[+i];if(x){setFlag(x,k,!(x.fl||{})[k]);t.parentNode.innerHTML=flHtml(x,+i);const ch=$('.lchips');if(ch&&k==='print'){const p=$('.panel'),sc=p.scrollTop;ldraw();$('.panel').scrollTop=sc}}return}
  if(t.dataset.td){const [id,i]=t.dataset.td.split('|'),x=LTR.find(y=>y.id===id),L=LIST[+i];if(x)trkDelete(x,L?trkOf(L.M).map(e=>e.t):LTR);return}
  if(t.dataset.ta!==undefined){const x=LIST[+t.dataset.ta];if(x)trkReg(x.M.lines,x.M,x.M.no);return}
  if(t.dataset.te){const x=LTR.find(y=>y.id===t.dataset.te);if(x)trkForm('용차 정보 수정 — '+x.id,Object.assign({},x,{sumText:'차량·도착 시각·받는 기사 등은 배정 후에도 바꿀 수 있습니다. 진행 체크는 [출고 관리]에서 합니다.'})).then(async o=>{if(!o)return;const df=infoDiff(x,o);if(!Object.keys(df).length)return;try{const r=await gpost({a:'trk_set',id:x.id,info:df,rev:(x.st||{}).rev||0,by:S.who});const j=LTR.findIndex(y=>y.id===x.id);LTR[j]=r.item;const c=LC[lkey()];if(c){c.trk=LTR;lcSave()}const q=TL.findIndex(y=>y.id===x.id);if(q>=0)TL[q]=r.item;renderList(false)}catch(e){alert('저장 실패: '+e.message);if(/다른 사용자가/.test(e.message))renderList()}});return}}
 {const cv=S.tab==='list'&&t.closest&&!t.closest('[data-s]')&&(t.dataset.v!==undefined?t:(!t.closest('button,select,input,a')&&t.closest('[data-v]')));if(cv){S.cur=+cv.dataset.v;ldraw();return}}
 if(t.dataset&&t.dataset.s!==undefined&&S.tab==='list'){S.cur=+t.dataset.s;const x=LIST[S.cur];renderList(false);if(x)send(x.M);return}
 if(t.dataset&&(t.dataset.t||t.dataset.goto)){tab(t.dataset.t||t.dataset.goto);return}
 document.querySelectorAll('#opt details[open]').forEach(d=>{if(!d.contains(t))d.open=false})});

/* ───── 용차출고 ───── */
const TST=[['arrive','용차 도착'],['load','상차 완료'],['depart','용차 출발']];
const TRK='https://hanunpark.github.io/zonescan/truck.html';
const dtS=v=>v?String(v).replace('T',' ').slice(5,16).replace('-','/'):'-';
async function trkReady(){if(!S.gas||!S.gk){alert('용차출고 관리는 공유 저장소 연결이 필요합니다. 상단 [공유 설정]을 먼저 해 주세요.');return false}
 if(!(await gasNew())){alert('용차출고 관리를 쓰려면 Apps Script 코드를 v1.3으로 갱신하고 [배포 관리 → 수정 → 새 버전]으로 다시 배포해야 합니다.');return false}return true}
/* 24시간 표기 날짜·시각 입력 (브라우저의 오전/오후 표기를 쓰지 않는다) */
function dtIn(id,val){const d=String(val||'').slice(0,10),h=String(val||'').slice(11,13),m=String(val||'').slice(14,16),ms=['00','10','20','30','40','50'];if(m&&ms.indexOf(m)<0)ms.push(m);
 return `<span class="dti"><input type="date" id="${id}_d" value="${esc(d)}"><select id="${id}_h">${Array.from({length:24},(_,i)=>pad(i)).map(x=>`<option${x===(h||'08')?' selected':''}>${x}</option>`).join('')}</select>시<select id="${id}_m">${ms.sort().map(x=>`<option${x===(m||'00')?' selected':''}>${x}</option>`).join('')}</select>분</span>`}
function dtVal(id){const d=$('#'+id+'_d').value;return d?d+'T'+$('#'+id+'_h').value+':'+$('#'+id+'_m').value:''}
function nowSlot(){const d=new Date(Date.now()+3600000);return ymd(d)+'T'+pad(d.getHours())+':00'}
function trkForm(t,T,cars){const mo=document.createElement('div');mo.id='mo';const v=k=>esc(T[k]||'');
 mo.innerHTML=`<div><h3>${t}</h3><div class="mu">${T.sumText||''}</div><div class="tkf">
 <label>상차 예정</label>${dtIn('f_loadAt',T.loadAt)}<label>하차(도착) 예정</label>${dtIn('f_unloadAt',T.unloadAt)}
 <label>용차 차량번호</label><input id="f_plate" value="${v('plate')}" placeholder="배정 전이면 비워 두세요"><label>용차 기사</label><input id="f_driver" value="${v('driver')}"><label>연락처</label><input id="f_phone" value="${v('phone')}">
 <label>하차지</label><input id="f_dest" value="${v('dest')}" placeholder="예: ○○ 주차장 / 기사 자택"><label>받는 기사(인수자)</label><input id="f_recv" value="${v('recv')}"><label>메모</label><input id="f_memo" value="${v('memo')}"></div>
 ${cars?`<div class="fcar"><b>실을 차량 (${cars.length}대)</b> — 빼려면 체크를 푸세요${cars.map(c=>`<label><input type="checkbox" data-car="${esc(c.on)}"${c.used?'':' checked'}> <b>${esc(c.veh)}</b> ${esc(supS(c.sup))} · ${c.n}본 · ${esc(c.drv||'미배정')}${c.used?` <span class="dw">(이미 ${esc(c.used)}에 있음 — 체크하면 옮김)</span>`:''}</label>`).join('')}</div>`:''}
 <div style="display:flex;gap:8px;justify-content:flex-end"><button id="f_x">닫기</button><button class="pri" id="f_ok">저장</button></div><div id="f_m" class="dw"></div></div>`;
 document.body.appendChild(mo);return new Promise(res=>{$('#f_x').onclick=()=>{mo.remove();res(null)};$('#f_ok').onclick=()=>{const o={};['plate','driver','phone','dest','recv','memo'].forEach(k=>o[k]=$('#f_'+k).value.trim());o.loadAt=dtVal('f_loadAt');o.unloadAt=dtVal('f_unloadAt');
  if(!o.loadAt){$('#f_m').textContent='상차 예정 일시를 넣어 주세요.';return}if(o.unloadAt&&o.unloadAt<o.loadAt){$('#f_m').textContent='하차 예정이 상차 예정보다 빠릅니다.';return}if(cars){const sel=[...mo.querySelectorAll('[data-car]')].filter(c=>c.checked).flatMap(c=>c.dataset.car.split('|'));if(!sel.length){$('#f_m').textContent='실을 차량을 하나 이상 고르세요.';return}mo.remove();res({o,sel});return}mo.remove();res(o)}})}
/* 출고 방식(용차/기사) — 지시서에 찍을 용차 정보 */
function tkInfo(M,T){const w2=new Map();(T||[]).filter(t=>!t.st.cancel).forEach(t=>t.lines.forEach(g=>g.w.forEach(w=>w2.set(w,t))));const m={},L=[];M.lines.forEach(g=>{const t=g.w.map(w=>w2.get(w)).find(Boolean);if(t){m[g.on]=t.id;if(L.indexOf(t)<0)L.push(t)}});
 L.sort((a,b)=>kc(a.id,b.id));return{m,L:L.map(t=>({id:t.id,plate:t.plate,driver:t.driver,phone:t.phone,loadAt:t.loadAt,unloadAt:t.unloadAt,dest:t.dest,recv:t.recv,status:t.status}))}}
/* 지시자 메모(특이사항): 관리 페이지에서 지시서에 남긴 지시자 메모만 인쇄. 창고 메모는 화면에만 */
function memoHtml(M){const L=(M.mm||[]).filter(m=>m.r==='pc');if(!L.length)return '';return `<div class="memo"><b>특이사항 (지시자 메모)</b>${L.map(m=>`<div>· ${esc(m.text)} <span class="g">${esc(m.by)} ${esc(String(m.upd||m.at).slice(5,16))}</span></div>`).join('')}</div>`}
function shipHtml(M){const K=M.tk;if(!K)return '';const cars=new Map();M.lines.forEach(g=>{const k=VK(g)+'|'+(K.m[g.on]?K.m[g.on].id||'t':'');let a=cars.get(k);if(!a)cars.set(k,a={n:0,t:K.m[g.on]});a.n+=g.w.length});
 const tc=[...cars.values()].filter(a=>a.t),dc=[...cars.values()].filter(a=>!a.t),sum=a=>a.reduce((s,x)=>s+x.n,0);
 return `<div class="ship"><div class="sh1"><b>출고 방식</b>${tc.length?`<span class="sk t">용차출고 ${tc.length}대 · ${sum(tc)}본</span>`:''}${dc.length?`<span class="sk">기사출고 ${dc.length}대 · ${sum(dc)}본</span>`:''}<span class="g">${tc.length?(dc.length?'「용차」 표시가 있는 차량만 용차에 싣고, 나머지는 기사가 직접 출고':'전부 용차에 실어 보냄'):'용차 없음 — 피킹 후 기사가 직접 출고'}</span></div>
 ${K.L.map((t,i)=>`<div class="sh2"><b>용차${K.L.length>1?i+1:''}</b> ${esc(t.id)} · <b>${esc(t.plate||'차량 미배정')}</b> ${esc(t.driver||'')} ${esc(t.phone||'')} · 상차 <b>${dtS(t.loadAt)}</b> → 하차 <b>${dtS(t.unloadAt)}</b><br>하차지(도착지) <b>${esc(t.dest||'-')}</b> · 받는 기사(인수자) <b>${esc(t.recv||'-')}</b></div>`).join('')}</div>`}
function tkTag(M,on){const K=M.tk;if(!K||!K.m[on])return '';const i=K.L.findIndex(t=>t.id===K.m[on]);return `<span class="tg k">용차${K.L.length>1?i+1:''}</span>`}
/* 용차가 이미 있는 지시서: 추가 배정인지 기존 정보 변경인지 먼저 확인 */
function shipAsk(M,ex,issuing){return new Promise(res=>{const mo=document.createElement('div');mo.id='mo';const cars=new Set(M.lines.map(VK)).size,n=M.lines.reduce((s,g)=>s+g.w.length,0),done=v=>{mo.remove();res(v)};
 mo.innerHTML=`<div><h3>${issuing?'출고 방식 — 발행 전에 정하세요':'용차 배정 — '+esc(M.no||'')}</h3><div class="mu">${esc(M.center)} · 출고예정일 ${esc(M.date)} · 차량 ${cars}대 · ${n}본</div>
 ${ex.length?`<div class="shx"><b>이 물건에 이미 등록된 용차</b>${ex.map(({t,n:c})=>`<div><b>${esc(t.id)}</b> <span class="bd2${t.plate?'':' wn'}">${esc(t.status)}</span> ${esc(t.plate||'차량 미배정')} ${esc(t.driver||'')} · 상차 ${dtS(t.loadAt)} → 하차 ${dtS(t.unloadAt)}<br>하차지 ${esc(t.dest||'-')} · 받는 기사 ${esc(t.recv||'-')} · ${c}/${n}본</div>`).join('')}</div>`:''}
 <div class="sho">${issuing?`<button data-m="none" class="${ex.length?'pri':''}"><b>${ex.length?'그대로 발행':'기사출고'}</b><small>${ex.length?'등록된 용차 정보를 그대로 두고 발행합니다':'용차 없이 발행 — 피킹 후 기사가 직접 출고합니다'}</small></button>`:''}
 ${ex.map(({t},i)=>`<button data-m="edit" data-i="${i}"><b>기존 용차 정보 변경 — ${esc(t.id)}</b><small>같은 용차의 차량번호·기사·상차/하차 시각·하차지·받는 기사를 고칩니다</small></button>`).join('')}
 <button data-m="add" class="${ex.length?'':'pri'}"><b>${ex.length?'용차 추가 배정':'용차출고'}</b><small>${ex.length?'차량이 모자라 한 대 더 부릅니다 — 새 용차에 실을 차량을 고르면 기존 용차에서 옮겨집니다':'용차 정보를 입력하고 발행합니다 (차량이 아직 없으면 비워 두고 나중에 수정)'}</small></button></div>
 <div class="mu">용차는 발행 뒤에도 [지시서 목록]에서 등록·수정할 수 있고, 바뀐 용차 정보가 들어간 지시서를 다시 인쇄할 수 있습니다.</div><div style="display:flex;justify-content:flex-end;margin-top:8px"><button data-m="x">${issuing?'발행 취소':'닫기'}</button></div></div>`;
 document.body.appendChild(mo);mo.addEventListener('click',e=>{const b=e.target.closest('[data-m]');if(!b)return;const m=b.dataset.m;done(m==='x'?null:m==='edit'?{mode:'edit',t:ex[+b.dataset.i].t}:{mode:m})})})}
function carsOf(M,T){const used=new Map();(T||[]).filter(t=>!t.st.cancel).forEach(t=>t.lines.forEach(g=>used.set(g.on,t.id)));const C=new Map();M.lines.forEach(g=>{const k=VK(g);let a=C.get(k);if(!a)C.set(k,a={ons:[],veh:g.veh,sup:g.sup,drv:g.drv,n:0,used:used.get(g.on)});if(a.ons.indexOf(g.on)<0)a.ons.push(g.on);if(!a.used)a.used=used.get(g.on);a.n+=g.w.length});return [...C.values()].map(a=>(a.on=a.ons.join('|'),a))}
function trkLines(M,sel){return M.lines.filter(g=>!sel||sel.indexOf(g.on)>=0).map(g=>Object.assign({zone:g.zone,sup:g.sup,veh:g.veh,model:g.model,pn:g.pn,drv:g.drv,w:g.w,on:g.on,ot:g.ot||''},g.kp?{kp:1,xw:g.xw||{}}:{}))}
/* 용차 삭제: 사유를 고르고, 실린 물건을 남는 용차로 옮길지 기사출고로 돌릴지 정한다 */
function trkDelete(x,same){if(!S.gas)return;if(!S.who&&!needWho())return;const p=x.st.steps||{};
 if(p.depart||p.unload||p.hand){alert('이미 출발한 용차는 삭제할 수 없습니다.\n[출고 관리]에서 [출발] 이후 체크를 먼저 풀어 주세요.');return}
 const others=(same||[]).filter(t=>t.id!==x.id&&!t.st.cancel),ok1=others.find(t=>!(t.st.steps||{}).load),cars=new Set(x.lines.map(VK)).size,mo=document.createElement('div');mo.id='mo';
 mo.innerHTML=`<div><h3>용차 삭제 — ${esc(x.id)}</h3><div class="shx" style="margin-top:6px"><b>${esc(x.plate||'차량 미배정')}</b> ${esc(x.driver||'')} · ${esc(x.status)} · 상차 ${dtS(x.loadAt)} → 하차 ${dtS(x.unloadAt)}<br>하차지 ${esc(x.dest||'-')} · 받는 기사 ${esc(x.recv||'-')} · 차량 ${cars}대 · ${x.cnt}본</div>
 ${p.load?'<div class="dw" style="margin-bottom:6px">⚠ 이미 상차 완료된 용차입니다. 실제로 내렸는지 확인하고 삭제하세요.</div>':''}
 <p><b>삭제 사유</b><br>${['미입차','다른 용차로 재배정','대수 축소 (다른 용차에 합침)','잘못 등록','기타'].map((r,i)=>`<label style="margin-right:12px;white-space:nowrap"><input type="radio" name="dw" value="${r}"${i===0?' checked':''}> ${r}</label>`).join('')}<input id="dwx" placeholder="메모 (선택)" style="width:100%;margin-top:6px"></p>
 <p><b>이 용차에 실린 물건 (${cars}대 · ${x.cnt}본)</b><br>${others.map(t=>{const lk=!!((t.st.steps||{}).load);return `<label style="display:block;padding:3px 0${lk?';opacity:.5':''}"><input type="radio" name="dto" value="${esc(t.id)}"${lk?' disabled':t===ok1?' checked':''}> <b>${esc(t.id)}</b>(으)로 옮기기 — ${esc(t.plate||'차량 미배정')} ${esc(t.driver||'')} · 지금 ${t.cnt}본${lk?' <span class="dw">(상차 완료 — 옮길 수 없음)</span>':''}</label>`}).join('')}<label style="display:block;padding:3px 0"><input type="radio" name="dto" value=""${ok1?'':' checked'}> 용차에서 빼기 — 기사출고로 돌아갑니다 (새 용차를 부를 거면 삭제 뒤 [용차 추가·변경])</label></p>
 <div class="mu">삭제한 용차는 목록과 지시서에서 빠지고, 기록(사유·삭제자·시각)은 [출고 관리]의 취소 묶음에 남습니다.</div>
 <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px"><button id="dx">닫기</button><button class="pri" id="dok" style="background:#c2410c;border-color:#c2410c">삭제</button></div><div id="dm" class="dw"></div></div>`;
 document.body.appendChild(mo);$('#dx').onclick=()=>mo.remove();
 $('#dok').onclick=async()=>{const why=(mo.querySelector('[name=dw]:checked')||{}).value+($('#dwx').value.trim()?' — '+$('#dwx').value.trim():''),to=(mo.querySelector('[name=dto]:checked')||{}).value||'';
  if(p.load&&!confirm(x.id+'은(는) 상차 완료된 용차입니다. 그래도 삭제할까요?'))return;$('#dok').disabled=true;$('#dm').textContent='삭제 중…';
  try{const r=await gpost({a:'trk_del',id:x.id,to,why,by:S.who});mo.remove();alert(x.id+' 을(를) 삭제했습니다.'+(r.to?'\n실린 물건 '+r.moved+'본을 '+r.to+'(으)로 옮겼습니다.':'\n실린 물건은 기사출고로 돌아갑니다.')+'\n출력한 지시서가 있으면 다시 인쇄해 주세요.');if(S.tab==='list')renderList();else renderTrk()}
  catch(e){$('#dok').disabled=false;$('#dm').textContent='삭제하지 못했습니다: '+e.message+(/unknown action|잘못된/.test(e.message)?' — Apps Script를 v2.2로 갱신·재배포해 주세요.':'')}}}
function addOk(r){if(!r.id)throw new Error('용차가 만들어지지 않았습니다 (같은 물건이 '+(r.dup||[]).join(', ')+'에 있음). Apps Script를 v1.7 이상으로 갱신·재배포해 주세요.');return r}
async function trkAll(M){return (await gget('a=trk_list&from='+addD(M.date,-10)+'&to='+addD(M.date,10))).items}
function exOf(M,T){const w=new Set(M.lines.flatMap(g=>g.w));return T.filter(t=>!t.st.cancel&&t.lines.some(g=>g.w.some(x=>w.has(x)))).map(t=>({t,n:t.lines.reduce((s,g)=>s+g.w.filter(x=>w.has(x)).length,0)}))}
async function trkNewForm(M,T,src){const drv=[...new Set(M.lines.map(g=>g.drv).filter(Boolean))],cars=carsOf(M,T),has=cars.some(c=>c.used);
 const r=await trkForm(has?'용차 추가 배정':'용차 정보 입력',{loadAt:nowSlot(),unloadAt:'',recv:drv.join(', '),sumText:`${esc(src)} · ${esc(M.center)} · 출고예정일 ${M.date}. 체크한 차량 묶음이 용차 1건이 됩니다.${has?' 이미 다른 용차에 있는 차량을 체크하면 새 용차로 옮겨집니다.':''}`},cars);return r}
async function trkEditSave(t,o){const df=infoDiff(t,o);if(!Object.keys(df).length)return;await gpost({a:'trk_set',id:t.id,info:df,rev:(t.st||{}).rev||0,by:S.who})}
/* 목록·출고 관리에서 용차 등록: 기존 용차가 있으면 추가/변경을 먼저 묻는다 */
async function trkReg(L0,M,src){if(!(await trkReady()))return;let T;try{T=await trkAll(M)}catch(e){alert('용차 목록을 불러오지 못했습니다: '+e.message);return}
 const ex=exOf(M,T);let mode={mode:'add'};if(ex.length){mode=await shipAsk(M,ex,false);if(!mode)return}
 try{if(mode.mode==='edit'){const o=await trkForm('용차 정보 수정 — '+mode.t.id,Object.assign({},mode.t,{sumText:'바꾼 칸만 저장됩니다.'}));if(!o)return;await trkEditSave(mode.t,o.o||o);alert('용차 '+mode.t.id+' 정보를 수정했습니다.')}
  else{const r=await trkNewForm(M,T,src);if(!r)return;const res=addOk(await gpost({a:'trk_add',T:Object.assign(r.o,{center:M.center,src,who:S.who,lines:trkLines(M,r.sel)}),move:1}));alert('용차 '+res.id+' 을(를) 등록했습니다.'+(res.moved&&res.moved.length?'\n기존 용차 '+res.moved.join(', ')+' 에서 해당 차량을 옮겼습니다.':''))}
  if(S.tab==='list')renderList();else if(S.tab==='trk')renderTrk()}catch(e){alert('저장 실패: '+e.message);if(S.tab==='list')renderList()}}
/* 발행 흐름: ① 출고 방식(용차 여부) 결정 → ② 발행 → ③ 용차 등록/수정 → ④ 인쇄 */
async function issueFlow(print){if(!needWho())return null;if(!S.at){alert('먼저 대상을 조회하세요.');return null}const V=view();if(!V.ok.length){alert('꺼낼 대상(기사 배정·입고)이 없습니다.');return null}
 const M0=model(V);let plan=null,T=[];
 if(S.gas&&S.gk){try{T=await trkAll(M0)}catch(e){if(/unknown action/.test(e.message)){T=null}else if(!confirm('용차 목록을 불러오지 못했습니다 ('+e.message+').\n용차 정보 없이 발행할까요?'))return null;T=null}
  if(T){plan=await shipAsk(M0,exOf(M0,T),true);if(!plan)return null;
   if(plan.mode==='add'){const r=await trkNewForm(M0,T,(S.tmp?'임시':'정식')+' 지시서');if(!r)return null;plan.r=r}
   if(plan.mode==='edit'){const o=await trkForm('용차 정보 수정 — '+plan.t.id,Object.assign({},plan.t,{sumText:'바꾼 칸만 저장됩니다. 저장하면 이어서 발행합니다.'}));if(!o)return null;plan.o=o.o||o}}}
 const M=await issue();if(!M)return null;
 [LF,TF].forEach(f=>{if(M.date<f.from)f.from=M.date;if(M.date>f.to)f.to=M.date});
 if(plan){try{if(plan.mode==='add'){const res=addOk(await gpost({a:'trk_add',T:Object.assign(plan.r.o,{center:M.center,src:M.no,who:S.who,lines:trkLines(M,plan.r.sel)}),move:1}));if(res.moved&&res.moved.length)alert('기존 용차 '+res.moved.join(', ')+' 에서 해당 차량을 새 용차 '+res.id+' (으)로 옮겼습니다.')}
   if(plan.mode==='edit')await trkEditSave(plan.t,plan.o);T=await trkAll(M)}catch(e){alert('지시서는 발행했지만 용차 정보 저장에 실패했습니다: '+e.message+'\n[지시서 목록]에서 용차를 다시 등록해 주세요.')}
  M.tk=tkInfo(M,T||[])}
 render();mgPost({t:'tc-reload'});
 if(print){printM(M);const a=histL(),h=a[a.length-1];if(h&&h.shared){gpost({a:'iss_set',no:M.no,key:'print',on:1,by:S.who}).catch(()=>{})}else if(h){h.fl={print:{at:nowS(),by:S.who}};LS(hk(),a)}}
 else if(confirm(M.no+' '+M.n+'차를 발행했습니다.\n지금 폰으로 전달할까요?'))send(M);
 return M}
let TL=[];
/* 용차와 지시서 연결: 운송장이 겹치는 지시서 번호, 같은 물건이 다른 용차에도 있는지 */
function relOf(x,SH,TT){const w=new Set(x.lines.flatMap(g=>g.w));const sh=(SH||[]).filter(r=>r.M&&r.M.lines.some(g=>g.w.some(v=>w.has(v)))).map(r=>r.M.no).sort(kc).reverse();
 const du=x.st.cancel?[]:(TT||[]).filter(t=>t.id!==x.id&&!t.st.cancel&&t.lines.some(g=>g.w.some(v=>w.has(v)))).map(t=>t.id);return{sh,du}}
function relHtml(x,SH,TT){const R=relOf(x,SH,TT);return `<div class="rel">관련 지시서 ${R.sh.length?R.sh.map(n=>`<b>${esc(n)}</b>`).join(', '):'<span class="mu">조회 기간 안에 없음</span>'}${R.du.length?`<div class="dw">⚠ 같은 물건이 ${R.du.map(esc).join(', ')}에도 등록되어 있습니다 — 한쪽을 [정보 수정]하거나 [용차 취소]해 주세요</div>`:''}</div>`}
/* 용차 출발 = 창고 업무의 끝. 서류 전달을 확인하는 창을 거쳐야 출발 처리된다 */
function departAsk(x){return new Promise(res=>{const S0=x.st.steps||{},cars=new Set(x.lines.map(g=>g.on)),n=[...cars].filter(c=>(x.st.ld||{})[c]).length,mo=document.createElement('div');mo.id='mo';
 const items=[['doc1','명세서 전달'],['doc2','회수운송장 전달']];
 mo.innerHTML=`<div style="max-width:420px"><h3>용차 출발 처리 — ${esc(x.id)}</h3><div class="mu">${esc(x.plate||'차량 미배정')} ${esc(x.driver||'')} · ${x.cars}대 · ${x.cnt}본<br>출발 처리 뒤에는 이 용차를 더 체크하지 않습니다 (하차·인계는 받는 쪽 확인).</div>
 <div class="shx">차량별 상차 확인 <b>${n}/${cars.size}</b>대${n<cars.size?' <span class="dw">— 확인 안 된 차량이 있습니다</span>':' ✓'}</div>
 <div style="font-weight:700;margin-top:6px">용차 기사에게 넘겼나요?</div>${items.map(([k,l])=>`<label style="display:block;padding:6px 0;font-size:15px"><input type="checkbox" data-dc="${k}"${S0[k]?' checked':''} style="width:18px;height:18px;vertical-align:-3px"> ${l}${S0[k]?` <span class="mu">(${esc(String(S0[k].at).slice(5))} ${esc(S0[k].by||'')})</span>`:''}</label>`).join('')}
 <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:10px"><button id="dpx">닫기</button><button class="pri" id="dpo" disabled>확인 · 출발 처리</button></div></div>`;
 document.body.appendChild(mo);const q=z=>mo.querySelector(z),upd=()=>{q('#dpo').disabled=[...mo.querySelectorAll('[data-dc]')].some(c=>!c.checked)};upd();
 mo.addEventListener('change',upd);q('#dpx').onclick=()=>{mo.remove();res(null)};q('#dpo').onclick=()=>{mo.remove();res(items.map(i=>i[0]).filter(k=>!S0[k]))}})}
function trkCard(x){const p=x.st.steps||{},ld=x.st.ld||{},V=new Map();x.lines.forEach(g=>{let a=V.get(g.on);if(!a)V.set(g.on,a={veh:g.veh,sup:g.sup,drv:g.drv,n:0,pn:[],z:[],ot:g.ot});a.n+=g.w.length;const sz=sizeOf(g.pn);if(a.pn.indexOf(sz)<0)a.pn.push(sz);if(a.z.indexOf(g.zone||'-')<0)a.z.push(g.zone||'-')});
 const lc=[...V.keys()].filter(k=>ld[k]).length,lock=!!(p.load||p.depart||p.unload||p.hand),cls=x.st.cancel?'sx':(p.depart||p.hand)?'s3':(x.plate?'':'s1'),late=!x.st.cancel&&!p.load&&x.loadAt&&x.loadAt.replace('T',' ')<nowS();
 return `<div class="tk ${cls}" data-id="${esc(x.id)}"><h5><span>${esc(x.id)}</span><span class="bd"${x.status==='용차 미배정'?' style="background:#c2410c"':''}>${esc(x.status)}</span>${late?'<span class="dw">상차 예정 시각 지남</span>':''}<span class="mu" style="font-size:12px;font-weight:400">${esc(x.src)} · 등록 ${esc(String(x.at).slice(5,16))} ${esc(x.who||'')}</span></h5>
 <div class="inf"><span>용차 <b>${esc(x.plate||'미배정')}</b> ${esc(x.driver)} ${esc(x.phone)}</span><span>상차 예정 <b>${dtS(x.loadAt)}</b></span><span>하차 예정 <b>${dtS(x.unloadAt)}</b></span><span class="br">하차지(도착지) <b>${esc(x.dest||'-')}</b></span><span class="br">받는 기사(인수자) <b>${esc(x.recv||'-')}</b></span><span>${esc(x.center)} · 차량 <b>${x.cars}</b>대 · <b>${x.cnt}</b>본</span>${x.memo?`<span>메모 ${esc(x.memo)}</span>`:''}${x.st.cancel&&x.st.del?`<span class="br dw">삭제 ${esc(x.st.del.at.slice(5))} ${esc(x.st.del.by||'')} · 사유 ${esc(x.st.del.why||'-')}${x.st.del.to?' · 물건 '+x.st.del.moved+'본 → '+esc(x.st.del.to):' · 물건은 기사출고로'}</span>`:''}</div>${relHtml(x,TSRV,TL)}
 <div class="stp">${TST.map(([k,l])=>`<button data-st="${k}" class="${p[k]?'on':''}">${l}<small>${p[k]?esc(dtS(p[k].at))+' '+esc(p[k].by||''):'미체크'}</small></button>`).join('')}</div>
 <details${x._open?' open':''}><summary style="display:inline-block">싣는 물건 · 상차 확인 ${lc}/${V.size}대${lock?' 🔒 상차 완료 뒤 변경 불가':''}</summary><div style="position:static;box-shadow:none;border:0;padding:0;max-height:none"><table><tr><th>상차</th><th>수취인(차량)</th><th>업체</th><th>규격</th><th>존코드</th><th>본</th><th>기사</th></tr>
 ${[...V.entries()].map(([k,a])=>`<tr class="${ld[k]?'ld':''}"><td><input type="checkbox" data-ld="${esc(k)}"${ld[k]?' checked':''}${lock?' disabled':''}></td><td><b>${esc(a.veh)}</b>${a.ot?` <span class="tg">${esc(a.ot.split('·')[0])}</span>`:''}</td><td>${esc(supS(a.sup))}</td><td>${esc(a.pn.join(', '))}</td><td>${esc(a.z.join(', '))}</td><td><b>${a.n}</b></td><td>${esc(a.drv||'미배정')}</td></tr>`).join('')}</table></div></details>
 <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px"><button class="sb pri" data-tk="link">창고 전달 링크 복사</button><button class="sb" data-tk="edit">정보 수정</button><button class="sb" data-tk="cancel"${x.st.cancel?'':' style="color:#c2410c"'}>${x.st.cancel?'취소 되돌리기':'용차 삭제'}</button><span class="mu" data-tkm style="font-size:12px"></span></div></div>`}
const WH='https://hanunpark.github.io/zonescan/wh.html';
let WHBUSY=false;
async function whLink(){if(WHBUSY)return;WHBUSY=true;document.querySelectorAll('#mo').forEach(x=>x.remove());const wb=document.querySelectorAll('#lwh,#twh');wb.forEach(b=>{b.dataset.t=b.textContent;b.textContent='불러오는 중…'});let r;try{r=await gget('a=whpin')}catch(e){alert('관리 페이지 정보를 받지 못했습니다: '+e.message+(/unknown action/.test(e.message)?'\nApps Script 코드를 v2.1로 갱신·재배포해 주세요.':''));return}finally{WHBUSY=false;wb.forEach(b=>{if(b.dataset.t)b.textContent=b.dataset.t})}
 const mo=document.createElement('div');mo.id='mo';const q=x=>mo.querySelector(x);const draw=()=>{const msg='타이어케어 출고 관리 (지시서 목록·출력 체크·용차 배정·출고 관리)\n'+WH+(r.open?'':'\n비밀번호: '+r.pin+' (처음 한 번만 누르면 됩니다)');
 mo.innerHTML=`<div><h3>관리 페이지 주소 (루티 없이 접속)</h3><div class="mu">용차 배정 담당·창고 관리자가 폰·PC 브라우저에서 지시서 목록을 보고, 피킹지시서를 열어 체크하고, 용차를 등록·수정하고, 출고 관리를 하는 페이지입니다. 설치·로그인은 없습니다. 지시서 발행은 이 페이지에서 할 수 없습니다.</div>
 ${r.open?'<p><b>지금은 비밀번호 없이 열리는 설정입니다 (OPEN_WH).</b></p>':`<p style="font-size:15px">접속 비밀번호 <b style="font-size:24px;letter-spacing:4px;margin:0 8px">${esc(r.pin)}</b><button id="wh_p">비밀번호 바꾸기</button></p><div class="mu">폰에서 주소를 열고 이 숫자 4자리를 한 번 누르면 그 폰에 저장됩니다. 비밀번호를 바꾸면 모든 폰에서 새 번호를 다시 눌러야 합니다. 10분 안에 20번 틀리면 10분간 잠깁니다.</div>`}
 <textarea id="wh_t" readonly style="width:100%;height:84px;margin:10px 0;font-size:12.5px">${esc(msg)}</textarea><div style="display:flex;gap:8px;justify-content:flex-end;flex-wrap:wrap"><button id="wh_x">닫기</button><button class="pri" id="wh_c">메시지 복사</button></div><div id="wh_m" class="mu"></div></div>`;
 q('#wh_x').onclick=()=>mo.remove();q('#wh_c').onclick=()=>{const t=q('#wh_t');t.select();let ok=false;try{ok=document.execCommand('copy')}catch(_){}if(!ok&&navigator.clipboard)navigator.clipboard.writeText(msg);q('#wh_m').textContent='복사되었습니다 — 카톡에 붙여넣으세요.'};
 const pb=q('#wh_p');if(pb)pb.onclick=async()=>{const v=(prompt('새 비밀번호 — 숫자 4자리',r.pin)||'').trim();if(!v||v===r.pin)return;if(!/^\d{4}$/.test(v)){alert('숫자 4자리로 넣어 주세요.');return}try{r=await gget('a=whpin&set='+v);draw();q('#wh_m').textContent='비밀번호를 바꿨습니다. 쓰던 폰에서는 새 번호를 다시 눌러야 합니다.'}catch(e){alert('바꾸지 못했습니다: '+e.message)}}};
 mo.addEventListener('click',e=>{if(e.target===mo)mo.remove()});document.body.appendChild(mo);draw()}
let TSEQ=0,TPEND=0,TBUSY=false,TLOADED=false,TSRV=[];const TC={},TF={from:ymd(new Date()),to:ymd(new Date()),center:'',kind:'trk'};
function tkey(){return TF.from+'|'+TF.to}
function tstrip(y){const z=Object.assign({},y);delete z.q;delete z.pn;return z}
function tcSave(){const c={k:tkey(),trk:TL.map(tstrip),srv:TSRV.map(r=>{const z=Object.assign({},r);delete z._x;return z})};TC[c.k]=c;LS('tcache',c)}
function tfetch(){const k=tkey();return Promise.all([gget('a=trk_list&from='+addD(TF.from,-10)+'&to='+addD(TF.to,10)).then(r=>r.items),gget('a=list&from='+addD(TF.from,-7)+'&to='+addD(TF.to,7)).then(r=>r.items).catch(()=>[])]).then(([trk,srv])=>({k,trk,srv}))}
function tstatus(x){const st=x.st||{},p=st.steps||{};if(st.cancel)return '취소';if(p.depart||p.unload||p.hand)return '출고 완료';if(p.load)return '상차 완료';if(p.arrive)return '용차 도착';return x.plate?'배정':'용차 미배정'}
function infoDiff(x,o){const d={};['loadAt','unloadAt','plate','driver','phone','dest','recv','memo'].forEach(f=>{if(String(o[f]||'')!==String(x[f]||''))d[f]=o[f]});return d}
async function renderTrk(fetch1){$('#opt').hidden=true;$('#sum').innerHTML='';$('#dup').hidden=true;
 if(fetch1===false){tdraw();return}
 if(!S.gas||!S.gk){$('#main').innerHTML='<div id="msg">출고 관리는 공유 저장소 연결이 필요합니다. 상단 [공유 설정]을 먼저 해 주세요.</div>';return}
 const seq=++TSEQ,key=tkey();let c=TC[key];if(!c){const s=LS('tcache');if(s&&s.k===key&&s.trk)c=TC[key]=s}
 if(c&&!TPEND){TL=c.trk;TSRV=c.srv||[];TLOADED=true}
 if(c){TBUSY=true;tdraw()}else{TLOADED=false;$('#main').innerHTML='<div id="msg">출고 목록을 불러오는 중…</div>'}
 try{const n=await tfetch();TC[key]=n;LS('tcache',n);if(seq!==TSEQ||tkey()!==key)return;TBUSY=false;if(!TPEND){const op={};document.querySelectorAll('.tk').forEach(c=>{const d=c.querySelector('details');if(d&&d.open)op[c.dataset.id]=1});n.trk.forEach(x=>{if(op[x.id])x._open=true});TL=n.trk;TSRV=n.srv;TLOADED=true}}
 catch(e){if(seq!==TSEQ)return;TBUSY=false;if(!TLOADED){$('#main').innerHTML='<div id="msg">불러오지 못했습니다: '+esc(e.message)+(/unknown action/.test(e.message)?'<br><small class="mu">Apps Script 코드를 최신본으로 갱신·재배포해 주세요.</small>':'')+' <button class="lk" id="tkr">다시 시도</button></div>';$('#tkr').onclick=()=>renderTrk();return}}
 tdraw()}
function drvOut(){const on=new Set();TL.filter(x=>!x.st.cancel).forEach(t=>t.lines.forEach(g=>g.w.forEach(w=>on.add(w))));
 return TSRV.filter(r=>r.M&&r.M.date>=TF.from&&r.M.date<=TF.to&&(!TF.center||r.M.center===TF.center)).map(r=>{const M=r.M,D=new Map();let n=0,tot=0;M.lines.forEach(g=>{tot+=g.w.length;const c=g.w.filter(w=>!on.has(w)).length;if(!c)return;n+=c;const k=g.drv||'미배정';let a=D.get(k);if(!a)D.set(k,a={cars:new Set(),n:0});a.cars.add(g.on);a.n+=c});
  const fl=r.fl||{},chk=r.checked||0,st=fl.pick||(tot&&chk>=tot)?2:chk>0?1:0;return{r,M,D,n,tot,chk,st,fl}}).filter(d=>d.n)}
function drvCard(d,i){const M=d.M,pc=d.tot?Math.round(d.chk/d.tot*100):0,f=d.fl.pick;
 return `<div class="tk dv ${d.st===2?'s3':d.st===1?'':'s1'}${M.tmp?' tmp':''}"><h5><span class="ty${M.tmp?' t':''}">${M.tmp?'임시':'정식'}</span><span>${esc(M.no)}</span><span class="bd"${d.st===2?' style="background:#2e9e5b"':d.st===0?' style="background:#c2410c"':''}>${['피킹 전','피킹 중','피킹 완료 · 종결'][d.st]}</span><span class="mu" style="font-size:12px;font-weight:400">${esc(M.center)} · 발행 ${esc(fmtAt(M.issued||d.r.at))} ${esc(d.r.who||'')}</span></h5>
 <div class="inf"><span>기사출고 <b>${d.n}</b>본${d.tot>d.n?` <span class="mu">(용차 ${d.tot-d.n}본은 용차출고에서 관리)</span>`:''}</span><span class="pg"><i><u style="width:${pc}%"></u></i>폰 피킹 체크 <b>${d.chk}</b>/${d.tot}</span>${f?`<span>피킹 완료 체크 <b>${esc(fmtAt(f.at))}</b> ${esc(f.by||'')}</span>`:''}</div>
 <div class="dvs">${[...d.D.entries()].sort((a,b)=>kc(a[0],b[0])).map(([k,a])=>`<span><b>${esc(k)}</b> ${a.cars.size}대 · ${a.n}본</span>`).join('')}</div>
 <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;align-items:center"><button class="sb${f?'':' pri'}" data-dp="${i}">${f?'✓ 피킹 완료 (누르면 해제)':'피킹 완료 체크'}</button><button class="sb" data-ds="${i}">피킹지시서 전달</button><span class="mu" style="font-size:12px">${d.st===2?'피킹 완료 — 이후 출고는 기사가 기사 앱에서 처리합니다.':'피킹까지가 창고 업무입니다. 폰 체크가 모두 끝나면 자동으로 종결됩니다.'}</span></div></div>`}
let DV=[];
function tdraw(){if(S.tab!=='trk')return;const p=x=>x.st.steps||{},inR=d=>d>=TF.from&&d<=TF.to;
 const T=TL.filter(x=>(!TF.center||x.center===TF.center)&&inR(String(x.loadAt).slice(0,10)));DV=drvOut();
 const cs=[...new Set(TL.map(x=>x.center).concat(TSRV.map(r=>r.M&&r.M.center),TF.center?[TF.center]:[]).filter(Boolean))].sort(kc);
 const act=T.filter(x=>!x.st.cancel),c=f=>act.filter(f).length;
 const head=`<div class="okind"><button data-ok="trk" class="${TF.kind==='trk'?'on':''}">용차출고 <b>${act.filter(x=>!(p(x).depart||p(x).hand)).length}</b><small>용차에 실어 보내는 건</small></button><button data-ok="drv" class="${TF.kind==='drv'?'on':''}">기사출고 <b>${DV.filter(d=>d.st<2).length}</b><small>기사가 직접 가져가는 건 · 피킹까지</small></button></div>
 <div class="lf" style="margin:10px 0">거점 <select id="tfc"><option value="">전체</option>${cs.map(c=>`<option${c===TF.center?' selected':''}>${esc(c)}</option>`).join('')}</select> ${TF.kind==='trk'?'상차 예정일':'출고예정일'} <input type="date" id="tff" value="${TF.from}">~<input type="date" id="tft" value="${TF.to}"><button id="tfg" class="sb pri">조회</button><button class="sb" data-tq="0">오늘</button><button class="sb" data-tq="1">내일</button><button class="sb" data-tq="14">±14일</button><button class="lk" id="tkr">새로고침</button><button class="lk" id="twh">관리 페이지 링크</button>${TBUSY?'<span class="spin">최신 내용 확인 중…</span>':''}</div>`;
 let h='',pd='',sum='';
 if(TF.kind==='trk'){sum=`<span>진행 중 용차 <b>${c(x=>!(p(x).depart||p(x).hand))}</b>건</span><span class="dw">용차 미배정 ${c(x=>!x.plate)}건</span><span>상차 전 ${c(x=>!p(x).load)}건</span><span class="mu">출발 완료 ${c(x=>(p(x).depart||p(x).hand))}건</span>`;
  T.slice().sort((a,b)=>(a.st.cancel?1:0)-(b.st.cancel?1:0)||(((p(a).depart||p(a).hand)?1:0)-((p(b).depart||p(b).hand)?1:0))||kc(a.loadAt,b.loadAt)).forEach(x=>{const d=x.st.cancel?'취소':(p(x).depart||p(x).hand)?'출발 완료':'상차 '+x.loadAt.slice(0,10)+' ('+dow(x.loadAt.slice(0,10))+')';if(d!==pd){h+=`<div class="dh">${d}</div>`;pd=d}h+=trkCard(x)});
  if(!h)h='<div id="msg">이 조건에 등록된 용차가 없습니다.<br><small class="mu">[지시서 만들기]·[임시]·[지시서 목록]에서 [용차출고 등록]을 누르면 여기에 나옵니다.</small></div>'}
 else{const n=k=>DV.filter(d=>d.st===k).length;sum=`<span class="dw">피킹 전 <b>${n(0)}</b>건</span><span>피킹 중 <b>${n(1)}</b>건</span><span class="mu">피킹 완료(종결) ${n(2)}건</span><span class="mu">용차에 등록하지 않은 물건은 모두 기사출고로 봅니다.</span>`;
  DV.map((d,i)=>[d,i]).sort((a,b)=>(a[0].st===2?1:0)-(b[0].st===2?1:0)||kc(a[0].M.date,b[0].M.date)||kc(a[0].M.no,b[0].M.no)).forEach(([d,i])=>{const g=d.st===2?'피킹 완료 (종결)':'출고예정일 '+d.M.date+' ('+dow(d.M.date)+')';if(g!==pd){h+=`<div class="dh">${g}</div>`;pd=g}h+=drvCard(d,i)});
  if(!h)h='<div id="msg">이 조건에 기사출고 대상 지시서가 없습니다.</div>'}
 $('#main').innerHTML=`<div style="max-width:1100px;margin:0 auto;padding:12px 16px 40px">${head}<div style="padding:0 0 10px;display:flex;flex-wrap:wrap;gap:6px 18px;align-items:center">${sum}</div>${h}</div>`;
 $('#tkr').onclick=()=>renderTrk();$('#twh').onclick=()=>whLink();$('#tfc').onchange=e=>{TF.center=e.target.value;tdraw()};document.querySelectorAll('[data-ok]').forEach(b=>b.onclick=()=>{TF.kind=b.dataset.ok;tdraw()});
 $('#tfg').onclick=()=>{const a=$('#tff').value,b=$('#tft').value;if(!a||!b||a>b){alert('날짜 구간을 확인해 주세요. (시작일 ≤ 종료일)');return}TF.from=a;TF.to=b;renderTrk()};document.querySelectorAll('[data-tq]').forEach(b=>b.onclick=()=>{const t=ymd(new Date()),q=+b.dataset.tq;TF.from=q===14?addD(t,-14):addD(t,q);TF.to=q===14?addD(t,14):addD(t,q);renderTrk()})}
document.addEventListener('click',e=>{if(S.tab!=='trk')return;const t=e.target.closest&&e.target.closest('[data-dp],[data-ds]');if(!t)return;const d=DV[+(t.dataset.dp||t.dataset.ds)];if(!d)return;
 if(t.dataset.ds){send(d.M);return}if(!d.fl.pick&&!S.who&&!needWho())return;
 const r=d.r,x=r._x||(r._x={src:'srv',raw:r,M:r.M,fl:r.fl||{}});x.fl=r.fl||{};setFlag(x,'pick',!x.fl.pick).then(()=>tcSave());r.fl=x.fl;tdraw()});
function trkUpd(id,body,open){const x=TL.find(y=>y.id===id);if(!x)return;const bak=JSON.stringify(tstrip(x));x._open=open;const st=x.st=x.st||{};st.steps=st.steps||{};st.ld=st.ld||{};
 if(body.info){body.rev=st.rev||0;body.by=S.who}
 if(body.step){if(body.step.on)st.steps[body.step.name]={at:body.step.at||nowS(),by:body.step.by||''};else delete st.steps[body.step.name]}
 if(body.load){if(body.load.v)st.ld[body.load.on]={at:nowS(),by:body.load.by||''};else delete st.ld[body.load.on]}
 if('cancel' in body){if(body.cancel)st.cancel=nowS();else delete st.cancel}
 if(body.info)Object.keys(body.info).forEach(f=>x[f]=body.info[f]);
 x.status=tstatus(x);tdraw();TPEND++;x.pn=(x.pn||0)+1;
 x.q=(x.q||Promise.resolve()).then(()=>gpost(Object.assign({a:'trk_set',id},body))).then(r=>{TPEND--;const i=TL.findIndex(y=>y.id===id);if(i<0)return;const cur=TL[i];if(--cur.pn)return;const card=document.querySelector('.tk[data-id="'+id+'"]'),d=card&&card.querySelector('details');r.item._open=d?d.open:cur._open;r.item.q=cur.q;TL[i]=r.item;tcSave();if(JSON.stringify([r.item.st.steps,r.item.st.ld,r.item.status,r.item.plate,r.item.loadAt,r.item.unloadAt])!==JSON.stringify([cur.st.steps,cur.st.ld,cur.status,cur.plate,cur.loadAt,cur.unloadAt]))tdraw()})
 .catch(e=>{TPEND--;const i=TL.findIndex(y=>y.id===id);if(i>=0){const o=JSON.parse(bak);o.q=Promise.resolve();o.pn=0;TL[i]=o}alert('저장 실패 — 되돌렸습니다.\n'+e.message);if(/다른 사용자가/.test(e.message))renderTrk();else tdraw()});return x.q}
document.addEventListener('click',async e=>{const t=e.target.closest('[data-st],[data-tk]');if(!t||S.tab!=='trk')return;const card=t.closest('.tk'),id=card.dataset.id,x=TL.find(y=>y.id===id),open=card.querySelector('details').open;if(!x)return;
 if(t.dataset.st){const k=t.dataset.st,cur=(x.st.steps||{})[k];
  if(cur){const v=prompt('시각을 고치려면 수정하고, 체크를 풀려면 비우고 확인하세요. (YYYY-MM-DD HH:MM)',cur.at);if(v===null)return;if(!v.trim()){const P=x.st.steps||{};if(k==='load'&&(P.depart||P.unload||P.hand)){alert('이미 출발한 용차입니다. [상차 완료]를 풀려면 [출발] 이후 체크를 먼저 풀어 주세요.');return}return trkUpd(id,{step:{name:k,on:0}},open)}return trkUpd(id,{step:{name:k,on:1,at:v.trim(),by:cur.by||S.who}},open)}
  if(k==='depart'){if(!S.who&&!needWho())return;const need=await departAsk(x);if(!need)return;const at=nowS();need.forEach(d=>trkUpd(id,{step:{name:d,on:1,at,by:S.who}},open));return trkUpd(id,{step:{name:'depart',on:1,at,by:S.who}},open)}
  if(k==='load'){const cars=new Set(x.lines.map(g=>g.on)),n=[...cars].filter(c=>(x.st.ld||{})[c]).length;if(n<cars.size&&!confirm('차량별 상차 확인이 '+n+'/'+cars.size+'대입니다.\n확인하지 않은 차량이 있는데 그래도 체크할까요?\n(체크 뒤에는 차량별 상차 확인을 바꿀 수 없습니다)'))return}
  return trkUpd(id,{step:{name:k,on:1,at:nowS(),by:S.who}},open)}
 const a=t.dataset.tk;
 if(a==='link'){const msg=`용차출고 — ${x.id}\n상차 ${dtS(x.loadAt)} · 하차 ${dtS(x.unloadAt)} · 용차 ${x.plate||'미배정'} ${x.driver} ${x.phone}\n${x.center} · 차량 ${x.cars}대 ${x.cnt}본 · 하차지 ${x.dest||'-'} · 받는 기사 ${x.recv||'-'}\n${TRK}?k=${x.k}`;
  const ta=document.createElement('textarea');ta.value=msg;ta.style.cssText='position:fixed;left:-9999px';document.body.appendChild(ta);ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(_){}ta.remove();if(!ok&&navigator.clipboard)navigator.clipboard.writeText(msg);card.querySelector('[data-tkm]').textContent='복사되었습니다 — 창고 담당자에게 카톡으로 붙여넣으세요';return}
 if(a==='edit'){const o=await trkForm('용차 정보 수정 — '+x.id,Object.assign({},x,{sumText:''}));if(o){const df=infoDiff(x,o);if(Object.keys(df).length)trkUpd(id,{info:df},open)}return}
 if(a==='cancel'){if(x.st.cancel){if(confirm(x.id+' 삭제(취소)를 되돌릴까요?'+(x.st.del&&x.st.del.to?'\n※ '+x.st.del.to+'(으)로 옮긴 물건은 그대로 남아 있으니 필요하면 그쪽을 정리해 주세요.':'')))trkUpd(id,{cancel:0},open)}else{const w=new Set(x.lines.flatMap(g=>g.w));trkDelete(x,TL.filter(t=>t.lines.some(g=>g.w.some(v=>w.has(v)))))}}});
document.addEventListener('change',e=>{const t=e.target;if(S.tab!=='trk'||!t.dataset||t.dataset.ld===undefined)return;const card=t.closest('.tk');trkUpd(card.dataset.id,{load:{on:t.dataset.ld,v:t.checked?1:0,by:S.who}},true)});
function restoreNorm(){if(S.norm){Object.assign(S,S.norm);S.norm=null}S.tmp=false}

function readSelState(W){const doc=W.document,txt=doc.body.innerText,badge=+((txt.match(/선택\s*:\s*(\d+)/)||[])[1]||-1),total=+((txt.match(/전체\s*:\s*(\d+)/)||[])[1]||-1);
 const c=[];for(const node of doc.querySelectorAll('input[type=checkbox]')){const fk=Object.keys(node).find(k=>k.indexOf('__reactFiber')===0);if(!fk||!node[fk])continue;
  for(const st of [node[fk],node[fk].alternate]){let f=st;for(let i=0;i<40&&f;i++){const p=f.memoizedProps||{};if(Array.isArray(p.selectedRows)&&typeof p.onChangeSelect==='function'){c.push(p.selectedRows);break}f=f.return}}}
 const pick=c.find(a=>a.length===badge);if(!pick)return null;
 const wb=x=>String(x&&x.waybillNumber||''),ok=w=>/\d{4}-\d{4}-\d{4}/.test(w);
 return{sel:new Set(pick.map(wb).filter(ok)),badge,total,rowsRead:total,noWb:pick.filter(x=>!ok(wb(x))).length,search:W.location.search,how:'state',items:JSON.parse(JSON.stringify(pick.filter(x=>ok(wb(x)))))}}
async function readSel(W){const doc=W.document,rowOf=cb=>{let e=cb;while(e&&e.children.length<30)e=e.parentElement;return e};
 const rows=[...doc.querySelectorAll('input[type=checkbox]')].map(rowOf).filter(Boolean);if(!rows.length)throw new Error('루티 주문 목록을 찾지 못했습니다. [조회하기]로 목록을 띄운 뒤 다시 시도하세요.');
 const n=Math.max(...rows.map(r=>r.children.length));
 const h=[...doc.querySelectorAll('div,span')].filter(x=>x.childElementCount===0&&x.textContent.trim()==='운송장번호').map(x=>{let c=x;while(c.parentElement&&c.parentElement.children.length<30)c=c.parentElement;return c}).find(c=>c.parentElement&&c.parentElement.children.length===n);
 if(!h)throw new Error('목록에 "운송장번호" 열이 보이지 않습니다. 루티 [테이블 설정]에서 운송장번호 열을 켜 주세요.');
 const hr=h.parentElement,wi=[...hr.children].indexOf(h),dr=rows.find(r=>r!==hr&&r.children.length===n);if(!dr)throw new Error('목록 행을 찾지 못했습니다.');const list=dr.parentElement;
 let sc=list;while(sc&&!(sc.scrollHeight>sc.clientHeight+5&&['auto','scroll'].includes(W.getComputedStyle(sc).overflowY)))sc=sc.parentElement;
 const seen=new Map(),t0=sc?sc.scrollTop:0,wait=ms=>new Promise(z=>setTimeout(z,ms));if(sc){sc.scrollTop=0;await wait(200)}
 for(let i=0;i<500;i++){for(const r of list.children){if(r.children.length!==n)continue;const no=((r.children[1]||{}).innerText||'').trim(),w=((r.children[wi]||{}).innerText||'').trim(),cb=r.querySelector('input[type=checkbox]');const key=no||w;if(!key)continue;seen.set(key,{w,c:!!(cb&&cb.checked)})}
  if(!sc||sc.scrollTop+sc.clientHeight>=sc.scrollHeight-2)break;sc.scrollTop+=Math.floor(sc.clientHeight*0.7);await wait(130)}
 if(sc)sc.scrollTop=t0;
 const txt=doc.body.innerText,badge=+((txt.match(/선택\s*:\s*(\d+)/)||[])[1]||-1),total=+((txt.match(/전체\s*:\s*(\d+)/)||[])[1]||-1);
 const ch=[...seen.values()].filter(v=>v.c),sel=new Set(ch.map(v=>v.w).filter(w=>/\d{4}-\d{4}-\d{4}/.test(w)));
 return{sel,badge,total,rowsRead:seen.size,noWb:ch.filter(v=>!/\d{4}-\d{4}-\d{4}/.test(v.w)).length,search:W.location.search}}
async function loadTmp(){const W=window.opener,m=t=>{$('#main').innerHTML='<div id="msg">'+t+'</div>'};$('#sum').innerHTML='';$('#dup').hidden=true;$('#opt').hidden=true;
 let ok=false;try{ok=!!(W&&!W.closed&&W.location.host===location.host)}catch(e){}
 if(!ok){m('루티 [주문 조회 및 관리] 화면에서 북마크를 눌러 이 창을 연 경우에만 쓸 수 있습니다.<br><small class="mu">루티 화면에서 건을 체크한 뒤 북마크를 다시 눌러 주세요.</small>');return}
 if(!/\/order/.test(W.location.pathname)){m('루티 [주문 조회 및 관리] 화면에서 열어 주세요.');return}
 m('루티 화면에서 체크한 건을 읽는 중입니다… (루티 목록이 잠시 스크롤됩니다)');
 let R=null;try{R=readSelState(W)}catch(e){R=null}
 if(!R){try{R=await readSel(W)}catch(e){m(esc(e.message));return}}
 if(R.badge<0){m('루티 화면의 "선택 : N" 표시를 찾지 못했습니다.');return}
 if(R.how!=='state'&&R.rowsRead!==R.total){m(`루티 목록을 다 읽지 못했습니다 (읽은 행 ${R.rowsRead} / 전체 ${R.total}).<br><small class="mu">루티 탭을 화면에 띄운 상태로 다시 시도하거나, 루티 화면을 새로고침한 뒤 다시 체크해 주세요.</small>`);return}
 if(R.sel.size+R.noWb!==R.badge){m(`체크한 건수가 맞지 않아 멈췄습니다 (읽은 체크 ${R.sel.size+R.noWb} / 화면 선택 ${R.badge}). 루티 화면을 새로고침한 뒤 다시 체크해 주세요.`);return}
 if(!R.sel.size){m('루티 화면에서 체크된 운송장이 없습니다.');return}
 m(`체크 ${R.badge}건을 읽었습니다. 상세 정보를 불러오는 중…`);
 try{let it=[];const need=['serviceMethod','waybillStatus','zoneCode','inventoryLocation','supplierName','productName'];
  if(R.items&&R.items.length===R.sel.size&&need.every(k=>k in R.items[0]))it=R.items;
  else{const p=new URLSearchParams(R.search);p.delete('page');p.set('size','1000');let pg=1,tp=1;
   do{if(pg>1)await new Promise(z=>setTimeout(z,300));p.set('page',pg);m(`체크 ${R.badge}건을 읽었습니다. 상세 정보를 불러오는 중… (${pg}/${tp>1?tp:'?'}쪽)`);const d=await api('','?'+p.toString());tp=Math.min(d.totalPages||1,40);(d.items||[]).forEach(x=>{if(R.sel.has(String(x.waybillNumber||'')))it.push(x)});pg++}while(pg<=tp&&it.length<R.sel.size);
   if(it.length<R.sel.size){m(`체크한 ${R.sel.size}건 중 ${it.length}건만 찾았습니다. 루티에서 조회 조건을 좁힌 뒤 다시 시도하세요.`);return}}
  const I={badge:R.badge,noWb:R.noWb,other:0,rec:0,cx:0,out:0,ni:0,cq:0},rows=[];
  it.forEach(x=>{if(x.serviceMethod!=='교체출고'){I.other++;if(x.serviceMethod==='교체회수')I.rec++;return}const y=slim(x);if(y.k==='cx'){I.cx++;return}if(y.k==='out'){I.out++;y.k='ok';y.ot='출고건·'+(OUTS.indexOf(x.waybillStatus)>=0?(WS[x.waybillStatus]||'출고'):'출고일 '+String(x.driverOutboundCompletedDate||'').slice(5,10))}else if(y.k==='noinv'){I.ni++;y.k='ok';y.ot='미입고'}else if(y.k==='creq'){I.cq++;y.k='ok';y.ot='취소요청'}rows.push(y)});
  if(!S.norm)S.norm={rows:S.rows,un:S.un,out:S.out,at:S.at,drv:S.drv,sup:S.sup,off:S.off,center:S.center,date:S.date};
  S.tmp=true;S.tmpInfo=I;S.rows=rows;S.un=0;S.out=I.out;S.at=nowS();S.off=new Set();S.drv=new Set(rows.map(r=>r.drv));S.sup=new Set(rows.map(r=>r.sup));
  const cs=[...new Set(rows.map(r=>r.cen).filter(Boolean))];S.center=cs.join(', ')||S.center;const ds=[...new Set(rows.map(r=>r.ad).filter(Boolean))].sort();S.date=ds[0]||S.date;
  const D=new Map();try{allIssued().filter(x=>cxOk(x.h)).forEach(x=>(x.h.items||[]).forEach(w=>{if(!D.has(w))D.set(w,[]);D.get(w).push(x.h.M&&x.h.M.tmp?'임시'+x.h.n:x.h.n)}))}catch(e){}
  S.tmpD=D;$('#opt').hidden=false;boxes();render();
  if(S.gas&&ds.length){const rows0=rows;gget('a=list&from='+ds[0]+'&to='+ds[ds.length-1]).then(j=>{if(!S.tmp||S.rows!==rows0)return;j.items.forEach(x=>{const l=x.M&&x.M.tmp?'임시'+x.n:x.n;if((x.fl||{}).cancel){if(x.M)CX.add(x.M.no);(x.items||[]).forEach(w=>{const a=(D.get(w)||[]).filter(y=>y!==l);if(a.length)D.set(w,a);else D.delete(w)});return}(x.items||[]).forEach(w=>{const a=D.get(w)||[];if(a.indexOf(l)<0)a.push(l);D.set(w,a)})});render()}).catch(()=>{})}}
 catch(e){m(e.message==='LOGIN'?'루티 로그인이 만료되었습니다.':'불러오지 못했습니다: '+esc(e.message))}}
function showBtns(){const t=S.tab==='tmp';$('#csv').textContent=t?'엑셀 저장 (임시피킹 목록)':'엑셀(CSV)';$('#tp').hidden=true;$('#ts').hidden=true;$('#pr').textContent=t?'임시 발행 + 인쇄':'발행 + 인쇄';$('#iss').textContent=t?'임시 발행만':'발행만'}
$('#ts').onclick=()=>{const V=view();if(!V.ok.length){alert('전달할 대상이 없습니다.');return}const M=model(V);M.issued=nowS()+' (임시)';send(M)};
$('#tp').onclick=()=>{const V=view();if(!V.ok.length){alert('출력할 대상이 없습니다.');return}const M=model(V);M.issued='';printM(M)};
/* [지시서 목록]·[출고 관리]는 관리 페이지(wh.html)를 그대로 띄운다 — 폰·PC가 같은 화면. 이 창이 루티 연결(운송장 출력) 통로가 된다 */
let MG=null;
function mgPost(m){try{if(MG&&MG.contentWindow)MG.contentWindow.postMessage(m,'*')}catch(e){}}
function mgShow(t){let box=$('#mgw');if(!box){box=document.createElement('div');box.id='mgw';box.innerHTML='<iframe id="mgf" title="관리 페이지" allow="clipboard-write" src="'+WH+'?tab='+(t==='trk'?'out':t==='ntc'?'ntc':'list')+'&_='+Date.now()+'"></iframe>';document.body.appendChild(box);MG=box.querySelector('iframe');
  MG.onload=()=>{mgPost({t:'tc-hello',key:S.gk,who:S.who});mgPost({t:'tc-vis',on:box.hidden?0:1})}}
 else mgPost({t:'tc-tab',tab:t==='trk'?'out':t==='ntc'?'ntc':'list'});box.hidden=false;const bar=$('.bar');if(bar)box.style.top=bar.getBoundingClientRect().bottom+'px';$('#main').hidden=true;$('#opt').hidden=true;$('#sum').innerHTML='';$('#dup').hidden=true}
function mgHide(){const b=$('#mgw');if(b){b.hidden=true;mgPost({t:'tc-vis',on:0})}$('#main').hidden=false}
window.addEventListener('message',async e=>{if(!MG||e.source!==MG.contentWindow)return;const d=e.data||{};
 if(d.t==='tc-wb'){let r;try{r=await rootyWaybills(d)}catch(x){r={ok:false,err:x.message}}mgPost({t:'tc-wb-done',id:d.id,ok:!!r.ok,err:r.err||''})}});
/* 루티 운송장 출력 — 루티 [운송장 출력]과 같은 150×96mm 라벨을 이 PC에서 루티 자료로 직접 그려 인쇄한다.
   바코드: Code128(운송장번호 그대로, 하이픈 포함 — 루티 라벨에서 확인). 고객정보는 이 창에서만 쓰고 공유 저장소에 저장하지 않는다. */
const SIDO={'서울특별시':'서울','부산광역시':'부산','대구광역시':'대구','인천광역시':'인천','광주광역시':'광주','대전광역시':'대전','울산광역시':'울산','세종특별자치시':'세종','경기도':'경기','강원도':'강원','강원특별자치도':'강원','충청북도':'충북','충청남도':'충남','전라북도':'전북','전북특별자치도':'전북','전라남도':'전남','경상북도':'경북','경상남도':'경남','제주특별자치도':'제주'};
function regionOf(a){const t=String(a||'').trim().split(/\s+/);if(!t[0])return '';const s=SIDO[t[0]]||t[0].replace(/(특별자치시|특별자치도|특별시|광역시|도)$/,'');const g=(t[1]||'').replace(/(시|군|구)$/,'');return g&&s!=='세종'?s+'-'+g:s}
function loadJB(){return window.JsBarcode?Promise.resolve():new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.5/JsBarcode.all.min.js';s.onload=ok;s.onerror=()=>no(new Error('바코드 모듈을 불러오지 못했습니다 (인터넷 연결 확인)'));document.head.appendChild(s)})}
function bc(v,h){const s=document.createElementNS('http://www.w3.org/2000/svg','svg');JsBarcode(s,v,{format:'CODE128',displayValue:false,margin:0,height:h,width:2});s.setAttribute('preserveAspectRatio','none');return s.outerHTML}
/* 운송장 출력용 루티 조회: 같은 날짜·거점은 2분 동안 다시 받지 않는다(출고 → 회수 연달아 출력할 때), 쪽 사이 0.3초 쉼 */
const RFC={};async function rootyFetch(date,center){const ck=date+'|'+center,c=RFC[ck];if(c&&Date.now()-c.t<120000)return c.p;
 const p=(async()=>{const out=[];let pg=1,tp=1;const q='?driverUnassignedOnly=false&from='+addD(date,-3)+'&to='+addD(date,3)+'&dateType=orderAppointedDate&centerNames='+encodeURIComponent(center)+'&size=1000';
 do{if(pg>1)await new Promise(z=>setTimeout(z,300));const d=await api('',q+'&page='+pg);tp=Math.min(d.totalPages||1,20);(d.items||[]).forEach(x=>out.push(x));pg++}while(pg<=tp);return out})();
 RFC[ck]={t:Date.now(),p};p.catch(()=>{delete RFC[ck]});return p}
function labelHtml(o,ts){const addr=[o.recipientAddress,o.recipientDetailAddress].filter(Boolean).join(' ');return `<section class="lb">
 <div class="l1"><div class="ln"><span>운송장 번호</span><b>${esc(o.waybillNumber)}</b></div><div class="lt">${esc(ts)}<b>${esc(o.centerName||'')}</b></div><div class="lb1">${bc(o.waybillNumber,40)}</div></div>
 <div class="l2"><div class="tab">받<br>는<br>분</div><div><b class="nm">${esc(o.recipientName||'')}</b><div class="ad">${esc(addr)}</div></div></div>
 <div class="l3"><div class="sd"><span>보내는 분</span><em>${esc(o.supplierName||'')}</em></div><div class="sb">${esc(o.supplierName||'')}</div></div>
 <div class="l4">${esc(o.orderDisplayName||o.productName||'')}</div>
 <div class="l5"><div><small>개인정보 유출우려가 있으니 운송장은 폐기바랍니다.</small><b>${esc(regionOf(o.recipientAddress))}</b></div><div class="lb2">${bc(o.waybillNumber,40)}<span>${esc(o.waybillNumber)}</span></div></div></section>`}
const LBCSS=`@page{size:150mm 96mm;margin:0}*{box-sizing:border-box}html,body{margin:0;padding:0;background:#fff;color:#000;font-family:-apple-system,"Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",sans-serif}
.lb{width:150mm;height:96mm;padding:1.5mm 2mm;page-break-after:always;break-after:page;display:grid;grid-template-rows:21mm 23mm 14mm 13mm 1fr;overflow:hidden}
.lb>div{border-bottom:.5mm solid #000}.lb>div:last-child{border:0}
.l1{display:grid;grid-template-columns:1fr 42mm;grid-template-rows:7mm 1fr}.ln{display:flex;align-items:baseline;gap:3mm;padding-left:6mm}.ln span{font-size:9pt}.ln b{font-size:14pt}
.lt{grid-row:1/3;grid-column:2;text-align:right;font-size:10pt;display:flex;flex-direction:column;gap:2.5mm}.lt b{font-size:15pt}.lb1{padding:1mm 0 1.5mm 3mm}.lb1 svg{width:72mm;height:9mm;display:block}
.l2{display:grid;grid-template-columns:7mm 1fr;gap:3mm;align-items:center}.tab{background:#000;color:#fff;font-weight:900;font-size:11pt;text-align:center;line-height:1.25;padding:1mm 0;align-self:stretch;display:flex;align-items:center;justify-content:center}.nm{font-size:20pt;display:block}.ad{font-size:10pt;margin-top:1mm}
.l3{display:grid;grid-template-columns:1fr 64mm}.sd{display:flex;align-items:flex-end;gap:3mm;font-size:9.5pt;padding-bottom:1.5mm;position:relative}.sd em{font-style:normal;font-size:10pt;position:absolute;left:18mm;top:.5mm}.sb{border:.6mm solid #000;font-weight:800;font-size:12pt;text-align:center;padding-top:1mm}
.l4{font-weight:800;font-size:12.5pt;display:flex;align-items:center;padding-left:1.5mm}
.l5{display:grid;grid-template-columns:1fr 70mm;align-items:end}.l5 small{font-size:8pt;display:block}.l5 b{font-size:15pt}.lb2{text-align:center;font-size:7.5pt}.lb2 svg{width:70mm;height:10mm;display:block}`;
async function rootyWaybills(d){const kind=d.kind==='wo'?'출고':'회수';
 /* 창은 누른 직후 바로 연다(늦게 열면 브라우저가 팝업을 막음) */
 const w=window.open('','tcwb');if(!w)return{ok:false,err:'팝업이 막혔습니다. 이 창의 팝업을 허용해 주세요.'};
 w.document.open();w.document.write('<p style="font:15px sans-serif;padding:20px">'+kind+' 운송장을 루티에서 불러오는 중…</p>');w.document.close();
 try{const r=await rootyLabels(d,kind,w);if(!r.ok)w.close();return r}catch(e){w.close();throw e}}
async function rootyLabels(d,kind,w){await loadJB();const all=await rootyFetch(d.date,d.center);let L;
 if(d.kind==='wo'){const m=new Map(all.map(o=>[String(o.waybillNumber),o]));L=d.w.map(w=>m.get(String(w))).filter(Boolean);if(L.length<d.w.length&&!confirm('루티에서 찾은 출고 운송장 '+L.length+'/'+d.w.length+'개입니다 (취소·변경된 건은 빠짐).\n찾은 것만 출력할까요?'))return{ok:false,err:'출력 취소'}}
 else{const V=new Set(d.veh||[]);const vn=o=>(o.orderSpecificationMetadata||{}).vehicleNumber||'';const c=all.filter(o=>o.serviceMethod==='교체회수'&&o.waybillStatus!=='CANCELLED'&&V.has(vn(o)));const same=c.filter(o=>String(o.orderAppointedDate||'').slice(0,10)===d.date);L=(same.length?same:c).sort((a,b)=>kc(vn(a),vn(b))||kc(a.waybillNumber,b.waybillNumber))}
 if(!L.length)return{ok:false,err:d.kind==='wo'?'루티에서 이 지시서의 운송장을 찾지 못했습니다.':'이 지시서 차량의 교체회수 건이 없습니다 (회수 없는 출고).'};
 const now=new Date(),ts=now.getFullYear()+'.'+pad(now.getMonth()+1)+'.'+pad(now.getDate())+' '+pad(now.getHours())+':'+pad(now.getMinutes())+':'+pad(now.getSeconds());
 const body=L.map(o=>labelHtml(o,ts)).join('');
 w.document.open();w.document.write('<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8"><title>'+kind+' 운송장 '+L.length+'장 · '+esc(d.no)+'</title><style>'+LBCSS+'</style></head><body>'+body+'<script>setTimeout(function(){print()},400)<\/script></body></html>');w.document.close();
 return{ok:true,n:L.length}}
function tab(t){S.tab=t;document.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===t));$('#mk').style.display=t==='make'?'contents':'none';showBtns();
 if((t==='list'||t==='trk'||t==='ntc')&&S.gas&&S.gk){mgShow(t);return}
 if(t==='ntc'){mgHide();$('#main').innerHTML='<div id="msg">공지는 공유 저장소 연결이 필요합니다. 상단 [공유 설정]을 먼저 해 주세요.</div>';return}
 mgHide();
 if(t==='trk'){renderTrk();return}
 if(t==='tmp'){loadTmp();return}
 if(S.tmp){restoreNorm();if(S.at&&S.sup)boxes()}
 if(t==='list'){S.cur=null;renderList()}else{$('#opt').hidden=!S.at;if(S.at)render();else{$('#sum').innerHTML='';$('#dup').hidden=true;$('#main').innerHTML='<div id="msg">출고예정일(약속일)과 거점을 고르고 [조회]를 누르세요.<br><small class="mu">기사가 배정된 교체출고만 대상입니다. 발행한 지시서는 [지시서 목록]에 일자별로 쌓이고, 거기서 폰으로 전달할 수 있습니다.</small></div>'}}}
$('#go').onclick=load;$('#nd').onchange=e=>{S.noDup=e.target.checked;render()};
$('#who').onchange=e=>{S.who=e.target.value.trim();LS('who',S.who);e.target.classList.toggle('req',!S.who);render()};$('#due').onchange=()=>render();
$('#pr').onclick=async e=>{e.target.disabled=true;try{await issueFlow(true)}finally{e.target.disabled=false}};
$('#iss').onclick=async e=>{e.target.disabled=true;try{await issueFlow(false)}finally{e.target.disabled=false}};
function loadXLSX(){return window.XLSX?Promise.resolve():new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';s.onload=ok;s.onerror=no;document.head.appendChild(s)})}
function dl(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},800)}
async function tmpExcel(){const V=view();if(!V.ok.length){alert('저장할 대상이 없습니다.');return}
 const rows=V.ok.slice().sort((a,b)=>zc(a.zone,b.zone)||kc(a.veh,b.veh)||kc(a.wb,b.wb)),veh=new Set(rows.map(r=>r.veh)).size;
 const name='임시피킹 '+ymd(new Date()).replace(/-/g,'')+'-수취인'+veh+'건-운송장'+rows.length+'건';
 const A=[['No','출고예정일(약속일)','거점','존코드','수취인(차량번호)','차종','업체명','제품명','SKU','운송장번호','메인기사','서브기사','운송장상태','별도 표기','이전 발행 차수','주문번호','보관품 재출고','운송장번호(외부)']];
 rows.forEach((r,i)=>A.push([i+1,r.ad,r.cen||S.center,r.zone,r.veh,r.model,r.sup,r.pn,r.sku,r.wb,r.drv||'미배정',r.sub?'Y':'',(WS[r.ws]||r.ws)+(r.ri?' (재고위치 거점)':''),r.ot||'',(V.D.get(r.wb)||[]).join('·'),r.on,r.kp?'Y':'',r.xw||'']));
 try{await loadXLSX();const ws=XLSX.utils.aoa_to_sheet(A);ws['!cols']=[4,12,10,11,13,14,16,44,12,16,9,6,16,12,8,16,8,18].map(w=>({wch:w}));ws['!autofilter']={ref:'A1:R'+A.length};
  const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'임시피킹');dl(new Blob([XLSX.write(wb,{bookType:'xlsx',type:'array'})],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),name+'.xlsx');$('#hi').textContent='저장됨: '+name+'.xlsx (다운로드 폴더)'}
 catch(e){const q=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"';dl(new Blob(['\ufeff'+A.map(x=>x.map(q).join(',')).join('\r\n')],{type:'text/csv'}),name+'.csv');$('#hi').textContent='엑셀 변환 도구를 불러오지 못해 CSV로 저장했습니다: '+name+'.csv'}}
$('#csv').onclick=()=>{if(S.tmp){tmpExcel();return}const V=view(),q=v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"';
 const L=[['지시번호','출고예정일(약속일)','거점','메인기사','서브기사','업체명','존코드','차량번호','차종','제품명','SKU','운송장번호','구분','이전 발행 차수']];
 V.ok.concat(V.ex).sort((a,b)=>zc(a.zone,b.zone)||kc(a.veh,b.veh)).forEach(r=>L.push([NO(S.center,S.date,V.no),S.date,S.center,r.drv,r.sub?'Y':'',r.sup,r.zone,r.veh,r.model,r.pn,r.sku,r.wb,r.k==='ok'?(r.ri?'피킹(접수확정·재고위치)':'피킹')+(r.ot?' · '+r.ot:''):(r.k==='noinv'?'미입고':'취소요청'),(V.D.get(r.wb)||[]).join('·')]));
 const b=new Blob(['﻿'+L.map(x=>x.map(q).join(',')).join('\r\n')],{type:'text/csv'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='피킹지시서_'+S.center+'_'+S.date+'.csv';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)};
tab('make');
/* v55: 공유 저장소가 연결되면 지시서 목록·출고 관리는 관리 페이지(iframe)가 직접 불러오므로, 예전 화면용 미리 불러오기(무거운 요청 4건)와 그 캐시는 쓰지 않는다 */
if(S.gas&&S.gk){try{localStorage.removeItem('tcpk_lcache');localStorage.removeItem('tcpk_tcache')}catch(e){}}
/* 여러 명 동시 사용: 다른 사람이 바꾼 내용을 30초마다, 그리고 창으로 돌아올 때 받아 온다 */
function poll(){if(!S.gas||!S.gk||document.hidden||$('#mo'))return;if($('#mgw')&&!$('#mgw').hidden)return;const a=document.activeElement;if(a&&/INPUT|SELECT|TEXTAREA/.test(a.tagName)&&a.type!=='checkbox')return;
 if(S.tab==='list'&&!PEND){const key=lkey(),seq=LSEQ;lfetch().then(n=>{const o=LC[key],same=o&&JSON.stringify([o.srv,o.trk])===JSON.stringify([n.srv,n.trk]);LC[key]=n;LS('lcache',n);if(same||seq!==LSEQ||S.tab!=='list'||lkey()!==key||PEND||$('#mo'))return;const id=curId();lbuild(n.srv,n.trk,'');S.cur=null;if(id){const j=LIST.findIndex((x,i)=>{S.cur=i;return curId()===id});S.cur=j<0?null:j}ldraw()}).catch(()=>{})}
 if(S.tab==='trk'&&!TPEND&&TLOADED){const key=tkey(),seq=TSEQ;tfetch().then(n=>{const same=JSON.stringify([TL.map(tstrip).map(x=>{const z=Object.assign({},x);delete z._open;return z}),TSRV.map(r=>{const z=Object.assign({},r);delete z._x;return z})])===JSON.stringify([n.trk,n.srv]);TC[key]=n;LS('tcache',n);if(same||seq!==TSEQ||S.tab!=='trk'||tkey()!==key||TPEND||$('#mo'))return;const op={};document.querySelectorAll('.tk').forEach(c=>{const d=c.querySelector('details');if(d&&d.open)op[c.dataset.id]=1});n.trk.forEach(x=>{if(op[x.id])x._open=true});TL=n.trk;TSRV=n.srv;tdraw()}).catch(()=>{})}}
/* 공지 (지시자 대상): 탭에 안 읽은 수, 긴급은 열 때 한 번 팝업 */
let NT=[],NTAT=0;async function ntcPoll(force){if(!S.gas||!S.gk||(!force&&Date.now()-NTAT<60000))return;NTAT=Date.now();try{const j=await gget('a=ntc');const t=new Date(),td=t.getFullYear()+'-'+pad(t.getMonth()+1)+'-'+pad(t.getDate());NT=(j.ntc||[]).filter(n=>n.on&&!(n.from&&td<n.from)&&!(n.till&&td>n.till)&&n.to.indexOf('pc')>=0);ntcBadge();ntcPopup()}catch(e){}}
function ntcUn(){return NT.filter(n=>!(S.who&&n.acks.some(a=>a.r==='pc'&&a.n===S.who)))}
function ntcBadge(){const u=ntcUn().length,b=$('#nc');if(b){b.textContent=u?u:'';b.style.cssText=u?'display:inline-block;min-width:17px;background:#d92d20;color:#fff;border-radius:9px;font-size:11px;padding:0 5px;margin-left:2px':''}}
function ntcPopup(){if($('#mo'))return;const n=ntcUn().find(z=>z.lvl==='긴급'&&!sessionStorage.getItem('tc_pop_'+z.no));if(!n)return;sessionStorage.setItem('tc_pop_'+n.no,'1');const mo=document.createElement('div');mo.id='mo';
 mo.innerHTML=`<div><h3><span style="background:#d92d20;color:#fff;border-radius:4px;padding:1px 7px;font-size:12px;margin-right:6px">긴급 공지</span>${esc(n.title)}</h3>${n.body?`<div style="white-space:pre-wrap;font-size:14px;margin:6px 0">${esc(n.body)}</div>`:''}<div class="mu">${esc(n.by)} · ${esc(String(n.at).slice(5,16))}</div><div style="display:flex;gap:8px;justify-content:flex-end;margin-top:12px"><button id="np_x">나중에</button><button class="pri" id="np_o">확인했습니다</button></div></div>`;document.body.appendChild(mo);
 mo.querySelector('#np_x').onclick=()=>mo.remove();mo.querySelector('#np_o').onclick=async()=>{if(!needWho())return;mo.remove();try{const r=await gpost({a:'ack',no:n.no,name:S.who});n.acks.push({r:'pc',n:S.who,at:r.at||''});ntcBadge();mgPost({t:'tc-reload'})}catch(e){alert('확인을 저장하지 못했습니다: '+e.message)}}}
setTimeout(()=>ntcPoll(true),1500);setInterval(()=>{if(!document.hidden&&!($('#mgw')&&!$('#mgw').hidden))ntcPoll()},30000);/* 관리 페이지가 보이는 동안에는 그쪽이 공지를 함께 받음 */
setInterval(poll,30000);window.addEventListener('focus',()=>setTimeout(poll,300));document.addEventListener('visibilitychange',()=>{if(!document.hidden)poll()});
}

if(location.host!=='admin.flowfix.co.kr'){alert('루티 관리자 화면(admin.flowfix.co.kr)에 로그인한 탭에서 눌러주세요.');return}
var w=window.__TC_W&&!window.__TC_W.closed?window.__TC_W:window.open('','tcPicking');window.__TC_W=null;
if(!w){alert('팝업이 차단되었습니다. 주소창 오른쪽의 팝업 차단 아이콘에서 허용한 뒤 다시 눌러주세요.');return}
/* 루티 탭마다 피킹 지시서 탭 하나 (v53): 도구 창은 그린 뒤 고유 이름으로 바꿔, 다른 루티 탭의 북마크가 이 창을 가져가지 않게 한다.
   같은 루티 탭에서 다시 누르면 새 탭에 새로 그리고 이전 탭은 닫는다 (예전의 '같은 탭에 다시 그리기'와 같은 효과) */
var prev=window.__TC_TOOL;if(prev&&prev!==w&&!prev.closed){try{prev.close()}catch(e){}}
w.document.open();w.document.write('<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>피킹지시서</title></head><body><script>('+pick.toString()+')()<\/script></body></html>');w.document.close();
try{w.name='tcPicking-'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}catch(e){}window.__TC_TOOL=w;
})();