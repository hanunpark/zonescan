/* 루티 재고 공급 현황 대시보드 v2.5 · 2026-11-27 — 루티 관리자 화면에서 로더 북마크로 불러 씀 */
/* 루티 재고 공급 현황 대시보드 v2.5 (2026-11-27)
   admin.flowfix.co.kr 에 로그인한 탭에서 로더 북마크를 누르면 새 탭에 열린다(루티 화면은 그대로 둔다). 조회(GET)만 하며 데이터를 바꾸지 않는다.
   주문 조회 + 직송입고 + 발주입고 + 간선입고 + 반납/회수 메뉴를 각각 조회해 운송장 단위로 묶는다.
   서버 배포: build.js가 zonescan 저장소 rt/supply.js(최신)와 rt/supply-버전.js(고정)를 쓴다. 로더가 누를 때마다 rt/supply.js를 받아 실행한다.
   v2.4: 서버 부하 기준(자동 갱신 기본 끄기 · 30/60분, 탭 복귀 갱신 없음), [새로고침]은 바뀐 것만, 입고 상세 · 마지막 화면을 이 PC에 저장해 다시 열 때 바로 표시,
         요청 동시 4건 · 30초 제한 · 1회 재시도 · 중단, 조회 실패 때 수치가 틀어지지 않게 보류 처리, 하단 고정 목록 패널, 재배차 대기 · 운송장 없는 주문 판정 수정
   v2.5: 별도 확인 대상 — ① 이중 공급 ② 도착 센터 불일치 ③ 취소 주문인데 입고 진행 중(사용자 결정 2026-11-27) */
(function () {
/* 대시보드 본체. 아래 런처가 새 탭(about:blank, 루티와 같은 출처)에 이 함수의 소스를 심어 그 탭 안에서 실행한다.
   그래서 루티 탭을 닫거나 다른 화면으로 옮겨도 대시보드 탭은 계속 동작한다. */
function supDash() {
  'use strict';
  var VER = 'v2.5 (2026-11-27)';
  /* 화면 안 보라색 버튼에 담기는 로더 북마크. build.js가 loader.js 내용으로 바꿔 넣는다 */
  var BOOKMARK = "javascript:(async%20function()%7Bif(!%2F(%5E%7C%5C.)flowfix%5C.co%5C.kr%24%2F.test(location.hostname))%7Balert('%EB%A3%A8%ED%8B%B0%20%EA%B4%80%EB%A6%AC%EC%9E%90%20%ED%99%94%EB%A9%B4(admin.flowfix.co.kr)%EC%97%90%20%EB%A1%9C%EA%B7%B8%EC%9D%B8%ED%95%9C%20%ED%83%AD%EC%97%90%EC%84%9C%20%EB%88%8C%EB%9F%AC%20%EC%A3%BC%EC%84%B8%EC%9A%94.')%3Breturn%7D%0Avar%20w%3Dwindow.open(''%2C'supDash')%3Bif(!w)%7Balert('%ED%8C%9D%EC%97%85%EC%9D%B4%20%EC%B0%A8%EB%8B%A8%EB%90%98%EC%97%88%EC%8A%B5%EB%8B%88%EB%8B%A4.%20%EC%A3%BC%EC%86%8C%EC%B0%BD%20%EC%98%A4%EB%A5%B8%EC%AA%BD%EC%9D%98%20%ED%8C%9D%EC%97%85%20%EC%B0%A8%EB%8B%A8%20%EC%95%84%EC%9D%B4%EC%BD%98%EC%97%90%EC%84%9C%20%EC%9D%B4%20%EC%82%AC%EC%9D%B4%ED%8A%B8%EB%A5%BC%20%ED%97%88%EC%9A%A9%ED%95%9C%20%EB%92%A4%20%EB%8B%A4%EC%8B%9C%20%EB%88%8C%EB%9F%AC%20%EC%A3%BC%EC%84%B8%EC%9A%94.')%3Breturn%7D%0Atry%7Bw.document.open()%3Bw.document.write('%3C!doctype%20html%3E%3Cmeta%20charset%3D%22utf-8%22%3E%3Ctitle%3E%EC%9E%85%EA%B3%A0%ED%98%84%ED%99%A9%20%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C%3C%2Ftitle%3E%3Cp%20style%3D%22font%3A15px%20-apple-system%2Csans-serif%3Bpadding%3A60px%3Btext-align%3Acenter%3Bcolor%3A%2355526b%22%3E%EC%B5%9C%EC%8B%A0%20%EC%9E%AC%EA%B3%A0%20%EA%B3%B5%EA%B8%89%20%ED%98%84%ED%99%A9%20%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C%EB%A5%BC%20%EB%B0%9B%EB%8A%94%20%EC%A4%91%EC%9E%85%EB%8B%88%EB%8B%A4%E2%80%A6%3C%2Fp%3E')%3Bw.document.close()%7Dcatch(e)%7B%7D%0Avar%20c%3Dnull%2Ck%3D'supDashLauncher'%3Btry%7Bvar%20r%3Dawait%20fetch('https%3A%2F%2Fhanunpark.github.io%2Fzonescan%2Frt%2Fsupply.js%3Ft%3D'%2BDate.now()%2C%7Bcache%3A'no-store'%7D)%3Bif(r.ok)%7Bc%3Dawait%20r.text()%3Bif(c.indexOf('%EB%A3%A8%ED%8B%B0%20%EC%9E%AC%EA%B3%A0%20%EA%B3%B5%EA%B8%89%20%ED%98%84%ED%99%A9%20%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C')%3C0)c%3Dnull%3Belse%20try%7BlocalStorage.setItem(k%2Cc)%7Dcatch(e)%7B%7D%7D%7Dcatch(e)%7B%7D%0Awindow.__SDC%3D0%3Bif(!c)%7Btry%7Bc%3DlocalStorage.getItem(k)%7Dcatch(e)%7B%7Dwindow.__SDC%3D1%7D%0Aif(!c)%7Bw.close()%3Balert('%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C%EB%A5%BC%20%EB%B0%9B%EC%A7%80%20%EB%AA%BB%ED%96%88%EC%8A%B5%EB%8B%88%EB%8B%A4.%20%EC%9D%B8%ED%84%B0%EB%84%B7%20%EC%97%B0%EA%B2%B0%EC%9D%84%20%ED%99%95%EC%9D%B8%ED%95%98%EA%B3%A0%20%EC%9E%A0%EC%8B%9C%20%EB%92%A4%20%EB%8B%A4%EC%8B%9C%20%EB%88%8C%EB%9F%AC%20%EC%A3%BC%EC%84%B8%EC%9A%94.')%3Breturn%7D%0Awindow.__SD_W%3Dw%3B(new%20Function(c))()%7D)()";
  var ID = 'supDash';
  var prev = document.getElementById(ID);
  if (prev) prev.remove();
  if (window.__supDashOff) { try { window.__supDashOff(); } catch (e) {} }

  var API = 'https://api-prod.flowfix.co.kr/api/v1';
  /* FDC 입고 전 운송장상태(허용 목록). 목록에 없는 새 상태가 생기면 집계에서 빼고 화면에 알린다 */
  var PRE_FDC = ['PENDING_RECEIPT', 'RECEIPT_CONFIRMED'];
  var POST_FDC = /INBOUND_COMPLETED|DRIVER_|PICKUP_|WORK_|RETURN|COLLECT|CANCEL|DELIVERY_|GATHERING|VENDOR|REDISPATCH|CENTER_OUTBOUND/;
  var D_OPEN = ['PENDING', 'PENDING_CONFIRMED', 'ASSIGNMENT_CONFIRMED', 'IN_TRANSIT', 'PARTIALLY_CONFIRMED'];
  var D_LABEL = { PENDING: '직송대기', PENDING_CONFIRMED: '직송확정', ASSIGNMENT_CONFIRMED: '배차확정', IN_TRANSIT: '직송이동중', PARTIALLY_CONFIRMED: '부분확정(잔량)' };
  /* 유형별 단계: [키, 화면 이름, 루티 상태 설명] */
  var TYPES = [
    { k: 'direct', n: '직송입고', d: '거래처 창고 등 외부 → FDC', st: [['plan', '계획', '직송대기'], ['conf', '확정', '직송확정 · 배차확정'], ['move', '이동중', '직송이동중'], ['part', '잔량', '부분확정 후 미도착']] },
    { k: 'po', n: '발주입고', d: '공급처 → FDC', st: [['plan', '계획', '발주대기(미확정)'], ['conf', '확정', '발주확정 = 입고예정'], ['part', '잔량', '부분입고 후 미도착']] },
    { k: 'trunk', n: '간선입고', d: 'FC → 간선차량 → FDC', st: [['plan', '계획', 'FC 보관 · 간선 미지시'], ['conf', '확정', '간선출고대기'], ['move', '이동중', '간선이동중'], ['part', '잔량', '부분확정 후 미도착']] },
    /* 픽업설치는 센터를 거치지 않는다: 외부 픽업지 → 기사 → 고객. 픽업 후 취소 · 연기될 때만 센터로 반입된다. */
    { k: 'pick', n: '픽업설치', d: '외부 픽업지 → 기사 → 고객 (센터를 거치지 않음)', st: [['plan', '픽업지 입고 대기', '발주확정, 픽업지에 아직 미입고'], ['conf', '픽업 대기', '기사가 아직 픽업 전'], ['move', '픽업중', '기사가 픽업지에서 상차 중'], ['done', '픽업완료', '기사 보유, 설치 전'], ['ret', '센터 반입 중', '픽업 후 취소 · 연기, 센터 입고예정']] },
    /* 반납: 기사앱 반납 처리 → 운송장 반납중 + 입고 > 반납/회수 처리에 입고예정 → 센터가 실물 스캔 → 입고확정(최종 종결) */
    { k: 'ret', n: '반납입고', d: '기사 → 센터 (출고 · 픽업 후 취소 · 연기)', st: [['ret', '입고예정', '기사가 반납 처리, 센터 스캔 전']] },
    /* 회수: 기사앱 회수 입력 → 운송장 회수중 + 입고 > 반납/회수 처리에 입고예정 → 센터가 운송장 스캔 → 입고확정 */
    { k: 'col', n: '회수입고', d: '고객 → 기사 → 센터 (교체회수 등 회수 주문)', st: [['col', '입고예정', '기사가 회수 입력, 센터 스캔 전']] }
  ];
  var PICK_ST = ['INBOUND_COMPLETED', 'PICKUP_OUTBOUND_WAITING', 'PICKUP_IN_PROGRESS', 'PICKUP_COMPLETED'];
  var ACT = {
    none: '주문 > 주문 접수 승인 관리에서 접수승인, 직송예정입고 생성, 발주요청 중 하나를 진행',
    direct_plan: '입고 > 직송 입고에서 직송확정', direct_conf: '입고 > 직송 입고에서 차량배정 · 출고처리',
    direct_move: '도착 여부 확인 후 센터관리자앱에서 입고 스캔', part: '미도착분 확인 후 추가 입고 또는 입고마감',
    po_plan: '발주 > 발주 등록에서 발주확정', po_conf: '공급처 출고 여부 확인 후 입고 > 발주 입고에서 입고처리',
    trunk_plan: '출고 > 간선작업지시에서 간선 작업 생성', trunk_conf: '출고 > 간선작업지시에서 상차 · 출고완료', trunk_move: '도착 후 입고 > 간선 입고에서 입고 스캔',
    pick_plan: '공급처 출고 여부 확인 후 입고 > 발주 입고에서 픽업지 입고처리', pick_conf: '기사 배정 · 일정 확정 후 약속일에 기사앱에서 픽업확정',
    pick_move: '기사가 픽업지에서 운송장 스캔 후 픽업완료 처리', pick_done: '설치 완료 처리 대기. 취소 · 연기되면 주문의 센터로 반납', pick_ret: '센터에 실물이 도착하면 입고 > 반납/회수 처리에서 스캔해 입고확정. 입고확정이 반납의 최종 종결',
    col_col: '센터에 실물이 도착하면 입고 > 반납/회수 처리에서 운송장을 스캔해 입고확정',
    ret_ret: '센터에 실물이 도착하면 입고 > 반납/회수 처리에서 스캔해 입고확정. 입고확정이 반납의 최종 종결',
    mis: '주문상태와 입고 메뉴가 어긋난 건입니다. 주문 접수 승인 관리와 해당 입고 메뉴에서 실제 상태를 확인',
    unk: '입고 메뉴 조회가 일부 실패해 판정을 미뤘습니다. [새로고침]으로 다시 받으면 제자리로 분류됩니다',
    orphan: '연결된 주문이 취소 · 종결됐는지 확인 후 입고취소 또는 입고마감',
    dup: '같은 운송장에 걸린 입고 건 중 하나를 입고취소하거나 수량을 맞춤. 두 곳에서 실물이 오면 한쪽은 남는 재고가 됨',
    cen: '입고 건의 도착 센터 또는 주문의 센터를 바로잡음. 그대로 두면 주문 센터에는 재고가 없음',
    cx: '입고취소 여부를 정하거나, 도착 후 반품 · 다른 주문 배정 등 재고 처리를 정함'
  };
  var MENUS = ['주문', '직송입고', '발주입고', '간선입고', '반납/회수'];

  /* ---------- 이 PC에 남기는 것 (브라우저 저장소, 루티와 같은 출처) ---------- */
  var ls = { get: function (k, d) { try { var v = localStorage.getItem('supDash_' + k); return v == null ? d : v; } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem('supDash_' + k, v); } catch (e) {} } };
  var lsJ = {
    get: function (k) { try { var v = localStorage.getItem('supDash_' + k); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem('supDash_' + k, JSON.stringify(v)); return true; } catch (e) { try { localStorage.removeItem('supDash_' + k); } catch (x) {} return false; } }
  };
  function oneOf(v, list, d) { return list.indexOf(v) >= 0 ? v : d; }
  /* 자동 갱신: 개발팀 요청(2026-11-16)으로 기본 끄기, 선택 30분 · 60분. 예전 설정(5 · 10분)이 남지 않게 새 이름(auto2)으로 기억 */
  var AUTO_OPTS = [[0, '끄기'], [30, '30분'], [60, '60분']];
  var S = { view: oneOf(ls.get('view', 'type'), ['type', 'center'], 'type'), seller: '', product: '', center: '', near: oneOf(+ls.get('near', 2), [1, 2, 3, 5], 2), tk: ls.get('tk', '0') === '1',
    sel: null, back: [], big: false, sort: null, err: '', warns: [], data: null, at: null, tried: 0, src: {}, srcN: null, partial: {}, from: '', to: '', recent: false,
    auto: oneOf(+ls.get('auto2', 0), [0, 30, 60], 0), autoHold: false, busy: false, full: false, info: '', stat: null, prog: {}, ac: null, snap: false, dup: false, t0: 0 };
  function newStat() { return { hit: 0, miss: 0, stale: 0, fail: 0, req: 0, dupRows: 0 }; }
  S.stat = newStat();

  /* 입고 상세 보관: 입고 건 목록의 상태 · 수량 · 일시(서명)가 그대로이고 3시간이 안 됐으면 상세를 다시 받지 않는다.
     필터 목록은 1시간. 이 탭을 닫았다 다시 열어도 이어서 쓴다. [전체 다시 받기]는 보관과 무관하게 전부 받는다. */
  var DET_TTL = 3 * 3600000, FO_TTL = 3600000, AGE_CAP = 10;
  /* 같은 PC에서 운용사가 다른 아이디(예: 컴퓨존 운용사)로 로그인해도 자료가 섞이지 않게 로그인 계정별로 따로 보관한다 */
  function acct() {
    try { var p = JSON.parse(decodeURIComponent(escape(atob(token().split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))))); var a = String(p.sub || p.userId || p.id || p.username || p.email || ''); var hsh = 0; for (var i = 0; i < a.length; i++) hsh = (hsh * 31 + a.charCodeAt(i)) | 0; return a ? (hsh >>> 0).toString(36) : 'x'; } catch (e) { return 'x'; }
  }
  var AC = acct(), CKEY = 'cache24_' + AC, SKEY = 'snap24_' + AC;
  var C = lsJ.get(CKEY);
  if (!C || C.v !== 1 || typeof C.d !== 'object' || typeof C.p !== 'object') C = { v: 1, fo: null, pfo: null, d: {}, p: {} };
  var LAST = {}; /* 메뉴별 마지막 성공 결과(이 탭 안). 한 메뉴만 실패하면 직전 값으로 화면을 유지한다 */

  /* ---------- 조회 ---------- */
  function token() { var m = document.cookie.split(';').map(function (s) { return s.trim(); }).filter(function (s) { return s.indexOf('flowfix-admin-access-token=') === 0; })[0]; return m ? decodeURIComponent(m.slice(m.indexOf('=') + 1)) : ''; }
  function fail(msg, retry, code) { var e = new Error(msg); e.retry = retry; e.code = code; return e; }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  /* 서버에 한 번에 4건까지만 보낸다(입고 상세 수십 건이 한꺼번에 몰리지 않게). 끝나는 대로 다음 요청을 보낸다 */
  var LIM = { max: 4, run: 0, q: [] };
  function pump() { while (LIM.run < LIM.max && LIM.q.length) { LIM.run++; LIM.q.shift()(); } }
  function slot(fn) { return new Promise(function (res, rej) { LIM.q.push(function () { var p; try { p = fn(); } catch (e) { p = Promise.reject(e); } p.then(res, rej).then(function () { LIM.run--; pump(); }); }); pump(); }); }
  function get1(path) {
    return slot(function () {
      var outer = S.ac, ac = new AbortController(), timedOut = false;
      if (outer && outer.signal.aborted) return Promise.reject(fail('중단했습니다.', false, 'abort'));
      if (outer) outer.signal.addEventListener('abort', function () { ac.abort(); }, { once: true });
      var to = setTimeout(function () { timedOut = true; ac.abort(); }, 30000);
      S.stat.req++;
      return fetch(API + path, { method: 'GET', headers: { Authorization: 'Bearer ' + token() }, signal: ac.signal }).then(function (r) {
        if (r.status === 401 || r.status === 403) throw fail('로그인이 만료됐습니다. 루티에 다시 로그인한 뒤 [새로고침]을 눌러 주세요.', false, 'auth');
        if (!r.ok) throw fail('조회 실패 (' + r.status + ')', r.status >= 500 || r.status === 429, 'http');
        return r.json();
      }, function () {
        if (timedOut) throw fail('서버 응답이 30초 넘게 없습니다.', true, 'timeout');
        if (outer && outer.signal.aborted) throw fail('중단했습니다.', false, 'abort');
        throw fail('네트워크 오류', true, 'net');
      }).then(function (j) { clearTimeout(to); return j ? j.data : null; }, function (e) { clearTimeout(to); throw e; });
    });
  }
  /* 일시적인 실패(서버 오류 · 응답 지연 · 네트워크)는 0.8초 뒤 한 번 더. 로그인 만료면 나머지 요청도 멈춘다 */
  function get(path) {
    return get1(path).catch(function (e) {
      if (e.code === 'auth' && S.ac) { S.authBad = true; S.ac.abort(); }
      if (!e.retry) throw e;
      return wait(800).then(function () { return get1(path); });
    });
  }
  function prog(step, d, t) { S.prog[step] = [d, t]; tickSoon(); }
  function pages(path, step, cap) {
    var sep = path.indexOf('?') < 0 ? '?' : '&', mx = cap || 30;
    return get(path + sep + 'page=1').then(function (d) {
      var items = (d && d.items) || [], tp = (d && d.totalPages) || 1, n = Math.min(tp, mx), rest = [];
      if (tp > mx && !cap) S.warns.push(step + ' 목록이 ' + tp + '쪽이라 앞 ' + mx + '쪽만 받았습니다.');
      for (var p = 2; p <= n; p++) rest.push(get(path + sep + 'page=' + p));
      return Promise.all(rest).then(function (ds) { ds.forEach(function (x) { items = items.concat((x && x.items) || []); }); return items; });
    });
  }
  function names(a) { return (a || []).map(function (x) { return typeof x === 'string' ? x : x && (x.code || x.value || x.name) || ''; }).filter(Boolean); }
  function cachedFO(key, path) {
    var c = C[key]; if (c && Date.now() - c.at < FO_TTL) return Promise.resolve(c.v);
    return get(path).then(function (v) { C[key] = { v: v || {}, at: Date.now() }; return v || {}; });
  }
  /* 입고 상세: 서명이 같고 보관 3시간 이내면 재사용. 받다가 실패한 건은 보관된 이전 상세로 대신하고(stale),
     이전 상세도 없으면 그 메뉴를 '일부 실패'로 표시한다(그 때문에 생기는 불일치는 '판정 보류'로 돌린다) */
  function details(store, menu, heads, sigOf, fetchLines, slimLine, full) {
    var seen = {}, list = heads.filter(function (h) { if (h.id == null || seen[h.id]) return false; seen[h.id] = 1; return true; });
    var now = Date.now(), keep = {}, out = [], todo = [];
    var aged = [];
    list.forEach(function (h) {
      var sig = sigOf(h), c = C[store][h.id];
      if (!full && c && c.s === sig) { if (now - c.at < DET_TTL) { keep[h.id] = c; S.stat.hit++; out.push({ h: h, lines: c.l }); } else aged.push({ h: h, sig: sig, c: c }); }
      else todo.push({ h: h, sig: sig, c: c });
    });
    /* 보관 3시간이 지난 건은 한 번에 10건까지만 다시 받는다(한꺼번에 몰리지 않게, 오래된 것부터). 나머지는 다음 갱신 때 */
    aged.sort(function (a, b) { return a.c.at - b.c.at; });
    aged.forEach(function (t, i) { if (i < AGE_CAP) todo.push(t); else { keep[t.h.id] = t.c; S.stat.hit++; out.push({ h: t.h, lines: t.c.l }); } });
    var done = 0; prog(menu, 0, todo.length);
    return Promise.all(todo.map(function (t) {
      return fetchLines(t.h).then(function (lines) {
        var l = (lines || []).map(slimLine); keep[t.h.id] = { s: t.sig, at: Date.now(), l: l }; S.stat.miss++; out.push({ h: t.h, lines: l });
      }, function (e) {
        if (e.code === 'abort' || e.code === 'auth') throw e;
        if (t.c) { keep[t.h.id] = t.c; S.stat.stale++; out.push({ h: t.h, lines: t.c.l }); }
        else { S.stat.fail++; S.partial[menu] = (S.partial[menu] || 0) + 1; }
      }).then(function () { prog(menu, ++done, todo.length); });
    })).then(function () { C[store] = keep; return out; });
  }
  function dsig(h) { return [h.inboundStatus, h.expectedQuantity, h.confirmedQuantity, h.scanQuantity, h.orderCount, h.expectedDate, h.expectedDepartureDate, h.directConfirmedAt, h.carrierUpdatedAt, h.directDepartedAt, h.confirmedAt, h.arrivalCenter].join('|'); }
  function psig(h) { return [h.inboundStatus, h.totalPurchaseOrderQuantity, h.totalInboundQuantity, h.totalRemainingQuantity, h.desiredInboundDate, h.inboundProcessedAt, h.relatedOrderCount, h.waybillCount, h.productCount].join('|'); }
  /* 보관 · 화면에 쓰는 값만 남긴다 */
  function slimD(l) { return { status: l.status, waybillId: l.waybillId, waybillNumber: l.waybillNumber, orderNumber: l.orderNumber, productName: l.productName }; }
  function slimP(l) { return { remainingQuantity: l.remainingQuantity, inboundStatus: l.inboundStatus, waybillNumber: l.waybillNumber, orderNumber: l.orderNumber, productName: l.productName, centerName: l.centerName, orderSupplierName: l.orderSupplierName }; }
  function slim(o) { return { orderNumber: o.orderNumber, supplierName: o.supplierName, serviceMethod: o.serviceMethod, productName: o.productName, orderSpecificationType: o.orderSpecificationType, assignedToDriver: o.assignedToDriver, pickupPlaceName: o.pickupPlaceName }; }
  function menu(name, p) {
    return p.then(function (v) { S.srcN[name] = S.partial[name] ? 'part' : true; LAST[name] = { v: v, at: Date.now() }; return v; }, function (e) {
      if (e.code === 'abort' || e.code === 'auth') throw e;
      if (LAST[name]) { S.srcN[name] = 'stale'; S.warns.push(name + ' 조회 실패(' + e.message + ') — ' + hm(new Date(LAST[name].at)) + '에 받은 값으로 보여 줍니다.'); return LAST[name].v; }
      S.srcN[name] = e.message || '실패'; return null;
    });
  }

  /* full: [전체 다시 받기] — 보관된 입고 상세 · 필터 목록과 무관하게 전부 다시 받는다 */
  function load(full) {
    if (S.busy) return Promise.resolve();
    S.busy = true; S.full = !!full; S.err = ''; S.warns = []; S.partial = {}; S.srcN = {}; S.prog = {}; S.stat = newStat(); S.tried = Date.now(); S.t0 = Date.now(); S.authBad = false;
    S.ac = new AbortController();
    if (full) { C.fo = null; C.pfo = null; }
    render();
    var orders = menu('주문', cachedFO('fo', '/admin/orders/filter-options?').then(function (fo) {
      var all = names(fo.waybillStatus), st = all.filter(function (s) { return PRE_FDC.indexOf(s) >= 0; });
      var unknown = all.filter(function (s) { return PRE_FDC.indexOf(s) < 0 && !POST_FDC.test(s); });
      if (unknown.length) S.warns.push('처음 보는 운송장상태 ' + unknown.join(', ') + '는 이 대시보드에서 빼고 셉니다. FDC 입고 전 상태라면 알려 주세요.');
      if (!st.length) st = PRE_FDC.slice();
      st.push('RETURNING');
      var mAll = names(fo.serviceMethod), ms = mAll.filter(function (m) { return !/회수/.test(m); });
      var pm = mAll.filter(function (m) { return /픽업/.test(m); });
      var parts = [pages('/admin/orders?waybillStatuses=' + st.join(',') + (ms.length ? '&serviceMethods=' + encodeURIComponent(ms.join(',')) : ''), '주문'), pages('/admin/orders?waybillStatuses=COLLECTING', '주문')];
      if (pm.length) parts.push(pages('/admin/orders?serviceMethods=' + encodeURIComponent(pm.join(',')) + '&waybillStatuses=' + PICK_ST.join(','), '주문'));
      prog('주문', 0, parts.length);
      var n = 0; parts.forEach(function (p) { p.then(function () { prog('주문', ++n, parts.length); }, function () {}); });
      return Promise.all(parts).then(function (r) { return [].concat.apply([], r); });
    }));
    var direct = menu('직송입고', pages('/inbounds/direct/search?inboundStatus=' + D_OPEN.join(','), '직송입고').then(function (heads) {
      /* 벌크 직송(주문과 무관한 재고 보충)은 상세가 필요 없다: 남은 수량만 목록에서 센다 */
      var bulk = 0, norm = heads.filter(function (h) { if (h.inboundModeCode === 'BULK') { bulk += Math.max(0, (h.expectedQuantity || 0) - (h.confirmedQuantity || 0)); return false; } return true; });
      return details('d', '직송입고', norm, dsig, function (h) { return get('/inbounds/direct/' + h.id).then(function (d) { return (d && d.details) || []; }); }, slimD, full).then(function (rows) { return { rows: rows, bulk: bulk }; });
    }));
    var po = menu('발주입고', cachedFO('pfo', '/purchase-order-inbounds/filter-options?').then(function (fo) {
      var st = (names(fo.inboundStatuses).length ? names(fo.inboundStatuses) : ['PENDING']).filter(function (s) { return !/^(CONFIRMED|CLOSED|CANCELLED)$/.test(s); });
      if (!st.length) return [];
      return pages('/purchase-order-inbounds?inboundStatuses=' + st.join(','), '발주입고').then(function (heads) {
        return details('p', '발주입고', heads, psig, function (h) { return get('/purchase-order-inbounds/' + h.id).then(function (d) { return (d && d.purchaseOrderDetails) || []; }); }, slimP, full);
      });
    }));
    var trunk = menu('간선입고', pages('/admin/trunk-inbounds?', '간선입고').then(function (heads) {
      heads = heads.filter(function (h) { return !/^(CONFIRMED|CLOSED|CANCELLED)$/.test(h.trunkStatus); });
      return Promise.all(heads.map(function (h) { return pages('/admin/trunk-inbounds/' + h.id + '/waybills?', '간선입고').then(function (ws) { return { h: h, lines: ws }; }); }));
    }));
    var rets = menu('반납/회수', pages('/collectionReturns?inboundStatus=PENDING', '반납/회수'));
    /* 최근 60일 취소 운송장(주문일 기준, 최대 3쪽). '주문 없는 입고 대기 행' 중 취소 주문을 가려내는 데만 쓴다. 30분 재사용, 실패해도 화면에는 영향 없음 */
    var cxP = (function () {
      var c = C.cx; if (!full && c && Date.now() - c.at < 30 * 60000) return Promise.resolve(c.v);
      return pages('/admin/orders?waybillStatuses=CANCELLED&dateType=orderDate&from=' + ymd(dayAdd(-60)) + '&to=' + ymd(dayAdd(0)), '취소', 3).then(function (rows) {
        var v = rows.map(function (o) { return { waybillId: o.waybillId, waybillNumber: o.waybillNumber, orderNumber: o.orderNumber, orderStatus: o.orderStatus, supplierName: o.supplierName, centerName: o.centerName, serviceMethod: o.serviceMethod, productName: o.productName, orderSpecificationType: o.orderSpecificationType, orderAppointedDate: o.orderAppointedDate, receiptDate: o.receiptDate }; });
        C.cx = { v: v, at: Date.now() }; return v;
      }, function (e) { if (e.code === 'abort' || e.code === 'auth') throw e; S.cxFail = e.message || '실패'; return c ? c.v : null; });
    })();
    MENUS.forEach(function (m, i) { [orders, direct, po, trunk, rets][i].then(function () { if (!S.prog[m] || m === '간선입고' || m === '반납/회수') prog(m, 1, 1); }, function () {}); });
    S.cxFail = '';
    return Promise.all([orders, direct, po, trunk, rets, cxP]).then(function (r) {
      if (!r[0]) throw new Error('주문 조회 실패 (' + S.srcN['주문'] + ')');
      S.src = S.srcN; /* 메뉴별 조회 표시는 다 받은 뒤에 바꾼다(받는 동안은 직전 상태 유지) */
      S.data = build(r[0], r[1], r[2], r[3], r[4], r[5]); S.at = new Date(); S.snap = false; S.autoHold = false;
      if (S.stat.stale) S.warns.push('입고 상세 ' + S.stat.stale + '건을 이번에 받지 못해 이전에 받은 상세로 대신했습니다. 잠시 뒤 [새로고침]을 눌러 주세요.');
      var sec = ((Date.now() - S.t0) / 1000).toFixed(1);
      S.info = '요청 ' + S.stat.req + '회 · ' + sec + '초 · 입고 상세 ' + S.stat.miss + '건 새로 받음' + (S.stat.hit ? ' · ' + S.stat.hit + '건 변동 없어 재사용' : '') + (S.stat.stale ? ' · ' + S.stat.stale + '건 실패해 이전 상세 사용' : '') + (S.stat.fail ? ' · ' + S.stat.fail + '건 실패' : '') + (S.stat.dupRows ? ' · 겹친 주문 행 ' + S.stat.dupRows + '건 제외' : '');
      lsJ.set(CKEY, C);
      if (lsJ.set(SKEY, { ver: VER, at: S.at.getTime(), src: S.src, info: S.info, warns: S.warns, data: S.data })) bcPost('snap');
    }).catch(function (e) {
      if (S.authBad) { S.err = '로그인이 만료됐습니다. 루티에 다시 로그인한 뒤 [새로고침]을 눌러 주세요.'; S.autoHold = true; }
      else if (e.code === 'abort') S.err = '불러오기를 중단했습니다.';
      else { S.err = e.message || String(e); S.src = S.srcN; }
      if (S.data) S.err += ' 화면은 ' + hm(S.at) + '에 받은 자료입니다.';
    }).then(function () { S.busy = false; S.ac = null; render(); });
  }
  function stopLoad() { if (S.ac) S.ac.abort(); }

  /* ---------- 결합 · 분류 ---------- */
  /* 날짜: 서버 값은 'YYYY-MM-DDTHH:mm:ss'(한국 시각). 혹시 Z · +09:00처럼 시간대가 붙어 오면 한국 날짜로 바꾼다 */
  function d10(v) {
    if (!v) return ''; var s = String(v);
    if (/(Z|[+-]\d\d:?\d\d)$/.test(s)) { var t = Date.parse(s); if (!isNaN(t)) return new Date(t + 9 * 3600000).toISOString().slice(0, 10); }
    return s.slice(0, 10);
  }
  function wid(x) { return x && x.waybillId > 0 ? x.waybillId : null; } /* 운송장 발번 전 주문은 waybillId가 0으로 온다 */
  /* 입고 건 표시용: 유형 + 번호 */
  function vDesc(v) { return v.k === 'direct' ? '직송 ' + (v.h.transportNumber || '') : v.k === 'po' ? '발주 ' + (v.h.purchaseOrderNumber || '') : '간선 ' + (v.h.shipmentId || ''); }
  function vLabel(v) { return v.k === 'direct' ? (D_LABEL[v.h.inboundStatus] || v.h.inboundStatus) : v.k === 'po' ? '발주 입고대기' : (v.h.trunkStatusDescription || v.h.trunkStatus || '간선'); }
  function vEta(v) { return d10(v.k === 'direct' ? v.h.expectedDate : v.k === 'po' ? v.h.desiredInboundDate : v.h.expectedArrivalDate); }
  function vRef(v) { return v.k === 'direct' ? v.h.transportNumber : v.k === 'po' ? v.h.purchaseOrderNumber : v.h.shipmentId; }
  /* 입고 건의 도착 센터. 픽업지로 가는 발주는 센터가 아니므로 비교하지 않는다 */
  function vCenter(v) { if (v.k === 'direct') return v.h.arrivalCenter || ''; if (v.k === 'trunk') return v.h.destinationCenterName || ''; if (v.h.inboundLocationType === 'PICKUP' || /픽업/.test(v.h.inboundLocationTypeName || '')) return ''; return v.l.centerName || v.h.representCenterName || ''; }
  var D_RANK = { PENDING: 1, PENDING_CONFIRMED: 2, ASSIGNMENT_CONFIRMED: 3, IN_TRANSIT: 4, PARTIALLY_CONFIRMED: 5 };
  function cname(x) { return String(x || '').replace(/\s+/g, ''); }
  function build(orders, direct, po, trunk, rets, cx) {
    var src = S.srcN || S.src, isOk = function (m) { return src[m] === true || src[m] === 'stale'; };
    var ok = { direct: isOk('직송입고'), po: isOk('발주입고'), trunk: isOk('간선입고') };
    direct = direct || { rows: [], bulk: 0 }; po = po || []; trunk = trunk || [];
    var rMap = new Map(), usedR = new Set();
    (rets || []).forEach(function (r) { if (r.waybillNumber) rMap.set(r.waybillNumber, r); });
    var WORD = { ret: '반납', col: '회수' };
    /* 진행 중인 입고 행을 운송장 ID와 운송장번호 양쪽으로 찾게 모은다. 한 운송장에 여러 건이 걸리면 모두 남긴다(이중 공급 확인용) */
    var dByI = new Map(), dByN = new Map(), pByN = new Map(), tByI = new Map(), tByN = new Map(), allV = [];
    function put(m, k, v) { if (!k) return; var a = m.get(k); if (a) a.push(v); else m.set(k, [v]); }
    direct.rows.forEach(function (x) { x.lines.forEach(function (l) { if (l.status === 'CONFIRMED' || l.status === 'CANCELLED') return; var v = { k: 'direct', h: x.h, l: l }; allV.push(v); if (wid(l)) put(dByI, l.waybillId, v); if (l.waybillNumber) put(dByN, l.waybillNumber, v); }); });
    po.forEach(function (x) { x.lines.forEach(function (l) { var rem = l.remainingQuantity; if ((rem == null ? l.inboundStatus !== 'CONFIRMED' : rem > 0) && l.waybillNumber) { var v = { k: 'po', h: x.h, l: l }; allV.push(v); put(pByN, l.waybillNumber, v); } }); });
    trunk.forEach(function (x) { x.lines.forEach(function (l) { var v = { k: 'trunk', h: x.h, l: l }; allV.push(v); if (wid(l)) put(tByI, l.waybillId, v); if (l.waybillNumber) put(tByN, l.waybillNumber, v); }); });
    function matches(o) {
      var set = new Set(), num = o.waybillNumber, id = wid(o);
      [id && dByI.get(id), num && dByN.get(num), num && pByN.get(num), id && tByI.get(id), num && tByN.get(num)].forEach(function (a) { if (a) a.forEach(function (v) { set.add(v); }); });
      return Array.from(set);
    }
    /* 한 운송장에 직송이 둘 이상이면 가장 도착에 가까운 건(이동중 · 잔량 > 배차확정 > 직송확정 > 직송대기, 같으면 입고예정일 빠른 것)으로 분류한다 */
    function pickD(list) { return list.slice().sort(function (a, b) { return (D_RANK[b.h.inboundStatus] || 0) - (D_RANK[a.h.inboundStatus] || 0) || String(a.h.expectedDate || '9').localeCompare(String(b.h.expectedDate || '9')); })[0] || null; }
    function pickP(list) { return list.slice().sort(function (a, b) { return String(a.h.desiredInboundDate || '9').localeCompare(String(b.h.desiredInboundDate || '9')); })[0] || null; }

    /* 같은 운송장이 두 번 오면(조회 중 목록이 밀린 경우 등) 한 번만 센다. 운송장 발번 전 행은 주문 안의 수량 단위라 그대로 둔다 */
    var seen = new Set();
    orders = orders.filter(function (o) { var k = wid(o) ? 'i' + o.waybillId : o.waybillNumber ? 'n' + o.waybillNumber : null; if (!k) return true; if (seen.has(k)) { S.stat.dupRows++; return false; } seen.add(k); return true; });

    var items = [], cancels = [], usedLines = new Set(), exLines = new Map();
    function cancelItem(o, ms, why) {
      var v = ms[0];
      return { g: 'cx', type: v.k, stage: '', cx: why, label: why + ' · ' + ms.map(function (m) { return vDesc(m) + ' ' + vLabel(m); }).join(' + ') + ' 진행 중', ref: ms.map(vRef).filter(Boolean).join(', '), eta: vEta(v),
        center: o.centerName || vCenter(v) || '(센터 미지정)', due: d10(o.orderAppointedDate), wb: o.waybillNumber || (v.l && v.l.waybillNumber) || '', od: d10(o.receiptDate) || d10(o.orderDate), o: slim(o) };
    }
    orders.forEach(function (o) {
      var ms = matches(o);
      var d = pickD(ms.filter(function (v) { return v.k === 'direct'; })), p = pickP(ms.filter(function (v) { return v.k === 'po'; })), t = ms.filter(function (v) { return v.k === 'trunk'; })[0] || null;
      var returning = o.waybillStatus === 'RETURNING', collecting = o.waybillStatus === 'COLLECTING';
      var why = /컴퓨존/.test(o.supplierName || '') ? 'cz' : (/^CANCELLED/.test(o.orderStatus || '') && !returning && !collecting) ? '주문 취소됨' : (o.serviceCategory === '회수' && !collecting) ? '회수 주문' : '';
      /* 집계에서 빼는 주문도 연결된 입고 행은 '사용됨'으로 표시해 '주문 없는 입고 대기 행'으로 잘못 잡히지 않게 한다 */
      ms.forEach(function (m) { if (!why) usedLines.add(m.l); else exLines.set(m.l, why); });
      /* 별도 확인 ③: 취소된 주문인데 입고가 진행 중(도착 예정) — 집계에는 넣지 않고 따로 보여 준다 */
      if (why === '주문 취소됨' && ms.length) { cancels.push(cancelItem(o, ms, '주문 취소됨')); return; }
      if (why) return;
      var c = classify(o, d, p, t);
      if (c.g === 'mis' && !(ok.direct && ok.po && ok.trunk)) { c.g = 'unk'; c.label += ' · 입고 메뉴 조회 일부 실패로 판정 보류'; }
      c.o = slim(o); c.wb = o.waybillNumber || ''; c.od = d10(o.receiptDate) || d10(o.orderDate); /* 조회 기간 기준 = 접수일(주문 목록의 접수일 열). 비어 있으면 주문일 */
      c.center = c.center || o.centerName || '(센터 미지정)'; c.due = d10(o.orderAppointedDate); c.eta = d10(c.eta);
      if (c.g !== 'ret' && c.g !== 'col') {
        /* 별도 확인 ①: 이중 공급 — 한 운송장에 진행 중인 입고 건이 둘 이상(직송 · 발주 · 간선, 같은 유형 두 건 포함) */
        if (ms.length >= 2) { c.dupSup = ms.map(vDesc).join(' + '); c.label += ' · 이중 공급: ' + c.dupSup; }
        /* 별도 확인 ②: 도착 센터 불일치 — 입고 건의 도착 센터가 주문의 센터와 다름(픽업설치 · 픽업지 발주는 제외) */
        if (!/픽업/.test(o.serviceMethod || '') && o.centerName) {
          var bad = uniq(ms.map(vCenter).filter(function (cn) { return cn && cname(cn) !== cname(o.centerName); }));
          if (bad.length) { c.cenMis = bad.join(', '); c.label += ' · 도착 센터 ' + c.cenMis + ' ≠ 주문 센터 ' + o.centerName; }
        }
        /* 별도 확인 ③: 취소요청 등 취소 진행 중인 주문인데 입고가 진행 중 — 집계에는 그대로 두고 따로도 보여 준다 */
        if (/^CANCEL/.test(o.orderStatus || '') && ms.length) { c.cx = '취소요청'; c.label += ' · 취소요청 주문'; cancels.push(c); }
      }
      items.push(c);
    });
    /* 반납 · 회수: 주문의 반납중 · 회수중과 반납/회수 처리의 입고예정을 운송장번호로 맞춘다 */
    items.forEach(function (c) {
      if (c.g !== 'ret' && c.g !== 'col') return;
      var w = WORD[c.g], r = rMap.get(c.wb);
      if (!isOk('반납/회수')) { c.label = w + '중 (반납/회수 처리 조회 실패로 입고예정 여부 미확인)'; return; }
      if (!r) { c.g = 'mis'; c.type = ''; c.stage = ''; c.label = w + '중인데 반납/회수 처리에 입고예정 건 없음'; return; }
      usedR.add(c.wb); c.rdate = d10(r.createdAt); c.center = r.centerName || c.center;
      c.label = w + ' 입고예정 · ' + w + ' 처리 ' + c.rdate + (c.isPick ? ' · 픽업설치' : '');
    });
    rMap.forEach(function (r, wb) {
      if (usedR.has(wb) || /컴퓨존/.test(r.supplierName || '')) return;
      var g = r.inboundType === 'COLLECTION' ? 'col' : 'ret', w = WORD[g];
      items.push({ g: g, type: g, stage: g, isPick: false, rdate: d10(r.createdAt), label: w + ' 입고예정 · ' + w + ' 처리 ' + d10(r.createdAt) + ' (주문 목록에 없음)', center: r.centerName || '(센터 미지정)', due: d10(r.appointedDate), eta: '', od: '', wb: wb,
        o: { orderNumber: r.orderNumber, supplierName: r.supplierName, serviceMethod: '', productName: '', orderSpecificationType: '', assignedToDriver: '' } });
    });
    /* 주문 목록에 없는 입고 대기 행: 운송장이 취소된 주문(최근 60일 취소 운송장 조회)이면 별도 확인 ③으로 옮긴다 */
    var cxI = new Map(), cxN = new Map();
    (cx || []).forEach(function (o) { if (wid(o)) cxI.set(o.waybillId, o); if (o.waybillNumber) cxN.set(o.waybillNumber, o); });
    var orphans = [], seenV = new Set();
    allV.forEach(function (v) {
      if (seenV.has(v)) return; seenV.add(v);
      if (usedLines.has(v.l)) return;
      var why = exLines.get(v.l), sup = v.k === 'po' ? v.l.orderSupplierName : v.h.supplierName;
      if (why === 'cz' || why === '주문 취소됨' || /컴퓨존/.test(sup || '')) return;
      var co = (wid(v.l) && cxI.get(v.l.waybillId)) || (v.l.waybillNumber && cxN.get(v.l.waybillNumber));
      if (co && !/컴퓨존/.test(co.supplierName || '')) { cancels.push(cancelItem(co, [v], '주문 취소됨(운송장 취소)')); return; }
      orphans.push({ g: 'orphan', type: v.k, label: vLabel(v) + (why ? ' · ' + why : ''), ref: vRef(v), eta: vEta(v), due: '', center: vCenter(v) || (v.k === 'po' ? v.l.centerName || '' : ''), wb: v.l.waybillNumber || '', od: '',
        o: { orderNumber: v.l.orderNumber, supplierName: sup || '', productName: v.l.productName, serviceMethod: '', orderSpecificationType: '' } });
    });
    /* 화면을 그릴 때마다 다시 계산하지 않게 구분 · 품목을 미리 붙여 둔다 */
    items.concat(orphans, cancels).forEach(function (x) { x.tk = /^택배/.test(x.o.serviceMethod || ''); x.pt = ptype(x); });
    return { items: items, orphans: orphans, cancels: cancels, bulk: direct.bulk || 0 };
  }
  function classify(o, d, p, t) {
    var os = o.orderStatus || '', loc = o.inventoryLocation || '', ws = o.waybillStatus || '';
    if (ws === 'RETURNING') return { g: 'ret', type: 'ret', stage: 'ret', isPick: /픽업/.test(o.serviceMethod || ''), label: '반납중' };
    if (ws === 'COLLECTING') return { g: 'col', type: 'col', stage: 'col', label: '회수중' };
    /* 재배차 대기 등 이미 FDC에서 출고돼 기사가 들고 있는 건(재고위치 '기사'). 재배차 대기는 조회에서 빼지만 혹시 들어와도 공급 대상이 아니다 */
    if (ws === 'REDISPATCH_WAITING' || loc === '기사') return { g: 'skip', label: '기사 보유' };
    /* 픽업설치는 센터를 거치지 않으므로 직송 · 발주 · 간선보다 먼저 본다(분류 규칙의 첫 줄) */
    if (/픽업/.test(o.serviceMethod || '')) {
      var pp = o.pickupPlaceName ? ' · ' + o.pickupPlaceName : '';
      if (ws === 'PICKUP_COMPLETED') return { g: 'pick', type: 'pick', stage: 'done', label: '픽업완료 · 기사 보유' };
      if (ws === 'PICKUP_IN_PROGRESS') return { g: 'pick', type: 'pick', stage: 'move', label: '픽업중' + pp };
      if (os === 'PENDING_RECEIPT') return { g: 'none', label: '접수대기' };
      if (/HOLD/.test(os)) return { g: 'none', label: '접수보류' };
      if (p) return { g: 'pick', type: 'pick', stage: 'plan', label: '픽업지 입고예정 (발주확정)' + pp, eta: p.h.desiredInboundDate, ref: p.h.purchaseOrderNumber };
      if (os === 'PURCHASE_ORDER_REQUESTED') return { g: 'pick', type: 'pick', stage: 'plan', label: '발주요청(미확정) · 픽업지 입고 전' + pp };
      /* 픽업지 입고가 끝난 건은 발주 행이 닫혀 있어도 불일치가 아니다 */
      if (ws === 'PICKUP_OUTBOUND_WAITING') return { g: 'pick', type: 'pick', stage: 'conf', label: '픽업출고대기' + pp };
      if (ws === 'INBOUND_COMPLETED' || /픽업지/.test(loc)) return { g: 'pick', type: 'pick', stage: 'conf', label: '픽업지 입고완료 · 픽업 대기' + pp };
      if (/PURCHASE_ORDER/.test(os)) return { g: 'mis', label: '발주확정인데 진행 중인 발주입고 건 없음' };
      return { g: 'pick', type: 'pick', stage: 'conf', label: '픽업 대기 (픽업지 입고는 전산에 없음)' + pp };
    }
    if (d) { var s = d.h.inboundStatus; return { g: 'need', type: 'direct', stage: s === 'PENDING' ? 'plan' : s === 'IN_TRANSIT' ? 'move' : s === 'PARTIALLY_CONFIRMED' ? 'part' : 'conf', label: D_LABEL[s] || s, eta: d.h.expectedDate, dep: d10(d.h.expectedDepartureDate), ref: d.h.transportNumber, center: d.h.arrivalCenter }; }
    if (p) { var part = (p.h.totalInboundQuantity || 0) > 0, pick = p.h.inboundLocationType === 'PICKUP' || /픽업/.test(p.h.inboundLocationTypeName || ''); return { g: 'need', type: 'po', stage: part ? 'part' : 'conf', label: (part ? '부분입고(잔량)' : '발주확정(입고예정)') + (pick ? ' · 픽업지' : ''), eta: p.h.desiredInboundDate, ref: p.h.purchaseOrderNumber, pick: pick }; }
    if (t) { var mv = !!t.h.departedAt, pt = /PARTIAL/.test(t.h.trunkStatus || ''); return { g: 'need', type: 'trunk', stage: pt ? 'part' : mv ? 'move' : 'conf', label: t.h.trunkStatusDescription || t.h.trunkStatus, eta: t.h.expectedArrivalDate, ref: t.h.shipmentId, center: t.h.destinationCenterName }; }
    if (os === 'PENDING_RECEIPT') return { g: 'none', label: '접수대기' };
    if (/HOLD/.test(os)) return { g: 'none', label: '접수보류' };
    if (/SHORT|INSUFFICIENT|OUT_OF_STOCK/.test(os) || o.inventoryCheckStatus === 'INSUFFICIENT') return { g: 'none', label: '재고부족' };
    /* 발주요청(PURCHASE_ORDER_REQUESTED)은 발주 계획 단계. v2.3까지는 '발주확정인데 입고 건 없음' 불일치로 잘못 잡혔다 */
    if (os === 'PURCHASE_ORDER_REQUESTED' || /PENDING_PURCHASE/.test(os)) return { g: 'need', type: 'po', stage: 'plan', label: '발주요청(미확정)' };
    if (os === 'DIRECT_RECEIPT') return { g: 'mis', label: '직송대기인데 진행 중인 직송입고 건 없음' };
    if (os === 'RECEIPT_FINALIZED') return { g: 'mis', label: '접수확정(직송확정)인데 진행 중인 직송입고 건 없음' };
    if (/PURCHASE_ORDER/.test(os)) return { g: 'mis', label: '발주확정인데 진행 중인 발주입고 건 없음' };
    if (o.purchaseOrderYn === 'Y' || o.inboundStatus === 'PENDING') return { g: 'mis', label: '발주 · 입고예정 표시가 있으나 진행 중인 입고 건 없음' };
    if (/^FDC/.test(loc)) return { g: 'skip', label: 'FDC 재고 보유' };
    if (/^FC/.test(loc)) return { g: 'need', type: 'trunk', stage: 'plan', label: 'FC 보관 · 간선 미지시' };
    if (/픽업/.test(loc)) return { g: 'skip', label: '픽업 주문' };
    return { g: 'mis', label: loc ? '재고 위치 "' + loc + '" · 진행 중인 입고 건 없음' : '재고 위치 표시 없음' };
  }

  /* ---------- 화면 ---------- */
  function h(tag, props) {
    var e = document.createElement(tag), i, k;
    if (props) for (k in props) { var v = props[k]; if (v == null || v === false) continue; if (k === 'class') e.className = v; else if (k === 'style') e.style.cssText = v; else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v); else e.setAttribute(k, v === true ? '' : v); }
    for (i = 2; i < arguments.length; i++) add(e, arguments[i]);
    return e;
  }
  function add(e, c) { if (c == null || c === false) return; if (Array.isArray(c)) { c.forEach(function (x) { add(e, x); }); return; } e.appendChild(c instanceof Node ? c : document.createTextNode(String(c))); }
  var f = function (n) { return (n || 0).toLocaleString('ko-KR'); };
  function ymd(dt) { return dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2, '0') + '-' + String(dt.getDate()).padStart(2, '0'); }
  function hm(dt) { return dt ? String(dt.getHours()).padStart(2, '0') + ':' + String(dt.getMinutes()).padStart(2, '0') : ''; }
  function dayAdd(n) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + n); return d; }
  var WD = ['일', '월', '화', '수', '목', '금', '토'];
  function dlabel(n) { var d = dayAdd(n); return (d.getMonth() + 1) + '/' + d.getDate() + ' (' + WD[d.getDay()] + ')'; }
  function daysBetween(a, b) { return Math.round((Date.parse(b + 'T12:00:00') - Date.parse(a + 'T12:00:00')) / 86400000); }
  function uniq(a) { return Array.from(new Set(a)).filter(Boolean).sort(); }
  /* 택배 = 작업유형이 "택배"로 시작(택배배송 · 택배회수). 주문 현황 대시보드와 같은 기준 */
  function isTk(x) { return x.tk != null ? x.tk : /^택배/.test(x.o.serviceMethod || ''); }
  /* 품목 = orderSpecificationType. 코드로 오면 한글로 바꾸고, 비어 있으면 '품목 미지정' */
  function ptype(x) { if (x.pt) return x.pt; var v = String(x.o.orderSpecificationType || '').trim(), M = { TIRE: '타이어', ENGINE_OIL: '엔진오일', ENGINEOIL: '엔진오일', OIL: '엔진오일', BATTERY: '배터리', AIR_CONDITIONER: '에어컨', ETC: '기타', OTHER: '기타', OTHERS: '기타' }; return v ? (M[v.toUpperCase()] || v) : '품목 미지정'; }
  function orderCount(list) { return new Set(list.map(function (x) { return x.o.orderNumber; })).size; }

  var CSS = '*{box-sizing:border-box}:host{all:initial}.r{position:fixed;inset:0;z-index:2147483000;overflow:auto;background:#f5f4f9;color:#17152b;font:14px/1.5 -apple-system,"Apple SD Gothic Neo",Pretendard,"Noto Sans KR","Segoe UI",sans-serif}' +
    '.top{background:#1d1b33;color:#f3f2fa;position:sticky;top:0;z-index:5}.w{max-width:1320px;margin:0 auto;padding:0 20px}.top .w{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;padding-top:10px;padding-bottom:10px}' +
    '.ttl{font-size:17px;font-weight:700}.sub{font-size:12px;color:#b9b6d3}.sp{flex:1}.src{font-size:11.5px;padding:2px 8px;border-radius:999px;background:#2f2c52;color:#d9d6f2}.src.bad{background:#7a1f1f;color:#fff}' +
    'button{font:inherit;cursor:pointer}.btn{border:1px solid #55527a;background:transparent;color:#f3f2fa;border-radius:7px;padding:6px 12px;font-size:13px}.btn:hover{background:#2f2c52}.bm{background:#6a4df0;border-color:#6a4df0;font-weight:700;text-decoration:none;cursor:grab}.bm:hover{background:#5a3fe0}' +
    'main{display:flex;flex-direction:column;gap:14px;padding-top:16px;padding-bottom:60px}.card{background:#fff;border:1px solid #e3e1ee;border-radius:10px;padding:14px 16px;min-width:0}' +
    'h2{margin:0 0 8px;font-size:15px}.note{font-size:12px;color:#6f6c85;margin:6px 0 0}.fil{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center}.fil label{font-size:12px;color:#55526b;display:flex;gap:6px;align-items:center}' +
    'input[type=date]{font:inherit;font-size:13px;padding:4px 6px;border:1px solid #d5d2e6;border-radius:6px;background:#fff;color:#17152b}.pre{text-align:left;border:1px solid #f0d58a;background:#fff3d1;color:#5c3d00;border-radius:8px;padding:10px 14px;font-size:13px}.pre:disabled{cursor:default}.lb:disabled{opacity:.5;cursor:default}input[type=date].set{border-color:#6a4df0;background:#ece8ff;color:#3b2aa8;font-weight:600}select{font:inherit;font-size:13px;padding:5px 8px;border:1px solid #d5d2e6;border-radius:6px;background:#fff;color:#17152b;max-width:220px}.seg{display:inline-flex;border:1px solid #d5d2e6;border-radius:7px;overflow:hidden}.seg button{border:0;background:#fff;color:#55526b;padding:6px 12px;font-size:13px;border-left:1px solid #e3e1ee}.seg button:first-child{border-left:0}.seg button.on{background:#6a4df0;color:#fff;font-weight:600}' +
    '.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px}.kpi{text-align:left;background:#fff;border:1px solid #e3e1ee;border-radius:10px;padding:12px 14px;color:#17152b}.kpi:hover,.st:hover{border-color:#6a4df0}.kpi .l{font-size:12px;color:#55526b}.kpi .v{font-size:26px;font-weight:700;line-height:1.25}.kpi .v small{font-size:13px;font-weight:500;color:#6f6c85;margin-left:4px}.kpi .d{font-size:11.5px;color:#6f6c85}.kpi.red .v{color:#b42318}.kpis>.kpi{margin-top:34px}.nearwrap{display:flex;flex-direction:column;min-width:0}.neartab{box-sizing:border-box;height:34px;display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700;color:#1b4fb8;background:#d6e6ff;border:1px solid #7aa7f5;border-bottom:0;border-radius:10px 10px 0 0;padding:0 10px;white-space:nowrap}.neartab select{flex:1;min-width:0;max-width:none;font-size:12.5px;font-weight:700;padding:3px 6px;color:#1b4fb8;border-color:#7aa7f5;background:#fff}.nearwrap .kpi{flex:1;background:#eef4ff;border-color:#7aa7f5;border-radius:0 0 10px 10px}.nearwrap .kpi .l{color:#1b4fb8;font-weight:700}.nearwrap .kpi .d{color:#1b4fb8}' +
    '.g2{display:grid;grid-template-columns:minmax(0,3fr) minmax(0,2fr);gap:14px}@media(max-width:980px){.g2{grid-template-columns:minmax(0,1fr)}}' +
    '.tw{overflow-x:auto}table{border-collapse:separate;border-spacing:0 2px;width:100%;font-size:13px;font-variant-numeric:tabular-nums}th{font-size:11.5px;color:#55526b;font-weight:600;text-align:right;padding:4px 8px;white-space:nowrap}th:first-child,td:first-child{text-align:left}td{padding:0;text-align:right;white-space:nowrap}td.t{padding:6px 8px}td:first-child{font-weight:600}' +
    '.c{display:block;width:100%;border:0;background:transparent;color:inherit;text-align:right;padding:6px 8px;border-radius:4px;font-variant-numeric:tabular-nums}.c:hover{outline:2px solid #6a4df0}.c.z{color:#b7b4c9;cursor:default}.c.z:hover{outline:0}.c.red{background:#fde8e8;color:#9b1c1c;font-weight:700}.c.amb{background:#fff3d1;color:#7a5200;font-weight:700}.c.b{font-weight:700}tr.sel td{background:#ece8ff}tr.tot td{border-top:1px solid #e3e1ee}' +
    '.iss{display:flex;flex-direction:column;gap:6px}.is{display:flex;align-items:center;gap:10px;width:100%;text-align:left;border:1px solid transparent;background:#f5f4f9;border-radius:8px;padding:8px 10px;color:#17152b}.is:hover{border-color:#6a4df0}.tag{flex:0 0 auto;font-size:11.5px;font-weight:700;padding:2px 8px;border-radius:999px}.tag.u{background:#fde8e8;color:#9b1c1c}.tag.a{background:#fff3d1;color:#7a5200}.is .tx{flex:1;min-width:0}.is .tx b{display:block;font-size:13px}.is .tx span{font-size:11.5px;color:#6f6c85}.is .n{font-size:18px;font-weight:700}' +
    '.lane{border-top:1px solid #e3e1ee;padding-top:10px;margin-top:10px}.lane:first-of-type{border-top:0;margin-top:0;padding-top:0}.lh{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:baseline;margin-bottom:8px}.lh b{font-size:14px}.lh span{font-size:12px;color:#6f6c85}.chip{font-size:11.5px;font-weight:600;padding:2px 8px;border-radius:999px;background:#ece8ff;color:#3b2a9e}.chip.red{background:#fde8e8;color:#9b1c1c}.chip.ok{background:#e3f5e3;color:#0a5d0a}' +
    '.sts{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:6px}.st{text-align:left;border:1px solid #e3e1ee;border-radius:8px;padding:9px 12px;background:#fff;color:#17152b}.st .a{font-size:12px;font-weight:600;color:#55526b}.st .b{font-size:22px;font-weight:700;line-height:1.3}.st .cc{font-size:11.5px;color:#6f6c85}.st.z .b{color:#b7b4c9}.bar{height:5px;border-radius:3px;background:#ece8ff;overflow:hidden;margin:4px 0}.bar i{display:block;height:100%;background:#6a4df0}' +
    '.none{display:flex;flex-wrap:wrap;gap:10px 22px;align-items:center;background:#fdeeee;border:1px solid #f3c9c9;border-radius:8px;padding:10px 14px;margin-bottom:10px}.none .x{flex:1 1 240px}.none .x b{color:#8f1d1d}.none .x span{display:block;font-size:12px;color:#6b2a2a}.nb{border:0;background:transparent;text-align:left;color:#17152b;padding:2px 6px;border-radius:6px}.nb:hover{outline:2px solid #6a4df0}.nb span{display:block;font-size:12px;color:#6b2a2a}.nb b{font-size:20px}' +
    '.ref{display:flex;flex-wrap:wrap;gap:6px 18px;font-size:12px;color:#55526b}.dr h2{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.dr .act{background:#ece8ff;border-radius:8px;padding:8px 12px;font-size:13px;margin-bottom:8px}.lb{border:1px solid #d5d2e6;background:#fff;color:#17152b;border-radius:6px;padding:5px 10px;font-size:12.5px}.lb:hover{border-color:#6a4df0}.dr td{padding:5px 8px;text-align:left;border-bottom:1px solid #efedf6;font-weight:400}.dr th{text-align:left}.dr td.late{color:#9b1c1c;font-weight:700}.load{padding:60px 0;text-align:center;color:#55526b}.errb{background:#fde8e8;color:#9b1c1c;border-radius:8px;padding:12px 14px}' +
    /* v2.4 추가: 상단 갱신 시각, 진행 표시, 경고 띠, 하단 고정 목록 패널 */
    '.stamp{display:flex;align-items:center;gap:6px;font-size:12.5px;color:#d9d6f2;white-space:nowrap}.stamp .lut{font-size:14px;font-weight:700;color:#fff;font-variant-numeric:tabular-nums}.stamp .ago{background:#2f2c52;border-radius:999px;padding:1px 8px;font-size:11.5px}.stamp.old{background:#fff4d6;color:#8a5a00;border-radius:999px;padding:3px 10px}.stamp.old .lut{color:#5c3b00}.stamp.old .ago{background:#f5b93a;color:#3d2800;font-weight:700}.stamp.busy{color:#fff}' +
    '.btn[disabled]{opacity:.5;cursor:default}.btn.pri{background:#f3f2fa;color:#1d1b33;border-color:#f3f2fa;font-weight:700}.btn.pri:hover{background:#fff}.btn.stop{border-color:#f0a3a3;color:#ffd6d6}.pbar{height:3px;background:#2f2c52}.pbar i{display:block;height:100%;background:#9b87ff;transition:width .3s}' +
    '.warnb{background:#fff3d1;border:1px solid #f0d58a;color:#5c3d00;border-radius:8px;padding:10px 14px;font-size:13px}.warnb div+div{margin-top:4px}.snapb{background:#ece8ff;color:#3b2aa8;border-radius:8px;padding:8px 14px;font-size:13px}' +
    '.ldbox{max-width:560px;margin:50px auto;background:#fff;border:1px solid #e3e1ee;border-radius:12px;padding:22px 24px;text-align:left}.ldbox h3{margin:0 0 6px;font-size:16px}.ldbox p{margin:0 0 12px;font-size:13px;color:#55526b}.ldbox ol{margin:0 0 14px;padding-left:20px;font-size:13px}.ldbox li{margin:3px 0}.ldbox li.ok{color:#0a5d0a}.ldbox li.now{font-weight:700}.ldbox .lb{font-size:13px}' +
    '.c.on{outline:2px solid #2f6fed;outline-offset:-2px}.kpi.on,.st.on,.is.on,.nb.on{outline:2px solid #2f6fed;outline-offset:-2px}' +
    '.pane{position:fixed;left:0;right:0;bottom:0;height:46vh;z-index:2147483001;background:#fff;border-top:2px solid #6a4df0;box-shadow:0 -10px 30px rgba(20,24,50,.16);display:flex;flex-direction:column;font:14px/1.5 -apple-system,"Apple SD Gothic Neo",Pretendard,"Noto Sans KR","Segoe UI",sans-serif;color:#17152b}.pane.big{height:86vh}' +
    '.pane .ph{display:flex;flex-wrap:wrap;align-items:center;gap:6px 10px;padding:9px 20px;border-bottom:1px solid #e3e1ee}.pane .ph b{font-size:15px}.pane .act{margin:8px 20px 0;background:#ece8ff;border-radius:8px;padding:7px 12px;font-size:13px}.pane .pb{flex:1;overflow:auto;padding:0 20px 14px}' +
    '.pane table{border-spacing:0}.pane th{position:sticky;top:0;background:#fff;z-index:1;text-align:left;padding:8px 8px 6px;border-bottom:1px solid #e3e1ee;cursor:pointer;user-select:none}.pane th:hover{color:#4a31c4}.pane td{padding:5px 8px;text-align:left;border-bottom:1px solid #efedf6;font-weight:400}.pane td.late{color:#9b1c1c;font-weight:700}.pane .note{margin:8px 0 0}' +
    '.r.pon main{padding-bottom:calc(46vh + 24px)}.r.pbig main{padding-bottom:calc(86vh + 24px)}' +
    /* v2.5 별도 확인 대상 */
    '.tag.x{background:#dfe9ff;color:#1b4fb8}.card h3.chk{margin:14px 0 6px;font-size:13px;color:#1b4fb8}.is.zz{opacity:.55;cursor:default}.is.zz:hover{border-color:transparent}';

  var host = document.createElement('div'); host.id = ID;
  var root = host.attachShadow({ mode: 'open' });
  document.body.appendChild(host);

  /* 새 탭의 제목. 아이콘은 런처가 루티 아이콘을 그대로 붙인다 */
  document.title = '입고현황 대시보드';

  /* 같은 브라우저에 이 대시보드 탭이 이미 열려 있으면 이 탭은 자동으로 조회하지 않는다(서버 부담). 다른 탭이 새로 받으면 그 자료로 바로 바꾼다 */
  var bc = null, myId = Math.random().toString(36).slice(2);
  function bcPost(t) { try { if (bc) bc.postMessage({ t: t, id: myId }); } catch (e) {} }
  try {
    bc = new BroadcastChannel('supDash');
    bc.onmessage = function (e) {
      var m = e.data || {}; if (m.id === myId) return;
      if (m.t === 'hello') bcPost('here');
      else if (m.t === 'here') { if (!S.at || S.snap) S.dup = true; }
      else if (m.t === 'snap' && !S.busy) { var sn = lsJ.get(SKEY); if (sn && sn.ver === VER && sn.data && (!S.at || sn.at > S.at.getTime())) { S.data = sn.data; S.at = new Date(sn.at); S.src = sn.src || {}; S.info = (sn.info || '') + ' · 다른 탭에서 받은 자료'; S.warns = sn.warns || []; S.snap = false; render(); } }
    };
  } catch (e) { bc = null; }

  /* [닫기]: 이 대시보드 탭을 닫는다. 루티 탭은 원래 그대로 있다 */
  function off() { document.removeEventListener('keydown', onKey); document.removeEventListener('visibilitychange', tick); clearInterval(timer); stopLoad(); try { if (bc) bc.close(); } catch (e) {} }
  function close() { off(); window.__supDashOff = null; window.close(); }
  /* F5 · Ctrl+R(⌘R)은 빈 화면이 되는 대신 [새로고침]으로 처리한다. Shift를 함께 누르면 전체 다시 받기. Esc는 목록 닫기 */
  function onKey(e) {
    if (e.key === 'Escape' && S.sel) { S.sel = null; S.back = []; render(); return; }
    if (e.key === 'F5' || ((e.ctrlKey || e.metaKey) && (e.key === 'r' || e.key === 'R'))) { e.preventDefault(); if (!S.busy) load(e.shiftKey); }
  }
  document.addEventListener('keydown', onKey);
  document.addEventListener('visibilitychange', tick);
  window.addEventListener('pagehide', stopLoad);
  /* 자동 갱신: 켠 경우에만, 화면이 보일 때만, 마지막 시도 기준으로 정한 간격마다. 실패해도 20초마다 다시 부르지 않는다 */
  var timer = setInterval(function () {
    tick();
    if (!S.auto || S.busy || S.dup || S.autoHold || document.visibilityState !== 'visible') return;
    var last = Math.max(S.at ? S.at.getTime() : 0, S.tried || 0);
    if (Date.now() - last >= S.auto * 60000) load();
  }, 30000);
  window.__supDashOff = off;

  /* 상단 갱신 시각 · 진행 표시만 바꾼다(화면 전체를 다시 그리지 않음) */
  var tickT = 0;
  function tickSoon() { if (!tickT) tickT = setTimeout(function () { tickT = 0; tick(); }, 120); }
  function progText() {
    var cur = '', a = 0, n = 0;
    MENUS.forEach(function (m) { var p = S.prog[m]; n++; if (!p) return; a += p[1] ? Math.min(1, p[0] / p[1]) : 1; if (!cur && p[1] && p[0] < p[1]) cur = m + (p[1] > 1 ? ' ' + p[0] + '/' + p[1] : ''); });
    return { pct: Math.round(a / n * 100), cur: cur };
  }
  function tick() {
    var el = root.querySelector('.stamp'); if (!el) return;
    el.textContent = '';
    if (S.busy) {
      var p = progText(); el.className = 'stamp busy';
      add(el, [h('span', null, '불러오는 중' + (p.cur ? ' · ' + p.cur : '') + ' · ' + p.pct + '%'), h('button', { class: 'btn stop', onclick: stopLoad }, '중단')]);
      var bar = root.querySelector('.pbar i'); if (bar) bar.style.width = Math.max(3, p.pct) + '%';
      var lb = root.querySelector('.ldbox ol');
      if (lb) { lb.textContent = ''; MENUS.forEach(function (m) { var q = S.prog[m], done = q && (q[1] ? q[0] >= q[1] : true), now = q && !done; add(lb, h('li', { class: done ? 'ok' : now ? 'now' : '' }, m + (q && q[1] > 1 ? ' ' + q[0] + '/' + q[1] : '') + (done ? ' ✓' : now ? ' …' : ''))); }); }
      return;
    }
    if (!S.at) { el.className = 'stamp'; return; }
    var min = Math.floor((Date.now() - S.at.getTime()) / 60000);
    el.className = 'stamp' + (min >= 30 ? ' old' : '');
    el.title = S.info || '';
    add(el, [h('span', null, '최종 갱신'), h('span', { class: 'lut' }, hm(S.at)), h('span', { class: 'ago' }, min < 1 ? '방금' : min < 60 ? min + '분 전' : Math.floor(min / 60) + '시간 ' + (min % 60) + '분 전'), h('span', null, S.auto ? '자동 ' + S.auto + '분' : '자동 꺼짐')]);
  }

  function render() {
    var keep = root.querySelector('.r'), y = keep ? keep.scrollTop : 0;
    var pkeep = root.querySelector('.pane .pb'), py = pkeep ? pkeep.scrollTop : 0, pkey = root.querySelector('.pane') ? root.querySelector('.pane').getAttribute('data-k') : '';
    root.textContent = '';
    root.appendChild(h('style', null, CSS));
    var REG = {};
    function cell(key, list, opt) {
      opt = opt || {}; var n = list.length; REG[key] = { title: opt.title || key, items: list, act: opt.act || '' };
      return h('button', { class: 'c' + (n ? '' : ' z') + (n && opt.cls ? ' ' + opt.cls : '') + (S.sel === key ? ' on' : ''), disabled: !n, onclick: function () { pick(key); } }, n ? f(n) : '·');
    }
    function pick(key) { if (S.sel && S.sel !== key) S.back.push(S.sel); S.sel = key; S.sort = null; render(); }
    function filt(fn) { return function () { fn(); S.sel = null; S.back = []; render(); }; }

    var top = h('div', { class: 'top' }, h('div', { class: 'w' },
      h('div', null, h('div', { class: 'ttl' }, '재고 공급 현황'), h('div', { class: 'sub' }, VER + (window.__SD_CACHED ? ' · 저장본(서버 연결 안 됨)' : '') + ' · FDC 입고 전 미종결 주문 · 단위: 운송장(건) · 컴퓨존 제외')),
      h('div', { class: 'sp' }),
      MENUS.map(function (m) { var v = S.src[m], bad = v && v !== true && v !== 'stale' && v !== 'part'; return h('span', { class: 'src' + (bad ? ' bad' : ''), title: bad ? v : v === 'stale' ? '이번 조회 실패, 직전 값 사용' : v === 'part' ? '입고 상세 일부 실패' : '' }, m + (v === true ? ' 조회됨' : v === 'stale' ? ' 직전 값' : v === 'part' ? ' 일부 실패' : v ? ' 실패' : S.busy ? ' …' : '')); }),
      h('span', { class: 'stamp' }),
      h('a', { class: 'btn bm', href: BOOKMARK, title: '누르지 말고 북마크바로 끌어다 놓으세요. 그 북마크를 루티 탭에서 누르면 늘 최신판이 새 탭에 열립니다.', onclick: function (e) { e.preventDefault(); alert('이 버튼은 누르는 것이 아니라 북마크바로 끌어다 놓는 버튼입니다.\n북마크바가 안 보이면 Ctrl+Shift+B (맥은 ⌘+Shift+B)를 누르세요.'); } }, '재고 공급 현황'),
      h('button', { class: 'btn pri', disabled: S.busy, title: '바뀐 입고 건만 다시 받습니다 (F5도 같음)', onclick: function () { load(false); } }, '새로고침'),
      h('button', { class: 'btn', disabled: S.busy, title: '입고 상세까지 전부 다시 받습니다 (Shift+F5도 같음). 화면 수치가 루티와 다르다고 느낄 때 사용', onclick: function () { load(true); } }, '전체 다시 받기'),
      h('button', { class: 'btn', onclick: close }, '닫기')),
      h('div', { class: 'pbar', style: S.busy ? '' : 'display:none' }, h('i', { style: 'width:3%' })));
    var main = h('main', { class: 'w' });
    var R = h('div', { class: 'r' }, top, main);
    root.appendChild(R);
    if (S.err) main.appendChild(h('div', { class: 'errb' }, S.err));
    if (S.warns.length) main.appendChild(h('div', { class: 'warnb' }, S.warns.map(function (w) { return h('div', null, w); })));
    if (S.dup && !S.busy) main.appendChild(h('div', { class: 'snapb' }, '이 대시보드가 다른 탭에도 열려 있어 이 탭은 자동으로 조회하지 않았습니다. 다른 탭이 새로 받으면 이 화면도 같이 바뀝니다. 필요하면 [새로고침]을 누르세요.'));
    else if (S.snap) main.appendChild(h('div', { class: 'snapb' }, '이 PC에 저장된 ' + hm(S.at) + ' 자료를 먼저 보여 주고 있습니다' + (S.busy ? '. 최신 자료를 받는 중입니다…' : '.')));
    if (!S.data) {
      if (S.busy) main.appendChild(h('div', { class: 'ldbox' }, h('h3', null, '데이터를 불러오는 중입니다'), h('p', null, '처음에는 입고 상세를 건마다 받느라 30초~1분 걸립니다. 다음부터는 바뀐 건만 받아 몇 초면 끝납니다.'), h('ol'), h('button', { class: 'lb', onclick: stopLoad }, '불러오기 중단')));
      tick(); return;
    }

    var D = S.data, today = ymd(new Date()), nearDay = ymd(dayAdd(S.near));
    if (S.recent) { S.from = ymd(dayAdd(-10)); S.to = today; }
    var all = D.items;
    var sellers = uniq(all.map(function (x) { return x.o.supplierName; })), centers = uniq(all.map(function (x) { return x.center; }));
    /* 새로 받은 자료에 없는 판매처 · 센터가 선택돼 있으면 빈 화면이 되므로 '전체'로 되돌린다 */
    if (S.seller && sellers.indexOf(S.seller) < 0) S.seller = '';
    if (S.center && centers.indexOf(S.center) < 0) S.center = '';
    var prods = ['타이어', '엔진오일', '배터리', '기타'];
    uniq(all.map(ptype)).forEach(function (p) { if (prods.indexOf(p) < 0) prods.push(p); });
    /* 수량 단위: 타이어만 골랐을 때만 '본', 전체 품목이나 다른 품목이면 '건'(운송장 건수) */
    var U = S.product === '타이어' ? '본' : '건';
    if (S.from && S.to && S.from > S.to) { var sw = S.from; S.from = S.to; S.to = sw; }
    function base(x, skipCenter) { return (!S.seller || x.o.supplierName === S.seller) && isTk(x) === S.tk && (!S.product || ptype(x) === S.product) && (skipCenter || !S.center || x.center === S.center); }
    function inDate(x) { return !x.od || ((!S.from || x.od >= S.from) && (!S.to || x.od <= S.to)); }
    function flt(x, skipCenter) { return inDate(x) && base(x, skipCenter); }
    var before = S.from ? all.filter(function (x) { return (x.g === 'none' || x.g === 'need') && x.od && x.od < S.from && base(x); }) : [];
    var itemsAllCenters = all.filter(function (x) { return flt(x, true); });
    var items = itemsAllCenters.filter(function (x) { return !S.center || x.center === S.center; });
    var none = items.filter(function (x) { return x.g === 'none'; }), need = items.filter(function (x) { return x.g === 'need'; });
    var open = none.concat(need), mis = items.filter(function (x) { return x.g === 'mis'; }), unk = items.filter(function (x) { return x.g === 'unk'; }), skip = items.filter(function (x) { return x.g === 'skip'; });
    var orph = D.orphans.filter(function (x) { return isTk(x) === S.tk && (!S.seller || x.o.supplierName === S.seller) && (!S.center || x.center === S.center); });
    var col = items.filter(function (x) { return x.g === 'col'; });
    var ret = items.filter(function (x) { return x.g === 'ret'; }), retPick = ret.filter(function (x) { return x.isPick; });
    var pk = items.filter(function (x) { return x.g === 'pick'; });
    var pkOf = function (st) { return pk.filter(function (x) { return x.stage === st; }); };
    var pkOpen = pk.filter(function (x) { return x.stage === 'plan' || x.stage === 'conf' || x.stage === 'move'; });
    var isLate = function (x) { return x.eta && x.eta < today; };
    var late = need.filter(isLate);
    /* 구분 · 품목별 개요용: 판매처 · 센터 · 접수일 조건만 적용한 전체. 구분(배송설치/택배)과 품목 선택은 적용하지 않는다 */
    var scope = all.filter(function (x) { return inDate(x) && (!S.seller || x.o.supplierName === S.seller) && (!S.center || x.center === S.center); });
    var MCOL = ['FDC 미입고', '공급 경로 미정', '입고예정일 경과', '약속일 임박 · 경과', '오늘 입고예정', '픽업설치 진행'];
    function mt(list) {
      var n0 = list.filter(function (x) { return x.g === 'none'; }), nd = list.filter(function (x) { return x.g === 'need'; }), op = n0.concat(nd);
      return [op, n0, nd.filter(isLate), op.filter(function (x) { return x.due && x.due <= nearDay; }), nd.filter(function (x) { return x.eta === today; }), list.filter(function (x) { return x.g === 'pick' && (x.stage === 'plan' || x.stage === 'conf' || x.stage === 'move'); })];
    }
    var setTk = function (tk) { S.tk = tk; ls.set('tk', tk ? '1' : '0'); };

    /* 필터 */
    var isAll = !S.from && !S.to;
    var sel = function (val, opts, allLabel, on) { return h('select', { onchange: function (e) { on(e.target.value); } }, h('option', { value: '' }, allLabel), opts.map(function (o) { return h('option', { value: o, selected: o === val }, o); })); };
    /* 날짜 칸: 키보드로 연도를 치는 도중(0002 · 0020 …)에는 화면을 다시 그리지 않는다 */
    var dateIn = function (val, label, on) { return h('input', { type: 'date', class: val ? 'set' : '', value: val, 'aria-label': label, onchange: function (e) { var v = e.target.value; if (v && !/^(19|20)\d\d-\d\d-\d\d$/.test(v)) return; on(v); } }); };
    main.appendChild(h('div', { class: 'card', style: 'display:flex;flex-direction:column;gap:10px' }, h('div', { class: 'fil' },
      h('label', null, '판매처', sel(S.seller, sellers, '전체', function (v) { S.seller = v; S.sel = null; S.back = []; render(); })),
      h('label', null, '센터', sel(S.center, centers, '전체', function (v) { S.center = v; S.sel = null; S.back = []; render(); })),
      /* 배송설치 / 택배: 하나를 고르면 화면의 모든 집계가 그 범위로 바뀐다. 숫자는 FDC 미입고 건수 */
      h('div', { class: 'seg' }, [[false, '배송설치'], [true, '택배']].map(function (v) { return h('button', { class: S.tk === v[0] ? 'on' : '', title: 'FDC 미입고 건수', onclick: filt(function () { setTk(v[0]); }) }, v[1] + ' ' + f(mt(scope.filter(function (x) { return isTk(x) === v[0]; }))[0].length)); })),
      h('div', { class: 'seg' }, [''].concat(prods).map(function (p) { return h('button', { class: S.product === p ? 'on' : '', onclick: filt(function () { S.product = p; }) }, p || '전체 품목'); })),
      h('div', { class: 'sp', style: 'flex:1' }),
      h('div', { class: 'seg' }, [['type', '유형별 보기'], ['center', '센터별 보기']].map(function (v) { return h('button', { class: S.view === v[0] ? 'on' : '', onclick: function () { S.view = v[0]; ls.set('view', S.view); render(); } }, v[1]); }))),
      h('div', { class: 'fil' },
      h('label', null, '접수일', dateIn(S.from, '접수일 시작', function (v) { S.from = v; S.recent = false; S.sel = null; S.back = []; render(); }), '~', dateIn(S.to, '접수일 끝', function (v) { S.to = v; S.recent = false; S.sel = null; S.back = []; render(); })),
      /* 지금 적용된 기간 조건을 색으로 표시: 버튼은 반전, 날짜 칸은 값이 있으면 보라색. '최근 10일'은 자정이 지나도 오늘 기준으로 따라간다 */
      h('div', { class: 'seg' },
        h('button', { class: S.recent ? 'on' : '', 'aria-pressed': String(S.recent), onclick: filt(function () { S.recent = true; }) }, '최근 10일'),
        h('button', { class: isAll ? 'on' : '', 'aria-pressed': String(isAll), onclick: filt(function () { S.recent = false; S.from = ''; S.to = ''; }) }, '전체 기간')),
      h('div', { class: 'sp', style: 'flex:1' }),
      h('label', { title: '서버 부담을 줄이기 위해 기본은 끄기입니다. 켜면 이 탭이 화면에 보일 때만 정한 간격으로 받습니다.' }, '자동 갱신', h('select', { onchange: function (e) { S.auto = +e.target.value; ls.set('auto2', S.auto); S.autoHold = false; tick(); } }, AUTO_OPTS.map(function (o) { return h('option', { value: o[0], selected: o[0] === S.auto }, o[1]); }))))));

    if (S.from || S.to) {
      REG.k_before = { title: '조회 기간 이전 접수분 · 아직 미입고', items: before, act: '' };
      main.appendChild(h('button', { class: 'pre', disabled: !before.length, onclick: function () { pick('k_before'); } },
        '접수일 ' + (S.from || '처음') + ' ~ ' + (S.to || '오늘') + ' 접수분만 집계 중입니다. ' + (S.from ? '그 이전 접수분 중 아직 FDC에 들어오지 않은 것은 ' + f(before.length) + U + '이며 아래 수치에는 들어 있지 않습니다.' + (before.length ? ' 눌러서 목록 보기' : '') : '')));
    }
    /* KPI */
    var dueSoon = open.filter(function (x) { return x.due && x.due <= nearDay; });
    var etaToday = need.filter(function (x) { return x.eta === today; });
    function kpi(key, l, list, d, red, act) { REG[key] = { title: l, items: list, act: act || '' }; return h('button', { class: 'kpi' + (red && list.length ? ' red' : '') + (S.sel === key ? ' on' : ''), onclick: function () { pick(key); } }, h('div', { class: 'l' }, l), h('div', { class: 'v' }, f(list.length), h('small', null, U + ' · 주문 ' + f(orderCount(list)) + '건')), h('div', { class: 'd' }, d)); }
    main.appendChild(h('div', { class: 'kpis' },
      kpi('k_open', 'FDC 미입고 (공급 필요)', open, '경로 미정 + 직송 · 발주 · 간선 진행 중'),
      kpi('k_none', '공급 경로 미정', none, '운송장 없음 · 기사배정 불가', true, ACT.none),
      kpi('k_late', '입고예정일 경과', late, '입고예정일 < 오늘인데 미입고', true),
      /* 임박 기준은 이 칸의 숫자만 바꾸므로 칸 바로 위에 붙이고 둘을 같은 색으로 묶는다 */
      h('div', { class: 'nearwrap' },
        h('label', { class: 'neartab' }, '임박 기준', h('select', { onchange: function (e) { S.near = +e.target.value; ls.set('near', S.near); render(); } }, [1, 2, 3, 5].map(function (n) { return h('option', { value: n, selected: n === S.near }, '약속일 D-' + n + ' 이내'); }))),
        kpi('k_due', '약속일 임박 · 경과', dueSoon, '약속일 ≤ ' + dlabel(S.near) + ' 인데 미입고', true)),
      kpi('k_today', '오늘 입고예정', etaToday, '입고예정일 = 오늘, 아직 미입고'),
      kpi('k_pick', '픽업설치 진행', pkOpen, '센터를 거치지 않음 · 위 수치와 별도')));

    /* 약속일 표 + 손봐야 할 것: 조치할 목록이라 요약 바로 아래에 둔다(v2.4) */
    var buckets = [{ k: 'past', n: '약속일 경과', t: function (d) { return d && d < today; } }];
    for (var i = 0; i <= 6; i++) (function (i) { var ds = ymd(dayAdd(i)); buckets.push({ k: 'd' + i, n: dlabel(i) + (i === 0 ? ' 오늘' : ''), near: i <= S.near, t: function (d) { return d === ds; } }); })(i);
    var d6 = ymd(dayAdd(6));
    buckets.push({ k: 'later', n: '그 이후', t: function (d) { return d && d > d6; } }, { k: 'nodate', n: '약속일 없음', t: function (d) { return !d; } });
    var cols = [['none', '경로 미정', function (x) { return x.g === 'none'; }], ['plan', '계획', function (x) { return x.stage === 'plan'; }], ['conf', '확정', function (x) { return x.stage === 'conf'; }], ['move', '이동중', function (x) { return x.stage === 'move'; }], ['part', '잔량', function (x) { return x.stage === 'part'; }]];
    var pt = h('table', null, h('thead', null, h('tr', null, h('th', null, '약속일'), cols.map(function (c) { return h('th', null, c[1]); }), h('th', null, '합계'))));
    var ptb = h('tbody'); pt.appendChild(ptb);
    buckets.forEach(function (b) {
      var rows = open.filter(function (x) { return b.t(x.due); });
      ptb.appendChild(h('tr', null, h('td', { class: 't' }, b.n), cols.map(function (c) {
        var list = rows.filter(c[2]); var cls = b.k === 'past' ? 'red' : b.near && (c[0] === 'none' || c[0] === 'plan') ? 'red' : b.near ? 'amb' : '';
        return h('td', null, cell('p_' + b.k + '_' + c[0], list, { title: '약속일 ' + b.n + ' · ' + c[1], cls: cls, act: c[0] === 'none' ? ACT.none : '' }));
      }), h('td', null, cell('p_' + b.k + '_all', rows, { title: '약속일 ' + b.n + ' · 미입고 전체', cls: 'b' }))));
    });
    var issues = [
      ['u', '약속일이 지났는데 FDC 미입고', '약속일 < 오늘', open.filter(function (x) { return x.due && x.due < today; }), ''],
      ['u', '입고예정일이 지났는데 미입고', '입고예정일 < 오늘 (직송 · 발주 · 간선)', late, ''],
      ['u', '약속일 임박인데 경로 미정 · 미확정', '약속일 ≤ ' + dlabel(S.near) + ', 접수대기 또는 계획 단계', open.filter(function (x) { return x.due && x.due >= today && x.due <= nearDay && (x.g === 'none' || x.stage === 'plan'); }), ''],
      ['u', '입고예정일이 약속일보다 늦음', '입고예정일 > 약속일 (같은 날 도착은 제외)', need.filter(function (x) { return x.eta && x.due && x.eta > x.due; }), '입고예정일을 당기거나 고객과 약속일을 다시 잡아야 하는 건'],
      ['u', '픽업지 입고예정일이 지났는데 미입고', '픽업설치, 입고희망일 < 오늘', pkOf('plan').filter(isLate), ACT.pick_plan, true],
      ['u', '픽업 약속일이 임박 · 경과했는데 픽업지 입고 전', '픽업설치, 약속일 ≤ ' + dlabel(S.near) + ', 픽업지 입고 대기', pkOf('plan').filter(function (x) { return x.due && x.due <= nearDay; }), ACT.pick_plan, true],
      ['a', '기사배정됐는데 FDC에 재고 없음', '기사배정 = 배정, 미입고', open.filter(function (x) { return x.o.assignedToDriver === 'ASSIGNED'; }), ''],
      ['a', '부분입고 후 잔량 미도착', '부분확정 · 부분입고 상태의 남은 수량', need.filter(function (x) { return x.stage === 'part'; }), ACT.part],
      ['a', '출고예정일이 지났는데 미출고', '직송 확정 단계, 출고예정일 < 오늘', need.filter(function (x) { return x.type === 'direct' && x.stage === 'conf' && x.dep && x.dep < today; }), ACT.direct_conf],
      ['a', '약속일이 지났는데 픽업 전', '픽업 대기 · 픽업중, 약속일 < 오늘', pkOf('conf').concat(pkOf('move')).filter(function (x) { return x.due && x.due < today; }), '기사 배정 · 일정을 확인하고 고객과 약속일을 다시 잡기', true],
      ['a', '픽업완료 후 설치 미완료', '픽업완료(기사 보유), 약속일 < 오늘', pkOf('done').filter(function (x) { return x.due && x.due < today; }), '기사가 들고 있는 제품입니다. 설치 완료 처리 또는 취소 · 재약속 여부 확인', true],
      ['a', '픽업 후 취소 · 연기로 센터 반입 중', '픽업설치, 반납 입고예정 (센터 스캔 전)', retPick, ACT.pick_ret, true],
      ['a', '반납 처리 후 센터 입고가 안 잡힘', '반납 처리일 < 오늘, 아직 입고예정 (입고확정 전)', ret.filter(function (x) { return x.rdate && x.rdate < today; }), ACT.ret_ret, true],
      ['a', '회수 후 센터 입고가 안 잡힘', '회수 처리일 < 오늘, 아직 입고예정 (입고확정 전)', col.filter(function (x) { return x.rdate && x.rdate < today; }), ACT.col_col, true],
      ['a', '주문상태와 입고 메뉴 불일치', '주문은 진행 중인데 연결된 입고 건을 찾지 못함', mis, ACT.mis],
      ['a', '조회 실패로 판정 보류', '입고 메뉴 일부를 받지 못해 불일치인지 확인할 수 없는 건', unk, ACT.unk],
      ['a', '주문 없는 입고 대기 행', '입고 메뉴에는 대기 중인데 미종결 주문에 없음(취소 주문은 아래 별도 확인)', orph, ACT.orphan]
    ];
    var isBox = h('div', { class: 'iss' });
    issues.forEach(function (it, idx) {
      if ((it[0] === 'a' || it[5]) && !it[3].length) return;
      var key = 'i_' + idx; REG[key] = { title: it[1], items: it[3], act: it[4] };
      isBox.appendChild(h('button', { class: 'is' + (S.sel === key ? ' on' : ''), onclick: function () { pick(key); } }, h('span', { class: 'tag ' + it[0] }, it[0] === 'u' ? '긴급' : '주의'), h('span', { class: 'tx' }, h('b', null, it[1]), h('span', null, it[2])), h('span', { class: 'n' }, f(it[3].length))));
    });
    /* 별도 확인 대상(사용자 결정 2026-11-27): 이중 공급 · 도착 센터 불일치 · 취소 주문 입고 진행 */
    var cxl = (D.cancels || []).filter(function (x) { return flt(x, true) && (!S.center || x.center === S.center); });
    var CHK = [
      ['이중 공급', '한 운송장에 진행 중인 입고 건이 둘 이상 (직송 · 발주 · 간선)', items.filter(function (x) { return x.dupSup; }), ACT.dup],
      ['도착 센터 불일치', '입고 건의 도착 센터가 주문 센터와 다름', items.filter(function (x) { return x.cenMis; }), ACT.cen],
      ['취소 주문인데 입고 진행 중', '취소 · 취소요청 주문에 도착 예정인 입고 건이 있음', cxl, ACT.cx]
    ];
    var chkBox = h('div', { class: 'iss' });
    CHK.forEach(function (it, idx) {
      var key = 'x_' + idx, n = it[2].length; REG[key] = { title: it[0], items: it[2], act: it[3] };
      chkBox.appendChild(h('button', { class: 'is' + (n ? '' : ' zz') + (S.sel === key ? ' on' : ''), disabled: !n, onclick: function () { pick(key); } }, h('span', { class: 'tag x' }, '확인'), h('span', { class: 'tx' }, h('b', null, it[0]), h('span', null, it[1])), h('span', { class: 'n' }, f(n))));
    });
    main.appendChild(h('div', { class: 'g2' },
      h('div', { class: 'card' }, h('h2', null, '약속일 기준 재고 확보'), h('div', { class: 'tw' }, pt), h('p', { class: 'note' }, '그 날 약속된 물량 중 아직 FDC에 들어오지 않은 수량입니다. 빨강은 약속일이 지났거나 임박했는데 계획이 없는 칸, 노랑은 임박했지만 공급이 진행 중인 칸입니다.')),
      h('div', { class: 'card' }, h('h2', null, '지금 손봐야 할 것'), isBox, h('h3', { class: 'chk' }, '별도 확인 대상'), chkBox, h('p', { class: 'note' }, '한 건이 여러 줄에 동시에 잡힐 수 있습니다. 주의 항목은 0건이면 숨깁니다. 별도 확인 대상은 늘 보이며, 이중 공급 · 도착 센터 불일치 건은 위 집계에도 그대로 들어 있고 취소된 주문은 집계에 넣지 않습니다.'))));

    /* 구분 · 품목별 개요: 위 여섯 칸을 배송설치 / 택배, 그 안에서 품목별로 나눠 보여 준다 */
    var bt = h('table', null, h('thead', null, h('tr', null, h('th', { style: 'text-align:left' }, '구분'), h('th', { style: 'text-align:left' }, '품목'), MCOL.map(function (c) { return h('th', null, c); }))));
    var bb = h('tbody'); bt.appendChild(bb);
    [false, true].forEach(function (tk) {
      var part = scope.filter(function (x) { return isTk(x) === tk; }), gname = tk ? '택배' : '배송설치';
      [['', '합계', part]].concat(prods.map(function (p) { return [p, p, part.filter(function (x) { return ptype(x) === p; })]; })).forEach(function (r, ri) {
        var m = mt(r[2]); if (ri && !m.some(function (l) { return l.length; })) return;
        bb.appendChild(h('tr', { class: (ri ? '' : 'tot') + (S.tk === tk && S.product === r[0] ? ' sel' : '') },
          h('td', { class: 't', style: 'text-align:left;font-weight:700' }, ri ? '' : gname),
          h('td', null, h('button', { class: 'c', style: 'text-align:left;color:#4a31c4;text-decoration:underline' + (ri ? '' : ';font-weight:700'), onclick: filt(function () { setTk(tk); S.product = r[0]; }) }, r[1])),
          m.map(function (l, mi) { return h('td', null, cell('b_' + (tk ? 1 : 0) + '_' + ri + '_' + mi, l, { title: gname + ' · ' + r[1] + ' · ' + MCOL[mi], cls: ri ? '' : 'b' })); })));
      });
    });
    main.appendChild(h('div', { class: 'card' }, h('h2', null, '구분 · 품목별 개요'), h('div', { class: 'tw' }, bt), h('p', { class: 'note' }, '위 여섯 칸을 배송설치 · 택배와 품목으로 나눈 것입니다. 보라색 줄이 지금 화면의 범위이고, 합계나 품목 이름을 누르면 화면 전체가 그 범위로 바뀝니다. 택배 = 작업유형이 택배로 시작하는 주문. 단위는 타이어 본, 그 밖은 건.')));

    /* 센터 표 */
    if (S.view === 'center') {
      var src2 = itemsAllCenters.filter(function (x) { return x.g === 'none' || x.g === 'need'; });
      var srcP = itemsAllCenters.filter(function (x) { return x.g === 'pick' || x.g === 'ret' || x.g === 'col'; });
      var cn = uniq(src2.concat(srcP).map(function (x) { return x.center; }));
      var ccols = [['경로 미정', function (x) { return x.g === 'none'; }, ACT.none], ['직송 계획', function (x) { return x.type === 'direct' && x.stage === 'plan'; }, ACT.direct_plan], ['직송 확정', function (x) { return x.type === 'direct' && x.stage === 'conf'; }, ACT.direct_conf], ['직송 이동중', function (x) { return x.type === 'direct' && x.stage === 'move'; }, ACT.direct_move], ['직송 잔량', function (x) { return x.type === 'direct' && x.stage === 'part'; }, ACT.part], ['발주 입고예정', function (x) { return x.type === 'po' && x.stage !== 'part'; }, ACT.po_conf], ['발주 잔량', function (x) { return x.type === 'po' && x.stage === 'part'; }, ACT.part], ['간선', function (x) { return x.type === 'trunk'; }, ''], ['지연', isLate, '']];
      var ct = h('table', null, h('thead', null, h('tr', null, h('th', null, '센터'), ccols.map(function (c) { return h('th', null, c[0]); }), h('th', null, 'FDC 합계'), h('th', null, '픽업 진행'), h('th', null, '반납 입고예정'), h('th', null, '회수 입고예정'))));
      var cb = h('tbody'); ct.appendChild(cb);
      cn.forEach(function (name) {
        var rows = src2.filter(function (x) { return x.center === name; });
        cb.appendChild(h('tr', { class: S.center === name ? 'sel' : '' }, h('td', null, h('button', { class: 'c', style: 'text-align:left;color:#4a31c4;font-weight:700;text-decoration:underline', onclick: filt(function () { S.center = S.center === name ? '' : name; }) }, name)),
          ccols.map(function (c, ci) { return h('td', null, cell('c_' + name + '_' + ci, rows.filter(c[1]), { title: name + ' · ' + c[0], cls: ci === 0 || ci === 8 ? 'red' : '', act: c[2] })); }),
          h('td', null, cell('c_' + name + '_all', rows, { title: name + ' · 미입고 전체', cls: 'b' })),
          h('td', null, cell('c_' + name + '_pk', srcP.filter(function (x) { return x.g === 'pick' && x.center === name && (x.stage === 'plan' || x.stage === 'conf' || x.stage === 'move'); }), { title: name + ' · 픽업설치 진행' })),
          h('td', null, cell('c_' + name + '_ret', srcP.filter(function (x) { return x.g === 'ret' && x.center === name; }), { title: name + ' · 반납 입고예정 (센터 스캔 전)', cls: 'amb', act: ACT.ret_ret })),
          h('td', null, cell('c_' + name + '_col', srcP.filter(function (x) { return x.g === 'col' && x.center === name; }), { title: name + ' · 회수 입고예정 (센터 스캔 전)', cls: 'amb', act: ACT.col_col }))));
      });
      main.appendChild(h('div', { class: 'card' }, h('h2', null, '센터별 공급 현황'), h('div', { class: 'tw' }, ct), h('p', { class: 'note' }, '센터 이름을 누르면 화면 전체가 그 센터 기준으로 바뀝니다. 다시 누르면 전체로 돌아갑니다. 픽업설치 · 반납 · 회수는 FDC 합계에 넣지 않았습니다.')));
    }

    /* 유형별 단계 */
    var lanes = h('div', { class: 'card' }, h('h2', null, (S.center || '전체 센터') + ' · 유형별 진행 단계'));
    var nl = ['접수대기', '재고부족', '접수보류'];
    lanes.appendChild(h('div', { class: 'none' }, h('div', { class: 'x' }, h('b', null, '공급 경로 미정 ' + f(none.length) + U), h('span', null, '운송장이 아직 없어 기사배정을 할 수 없는 주문')),
      nl.map(function (l) { var list = none.filter(function (x) { return x.label === l; }), key = 'n_' + l; REG[key] = { title: '공급 경로 미정 · ' + l, items: list, act: ACT.none }; return h('button', { class: 'nb' + (S.sel === key ? ' on' : ''), onclick: function () { pick(key); } }, h('span', null, l), h('b', null, f(list.length))); })));
    TYPES.forEach(function (t) {
      var isP = t.k === 'pick' || t.k === 'ret' || t.k === 'col', isRC = t.k === 'ret' || t.k === 'col';
      var rows = t.k === 'pick' ? pk.concat(retPick) : t.k === 'ret' ? ret : t.k === 'col' ? col : need.filter(function (x) { return x.type === t.k; });
      /* 반납 · 회수는 입고예정일이 없으므로 '처리 다음 날 이후'를 지연으로 본다 */
      var lt = isRC ? rows.filter(function (x) { return x.rdate && x.rdate < today; }) : rows.filter(isLate);
      var dueLate = isRC ? [] : rows.filter(function (x) { return !isLate(x) && x.due && x.due < today; });
      var tdy = rows.filter(function (x) { return x.eta === today; });
      var mx = Math.max.apply(null, [1].concat(t.st.map(function (sd) { return rows.filter(function (x) { return x.stage === sd[0]; }).length; })));
      REG['t_' + t.k + '_late'] = { title: t.n + (isRC ? ' · 처리 다음 날 이후 미입고' : ' · 입고예정일 경과'), items: lt, act: isRC ? ACT[t.k + '_' + t.k] : '' }; REG['t_' + t.k + '_today'] = { title: t.n + ' · 오늘 입고예정', items: tdy, act: '' };
      var lane = h('div', { class: 'lane' }, h('div', { class: 'lh' }, h('b', null, t.n), h('span', null, t.d), h('span', null, (isP ? '전체 ' : '미입고 ') + f(rows.length) + U), h('div', { class: 'sp', style: 'flex:1' }),
        h('button', { class: 'chip ok', style: 'border:0', disabled: true, title: isRC ? '처리 당일' : '입고예정일 · 약속일이 지나지 않은 건' }, '정상 ' + f(rows.length - lt.length - dueLate.length)),
        h('button', { class: 'chip' + (lt.length ? ' red' : ''), style: 'border:0', onclick: function () { pick('t_' + t.k + '_late'); } }, (isRC ? '처리 다음 날 이후 ' : '입고예정일 경과 ') + f(lt.length)),
        isRC ? null : h('button', { class: 'chip', style: 'border:0', onclick: function () { pick('t_' + t.k + '_today'); } }, '오늘 입고예정 ' + f(tdy.length))));
      var sts = h('div', { class: 'sts' });
      t.st.forEach(function (sd) {
        var st = sd[0], list = rows.filter(function (x) { return x.stage === st; }), key = 't_' + t.k + '_' + st;
        REG[key] = { title: t.n + ' · ' + sd[1] + ' (' + sd[2] + ')', items: list, act: st === 'part' ? ACT.part : ACT[t.k + '_' + st] || '' };
        sts.appendChild(h('button', { class: 'st' + (list.length ? '' : ' z') + (S.sel === key ? ' on' : ''), onclick: function () { pick(key); } }, h('div', { class: 'a' }, sd[1]), h('div', { class: 'b' }, f(list.length)), h('div', { class: 'bar' }, h('i', { style: 'width:' + Math.round(list.length / mx * 100) + '%' })), h('div', { class: 'cc' }, sd[2])));
      });
      lane.appendChild(sts); lanes.appendChild(lane);
    });
    main.appendChild(lanes);

    /* 입고예정일별 */
    var ETYPES = TYPES.filter(function (t) { return t.k !== 'ret' && t.k !== 'col'; });
    var et = h('table', null, h('thead', null, h('tr', null, h('th', null, '입고예정일'), ETYPES.map(function (t) { return h('th', null, t.n); }), h('th', null, '합계'))));
    var eb = h('tbody'); et.appendChild(eb);
    var eBuckets = [{ k: 'past', n: '예정일 경과', t: function (d) { return d && d < today; }, cls: 'red' }];
    for (var j = 0; j <= 6; j++) (function (j) { var ds = ymd(dayAdd(j)); eBuckets.push({ k: 'e' + j, n: dlabel(j) + (j === 0 ? ' 오늘' : ''), t: function (d) { return d === ds; } }); })(j);
    eBuckets.push({ k: 'later', n: '그 이후', t: function (d) { return d && d > d6; } }, { k: 'nodate', n: '예정일 없음', t: function (d) { return !d; } });
    eBuckets.forEach(function (b) {
      var rows = need.concat(pkOf('plan')).filter(function (x) { return b.t(x.eta); });
      eb.appendChild(h('tr', null, h('td', { class: 't' }, b.n), ETYPES.map(function (t) { return h('td', null, cell('e_' + b.k + '_' + t.k, rows.filter(function (x) { return x.type === t.k; }), { title: '입고예정일 ' + b.n + ' · ' + t.n, cls: b.cls })); }), h('td', null, cell('e_' + b.k + '_all', rows, { title: '입고예정일 ' + b.n, cls: b.cls || 'b' }))));
    });
    REG.r_skip = { title: '공급이 필요 없다고 본 주문', items: skip, act: '' };
    var skipBy = function (lb) { return skip.filter(function (x) { return x.label === lb; }).length; };
    main.appendChild(h('div', { class: 'g2' },
      h('div', { class: 'card' }, h('h2', null, (S.center || '전체 센터') + ' · 입고예정일별 미입고'), h('div', { class: 'tw' }, et), h('p', { class: 'note' }, '직송은 입고예정일, 발주는 입고희망일, 간선은 운송번호의 입고예정일 기준입니다. 픽업설치 열은 센터가 아니라 픽업지로 들어올 물량입니다.')),
      h('div', { class: 'card' }, h('h2', null, '집계에서 뺀 것'), h('div', { class: 'ref' },
        h('button', { class: 'lb', onclick: function () { pick('r_skip'); } }, '공급 불필요 ' + f(skip.length) + U + ' (FDC 재고 보유 ' + f(skipBy('FDC 재고 보유')) + (skipBy('기사 보유') ? ' · 기사 보유 ' + f(skipBy('기사 보유')) : '') + ')'),
        h('span', null, '벌크 직송 대기 ' + f(D.bulk) + '개 (주문과 무관한 재고 보충)')),
        h('p', { class: 'note' }, '회수 주문(교체회수 등)은 공급 대상이 아니라 FDC 미입고에 넣지 않고, 기사가 회수한 뒤 센터 입고 전인 건만 회수입고 줄에 보입니다. 취소 주문은 반납중 · 회수중인 건만 봅니다. FDC 재고 보유는 주문의 재고위치가 FDC로 표시된 건입니다. 재배차 대기(이미 출고돼 기사가 들고 있는 건)는 FDC 입고 뒤 단계라 조회하지 않습니다. 픽업설치는 센터를 거치지 않아 FDC 미입고에 넣지 않고 유형별 진행 단계의 픽업설치 줄에서 따로 봅니다.'))));

    /* 목록: 화면 아래에 고정된 패널(주문 현황 대시보드 v40과 같은 방식). 본문은 그대로 두고 스크롤도 옮기지 않는다 */
    var cur = S.sel && REG[S.sel];
    if (S.sel && !cur) { S.sel = null; S.back = []; }
    R.className = 'r' + (cur ? (S.big ? ' pbig' : ' pon') : '');
    if (cur) root.appendChild(pane(cur, today, U));
    R.scrollTop = y;
    if (cur) { var pb = root.querySelector('.pane .pb'); if (pb && pkey === S.sel) pb.scrollTop = py; }
    tick();
  }

  /* 목록 패널: 열 머리를 누르면 정렬, 값이 하나도 없는 열은 숨김 */
  var LCOLS = [
    ['주문번호', function (x) { return x.o.orderNumber || ''; }], ['운송장번호', function (x) { return x.wb || ''; }], ['접수일', function (x) { return x.od || ''; }],
    ['판매처', function (x) { return x.o.supplierName || ''; }], ['센터', function (x) { return x.center || ''; }], ['작업유형', function (x) { return x.o.serviceMethod || ''; }],
    ['제품명', function (x) { return x.o.productName || ''; }], ['약속일', function (x) { return x.due || ''; }, 1], ['입고예정일', function (x) { return x.eta || ''; }, 1],
    ['출고예정일', function (x) { return x.dep || ''; }, 1], ['반납 · 회수 처리일', function (x) { return x.rdate || ''; }],
    ['공급 상태', function (x) { return (x.type ? (TYPES.filter(function (t) { return t.k === x.type; })[0] || { n: '' }).n + ' · ' : '') + (x.label || ''); }],
    ['운송번호 · 발주번호', function (x) { return x.ref || ''; }], ['기사배정', function (x) { return x.o.assignedToDriver === 'ASSIGNED' ? '배정' : x.o.assignedToDriver ? '미배정' : ''; }],
    ['약속일까지', function (x) { if (!x.due) return ''; var n = daysBetween(ymd(new Date()), x.due); return n === 0 ? 'D-day' : n > 0 ? 'D-' + n : 'D+' + (-n) + ' 경과'; }],
    ['다음 조치', function (x) { return rowAct(x); }]
  ];
  var DCOL = 14, ACOL = 15;
  function rowAct(x) { if (x.g === 'none') return ACT.none; if (x.g === 'need') return x.stage === 'part' ? ACT.part : ACT[x.type + '_' + x.stage] || ''; if (x.g === 'pick') return ACT['pick_' + x.stage] || ''; if (x.g === 'ret') return ACT.ret_ret; if (x.g === 'col') return ACT.col_col; if (x.g === 'cx') return ACT.cx; return ACT[x.g] || ''; }
  function pane(cur, today, U) {
    var list = cur.items.slice();
    if (S.sort) { var gi = S.sort.i === DCOL ? function (x) { return x.due || ''; } : LCOLS[S.sort.i][1], dir = S.sort.d; list.sort(function (a, b) { var va = gi(a), vb = gi(b); if (!va && vb) return 1; if (va && !vb) return -1; return dir * String(va).localeCompare(String(vb), 'ko'); }); }
    else list.sort(function (a, b) { return (a.due || '9999').localeCompare(b.due || '9999') || (a.eta || '9999').localeCompare(b.eta || '9999') || String(a.o.orderNumber).localeCompare(String(b.o.orderNumber)); });
    var acts = uniq(list.map(rowAct));
    var show = LCOLS.map(function (c, i) { if (i === ACOL) return acts.length > 1 || (acts.length === 1 && acts[0] !== cur.act); return i === 0 || i === 11 || list.some(function (x) { return c[1](x); }); });
    var MAX = 500, tb = h('tbody');
    list.slice(0, MAX).forEach(function (x) { tb.appendChild(h('tr', null, LCOLS.map(function (c, i) { if (!show[i]) return null; var v = c[1](x); return h('td', { class: (c[2] && v && v < today) || (i === DCOL && /경과/.test(v)) ? 'late' : '', style: i === ACOL ? 'white-space:normal;min-width:260px' : null }, v || '-'); }))); });
    var csv = function () {
      var q = function (v) { v = String(v); if (/^[=+\-@]/.test(v)) v = "'" + v; return '"' + v.replace(/"/g, '""') + '"'; };
      var txt = '﻿' + [LCOLS.map(function (c) { return c[0]; })].concat(list.map(function (x) { return LCOLS.map(function (c) { return c[1](x); }); })).map(function (r) { return r.map(q).join(','); }).join('\r\n');
      var u = URL.createObjectURL(new Blob([txt], { type: 'text/csv' })), a = h('a', { href: u, download: '재고공급_' + cur.title.replace(/[^\w가-힣]+/g, '_') + '_' + today + '_' + hm(S.at).replace(':', '') + '기준.csv' });
      root.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(u); }, 5000);
    };
    var copy = function (what) {
      return function (e) {
        var b = e.target, t = uniq(list.map(function (x) { return what === 'wb' ? x.wb : x.o.orderNumber; })).join('\n');
        var done = function (ok) { var o = b.textContent; b.textContent = ok ? '복사됨' : '복사 실패'; setTimeout(function () { b.textContent = o; }, 1500); };
        var fb = function () { var ta = document.createElement('textarea'); ta.value = t; ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); var ok = false; try { ok = document.execCommand('copy'); } catch (x) {} ta.remove(); done(ok); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { done(true); }, fb); else fb();
      };
    };
    var hasWb = list.some(function (x) { return x.wb; });
    var p = h('div', { class: 'pane' + (S.big ? ' big' : ''), 'data-k': S.sel },
      h('div', { class: 'ph' },
        S.back.length ? h('button', { class: 'lb', title: '이전 목록', onclick: function () { S.sel = S.back.pop(); S.sort = null; render(); } }, '← 뒤로') : null,
        h('b', null, cur.title), h('span', { class: 'chip' }, f(list.length) + U + ' · 주문 ' + f(orderCount(list)) + '건'),
        S.at ? h('span', { class: 'note', style: 'margin:0' }, hm(S.at) + ' 기준') : null,
        h('div', { class: 'sp', style: 'flex:1' }),
        h('button', { class: 'lb', onclick: copy('on') }, '주문번호 복사'), hasWb ? h('button', { class: 'lb', onclick: copy('wb') }, '운송장번호 복사') : null,
        h('button', { class: 'lb', onclick: csv }, '엑셀용 CSV 저장'),
        h('button', { class: 'lb', onclick: function () { S.big = !S.big; render(); } }, S.big ? '⤡ 작게' : '⤢ 크게'),
        h('button', { class: 'lb', title: 'Esc', onclick: function () { S.sel = null; S.back = []; render(); } }, '✕ 닫기')),
      cur.act ? h('div', { class: 'act' }, '다음 조치: ' + cur.act) : null,
      h('div', { class: 'pb' }, h('table', null, h('thead', null, h('tr', null, LCOLS.map(function (c, i) {
        if (!show[i]) return null; var on = S.sort && S.sort.i === i;
        return h('th', { title: '눌러서 정렬', onclick: function () { S.sort = { i: i, d: on && S.sort.d === 1 ? -1 : 1 }; render(); } }, c[0] + (on ? (S.sort.d === 1 ? ' ▲' : ' ▼') : ''));
      }))), tb), list.length > MAX ? h('p', { class: 'note' }, '화면에는 ' + MAX + '줄까지만 보입니다. 전체는 CSV로 저장해 확인하세요.') : null));
    return p;
  }

  /* 시작: 이 PC에 저장된 마지막 화면이 있으면 바로 보여 주고, 바뀐 것만 받아 새로 그린다 */
  var sn = lsJ.get(SKEY);
  if (sn && sn.ver === VER && sn.data && Date.now() - sn.at < 12 * 3600000) { S.data = sn.data; S.at = new Date(sn.at); S.src = sn.src || {}; S.info = sn.info || ''; S.warns = sn.warns || []; S.snap = true; }
  render();
  bcPost('hello');
  setTimeout(function () { if (S.dup && S.data) { render(); return; } S.dup = false; load(false); }, bc ? 400 : 0);
}

/* ---------- 런처: 루티 탭에서 실행되어 새 탭을 열고 대시보드를 심는다 ---------- */
  if (!/(^|\.)flowfix\.co\.kr$/.test(location.hostname)) { alert('루티 관리자 화면(admin.flowfix.co.kr)에 로그인한 탭에서 눌러 주세요.'); return; }
  /* __SDC: 로더가 서버에서 못 받고 이 PC 저장본으로 실행했을 때 1. __SD_W: 로더가 미리 열어 둔 새 탭. __SD_SAME_TAB: 시험용(같은 탭에 그림) */
  var cached = window.__SDC === 1; window.__SDC = 0;
  var w = window.__SD_SAME_TAB ? window : (window.__SD_W && !window.__SD_W.closed ? window.__SD_W : window.open('', 'supDash'));
  window.__SD_W = null;
  if (!w) { alert('팝업이 차단되었습니다. 주소창 오른쪽의 팝업 차단 아이콘에서 이 사이트를 허용한 뒤 다시 눌러 주세요.'); return; }
  var ic = (document.querySelector('link[rel~="icon"]') || {}).href || (location.origin + '/favicon.ico');
  /* 그 탭이 다른 사이트로 옮겨 가 있으면 쓸 수 없으므로 새 탭을 연다 */
  try { w.document.open(); } catch (e) { w = window.open('', 'supDash' + Date.now()); if (!w) return; w.document.open(); }
  w.document.write('<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>입고현황 대시보드</title><link rel="icon" href="' + String(ic).replace(/["<>]/g, '') + '"></head><body style="margin:0"><script>window.__SD_CACHED=' + (cached ? 1 : 0) + ';(' + supDash.toString() + ')();<\/script></body></html>');
  w.document.close();
  try { w.focus(); } catch (e) {}
})();
