/* 루티 주문현황 대시보드 v50 · 2026-11-27 — 루티 관리자 화면에서 로더 북마크로 불러 씀 */
(function(){function dash(){
try{if(window.__rcKill)window.__rcKill()}catch(e){}
const API='https://api-prod.flowfix.co.kr/api/v1/admin/orders',SELLER=62,SUP='https://api-prod.flowfix.co.kr/api/v1/suppliers',CK='flowfix-admin-access-token';
const WS={PENDING_RECEIPT:'접수대기',RECEIPT_CONFIRMED:'접수확정',GATHERING_INBOUND_COMPLETED:'집하입고완료',INBOUND_COMPLETED:'입고완료',DRIVER_OUTBOUND_WAITING:'기사출고대기',CENTER_OUTBOUND_COMPLETED:'센터출고',DRIVER_OUTBOUND_COMPLETED:'기사출고',WORK_IN_PROGRESS:'작업중',WORK_COMPLETED:'작업완료',COLLECTING:'회수중',COLLECTION_COMPLETED:'회수완료',RETURN_COMPLETED:'반납완료',CANCELLED:'취소'};
const OS={PENDING_RECEIPT:'접수대기',GATHERING_WAITING:'집하대기',GATHERING_CONFIRMED:'집하확정',DIRECT_RECEIPT:'직송접수',RECEIPT_COMPLETED:'접수완료',RECEIPT_FINALIZED:'직송확정',PURCHASE_ORDER_REQUESTED:'발주요청',PURCHASE_ORDER_CONFIRMED:'발주확정',CANCEL_REQUESTED:'취소요청',CANCELLATION_REQUESTED:'취소요청',RESCHEDULED:'재약속',COMPLETED:'완료',CANCELLED:'취소'};
const LKD=[10,3];const PAST_OUT=['DRIVER_OUTBOUND_COMPLETED','WORK_IN_PROGRESS','WORK_COMPLETED','COLLECTING','COLLECTION_COMPLETED','RETURN_COMPLETED'];
const TYPES=[['out','출고·설치'],['col','회수']];
const WK=['일','월','화','수','목','금','토'];
const CR=/^(DELIVERY|COURIER|PARCEL|CARRIER|SHIPPING|SHIPMENT)[A-Z_]*(COMPLETED|DELIVERED)$/,wsl=k=>WS[k]||(CR.test(k)?'택배사완료':k);
const wterm=(m,t,w)=>t==='col'?(w==='COLLECTION_COMPLETED'||(m==='택배회수'&&CR.test(w))):(w==='WORK_COMPLETED'||w==='RETURN_COMPLETED'||CR.test(w));
const S={rows:[],center:'',min:0,master:false,dup:false,lc:null,cOk:null,cens:new Set(['일산FDC','경기광주FDC','인천FDC','화성FDC','남양주FDC','원주FDC','전주FDC','광주FDC','경산FDC','제주FDC','청주FDC','일산FDC(일반설치)','아산FDC','원주FDC(B2B)','청주FDC(B2B)']),next:0,last:null,busy:false,err:'',prod:'',seller:String(SELLER),sellers:[{id:String(SELLER),name:'레드캡'}],selOk:null,from:'',to:'',d1:'',d2:'',mm:false,tab:'cen',pq:null,cq:null,fresh:false,prog:'',bc:'',tk:false,dd:null,DD:{},go:false,cp:[],oc:{},wf:'',tdRows:null,dvRows:null,dvMsg:'',cache:null,openAt:Date.now(),fullAt:0,did5:false,noRn:false,pgInfo:''};
try{const m=+localStorage.getItem('rcDashMin2');if(m===30||m===60)S.min=m}catch(e){}
const TC_CENS=[...S.cens];S.op='tc';const LK=k=>S.op==='tc'?k:k+'_'+S.op;
function restore(){try{const v=localStorage.getItem(LK('rcDashSeller'));if(v!==null){const o=JSON.parse(v);const id=String(o.id);if(!id||S.sellers.some(x=>x.id===id)||S.selOk!==true){S.seller=id;if(id&&!S.sellers.some(x=>x.id===id))S.sellers.push({id:id,name:String(o.name)})}}}catch(e){}
 try{const c=localStorage.getItem(LK('rcDashCenter'));S.center=c||''}catch(e){S.center=''}
 try{if(S.op!=='tc')for(const c of JSON.parse(localStorage.getItem(LK('rcDashCens'))||'[]'))S.cens.add(String(c))}catch(e){}}
restore();
try{const t=localStorage.getItem('rcDashTab');if(t)S.tab=t}catch(e){}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const NF=new Intl.NumberFormat('ko-KR'),f=n=>NF.format(Number(n));
const z=n=>n?f(n):'<span class="z">·</span>';
const pct=(a,b)=>b?Math.round(a/b*1000)/10:0;
const d10=v=>v?String(v).slice(0,10):'';
const CSS=`
:root{--bg:#ffffff;--sub:#f5f6f9;--ink:#171a26;--ink2:#565b70;--mute:#8b90a3;--line:#e6e8ef;--acc:#4b5fe0;--soft:#eef0ff;--good:#0a7d3c;--goodbg:#e6f6ec;--warn:#8a5a00;--warnbg:#fff4d6;--crit:#c0302f;--critbg:#fdeaea;--h1:#eef0ff;--h2:#d5daff;--h3:#a9b3f5;--h4:#4b5fe0;--ord:#f1f3f8}
@media (prefers-color-scheme:dark){:root{--bg:#14151d;--sub:#1c1e2a;--ink:#eff0f6;--ink2:#c0c3d4;--mute:#888da3;--line:#2c2f43;--acc:#8b9bff;--soft:#23274a;--good:#4cc77e;--goodbg:#143122;--warn:#f5b93a;--warnbg:#3a2e0c;--crit:#f07878;--critbg:#3c1b1b;--h1:#20244a;--h2:#2c3270;--h3:#4450a8;--h4:#8b9bff;--ord:#20222f}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:13px/1.5 -apple-system,"Apple SD Gothic Neo","Pretendard","Noto Sans KR","Malgun Gothic",sans-serif;font-variant-numeric:tabular-nums}
header{position:sticky;top:0;z-index:5;background:#1b1d33;color:#f3f4fb;padding:8px 12px;display:flex;flex-wrap:wrap;gap:6px 7px;align-items:center}header input[type=date]{width:116px;padding:4px 4px}
header b{font-size:15px;margin-right:4px}#ver{font-size:11px;color:#8f95b8;margin-right:4px}header #cen{width:110px}header label{font-size:12px;color:#aab0cf;display:inline-flex;gap:6px;align-items:center}
#stamp{margin-left:auto;font-size:12px;color:#c9cde6;display:inline-flex;align-items:center}#stamp.busy{background:#fff4d6;color:#8a5a00;font-weight:700;border-radius:999px;padding:3px 12px;gap:8px}.okb{color:#4cc77e;margin-right:4px}
@keyframes rot{to{transform:rotate(360deg)}}.ldsp{width:13px;height:13px;border-radius:50%;border:2px solid #e3c98a;border-top-color:#8a5a00;display:inline-block;animation:rot .8s linear infinite}
#pb{position:absolute;left:0;right:0;bottom:-4px;height:4px;background:#30334a}#pb[hidden]{display:none}#pb i{display:block;height:100%;width:3%;background:#f5b93a;transition:width .3s}
#stamp{font-size:12.5px;gap:6px;white-space:nowrap}.lut{font-size:14px;color:#fff;font-variant-numeric:tabular-nums}.ago{background:#2f3354;border-radius:999px;padding:1px 8px;font-size:11.5px}.nx{color:#8f95b8;font-size:11.5px}#stamp.old{background:#fff4d6;color:#8a5a00;border-radius:999px;padding:3px 8px}#stamp.old .lut{color:#5c3b00}#stamp.old .ago{background:#f5b93a;color:#3d2800;font-weight:700}#stamp.old .nx{color:#8a5a00}
#pwm{position:fixed;inset:0;background:rgba(15,17,30,.55);display:grid;place-items:center;z-index:50}#pwm form{background:#fff;border-radius:12px;padding:22px;width:min(380px,90vw);display:flex;flex-direction:column;gap:10px;box-shadow:0 10px 40px rgba(0,0,0,.3)}#pwm h3{margin:0;font-size:16px}#pwm p{margin:0;font-size:12.5px;color:#565b70}#pwm input{padding:8px 10px;font-size:14px;border:1px solid #c9cde0;border-radius:8px}#pwm .er{color:#c0392b;min-height:18px}#pwm div{display:flex;gap:8px;justify-content:flex-end}
.dupn{max-width:560px;margin:80px auto;text-align:center;line-height:1.7}.dupn h3{font-size:17px;margin:0 0 8px}
#stamp.busy{white-space:nowrap}@media(max-width:1500px){.ldx,.nx{display:none}}
#app.dim{opacity:.45;pointer-events:none;transition:opacity .2s}.stopb{margin-top:6px;font-size:14px;font-weight:700;padding:8px 22px;border-radius:8px;border:1px solid #c0302f;background:#fff;color:#c0302f;cursor:pointer}.stopb:hover{background:#fdeaea}#stamp .stopx{border:1px solid #c0302f;background:#c0302f;color:#fff;border-radius:999px;padding:1px 10px;font-size:11.5px;font-weight:700;cursor:pointer;margin-right:2px}
.ldf{display:flex;flex-direction:column;align-items:center;padding:72px 20px;gap:14px}.ldf h3{margin:0;font-size:18px}.ldf p{margin:0;color:#565b70}.ldf .ldft{font-size:12px;color:#8b90a3}.ldbig{width:54px;height:54px;border-radius:50%;border:5px solid #e8ebff;border-top-color:#4b5fe0;animation:rot 1s linear infinite}
.ldbar{width:min(420px,90%);height:10px;border-radius:5px;background:#e8ebff;overflow:hidden}.ldbar i{display:block;height:100%;background:#4b5fe0;border-radius:5px;transition:width .3s}
.ldst{display:flex;flex-direction:column;gap:6px;width:min(420px,90%);font-size:13px}.ldst div{display:flex;gap:8px;align-items:center}.ldst .ldcur{font-weight:700}.ldst .ldr{margin-left:auto;color:#8b90a3;font-variant-numeric:tabular-nums}.ldck{width:18px;height:18px;border-radius:50%;display:inline-grid;place-items:center;font-size:11px;font-weight:700}.ldck.ok{background:#e6f6ec;color:#0a7d3c}.ldck.now{background:#4b5fe0;color:#fff}.ldck.wt{background:#eef0f5;color:#8b90a3}
@media(prefers-reduced-motion:reduce){.ldsp,.ldbig{animation-duration:3s}}#stamp i{display:inline-block;width:7px;height:7px;border-radius:50%;background:#4cc77e;margin-right:6px}#stamp.err i{background:#f07878}
.ctl{display:contents}
select,button,input{font:inherit;font-size:12.5px;border:1px solid var(--line);border-radius:6px;padding:4px 8px;background:var(--bg);color:var(--ink);cursor:pointer}
header select,header input,header button{border-color:#3a3d5c;background:#262946;color:#f3f4fb;color-scheme:dark}
header button.pri{background:#5b6df0;border-color:#5b6df0;font-weight:600}button:disabled{opacity:.5;cursor:default}
main{max-width:1320px;margin:0 auto;padding:0 20px 40px}
.msg{margin-top:12px;padding:8px 12px;border-left:4px solid var(--crit);background:var(--critbg);color:var(--crit);font-weight:600}
.fbar{display:flex;flex-wrap:wrap;gap:6px 8px;align-items:center;padding:12px 0 8px}.fbar>span{font-weight:700;margin-right:4px}.fbar>button{border-radius:999px;padding:3px 12px}.fbar>button.on{background:var(--acc);border-color:var(--acc);color:#fff;font-weight:600}.fbar .per{margin-left:auto;color:var(--ink2);font-size:12px}
.kpis{display:flex;flex-wrap:wrap;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:8px 0}
.kpi{flex:1 1 130px;padding:0 16px;border-left:1px solid var(--line)}.kpi:first-child{border-left:0;padding-left:0}
.kpi .l{font-size:11px;color:var(--ink2);font-weight:500}.kpi .v{font-size:20px;font-weight:700;line-height:1.25}.kpi.big .v{font-size:24px}.kpi .v small{font-size:11px;color:var(--mute);font-weight:500;margin-left:3px}.kpi .d{font-size:11px;color:var(--mute)}
.tdy{border-top:0;padding:16px 0 0}.tdy td.k{text-align:left;font-weight:600;padding-left:14px}.tdy tr.now td{background:transparent}.tdy tr.ord td:not([rowspan]){background:var(--ord)}.tdy tbody tr:hover td:not([rowspan]){background:var(--soft)}.tdy tr.now td[rowspan]{background:var(--soft)}.tdy td[rowspan]{vertical-align:middle;border-right:1px solid var(--line)}
.top{display:grid;grid-template-columns:minmax(0,2fr) minmax(320px,1fr);gap:24px;padding:16px 0}
@media (max-width:980px){.top{grid-template-columns:minmax(0,1fr)}}
h2{font-size:14px;margin:0 0 8px;display:flex;flex-wrap:wrap;gap:8px;align-items:baseline}h2 small,.note{font-size:11.5px;color:var(--mute);font-weight:400}.note{margin:8px 0 0}
section{padding:16px 0;border-top:1px solid var(--line)}
.tw{overflow-x:auto}.dtt{font-size:12.5px}.dtt th,.dtt td{padding-left:6px;padding-right:6px;white-space:nowrap}
table{border-collapse:collapse;font-size:13px}
th{font-size:12px;color:var(--ink2);font-weight:600;text-align:right;padding:6px 14px;white-space:nowrap;border-bottom:1px solid var(--line)}
td{padding:6px 14px;text-align:right;white-space:nowrap;border-bottom:1px solid var(--line)}
th:first-child,td:first-child{text-align:left;padding-left:0}td:first-child{font-weight:600}
tbody tr:hover td{background:var(--sub)}tr.tot td{font-weight:700;border-bottom:0;border-top:1px solid var(--ink2)}
tr.now td{background:var(--soft)}tr.bad td:first-child{color:var(--crit)}
.sub{display:block;font-size:11px;color:var(--mute);font-weight:400}.z{color:var(--mute)}
.bd{width:100%}.bd th,.bd td{text-align:center;padding:4px 6px}.bd th:first-child,.bd td:first-child{text-align:left}
.bd th .sub{font-size:10.5px}.bd th.late{color:var(--crit)}.bd th.today{color:var(--acc)}
.bd td{height:46px;min-width:70px;position:relative}.bd td b{display:block;font-size:17px;line-height:1.15}.bd td small{font-size:11px;color:var(--mute)}
.bd td.crit{background:var(--critbg)}.bd td.crit b{color:var(--crit)}.bd td.warn{background:var(--warnbg)}.bd td.warn b{color:var(--warn)}.bd td.ok b{color:var(--good);font-size:14px}
.bd td u{position:absolute;left:6px;right:6px;bottom:3px;height:3px;border-radius:2px;background:var(--line);overflow:hidden}.bd td u i{display:block;height:100%;background:var(--good)}
.bd tr.tot small{font-weight:400}.bd tr.prd td{background:var(--sub)}.bd tr.prd.ldf td{border-top:2px solid var(--ink2)}.bd tr.prd td b{font-size:15px}.bd tr.prd td.crit{background:var(--critbg)}.bd tr.prd td.warn{background:var(--warnbg)}.bd td.sum,.bd th.sum{border-left:1px solid var(--line)}
.pr{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:8px;padding:7px 12px;border-left:4px solid var(--line);margin-bottom:4px}
.pr span{font-weight:500}.pr small{display:block;font-size:11px;color:var(--mute);font-weight:400}.pr b{font-size:21px;text-align:right;line-height:1.1}.pr b small{font-size:11px}
.pr.crit{border-color:var(--crit);background:var(--critbg)}.pr.crit b{color:var(--crit)}.pr.warn{border-color:var(--warn);background:var(--warnbg)}.pr.warn b{color:var(--warn)}.pr.none b{color:var(--mute);font-size:13px;font-weight:500}
.up{color:var(--crit)}.dn{color:var(--good)}
.ex{display:flex;flex-wrap:wrap;gap:4px 8px;align-items:center;padding:6px 0;border-top:1px solid var(--line);font-size:12.5px}.ex b{margin-left:auto}.ex small{flex-basis:100%;color:var(--mute);font-size:11px}
.num{border:0;background:none;padding:0;font:inherit;color:inherit;cursor:pointer;text-decoration:underline dotted;text-underline-offset:3px}.num:hover{color:var(--acc)}#ddl td,#ddl th{text-align:left}#pane{position:fixed;left:0;right:0;bottom:0;height:46vh;z-index:30;background:var(--bg);border-top:2px solid var(--acc);box-shadow:0 -10px 30px rgba(20,24,50,.16);display:flex;flex-direction:column}body.pnbig #pane{height:86vh}body.pnon main{padding-bottom:calc(46vh + 24px)}body.pnbig main{padding-bottom:calc(86vh + 24px)}#pane #ddl{padding:0;border:0;display:flex;flex-direction:column;height:100%;min-height:0}#pane h2.ph{margin:0;padding:9px max(20px,calc((100vw - 1320px)/2 + 20px));border-bottom:1px solid var(--line);align-items:center;gap:6px 10px}#pane h2.ph small{font-size:12px}#pane h2.ph .sp{flex:1}#pane h2.ph button{font-size:12.5px;font-weight:600;border:1px solid var(--line);border-radius:6px;padding:3px 10px;background:var(--bg);color:var(--ink);cursor:pointer}#pane h2.ph button:hover{border-color:var(--acc);color:var(--acc)}#pane .pb{flex:1;min-height:0;overflow:auto;padding:8px max(20px,calc((100vw - 1320px)/2 + 20px)) 16px}#pane .pb .tw{overflow:visible}#pane thead th{position:sticky;top:-8px;background:var(--bg);z-index:1}.num.on{outline:2px solid var(--acc);outline-offset:1px;border-radius:4px;color:var(--acc)}.bd td .num{text-decoration:none}.bd td .num:hover{text-decoration:underline}.kpi .num,.pr .num{text-decoration:none}.kpi .num:hover,.pr .num:hover{text-decoration:underline}.num.up{color:var(--crit)}.dtt td.up{color:var(--crit);font-weight:600}
.sb{display:inline-block;padding:1px 8px;border-radius:999px;font-size:11px;font-weight:600;color:#fff;line-height:1.6}.sb.na{background:#d23b3a}.sb.wt{background:#f2b52b;color:#3d2a00}.sb.ou{background:#4b5fe0}.sb.dn{background:#0f8a45}.sb.cx{background:var(--sub);color:var(--mute)}
.lkt td.bz{background:var(--goodbg)}.lkt td.mz{background:var(--critbg)}.lkt th.bz{background:var(--goodbg)!important;color:var(--good)}.lkt th.mz{background:var(--critbg)!important;color:var(--crit)}.lkt tr.h1 th.bz,.lkt tr.h1 th.mz{text-align:center}
.lkt td.rep{color:var(--mute)}.lkt td.vk{font-weight:700}
.todo{margin:14px 0 2px}.tcs{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px}.tc{background:var(--sub);border-radius:8px;padding:8px 12px}.tc .l{font-size:12px;color:var(--ink2)}.tc .v{font-size:22px;font-weight:700;line-height:1.35}.tc .v small{font-size:12px}.tc .d{font-size:11.5px;color:var(--mute)}.tc.hot{background:var(--critbg)}.tc.hot .l{color:var(--crit)}.tc.none .v{color:var(--mute);font-size:15px;font-weight:500}
.pf{padding:2px 0 6px;margin:0;border:0;gap:6px;align-items:center}.pf input[type=search]{width:220px;padding:3px 8px;font-size:12.5px;border:1px solid var(--line);border-radius:6px}.pf select{font-size:12.5px;padding:2px 4px;max-width:180px}.pf .clr{color:var(--crit)}.pf .mute{color:var(--mute);font-size:12px}
th.lkc,td.lkc{background:var(--critbg)}
.lkt tbody td:nth-child(1),.lkt tr.h1 th:nth-child(1){position:sticky;left:0;z-index:2;background:var(--bg)}.lkt tbody td:nth-child(2),.lkt tr.h1 th:nth-child(2){position:sticky;left:var(--c1w,84px);z-index:2;background:var(--bg);box-shadow:2px 0 0 var(--line)}.lkt thead th:nth-child(1),.lkt thead th:nth-child(2){z-index:4}.mf{padding:2px 0 8px;margin:0;border:0}.lkt td.ar,.lkt th.ar{color:var(--mute);padding:0 2px;text-align:center}.lkt tbody tr.grp{border-top:2px solid var(--ink2)}.lkt tbody tr.grp td{border-top:2px solid var(--ink2)}
#pane .lkt thead tr.h2 th{top:var(--h1h,20px)}
.lnk{border:0;background:none;color:var(--acc);padding:0;font-weight:600}
.pill{display:inline-block;font-size:11px;font-weight:600;padding:1px 7px;border-radius:999px;background:var(--sub);color:var(--ink2)}.pill.crit{background:var(--critbg);color:var(--crit)}.pill.now{background:var(--acc);color:#fff}
.rate{display:inline-flex;align-items:center;gap:8px;font-size:12px;font-weight:600}.rate i{display:inline-block;width:80px;height:8px;border-radius:4px;background:var(--sub);overflow:hidden}.rate u{display:block;height:100%;background:var(--good)}
.msg.dvb{border-color:var(--acc);background:var(--soft);color:var(--ink);font-weight:500;margin:0 0 12px}
.dv{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:12px}.dv small{color:var(--mute)}
.tabs{display:flex;flex-wrap:wrap;gap:2px;border-bottom:1px solid var(--line);margin-bottom:12px}.tabs button{border:0;border-bottom:2px solid transparent;border-radius:0;background:none;padding:6px 12px;color:var(--ink2);font-size:13px}.tabs button.on{color:var(--acc);border-color:var(--acc);font-weight:700}
.tp h3{display:none;font-size:13px;margin:16px 0 8px}
.fl{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:24px}.fl h4{font-size:12.5px;margin:0 0 4px;color:var(--ink2)}
.st{display:grid;grid-template-columns:72px minmax(0,1fr) 110px;gap:8px;align-items:center;margin-top:6px}.st .bar{height:18px;border-radius:3px;background:var(--sub);overflow:hidden}.st .bar i{display:block;height:100%;background:var(--acc)}.st.end .bar i{background:var(--good)}.st .n{font-weight:600}.st .n small{color:var(--mute);font-weight:400;margin-left:4px}
.seg{display:inline-flex;margin-left:12px;border:1px solid var(--line);border-radius:6px;overflow:hidden}.seg button{border:0;border-radius:0;padding:3px 12px;font-size:12.5px;font-weight:500;background:var(--bg);color:var(--ink2)}.seg button.on{background:var(--acc);color:#fff;font-weight:600}.seg+select{margin-left:8px}
.chk{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}.chk b{display:block;font-size:18px}.chk small{color:var(--mute);font-size:11.5px}
@media print{header .ctl,.tabs{display:none}.tp[hidden]{display:block!important}.tp h3{display:block}}`;
document.head.insertAdjacentHTML('beforeend','<meta name="viewport" content="width=device-width,initial-scale=1"><style>'+CSS+'</style>');
document.body.innerHTML='<header><b>루티 현황</b><span id="ver" title="대시보드 버전">v50 · 2026-11-27</span><div class="ctl"><label>거래처 <select id="sel"></select></label><label title="기간 기준 — 약속일 또는 접수일"><select id="pbs"><option value="ap">약속일</option><option value="dt">접수일</option></select> <input type="date" id="df"> ~ <input type="date" id="dt"></label><button id="dx" title="전체 기간 조회 — 서버 부담이 커서 마스터 관리자 비밀번호가 필요합니다">전체 🔒</button><label title="센터를 고르면 그 센터만 서버에서 받아옵니다">센터 <select id="cen"></select></label></div><span id="pb" hidden><i></i></span><span id="stamp"><i></i>불러오는 중…</span><div class="ctl"><label>자동 <select id="iv"><option value="0">끄기</option><option value="30">30분</option><option value="60">60분</option></select></label><button id="snap">스냅샷 저장</button><button class="pri" id="re">새로고침</button></div></header><main id="app"></main>';
const $=s=>document.querySelector(s);
$('#iv').value=String(S.min);
const mx=()=>S.pb==='ap'?63:60,PBL=()=>S.pb==='ap'?'약속일':'접수일',pk=r=>S.pb==='ap'?r.ap:r.dt,addM=(d,n)=>{const [y,m,dd]=d.split('-').map(Number),t=new Date(y,m-1+n,1),last=new Date(t.getFullYear(),t.getMonth()+1,0).getDate(),x=new Date(t.getFullYear(),t.getMonth(),Math.min(dd,last));return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')},defR=pb=>{const t=today();return pb==='ap'?[addM(t,-1),addM(t,1)]:[addD(t,-10),t]};
try{S.pb=localStorage.getItem(LK('rcDashPb'))||'ap'}catch(e){S.pb='ap'}if(S.pb!=='dt')S.pb='ap';$('#pbs').value=S.pb;{const R=defR(S.pb);S.from=R[0];S.to=R[1]}$('#df').value=S.from;$('#dt').value=S.to;S.fol=S.pb==='dt';S.apDef=S.pb==='ap';
$('#pbs').onchange=async e=>{S.pb=e.target.value==='dt'?'dt':'ap';try{localStorage.setItem(LK('rcDashPb'),S.pb)}catch(x){}S.ALL=null;const R=defR(S.pb);await setRange(R[0],R[1])};
function token(){const c=document.cookie.split(';').map(x=>x.trim()).find(x=>x.indexOf(CK+'=')===0);return c?decodeURIComponent(c.slice(CK.length+1)):''}
function ptype(r){const v=String(r.orderSpecificationType||'').trim(),M={TIRE:'타이어',ENGINE_OIL:'엔진오일',ENGINEOIL:'엔진오일',OIL:'엔진오일',BATTERY:'배터리',ETC:'기타',OTHER:'기타',OTHERS:'기타'};return v?(M[v.toUpperCase()]||v):'품목 미지정'}
function adOf(r){if(S.adk===undefined||S.adk===null){for(const k in r){if(k!=='assignedToDriver'&&/assign/i.test(k)&&/(date|at|time)$/i.test(k)&&(r[k]==null||/^\d{4}-\d\d-\d\d/.test(String(r[k])))){S.adk=k;break}}if(S.adk===undefined)S.adk=null}return S.adk?d10(r[S.adk]):''}
function cdOf(r){if(S.cdk===undefined){S.cdk=null;for(const k in r){if(/complet|finish|done/i.test(k)&&/driver|worker/i.test(k)&&!/date|at$|time|id$/i.test(k)){S.cdk=k;break}}}const v=S.cdk?r[S.cdk]:null;return String((v&&typeof v==='object'?v.name:v)||'').trim()}
function fixA(L){if(!L)return;const md=S.mdk&&S.adk?2:S.mdk?1:0;S.amd=md;for(const r of L)r.a=md===2?!!(r.mdn&&r.ad):md===1?!!r.mdn:r.la}
function slim(r){if('mainDriver' in r||'mainDriverName' in r)S.mdk=true;const mdn=String((r.mainDriver&&r.mainDriver.name)||r.mainDriverName||'').trim(),ad=adOf(r),m=r.serviceMethod,w=r.waybillStatus,o=r.orderStatus,t=(r.serviceCategory==='회수'||/회수/.test(m||''))?'col':'out';
 return{id:String(r.key??r.waybillId??r.rowNum),rn:+r.rowNum||0,c:r.centerName||'센터 미지정',t:t,m:m||'미지정',o:o,w:w,on:r.orderNumber,wn:!!r.waybillNumber,wb:r.waybillNumber==null?'':String(r.waybillNumber),at:r.waybillAttribute,d:mdn||r.driverName||'',mdn:mdn,ad:ad,cd:cdOf(r)||(r.workCompletedDate?String(r.driverName||'').trim():''),la:r.assignedToDriver==='ASSIGNED',rc:r.recipientName||'',k:/^택배/.test(m||''),inb:r.inboundStatus==null?'':String(r.inboundStatus),wt:wterm(m,t,w),v:r.sellerName||(r.seller&&r.seller.name)||r.supplierName||'거래처 미지정',sid:String(r.sellerId??(r.seller&&r.seller.id)??r.supplierId??''),p:ptype(r),dt:d10(r.receiptDate||r.orderDate),ord:d10(r.orderDate),
 ap:d10(r.orderAppointedDate),rq:d10(r.orderRequestedDate),od:d10(r.driverOutboundCompletedDate),wd:d10(r.workCompletedDate),
 x:w==='CANCELLED'||o==='CANCELLED',s:r.scheduleConfirmStatus==='CONFIRMED',a:r.assignedToDriver==='ASSIGNED',
 g:!!r.driverOutboundCompletedDate||PAST_OUT.indexOf(w)>=0||CR.test(w),e:o==='COMPLETED'&&(wterm(m,t,w)||!!r.workCompletedDate)}}
function needFull(){if(!S.cache||!S.fullAt||S.noRn)return true;const n=Date.now();if(!S.did5&&n-S.openAt>=5*3600e3)return true;
 const b=h=>{const t=new Date();t.setHours(h,0,0,0);return t.getTime()},bd=n>=b(14)?b(14):n>=b(5)?b(5):b(14)-864e5;return S.fullAt<bd}
const sc=()=>S.center&&S.cOk!==false?S.center:'';const allKey=c=>(S.pb||'')+'|'+(S.from||'')+'|'+(S.to||'')+'|'+(c||'')+'|'+today();
const qs=()=>'?driverUnassignedOnly=false'+(S.seller?'&sellerIds='+encodeURIComponent(S.seller):'')+(sc()?'&centerNames='+encodeURIComponent(sc()):'');
function stopLoad(){if(S.ac)S.ac.abort();return new Promise(r=>{const w=()=>S.busy?setTimeout(w,50):r();w()})}
const sig=()=>S.ac?S.ac.signal:undefined,chk=()=>{if(S.ac&&S.ac.signal.aborted)throw new Error('ABORT')};
async function api(path,q){chk();const tk=token();if(!tk)throw new Error('LOGIN');const r=await fetch(API+path+q,{headers:{Authorization:'Bearer '+tk},signal:sig()});
 if(r.status===401||r.status===403)throw new Error('LOGIN');if(!r.ok){if(q.indexOf('centerNames=')>=0&&S.cOk!==true&&r.status>=400&&r.status<500&&r.status!==408&&r.status!==429){const r2=await fetch(API+path+q.replace(/&centerNames=[^&]*/g,''),{headers:{Authorization:'Bearer '+tk},signal:sig()});if(r2.ok){S.cOk=false;throw new Error('CENTER')}}throw new Error('서버 응답 '+r.status)}const d=(await r.json()).data||{};
 if(q.indexOf('centerNames=')>=0&&Array.isArray(d.items)){if(d.items.some(it=>it&&it.centerName&&String(it.centerName).indexOf(S.center)<0)){S.cOk=false;throw new Error('CENTER')}if(d.items.length)S.cOk=true}
 for(const it of d.items||[])if(it&&it.centerName)S.cens.add(String(it.centerName));return d}
const LP={plan:[],st:{},t0:0,n:0};
function lpStart(plan){LP.plan=plan;LP.st={};LP.t0=Date.now();LP.n=0;for(const k of plan)LP.st[k]={d:0,t:0,s:'wt'}}
function stp(name,d,t){const x=LP.st[name];if(!x)return;for(const k of LP.plan){if(k===name)break;LP.st[k].s='ok'}x.d=d;x.t=t;x.s=t&&d>=t?'ok':'now';tick()}
function lpPct(){let a=0;for(const k of LP.plan){const x=LP.st[k];a+=x.s==='ok'?1:x.t?Math.min(1,x.d/x.t):0}return LP.plan.length?Math.round(a/LP.plan.length*100):0}
async function pull(q,label,M){let p=1,tp=1,n=0;do{stp(label,p-1,tp);if(p>1)await new Promise(z=>setTimeout(z,300));chk();const d=await api('',q+'&page='+p);if((d.totalPages||1)>200)S.capHit=true;tp=Math.min(d.totalPages||1,200);for(const it of d.items||[]){const x=slim(it);M.set(x.id,x);n++;LP.n++}p++}while(p<=tp);stp(label,tp,tp);return n}
const TERM=c=>c==='WORK_COMPLETED'||c==='COLLECTION_COMPLETED'||c==='RETURN_COMPLETED'||c==='CANCELLED'||CR.test(c);
async function openCodes(){const k=(S.seller||'*')+'|'+sc();if(S.oc[k])return S.oc[k];let L=[];
 try{const d=await api('/filter-options',qs());L=(d.waybillStatus||[]).map(x=>typeof x==='string'?x:String(x&&(x.code||x.value||Object.values(x)[0])||'')).filter(Boolean)}catch(e){if(e.message==='LOGIN'||e.message==='CENTER'||e.message==='ABORT'||e.name==='AbortError')throw e}
 if(!L.length)return Object.keys(WS).filter(c=>!TERM(c));
 return S.oc[k]=L.filter(c=>!TERM(c))}
async function wsFmt(codes){if(!S.wf)try{const v=JSON.parse(localStorage.getItem('rcDashWf')||'null');if(v&&(v.f==='comma'||v.f==='rep')&&Date.now()-v.t<7*864e5)S.wf=v.f}catch(e){}if(S.wf)return S.wf;if(codes.length<2)return 'each';
 const tot=async q=>(await api('',qs()+q+'&size=1')).totalItems||0,keep=f=>{try{localStorage.setItem('rcDashWf',JSON.stringify({f:f,t:Date.now()}))}catch(e){}return S.wf=f};let a,b,t=0;
 try{for(let i=0;i+1<codes.length&&!t;i+=2){a=codes[i];b=codes[i+1];t=await tot('&waybillStatuses='+a)+await tot('&waybillStatuses='+b)}if(!t)return 'each';
  if(await tot('&waybillStatuses='+a+','+b)===t)return keep('comma');
  if(await tot('&waybillStatuses='+a+'&waybillStatuses='+b)===t)return keep('rep')}catch(e){if(e.message==='LOGIN'||e.message==='CENTER'||e.message==='ABORT'||e.name==='AbortError')throw e;return 'each'}
 return S.wf='each'}
async function loadRange(){
 const fr=S.from||'2000-01-01',to=S.to||today(),M=new Map();
 const AP=S.pb==='ap',L1='기간 '+(AP?'약속':'접수')+'분';lpStart(S.from?[L1,'이전 미종결','연계주문 점검']:[L1,'연계주문 점검']);
 let dtp=AP?'orderAppointedDate':(S.rdt||'receiptDate');const pd=()=>AP?0:dtp==='orderDate'?14:7,qa=()=>qs()+'&from='+(S.from?addD(fr,-pd()):fr)+'&to='+addD(to,pd())+'&dateType='+dtp;
 try{await pull(qa(),L1,M)}catch(e){if(AP||e.message==='LOGIN'||e.message==='CENTER'||e.message==='ABORT'||e.name==='AbortError'||dtp==='orderDate')throw e;if(!/^서버 응답 4/.test(e.message))S.rdtTmp=true;dtp='orderDate';M.clear();await pull(qa(),L1,M)}
 if(!AP){if(S.rdtTmp)S.rdtTmp=false;else S.rdt=dtp}
 const lkd=addD(fr,-90),leak=!!S.from&&[...M.values()].some(r=>{const d=AP?r.ap:dtp==='orderDate'?r.ord:r.dt;return d&&d<lkd});
 let nB=0;
 if(S.from&&!leak){const codes=await openCodes(),fm=await wsFmt(codes),q0=qs()+'&from=2000-01-01&to='+addD(S.from,AP?-1:-pd())+'&dateType='+dtp,lb='이전 미종결';
  if(fm==='comma')nB=await pull(q0+'&waybillStatuses='+codes.join(','),lb,M);
  else if(fm==='rep')nB=await pull(q0+codes.map(c=>'&waybillStatuses='+c).join(''),lb,M);
  else for(const c of codes)nB+=await pull(q0+'&waybillStatuses='+c,lb,M)}
 let TD=null;S.tdLeak=leak;
 S.cache=null;S.rows=[...M.values()];S.tdRows=TD;S.lc=sc();fixA(S.rows);fixA(S.tdRows);
 const inN=S.rows.filter(r=>pk(r)&&pk(r)>=fr&&pk(r)<=to).length,oldN=S.from?S.rows.filter(r=>pk(r)&&pk(r)<fr&&!r.x&&!r.e).length:0;
 S.pgInfo=leak?'서버 기간 조회가 적용되지 않아 전체를 받음':'기간 '+(AP?'약속':'접수')+' '+f(inN)+'건'+(S.from?' + 이전 미종결 '+f(oldN)+'건':'')+' (받은 양 '+f(S.rows.length)+'건)'+(dtp==='orderDate'?' · 서버가 접수일 조회를 받지 않아 주문일로 넓게 받아 접수일로 거름':'')}
async function lkLoad(){const t0=today(),a=addD(t0,-LKD[0]),b=addD(t0,LKD[1]),out=[];S.lkRows=null;
 try{let p=1,tp=1,ok=true;do{stp('연계주문 점검',p-1,tp);if(p>1)await new Promise(z=>setTimeout(z,300));chk();const d=await api('',qs()+'&from='+a+'&to='+b+'&dateType=orderAppointedDate&page='+p);if((d.totalPages||1)>30)S.capHit=true;tp=Math.min(d.totalPages||1,30);LP.n+=(d.items||[]).length;const sl=(d.items||[]).map(slim);if(sl.some(r=>!r.ap||r.ap<a||r.ap>b)){ok=false;break}out.push(...sl);p++}while(p<=tp);
  stp('연계주문 점검',1,1);if(ok)S.lkRows=[...new Map(out.map(r=>[r.id,r])).values()]}catch(e){if(e.message==='LOGIN'||e.message==='CENTER'||e.message==='ABORT'||e.name==='AbortError')throw e}}
async function loadAll(force){
 S.tdRows=null;
 lpStart(['전체 데이터','연계주문 점검']);stp('전체 데이터',0,1);
 const d1=await api('',qs()+'&page=1'),tp=(S.capHit=S.capHit||(d1.totalPages||1)>200,Math.min(d1.totalPages||1,200)),T=d1.totalItems||0,sz=d1.pageSize||1000,top=(d1.items||[])[0];
 const full=force===true||needFull()||!top||+top.rowNum!==T;
 let pages=[];
 if(full){for(let p=2;p<=tp;p++)pages.push(p)}
 else{const cut=addD(today(),-10),st=new Set();for(const r of S.cache.values()){if((!r.x&&!r.e)||(r.dt&&r.dt>=cut)){const p=Math.ceil((T-r.rn+1)/sz);if(p>1&&p<=tp)st.add(p)}}pages=[...st].sort((a,b)=>a-b)}
 const M=full?new Map():S.cache,add=d=>{for(const it of d.items||[]){const x=slim(it);M.set(x.id,x)}};add(d1);
 LP.n+=(d1.items||[]).length;let i=1;for(const p of pages){stp('전체 데이터',i,pages.length+1);i++;await new Promise(z=>setTimeout(z,300));const dd=await api('',qs()+'&page='+p);LP.n+=(dd.items||[]).length;add(dd)}
 S.cache=M;S.rows=[...M.values()];S.lc=sc();fixA(S.rows);
 if(full){S.fullAt=Date.now();S.noRn=S.rows.some(r=>!r.rn);if(Date.now()-S.openAt>=5*3600e3)S.did5=true}
 S.pgInfo=full?'전체 '+tp+'페이지 받음':tp+'페이지 중 '+(pages.length+1)+'페이지만 받음'}
async function load(force){
 if(S.busy||S.dead)return;if(S.pb==='ap'&&S.apDef){const R=defR('ap');if(R[0]!==S.from||R[1]!==S.to){S.from=R[0];S.to=R[1];$('#df').value=S.from;$('#dt').value=S.to;reset()}}if(S.pb==='dt'&&S.fol&&S.to&&S.to!==today()){const n=S.from?spanD(S.from,S.to)-1:0;S.to=today();if(S.from)S.from=addD(S.to,-n);$('#df').value=S.from;$('#dt').value=S.to;reset()}S.busy=true;S.err='';S.capHit=false;S.ac=new AbortController();$('#re').disabled=true;lpStart([]);if(S.rows.length)$('#app').classList.add('dim');tick();
 try{S.part=0;const run=async()=>{await (S.from||S.to?loadRange():loadAll(force));S.part=1;await lkLoad();if((S.from||S.to)&&!S.tdLeak&&S.lkRows){const y=addD(today(),-1),t0=today();S.tdRows=S.lkRows.filter(r=>r.ap===y||r.ap===t0)}};try{await run()}catch(e){if(e.message!=='CENTER')throw e;S.cache=null;await run()}
  fixA(S.rows);fixA(S.tdRows);fixA(S.dvRows);fixA(S.lkRows);S.lc=sc();if(S.d1&&S.d2&&S.d1<=S.d2&&(S.from||S.to))setTimeout(detail,0);S.last=new Date();if(!S.seller)S.ALL=S.capHit?null:{k:allKey(S.lc),rows:S.rows,td:S.tdRows,lk:S.lkRows,last:S.last,pg:S.pgInfo,cache:S.cache,tdLeak:S.tdLeak,lc:S.lc};S.fresh=true;S.doneAt=Date.now();setTimeout(tick,2600)}
 catch(e){const ab=e.name==='AbortError'||e.message==='ABORT';if(ab){S.cache=null}S.err=ab?(S.part?'불러오기를 중단했습니다. 주문 데이터는 새 조건으로 받았지만 연계주문 점검은 받지 못해, 연계주문 누락·오늘·전일 현황은 비어 있을 수 있습니다. [새로고침]을 누르세요.':S.rows.length?'불러오기를 중단했습니다. 화면은 이전에 받은 데이터입니다. 거래처·기간·센터를 확인한 뒤 [새로고침]을 누르세요.':'불러오기를 중단했습니다. 거래처·기간·센터를 확인한 뒤 [새로고침]을 누르세요.'):e.message==='LOGIN'?'로그인이 만료되었습니다. FlowFix 관리자 화면에 다시 로그인한 뒤 [새로고침]을 눌러주세요.':'데이터를 불러오지 못했습니다 ('+e.message+'). 이전 수치를 그대로 표시합니다.'}
 S.busy=false;S.ac=null;$('#re').disabled=false;$('#app').classList.remove('dim');arm();draw()}
async function detail(){
 const my=S.dvSeq=(S.dvSeq||0)+1,D1=S.d1,D2=S.d2;S.dvRows=null;S.dvMsg='';if(!(D1&&D2&&D1<=D2)||!(S.from||S.to)){draw();return}
 {const a=addD(today(),-LKD[0]),b=addD(today(),LKD[1]);if(S.lkRows&&S.lc===sc()&&S.d1>=a&&S.d2<=b){S.dvRows=S.lkRows.filter(r=>r.ap&&r.ap>=S.d1&&r.ap<=S.d2);S.dvC=sc();draw();return}}
 S.dvRows=[];S.dvMsg='불러오는 중…';draw();
 try{const out=[];let p=1,tp=1,ok=true;
  do{if(p>1)await new Promise(z=>setTimeout(z,300));const d=await api('',qs()+'&from='+D1+'&to='+D2+'&dateType=orderAppointedDate&page='+p);if(my!==S.dvSeq)return;tp=Math.min(d.totalPages||1,50);const sl=(d.items||[]).map(slim);
   if(sl.some(r=>!r.ap||r.ap<D1||r.ap>D2)){ok=false;break}out.push(...sl);p++}while(p<=tp);
  if(ok){const U=[...new Map(out.map(r=>[r.id,r])).values()];fixA(U);S.dvRows=U;S.dvMsg='';S.dvC=sc()}else{S.dvRows=null;S.dvMsg='서버에서 약속일 기간 조회가 확인되지 않아, 지금 불러온 데이터 안에서만 찾았습니다.'}}
 catch(e){if(my!==S.dvSeq)return;if(e.message==='CENTER')return detail();S.dvRows=null;S.dvMsg='상세 조회에 실패해 지금 불러온 데이터 안에서만 찾았습니다.'}
 draw()}
const MAXD=60,PWH='83ac251f8e7c4ec4b8ed1929ff2ecf86d6b029ad8ca5fcbe28836a7f6b555031';
function spanD(fr,to){return fr&&to?Math.round((new Date(to)-new Date(fr))/864e5)+1:Infinity}
function gap(){return S.dup||spanD(S.from,S.to)>mx()?0:S.min}
function arm(){const g=gap();S.next=g?Date.now()+g*60000:0}
function sname(){if(!S.seller)return '전체 거래처';const x=S.sellers.find(x=>x.id===S.seller);return x?x.name:'거래처 '+S.seller}
function fillSel(){$('#sel').innerHTML='<option value="">전체 거래처</option>'+S.sellers.map(x=>'<option value="'+esc(x.id)+'"'+(x.id===S.seller?' selected':'')+'>'+esc(x.name)+'</option>').join('');$('#sel').value=S.seller}
async function sellers(){const tk=token();if(!tk)return;
 for(const c of ['?supplierType=SELLER','?supplierType=SALES','?supplierType=SALE','?supplierType=SELLING','']){
  try{const r=await fetch(SUP+c,{headers:{Authorization:'Bearer '+tk}});if(!r.ok)continue;const j=await r.json(),d=j.data,arr=Array.isArray(d)?d:d&&(d.items||d.content||d.list)||[];
   const L=arr.map(x=>({id:String(x.id??x.supplierId??x.sellerId??''),name:String(x.name??x.supplierName??x.sellerName??'')})).filter(x=>x.id&&x.name);
   if(!L.length)continue;const tc=L.some(x=>x.id===String(SELLER)&&x.name.indexOf('레드캡')>=0);
   if(!tc&&c&&c!=='?supplierType=SELLER'&&c!=='')continue;
   S.sellers=L.sort((a,b)=>a.name.localeCompare(b.name,'ko'));S.selOk=true;
   const op=tc?'tc':'op'+L.map(x=>x.id).sort().join('-');if(op!==S.op){S.op=op;S.cens=new Set(tc?TC_CENS:[]);S.seller=tc?String(SELLER):(L.length===1?L[0].id:'');S.center='';restore()}
   if(S.seller&&!S.sellers.some(x=>x.id===S.seller))S.seller=tc?String(SELLER):(L.length===1?L[0].id:'');
   fillSel();return}catch(e){}}
 S.selOk=false;fillSel();if(S.rows.length)draw()}
function addD(d,n){const p=x=>String(x).padStart(2,'0'),t=new Date(d+'T00:00:00');t.setDate(t.getDate()+n);return t.getFullYear()+'-'+p(t.getMonth()+1)+'-'+p(t.getDate())}
function today(){const p=n=>String(n).padStart(2,'0'),d=new Date();return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())}
function wd(d){return d.slice(5)+' ('+WK[new Date(d+'T00:00:00').getDay()]+')'}
function issues(rows,td){const q={na:[0,0],ns:[0,0],ng:[0,0],nd:0,ndo:0,ndc:0,ing:0,tg:[0,0],te:[0,0],rq:0,late:0,diff:0,dna:0};
 for(const r of rows){if(r.x)continue;const ci=r.t==='col'?1:0;if(r.od===td){q.tg[ci]++;if(r.e)q.te[ci]++}if(r.e){if(r.od&&r.wd&&r.wd>r.od)q.late++;continue}
  if(r.g){const d=r.od||r.ap;if(d&&d<td){q.nd++;if(ci)q.ndc++;else q.ndo++}else q.ing++}
  else if(r.ap&&r.ap<=td){const i=r.ap<td?1:0;if(!r.a)q.na[i]++;else if(!r.s)q.ns[i]++;else q.ng[i]++}
  if(r.rq&&r.rq<td&&r.ap!==r.rq&&!r.g)q.rq++;
  if(!r.g&&r.rq&&r.ap!==r.rq){q.diff++;if(!r.a)q.dna++}}
 q.sum=q.na[1]+q.ns[1]+q.ng[1]+q.nd;return q}
function agg(rows){const a={n:0,x:0,s:0,a:0,g:0,e:0};for(const r of rows){a.n++;if(r.x){a.x++;continue}if(r.s)a.s++;if(r.a)a.a++;if(r.g)a.g++;if(r.e)a.e++}a.live=a.n-a.x;return a}
function group(rows,k){const m=new Map();for(const r of rows){const v=typeof k==='function'?k(r):r[k];if(!m.has(v))m.set(v,[]);m.get(v).push(r)}return m}
function rate(a,b){const p=pct(a,b);return '<span class="rate"><i><u style="width:'+p+'%"></u></i>'+p+'%</span>'}
function draw(){if(S.dead)return;
 for(const r of S.rows)if(r.c!=='센터 미지정')S.cens.add(r.c);if(S.center)S.cens.add(S.center);const cens=[...S.cens].sort((a,b)=>a.localeCompare(b,'ko'));if(S.op!=='tc')try{localStorage.setItem(LK('rcDashCens'),JSON.stringify(cens))}catch(e){}
 $('#cen').innerHTML='<option value="">전체</option>'+cens.map(c=>'<option'+(c===S.center?' selected':'')+'>'+esc(c)+'</option>').join('');
 const inP=r=>{const d=pk(r);return (!S.from||(d&&d>=S.from))&&(!S.to||(d&&d<=S.to))};
 const R0=S.rows.filter(r=>(!S.center||r.c===S.center)&&r.k===S.tk&&inP(r));
 if(S.prod&&!R0.some(r=>r.p===S.prod))S.prod='';
 const tire=x=>/타이어|TIRE/i.test(x),U=(S.prod?tire(S.prod):R0.length>0&&R0.every(r=>tire(r.p)))?'본':'건';
 const R=S.prod?R0.filter(r=>r.p===S.prod):R0,T=agg(R);
 const orders=new Set(R.map(r=>r.on)).size;
 const td=today(),flt=r=>(!S.center||r.c===S.center)&&r.k===S.tk&&(!S.prod||r.p===S.prod);
 const OLD=S.from?S.rows.filter(r=>flt(r)&&pk(r)&&pk(r)<S.from&&!r.x&&!r.e):[],W=R.concat(OLD);
 const stg=r=>r.g?'g':!r.a?'na':!r.s?'ns':'sc';
 const Q=issues(W,td);
 const DD={},seg=(k,on)=>'<span class="seg"><button data-seg="'+k+'" data-v="0" class="'+(on?'':'on')+'">택배 제외</button><button data-seg="'+k+'" data-v="1" class="'+(on?'on':'')+'">택배만</button></span>';
 const N=(key,label,rows,o)=>{const c=o&&o.c!=null?o.c:rows.length;if(!c)return o&&o.t?'0':'<span class="z">·</span>';DD[key]={l:(S.tk?'[택배] ':'')+label,rows:rows,c:c,lk:!!(o&&o.lk)};
  return '<button class="num'+(o&&o.cls?' '+o.cls:'')+'" data-dd="'+esc(key)+'" title="눌러서 내역 보기">'+f(c)+'</button>'};
 const lv=r=>!r.x,F=(rows,fn)=>rows.filter(fn);
 let h=S.err?'<div class="msg">'+esc(S.err)+'</div>':'';
 if(S.selOk===false)h+='<p class="note">판매처 목록을 불러오지 못해 지금은 레드캡과 전체 거래처만 선택할 수 있습니다.</p>';
 const pg=group(R0,'p');
 h+='<div class="fbar"><span>품목</span><button data-p="" class="'+(S.prod?'':'on')+'">전체 '+f(R0.length)+'</button>'+[...pg.entries()].sort((a,b)=>{const O=['타이어','엔진오일','배터리','기타'],x=O.indexOf(a[0]),y=O.indexOf(b[0]);return (x<0?9:x)-(y<0?9:y)||b[1].length-a[1].length}).map(([p,rows])=>'<button data-p="'+esc(p)+'" class="'+(p===S.prod?'on':'')+'">'+esc(p)+' '+f(rows.length)+'</button>').join('')+seg('tk',S.tk)+
 '<span class="per">'+esc(sname())+' · '+(S.from||S.to?PBL()+' '+esc(S.from||'처음')+' ~ '+esc(S.to||'현재'):'전체 기간 · '+f(S.rows.length)+'건')+(!S.seller&&S.min&&S.min<10?' · 전체 거래처는 10분 간격 갱신':'')+(S.pgInfo?' · '+S.pgInfo+(S.lc?' · '+esc(S.lc)+'만 받음':S.center&&S.cOk===false?' · 서버가 센터 조건을 받지 않아 전체 센터를 받아 화면에서 거름':'')+(S.from||S.to?'':' <button class="lnk" data-act="full" title="오래된 종결 건까지 전부 다시 받습니다">전체 다시 받기</button>'):'')+'</span></div>';
 const rem=F(R,r=>!r.x&&!r.e),unasL=F(rem,r=>!r.g&&!r.a),doneL=F(R,r=>!r.x&&r.e),outL=F(R,r=>r.t!=='col'),colL=F(R,r=>r.t==='col');
 const kpi=(l,key,rows,d,big)=>'<div class="kpi'+(big?' big':'')+'"><div class="l">'+l+'</div><div class="v">'+N('kpi:'+key,l,rows,{t:1})+'<small>\u0001</small></div><div class="d">'+d+'</div></div>';
 const ag=L=>{const a=agg(L);return '종결 '+f(a.e)+' · '+pct(a.e,a.live)+'%'};
 const lkA=addD(td,-LKD[0]),lkB=addD(td,LKD[1]),nrc=x=>String(x).replace(/[\s-]/g,'').toUpperCase(),LKA=[],LKG=[];S.LK={};
 if(!S.tk){const src=(S.lkRows||S.rows).filter(r=>(!S.center||r.c===S.center)&&!r.k&&!r.x&&r.ap&&r.ap>=lkA&&r.ap<=lkB&&r.rc&&(r.m==='교체출고'||r.m==='교체회수'));
  for(const L of group(src,r=>r.v+'|'+nrc(r.rc)+'|'+r.ap).values()){const O=L.filter(r=>r.m==='교체출고'),C=L.filter(r=>r.m==='교체회수');if(!O.length||!C.length)continue;
   const wk=x=>x.wb?String(x.wb).padStart(24,'0'):'~',wbs=(a,b)=>wk(a)<wk(b)?-1:wk(a)>wk(b)?1:0;O.sort(wbs);C.sort(wbs);
   for(const [me,ot] of [[O,C],[C,O]]){const okG=x=>x.g||x.e,okA=x=>x.a||x.g||x.e,used=new Set();me.forEach((r,i)=>{const m=ot[i];if(!(r.g||r.e)&&m&&(r.a?okG:okA)(m))used.add(m)});
    me.forEach((r,i)=>{if(r.g||r.e)return;const m=ot[i],pick=ok=>(m&&ok(m))?m:(ot.find(x=>ok(x)&&!used.has(x))||ot.find(ok));
     if(!r.a){const q=pick(okA);if(q){used.add(q);S.LK[r.id]={k:'배정 누락',p:q,since:String(q.g||q.e?(q.od||q.ad||r.ap):(q.ad||r.ap)).slice(0,10)};LKA.push(r)}}
     else{const q=pick(okG);if(q){used.add(q);S.LK[r.id]={k:'출고 누락',p:q,since:String(q.od||r.ap).slice(0,10)};LKG.push(r)}}})}}}
 const lkAll=LKA.concat(LKG),lkc=lkAll.length?'up':'';
 const lkCard=S.tk?'':'<div class="kpi lkk" title="약속일 '+lkA.slice(5)+' ~ '+lkB.slice(5)+' · 판매처·수취인(차량번호)·약속일이 같은 교체출고·교체회수 중 한쪽만 기사배정 또는 출고된 건'+(S.lkRows?'':' · 서버에서 따로 받지 못해 지금 불러온 데이터 안에서만 찾음')+'"><div class="l">연계주문 누락</div><div class="v">'+N('kpi:lk','연계주문 누락',lkAll,{t:1,lk:1,cls:lkc})+'<small>\u0001</small></div><div class="d">배정 누락 '+N('lk:a','연계주문 누락 · 배정 누락',LKA,{t:1,lk:1,cls:LKA.length?'up':''})+' · 출고 누락 '+N('lk:g','연계주문 누락 · 출고 누락',LKG,{t:1,lk:1,cls:LKG.length?'up':''})+'</div></div>';
 h+='<div class="kpis">'+kpi('남은 물량','rem',rem,'취소·종결 제외',1)+kpi('기사 미배정','una',unasL,'남은 물량의 '+pct(unasL.length,rem.length)+'%',1)+kpi('종결','done',doneL,'진도율 '+pct(T.e,T.live)+'%')+kpi('전체 운송장','all',R,'주문 '+f(orders)+'건 · 취소 '+f(T.x))+kpi('출고·설치','out',outL,ag(outL))+kpi('회수','col',colL,ag(colL))+lkCard+'</div>\u0002BAND\u0002';
 {const src=(S.tdRows||S.rows).filter(flt),exact=!!S.tdRows||!(S.from||S.to),yd=addD(td,-1),KS=['n','na','a','s','g','e','u','x'],KL={n:'약속 건수',na:'미배정',a:'배정',s:'일정 확정',g:'출고',e:'완료',u:'미완료',x:'취소'};
  const mkb=()=>{const o={};for(const k of KS)o[k]={c:0,r:[]};return o},ad=(b,L,n)=>{b.c+=n;for(const r of L)b.r.push(r)};
  const st=rows=>{const o=mkb();for(const r of rows){const one=[r];if(r.x){ad(o.x,one,1);continue}ad(o.n,one,1);if(r.a||r.g||r.e)ad(o.a,one,1);else ad(o.na,one,1);if(r.s||r.g||r.e)ad(o.s,one,1);if(r.g||r.e)ad(o.g,one,1);if(r.e)ad(o.e,one,1);else ad(o.u,one,1)}return o};
  const so=rows=>{const o=mkb();for(const L of group(rows,r=>r.on||r.id).values()){const v=L.filter(lv);if(!v.length){ad(o.x,L,1);continue}ad(o.n,v,1);if(v.every(r=>r.a||r.g||r.e))ad(o.a,v,1);else ad(o.na,v,1);if(v.every(r=>r.s||r.g||r.e))ad(o.s,v,1);if(v.every(r=>r.g||r.e))ad(o.g,v,1);if(v.every(r=>r.e))ad(o.e,v,1);else ad(o.u,v,1)}return o};
  const tr=(lab,o,past,first,day,key,name)=>{const cl=k=>N('td:'+key+':'+k,name+' · '+lab+' · '+KL[k],o[k].r,{c:o[k].c,cls:past&&(k==='na'||k==='u')?'up':''});
   return '<tr class="'+(day===td?'now':'')+(/o$/.test(key)?' ord':'')+'">'+(first?'<td rowspan="4">'+first+'</td>':'')+'<td class="k">'+lab+'</td><td><b>'+N('td:'+key+':n',name+' · '+lab+' · 약속 건수',o.n.r,{c:o.n.c,t:1})+'</b></td><td>'+cl('na')+'</td><td>'+cl('a')+'</td><td>'+cl('s')+'</td><td>'+cl('g')+'</td><td>'+cl('e')+'</td><td>'+cl('u')+'</td><td>'+cl('x')+'</td><td>'+rate(o.e.c,o.n.c)+'</td></tr>'};
  const blk=(d,name,past)=>{const L=src.filter(r=>r.ap===d),O=L.filter(r=>r.t!=='col'),C=L.filter(r=>r.t==='col'),nm=name+' '+d.slice(5);return tr('출고 : 운송장 기준',st(O),past,name+'<span class="sub">'+wd(d)+'</span>',d,d+':ow',nm)+tr('출고 : 주문 기준',so(O),past,'',d,d+':oo',nm)+tr('회수 : 운송장 기준',st(C),past,'',d,d+':cw',nm)+tr('회수 : 주문 기준',so(C),past,'',d,d+':co',nm)};
  h+='<section class="tdy"><h2>오늘·전일 현황 <small>약속일 기준 · 조회 기간과 무관'+(exact?'':' — 서버에서 따로 받지 못해 지금 불러온 데이터 안에서만 집계')+'</small></h2><div class="tw"><table><thead><tr><th>약속일</th><th style="text-align:left">기준 <span style="font-weight:400;color:var(--mute)">(음영 = 주문 기준)</span></th><th>약속 건수</th><th>미배정</th><th>배정</th><th>일정 확정</th><th>출고</th><th>완료</th><th>미완료</th><th>취소</th><th>완료율</th></tr></thead><tbody>'+blk(td,'오늘',0)+blk(yd,'전일',1)+'</tbody></table></div><p class="note">배정·일정 확정·출고·완료는 누적입니다(완료 건은 앞 단계에도 포함). 출고·설치와 회수는 따로 셉니다. 주문 기준은 주문번호 하나에 딸린 같은 쪽 운송장이 모두 그 단계에 이르렀을 때 센 것이고, 하나라도 미배정이면 미배정입니다. 취소는 약속 건수에서 제외합니다.</p></section>'}
 const CK2=['late',td,addD(td,1),addD(td,2),addD(td,3),'wk','fut','none'],wkHi=addD(td,10);
 const ck=r=>!r.ap?'none':r.ap<td?'late':r.ap<=CK2[4]?r.ap:r.ap<=wkHi?'wk':'fut';
 const cn=k=>k==='late'?'지연':k===td?'오늘':k==='wk'?'D+4~10':k==='fut'?'D+11 이후':k==='none'?'약속일 없음':k==='sum'?'합계':'D+'+(CK2.indexOf(k)-1)+' ('+k.slice(5)+')';
 const BM=new Map(),TOT={};
 const bput=(o,k,r)=>{const c=o[k]=o[k]||{n:[],na:[]};c.n.push(r);if(!r.e&&!r.g&&!r.a)c.na.push(r)};
 for(const r of W){if(r.x)continue;const k=ck(r);if((k==='late'||k==='none')&&r.e)continue;if(!BM.has(r.c))BM.set(r.c,{});bput(BM.get(r.c),k,r);bput(BM.get(r.c),'sum',r);bput(TOT,k,r);bput(TOT,'sum',r)}
 const cols=CK2.filter(k=>k!=='none'||TOT.none);
 const hd=k=>k==='late'?'<th class="late">⚠ 지연<span class="sub">어제까지</span></th>':k===td?'<th class="today">오늘<span class="sub">'+wd(k)+'</span></th>':k==='wk'?'<th>D+4~10<span class="sub">'+addD(td,4).slice(5)+' ~ '+wkHi.slice(5)+'</span></th>':k==='fut'?'<th>D+11 이후<span class="sub">'+addD(td,11).slice(5)+' ~</span></th>':k==='none'?'<th>약속일 없음</th>':'<th>D+'+(CK2.indexOf(k)-1)+'<span class="sub">'+wd(k)+'</span></th>';
 const cell=(c,k,cen,sum)=>{if(!c||!c.n.length)return '<td'+(sum?' class="sum"':'')+'><span class="z">·</span></td>';const cls=c.na.length?(k==='late'?'crit':k===td?'warn':''):'ok',lab='배정 계획판 · '+(cen||'전체 센터')+' · '+cn(k),key='bd:'+cen+':'+k;
  return '<td class="'+cls+(sum?' sum':'')+'"><b>'+(c.na.length?N(key+':na',lab+' · 기사 미배정',c.na):'✓')+'</b><small>/ '+N(key+':n',lab+' · 전체',c.n)+'</small><u><i style="width:'+pct(c.n.length-c.na.length,c.n.length)+'%"></i></u></td>'};
 if(S.bc&&!BM.has(S.bc))S.bc='';
 const bcs=[...BM.keys()].sort((a,b)=>a.localeCompare(b,'ko')),brows=[...BM.entries()].filter(x=>!S.bc||x[0]===S.bc).sort((a,b)=>(b[1].sum.na.length-a[1].sum.na.length)||a[0].localeCompare(b[0],'ko'));
 const PM=new Map();for(const r of W){if(r.x||(S.bc&&r.c!==S.bc))continue;const k=ck(r);if((k==='late'||k==='none')&&r.e)continue;if(!PM.has(r.p))PM.set(r.p,{});bput(PM.get(r.p),k,r);bput(PM.get(r.p),'sum',r)}
 const PO=['타이어','엔진오일','배터리','기타'],prows=[...PM.entries()].sort((a,b)=>{const x=PO.indexOf(a[0]),y=PO.indexOf(b[0]);return (x<0?9:x)-(y<0?9:y)||a[0].localeCompare(b[0],'ko')});
 h+='<div class="top"><div><h2>배정 계획판 <small>약속일 기준 · 큰 숫자 = 기사 미배정 · / 뒤 = 그날 물량 · 막대 = 배정률</small><select id="bc" style="margin-left:auto" title="배정 계획판에서 볼 센터"><option value="">전체 센터</option>'+bcs.map(c=>'<option'+(c===S.bc?' selected':'')+'>'+esc(c)+'</option>').join('')+'</select></h2>'+(brows.length?'<div class="tw"><table class="bd"><thead><tr><th>센터</th>'+cols.map(hd).join('')+'<th class="sum">합계</th></tr></thead><tbody>'+brows.map(([c,o])=>'<tr><td>'+esc(c)+'</td>'+cols.map(k=>cell(o[k],k,c)).join('')+cell(o.sum,'sum',c,1)+'</tr>').join('')+(brows.length>1?'<tr class="tot"><td>합계</td>'+cols.map(k=>cell(TOT[k],k,'')).join('')+cell(TOT.sum,'sum','',1)+'</tr>':'')+prows.map(([p,o],i)=>{const nm='품목 '+p+(S.bc?' · '+S.bc:'');return '<tr class="prd'+(i?'':' first')+'"><td>'+esc(p)+'<span class="sub">품목별 합계'+(S.bc?' · '+esc(S.bc):'')+'</span></td>'+cols.map(k=>cell(o[k],k,nm)).join('')+cell(o.sum,'sum',nm,1)+'</tr>'}).join('')+'</tbody></table></div>':'<p class="note">표시할 물량이 없습니다.</p>')+'<p class="note">지연·약속일 없음 열은 미종결 물량만 셉니다. 취소는 제외합니다. 숫자를 누르면 맨 아래에 내역이 나옵니다.</p></div>';
 const cat=r=>{const o=[];if(r.x||r.e)return o;if(r.g){const d=r.od||r.ap;if(d&&d<td)o.push(r.t==='col'?'f':'d')}else if(r.ap&&r.ap<td)o.push(!r.a?'a':!r.s?'b':'c');if(r.rq&&r.rq<td&&r.ap!==r.rq&&!r.g)o.push('e');return o};
 const IL={a:'경과 미배정',b:'경과 일정 미확정',c:'경과 미출고',d:'이전 출고 미완료(출고)',f:'이전 출고 미완료(회수)',e:'지정일 경과 미반영'};
 const catOf=rows=>{const o={a:[],b:[],c:[],d:[],f:[],e:[]};for(const r of rows)for(const k of cat(r))o[k].push(r);return o},CW=catOf(W);
 const cur={a:CW.a.length,b:CW.b.length,c:CW.c.length,d:CW.d.length,f:CW.f.length};if(S.fresh){S.pq=S.cq;S.fresh=false}S.cq=cur;
 const dl=k=>{if(!S.pq||S.pq[k]==null)return '';const d=cur[k]-S.pq[k];return d?' <small class="'+(d>0?'up':'dn')+'">'+(d>0?'▲':'▼')+f(Math.abs(d))+'</small>':''};
 {const TN=W.filter(r=>!r.x&&!r.e&&!r.g&&r.ap===td&&!r.a),TA=W.filter(r=>!r.x&&r.ap===td).length,DF=CW.d.concat(CW.f);cur.lk=S.tk?null:lkAll.length;cur.tn=TN.length;cur.df=DF.length;
  const top=rows=>{const g=group(rows,'c');let b='',n=0;for(const [c,L] of g)if(L.length>n){n=L.length;b=c}return !rows.length?'':g.size>1?'최다 '+esc(b)+' '+f(n):esc(b)};
  const cell=(k,l,rows,sub,key,o,hot)=>'<div class="tc'+(rows.length?(hot?' hot':''):' none')+'"><div class="l">'+l+'</div><div class="v">'+(rows.length?N(key,l,rows,o)+'<small>\u0001</small>'+dl(k):'없음')+'</div><div class="d">'+sub+'</div></div>';
  h=h.replace('\u0002BAND\u0002','<div class="todo"><h2>오늘 할 일 <small>'+(S.pq?'▲▼ = 지난 새로고침 대비 증감':'다음 새로고침부터 ▲▼ 증감을 표시합니다')+' · 숫자를 누르면 맨 아래에 내역</small></h2><div class="tcs">'+
   cell('a','경과 · 기사 미배정',CW.a,top(CW.a),'pr:a',null,1)+cell('b','경과 · 일정 미확정',CW.b,top(CW.b),'pr:b',null,1)+
   (S.tk?'':cell('lk','연계주문 누락',lkAll,'배정 누락 '+f(LKA.length)+' · 출고 누락 '+f(LKG.length),'kpi:lk',{t:1,lk:1},1))+
   cell('tn','오늘 약속 · 미배정',TN,'오늘 약속 '+f(TA)+'건 중','td:tn',{t:1},0)+
   cell('df','출고 후 미완료',DF,'어제까지 출고 · 출고 '+f(CW.d.length)+' · 회수 '+f(CW.f.length),'td:df',{t:1},1)+'</div></div>')}
 const pr=(k,l,sub,cls)=>'<div class="pr '+(CW[k].length?cls:'none')+'"><span>'+l+'<small>'+sub+'</small></span><b>'+(CW[k].length?N('pr:'+k,'지금 문제 · '+l,CW[k])+'<small>\u0001</small>'+dl(k):'없음')+'</b></div>';
 const oc={g:[],na:[],ns:[],sc:[]};for(const r of OLD)oc[stg(r)].push(r);
 const ML=W.filter(r=>!r.x&&!r.e&&!r.g&&r.rq&&r.rq!==r.ap);
 const tg=[[],[]],te=[[],[]];for(const r of W){if(r.x||r.od!==td)continue;const i=r.t==='col'?1:0;tg[i].push(r);if(r.e)te[i].push(r)}
 const lateL=W.filter(r=>!r.x&&r.e&&r.od&&r.wd&&r.wd>r.od),t1={t:1};
 h+='<div><h2>지금 문제 <small>오늘 '+td+' · 약속일 경과 미종결</small></h2>'+
 pr('a','경과 · 기사 미배정','오늘 약속분 미배정 '+f(Q.na[0]),'crit')+
 pr('b','경과 · 일정 미확정','오늘 약속분 미확정 '+f(Q.ns[0]),'crit')+
 pr('c','경과 · 일정 확정 후 미출고','오늘 약속분 미출고 '+f(Q.ng[0]),'crit')+
 pr('d','어제까지 출고 · 미완료 (출고)','회수가 아닌 모든 작업유형 — 출고일이 지났는데 미종결','crit')+
 pr('f','어제까지 출고 · 미완료 (회수)','교체·교환·불량·변심·택배 회수 — 출고일이 지났는데 회수완료 전','crit')+
 '<div class="ex" style="margin-top:8px"><span>오늘 출고 진행 <small style="display:inline;flex-basis:auto">완료 / 출고</small></span><b>출고 '+N('tp:eo','오늘 출고분 완료 (출고·설치)',te[0],t1)+' / '+N('tp:go','오늘 출고분 (출고·설치)',tg[0],t1)+' · 회수 '+N('tp:ec','오늘 출고분 완료 (회수)',te[1],t1)+' / '+N('tp:gc','오늘 출고분 (회수)',tg[1],t1)+'</b><small>오늘 출고한 건은 진행 중으로 보고 문제에 넣지 않습니다</small></div>'+
 '<div class="ex"><span>약속일 ≠ 지정일 (미출고)</span><b>'+N('ml','약속일 ≠ 지정일 (미출고)',ML,t1)+'\u0001</b><small>그중 지정일 경과 '+N('ml:p','약속일 ≠ 지정일 · 지정일 경과',F(ML,r=>r.rq<td),t1)+' · 기사 미배정 '+N('ml:u','약속일 ≠ 지정일 · 기사 미배정',F(ML,r=>!r.a),t1)+' · 종결 건 제외</small></div>'+
 '<div class="ex"><span>출고 다음날 이후 완료</span><b>'+N('late','출고 다음날 이후 완료',lateL,t1)+'\u0001</b><small>종결 건 누적</small></div>'+
 (S.from?'<div class="ex"><span>'+PBL()+' '+esc(S.from.slice(5))+' 이전 미처리</span><b>'+N('old',PBL()+' '+S.from+' 이전 미처리',OLD,t1)+'\u0001</b><small>미배정 '+N('old:na','이전 미처리 · 미배정',oc.na,t1)+' · 일정 미확정 '+N('old:ns','이전 미처리 · 일정 미확정',oc.ns,t1)+' · 미출고 '+N('old:sc','이전 미처리 · 미출고',oc.sc,t1)+' · 출고 후 미완료 '+N('old:g','이전 미처리 · 출고 후 미완료',oc.g,t1)+' — 계획판·문제·일자별 현황에 포함</small></div>':'')+'</div></div>';
 const lo=addD(td,-10),hi=addD(td,10),FK=['n','as','na','ns','sc','g','e','df'],FL={n:'건수',as:'기사 배정',na:'미배정',ns:'일정 미확정',sc:'일정 확정',g:'출고',e:'종결',df:'약속일≠지정일'},mk=()=>{const o={};for(const k of FK)o[k]=[];return o};
 const put=(o,r)=>{o.n.push(r);(r.a?o.as:o.na).push(r);if(r.e)o.e.push(r);else{const k=stg(r);if(k!=='na')o[k].push(r);if(!r.g&&r.rq&&r.rq!==r.ap)o.df.push(r)}};
 const B={old:mk(),past:mk(),fut:mk(),none:mk()},days={},pd={};for(let i=1;i<=3;i++)pd[addD(td,-i)]=mk();for(let i=0;i<=10;i++)days[addD(td,i)]=mk();
 for(const r of W){if(r.x)continue;const d=r.ap;if(!d){if(!r.e)put(B.none,r)}else if(d<lo){if(!r.e)put(B.old,r)}else if(d<td){if(!r.e)put(pd[d]||B.past,r)}else if(d>hi)put(B.fut,r);else put(days[d],r)}
 const drow=(lab,o,cls,key,name)=>'<tr'+(cls?' class="'+cls+'"':'')+'><td>'+lab+'</td>'+FK.slice(0,7).map(k=>'<td>'+N(key+':'+k,name+' · '+FL[k],o[k],{t:cls==='tot'&&k==='n'})+'</td>').join('')+'<td>'+(o.df.length?'<span class="pill crit">'+N(key+':df',name+' · 약속일≠지정일',o.df)+'</span>':'<span class="z">·</span>')+'</td></tr>';
 const DH='<thead><tr><th>약속일</th><th>건수</th><th>기사 배정</th><th>미배정</th><th>일정 미확정</th><th>일정 확정</th><th>출고</th><th>종결</th><th>약속일≠지정일</th></tr></thead>';
 h+='<section><h2>일자별 미처리 현황 <small>약속일 기준 · 운송장 건수 · 지난 날짜는 미종결만 · 기사 배정 + 미배정 = 건수 · 약속일≠지정일은 출고 전 건'+(S.amd===2?'':' · <span style="color:var(--warn)">'+(S.amd===1?'기사배정일 항목을 찾지 못해 메인기사명만으로 배정 판정':'메인기사명 항목을 찾지 못해 기존 배정상태 값으로 판정')+'</span>')+'</small></h2><div class="tw"><table>'+DH+'<tbody>'+
 drow('D-11 이전 미처리 <span class="sub">~ '+addD(lo,-1)+'</span>',B.old,B.old.n.length?'bad':'','dy:old','약속일 D-11 이전 미처리')+drow('D-10 ~ D-4 미처리 <span class="sub">'+lo+' ~ '+addD(td,-4)+'</span>',B.past,B.past.n.length?'bad':'','dy:past','약속일 D-10~D-4 미처리')+[3,2,1].map(i=>{const d=addD(td,-i);return drow(wd(d)+' <span class="pill'+(pd[d].n.length?' crit':'')+'">D-'+i+' 미처리</span>',pd[d],pd[d].n.length?'bad':'','dy:'+d,'약속일 '+d+' 미처리')}).join('')+
 Object.keys(days).map((d,i)=>drow(wd(d)+' '+(i?'<span class="pill">D+'+i+'</span>':'<span class="pill now">오늘</span>'),days[d],i?'':'now','dy:'+d,'약속일 '+d)).join('')+
 drow('D+11 이후 <span class="sub">'+addD(hi,1)+' ~</span>',B.fut,'','dy:fut','약속일 D+11 이후')+(B.none.n.length?drow('약속일 미입력 미처리',B.none,'','dy:none','약속일 미입력 미처리'):'')+'</tbody></table></div>';
 h+='<div class="dv"><b>기간별 상세보기</b><label>약속일 <input type="date" id="v1" value="'+esc(S.d1)+'"> ~ <input type="date" id="v2" value="'+esc(S.d2)+'"></label>'+(S.d1||S.d2?'<button id="vx">닫기</button>':'')+'<small>'+(S.from||S.to?'조회 기간과 관계없이 서버에서 따로 불러옵니다(종결 건 포함)':'불러온 전체 데이터에서 찾습니다')+'</small></div>';if(S.dvMsg)h+='<p class="note">'+esc(S.dvMsg)+'</p>';
 if(S.d1&&S.d2&&S.d1<=S.d2){const dd={};for(const r of (S.dvRows||S.rows)){if(r.x||!flt(r)||!r.ap||r.ap<S.d1||r.ap>S.d2)continue;put(dd[r.ap]=dd[r.ap]||mk(),r)}const ks=Object.keys(dd).sort(),tt=mk();for(const k of ks)for(const q of FK)for(const r of dd[k][q])tt[q].push(r);
  h+=ks.length?'<div class="tw" style="margin-top:8px"><table>'+DH+'<tbody>'+ks.map(d=>drow(esc(d)+' ('+(WK[new Date(d+'T00:00:00').getDay()]||'?')+')',dd[d],d===td?'now':'','dv:'+d,'상세 · 약속일 '+d)).join('')+drow('합계',tt,'tot','dv:tot','상세 · 약속일 '+S.d1+'~'+S.d2)+'</tbody></table></div>':'<p class="note">선택한 기간에 약속일이 있는 물량이 없습니다.</p>'}
 h+='</section>';
 const DV=S.d1&&S.d2&&S.d1<=S.d2&&S.dvMsg!=='불러오는 중…'?(S.dvRows||S.rows).filter(r=>flt(r)&&r.ap&&r.ap>=S.d1&&r.ap<=S.d2):null;
 const R2=DV||R,W2=DV||W,P=[];
 const ig=group(W2,'c'),lkG=group(S.tk?[]:lkAll,'c'),icen=[...new Set([...ig.keys(),...lkG.keys()])].sort().map(c=>[c,catOf(ig.get(c)||[])]).filter(x=>Object.keys(IL).some(k=>x[1][k].length)||lkG.has(x[0])),ICT=DV?catOf(DV):CW;
 const irow=(c,name,q,cls)=>'<tr'+(cls?' class="'+cls+'"':'')+'><td>'+esc(name)+'</td>'+Object.keys(IL).map(k=>'<td>'+N('is:'+c+':'+k,(c||'전체 센터')+' · '+IL[k],q[k],{t:!!cls})+'</td>').join('')+(S.tk?'':'<td class="lkc">'+N('is:'+c+':lk',(c||'전체 센터')+' · 연계주문 누락',c?(lkG.get(c)||[]):lkAll,{t:!!cls,lk:1,cls:(c?(lkG.get(c)||[]):lkAll).length?'up':''})+'</td>')+'</tr>';
 P.push(['iss','센터별 문제',icen.length?'<div class="tw"><table><thead><tr><th>센터</th>'+Object.keys(IL).map(k=>'<th>'+IL[k]+'</th>').join('')+(S.tk?'':'<th class="lkc">연계주문 누락</th>')+'</tr></thead><tbody>'+icen.map(([c,q])=>irow(c,c,q,'')).join('')+(icen.length>1?irow('','합계',ICT,'tot'):'')+'</tbody></table></div>':'<p class="note">문제 건이 없습니다.</p>']);
 const prog=(key,name,rows,cls)=>{const a=agg(rows),t=!!cls,o={t:t},L=(s,l,fn)=>'<td>'+N(key+':'+s,name+' · '+l,F(rows,fn),o)+'</td>';
  return '<td>'+N(key+':n',name+' · 전체',rows,{t:1})+'</td>'+L('o','출고·설치',r=>r.t!=='col')+L('c','회수',r=>r.t==='col')+L('a','기사 배정',r=>!r.x&&r.a)+L('s','일정 확정',r=>!r.x&&r.s)+L('g','기사 출고',r=>!r.x&&r.g)+L('oe','출고·설치 완료',r=>!r.x&&r.e&&r.t!=='col')+L('ce','회수 완료',r=>!r.x&&r.e&&r.t==='col')+L('x','취소',r=>r.x)+'<td>'+rate(a.e,a.live)+'</td>'};
 const PH='<th>전체</th><th>출고·설치</th><th>회수</th><th>기사 배정</th><th>일정 확정</th><th>기사 출고</th><th>출고·설치 완료</th><th>회수 완료</th><th>취소</th><th>진도율</th>';
 const cg=group(R2,'c');
 P.push(['cen','센터별 진도','<div class="tw"><table><thead><tr><th>센터</th>'+PH+'</tr></thead><tbody>'+[...cg.keys()].sort().map(c=>'<tr><td>'+esc(c)+'</td>'+prog('cn:'+c,c,cg.get(c),'')+'</tr>').join('')+'<tr class="tot"><td>합계</td>'+prog('cn:*','전체 센터',R2,'tot')+'</tr></tbody></table></div><p class="note">운송장 1건 기준(타이어는 1건 = 1본). 진도율 = 종결 ÷ (전체 − 취소).</p>']);
 const dg=group(R2.filter(r=>r.d&&!r.x),r=>r.d+'\u0002'+r.c),drows=[...dg.entries()].sort((x,y)=>y[1].length-x[1].length);
 P.push(['drv','기사별 진도',(drows.length?'<div class="tw"><table><thead><tr><th>기사</th><th>배정</th><th>출고·설치</th><th>회수</th><th>일정 확정</th><th>기사 출고</th><th>작업·회수 중</th><th>출고·설치 완료</th><th>회수 완료</th><th>진도율</th></tr></thead><tbody>'+drows.map(([k,rows])=>{const [d,c]=k.split('\u0002'),a=agg(rows),nm='기사 '+d,L=(s,l,fn)=>'<td>'+N('dr:'+k+':'+s,nm+' · '+l,F(rows,fn))+'</td>';
  return '<tr><td>'+esc(d)+'<span class="sub">'+esc(c)+'</span></td><td>'+N('dr:'+k+':n',nm+' · 배정',rows,{t:1})+'</td>'+L('o','출고·설치',r=>r.t!=='col')+L('c','회수',r=>r.t==='col')+L('s','일정 확정',r=>r.s)+L('g','기사 출고',r=>r.g)+L('i','작업·회수 중',r=>r.w==='WORK_IN_PROGRESS'||r.w==='COLLECTING')+L('oe','출고·설치 완료',r=>r.e&&r.t!=='col')+L('ce','회수 완료',r=>r.e&&r.t==='col')+'<td>'+rate(a.e,a.n)+'</td></tr>'}).join('')+'</tbody></table></div>':'<p class="note">배정된 기사가 없습니다.</p>')+'<p class="note">기사가 배정된 물량만 집계합니다(취소 제외).</p>']);
 const simple=(key,name,rows)=>{const a=agg(rows),L=(s,l,fn)=>'<td>'+N(key+':'+s,name+' · '+l,F(rows,fn))+'</td>';return '<td>'+N(key+':n',name+' · 전체',rows,{t:1})+'</td>'+L('a','기사 배정',r=>!r.x&&r.a)+L('s','일정 확정',r=>!r.x&&r.s)+L('g','기사 출고',r=>!r.x&&r.g)+L('e','종결',r=>!r.x&&r.e)+L('x','취소',r=>r.x)+'<td>'+rate(a.e,a.live)+'</td>'};
 const SH='<th>전체</th><th>기사 배정</th><th>일정 확정</th><th>기사 출고</th><th>종결</th><th>취소</th><th>진도율</th>';
 if(!S.seller){const vg=group(R2,'v');P.push(['sel','거래처별 진도','<div class="tw"><table><thead><tr><th>거래처</th>'+SH+'</tr></thead><tbody>'+[...vg.entries()].sort((x,y)=>y[1].length-x[1].length).map(([v,rows])=>'<tr><td>'+esc(v)+'</td>'+simple('vd:'+v,v,rows)+'</tr>').join('')+'</tbody></table></div>'])}
 const funnel=(k,name)=>{const rows=F(R2,r=>(r.t==='col')===(k==='col')),a=agg(rows);if(!a.n)return '';
  const row=(s,l,fn,end)=>{const L=F(rows,fn);return '<div class="st'+(end?' end':'')+'"><span>'+l+'</span><span class="bar"><i style="width:'+pct(L.length,a.live)+'%"></i></span><span class="n">'+N('fn:'+k+':'+s,name+' · '+l,L,{t:1})+'<small>'+pct(L.length,a.live)+'%</small></span></div>'};
  return '<div><h4>'+name+' · 유효 '+f(a.live)+'\u0001 <span style="font-weight:400;color:var(--mute)">(취소 '+f(a.x)+'\u0001 제외)</span></h4>'+row('a','기사 배정',r=>!r.x&&r.a)+row('s','일정 확정',r=>!r.x&&r.s)+row('g','기사 출고',r=>!r.x&&r.g)+row('e','종결',r=>!r.x&&r.e,1)+'</div>'};
 P.push(['fun','진행 현황','<div class="fl">'+TYPES.map(([k,n])=>funnel(k,n)).join('')+'</div><p class="note">종결 = 주문상태 완료 + 운송장상태가 종결 단계. 운송장 종결 단계 — 회수 유형(교체·교환·불량·변심·택배 회수): 회수완료 / 그 밖: 작업완료·반납완료·택배사완료. 주문상태 완료에 작업 완료일이 입력된 건도 종결로 봅니다. 비율은 취소를 뺀 물량 대비.</p>']);
 const matrix=(key,dict,pre,ttl)=>{const lab=k=>dict[k]||(key==='w'?wsl(k):k),ix=new Map();for(const r of R2){const a=r.c+'\u0002'+r[key];if(!ix.has(a))ix.set(a,[]);ix.get(a).push(r)}
  const CG=group(R2,'c'),KG=group(R2,key),cen=[...CG.keys()].sort(),seen=new Set(KG.keys()),cs=Object.keys(dict).filter(k=>seen.has(k)).concat([...seen].filter(k=>!(k in dict))),get=(c,k)=>ix.get(c+'\u0002'+k)||[];
  const mx=Math.max(1,...cen.flatMap(c=>cs.map(k=>k==='CANCELLED'?0:get(c,k).length)));
  const hc=(c,k)=>{const L=get(c,k),v=L.length,b=N(pre+':'+c+':'+k,c+' · '+ttl+' '+lab(k),L);if(!v||k==='CANCELLED')return '<td>'+b+'</td>';const q=v/mx,g=q>.66?4:q>.33?3:q>.1?2:1;return '<td style="background:var(--h'+g+')'+(g===4?';color:#fff':'')+'">'+b+'</td>'};
  return '<div class="tw"><table><thead><tr><th>센터</th>'+cs.map(k=>'<th title="'+esc(k)+'">'+esc(lab(k))+'</th>').join('')+'<th>합계</th></tr></thead><tbody>'+cen.map(c=>'<tr><td>'+esc(c)+'</td>'+cs.map(k=>hc(c,k)).join('')+'<td>'+N(pre+':'+c+':*',c+' · 전체',CG.get(c),t1)+'</td></tr>').join('')+
  '<tr class="tot"><td>합계</td>'+cs.map(k=>'<td>'+N(pre+':*:'+k,'전체 센터 · '+ttl+' '+lab(k),(KG.get(k)||[]),t1)+'</td>').join('')+'<td>'+N(pre+':*:*','전체',R2,t1)+'</td></tr></tbody></table></div>'};
 P.push(['ws','운송장 상태',matrix('w',WS,'ws','운송장상태')]);P.push(['os','주문 상태',matrix('o',OS,'os','주문상태')]);
 const mg=group(R2,'m');
 P.push(['typ','작업유형','<div class="tw"><table><thead><tr><th>작업유형</th>'+SH+'</tr></thead><tbody>'+[...mg.entries()].sort((x,y)=>y[1].length-x[1].length).map(([m,rows])=>'<tr><td>'+esc(m)+'</td>'+simple('ty:'+m,'작업유형 '+m,rows)+'</tr>').join('')+'</tbody></table></div>']);
 const POS=['FR','FL','RR','RL'],col=R2.filter(r=>r.m==='교체회수'&&!r.x),noPos=col.filter(r=>POS.indexOf(r.at)<0),dupL=[];let dup=0;
 for(const rows of group(col,'on').values()){const s=new Set();let d=false;for(const r of rows){if(POS.indexOf(r.at)<0)continue;if(s.has(r.at))d=true;s.add(r.at)}if(d){dup++;for(const r of rows)dupL.push(r)}}
 const e1=R2.filter(r=>!r.x&&r.wt&&r.o!=='COMPLETED'),e2=R2.filter(r=>!r.x&&!r.wt&&!r.e&&r.o==='COMPLETED'),rt=R2.filter(r=>!r.x&&r.w==='RETURN_COMPLETED'),nwb=R2.filter(r=>!r.wn);
 P.push(['chk','데이터 점검','<div class="chk"><div>교체출고 − 교체회수 (취소 제외)<b>'+f(R2.filter(r=>!r.x&&r.m==='교체출고').length-R2.filter(r=>!r.x&&r.m==='교체회수').length)+'\u0001</b><small>0이 아니면 출고·회수 수량 불일치</small></div><div>회수 위치 표기 없음·비표준<b>'+N('ck:np','회수 위치 표기 없음·비표준',noPos,t1)+'\u0001</b><small>FR·FL·RR·RL 이외</small></div><div>한 주문 안에서 위치 중복<b>'+N('ck:dp','한 주문 안에서 위치 중복',dupL,{c:dup,t:1})+'건</b><small>주문 기준</small></div><div>운송장번호 미발번<b>'+N('ck:nw','운송장번호 미발번',nwb,t1)+'\u0001</b><small>접수대기 단계</small></div><div>운송장 종결인데 주문상태 미완료<b>'+N('ck:e1','운송장 종결인데 주문상태 미완료',e1,t1)+'\u0001</b><small>상태 불일치 오류 · 미종결로 집계</small></div><div>주문상태 완료인데 운송장 미종결<b>'+N('ck:e2','주문상태 완료인데 운송장 미종결',e2,t1)+'\u0001</b><small>상태 불일치 · 미종결로 집계</small></div><div>기사 배정 판정과 배정상태 값 불일치<b>'+N('ck:am','기사 배정 판정과 배정상태 값 불일치',F(R2,r=>!r.x&&r.a!==r.la),t1)+'\u0001</b><small>'+(S.amd===2?'판정: 메인기사명 + 기사배정일('+esc(S.adk)+') 둘 다 있을 때 배정':S.amd===1?'기사배정일 항목을 서버 데이터에서 찾지 못해 메인기사명만으로 판정':'메인기사명 항목을 찾지 못해 기존 배정상태 값으로 판정')+'</small></div><div>완료 기사 항목<b>'+(S.cdk?'확인':'미확인')+'</b><small>'+(S.cdk?'서버 항목 '+esc(S.cdk)+' 사용':'전용 항목을 찾지 못해 완료 건의 기사명 값을 표시')+'</small></div><div>반납완료 건의 입고 상태<b>'+N('ck:rt','반납완료 건',rt,t1)+'\u0001</b><small>'+(rt.length?esc([...group(rt,r=>r.inb||'값 없음').entries()].map(([k,v])=>k+' '+v.length).join(' · ')):'해당 없음')+'</small></div></div>']);
 if(!P.some(p=>p[0]===S.tab))S.tab='cen';
 h+='<section>'+(DV?'<div class="msg dvb">아래 표는 약속일 '+esc(S.d1)+' ~ '+esc(S.d2)+' 물량 '+f(DV.length)+'\u0001 기준입니다. <button class="lnk" id="vx">원래대로</button></div>':'')+'<div class="tabs">'+P.map(p=>'<button data-tab="'+p[0]+'" class="'+(p[0]===S.tab?'on':'')+'">'+p[1]+'</button>').join('')+'</div>'+P.map(p=>'<div class="tp"'+(p[0]===S.tab?'':' hidden')+'><h3>'+p[1]+'</h3>'+p[2]+'</div>').join('')+'</section>';
 S.DD=DD;$('#app').innerHTML=h.replace(/\u0001/g,U);S.go=false;drawPane();tick()}
function paneHTML(){const td=today(),nrc=x=>String(x).replace(/[\s-]/g,'').toUpperCase(),DD=S.DD;let h='';
 const SB=r=>{const c=r.x?'cx':r.e?'dn':r.g?'ou':r.a?'wt':'na',t=wsl(r.w)||'-';return '<span class="sb '+c+'">'+esc(t)+(c==='na'&&!/미배정/.test(t)?' · 미배정':'')+'</span>'};
 const tail=r=>'<td>'+esc(r.on||'-')+'</td><td>'+esc(r.v)+'</td><td>'+esc(r.p)+'</td><td>'+esc(r.rq||'-')+(r.rq&&r.rq!==r.ap?' <span class="pill crit">불일치</span>':'')+'</td><td>'+esc(OS[r.o]||r.o||'-')+'</td><td>'+(r.x?'취소':!r.a?'미배정':!r.s?'일정미확정':'일정확정')+'</td><td>'+esc(r.ad||'-')+'</td><td>'+esc(r.od||'-')+'</td><td>'+esc(r.wd||'-')+'</td><td>'+esc(r.cd||'-')+'</td><td>'+esc(r.dt||'-')+'</td><td>'+esc(r.ord||'-')+'</td>',tailH='<th>주문번호</th><th>판매처</th><th>품목</th><th>지정일</th><th>주문상태</th><th>배정·일정</th><th>기사배정일</th><th>출고일</th><th>완료일</th><th>완료 기사</th><th>접수일</th><th>주문일</th>';
 const stdTab=L=>'<div class="tw"><table class="dtt"><thead><tr><th>운송장번호</th><th>주문번호</th><th>판매처</th><th>센터</th><th>수취인</th><th>품목</th><th>작업유형</th><th>약속일</th><th>지정일</th><th>주문상태</th><th>운송장상태</th><th>배정·일정</th><th>배정 기사</th><th>기사배정일</th><th>출고일</th><th>완료일</th><th>완료 기사</th><th>접수일</th><th>주문일</th></tr></thead><tbody>'+L.map(r=>'<tr><td>'+esc(r.wb||'미발번')+'</td><td>'+esc(r.on||'-')+'</td><td>'+esc(r.v)+'</td><td>'+esc(r.c)+'</td><td>'+esc(r.rc||'-')+'</td><td>'+esc(r.p)+'</td><td>'+esc(r.m)+'</td><td>'+esc(r.ap||'미입력')+'</td><td>'+esc(r.rq||'-')+(r.rq&&r.rq!==r.ap?' <span class="pill crit">불일치</span>':'')+'</td><td>'+esc(OS[r.o]||r.o||'-')+'</td><td>'+SB(r)+'</td><td>'+(r.x?'취소':!r.a?'미배정':!r.s?'일정미확정':'일정확정')+'</td><td>'+esc(r.mdn||r.d||'-')+'</td><td>'+esc(r.ad||'-')+'</td><td>'+esc(r.od||'-')+'</td><td>'+esc(r.wd||'-')+'</td><td>'+esc(r.cd||'-')+'</td><td>'+esc(r.dt||'-')+'</td><td>'+esc(r.ord||'-')+'</td></tr>').join('')+'</tbody></table></div>';
 const lkTab=L=>{let pv='',pg='';const dday=d=>d?Math.round((new Date(td+'T00:00:00')-new Date(d+'T00:00:00'))/864e5):null;
  return '<div class="tw"><table class="dtt lkt"><thead><tr class="h1"><th rowspan="2">구분</th><th rowspan="2">차량번호</th><th rowspan="2">약속일</th><th colspan="4" class="bz">기준 주문 (처리됨)</th><th rowspan="2" class="ar"></th><th colspan="4" class="mz">누락 주문 (처리 필요)</th><th rowspan="2">경과</th><th rowspan="2">센터</th>'+tailH.replace(/<th>/g,'<th rowspan="2">')+'</tr><tr class="h2"><th class="bz">유형</th><th class="bz">운송장</th><th class="bz">상태</th><th class="bz">처리일</th><th class="mz">유형</th><th class="mz">운송장</th><th class="mz">상태</th><th class="mz">배정 기사</th></tr></thead><tbody>'+
  L.map(r=>{const z=S.LK[r.id]||{k:'-',p:null,since:''},q=z.p,v=nrc(r.rc)+'|'+r.ap,g=v+'|'+(q?q.wb:''),nv=v!==pv,ng=g!==pg,dd=dday(z.since);pv=v;pg=g;
   return '<tr class="'+(nv?'grp':'')+'"><td>'+(nv?'<span class="pill crit">'+esc(z.k)+'</span>':'')+'</td><td class="'+(nv?'vk':'rep')+'">'+(nv?esc(r.rc||'-'):'〃')+'</td><td class="'+(nv?'':'rep')+'">'+(nv?esc(r.ap||'-'):'〃')+'</td>'+
    '<td class="bz">'+esc(q?q.m:'-')+'</td><td class="bz'+(ng?' vk':'')+'">'+esc(q?q.wb||'미발번':'-')+'</td><td class="bz">'+(q?SB(q):'-')+'</td><td class="bz">'+esc(z.since||'-')+'</td>'+
    '<td class="ar">→</td><td class="mz">'+esc(r.m)+'</td><td class="mz vk">'+esc(r.wb||'미발번')+'</td><td class="mz">'+SB(r)+'</td><td class="mz">'+esc(r.mdn||r.d||'-')+'</td><td'+(dd>=2?' class="up"':'')+'>'+(dd==null?'-':dd>0?dd+'일':dd===0?'오늘':'D'+dd)+'</td><td>'+esc(r.c)+'</td>'+tail(r)+'</tr>'}).join('')+'</tbody></table></div>'};
 S.cp=[];
 if(S.dd){const e=DD[S.dd.k],LKm=!!(e&&e.lk),lki=r=>S.LK[r.id]||{k:'-',p:null,since:''},gk=r=>{const z=lki(r);return z.since+'|'+nrc(r.rc)+'|'+r.ap+'|'+(z.p?z.p.wb:'')},L0=(e?e.rows.slice():[]).sort((a,b)=>(LKm?(gk(a)<gk(b)?-1:gk(a)>gk(b)?1:0):0)||(a.ap<b.ap?-1:a.ap>b.ap?1:0)||(a.wb<b.wb?-1:a.wb>b.wb?1:0)),MAX=500,dday=d=>d?Math.round((new Date(td+'T00:00:00')-new Date(d+'T00:00:00'))/864e5):null,all=!S.seller;const MC={};L0.forEach(r=>{MC[r.m]=(MC[r.m]||0)+1});const MK=Object.keys(MC).sort((a,b)=>MC[b]-MC[a]||(a<b?-1:1));if(S.ddM&&!MC[S.ddM])S.ddM='';const L1=S.ddM?L0.filter(r=>r.m===S.ddM):L0;
  const pf=S.pf||(S.pf={q:'',c:'',a:'',g:'',s:''}),lkz=r=>S.LK[r.id]||{},drv=r=>LKm?((lkz(r).p&&(lkz(r).p.mdn||lkz(r).p.d))||'(기사 없음)'):(r.mdn||r.d||'(미배정)'),
   agd=r=>{const b=LKm?lkz(r).since:r.ap;if(!b)return '';const d=Math.round((new Date(td+'T00:00:00')-new Date(b+'T00:00:00'))/864e5);return d<0?'pre':d===0?'t0':d<=2?'t1':'t3'},
   qn=pf.q.replace(/[\s-]/g,'').toUpperCase(),nz=v=>String(v||'').replace(/[\s-]/g,'').toUpperCase(),
   pass=(r,sk)=>(sk==='q'||!qn||[r.rc,r.wb,r.on,LKm&&lkz(r).p?lkz(r).p.wb:''].some(v=>v&&nz(v).includes(qn)))&&(sk==='c'||!pf.c||r.c===pf.c)&&(sk==='a'||!pf.a||drv(r)===pf.a)&&(sk==='g'||!pf.g||agd(r)===pf.g)&&(sk==='s'||!pf.s||(LKm&&lkz(r).p&&(wsl(lkz(r).p.w)||'-')===pf.s)),
   L=L1.filter(r=>pass(r)),fon=!!(pf.q||pf.c||pf.a||pf.g||pf.s),
   cnt=(sk,fn)=>{const m=new Map();for(const r of L1)if(pass(r,sk)){const v=fn(r);if(v)m.set(v,(m.get(v)||0)+1)}return [...m.entries()].sort((a,b)=>b[1]-a[1]||(a[0]<b[0]?-1:1))},
   CC=cnt('c',r=>r.c),DC=cnt('a',drv),SC2=LKm?cnt('s',r=>lkz(r).p?(wsl(lkz(r).p.w)||'-'):''):[],GC=new Map(cnt('g',agd)),
   chip=(k,v,lab,n)=>'<button data-pfk="'+k+'" data-pfv="'+esc(v)+'" class="'+(pf[k]===v?'on':'')+'">'+esc(lab)+(n!=null?' '+f(n):'')+'</button>',
   opt=(k,list,allLab)=>'<select data-pf="'+k+'"><option value="">'+allLab+'</option>'+list.map(([v,n])=>'<option value="'+esc(v)+'"'+(pf[k]===v?' selected':'')+'>'+esc(v)+' ('+f(n)+')</option>').join('')+(pf[k]&&!list.some(x=>x[0]===pf[k])?'<option value="'+esc(pf[k])+'" selected>'+esc(pf[k])+' (0)</option>':'')+'</select>',
   gch=['pre','t0','t1','t3'].filter(k=>GC.get(k)||pf.g===k).map(k=>chip('g',k,GL[k],GC.get(k)||0)).join(''),
   FB=L0.length?('<div class="fbar pf"><input id="pfq" type="search" placeholder="차량번호·운송장·주문번호 검색" value="'+esc(pf.q)+'">'+
    (LKm?'':'<span>센터</span>'+opt('c',CC,'전체')+'<span>기사</span>'+opt('a',DC,'전체'))+
    (gch?'<span>'+(LKm?'경과(연계 처리일부터)':'경과(약속일부터)')+'</span>'+chip('g','','전체')+gch:'')+(fon?'<button data-pfk="*" data-pfv="" class="clr">필터 해제</button>':'')+'</div>'+
    (LKm?'<div class="fbar pf"><span>기준 주문 상태</span>'+chip('s','','전체',null)+SC2.map(([v,n])=>chip('s',v,v,n)).join('')+'</div><div class="fbar pf"><span>센터</span>'+chip('c','','전체',null)+CC.map(([v,n])=>chip('c',v,v,n)).join('')+'</div><div class="fbar pf"><span>기준 주문 기사</span>'+chip('a','','전체',null)+DC.slice(0,15).map(([v,n])=>chip('a',v,v,n)).join('')+(DC.length>15?'<span class="mute">외 '+f(DC.length-15)+'명</span>':'')+'</div>':'')):'';if(e)S.dd.l=e.l;S.cp=[...new Set(L.map(r=>r.wb).filter(Boolean))];
  S.ddL=L;S.ddLK=LKm;h+='<section id="ddl"><h2>'+esc(S.dd.l)+(S.ddM?' · '+esc(S.ddM):'')+' <small>운송장 '+f(L.length)+'건'+(fon?' (필터 전 '+f(L1.length)+'건)':'')+(!fon&&!S.ddM&&e&&e.c!==L.length?' (주문 '+f(e.c)+'건)':'')+(L.length>MAX?' 중 약속일 빠른 순 '+MAX+'건 표시':'')+' · '+(S.last?[S.last.getHours(),S.last.getMinutes(),S.last.getSeconds()].map(x=>String(x).padStart(2,'0')).join(':')+' 기준':'')+'</small>'+(L.length?'<button class="lnk" data-act="cp">운송장번호 복사 '+f(S.cp.length)+'</button><button class="lnk" data-act="xl" title="이 목록 전체를 엑셀(.xlsx)로 받기">엑셀 받기</button>':'')+'<button class="lnk" data-act="ddx">닫기</button></h2>'+
  FB+(MK.length>1?'<div class="fbar mf"><span>작업유형</span>'+['',...MK].map(k=>'<button data-mf="'+esc(k)+'" class="'+((S.ddM||'')===k?'on':'')+'">'+esc(k||'전체')+' '+f(k?MC[k]:L0.length)+'</button>').join('')+'</div>':'')+
  (L.length?(LKm?lkTab(L.slice(0,MAX)):stdTab(L.slice(0,MAX))):'<p class="note">'+(fon?'조건에 맞는 건이 없습니다. <button data-pfk="*" data-pfv="" class="clr">필터 해제</button>':'지금은 해당 건이 없습니다.')+'</p>')+'</section>'}
 return h}
function drawPane(){const o=document.querySelector('#pane'),oK=o?o.dataset.k:'',oS=o?((o.querySelector('.pb')||{}).scrollTop||0):0,oX=o?((o.querySelector('.pb')||{}).scrollLeft||0):0;if(o)o.remove();document.querySelectorAll('#app .num.on').forEach(b=>b.classList.remove('on'));const ph=paneHTML();if(ph)$('#app').insertAdjacentHTML('beforeend',ph);pane();{const t=document.querySelector('#pane .lkt tr.h1 th.bz'),pn=document.querySelector('#pane');if(t&&pn)pn.style.setProperty('--h1h',(t.getBoundingClientRect().height-8)+'px');if(pn&&S.dd){pn.dataset.k=S.dd.k;const c1=pn.querySelector('.lkt tbody td');if(c1)pn.style.setProperty('--c1w',c1.getBoundingClientRect().width+'px');if(oK===S.dd.k){const pb=pn.querySelector('.pb');if(pb){pb.scrollTop=oS;pb.scrollLeft=oX}}}}}
const GL={pre:'예정',t0:'오늘',t1:'1~2일',t3:'3일+'};const XLURL='https://hanunpark.github.io/zonescan/xlsx-style.min.js';
async function xl(btn){const L=S.ddL||[],LK=S.ddLK,lab=(S.dd?S.dd.l:'목록')+(S.ddM?' · '+S.ddM:'')+(S.pf?(S.pf.c?' · '+S.pf.c:'')+(S.pf.a?' · 기사 '+S.pf.a:'')+(S.pf.g?' · 경과 '+GL[S.pf.g]:'')+(S.pf.s?' · 기준 '+S.pf.s:'')+(S.pf.q?' · 검색 '+S.pf.q:''):'');if(!L.length||btn.disabled)return;const o=btn.textContent;btn.disabled=true;btn.textContent='만드는 중…';
 const td=today(),dd=d=>d?Math.round((new Date(td+'T00:00:00')-new Date(d+'T00:00:00'))/864e5):'',st=r=>{const t=wsl(r.w)||'-';return (!r.x&&!r.e&&!r.g&&!r.a&&!/미배정/.test(t))?t+' · 미배정':t},
  ag=r=>r.x?'취소':!r.a?'미배정':!r.s?'일정미확정':'일정확정',mm=r=>r.rq&&r.rq!==r.ap?'불일치':'';
 let H,R;
 if(LK){H=['누락 구분','차량번호','약속일','기준 유형','기준 운송장','기준 상태','기준 처리일','누락 유형','누락 운송장','누락 상태','배정 기사','경과(일)','센터','주문번호','판매처','품목','지정일','지정일 불일치','주문상태','배정·일정','기사배정일','출고일','완료일','완료 기사','접수일','주문일'];
  R=L.map(r=>{const z=S.LK[r.id]||{k:'',p:null,since:''},q=z.p;return [z.k,r.rc||'',r.ap||'',q?q.m:'',q?q.wb||'미발번':'',q?st(q):'',z.since||'',r.m,r.wb||'미발번',st(r),r.mdn||r.d||'',dd(z.since),r.c,r.on||'',r.v,r.p,r.rq||'',mm(r),OS[r.o]||r.o||'',ag(r),r.ad||'',r.od||'',r.wd||'',r.cd||'',r.dt||'',r.ord||'']})}
 else{H=['운송장번호','주문번호','판매처','센터','수취인','품목','작업유형','약속일','지정일','지정일 불일치','주문상태','운송장상태','배정·일정','배정 기사','기사배정일','출고일','완료일','완료 기사','접수일','주문일'];
  R=L.map(r=>[r.wb||'미발번',r.on||'',r.v,r.c,r.rc||'',r.p,r.m,r.ap||'',r.rq||'',mm(r),OS[r.o]||r.o||'',st(r),ag(r),r.mdn||r.d||'',r.ad||'',r.od||'',r.wd||'',r.cd||'',r.dt||'',r.ord||''])}
 const t=S.last||new Date(),p=n=>String(n).padStart(2,'0'),stamp=t.getFullYear()+p(t.getMonth()+1)+p(t.getDate())+'_'+p(t.getHours())+p(t.getMinutes()),
  base=lab.replace(/\[택배\]\s*/,'택배_').replace(/\s*·\s*/g,'_').replace(/[^0-9A-Za-z가-힣_]+/g,'')+'_'+stamp,
  save=(blob,name)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},4000)};
 try{if(!window.__XLS){const r=await fetch(XLURL,{cache:'force-cache'});if(!r.ok)throw Error('HTTP '+r.status);window.__XLS=(new Function((await r.text())+';return XLSX'))()}
  const X=window.__XLS,ws=X.utils.aoa_to_sheet([H].concat(R));
  ws['!cols']=H.map((h,i)=>{let w=h.length*2+2;for(const x of R.slice(0,400)){const v=x[i]==null?'':String(x[i]);let n=0;for(const ch of v)n+=ch.charCodeAt(0)>255?2:1;if(n+2>w)w=n+2}return {wch:Math.min(w,40)}});
  {const E=X.utils.encode_cell,nr=x=>String(x||'').replace(/[\s-]/g,'').toUpperCase(),thin={style:'thin',color:{rgb:'E6E8EF'}},gb={style:'medium',color:{rgb:'565B70'}},
    SC={na:['D23B3A','FFFFFF'],wt:['F2B52B','3D2A00'],ou:['4B5FE0','FFFFFF'],dn:['0F8A45','FFFFFF'],cx:['E6E8EF','8B90A3']},stc=r=>r.x?'cx':r.e?'dn':r.g?'ou':r.a?'wt':'na',
    zn=i=>LK?(i>=3&&i<=6?'b':i>=7&&i<=10?'m':''):'',ZF={b:'E6F6EC',m:'FDEAEA'},ZT={b:'0A7D3C',m:'C0302F'},cell=(r,c)=>{const k=E({r:r,c:c});if(!ws[k])ws[k]={t:'s',v:''};return ws[k]};
   H.forEach((h,i)=>{const z=zn(i);cell(0,i).s={font:{bold:true,color:{rgb:z?ZT[z]:'171A26'}},fill:{fgColor:{rgb:z?ZF[z]:'F1F3F8'}},border:{bottom:gb},alignment:{vertical:'center'}}});
   let pv=null,pg=null,band=false;
   L.forEach((r,j)=>{const z0=LK?(S.LK[r.id]||{}):null,v=nr(r.rc)+(LK?'|'+r.ap:''),g=v+'|'+(z0&&z0.p?z0.p.wb:''),nv=v!==pv,ng=g!==pg;if(nv&&j)band=!band;pv=v;pg=g;
    const stI=LK?{5:z0&&z0.p,9:r}:{11:r};
    for(let i=0;i<H.length;i++){const z=zn(i),o={font:{},fill:{fgColor:{rgb:z?ZF[z]:(band?'F1F3F8':'FFFFFF')}},border:{bottom:thin}};if(nv&&j)o.border.top=gb;
     if(stI[i]){const c=SC[stc(stI[i])];o.fill={fgColor:{rgb:c[0]}};o.font={bold:true,color:{rgb:c[1]}}}
     if(LK&&i===0)o.font={bold:true,color:{rgb:'C0302F'}};
     if((LK&&i===8)||(!LK&&i===0)||(i===(LK?1:4)&&nv))o.font.bold=true;
     if(LK&&i===11&&typeof R[j][11]==='number'&&R[j][11]>=2)o.font={bold:true,color:{rgb:'C0302F'}};
     cell(j+1,i).s=o}});
   ws['!rows']=[{hpt:20}]}
  ws['!autofilter']={ref:X.utils.encode_range({s:{r:0,c:0},e:{r:R.length,c:H.length-1}})};
  const info=X.utils.aoa_to_sheet([['목록',lab],['건수(운송장)',R.length],['기준 시각',t.toLocaleString('ko-KR',{hour12:false})],['거래처',sname()],['조회 기간('+PBL()+')',S.from||S.to?(S.from||'')+' ~ '+(S.to||''):'전체'],['센터',S.center||'전체'],['품목',S.prod||'전체'],['대시보드',(($('#ver')||{}).textContent||'')]].concat(LK?[['연계주문 기준','판매처·수취인(차량번호)·약속일이 같은 교체출고·교체회수 중 한쪽만 기사배정(배정 누락) 또는 출고(출고 누락)된 건, 약속일 오늘−'+LKD[0]+'일 ~ +'+LKD[1]+'일']]:[]));info['!cols']=[{wch:16},{wch:60}];
  const wb=X.utils.book_new();X.utils.book_append_sheet(wb,ws,'목록');X.utils.book_append_sheet(wb,info,'조건');
  save(new Blob([X.write(wb,{bookType:'xlsx',type:'array'})],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}),base+'.xlsx');btn.textContent='받음 ✓'}
 catch(e){const q=v=>{v=v==null?'':String(v);if(typeof v==='string'&&/^[=+@]/.test(v))v="'"+v;return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};
  save(new Blob(['\ufeff'+[H].concat(R).map(x=>x.map(q).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'}),base+'.csv');btn.textContent='CSV로 받음';btn.title='엑셀 도구를 받지 못해 CSV로 저장했습니다('+(e.message||e)+'). 엑셀에서 바로 열립니다.'}
 setTimeout(()=>{btn.disabled=false;btn.textContent=o},2500)}
function pane(){const sec=$('#ddl');document.body.classList.toggle('pnon',!!sec);document.body.classList.toggle('pnbig',!!(sec&&S.pnBig));if(!sec)return;
 const P=document.createElement('div');P.id='pane';P.setAttribute('role','region');P.setAttribute('aria-label','운송장 내역');sec.parentNode.insertBefore(P,sec);P.appendChild(sec);
 const h2=sec.querySelector('h2');h2.classList.add('ph');const pb=document.createElement('div');pb.className='pb';while(h2.nextSibling)pb.appendChild(h2.nextSibling);sec.appendChild(pb);
 h2.querySelectorAll('.lnk').forEach(b=>{b.classList.remove('lnk');if(b.dataset.act==='ddx'){b.textContent='✕ 닫기';b.title='닫기 (Esc)'}});
 const sp=document.createElement('span');sp.className='sp';const cp=h2.querySelector('[data-act=cp]'),x=h2.querySelector('[data-act=ddx]');h2.insertBefore(sp,cp||x);
 const big=document.createElement('button');big.dataset.act='big';big.textContent=S.pnBig?'⤡ 작게':'⤢ 크게';h2.insertBefore(big,x);
 if(S.ddBack&&S.ddBack.length){const bk=document.createElement('button');bk.dataset.act='back';bk.title='이전 목록';bk.textContent='← 뒤로';h2.insertBefore(bk,h2.firstChild)}
 if(S.dd)document.querySelectorAll('[data-dd]').forEach(b=>{if(b.dataset.dd===S.dd.k)b.classList.add('on')})}
document.addEventListener('change',e=>{const t=e.target;if(t&&t.dataset&&t.dataset.pf){if(!S.pf)S.pf={q:'',c:'',a:'',g:'',s:''};S.pf[t.dataset.pf]=t.value;drawPane()}});
document.addEventListener('input',e=>{const t=e.target;if(t&&t.id==='pfq'){clearTimeout(S.pfT);S.pfT=setTimeout(()=>{if(!S.pf)S.pf={q:'',c:'',a:'',g:'',s:''};S.pf.q=t.value;const ps=t.selectionStart;drawPane();const n=$('#pfq');if(n){n.focus();try{n.setSelectionRange(ps,ps)}catch(x){}}},250)}});
document.addEventListener('keydown',e=>{const tg=e.target&&e.target.tagName;if(e.key==='Escape'&&/^(INPUT|SELECT|TEXTAREA)$/.test(tg||'')){if(e.target.id==='pfq'&&e.target.value){e.target.value='';if(S.pf){S.pf.q='';drawPane();const n=$('#pfq');if(n)n.focus()}}return}if(e.key==='Escape'&&S.dd){S.dd=null;S.ddBack=[];drawPane()}});
function tick(){if(S.dead)return;const el=$('#stamp'),pb=$('#pb');if(!el)return;
 if(S.busy){const cur=LP.plan.find(k=>LP.st[k].s==='now')||LP.plan.find(k=>LP.st[k].s==='wt')||'',x=LP.st[cur]||{},pc=lpPct();
  el.className='busy';el.innerHTML='<button class="stopx" data-stop="1" title="불러오기 중단">중단</button><span class="ldsp"></span>불러오는 중'+(cur?'<span class="ldx"> · '+esc(cur)+(x.t>1?' '+Math.min(x.d+1,x.t)+'/'+x.t:'')+'</span>':'')+' · '+pc+'%';el.title=cur;
  if(pb){pb.hidden=false;pb.firstChild.style.width=Math.max(pc,3)+'%'}
  if(!S.rows.length){const sec=Math.round((Date.now()-LP.t0)/1000);
   $('#app').innerHTML='<div class="ldf"><div class="ldbig"></div><h3>데이터를 불러오는 중입니다</h3><p>'+esc(sname())+(S.center?' · '+esc(S.center):'')+' · '+(S.from||S.to?PBL()+' '+esc(S.from||'처음')+' ~ '+esc(S.to||'현재'):'전체 기간')+'</p><div class="ldbar"><i style="width:'+Math.max(pc,3)+'%"></i></div><div class="ldst">'+LP.plan.map((k,i)=>{const y=LP.st[k];return '<div class="'+(y.s==='now'?'ldcur':'')+'"><span class="ldck '+y.s+'">'+(y.s==='ok'?'✓':i+1)+'</span>'+esc(k)+'<span class="ldr">'+(y.s==='wt'?'대기':y.t?Math.min(y.d+(y.s==='ok'?0:1),y.t)+' / '+y.t:'')+'</span></div>'}).join('')+'</div><p class="ldft">받은 건수 '+f(LP.n)+'건 · 경과 '+sec+'초</p><button class="stopb" data-stop="1">불러오기 중단</button><p class="ldft">거래처·기간·센터를 잘못 골랐다면 중단한 뒤 바꾸거나, 위에서 바로 바꾸면 지금 불러오기를 멈추고 새로 받습니다.</p></div>'}
  return}
 el.className=S.err?'err':'';el.title='';if(pb)pb.hidden=true;
 const p2=n=>String(n).padStart(2,'0'),L=S.last,sameDay=L&&L.toDateString()===new Date().toDateString(),t=L?(sameDay?'':p2(L.getMonth()+1)+'-'+p2(L.getDate())+' ')+p2(L.getHours())+':'+p2(L.getMinutes())+':'+p2(L.getSeconds()):'-',am=L?Math.floor((Date.now()-L.getTime())/60000):0,ago=!L?'':am<1?'방금':am<60?am+'분 전':Math.floor(am/60)+'시간 '+(am%60)+'분 전';if(!S.err&&L&&am>=30)el.className='old';
 let n=S.dup?'중복 탭 · 자동 꺼짐':spanD(S.from,S.to)>mx()&&S.min?mx()+'일 초과 · 자동 꺼짐':'자동 꺼짐';if(S.next&&document.hidden)n='탭 복귀 시 갱신';else if(S.next){const s=Math.max(0,Math.round((S.next-Date.now())/1000));n='다음 '+Math.floor(s/60)+':'+String(s%60).padStart(2,'0')}
 const rc=S.doneAt&&Date.now()-S.doneAt<2500&&!S.err;el.innerHTML='<i></i>'+(rc?'<b class="okb">갱신됨</b> ':'')+'최종 갱신 <b class="lut">'+t+'</b>'+(ago&&!rc?'<span class="ago">'+ago+'</span>':'')+(n==='자동 꺼짐'?'':'<span class="nx">'+n+'</span>')}
const reset=()=>{S.pq=S.cq=null};
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('[data-stop]'))stopLoad()});
$('#re').onclick=()=>{const a=$('#df').value,b=$('#dt').value;if(rT&&(a!==S.from||b!==S.to)&&!((a&&a<'2020-01-01')||(b&&b<'2020-01-01')||(a&&b&&a>b))){clearTimeout(rT);rT=0;setRange(a,b)}else load()};
$('#app').onclick=e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.seg){S[b.dataset.seg]=b.dataset.v==='1';S.dd=null;reset();draw()}
 else if(b.dataset.p!==undefined){S.prod=b.dataset.p;reset();draw()}
 else if(b.dataset.tab){S.tab=b.dataset.tab;try{localStorage.setItem('rcDashTab',S.tab)}catch(x){}const tp=document.querySelectorAll('#app .tp');document.querySelectorAll('#app .tabs button').forEach((x,i)=>{const on=x.dataset.tab===S.tab;x.classList.toggle('on',on);if(tp[i])tp[i].hidden=!on})}
 else if(b.dataset.mf!==undefined){S.ddM=b.dataset.mf;drawPane()}
 else if(b.dataset.pfk!==undefined){if(b.dataset.pfk==='*')S.pf=null;else{if(!S.pf)S.pf={q:'',c:'',a:'',g:'',s:''};S.pf[b.dataset.pfk]=b.dataset.pfv}drawPane()}
 else if(b.dataset.dd!==undefined){const k=b.dataset.dd;S.ddM='';S.pf=null;if(!S.ddBack)S.ddBack=[];if(S.dd&&S.dd.k!==k)S.ddBack.push(S.dd);else if(!S.dd)S.ddBack=[];S.dd={k:k,l:(S.DD[k]||{}).l||''};drawPane()}
  else if(b.dataset.act==='big'){S.pnBig=!S.pnBig;drawPane()}
  else if(b.dataset.act==='back'){S.ddM='';S.pf=null;S.dd=(S.ddBack||[]).pop()||null;drawPane()}
 else if(b.dataset.act==='xl')xl(b);
 else if(b.dataset.act==='ddx'){S.dd=null;S.ddBack=[];S.ddM='';S.pf=null;drawPane()}
 else if(b.dataset.act==='cp'){const t=S.cp.join('\n'),ok=()=>{b.textContent='복사됨 ('+S.cp.length+'건)'};if(navigator.clipboard)navigator.clipboard.writeText(t).then(ok,()=>{});else{const a=document.createElement('textarea');a.value=t;document.body.appendChild(a);a.select();document.execCommand('copy');a.remove();ok()}}
 else if(b.dataset.act==='full'){load(true)}
 else if(b.id==='vx'){S.d1=S.d2='';S.dvRows=null;S.dvMsg='';draw()}};
$('#app').onchange=e=>{if(e.target.id==='bc'){S.bc=e.target.value;draw();return}if(e.target.id==='v1')S.d1=e.target.value;else if(e.target.id==='v2')S.d2=e.target.value;else return;if((S.d1&&S.d2)||(!S.d1&&!S.d2))detail()};
$('#sel').onchange=async e=>{const v=e.target.value;if(S.busy){await stopLoad();S.err=''}
 {const A=S.ALL;if(A&&A.k===allKey('')&&Date.now()-A.last.getTime()<60*60e3){const nm=(S.sellers.find(x=>String(x.id)===String(v))||{}).name,hasId=A.rows.some(r=>r.sid),fs=L=>!L?L:!v?L:L.filter(r=>hasId?r.sid===String(v):r.v===nm);const R=fs(A.rows);
  if(!v||R.length){S.seller=v;S.center='';try{localStorage.setItem(LK('rcDashCenter'),'');localStorage.setItem(LK('rcDashSeller'),JSON.stringify({id:S.seller,name:sname()}))}catch(x){}reset();
   S.rows=R;S.tdRows=fs(A.td);S.lkRows=fs(A.lk);S.tdLeak=A.tdLeak;S.cache=v?null:A.cache;S.lc=A.lc;S.last=A.last;S.dvRows=null;S.dvMsg='';S.dvSeq=(S.dvSeq||0)+1;S.err='';
   S.pgInfo=v?'전체 거래처로 받은 데이터('+[A.last.getHours(),A.last.getMinutes()].map(x=>String(x).padStart(2,'0')).join(':')+')에서 걸러 표시 — 다시 받지 않음':A.pg;$('#cen').value='';arm();draw();if(S.d1&&S.d2&&S.d1<=S.d2&&(S.from||S.to))setTimeout(detail,0);return}}}
 S.seller=v;S.center='';try{localStorage.setItem(LK('rcDashCenter'),'')}catch(x){}reset();try{localStorage.setItem(LK('rcDashSeller'),JSON.stringify({id:S.seller,name:sname()}))}catch(x){}S.rows=[];S.cache=null;S.tdRows=S.lkRows=S.dvRows=null;S.dvMsg='';S.dvSeq=(S.dvSeq||0)+1;S.lc=null;S.pgInfo='';$('#app').innerHTML='';load()};
async function sha(t){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')}
function askPw(){return new Promise(res=>{const m=document.createElement('div');m.id='pwm';m.innerHTML='<form><h3>마스터 관리자 확인</h3><p>'+mx()+'일을 넘는 기간(전체 기간 포함)은 서버 부담이 커서 마스터 관리자만 조회할 수 있습니다. 비밀번호를 입력해 주세요.</p><input type="password" autocomplete="off" placeholder="비밀번호"><p class="er"></p><div><button type="button">취소</button><button type="submit" class="pri">확인</button></div></form>';document.body.appendChild(m);const i=m.querySelector('input'),done=v=>{m.remove();res(v)};i.focus();m.querySelector('button[type=button]').onclick=()=>done(false);m.querySelector('form').onsubmit=async e=>{e.preventDefault();let ok=false;try{ok=await sha('rc|'+i.value)===PWH}catch(x){}if(ok)done(true);else{m.querySelector('.er').textContent='비밀번호가 맞지 않습니다.';i.value='';i.focus()}}})}
async function setRange(fr,to){if(S.busy)await stopLoad();
 if(spanD(fr,to)>mx()&&!S.master){if(!await askPw()){$('#df').value=S.from;$('#dt').value=S.to;return}S.master=true}
 S.from=fr;S.to=to;S.fol=S.pb==='dt'&&!!to&&to===today();{const R=defR('ap');S.apDef=S.pb==='ap'&&fr===R[0]&&to===R[1]}$('#df').value=fr;$('#dt').value=to;reset();S.cache=null;load()}
let rT=0;const rDeb=()=>{clearTimeout(rT);rT=setTimeout(()=>{const a=$('#df').value,b=$('#dt').value;if((a&&a<'2020-01-01')||(b&&b<'2020-01-01')||(a&&b&&a>b)){$('#df').value=S.from;$('#dt').value=S.to;return}if(a!==S.from||b!==S.to)setRange(a,b)},800)};$('#df').onchange=rDeb;$('#dt').onchange=rDeb;
$('#dx').onclick=()=>setRange('','');
$('#cen').onchange=async e=>{const v=e.target.value;if(S.busy){await stopLoad();S.err=''}S.center=v;try{localStorage.setItem(LK('rcDashCenter'),S.center)}catch(x){}reset();S.dd=null;if(sc()!==S.lc)S.cache=null;
 if((S.lc===''&&S.center)||(S.lc!==null&&S.lc===sc())){draw();return}
 load()};
$('#iv').onchange=e=>{S.min=+e.target.value;try{localStorage.setItem('rcDashMin2',String(S.min))}catch(x){}arm();if(S.rows.length)draw();else tick()};
$('#snap').onclick=()=>{const d=document.documentElement.cloneNode(true);d.querySelectorAll('script,.ctl,.tabs,.lnk,.dv,#ddl,#pane,#pb').forEach(n=>n.remove());d.querySelectorAll('.tp').forEach(n=>{n.removeAttribute('hidden');const t=n.querySelector('h3');if(t)t.style.display='block'});
 const st=d.querySelector('#stamp');if(st&&S.last)st.textContent='스냅샷 '+S.last.toLocaleString('ko-KR',{hour12:false})+(S.center?' · '+S.center:'');
 const a=document.createElement('a'),p=n=>String(n).padStart(2,'0'),t=S.last||new Date();a.href=URL.createObjectURL(new Blob(['<!doctype html>'+d.outerHTML],{type:'text/html'}));a.download=sname().replace(/[^0-9A-Za-z가-힣]+/g,'')+'_대시보드_'+t.getFullYear()+p(t.getMonth()+1)+p(t.getDate())+'_'+p(t.getHours())+p(t.getMinutes())+'.html';a.click()};
fillSel();const ready=sellers();
const IV=setInterval(()=>{if(S.next&&Date.now()>=S.next&&!S.busy&&!document.hidden)load();else tick()},1000);
let bc=null;try{bc=new BroadcastChannel('rcDash');bc.onmessage=e=>{if(e.data==='hello'&&!S.dup)bc.postMessage('here');else if(e.data==='here'&&!S.last&&!S.busy)S.dup=true};bc.postMessage('hello')}catch(e){}
setTimeout(()=>{if(S.dup){$('#iv').disabled=true;$('#app').innerHTML='<div class="dupn"><h3>이 대시보드가 다른 탭에 이미 열려 있습니다</h3><p>서버 부담을 줄이기 위해 이 탭은 자동으로 조회하지 않습니다.<br>먼저 열어 둔 탭을 사용하시고, 꼭 필요할 때만 오른쪽 위 [새로고침]을 눌러 주세요.</p></div>';tick()}else ready.then(()=>{fillSel();load()},()=>load())},bc?400:0);
window.__rcKill=()=>{S.dead=true;clearInterval(IV);try{if(bc)bc.close()}catch(e){}if(S.ac)S.ac.abort()};
}

if(location.host!=='admin.flowfix.co.kr'){alert('FlowFix 관리자 화면(admin.flowfix.co.kr)에 로그인한 탭에서 눌러주세요.');return}
var w=window.__RC_SAME_TAB?window:(window.__RC_W&&!window.__RC_W.closed?window.__RC_W:window.open('','redcapDash'));window.__RC_W=null;
if(!w){alert('팝업이 차단되었습니다. 주소창 오른쪽의 팝업 차단 아이콘에서 허용한 뒤 다시 눌러주세요.');return}
var ic=(document.querySelector('link[rel~="icon"]')||{}).href||(location.origin+'/favicon.ico');
w.document.open();w.document.write('<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>주문현황 대시보드</title><link rel="icon" href="'+String(ic).replace(/["<>]/g,'')+'"></head><body><script>('+dash.toString()+')()<\/script></body></html>');w.document.close();
if(window.__RCC){try{var x=w.document.getElementById('ver');if(x)x.textContent+=' · 저장본(서버 연결 안 됨)'}catch(e){}}window.__RCC=0;
})()