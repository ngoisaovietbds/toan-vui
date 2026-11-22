/* Toán Vui Cùng Bố Mẹ – lát 6: giọng bố mẹ đọc.
 * Không sửa từng màn: theo dõi các ô lời của game (đề bài, lời khen, lời nhắc...). Lời mới hiện ra có chứa
 * "chữ để khớp" của câu nào trong giong/cau-doc.js thì phát giong/<mã>.m4a. Khớp nhiều câu thì lấy câu khớp dài nhất.
 * Chỉ phát những file có trong giong/co-san.js (build.py tạo lúc đóng gói). Chưa thu giọng thì game im lặng như cũ. */
(function () {
  'use strict';
  var TV = window.TV, $ = TV.$;
  var CO = {};
  (window.GIONG_CO || []).forEach(function (m) { CO[m] = true; });
  function chuan(s) {
    return String(s || '').toLowerCase().normalize('NFC').replace(/[^0-9a-zà-ỹđ\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }
  var BANG = (window.CAU_DOC || []).filter(function (c) { return c[1]; }).map(function (c) { return { ma: c[0], khop: chuan(c[1]) }; });

  function batGiong() { var cd = TV.luu().caiDat; return cd.giong !== false && cd.am !== false; }
  var dangPhat = null, choDe = null;
  // laDe = câu đề bài. Đề mới hiện lúc lời khen còn đang đọc thì chờ khen xong mới đọc đề (rà 0.6.3),
  // còn các lời khác (khen, nhắc, gợi ý) thì đọc ngay, cắt câu cũ.
  function phat(ma, laDe) {
    if (!CO[ma] || !batGiong()) return;
    if (laDe && dangPhat && !dangPhat.paused && !dangPhat.ended) { choDe = ma; return; }
    choDe = null;
    try {
      if (dangPhat) { dangPhat.pause(); dangPhat = null; }
      var a = new Audio('giong/' + ma + '.m4a');
      dangPhat = a;
      a.addEventListener('ended', function () {
        if (dangPhat !== a) return;
        dangPhat = null;
        // Bé đã rời màn chơi trong lúc chờ thì bỏ câu đề cũ (rà 0.6.4)
        var man = TV.manHienTai();
        if (choDe && (man === 'manHoi' || man === 'manChoi')) { var d = choDe; choDe = null; phat(d); }
        choDe = null;
      });
      var p = a.play();
      if (p && p.catch) p.catch(function () { /* máy chặn phát: bỏ qua */ });
    } catch (e) { /* không phát được thì thôi */ }
  }
  function timMa(chu) {
    var c = chuan(chu), tot = null;
    if (!c) return null;
    BANG.forEach(function (x) { if (c.indexOf(x.khop) >= 0 && (!tot || x.khop.length > tot.khop.length)) tot = x; });
    return tot && tot.ma;
  }
  // Theo dõi các ô lời. Lời khen (nhận xét) ưu tiên hơn đề bài khi đổi cùng lúc.
  var O_THEO_DOI = ['deBai', 'nhanXet', 'deHoi', 'nhanXetHoi', 'loiKhen', 'nhacGio', 'loiHetGio', 'loiCuaHang', 'loiCach'];
  var choPhat = null;
  O_THEO_DOI.forEach(function (id) {
    var el = $(id); if (!el || !window.MutationObserver) return;
    new MutationObserver(function () {
      var ma = timMa(el.textContent);
      if (!ma) return;
      if (id === 'goiYXoay' && el.style.display === 'none') return;
      // Gom các thay đổi trong cùng một lúc, phát câu cuối cùng
      clearTimeout(choPhat);
      var laDe = id === 'deBai' || id === 'deHoi';
      choPhat = setTimeout(function () { phat(ma, laDe); }, 60);
    }).observe(el, { childList: true, characterData: true, subtree: true, attributes: id === 'goiYXoay' });
  });
  // Chào khi bé chạm lần đầu (máy thường chỉ cho phát tiếng sau lần chạm đầu)
  var daChao = false;
  document.addEventListener('click', function () { if (!daChao) { daChao = true; setTimeout(function () { if (!dangPhat) phat('g_chao'); }, 300); } }, true);

  TV.giong = { phat: phat, timMa: timMa, soCau: function () { return Object.keys(CO).length; }, tongCau: (window.CAU_DOC || []).length, bat: batGiong };
})();
