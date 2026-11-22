/* Toán Vui Cùng Bố Mẹ – lát 11: luyện thuộc nhân chia (đặc tả mục 11.5, 11.6).
 * 1) Nhớ từng phép nhân chia bé hay sai hoặc chậm ("điểm yếu"), để hoi.js cho ra lại nhiều hơn.
 * 2) Chế độ ⚡ Phản xạ nhanh: 1 phút làm được bao nhiêu câu, đấu với kỷ lục của chính bé. */
(function () {
  'use strict';
  var TV = window.TV, $ = TV.$, am = TV.am, hen = TV.hen, ng = TV.ngauNhien;

  // ---------- Điểm yếu từng phép ----------
  // Khoá: nhân "4x3" (bảng 4, lấy 3 lần); chia "12:4" (12 chia cho 4). Mỗi phép: y = điểm yếu, d = lần đúng, s = lần sai.
  function khoa(pt) { return pt.dau === '×' ? pt.a + 'x' + pt.b : pt.a + ':' + pt.b; }
  function so() { return TV.beHienTai().thuoc; }
  function ghi(pt, loai) {
    var k = khoa(pt), t = so()[k] || (so()[k] = { y: 0, d: 0, s: 0 });
    if (loai === 'sai') { t.y = Math.min(t.y + 2, 6); t.s++; }
    else {
      t.d++;
      if (loai === 'cham') t.y = Math.min(t.y + 1, 6);
      else if (loai === 'nhanh') t.y = Math.max(t.y - 2, 0);   // đúng dưới 3 giây
      else if (loai === 'dung') t.y = Math.max(t.y - 1, 0);    // đúng trong 3–5 giây (Sếp chốt 20/11)
    }
    TV.ghiLuu();
  }
  // Chọn một phép yếu thuộc các bảng dsBang (nhân hoặc chia), xác suất theo điểm yếu. Không có thì null.
  var vuaChon = [];   // 3 phép yếu vừa đưa ra: không ra lại liền (Sếp chốt 20/11)
  function hopLe(k) {
    var m = k.match(/^(\d+)x(\d+)$/);
    if (m) return [2, 3, 4, 5, 10].indexOf(+m[1]) >= 0 && +m[2] >= 1 && +m[2] <= 10;
    m = k.match(/^(\d+):(\d+)$/);
    return !!m && [2, 3, 4, 5, 10].indexOf(+m[2]) >= 0 && +m[1] % +m[2] === 0 && +m[1] / +m[2] >= 1 && +m[1] / +m[2] <= 10;
  }
  function chonYeu(dsBang, nhan) {
    var ds = [], tong = 0, s = so();
    Object.keys(s).forEach(function (k) {
      if (!s[k].y || vuaChon.indexOf(k) >= 0 || !hopLe(k)) return;
      var m = nhan ? k.match(/^(\d+)x(\d+)$/) : k.match(/^(\d+):(\d+)$/);
      if (!m) return;
      var bang = nhan ? +m[1] : +m[2], lan = nhan ? +m[2] : +m[1] / +m[2];
      if (dsBang.indexOf(bang) < 0 || lan < 1 || lan > 10 || lan % 1) return;
      ds.push({ bang: bang, lan: lan, y: s[k].y, k: k }); tong += s[k].y;
    });
    if (!ds.length) return null;
    var r = Math.random() * tong, chon = ds[ds.length - 1];
    for (var i = 0; i < ds.length; i++) { r -= ds[i].y; if (r <= 0) { chon = ds[i]; break; } }
    vuaChon.push(chon.k); if (vuaChon.length > 3) vuaChon.shift();
    return chon;
  }
  function dsYeu(n) {
    var s = so();
    return Object.keys(s).filter(function (k) { return s[k].y > 0 && hopLe(k); })
      .sort(function (a, b) { return s[b].y - s[a].y; }).slice(0, n)
      .map(function (k) { return k.replace('x', ' × ').replace(':', ' : '); });
  }
  TV.thuoc = { ghi: ghi, chonYeu: chonYeu, dsYeu: dsYeu, khoa: khoa };

  // ---------- ⚡ Phản xạ nhanh ----------
  var THOI_GIAN = 60;   // giây
  var px = { conLai: 0, dung: 0, cau: null, khoa: false, chay: false, batDau: 0 };

  function duDieuKien() {
    var m = TV.beHienTai().mon.nhanchia, tong = m.dung + m.sai;
    return tong >= 20 && m.dung / tong >= 0.8;
  }
  // Thêm thẻ "⚡ Phản xạ nhanh" vào màn chọn cấp Nhân chia
  var veCapCu = TV.khiMoMan.manCapHoi;
  TV.khiMoMan.manCapHoi = function () {
    px.chay = false;   // rời màn Phản xạ giữa chừng thì dừng hẳn (hẹn giờ cũng đã bị huỷ khi rời màn chơi)
    veCapCu();
    var h = window.__toanVuiHoi;
    if (!h || h.mon !== 'nhanchia') return;
    var mo = duDieuKien(), m = TV.beHienTai().mon.nhanchia, tong = m.dung + m.sai, kl = TV.beHienTai().phanXa.kyLuc;
    var the = document.createElement('button');
    the.className = 'the-cap the-phan-xa' + (mo ? '' : ' khoa');
    the.innerHTML = '<span class="so-cap">⚡</span><span class="mo-ta"><b>Phản xạ nhanh</b><small>' +
      (mo ? '1 phút làm được bao nhiêu câu?' + (kl ? ' Kỷ lục: ' + kl : '') :
        'Mở khi làm đủ 20 câu và đúng từ 80% (đang ' + tong + ' câu' + (tong ? ', ' + Math.round(m.dung / tong * 100) + '%' : '') + ')') + '</small></span>';
    the.addEventListener('click', function () {
      if (!duDieuKien()) { am('sai'); TV.hieuUng(the, 'lac-ngang', 320); return; }
      am('bam'); batDau();
    });
    $('dsCapHoi').appendChild(the);
  };

  function taoCauPX() {
    var capMo = Math.min(TV.beHienTai().mon.nhanchia.capMo, 6);
    var cap = ng(1, capMo), q, lan = 0;
    do { q = TV.MON_HOI.nhanchia.taoCau(cap); lan++; } while (px.cau && q.khoa === px.cau.khoa && lan < 10);
    return q;
  }
  function batDau() {
    px.conLai = THOI_GIAN * 10; px.dung = 0; px.cau = null; px.chay = true; px.dungLuc = null; px.ketThucLuc = Date.now() + THOI_GIAN * 1000;
    TV.moMan('manPhanXa');
    $('pxKyLuc').textContent = TV.beHienTai().phanXa.kyLuc;
    cauMoi();
    nhip();
  }
  function nhip() {
    hen(function () {
      if (!px.chay) return;
      if (px.dungLuc != null) { nhip(); return; }   // app vừa lên lại, chờ visibilitychange cập nhật mốc hết giờ (rà 0.10.1)
      px.conLai = Math.max(0, Math.round((px.ketThucLuc - Date.now()) / 100));   // tính theo giờ thật, không cộng dồn nhịp
      $('pxDongHo').style.width = (px.conLai / (THOI_GIAN * 10) * 100) + '%';
      $('pxGiay').textContent = Math.ceil(px.conLai / 10);
      if (px.conLai <= 0) { ketThuc(); return; }
      nhip();
    }, 100);
  }
  function thoat(s) { return String(s).replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function cauMoi() {
    var q = px.cau = taoCauPX();
    px.khoa = false; px.batDau = Date.now();
    $('pxDe').textContent = q.chu;
    $('pxDiem').textContent = px.dung;
    var h = '';
    q.dapAn.forEach(function (d) { h += '<button class="nut-dap" data-dap="' + thoat(d) + '"><b>' + thoat(d) + '</b></button>'; });
    $('pxDapAn').innerHTML = h;
    var nut = $('pxDapAn').querySelectorAll('.nut-dap');
    for (var i = 0; i < nut.length; i++) nut[i].addEventListener('click', function () { chon(this); });
  }
  function chon(nut) {
    if (!px.chay || px.khoa) return;
    px.khoa = true;
    var q = px.cau, dung = nut.getAttribute('data-dap') === String(q.dung), t = Date.now() - px.batDau;
    if (dung) {
      nut.classList.add('dung'); am('chon');
      px.dung++; $('pxDiem').textContent = px.dung;
      ghi(q.pt, t < 3000 ? 'nhanh' : t > 5000 ? 'cham' : 'dung');
      hen(cauMoi, 250);
    } else {
      nut.classList.add('sai'); am('sai');
      ghi(q.pt, 'sai');
      var dk = $('pxDapAn').querySelector('[data-dap="' + String(q.dung).replace(/"/g, '\\"') + '"]');
      if (dk) dk.classList.add('goi-dung');   // cho bé thấy đáp án đúng rồi qua câu khác, không trừ gì
      hen(cauMoi, 900);
    }
  }
  function ketThuc() {
    px.chay = false;
    var px2 = TV.beHienTai().phanXa, cu = px2.kyLuc, kyLuc = px.dung > cu;
    px2.lan++;
    if (kyLuc) px2.kyLuc = px.dung;
    var ca = Math.floor(px.dung / 2);
    if (ca) TV.themCa(ca);
    TV.ghiLuu();
    am('thang');
    if (kyLuc) TV.phaoGiay();
    TV.moBangThang({
      tieuDe: kyLuc ? 'Phá kỷ lục rồi! 🏅' : 'Hết giờ!',
      sao: px.dung >= 20 ? 3 : px.dung >= 10 ? 2 : 1,
      chiTiet: 'Con làm đúng ' + px.dung + ' câu trong 1 phút.' + (kyLuc ? (cu ? ' Kỷ lục cũ: ' + cu + ' câu.' : '') : ' Kỷ lục của con: ' + cu + ' câu.') +
        (ca ? '<br><span class="thuong-ca">+' + ca + ' 🐟</span>' : ''),
      chuTiep: 'Chơi lại ▶', chuCap: 'Về chọn cấp',
      tiep: function () { batDau(); },
      chonCap: function () { TV.moMan('manCapHoi'); }
    });
  }
  // App xuống nền: dừng đồng hồ 1 phút, lên lại thì chạy tiếp từ chỗ còn lại (đồng hồ tính theo giờ thật nên phải giữ phần còn lại)
  document.addEventListener('visibilitychange', function () {
    if (!px.chay) return;
    if (document.hidden) px.dungLuc = Math.max(0, px.ketThucLuc - Date.now());
    else if (px.dungLuc != null) { px.ketThucLuc = Date.now() + px.dungLuc; px.dungLuc = null; px.batDau = Date.now(); }
  });
  window.__toanVuiPX = { px: px, batDau: batDau, duDieuKien: duDieuKien };
})();
