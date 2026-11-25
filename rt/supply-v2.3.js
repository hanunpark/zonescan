/* 루티 재고 공급 현황 대시보드 v2.3 · 2026-11-25 — 루티 관리자 화면에서 로더 북마크로 불러 씀 */
/* 루티 재고 공급 현황 대시보드 v2.3 (2026-11-25)
   admin.flowfix.co.kr 에 로그인한 탭에서 로더 북마크를 누르면 새 탭에 열린다(루티 화면은 그대로 둔다). 조회(GET)만 하며 데이터를 바꾸지 않는다.
   주문 조회 + 직송입고 + 발주입고 + 간선입고 + 반납/회수 메뉴를 각각 조회해 운송장 단위로 묶는다.
   서버 배포: build.js가 zonescan 저장소 rt/supply.js(최신)와 rt/supply-버전.js(고정)를 쓴다. 로더가 누를 때마다 rt/supply.js를 받아 실행한다. */
(function () {
/* 대시보드 본체. 아래 런처가 새 탭(about:blank, 루티와 같은 출처)에 이 함수의 소스를 심어 그 탭 안에서 실행한다.
   그래서 루티 탭을 닫거나 다른 화면으로 옮겨도 대시보드 탭은 계속 동작한다. */
function supDash() {
  'use strict';
  /* 화면 안 보라색 버튼에 담기는 로더 북마크. build.js가 loader.js 내용으로 바꿔 넣는다 */
  var BOOKMARK = "javascript:(async%20function()%7Bif(!%2F(%5E%7C%5C.)flowfix%5C.co%5C.kr%24%2F.test(location.hostname))%7Balert('%EB%A3%A8%ED%8B%B0%20%EA%B4%80%EB%A6%AC%EC%9E%90%20%ED%99%94%EB%A9%B4(admin.flowfix.co.kr)%EC%97%90%20%EB%A1%9C%EA%B7%B8%EC%9D%B8%ED%95%9C%20%ED%83%AD%EC%97%90%EC%84%9C%20%EB%88%8C%EB%9F%AC%20%EC%A3%BC%EC%84%B8%EC%9A%94.')%3Breturn%7D%0Avar%20w%3Dwindow.open(''%2C'supDash')%3Bif(!w)%7Balert('%ED%8C%9D%EC%97%85%EC%9D%B4%20%EC%B0%A8%EB%8B%A8%EB%90%98%EC%97%88%EC%8A%B5%EB%8B%88%EB%8B%A4.%20%EC%A3%BC%EC%86%8C%EC%B0%BD%20%EC%98%A4%EB%A5%B8%EC%AA%BD%EC%9D%98%20%ED%8C%9D%EC%97%85%20%EC%B0%A8%EB%8B%A8%20%EC%95%84%EC%9D%B4%EC%BD%98%EC%97%90%EC%84%9C%20%EC%9D%B4%20%EC%82%AC%EC%9D%B4%ED%8A%B8%EB%A5%BC%20%ED%97%88%EC%9A%A9%ED%95%9C%20%EB%92%A4%20%EB%8B%A4%EC%8B%9C%20%EB%88%8C%EB%9F%AC%20%EC%A3%BC%EC%84%B8%EC%9A%94.')%3Breturn%7D%0Atry%7Bw.document.open()%3Bw.document.write('%3C!doctype%20html%3E%3Cmeta%20charset%3D%22utf-8%22%3E%3Ctitle%3E%EC%9E%85%EA%B3%A0%ED%98%84%ED%99%A9%20%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C%3C%2Ftitle%3E%3Cp%20style%3D%22font%3A15px%20-apple-system%2Csans-serif%3Bpadding%3A60px%3Btext-align%3Acenter%3Bcolor%3A%2355526b%22%3E%EC%B5%9C%EC%8B%A0%20%EC%9E%AC%EA%B3%A0%20%EA%B3%B5%EA%B8%89%20%ED%98%84%ED%99%A9%20%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C%EB%A5%BC%20%EB%B0%9B%EB%8A%94%20%EC%A4%91%EC%9E%85%EB%8B%88%EB%8B%A4%E2%80%A6%3C%2Fp%3E')%3Bw.document.close()%7Dcatch(e)%7B%7D%0Avar%20c%3Dnull%2Ck%3D'supDashLauncher'%3Btry%7Bvar%20r%3Dawait%20fetch('https%3A%2F%2Fhanunpark.github.io%2Fzonescan%2Frt%2Fsupply.js%3Ft%3D'%2BDate.now()%2C%7Bcache%3A'no-store'%7D)%3Bif(r.ok)%7Bc%3Dawait%20r.text()%3Bif(c.indexOf('%EB%A3%A8%ED%8B%B0%20%EC%9E%AC%EA%B3%A0%20%EA%B3%B5%EA%B8%89%20%ED%98%84%ED%99%A9%20%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C')%3C0)c%3Dnull%3Belse%20try%7BlocalStorage.setItem(k%2Cc)%7Dcatch(e)%7B%7D%7D%7Dcatch(e)%7B%7D%0Awindow.__SDC%3D0%3Bif(!c)%7Btry%7Bc%3DlocalStorage.getItem(k)%7Dcatch(e)%7B%7Dwindow.__SDC%3D1%7D%0Aif(!c)%7Bw.close()%3Balert('%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C%EB%A5%BC%20%EB%B0%9B%EC%A7%80%20%EB%AA%BB%ED%96%88%EC%8A%B5%EB%8B%88%EB%8B%A4.%20%EC%9D%B8%ED%84%B0%EB%84%B7%20%EC%97%B0%EA%B2%B0%EC%9D%84%20%ED%99%95%EC%9D%B8%ED%95%98%EA%B3%A0%20%EC%9E%A0%EC%8B%9C%20%EB%92%A4%20%EB%8B%A4%EC%8B%9C%20%EB%88%8C%EB%9F%AC%20%EC%A3%BC%EC%84%B8%EC%9A%94.')%3Breturn%7D%0Awindow.__SD_W%3Dw%3B(new%20Function(c))()%7D)()";
  var ID = 'supDash';
  var prev = document.getElementById(ID);
  if (prev) prev.remove();
  if (window.__supDashOff) { try { window.__supDashOff(); } catch (e) {} }

  var API = 'https://api-prod.flowfix.co.kr/api/v1';
  var POST_FDC = /INBOUND_COMPLETED|DRIVER_|PICKUP_|WORK_|RETURN|COLLECT|CANCEL|DELIVERY_|GATHERING|VENDOR/;
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
    orphan: '연결된 주문이 취소 · 종결됐는지 확인 후 입고취소 또는 입고마감'
  };

  var ls = { get: function (k, d) { try { var v = localStorage.getItem('supDash_' + k); return v == null ? d : v; } catch (e) { return d; } }, set: function (k, v) { try { localStorage.setItem('supDash_' + k, v); } catch (e) {} } };
  var S = { view: ls.get('view', 'type'), seller: '', product: '', center: '', near: +ls.get('near', 2), tk: ls.get('tk', '0') === '1', sel: null, openType: '', loading: true, err: '', data: null, at: null, src: {}, from: '', to: '', auto: +ls.get('auto', 10), busy: false, info: '', stat: { hit: 0, miss: 0 } };
  /* 조회 최적화용 보관: 입고 상세(변동 없는 건은 재사용), 필터 목록(1시간) */
  var C = { d: new Map(), p: new Map(), at: 0 };

  /* ---------- 조회 ---------- */
  function token() { var m = document.cookie.split(';').map(function (s) { return s.trim(); }).filter(function (s) { return s.indexOf('flowfix-admin-access-token=') === 0; })[0]; return m ? decodeURIComponent(m.slice(m.indexOf('=') + 1)) : ''; }
  function get(path) {
    return fetch(API + path, { headers: { Authorization: 'Bearer ' + token() } }).then(function (r) {
      if (r.status === 401 || r.status === 403) throw new Error('로그인이 만료됐습니다. 루티에 다시 로그인해 주세요.');
      if (!r.ok) throw new Error('조회 실패 (' + r.status + ')');
      return r.json();
    }).then(function (j) { return j.data; });
  }
  function pages(path) {
    var sep = path.indexOf('?') < 0 ? '?' : '&';
    return get(path + sep + 'page=1').then(function (d) {
      var items = (d && d.items) || [];
      var n = Math.min((d && d.totalPages) || 1, 30), rest = [];
      for (var p = 2; p <= n; p++) rest.push(get(path + sep + 'page=' + p));
      return Promise.all(rest).then(function (ds) { ds.forEach(function (x) { items = items.concat(x.items || []); }); return items; });
    });
  }
  function pool(list, fn, size) {
    var out = [], i = 0;
    function next() { var part = list.slice(i, i + size); i += size; if (!part.length) return Promise.resolve(out); return Promise.all(part.map(fn)).then(function (r) { out = out.concat(r); return next(); }); }
    return next();
  }
  function cached(key, path) { var c = C[key]; if (c && Date.now() - c.at < 3600000) return Promise.resolve(c.v); return get(path).then(function (v) { C[key] = { v: v, at: Date.now() }; return v; }); }
  function details(store, heads, sigOf, fetchLines, size) {
    var keep = new Map();
    return pool(heads, function (h) {
      var sig = sigOf(h), c = C[store].get(h.id);
      if (c && c.sig === sig) { keep.set(h.id, c); S.stat.hit++; return Promise.resolve({ h: h, lines: c.lines }); }
      S.stat.miss++;
      return fetchLines(h).then(function (lines) { keep.set(h.id, { sig: sig, lines: lines }); return { h: h, lines: lines }; });
    }, size).then(function (r) { C[store] = keep; return r; });
  }
  function dsig(h) { return [h.inboundStatus, h.expectedQuantity, h.confirmedQuantity, h.scanQuantity, h.orderCount, h.expectedDate, h.expectedDepartureDate, h.directConfirmedAt, h.carrierUpdatedAt, h.directDepartedAt, h.confirmedAt].join('|'); }
  function psig(h) { return [h.inboundStatus, h.totalPurchaseOrderQuantity, h.totalInboundQuantity, h.totalRemainingQuantity, h.desiredInboundDate, h.inboundProcessedAt, h.relatedOrderCount, h.waybillCount, h.productCount].join('|'); }
  function slim(o) { return { orderNumber: o.orderNumber, supplierName: o.supplierName, serviceMethod: o.serviceMethod, productName: o.productName, orderSpecificationType: o.orderSpecificationType, assignedToDriver: o.assignedToDriver, pickupPlaceName: o.pickupPlaceName }; }
  function menu(name, p) { return p.then(function (v) { S.src[name] = true; return v; }, function (e) { S.src[name] = e.message || '실패'; return []; }); }

  function load(force) {
    if (S.busy) return Promise.resolve();
    S.busy = true; S.err = ''; S.src = {}; S.stat = { hit: 0, miss: 0 };
    /* 새로고침 버튼(force)이거나 30분이 지나면 입고 상세를 전부 다시 받는다. 그 사이의 자동 갱신은 바뀐 건만 받는다. */
    if (force === true || !C.at || Date.now() - C.at > 1800000) { C.d = new Map(); C.p = new Map(); C.at = Date.now(); }
    render();
    var orders = cached('fo', '/admin/orders/filter-options?').then(function (fo) {
      var st = (fo.waybillStatus || []).filter(function (s) { return !POST_FDC.test(s); });
      if (!st.length) st = ['PENDING_RECEIPT', 'RECEIPT_CONFIRMED'];
      if (st.indexOf('RETURNING') < 0) st.push('RETURNING');
      var ms = (fo.serviceMethod || []).filter(function (m) { return !/회수/.test(m); });
      var main = pages('/admin/orders?waybillStatuses=' + st.join(',') + (ms.length ? '&serviceMethods=' + encodeURIComponent(ms.join(',')) : ''));
      var pm = (fo.serviceMethod || []).filter(function (m) { return /픽업/.test(m); });
      var parts = [main, pages('/admin/orders?waybillStatuses=COLLECTING')];
      if (pm.length) parts.push(pages('/admin/orders?serviceMethods=' + encodeURIComponent(pm.join(',')) + '&waybillStatuses=' + PICK_ST.join(',')));
      return Promise.all(parts).then(function (r) { return [].concat.apply([], r); });
    });
    var direct = menu('직송입고', pages('/inbounds/direct/search?inboundStatus=' + D_OPEN.join(',')).then(function (heads) {
      return details('d', heads, dsig, function (h) { return get('/inbounds/direct/' + h.id).then(function (d) { return (d && d.details) || []; }); }, 8);
    }));
    var po = menu('발주입고', cached('pfo', '/purchase-order-inbounds/filter-options?').then(function (fo) {
      var st = (fo.inboundStatuses || ['PENDING']).filter(function (s) { return !/^(CONFIRMED|CLOSED|CANCELLED)$/.test(s); });
      if (!st.length) return [];
      return pages('/purchase-order-inbounds?inboundStatuses=' + st.join(',')).then(function (heads) {
        return details('p', heads, psig, function (h) { return get('/purchase-order-inbounds/' + h.id).then(function (d) { return (d && d.purchaseOrderDetails) || []; }); }, 8);
      });
    }));
    var trunk = menu('간선입고', pages('/admin/trunk-inbounds?').then(function (heads) {
      heads = heads.filter(function (h) { return !/^(CONFIRMED|CLOSED|CANCELLED)$/.test(h.trunkStatus); });
      return pool(heads, function (h) { return pages('/admin/trunk-inbounds/' + h.id + '/waybills?').then(function (ws) { return { h: h, lines: ws }; }); }, 4);
    }));
    var rets = menu('반납/회수', pages('/collectionReturns?inboundStatus=PENDING'));
    return Promise.all([orders, direct, po, trunk, rets]).then(function (r) {
      S.src['주문'] = true;
      S.data = build(r[0], r[1], r[2], r[3], r[4]); S.at = new Date();
      S.info = '입고 상세 ' + S.stat.miss + '건 새로 받음' + (S.stat.hit ? ' · ' + S.stat.hit + '건은 변동 없어 재사용' : '');
    }).catch(function (e) { S.err = (e.message || String(e)) + (S.data ? ' 이전에 받은 수치를 그대로 보여줍니다.' : ''); })
      .then(function () { S.busy = false; S.loading = false; render(); });
  }

  /* ---------- 결합 · 분류 ---------- */
  function d10(v) { return v ? String(v).slice(0, 10) : ''; }
  function build(orders, direct, po, trunk, rets) {
    var rMap = new Map(), usedR = new Set();
    (rets || []).forEach(function (r) { if (r.waybillNumber) rMap.set(r.waybillNumber, r); });
    var WORD = { ret: '반납', col: '회수' };
    var dMap = new Map(), pMap = new Map(), tMap = new Map(), bulk = 0;
    direct.forEach(function (x) {
      if (x.h.inboundModeCode === 'BULK') { bulk += Math.max(0, (x.h.expectedQuantity || 0) - (x.h.confirmedQuantity || 0)); return; }
      x.lines.forEach(function (l) { if (l.status !== 'CONFIRMED' && l.status !== 'CANCELLED' && l.waybillId != null) dMap.set(l.waybillId, { h: x.h, l: l }); });
    });
    po.forEach(function (x) { x.lines.forEach(function (l) { var rem = l.remainingQuantity; if ((rem == null ? l.inboundStatus !== 'CONFIRMED' : rem > 0) && l.waybillNumber) pMap.set(l.waybillNumber, { h: x.h, l: l }); }); });
    trunk.forEach(function (x) { x.lines.forEach(function (l) { if (l.waybillId != null) tMap.set(l.waybillId, { h: x.h, l: l }); }); });

    var items = [], usedD = new Set(), usedP = new Set();
    orders.forEach(function (o) {
      var returning = o.waybillStatus === 'RETURNING', collecting = o.waybillStatus === 'COLLECTING';
      if ((/^CANCELLED/.test(o.orderStatus || '') && !returning && !collecting) || (o.serviceCategory === '회수' && !collecting) || /컴퓨존/.test(o.supplierName || '')) return;
      var c = classify(o, dMap.get(o.waybillId), pMap.get(o.waybillNumber), tMap.get(o.waybillId));
      if (dMap.has(o.waybillId)) usedD.add(o.waybillId);
      if (pMap.has(o.waybillNumber)) usedP.add(o.waybillNumber);
      c.o = slim(o); c.wb = o.waybillNumber; c.od = d10(o.receiptDate) || d10(o.orderDate); /* 조회 기간 기준 = 접수일(주문 목록의 접수일 열). 비어 있으면 주문일 */ c.center = c.center || o.centerName || '(센터 미지정)'; c.due = d10(o.orderAppointedDate); c.eta = d10(c.eta);
      items.push(c);
    });
    /* 반납 · 회수: 주문의 반납중 · 회수중과 반납/회수 처리의 입고예정을 운송장번호로 맞춘다 */
    items.forEach(function (c) {
      if (c.g !== 'ret' && c.g !== 'col') return;
      var w = WORD[c.g], r = rMap.get(c.wb);
      if (S.src['반납/회수'] !== true) { c.label = w + '중 (반납/회수 처리 조회 실패로 입고예정 여부 미확인)'; return; }
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
    var orphans = [];
    dMap.forEach(function (v, k) { if (!usedD.has(k)) orphans.push({ g: 'orphan', type: 'direct', label: D_LABEL[v.h.inboundStatus] || v.h.inboundStatus, ref: v.h.transportNumber, eta: d10(v.h.expectedDate), due: '', center: v.h.arrivalCenter || '', o: { orderNumber: v.l.orderNumber, supplierName: v.h.supplierName, productName: v.l.productName, serviceMethod: '', orderSpecificationType: '' } }); });
    pMap.forEach(function (v, k) { if (!usedP.has(k)) orphans.push({ g: 'orphan', type: 'po', label: '발주 입고대기', ref: v.h.purchaseOrderNumber, eta: d10(v.h.desiredInboundDate), due: '', center: v.l.centerName || v.h.representCenterName || '', o: { orderNumber: v.l.orderNumber, supplierName: v.l.orderSupplierName || '', productName: v.l.productName, serviceMethod: '', orderSpecificationType: '' } }); });
    return { items: items, orphans: orphans, bulk: bulk };
  }
  function classify(o, d, p, t) {
    if (o.waybillStatus === 'RETURNING') return { g: 'ret', type: 'ret', stage: 'ret', isPick: /픽업/.test(o.serviceMethod || ''), label: '반납중' };
    if (o.waybillStatus === 'COLLECTING') return { g: 'col', type: 'col', stage: 'col', label: '회수중' };
    if (d) { var s = d.h.inboundStatus; return { g: 'need', type: 'direct', stage: s === 'PENDING' ? 'plan' : s === 'IN_TRANSIT' ? 'move' : s === 'PARTIALLY_CONFIRMED' ? 'part' : 'conf', label: D_LABEL[s] || s, eta: d.h.expectedDate, dep: d10(d.h.expectedDepartureDate), ref: d.h.transportNumber, center: d.h.arrivalCenter }; }
    var os = o.orderStatus || '', loc = o.inventoryLocation || '', ws = o.waybillStatus || '';
    if (/픽업/.test(o.serviceMethod || '')) {
      var pp = o.pickupPlaceName ? ' · ' + o.pickupPlaceName : '';
      if (ws === 'PICKUP_COMPLETED') return { g: 'pick', type: 'pick', stage: 'done', label: '픽업완료 · 기사 보유' };
      if (ws === 'PICKUP_IN_PROGRESS') return { g: 'pick', type: 'pick', stage: 'move', label: '픽업중' + pp };
      if (os === 'PENDING_RECEIPT') return { g: 'none', label: '접수대기' };
      if (/HOLD/.test(os)) return { g: 'none', label: '접수보류' };
      if (p) return { g: 'pick', type: 'pick', stage: 'plan', label: '픽업지 입고예정 (발주확정)' + pp, eta: p.h.desiredInboundDate, ref: p.h.purchaseOrderNumber };
      if (/PURCHASE_ORDER/.test(os)) return { g: 'mis', label: '발주확정인데 진행 중인 발주입고 건 없음' };
      return { g: 'pick', type: 'pick', stage: 'conf', label: (ws === 'PICKUP_OUTBOUND_WAITING' ? '픽업출고대기' : ws === 'INBOUND_COMPLETED' || /픽업지/.test(loc) ? '픽업지 입고완료 · 픽업 대기' : '픽업 대기 (픽업지 입고는 전산에 없음)') + pp };
    }
    if (p) { var part = (p.h.totalInboundQuantity || 0) > 0, pick = p.h.inboundLocationType === 'PICKUP' || /픽업/.test(p.h.inboundLocationTypeName || ''); return { g: 'need', type: 'po', stage: part ? 'part' : 'conf', label: (part ? '부분입고(잔량)' : '발주확정(입고예정)') + (pick ? ' · 픽업지' : ''), eta: p.h.desiredInboundDate, ref: p.h.purchaseOrderNumber, pick: pick }; }
    if (t) { var mv = !!t.h.departedAt, pt = /PARTIAL/.test(t.h.trunkStatus || ''); return { g: 'need', type: 'trunk', stage: pt ? 'part' : mv ? 'move' : 'conf', label: t.h.trunkStatusDescription || t.h.trunkStatus, eta: t.h.expectedArrivalDate, ref: t.h.shipmentId, center: t.h.destinationCenterName }; }
    if (os === 'PENDING_RECEIPT') return { g: 'none', label: '접수대기' };
    if (/HOLD/.test(os)) return { g: 'none', label: '접수보류' };
    if (/SHORT|INSUFFICIENT|OUT_OF_STOCK/.test(os) || o.inventoryCheckStatus === 'INSUFFICIENT') return { g: 'none', label: '재고부족' };
    if (/PENDING_PURCHASE/.test(os)) return { g: 'need', type: 'po', stage: 'plan', label: '발주대기(미확정)' };
    if (os === 'DIRECT_RECEIPT') return { g: 'mis', label: '직송대기인데 진행 중인 직송입고 건 없음' };
    if (os === 'RECEIPT_FINALIZED') return { g: 'mis', label: '접수확정(직송확정)인데 진행 중인 직송입고 건 없음' };
    if (/PURCHASE_ORDER/.test(os)) return { g: 'mis', label: '발주확정인데 진행 중인 발주입고 건 없음' };
    if (o.purchaseOrderYn === 'Y' || o.inboundStatus === 'PENDING') return { g: 'mis', label: '발주 · 입고예정 표시가 있으나 진행 중인 입고 건 없음' };
    if (/^FDC/.test(loc)) return { g: 'skip', label: 'FDC 재고 보유' };
    if (/^FC/.test(loc)) return { g: 'need', type: 'trunk', stage: 'plan', label: 'FC 보관 · 간선 미지시' };
    if (/픽업/.test(loc) || /픽업/.test(o.serviceMethod || '')) return { g: 'skip', label: '픽업 주문' };
    return { g: 'mis', label: '재고 위치 표시 없음' };
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
  function dayAdd(n) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + n); return d; }
  var WD = ['일', '월', '화', '수', '목', '금', '토'];
  function dlabel(n) { var d = dayAdd(n); return (d.getMonth() + 1) + '/' + d.getDate() + ' (' + WD[d.getDay()] + ')'; }
  function uniq(a) { return Array.from(new Set(a)).filter(Boolean).sort(); }
  /* 택배 = 작업유형이 "택배"로 시작(택배배송 · 택배회수). 주문 현황 대시보드와 같은 기준 */
  function isTk(x) { return /^택배/.test(x.o.serviceMethod || ''); }
  /* 품목 = orderSpecificationType. 코드로 오면 한글로 바꾸고, 비어 있으면 '품목 미지정' */
  function ptype(x) { var v = String(x.o.orderSpecificationType || '').trim(), M = { TIRE: '타이어', ENGINE_OIL: '엔진오일', ENGINEOIL: '엔진오일', OIL: '엔진오일', BATTERY: '배터리', AIR_CONDITIONER: '에어컨', ETC: '기타', OTHER: '기타', OTHERS: '기타' }; return v ? (M[v.toUpperCase()] || v) : '품목 미지정'; }
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
    '.ref{display:flex;flex-wrap:wrap;gap:6px 18px;font-size:12px;color:#55526b}.dr h2{display:flex;flex-wrap:wrap;gap:8px;align-items:center}.dr .act{background:#ece8ff;border-radius:8px;padding:8px 12px;font-size:13px;margin-bottom:8px}.lb{border:1px solid #d5d2e6;background:#fff;color:#17152b;border-radius:6px;padding:5px 10px;font-size:12.5px}.lb:hover{border-color:#6a4df0}.dr td{padding:5px 8px;text-align:left;border-bottom:1px solid #efedf6;font-weight:400}.dr th{text-align:left}.dr td.late{color:#9b1c1c;font-weight:700}.load{padding:60px 0;text-align:center;color:#55526b}.errb{background:#fde8e8;color:#9b1c1c;border-radius:8px;padding:12px 14px}';

  var host = document.createElement('div'); host.id = ID;
  var root = host.attachShadow({ mode: 'open' });
  document.body.appendChild(host);

  /* 새 탭의 제목. 아이콘은 런처가 루티 아이콘을 그대로 붙인다 */
  document.title = '입고현황 대시보드';

  /* [닫기]: 이 대시보드 탭을 닫는다. 루티 탭은 원래 그대로 있다 */
  function close() { document.removeEventListener('visibilitychange', onVis); clearInterval(timer); window.__supDashOff = null; window.close(); }
  /* 다른 탭에서 돌아오면 바로 갱신, 화면이 보일 때만 정한 간격으로 자동 갱신 */
  function onVis() { if (document.visibilityState === 'visible' && S.at && Date.now() - S.at.getTime() > 60000 && !S.busy) load(); }
  document.addEventListener('visibilitychange', onVis);
  var timer = setInterval(function () { if (S.auto && !S.busy && document.visibilityState === 'visible' && S.at && Date.now() - S.at.getTime() >= S.auto * 60000) load(); }, 20000);
  window.__supDashOff = function () { document.removeEventListener('visibilitychange', onVis); clearInterval(timer); };

  function render() {
    var keep = root.querySelector('.r'), y = keep ? keep.scrollTop : 0;
    root.textContent = '';
    root.appendChild(h('style', null, CSS));
    var REG = {};
    function cell(key, list, opt) {
      opt = opt || {}; var n = list.length; REG[key] = { title: opt.title || key, items: list, act: opt.act || '' };
      return h('button', { class: 'c' + (n ? '' : ' z') + (n && opt.cls ? ' ' + opt.cls : ''), disabled: !n, onclick: function () { pick(key); } }, n ? f(n) : '·');
    }
    function pick(key) { S.sel = key; render(); var p = root.querySelector('.dr'); if (p) p.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

    var top = h('div', { class: 'top' }, h('div', { class: 'w' },
      h('div', null, h('div', { class: 'ttl' }, '재고 공급 현황'), h('div', { class: 'sub' }, 'v2.3 (2026-11-25)' + (window.__SD_CACHED ? ' · 저장본(서버 연결 안 됨)' : '') + ' · FDC 입고 전 미종결 주문 · 단위: 운송장(건) · 컴퓨존 제외')),
      h('div', { class: 'sp' }),
      ['주문', '직송입고', '발주입고', '간선입고', '반납/회수'].map(function (m) { var v = S.src[m]; return h('span', { class: 'src' + (v && v !== true ? ' bad' : ''), title: v && v !== true ? v : '' }, m + (v === true ? ' 조회됨' : v ? ' 실패' : ' …')); }),
      h('span', { class: 'sub', title: S.info }, S.busy ? '갱신 중…' : S.at ? '갱신 ' + String(S.at.getHours()).padStart(2, '0') + ':' + String(S.at.getMinutes()).padStart(2, '0') : ''),
      h('a', { class: 'btn bm', href: BOOKMARK, title: '누르지 말고 북마크바로 끌어다 놓으세요. 그 북마크를 루티 탭에서 누르면 늘 최신판이 새 탭에 열립니다.', onclick: function (e) { e.preventDefault(); alert('이 버튼은 누르는 것이 아니라 북마크바로 끌어다 놓는 버튼입니다.\n북마크바가 안 보이면 Ctrl+Shift+B (맥은 ⌘+Shift+B)를 누르세요.'); } }, '재고 공급 현황'),
      h('button', { class: 'btn', title: '입고 상세까지 전부 다시 받습니다', onclick: function () { load(true); } }, '새로고침'), h('button', { class: 'btn', onclick: close }, '닫기')));
    var main = h('main', { class: 'w' });
    root.appendChild(h('div', { class: 'r' }, top, main));
    if (S.err) main.appendChild(h('div', { class: 'errb' }, S.err));
    if (!S.data) { main.appendChild(h('div', { class: 'load' }, S.busy ? '주문 · 직송입고 · 발주입고 · 간선입고를 조회하는 중입니다…' : '')); return; }

    var D = S.data, today = ymd(new Date()), nearDay = ymd(dayAdd(S.near));
    var all = D.items;
    var sellers = uniq(all.map(function (x) { return x.o.supplierName; })), centers = uniq(all.map(function (x) { return x.center; }));
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
    var open = none.concat(need), mis = items.filter(function (x) { return x.g === 'mis'; }), skip = items.filter(function (x) { return x.g === 'skip'; });
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
    var isAll = !S.from && !S.to, isRecent = S.from === ymd(dayAdd(-10)) && S.to === ymd(new Date());
    var sel = function (val, opts, allLabel, on) { var s = h('select', { onchange: function (e) { on(e.target.value); } }, h('option', { value: '' }, allLabel), opts.map(function (o) { return h('option', { value: o, selected: o === val }, o); })); return s; };
    main.appendChild(h('div', { class: 'card', style: 'display:flex;flex-direction:column;gap:10px' }, h('div', { class: 'fil' },
      h('label', null, '판매처', sel(S.seller, sellers, '전체', function (v) { S.seller = v; S.sel = null; render(); })),
      h('label', null, '센터', sel(S.center, centers, '전체', function (v) { S.center = v; S.sel = null; render(); })),
      /* 배송설치 / 택배: 하나를 고르면 화면의 모든 집계가 그 범위로 바뀐다. 숫자는 FDC 미입고 건수 */
      h('div', { class: 'seg' }, [[false, '배송설치'], [true, '택배']].map(function (v) { return h('button', { class: S.tk === v[0] ? 'on' : '', title: 'FDC 미입고 건수', onclick: function () { setTk(v[0]); S.sel = null; render(); } }, v[1] + ' ' + f(mt(scope.filter(function (x) { return isTk(x) === v[0]; }))[0].length)); })),
      h('div', { class: 'seg' }, [''].concat(prods).map(function (p) { return h('button', { class: S.product === p ? 'on' : '', onclick: function () { S.product = p; S.sel = null; render(); } }, p || '전체 품목'); })),
      h('div', { class: 'sp', style: 'flex:1' }),
      h('div', { class: 'seg' }, [['type', '유형별 보기'], ['center', '센터별 보기']].map(function (v) { return h('button', { class: S.view === v[0] ? 'on' : '', onclick: function () { S.view = v[0]; ls.set('view', S.view); render(); } }, v[1]); }))),
      h('div', { class: 'fil' },
      h('label', null, '접수일',
        h('input', { type: 'date', class: S.from ? 'set' : '', value: S.from, 'aria-label': '접수일 시작', onchange: function (e) { S.from = e.target.value; S.sel = null; render(); } }), '~',
        h('input', { type: 'date', class: S.to ? 'set' : '', value: S.to, 'aria-label': '접수일 끝', onchange: function (e) { S.to = e.target.value; S.sel = null; render(); } })),
      /* 지금 적용된 기간 조건을 색으로 표시: 버튼은 반전, 날짜 칸은 값이 있으면 보라색 */
      h('div', { class: 'seg' },
        h('button', { class: isRecent ? 'on' : '', 'aria-pressed': String(isRecent), onclick: function () { S.from = ymd(dayAdd(-10)); S.to = ymd(new Date()); S.sel = null; render(); } }, '최근 10일'),
        h('button', { class: isAll ? 'on' : '', 'aria-pressed': String(isAll), onclick: function () { S.from = ''; S.to = ''; S.sel = null; render(); } }, '전체 기간')),
      h('div', { class: 'sp', style: 'flex:1' }),
      h('label', null, '자동 갱신', h('select', { onchange: function (e) { S.auto = +e.target.value; ls.set('auto', S.auto); } }, [[0, '끄기'], [5, '5분'], [10, '10분'], [30, '30분']].map(function (o) { return h('option', { value: o[0], selected: o[0] === S.auto }, o[1]); }))))));

    if (S.from || S.to) {
      REG.k_before = { title: '조회 기간 이전 접수분 · 아직 미입고', items: before, act: '' };
      main.appendChild(h('button', { class: 'pre', disabled: !before.length, onclick: function () { pick('k_before'); } },
        '접수일 ' + (S.from || '처음') + ' ~ ' + (S.to || '오늘') + ' 접수분만 집계 중입니다. ' + (S.from ? '그 이전 접수분 중 아직 FDC에 들어오지 않은 것은 ' + f(before.length) + U + '이며 아래 수치에는 들어 있지 않습니다.' + (before.length ? ' 눌러서 목록 보기' : '') : '')));
    }
    /* KPI */
    var dueSoon = open.filter(function (x) { return x.due && x.due <= nearDay; });
    var etaToday = need.filter(function (x) { return x.eta === today; });
    function kpi(key, l, list, d, red, act) { REG[key] = { title: l, items: list, act: act || '' }; return h('button', { class: 'kpi' + (red && list.length ? ' red' : ''), onclick: function () { pick(key); } }, h('div', { class: 'l' }, l), h('div', { class: 'v' }, f(list.length), h('small', null, U + ' · 주문 ' + f(orderCount(list)) + '건')), h('div', { class: 'd' }, d)); }
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

    /* 구분 · 품목별 개요: 위 여섯 칸을 배송설치 / 택배, 그 안에서 품목별로 나눠 보여 준다 */
    var bt = h('table', null, h('thead', null, h('tr', null, h('th', { style: 'text-align:left' }, '구분'), h('th', { style: 'text-align:left' }, '품목'), MCOL.map(function (c) { return h('th', null, c); }))));
    var bb = h('tbody'); bt.appendChild(bb);
    [false, true].forEach(function (tk) {
      var part = scope.filter(function (x) { return isTk(x) === tk; }), gname = tk ? '택배' : '배송설치';
      [['', '합계', part]].concat(prods.map(function (p) { return [p, p, part.filter(function (x) { return ptype(x) === p; })]; })).forEach(function (r, ri) {
        var m = mt(r[2]); if (ri && !m.some(function (l) { return l.length; })) return;
        bb.appendChild(h('tr', { class: (ri ? '' : 'tot') + (S.tk === tk && S.product === r[0] ? ' sel' : '') },
          h('td', { class: 't', style: 'text-align:left;font-weight:700' }, ri ? '' : gname),
          h('td', null, h('button', { class: 'c', style: 'text-align:left;color:#4a31c4;text-decoration:underline' + (ri ? '' : ';font-weight:700'), onclick: function () { setTk(tk); S.product = r[0]; S.sel = null; render(); } }, r[1])),
          m.map(function (l, mi) { return h('td', null, cell('b_' + (tk ? 1 : 0) + '_' + ri + '_' + mi, l, { title: gname + ' · ' + r[1] + ' · ' + MCOL[mi], cls: ri ? '' : 'b' })); })));
      });
    });
    main.appendChild(h('div', { class: 'card' }, h('h2', null, '구분 · 품목별 개요'), h('div', { class: 'tw' }, bt), h('p', { class: 'note' }, '위 여섯 칸을 배송설치 · 택배와 품목으로 나눈 것입니다. 보라색 줄이 지금 화면의 범위이고, 합계나 품목 이름을 누르면 화면 전체가 그 범위로 바뀝니다. 택배 = 작업유형이 택배로 시작하는 주문. 단위는 타이어 본, 그 밖은 건.')));

    /* 약속일 표 + 손봐야 할 것 */
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
      ['u', '입고예정일이 약속일보다 늦음', '입고예정일 > 약속일', need.filter(function (x) { return x.eta && x.due && x.eta > x.due; }), '입고예정일을 당기거나 고객과 약속일을 다시 잡아야 하는 건'],
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
      ['a', '주문 없는 입고 대기 행', '입고 메뉴에는 대기 중인데 미종결 주문에 없음', orph, ACT.orphan]
    ];
    var isBox = h('div', { class: 'iss' });
    issues.forEach(function (it, idx) {
      if ((it[0] === 'a' || it[5]) && !it[3].length) return;
      REG['i_' + idx] = { title: it[1], items: it[3], act: it[4] };
      isBox.appendChild(h('button', { class: 'is', onclick: function () { pick('i_' + idx); } }, h('span', { class: 'tag ' + it[0] }, it[0] === 'u' ? '긴급' : '주의'), h('span', { class: 'tx' }, h('b', null, it[1]), h('span', null, it[2])), h('span', { class: 'n' }, f(it[3].length))));
    });
    main.appendChild(h('div', { class: 'g2' },
      h('div', { class: 'card' }, h('h2', null, '약속일 기준 재고 확보'), h('div', { class: 'tw' }, pt), h('p', { class: 'note' }, '그 날 약속된 물량 중 아직 FDC에 들어오지 않은 수량입니다. 빨강은 약속일이 지났거나 임박했는데 계획이 없는 칸, 노랑은 임박했지만 공급이 진행 중인 칸입니다.')),
      h('div', { class: 'card' }, h('h2', null, '지금 손봐야 할 것'), isBox, h('p', { class: 'note' }, '한 건이 여러 줄에 동시에 잡힐 수 있습니다. 주의 항목은 0건이면 숨깁니다.'))));

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
        cb.appendChild(h('tr', { class: S.center === name ? 'sel' : '' }, h('td', null, h('button', { class: 'c', style: 'text-align:left;color:#4a31c4;font-weight:700;text-decoration:underline', onclick: function () { S.center = S.center === name ? '' : name; S.sel = null; render(); } }, name)),
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
      nl.map(function (l) { var list = none.filter(function (x) { return x.label === l; }); REG['n_' + l] = { title: '공급 경로 미정 · ' + l, items: list, act: ACT.none }; return h('button', { class: 'nb', onclick: function () { pick('n_' + l); } }, h('span', null, l), h('b', null, f(list.length))); })));
    TYPES.forEach(function (t) {
      var isP = t.k === 'pick' || t.k === 'ret' || t.k === 'col', rows = t.k === 'pick' ? pk.concat(retPick) : t.k === 'ret' ? ret : t.k === 'col' ? col : need.filter(function (x) { return x.type === t.k; }), lt = rows.filter(isLate), tdy = rows.filter(function (x) { return x.eta === today; });
      var mx = Math.max.apply(null, [1].concat(t.st.map(function (sd) { return rows.filter(function (x) { return x.stage === sd[0]; }).length; })));
      REG['t_' + t.k + '_late'] = { title: t.n + ' · 입고예정일 경과', items: lt, act: '' }; REG['t_' + t.k + '_today'] = { title: t.n + ' · 오늘 입고예정', items: tdy, act: '' };
      var lane = h('div', { class: 'lane' }, h('div', { class: 'lh' }, h('b', null, t.n), h('span', null, t.d), h('span', null, (isP ? '진행 ' : '미입고 ') + f(rows.length) + U), h('div', { class: 'sp', style: 'flex:1' }),
        h('button', { class: 'chip ok', style: 'border:0' , disabled: true }, '정상 ' + f(rows.length - lt.length)),
        h('button', { class: 'chip' + (lt.length ? ' red' : ''), style: 'border:0', onclick: function () { pick('t_' + t.k + '_late'); } }, '입고예정일 경과 ' + f(lt.length)),
        h('button', { class: 'chip', style: 'border:0', onclick: function () { pick('t_' + t.k + '_today'); } }, '오늘 입고예정 ' + f(tdy.length))));
      var sts = h('div', { class: 'sts' });
      t.st.forEach(function (sd) {
        var st = sd[0], list = rows.filter(function (x) { return x.stage === st; }), key = 't_' + t.k + '_' + st;
        REG[key] = { title: t.n + ' · ' + sd[1] + ' (' + sd[2] + ')', items: list, act: st === 'part' ? ACT.part : ACT[t.k + '_' + st] || '' };
        sts.appendChild(h('button', { class: 'st' + (list.length ? '' : ' z'), onclick: function () { pick(key); } }, h('div', { class: 'a' }, sd[1]), h('div', { class: 'b' }, f(list.length)), h('div', { class: 'bar' }, h('i', { style: 'width:' + Math.round(list.length / mx * 100) + '%' })), h('div', { class: 'cc' }, sd[2])));
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
    main.appendChild(h('div', { class: 'g2' },
      h('div', { class: 'card' }, h('h2', null, (S.center || '전체 센터') + ' · 입고예정일별 미입고'), h('div', { class: 'tw' }, et), h('p', { class: 'note' }, '직송은 입고예정일, 발주는 입고희망일, 간선은 운송번호의 입고예정일 기준입니다. 픽업설치 열은 센터가 아니라 픽업지로 들어올 물량입니다.')),
      h('div', { class: 'card' }, h('h2', null, '집계에서 뺀 것'), h('div', { class: 'ref' },
        h('button', { class: 'lb', onclick: function () { pick('r_skip'); } }, '공급 불필요 ' + f(skip.length) + U + ' (FDC 재고 보유 ' + f(skip.filter(function (x) { return x.label === 'FDC 재고 보유'; }).length) + ')'),
        h('span', null, '벌크 직송 대기 ' + f(D.bulk) + '개 (주문과 무관한 재고 보충)')),
        h('p', { class: 'note' }, '회수 주문(교체회수 등)은 공급 대상이 아니라 FDC 미입고에 넣지 않고, 기사가 회수한 뒤 센터 입고 전인 건만 회수입고 줄에 보입니다. 취소 주문은 반납중 · 회수중인 건만 봅니다. FDC 재고 보유는 주문의 재고위치가 FDC로 표시된 건입니다. 픽업설치는 센터를 거치지 않아 FDC 미입고에 넣지 않고 유형별 진행 단계의 픽업설치 줄에서 따로 봅니다.'))));

    /* 목록 */
    var cur = S.sel && REG[S.sel];
    if (cur) {
      var list = cur.items.slice().sort(function (a, b) { return (a.due || '9999').localeCompare(b.due || '9999') || (a.eta || '9999').localeCompare(b.eta || '9999') || String(a.o.orderNumber).localeCompare(String(b.o.orderNumber)); });
      var head = ['주문번호', '접수일', '판매처', '센터', '작업유형', '제품명', '약속일', '입고예정일', '공급 상태', '운송번호 · 발주번호', '기사배정'];
      var rowOf = function (x) { return [x.o.orderNumber || '', x.od || '', x.o.supplierName || '', x.center || '', x.o.serviceMethod || '', x.o.productName || '', x.due || '', x.eta || '', (x.type ? TYPES.filter(function (t) { return t.k === x.type; })[0].n + ' · ' : '') + (x.label || ''), x.ref || '', x.o.assignedToDriver === 'ASSIGNED' ? '배정' : x.o.assignedToDriver ? '미배정' : '']; };
      var tb = h('tbody');
      list.slice(0, 300).forEach(function (x) { var r = rowOf(x); tb.appendChild(h('tr', null, r.map(function (v, i) { return h('td', { class: (i === 6 && v && v < today) || (i === 7 && v && v < today) ? 'late' : '' }, v || '-'); }))); });
      var csv = function () { var q = function (v) { return '"' + String(v).replace(/"/g, '""') + '"'; }; var txt = '﻿' + [head].concat(list.map(rowOf)).map(function (r) { return r.map(q).join(','); }).join('\r\n'); var a = h('a', { href: URL.createObjectURL(new Blob([txt], { type: 'text/csv' })), download: '재고공급_' + cur.title.replace(/[^\w가-힣]+/g, '_') + '_' + today + '.csv' }); root.appendChild(a); a.click(); a.remove(); };
      var copy = function (e) { var t = uniq(list.map(function (x) { return x.o.orderNumber; })).join('\n'); (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { e.target.textContent = '복사됨'; }, function () { e.target.textContent = '복사 실패'; }); };
      main.appendChild(h('div', { class: 'card dr' },
        h('h2', null, cur.title, h('span', { class: 'chip' }, f(list.length) + U + ' · 주문 ' + f(orderCount(list)) + '건'), h('div', { class: 'sp', style: 'flex:1' }), h('button', { class: 'lb', onclick: copy }, '주문번호 복사'), h('button', { class: 'lb', onclick: csv }, '엑셀용 CSV 저장'), h('button', { class: 'lb', onclick: function () { S.sel = null; render(); } }, '목록 닫기')),
        cur.act ? h('div', { class: 'act' }, '다음 조치: ' + cur.act) : null,
        h('div', { class: 'tw' }, h('table', null, h('thead', null, h('tr', null, head.map(function (x) { return h('th', null, x); }))), tb)),
        list.length > 300 ? h('p', { class: 'note' }, '화면에는 300줄까지만 보입니다. 전체는 CSV로 저장해 확인하세요.') : null));
    }
    root.querySelector('.r').scrollTop = y;
  }

  load();
}

/* ---------- 런처: 루티 탭에서 실행되어 새 탭을 열고 대시보드를 심는다 ---------- */
  if (!/(^|\.)flowfix\.co\.kr$/.test(location.hostname)) { alert('루티 관리자 화면(admin.flowfix.co.kr)에 로그인한 탭에서 눌러 주세요.'); return; }
  /* __SDC: 로더가 서버에서 못 받고 이 PC 저장본으로 실행했을 때 1. __SD_W: 로더가 미리 열어 둔 새 탭. __SD_SAME_TAB: 시험용(같은 탭에 그림) */
  var cached = window.__SDC === 1; window.__SDC = 0;
  var w = window.__SD_SAME_TAB ? window : (window.__SD_W && !window.__SD_W.closed ? window.__SD_W : window.open('', 'supDash'));
  window.__SD_W = null;
  if (!w) { alert('팝업이 차단되었습니다. 주소창 오른쪽의 팝업 차단 아이콘에서 이 사이트를 허용한 뒤 다시 눌러 주세요.'); return; }
  var ic = (document.querySelector('link[rel~="icon"]') || {}).href || (location.origin + '/favicon.ico');
  w.document.open();
  w.document.write('<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>입고현황 대시보드</title><link rel="icon" href="' + String(ic).replace(/["<>]/g, '') + '"></head><body style="margin:0"><script>window.__SD_CACHED=' + (cached ? 1 : 0) + ';(' + supDash.toString() + ')();<\/script></body></html>');
  w.document.close();
  try { w.focus(); } catch (e) {}
})();
