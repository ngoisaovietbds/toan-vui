/* Toán Vui Cùng Bố Mẹ – lát 7 + 8: cộng trừ trực quan (đặc tả mục 9).
 * Ba cách: trục số (cánh cụt nhảy), tách để tròn chục (khung 10 ô), que tính bó chục.
 * Mở từ nút "💡 Cách làm" trong màn Cộng trừ (theo đúng phép tính đang hỏi), hoặc từ màn học riêng ở màn chính.
 * Mỗi cách là một dãy bước; mỗi bước vẽ lại toàn bộ hình (đơn giản, khó sai). Trục số thì bé chạm để nhảy. */
(function () {
  'use strict';
  var TV = window.TV, $ = TV.$, am = TV.am, ng = TV.ngauNhien;

  var TEN = { truc: '🐧 Trục số', tach: '🔟 Tách tròn chục', que: '🥢 Que tính',
    nhom: '🐟 Nhóm bằng nhau', nhay: '🐧 Đếm thêm', mang: '🔲 Hàng và cột',
    deu: '🤝 Chia đều', lui: '🐧 Nhảy lùi', bang: '📋 Từ phép nhân', bangnhan: '📋 Bảng nhân',
    gapdoi: '✌️ Gấp đôi', meo10: '🔟 Mẹo số 10', suy: '🪜 Suy từ phép dễ', luoi: '🔢 Lưới bảng nhân', giadinh: '👨‍👩‍👧 Gia đình số' };
  var NHOM_NC = { hieu: ['nhom', 'nhay', 'mang', 'deu', 'lui', 'bang'], meo: ['gapdoi', 'meo10', 'suy'], thuoc: ['bangnhan', 'luoi', 'giadinh'] };
  var TEN_NHOM = { hieu: '💡 Hiểu', meo: '⚡ Mẹo nhẩm', thuoc: '📚 Học thuộc' };
  var KHONG_BUOC = { luoi: true, giadinh: true };   // tab tự chạm, không có Bước tiếp / Làm mẫu
  var NHAY = { truc: true, nhay: true, lui: true };   // các cách bé chạm để nhảy
  var CACH_CT = ['truc', 'tach', 'que'], CACH_NC = ['nhom', 'nhay', 'mang', 'deu', 'lui', 'bang', 'bangnhan'];
  var cl = { pt: null, cach: null, ds: [], buoc: 0, nhay: 0, tuDong: null, hoc: false, nguon: null };

  // ---------- Cách nào dùng được cho phép tính nào ----------
  function lonNhat(pt) { return Math.max(pt.a, pt.b, pt.kq); }
  function dungTach(pt) {
    if (pt.b <= 0 || pt.b >= 10 || pt.a >= 100 || pt.kq >= 100) return false;
    var u = pt.a % 10;
    if (pt.dau === '+') return u + pt.b > 10;
    return pt.a >= 10 && u > 0 && u < pt.b;
  }
  function cacCach(pt) {
    if (pt.dau === '×' || pt.dau === ':') {
      var ds0 = pt.dau === '×' ? ['nhom', 'nhay', 'mang'] : ['deu', 'lui', 'bang'];
      if (dungMeo10(pt)) ds0.push('meo10');      // mẹo hiện sau các cách hiểu, chỉ khi hợp phép tính (đặc tả 11.2)
      if (dungGapDoi(pt)) ds0.push('gapdoi');
      if (dungSuy(pt)) ds0.push('suy');
      return ds0;
    }
    var ds = [];
    var tach = dungTach(pt), truc = lonNhat(pt) <= 20;
    if (tach && lonNhat(pt) <= 20) ds.push('tach');      // qua 10 trong 20: tách là cách chính
    if (truc) ds.push('truc');
    if (tach && ds.indexOf('tach') < 0) ds.push('tach');
    ds.push('que');                                      // que tính dùng được cho mọi phép
    if (lonNhat(pt) > 20) { ds.splice(ds.indexOf('que'), 1); ds.unshift('que'); } // trong 100: que tính là cách chính
    return ds;
  }

  // ---------- Vẽ: trục số ----------
  function hinhCc(mau) { return TV.hinhCanhCut(null, mau || '#ff5c8a'); }
  function veTruc() {
    var pt = cl.pt, N = lonNhat(pt) <= 10 ? 10 : 20, chieu = pt.dau === '+' ? 1 : -1;
    var x = function (i) { return 3 + i * 94 / N; };
    var dangO = pt.a + chieu * cl.nhay, xong = cl.nhay >= pt.b;
    var h = '<div class="truc' + (N > 10 ? ' truc-20' : '') + '">';
    for (var k = 1; k <= cl.nhay; k++) {
      var tu = pt.a + chieu * (k - 1), den = pt.a + chieu * k, trai = Math.min(x(tu), x(den));
      h += '<span class="cung-nhay' + (k === cl.nhay ? ' moi' : '') + '" style="left:' + trai + '%;width:' + (94 / N) + '%"><b>' + k + '</b></span>';
    }
    h += '<button class="truc-cc' + (xong ? ' xong' : '') + '" style="left:' + x(dangO) + '%" aria-label="Nhảy">' + hinhCc() + '</button>';
    h += '<div class="truc-duong"></div>';
    for (var i = 0; i <= N; i++) {
      h += '<span class="vach' + (i === pt.a ? ' dau' : '') + (xong && i === dangO ? ' dich' : '') + (i % 5 === 0 ? ' nam' : '') + '" style="left:' + x(i) + '%"><i></i><em>' + i + '</em></span>';
    }
    h += '</div>';
    var loi;
    if (cl.nhay === 0) loi = (chieu > 0 ? 'Cộng thì nhảy sang phải nhé! ' : 'Trừ thì nhảy sang trái nhé! ') +
      'Cánh cụt đứng ở số ' + pt.a + '. ' + (chieu > 0 ? 'Cộng ' : 'Bớt ') + pt.b + ' thì nhảy ' + pt.b + ' bước. Chạm "Nhảy" nào!';
    else if (!xong) loi = 'Bước ' + cl.nhay + '… cánh cụt đang ở số ' + dangO + '. Nhảy tiếp nào!';
    else loi = 'Nhảy đủ ' + pt.b + ' bước, cánh cụt dừng ở số ' + dangO + '. Vậy ' + pt.a + ' ' + pt.dau + ' ' + pt.b + ' = ' + pt.kq + '!';
    return { hinh: h, loi: loi, xong: xong };
  }

  // ---------- Vẽ: tách để tròn chục (khung 10 ô) ----------
  function khung(o) { // o: mảng 10 phần tử, mỗi phần tử '' | 'cam' | 'xanh' | 'gach' | 'gach xanh'
    var h = '<span class="khung10">';
    for (var i = 0; i < 10; i++) h += '<i class="' + (o[i] || '') + '"></i>';
    return h + '</span>';
  }
  function day(n, lop) { var o = []; for (var i = 0; i < n; i++) o.push(lop); return o; }
  function nhom(n, lop, nhan) {
    var h = '<span class="nhom-cham">' + (nhan ? '<b>' + nhan + '</b>' : '');
    for (var i = 0; i < n; i++) h += '<i class="' + lop + '"></i>';
    return h + '</span>';
  }
  function chucDay(T) { var h = ''; for (var i = 0; i < T; i++) h += khung(day(10, 'cam')); return h; }
  function buocTach() {
    var pt = cl.pt, T = Math.floor(pt.a / 10), u = pt.a % 10, ds = [];
    if (pt.dau === '+') {
      var lap = 10 - u, con = pt.b - lap, tron = (T + 1) * 10;
      ds.push({ hinh: chucDay(T) + khung(day(u, 'cam')) + '<b class="dau-to">+</b>' + nhom(pt.b, 'xanh'),
        loi: pt.a + ' + ' + pt.b + ': khung có ' + u + ' chấm, còn thiếu ' + lap + ' chấm nữa là đủ 10.' });
      ds.push({ hinh: chucDay(T) + khung(day(u, 'cam')) + '<b class="dau-to">+</b>' + nhom(lap, 'xanh', lap) + nhom(con, 'xanh', con),
        loi: 'Tách ' + pt.b + ' thành ' + lap + ' và ' + con + ' để cho đủ 10.' });
      ds.push({ hinh: chucDay(T) + khung(day(u, 'cam').concat(day(lap, 'xanh moi'))) + '<b class="dau-to">+</b>' + nhom(con, 'xanh', con),
        loi: 'Lấy ' + lap + ' lấp đầy khung: ' + pt.a + ' + ' + lap + ' = ' + tron + '.' });
      ds.push({ hinh: chucDay(T) + khung(day(u, 'cam').concat(day(lap, 'xanh'))) + '<b class="dau-to">+</b>' + nhom(con, 'xanh', con) +
        '<b class="dau-to">=</b><b class="ket-qua">' + pt.kq + '</b>',
        loi: tron + ' cộng thêm phần còn lại ' + con + ' là ' + pt.kq + '. Vậy ' + pt.a + ' + ' + pt.b + ' = ' + pt.kq + '!' });
    } else {
      var con2 = pt.b - u, tron2 = T * 10;
      var truoc = chucDay(T - 1);
      ds.push({ hinh: truoc + khung(day(10, 'cam')) + nhom(u, 'cam'),
        loi: pt.a + ' − ' + pt.b + ': ' + pt.a + ' gồm ' + tron2 + ' và ' + u + '. Cần bớt đi ' + pt.b + '.' });
      ds.push({ hinh: truoc + khung(day(10, 'cam')) + nhom(u, 'cam') + '<b class="dau-to">−</b>' + nhom(u, 'xanh', u) + nhom(con2, 'xanh', con2),
        loi: 'Tách ' + pt.b + ' thành ' + u + ' và ' + con2 + ' để bớt cho tròn chục.' });
      ds.push({ hinh: truoc + khung(day(10, 'cam')) + nhom(u, 'gach') + '<b class="dau-to">−</b>' + nhom(con2, 'xanh', con2),
        loi: 'Bớt ' + u + ' trước: ' + pt.a + ' − ' + u + ' = ' + tron2 + '.' });
      ds.push({ hinh: truoc + khung(day(10 - con2, 'cam').concat(day(con2, 'gach'))) + '<b class="dau-to">=</b><b class="ket-qua">' + pt.kq + '</b>',
        loi: 'Bớt tiếp ' + con2 + ': ' + tron2 + ' − ' + con2 + ' = ' + pt.kq + '. Vậy ' + pt.a + ' − ' + pt.b + ' = ' + pt.kq + '!' });
    }
    return ds;
  }

  // ---------- Vẽ: que tính bó chục ----------
  function bo(lop) { var h = '<span class="bo-que ' + (lop || '') + '">'; for (var i = 0; i < 10; i++) h += '<i></i>'; return h + '<b></b></span>'; }
  function que(lop) { return '<span class="que ' + (lop || '') + '"></span>'; }
  function lap(n, f, lop) { var h = ''; for (var i = 0; i < n; i++) h += f(typeof lop === 'function' ? lop(i) : lop); return h; }
  function hang(nhan, noi) { return '<div class="hang-que"><em>' + nhan + '</em><div>' + noi + '</div></div>'; }
  function moTa(t, u) { // "3 bó và 5 que", bỏ phần bằng 0
    if (t && u) return t + ' bó và ' + u + ' que';
    return t ? t + ' bó' : u + ' que';
  }
  function buocQue() {
    var pt = cl.pt, tA = Math.floor(pt.a / 10), uA = pt.a % 10, tB = Math.floor(pt.b / 10), uB = pt.b % 10, ds = [];
    if (pt.dau === '+') {
      var s = uA + uB, nho = s >= 10, tKq = Math.floor(pt.kq / 10), uKq = pt.kq % 10;
      ds.push({ hinh: hang(pt.a, lap(tA, bo) + lap(uA, que)) + hang('+ ' + pt.b, lap(tB, bo, 'xanh') + lap(uB, que, 'xanh')),
        loi: pt.a + ' có ' + moTa(tA, uA) + '. ' + pt.b + ' có ' + moTa(tB, uB) + '.' });
      // Bỏ các bước có số 0 (rà 0.7.0)
      if (uA && uB) ds.push({ hinh: hang('bó', lap(tA, bo) + lap(tB, bo, 'xanh')) + hang('que lẻ', lap(uA, que) + lap(uB, que, 'xanh moi')),
        loi: 'Gộp que lẻ với que lẻ: ' + uA + ' + ' + uB + ' = ' + s + ' que.' });
      if (nho) ds.push({ hinh: hang('bó', lap(tA, bo) + lap(tB, bo, 'xanh') + bo('moi')) + hang('que lẻ', lap(s - 10, que)),
        loi: 'Đủ 10 que lẻ thì buộc thành 1 bó (nhớ 1).' + (s - 10 ? ' Còn ' + (s - 10) + ' que lẻ.' : ' Không còn que lẻ nào.') });
      if (tA && (tB || nho)) ds.push({ hinh: hang('bó', lap(tKq, bo, 'moi')) + hang('que lẻ', lap(uKq, que)),
        loi: 'Rồi gộp bó với bó: ' + tA + (tB ? ' + ' + tB : '') + (nho ? ' + 1' : '') + ' = ' + tKq + ' bó.' });
      ds.push({ hinh: hang('bó', lap(tKq, bo)) + hang('que lẻ', lap(uKq, que)) + '<p class="ket-qua-dong">' + moTa(tKq, uKq) + ' = <b>' + pt.kq + '</b></p>',
        loi: moTa(tKq, uKq) + ' là ' + pt.kq + '. Vậy ' + pt.a + ' + ' + pt.b + ' = ' + pt.kq + '!' });
    } else {
      var muon = uA < uB, bo1 = muon ? tA - 1 : tA, le1 = muon ? uA + 10 : uA;
      ds.push({ hinh: hang(pt.a, lap(tA, bo) + lap(uA, que)),
        loi: pt.a + ' có ' + moTa(tA, uA) + '. Cần bớt ' + moTa(tB, uB) + '.' });
      if (muon) ds.push({ hinh: hang('bó', lap(bo1, bo)) + hang('que lẻ', lap(uA, que) + lap(10, que, 'moi')),
        loi: 'Que lẻ không đủ bớt ' + uB + ', tháo 1 bó ra 10 que (mượn 1 chục). Giờ có ' + le1 + ' que lẻ.' });
      if (uB) ds.push({ hinh: hang('bó', lap(bo1, bo)) + hang('que lẻ', lap(le1, que, function (i) { return i >= le1 - uB ? 'gach' : ''; })),
        loi: 'Bớt ' + uB + ' que lẻ: ' + le1 + ' − ' + uB + ' = ' + (le1 - uB) + ' que.' });
      if (tB) ds.push({ hinh: hang('bó', lap(bo1, bo, function (i) { return i >= bo1 - tB ? 'gach' : ''; })) + hang('que lẻ', lap(le1 - uB, que)),
        loi: 'Bớt ' + tB + ' bó: ' + bo1 + ' − ' + tB + ' = ' + (bo1 - tB) + ' bó.' });
      var tCon = bo1 - tB, uCon = le1 - uB;
      ds.push({ hinh: hang('bó', lap(tCon, bo)) + hang('que lẻ', lap(uCon, que)) + '<p class="ket-qua-dong">' + moTa(tCon, uCon) + ' = <b>' + pt.kq + '</b></p>',
        loi: 'Còn ' + moTa(tCon, uCon) + ' là ' + pt.kq + '. Vậy ' + pt.a + ' − ' + pt.b + ' = ' + pt.kq + '!' });
    }
    return ds;
  }


  // =====================================================================
  //  NHÂN CHIA TRỰC QUAN (đặc tả mục 10). pt nhân: a × b (a được lấy b lần); pt chia: a : b = kq.
  // =====================================================================
  function trucSo(N, moc, viTri, cungs, dau, dich) { // trục số dùng chung cho đếm thêm / nhảy lùi
    var x = function (i) { return 3 + i * 94 / N; };
    var h = '<div class="truc' + (N > 20 ? ' truc-20' : '') + '">';
    cungs.forEach(function (c, k) {
      var trai = Math.min(x(c[0]), x(c[1]));
      h += '<span class="cung-nhay' + (k === cungs.length - 1 ? ' moi' : '') + '" style="left:' + trai + '%;width:' + Math.abs(x(c[1]) - x(c[0])) + '%"><b>' + c[2] + '</b></span>';
    });
    h += '<button class="truc-cc' + (dich !== null ? ' xong' : '') + '" style="left:' + x(viTri) + '%" aria-label="Nhảy">' + hinhCc() + '</button>';
    h += '<div class="truc-duong"></div>';
    for (var i = 0; i <= N; i++) {
      var laMoc = moc.indexOf(i) >= 0;
      if (N > 20 && !laMoc) continue;                 // trục dài: chỉ vẽ các mốc
      // Nhiều mốc quá thì chỉ ghi số ở mốc chẵn, mốc đầu, mốc cuối, điểm đứng và điểm đích cho đỡ chen chữ
      var viThu = moc.indexOf(i), ghi = N <= 20 || (laMoc && (moc.length <= 11 || viThu % 2 === 0 || i === N || i === viTri || i === dich));
      h += '<span class="vach' + (i === dau ? ' dau' : '') + (i === dich ? ' dich' : '') + (laMoc ? ' nam' : ' nho') + '" style="left:' + x(i) + '%"><i></i><em>' + (ghi ? i : '') + '</em></span>';
    }
    return h + '</div>';
  }
  function chamNhom(n, lop) { var h = '<span class="nhom ' + (lop || '') + '" style="grid-template-columns:repeat(' + Math.min(n, 5) + ',16px)">'; for (var i = 0; i < n; i++) h += '<i></i>'; return h + '</span>'; }
  function chuoiCong(a, k) { var d = []; for (var i = 0; i < k; i++) d.push(a); return d.join(' + '); }

  function buocNhom() { // nhóm bằng nhau: b nhóm, mỗi nhóm a
    var pt = cl.pt, ds = [];
    for (var k = 0; k <= pt.b; k++) {
      var h = '<div class="cac-nhom">';
      for (var g = 0; g < pt.b; g++) h += chamNhom(pt.a, g < k ? 'sang' + (g === k - 1 ? ' moi' : '') : 'toi');
      h += '</div>';
      var loi;
      if (k === 0) loi = 'Có ' + pt.b + ' nhóm, mỗi nhóm ' + pt.a + ' con cá. Cộng dồn từng nhóm nhé!';
      else if (k < pt.b) loi = (k === 1 ? 'Nhóm 1: ' + pt.a + ' con.' : chuoiCong(pt.a, k) + ' = ' + pt.a * k + ' con.');
      else loi = chuoiCong(pt.a, k) + ' = ' + pt.kq + '. ' + pt.a + ' được lấy ' + pt.b + ' lần, vậy ' + pt.a + ' × ' + pt.b + ' = ' + pt.kq + '!';
      ds.push({ hinh: h + (k === pt.b ? '<p class="ket-qua-dong">' + pt.a + ' × ' + pt.b + ' = <b>' + pt.kq + '</b></p>' : ''), loi: loi });
    }
    return ds;
  }
  function buocNhay() { // đếm thêm trên trục số
    var pt = cl.pt, ds = [], moc = [];
    for (var m = 0; m <= pt.kq; m += pt.a) moc.push(m);
    for (var k = 0; k <= pt.b; k++) {
      var cungs = [];
      for (var i = 1; i <= k; i++) cungs.push([(i - 1) * pt.a, i * pt.a, '+' + pt.a]);
      var loi;
      if (k === 0) loi = 'Đếm thêm ' + pt.a + ': mỗi lần nhảy thêm ' + pt.a + ' ô, nhảy ' + pt.b + ' lần. Chạm để nhảy nào!';
      else if (k < pt.b) loi = 'Đếm: ' + moc.slice(1, k + 1).join(', ') + '…';
      else loi = 'Nhảy ' + pt.b + ' lần, mỗi lần ' + pt.a + ', cánh cụt dừng ở số ' + pt.kq + '. Vậy ' + pt.a + ' × ' + pt.b + ' = ' + pt.kq + '!';
      ds.push({ hinh: trucSo(pt.kq, moc, k * pt.a, cungs, 0, k === pt.b ? pt.kq : null), loi: loi });
    }
    return ds;
  }
  function luoi(hangN, cotN, nhanHang) {
    var h = '<div class="mang-wrap"><span class="mang" style="grid-template-columns:repeat(' + cotN + ',14px)">';
    for (var i = 0; i < hangN * cotN; i++) h += '<i></i>';
    h += '</span>';
    if (nhanHang) { h += '<span class="mang-nhan">'; for (var r = 1; r <= hangN; r++) h += '<b>' + r * cotN + '</b>'; h += '</span>'; }
    return h + '</div>';
  }
  function buocMang() { // xếp hàng và cột
    var pt = cl.pt;
    return [
      { hinh: luoi(pt.b, pt.a, false), loi: 'Xếp ' + pt.b + ' hàng, mỗi hàng ' + pt.a + ' con cá.' },
      { hinh: luoi(pt.b, pt.a, true), loi: 'Đếm theo hàng: ' + (function () { var d = []; for (var r = 1; r <= pt.b; r++) d.push(r * pt.a); return d.join(', '); })() + '. Có tất cả ' + pt.kq + ' con.' },
      { hinh: luoi(pt.a, pt.b, true) + '<p class="ket-qua-dong">' + pt.a + ' × ' + pt.b + ' = ' + pt.b + ' × ' + pt.a + ' = <b>' + pt.kq + '</b></p>',
        loi: 'Xoay lại: ' + pt.a + ' hàng, mỗi hàng ' + pt.b + ' con, xoay lại vẫn bằng nhau. Vậy ' + pt.a + ' × ' + pt.b + ' = ' + pt.kq + '!' }
    ];
  }
  function buocDeu() { // chia đều lần lượt: a con cho b bạn
    var pt = cl.pt, ds = [];
    for (var r = 0; r <= pt.kq; r++) {
      var con = pt.a - r * pt.b, dong = con > 20 ? TV.veThanhChuc(con) : chamNhom(con, 'dong khoi').replace(/repeat\(\d+,16px\)/, 'repeat(' + Math.min(con, 10) + ',14px)');
      var h = '<div class="chia-deu"><div class="dong-con">' + (con ? dong : '<em>Hết cá</em>') + '</div><div class="dong-ban">';
      for (var bn = 0; bn < pt.b; bn++) {
        h += '<span class="ban-chia">' + hinhCc(TV.MAU_KHAN[bn % TV.MAU_KHAN.length]) + '<span class="chong">';
        for (var c = 0; c < r; c++) h += '<i' + (c === r - 1 ? ' class="moi"' : '') + '></i>';
        h += '</span></span>';
      }
      h += '</div></div>';
      var loi;
      if (r === 0) loi = 'Có ' + pt.a + ' con cá, chia lần lượt mỗi bạn một con nhé!';
      else if (r < pt.kq) loi = 'Lượt ' + r + ': mỗi bạn có ' + r + ' con, còn lại ' + con + ' con.';
      else loi = 'Hết cá rồi! Mỗi bạn được ' + pt.kq + ' con. Vậy ' + pt.a + ' : ' + pt.b + ' = ' + pt.kq + '!';
      ds.push({ hinh: h, loi: loi });
    }
    return ds;
  }
  function buocLui() { // chia theo nhóm, nhảy lùi
    var pt = cl.pt, ds = [], moc = [];
    for (var m = 0; m <= pt.a; m += pt.b) moc.push(m);
    for (var k = 0; k <= pt.kq; k++) {
      var cungs = [];
      for (var i = 1; i <= k; i++) cungs.push([pt.a - (i - 1) * pt.b, pt.a - i * pt.b, '−' + pt.b]);
      var o = pt.a - k * pt.b, loi;
      if (k === 0) loi = 'Mỗi lần lấy ra ' + pt.b + ' con (như phát cho ' + pt.b + ' bạn, mỗi bạn 1 con), nhảy lùi ' + pt.b + ' ô. Đếm xem mấy lần thì hết nhé!';
      else if (k < pt.kq) loi = 'Lần ' + k + ': còn ' + o + ' con.';
      else loi = 'Nhảy lùi ' + pt.kq + ' lần thì về 0. Vậy ' + pt.a + ' : ' + pt.b + ' = ' + pt.kq + '!';
      ds.push({ hinh: trucSo(pt.a, moc, o, cungs, pt.a, k === pt.kq ? 0 : null), loi: loi });
    }
    return ds;
  }
  function buocBang() { // suy ra từ phép nhân
    var pt = cl.pt, ds = [];
    for (var k = 0; k <= pt.kq; k++) {
      var h = '<div class="bang-dong">';
      for (var r = 1; r <= k; r++) h += '<p class="' + (r === pt.kq && k === pt.kq ? 'trung' : '') + '">' + pt.b + ' × ' + r + ' = ' + pt.b * r + '</p>';
      h += '</div>';
      var loi;
      if (k === 0) loi = 'Nhớ bảng nhân để chia: tìm xem ' + pt.b + ' nhân mấy thì bằng ' + pt.a + '.';
      else if (k < pt.kq) loi = pt.b + ' × ' + k + ' = ' + pt.b * k + ', chưa bằng ' + pt.a + '.';
      else loi = pt.b + ' × ' + pt.kq + ' = ' + pt.a + ', nên ' + pt.a + ' : ' + pt.kq + ' = ' + pt.b + ' và ' + pt.a + ' : ' + pt.b + ' = ' + pt.kq + '!';
      ds.push({ hinh: h + (k === pt.kq ? '<p class="ket-qua-dong">' + pt.a + ' : ' + pt.b + ' = <b>' + pt.kq + '</b></p>' : ''), loi: loi });
    }
    return ds;
  }
  var MEO = {
    2: 'Bảng 2: mỗi lần thêm 2, là gấp đôi số kia.',
    3: 'Bảng 3: đếm thêm 3 nhé, 3, 6, 9, 12…',
    4: 'Bảng 4 gấp đôi bảng 2: 2 × 3 = 6 nên 4 × 3 = 12.',
    5: 'Bảng 5 tận cùng là 0 hoặc 5.'
  };
  function buocBangNhan() { // tab Bảng nhân 2–5 (chỉ ở màn học)
    var a = cl.bangSo || 2, ds = [];
    var chon = '<div class="hang-tab chon-bang">';
    [2, 3, 4, 5].forEach(function (s) { chon += '<button class="chip' + (s === a ? ' chon' : '') + '" data-bang="' + s + '">Bảng ' + s + '</button>'; });
    chon += '</div>';
    for (var k = 0; k <= 10; k++) {
      var h = chon + '<div class="bang-nhan">';
      for (var r = 1; r <= 10; r++) h += '<p class="' + (r <= k ? 'da' : '') + (r === k ? ' moi' : '') + '">' + a + ' × ' + r + ' = <b>' + (r <= k ? a * r : '?') + '</b></p>';
      h += '</div>';
      ds.push({ hinh: h, loi: k === 0 ? MEO[a] + ' Bấm Bước tiếp để đọc bảng.' : k < 10 ? a + ' × ' + k + ' = ' + a * k + '.' : MEO[a] + ' Con đọc hết bảng ' + a + ' rồi, giỏi quá!' });
    }
    return ds;
  }


  // =====================================================================
  //  LÁT 11: mẹo tính nhẩm, lưới bảng nhân, gia đình số (đặc tả mục 11.2–11.4)
  // =====================================================================
  function chuoiO(ds) { // dãy ô số nối bằng mũi tên: [{so}, {mui}, ...]
    var h = '<div class="chuoi-o">';
    ds.forEach(function (x) {
      if (x.mui) h += '<span class="mui-o">' + x.mui + '</span>';
      else h += '<span class="o-so' + (x.moi ? ' moi' : '') + (x.kq ? ' kq' : '') + '">' + x.so + '</span>';
    });
    return h + '</div>';
  }
  function dungGapDoi(pt) { return (pt.dau === '×' && (pt.a === 2 || pt.a === 4)) || (pt.dau === ':' && (pt.b === 2 || pt.b === 4)); }
  function dungMeo10(pt) { return (pt.dau === '×' && (pt.a === 10 || pt.a === 5)) || (pt.dau === ':' && (pt.b === 10 || pt.b === 5)); }
  function dungSuy(pt) { return pt.dau === '×' && (pt.a === 3 || pt.a === 4); }
  function buocGapDoi() {
    var pt = cl.pt, b = pt.b, a = pt.a;
    if (pt.dau === '×' && a === 2) return [
      { hinh: chuoiO([{ so: b }]), loi: '2 × ' + b + ' là gấp đôi ' + b + '.' },
      { hinh: chuoiO([{ so: b }, { mui: 'gấp đôi' }, { so: pt.kq, kq: true }]), loi: b + ' + ' + b + ' = ' + pt.kq + '. Vậy 2 × ' + b + ' = ' + pt.kq + '!' }];
    if (pt.dau === '×') return [
      { hinh: chuoiO([{ so: b }]), loi: '4 × ' + b + ': gấp đôi rồi gấp đôi nữa.' },
      { hinh: chuoiO([{ so: b }, { mui: 'gấp đôi' }, { so: 2 * b, moi: true }]), loi: 'Gấp đôi lần 1: 2 × ' + b + ' = ' + 2 * b + '.' },
      { hinh: chuoiO([{ so: b }, { mui: 'gấp đôi' }, { so: 2 * b }, { mui: 'gấp đôi' }, { so: pt.kq, kq: true }]), loi: 'Gấp đôi lần 2: ' + 2 * b + ' + ' + 2 * b + ' = ' + pt.kq + '. Vậy 4 × ' + b + ' = ' + pt.kq + '!' }];
    if (b === 2) return [
      { hinh: chuoiO([{ so: a }]), loi: 'Chia 2 là chia đôi.' },
      { hinh: chuoiO([{ so: a }, { mui: 'chia đôi' }, { so: pt.kq, kq: true }]), loi: a + ' chia đôi được ' + pt.kq + '. Vậy ' + a + ' : 2 = ' + pt.kq + '!' }];
    return [
      { hinh: chuoiO([{ so: a }]), loi: a + ' : 4: chia đôi rồi chia đôi nữa.' },
      { hinh: chuoiO([{ so: a }, { mui: 'chia đôi' }, { so: a / 2, moi: true }]), loi: 'Chia đôi lần 1: ' + a + ' : 2 = ' + a / 2 + '.' },
      { hinh: chuoiO([{ so: a }, { mui: 'chia đôi' }, { so: a / 2 }, { mui: 'chia đôi' }, { so: pt.kq, kq: true }]), loi: 'Chia đôi lần 2: ' + a / 2 + ' : 2 = ' + pt.kq + '. Vậy ' + a + ' : 4 = ' + pt.kq + '!' }];
  }
  function buocMeo10() {
    var pt = cl.pt, a = pt.a, b = pt.b;
    if (pt.dau === '×' && a === 10) return [
      { hinh: chuoiO([{ so: b }]), loi: 'Nhân 10 thì viết thêm số 0 vào sau.' },
      { hinh: chuoiO([{ so: b }, { mui: 'thêm 0' }, { so: pt.kq, kq: true }]), loi: b + ' thêm số 0 là ' + pt.kq + '. Vậy 10 × ' + b + ' = ' + pt.kq + '!' }];
    if (pt.dau === ':' && b === 10) return [
      { hinh: chuoiO([{ so: a }]), loi: 'Chia 10 thì bỏ số 0 ở cuối.' },
      { hinh: chuoiO([{ so: a }, { mui: 'bỏ số 0' }, { so: pt.kq, kq: true }]), loi: a + ' bỏ số 0 là ' + pt.kq + '. Vậy ' + a + ' : 10 = ' + pt.kq + '!' }];
    if (pt.dau === '×') return [
      { hinh: chuoiO([{ so: b }]), loi: 'Nhân 5: nhân mười rồi chia đôi.' },
      { hinh: chuoiO([{ so: b }, { mui: '× 10' }, { so: 10 * b, moi: true }]), loi: '10 × ' + b + ' = ' + 10 * b + '.' },
      { hinh: chuoiO([{ so: b }, { mui: '× 10' }, { so: 10 * b }, { mui: 'chia đôi' }, { so: pt.kq, kq: true }]), loi: 10 * b + ' chia đôi được ' + pt.kq + '. Vậy 5 × ' + b + ' = ' + pt.kq + '!' }];
    return [
      { hinh: chuoiO([{ so: a }]), loi: 'Chia 5: gấp đôi rồi chia 10.' },
      { hinh: chuoiO([{ so: a }, { mui: 'gấp đôi' }, { so: 2 * a, moi: true }]), loi: 'Gấp đôi ' + a + ' được ' + 2 * a + '.' },
      { hinh: chuoiO([{ so: a }, { mui: 'gấp đôi' }, { so: 2 * a }, { mui: 'bỏ số 0' }, { so: pt.kq, kq: true }]), loi: 2 * a + ' chia 10 (bỏ số 0) được ' + pt.kq + '. Vậy ' + a + ' : 5 = ' + pt.kq + '!' }];
  }
  function buocSuy() {
    var pt = cl.pt, b = pt.b;
    if (pt.a === 3) return [
      { hinh: chuoiO([{ so: '2 × ' + b }, { mui: '+ ' + b }]), loi: 'Suy từ phép dễ hơn: 3 × ' + b + ' là 2 × ' + b + ' thêm một nhóm ' + b + ' nữa.' },
      { hinh: chuoiO([{ so: '2 × ' + b + ' = ' + 2 * b, moi: true }, { mui: '+ ' + b }]), loi: '2 × ' + b + ' = ' + 2 * b + '.' },
      { hinh: chuoiO([{ so: 2 * b }, { mui: '+ ' + b }, { so: pt.kq, kq: true }]), loi: 'Thêm một nhóm nữa: ' + 2 * b + ' + ' + b + ' = ' + pt.kq + '. Vậy 3 × ' + b + ' = ' + pt.kq + '!' }];
    return [
      { hinh: chuoiO([{ so: '5 × ' + b }, { mui: '− ' + b }]), loi: 'Suy từ phép dễ hơn: 4 × ' + b + ' là 5 × ' + b + ' bớt đi một nhóm ' + b + '.' },
      { hinh: chuoiO([{ so: '5 × ' + b + ' = ' + 5 * b, moi: true }, { mui: '− ' + b }]), loi: '5 × ' + b + ' = ' + 5 * b + '.' },
      { hinh: chuoiO([{ so: 5 * b }, { mui: '− ' + b }, { so: pt.kq, kq: true }]), loi: 'Bớt đi một nhóm: ' + 5 * b + ' − ' + b + ' = ' + pt.kq + '. Vậy 4 × ' + b + ' = ' + pt.kq + '!' }];
  }
  var DA_HOC = [1, 2, 3, 4, 5, 10];
  function buocLuoi() { // lưới bảng nhân 10 × 10, chạm ô thì ô đối xứng sáng theo
    var c = cl.luoiChon, h = '<div class="luoi-nhan"><span class="goc">×</span>';
    for (var j = 1; j <= 10; j++) h += '<span class="dau-cot">' + j + '</span>';
    for (var r = 1; r <= 10; r++) {
      h += '<span class="dau-hang">' + r + '</span>';
      for (var k = 1; k <= 10; k++) {
        var lop = (DA_HOC.indexOf(r) >= 0 || DA_HOC.indexOf(k) >= 0 ? 'hoc' : '') + (r === k ? ' cheo' : '');
        if (c && r === c[0] && k === c[1]) lop += ' chon'; else if (c && r === c[1] && k === c[0]) lop += ' doi';
        h += '<button class="o-luoi ' + lop + '" data-luoi="' + r + ',' + k + '">' + r * k + '</button>';
      }
    }
    h += '</div>';
    var loi = !c ? 'Chạm vào một ô bất kỳ nhé! Ô đậm là các bảng con đã học.' :
      c[0] === c[1] ? c[0] + ' × ' + c[1] + ' = ' + c[0] * c[1] + '. Ô này nằm trên đường chéo, hai bên giống hệt nhau.' :
      c[0] + ' × ' + c[1] + ' = ' + c[1] + ' × ' + c[0] + ' = ' + c[0] * c[1] + '. Nhớ một phép là biết hai phép!';
    return [{ hinh: h, loi: loi }];
  }
  function buocGiaDinh() { // gia đình số: 3 số, 4 phép
    var pt = cl.pt, a = pt.a, b = pt.b, t = pt.kq, n = cl.gdBuoc || 0;
    var hang = [[a, '×', b, t], [b, '×', a, t], [t, ':', a, b], [t, ':', b, a]];
    var h = '<div class="gia-dinh"><div class="bo-so">';
    cl.gdThuTu.forEach(function (x) { h += '<button class="chip so-gd" data-gd="' + x + '">' + x + '</button>'; });
    h += '</div><div class="bon-phep">';
    hang.forEach(function (p, i) {
      h += '<p class="' + (i < n ? 'xong' : i === n ? 'dang' : '') + '">' + p[0] + ' ' + p[1] + ' ' + p[2] + ' = <b>' + (i < n ? p[3] : '?') + '</b></p>';
    });
    h += '</div></div>';
    var loi = n === 0 ? 'Gia đình số ' + a + ', ' + b + ', ' + t + '. Chạm số đúng để điền vào dấu hỏi nhé!' :
      n < 4 ? 'Đúng rồi! Điền tiếp phép ' + (n + 1) + ' nào.' :
      'Gia đình số ' + a + ', ' + b + ', ' + t + ' có 4 phép tính. Phép chia là phép nhân đi ngược lại!';
    return [{ hinh: h, loi: loi }];
  }

  // ---------- Khung "Cách làm" ----------
  function dungTuDong() { clearTimeout(cl.tuDong); cl.tuDong = null; $('nutLamMau').textContent = '▶ Làm mẫu'; }
  function chonCach(cach) {
    dungTuDong();
    cl.cach = cach; cl.buoc = 0; cl.nhay = 0;
    var TAO = { tach: buocTach, que: buocQue, nhom: buocNhom, nhay: buocNhay, mang: buocMang, deu: buocDeu, lui: buocLui, bang: buocBang, bangnhan: buocBangNhan,
      gapdoi: buocGapDoi, meo10: buocMeo10, suy: buocSuy, luoi: buocLuoi, giadinh: buocGiaDinh };
    if (cach === 'luoi') cl.luoiChon = null;
    if (cach === 'giadinh') { cl.gdBuoc = 0; cl.gdThuTu = [cl.pt.a, cl.pt.b, cl.pt.kq].sort(function () { return Math.random() - 0.5; }); }
    cl.ds = TAO[cach] ? TAO[cach]() : [];
    ve();
  }
  function ve() {
    var pt = cl.pt, kq;
    $('tieuDeCach').textContent = cl.cach === 'bangnhan' ? 'Bảng nhân ' + (cl.bangSo || 2) :
      cl.cach === 'luoi' ? 'Lưới bảng nhân' : cl.cach === 'giadinh' ? 'Gia đình số' :
      (cl.hoc ? 'Học cách tính: ' : 'Cách làm: ') + pt.a + ' ' + pt.dau + ' ' + pt.b + ' = ?';
    var tab = '', dsCach = cl.hoc ? (cl.phep === 'nc' ? NHOM_NC[cl.nhomNc || 'hieu'] : CACH_CT) : cacCach(pt);
    if (cl.hoc) tab += '<div class="hang-tab chon-phep"><button class="chip' + (cl.phep !== 'nc' ? ' chon' : '') + '" data-phep="ct">➕➖ Cộng trừ</button>' +
      '<button class="chip' + (cl.phep === 'nc' ? ' chon' : '') + '" data-phep="nc">✖️➗ Nhân chia</button></div>';
    if (cl.hoc && cl.phep === 'nc') {
      tab += '<div class="hang-tab chon-nhom">';
      ['hieu', 'meo', 'thuoc'].forEach(function (g) { tab += '<button class="chip' + ((cl.nhomNc || 'hieu') === g ? ' chon' : '') + '" data-nhom="' + g + '">' + TEN_NHOM[g] + '</button>'; });
      tab += '</div>';
    }
    dsCach.forEach(function (c) { tab += '<button class="chip' + (c === cl.cach ? ' chon' : '') + '" data-cach="' + c + '">' + TEN[c] + '</button>'; });
    $('tabCach').innerHTML = tab;
    var t = $('tabCach').querySelectorAll('[data-cach]');
    for (var i = 0; i < t.length; i++) t[i].addEventListener('click', function () { am('bam'); var c = this.getAttribute('data-cach'); if (cl.hoc) { cl.pt = viDu(c); } chonCach(c); });
    var tn = $('tabCach').querySelectorAll('[data-nhom]');
    for (var g2 = 0; g2 < tn.length; g2++) tn[g2].addEventListener('click', function () {
      am('bam'); cl.nhomNc = this.getAttribute('data-nhom');
      var c1 = NHOM_NC[cl.nhomNc][0]; cl.pt = viDu(c1); chonCach(c1);
    });
    var tp = $('tabCach').querySelectorAll('[data-phep]');
    for (var j = 0; j < tp.length; j++) tp[j].addEventListener('click', function () {
      am('bam'); cl.phep = this.getAttribute('data-phep');
      try { TV.luu().caiDat.phepHoc = cl.phep; TV.ghiLuu(); } catch (e) { /* không lưu được thì thôi */ }   // nhớ phép bé chọn (rà 0.8.0)
      cl.nhomNc = 'hieu';
      var c0 = cl.phep === 'nc' ? 'nhom' : 'truc'; cl.pt = viDu(c0); chonCach(c0);
    });
    if (cl.cach === 'truc') kq = veTruc();
    else if (!cl.ds.length) kq = { hinh: '', loi: '', xong: true };
    else { var b = cl.ds[cl.buoc]; kq = { hinh: b.hinh, loi: b.loi, xong: cl.buoc >= cl.ds.length - 1 }; }
    $('vungCach').innerHTML = '<div class="hinh-cach cach-' + cl.cach + '">' + kq.hinh + '</div>';
    $('loiCach').textContent = kq.loi;
    $('nutBuocTiep').textContent = NHAY[cl.cach] ? '🐧 Nhảy' : 'Bước tiếp ▶';
    $('nutBuocTiep').style.display = KHONG_BUOC[cl.cach] ? 'none' : '';
    $('nutLamMau').style.display = KHONG_BUOC[cl.cach] ? 'none' : '';
    $('nutLamLaiCach').style.display = KHONG_BUOC[cl.cach] ? 'none' : '';
    $('nutViDuKhac').style.display = cl.hoc && cl.cach !== 'bangnhan' && cl.cach !== 'luoi' ? '' : 'none';
    var ol = $('vungCach').querySelectorAll('[data-luoi]');
    for (var o2 = 0; o2 < ol.length; o2++) ol[o2].addEventListener('click', function () {
      am('chon'); cl.luoiChon = this.getAttribute('data-luoi').split(',').map(Number); cl.ds = buocLuoi(); ve();
    });
    var gd = $('vungCach').querySelectorAll('[data-gd]');
    for (var g3 = 0; g3 < gd.length; g3++) gd[g3].addEventListener('click', function () {
      var pt2 = cl.pt, dap = [pt2.kq, pt2.kq, pt2.b, pt2.a][cl.gdBuoc || 0];
      if ((cl.gdBuoc || 0) >= 4) return;
      if (+this.getAttribute('data-gd') === dap) { am('chon'); cl.gdBuoc = (cl.gdBuoc || 0) + 1; cl.ds = buocGiaDinh(); ve(); if (cl.gdBuoc >= 4) { am('thang'); TV.phaoGiay(); } }
      else { am('sai'); TV.hieuUng(this, 'lac-ngang', 320); }
    });
    var cb = $('vungCach').querySelectorAll('[data-bang]');
    for (var q = 0; q < cb.length; q++) cb[q].addEventListener('click', function () { am('bam'); cl.bangSo = +this.getAttribute('data-bang'); chonCach('bangnhan'); });
    $('nutBuocTiep').disabled = kq.xong;

    $('nutHieuRoi').textContent = cl.hoc ? 'Xong' : '✔ Con hiểu rồi';
    var cc = $('vungCach').querySelector('.truc-cc');
    if (cc) cc.addEventListener('click', function () { buocTiep(); });
    cl.xong = kq.xong;
  }
  function buocTiep() {
    if (cl.xong) return false;
    if (cl.cach === 'truc') cl.nhay++; else cl.buoc++;
    am('chon');
    ve();
    if (cl.xong) setTimeout(function () { am('sao'); }, 250);
    return true;
  }
  function lamMau() {
    if (cl.tuDong) { dungTuDong(); return; }
    if (cl.xong) { cl.buoc = 0; cl.nhay = 0; ve(); }
    $('nutLamMau').textContent = '⏸ Dừng';
    (function chay() {
      cl.tuDong = setTimeout(function () {
        if (buocTiep() && !cl.xong) chay(); else dungTuDong();
      }, NHAY[cl.cach] ? 800 : cl.cach === 'nhom' || cl.cach === 'deu' || cl.cach === 'bang' || cl.cach === 'bangnhan' ? 1100 : 1700);
    })();
  }
  function mo(pt, hoc) {
    cl.pt = pt; cl.hoc = !!hoc;
    if (hoc) cl.phep = (pt.dau === '×' || pt.dau === ':') ? 'nc' : 'ct';
    $('cachLam').classList.add('hien');
    chonCach(hoc ? (cl.phep === 'nc' ? 'nhom' : 'truc') : cacCach(pt)[0]);
  }
  function dong() {
    dungTuDong();
    $('cachLam').classList.remove('hien');
    if (!cl.hoc && TV.manHienTai() === 'manHoi') $('nhanXetHoi').textContent = 'Giờ con chọn đáp số nào!';
  }
  $('nutBuocTiep').addEventListener('click', function () { dungTuDong(); buocTiep(); });
  $('nutLamMau').addEventListener('click', function () { am('bam'); lamMau(); });
  $('nutLamLaiCach').addEventListener('click', function () { am('bam'); dungTuDong(); cl.buoc = 0; cl.nhay = 0; ve(); });
  $('nutHieuRoi').addEventListener('click', function () { am('bam'); dong(); });
  $('nutViDuKhac').addEventListener('click', function () { am('bam'); cl.pt = viDu(cl.cach); chonCach(cl.cach); });

  // Ví dụ cho màn học riêng, hợp với từng cách
  function viDu(cach) {
    var a, b, cong = Math.random() < 0.5;
    if (cach === 'nhom' || cach === 'nhay' || cach === 'mang') { a = ng(2, 5); b = ng(2, 6); return { a: a, dau: '×', b: b, kq: a * b }; }
    if (cach === 'deu' || cach === 'lui' || cach === 'bang' || cach === 'bangnhan') { b = ng(2, 5); var t = ng(2, 6); return { a: b * t, dau: ':', b: b, kq: t }; }
    var cn = Math.random() < 0.5;
    if (cach === 'gapdoi') { b = [2, 4][ng(0, 1)]; a = ng(2, 10); return cn ? { a: b, dau: '×', b: a, kq: a * b } : { a: a * b, dau: ':', b: b, kq: a }; }
    if (cach === 'meo10') { b = [10, 5][ng(0, 1)]; a = ng(2, 10); return cn ? { a: b, dau: '×', b: a, kq: a * b } : { a: a * b, dau: ':', b: b, kq: a }; }
    if (cach === 'suy') { a = [3, 4][ng(0, 1)]; b = ng(3, 10); return { a: a, dau: '×', b: b, kq: a * b }; }
    if (cach === 'giadinh' || cach === 'luoi') { a = [2, 3, 4, 5, 10][ng(0, 4)]; do { b = ng(2, 9); } while (b === a); return { a: a, dau: '×', b: b, kq: a * b }; }
    if (cach === 'truc') {
      if (cong) { a = ng(1, 12); b = ng(1, Math.min(8, 20 - a)); } else { a = ng(4, 20); b = ng(1, Math.min(8, a)); }
    } else if (cach === 'tach') {
      if (cong) { a = ng(5, 9); b = ng(11 - a, 9); } else { a = ng(11, 18); b = ng(a % 10 + 1, 9); }
    } else {
      if (cong) { a = ng(12, 68); b = ng(11, 99 - a); } else { a = ng(30, 95); b = ng(11, a - 10); }
    }
    return { a: a, dau: cong ? '+' : '−', b: b, kq: cong ? a + b : a - b };
  }

  // Nút Quay lại của Android: đóng khung trước
  var quayLaiCu = window.quayLai;
  window.quayLai = function () {
    if ($('cachLam').classList.contains('hien')) { dong(); return true; }
    return quayLaiCu();
  };

  TV.cachLam = { mo: mo, dong: dong, cacCach: cacCach, viDu: viDu, buocTiep: buocTiep, trangThai: function () { return cl; } };
  $('nutHocCach').addEventListener('click', function () { am('bam'); mo(viDu(TV.luu().caiDat.phepHoc === 'nc' ? 'nhom' : 'truc'), true); });
})();
