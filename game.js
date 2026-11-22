/* Toán Vui Cùng Bố Mẹ – phần lõi (lưu tiến độ, âm thanh, hình, điều hướng) và màn "Cánh cụt xếp hàng".
 * Các màn hỏi–đáp (Đếm, Lớn–bé, Số còn thiếu) ở hoi.js, dùng chung lõi qua window.TV.
 * Viết thuần JS, không thư viện, không gọi mạng. Âm thanh tạo bằng Web Audio (không cần file).
 * Tiến độ lưu trong localStorage (bộ nhớ riêng của app trên máy). */
(function () {
  'use strict';

  // ---------- Lưu tiến độ (chừa chỗ nhiều bé) ----------
  var KHO = 'toanvui.v1';
  function luuMacDinh() {
    return { phienBan: 1, beDangChoi: 'be1', caiDat: { am: true },
      be: { be1: { ten: '', mon: { xephang: { capMo: 1, sao: {} } } } } };
  }
  // Bổ sung phần còn thiếu khi mở bản mới trên máy đã có tiến độ của bản cũ (không xoá gì của bé)
  var DS_MON = ['xephang', 'dem', 'lonbe', 'sothieu', 'congtru', 'nhanchia', 'bome'];
  function chuanHoa(d) {
    for (var k in d.be) {
      var be = d.be[k];
      if (!be.mon) be.mon = {};
      if (typeof be.ca !== 'number') be.ca = 0;
      if (!be.thoiGian) be.thoiGian = {};                     // giây chơi theo ngày 'YYYY-MM-DD'
      if (!be.themPhut) be.themPhut = { ngay: '', phut: 0 };  // bố mẹ mở thêm trong ngày
      if (!be.phuKien) be.phuKien = { co: [], deo: {} };      // phụ kiện đã mua / đang đeo (lát 6)
      if (!be.nha) be.nha = { co: [], dat: [] };              // nhà tuyết: đồ đã mua, đồ đã đặt (lát 12)
      if (!be.thuoc) be.thuoc = {};                           // từng phép nhân chia: điểm yếu, lần đúng/sai (lát 11)
      if (!be.phanXa) be.phanXa = { kyLuc: 0, lan: 0 };       // chế độ Phản xạ nhanh (lát 11)
      DS_MON.forEach(function (m) {
        if (!be.mon[m]) be.mon[m] = { capMo: 1, sao: {} };
        if (typeof be.mon[m].dung !== 'number') be.mon[m].dung = 0;  // xếp hàng: số ván xong; màn khác: số câu đúng
        if (typeof be.mon[m].sai !== 'number') be.mon[m].sai = 0;    // xếp hàng: lần đổi sai; màn khác: lần chọn lại
      });
    }
    if (!d.caiDat) d.caiDat = { am: true };
    if (typeof d.caiDat.gioiHan !== 'number') d.caiDat.gioiHan = 20;   // phút/ngày, 0 = không giới hạn
    if (typeof d.caiDat.giong !== 'boolean') d.caiDat.giong = true;    // giọng bố mẹ đọc (lát 6)
    return d;
  }
  function docLuu() {
    try {
      var d = JSON.parse(localStorage.getItem(KHO));
      if (d && d.be && d.be[d.beDangChoi]) return chuanHoa(d);
    } catch (e) { /* bỏ qua, dùng mặc định */ }
    return chuanHoa(luuMacDinh());
  }
  var luu = docLuu();
  function ghiLuu() { try { localStorage.setItem(KHO, JSON.stringify(luu)); } catch (e) { /* máy chặn lưu: vẫn chơi được */ } }
  function beHienTai() { return luu.be[luu.beDangChoi]; }
  function tienDo() { return beHienTai().mon.xephang; }
  // Cá thưởng: mỗi câu đúng được cá (đặc tả mục 5). Đổi phụ kiện ở lát 6.
  function themCa(n) { beHienTai().ca += n; veSoCa(); }
  function veSoCa() {
    var ds = document.querySelectorAll('.so-ca b');
    for (var i = 0; i < ds.length; i++) ds[i].textContent = beHienTai().ca;
  }

  // ---------- Âm thanh ----------
  var ac = null;
  function am(loai) {
    if (!luu.caiDat.am) return;
    try {
      if (!ac) ac = new (window.AudioContext || window.webkitAudioContext)();
      if (ac.state === 'suspended') ac.resume();
    } catch (e) { return; }
    var t = ac.currentTime;
    function not(f, bd, dai, kieu, to, f2) {
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = kieu || 'sine';
      o.frequency.setValueAtTime(f, t + bd);
      if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + bd + dai);
      g.gain.setValueAtTime(0.0001, t + bd);
      g.gain.exponentialRampToValueAtTime(to || 0.2, t + bd + 0.015);
      g.gain.exponentialRampToValueAtTime(0.0001, t + bd + dai);
      o.connect(g); g.connect(ac.destination);
      o.start(t + bd); o.stop(t + bd + dai + 0.05);
    }
    if (loai === 'chon') { not(988, 0, 0.12, 'triangle', 0.18); not(1319, 0.06, 0.18, 'triangle', 0.12); }
    else if (loai === 'doi') { not(420, 0, 0.22, 'sine', 0.2, 840); }
    else if (loai === 'sai') { not(330, 0, 0.16, 'triangle', 0.16, 300); not(262, 0.17, 0.22, 'triangle', 0.16, 240); }
    else if (loai === 'thang') { [523, 659, 784, 1047, 1319].forEach(function (f, i) { not(f, i * 0.11, 0.32, 'triangle', 0.18); }); }
    else if (loai === 'sao') { not(1568, 0, 0.3, 'sine', 0.2); not(2093, 0.05, 0.3, 'sine', 0.1); }
    else if (loai === 'bam') { not(660, 0, 0.08, 'sine', 0.12); }
  }

  // ---------- Hình cánh cụt (tự vẽ) ----------
  var MAU_KHAN = ['#ff5c8a', '#ffb703', '#2ec4b6', '#8e7dff', '#ff7f3f', '#4cc9f0', '#90be6d'];
  function hinhCanhCut(so, mauKhan) {
    var chu = so === null ? '' : String(so);
    var co = chu.length >= 3 ? 26 : chu.length === 2 ? 34 : 38;
    return '' +
      '<svg viewBox="0 0 100 132" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<ellipse cx="50" cy="128" rx="34" ry="4" fill="rgba(0,60,110,.18)"/>' +
      '<ellipse cx="35" cy="123" rx="13" ry="6" fill="#ff9f1c"/><ellipse cx="65" cy="123" rx="13" ry="6" fill="#ff9f1c"/>' +
      '<ellipse cx="13" cy="80" rx="8" ry="24" fill="#22304a" transform="rotate(18 13 80)"/>' +
      '<ellipse cx="87" cy="80" rx="8" ry="24" fill="#22304a" transform="rotate(-18 87 80)"/>' +
      '<ellipse cx="50" cy="72" rx="39" ry="50" fill="#2b3a55"/>' +
      '<ellipse cx="50" cy="84" rx="28" ry="35" fill="#ffffff"/>' +
      '<ellipse cx="50" cy="42" rx="27" ry="20" fill="#ffffff"/>' +
      '<circle cx="39" cy="40" r="6.5" fill="#1b2438"/><circle cx="61" cy="40" r="6.5" fill="#1b2438"/>' +
      '<circle cx="41" cy="37.5" r="2.2" fill="#fff"/><circle cx="63" cy="37.5" r="2.2" fill="#fff"/>' +
      '<circle cx="29" cy="50" r="5" fill="#ff9bb5" opacity=".7"/><circle cx="71" cy="50" r="5" fill="#ff9bb5" opacity=".7"/>' +
      '<path d="M43 47 Q50 44 57 47 Q50 56 43 47 Z" fill="#ff9f1c"/>' +
      '<path d="M18 60 Q50 72 82 60 L82 67 Q50 79 18 67 Z" fill="' + mauKhan + '"/>' +
      '<path d="M66 66 L74 90 L64 88 L60 68 Z" fill="' + mauKhan + '"/>' +
      '<text x="50" y="' + (98 + (36 - co) * 0.3) + '" text-anchor="middle" font-size="' + co + '" font-weight="900" ' +
      'font-family="Nunito, Roboto, Arial, sans-serif" fill="#16324f">' + chu + '</text>' +
      '</svg>';
  }

  // ---------- Cấp độ ----------
  var CAP = [null,
    { so: 3, tu: 1, den: 10, chieu: 'tang', ten: 'Cấp 1', moTa: '3 bạn · số đến 10' },
    { so: 5, tu: 1, den: 20, chieu: 'tang', ten: 'Cấp 2', moTa: '5 bạn · số đến 20' },
    { so: 6, tu: 1, den: 100, chieu: 'tang', ten: 'Cấp 3', moTa: '6 bạn · số đến 100', toiDa: 10 },
    { so: 5, tu: 1, den: 100, chieu: 'giam', ten: 'Cấp 4', moTa: 'Xếp từ LỚN đến BÉ' }];
  var SO_VAN = 5; // mỗi cấp 5 ván, xong 5 ván thì mở cấp sau

  function ngauNhien(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function soNghichThe(ds, chieu) {
    var d = 0;
    for (var i = 0; i < ds.length; i++) for (var j = i + 1; j < ds.length; j++) {
      if (chieu === 'tang' ? ds[i] > ds[j] : ds[i] < ds[j]) d++;
    }
    return d;
  }
  function taoDe(cap) {
    var c = CAP[cap], tu = c.tu, den = c.den;
    if (c.den >= 100) { // số đến 100: gom các số gần nhau để bé phải so hàng chục, hàng đơn vị
      tu = ngauNhien(1, 55); den = tu + 44;
    }
    var ds = [];
    while (ds.length < c.so) { var x = ngauNhien(tu, den); if (ds.indexOf(x) < 0) ds.push(x); }
    var canIt = Math.floor(c.so * (c.so - 1) / 6) + 1; // đủ lộn xộn, không quá dễ
    var lan = 0;
    do {
      for (var i = ds.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = ds[i]; ds[i] = ds[j]; ds[j] = t; }
      lan++;
      var nt = soNghichThe(ds, c.chieu);
    } while ((nt < canIt || (c.toiDa && nt > c.toiDa)) && lan < 200);
    return ds;
  }

  // ---------- Hẹn giờ của ván (huỷ hết khi đổi ván hoặc rời màn chơi) ----------
  var dsHen = [];
  function hen(fn, ms) { dsHen.push(setTimeout(fn, ms)); }
  function huyHen() { dsHen.forEach(clearTimeout); dsHen = []; }
  function tong(ds) { return (ds || []).reduce(function (a, b) { return a + b; }, 0); }

  // ---------- Điều hướng màn ----------
  var $ = function (id) { return document.getElementById(id); };
  var manHienTai = 'manChinh';
  // Màn cha của từng màn (để nút Quay lại lùi đúng). Rời màn chơi là huỷ hẹn giờ của ván.
  var MAN_CHA = { manCap: 'manChinh', manChoi: 'manCap', manCapHoi: 'manChinh', manHoi: 'manCapHoi', manPhuHuynh: 'manChinh',
    manRaDe: 'manChinh', manDoiKhang: 'manChinh', manCuaHang: 'manChinh', manPhanXa: 'manCapHoi', manNhaBang: 'manChinh' };
  var MAN_CHOI = { manChoi: true, manHoi: true, manDoiKhang: true, manPhanXa: true };
  var chaDong = {};   // màn cha thay đổi theo lúc chơi (vd. đề của bố mẹ thì quay về màn ra đề)
  function chaCua(id) {
    if (id === 'manChoi' && van.cap === 'boMe') return 'manRaDe';
    if (chaDong[id]) { var c = chaDong[id](); if (c) return c; }
    return MAN_CHA[id];
  }
  var khiMoMan = {};
  function moMan(id) {
    var ds = document.querySelectorAll('.man');
    if (MAN_CHOI[manHienTai] && id !== manHienTai) huyHen();
    for (var i = 0; i < ds.length; i++) ds[i].classList.remove('hien');
    $(id).classList.add('hien');
    manHienTai = id;
    if (id === 'manChinh') veSoCa();
    if (id === 'manCap') veDanhSachCap();
    if (id === 'manChoi') setTimeout(xepViTri, 0);
    if (khiMoMan[id]) khiMoMan[id]();
  }
  // Bảng thắng dùng chung: màn nào mở thì màn đó gắn việc cho 2 nút
  var bang = { tiep: null, chonCap: null };
  function moBangThang(o) {
    $('loiKhen').textContent = o.tieuDe;
    var s = $('saoThang').children;
    for (var i = 0; i < 3; i++) { s[i].className = ''; }
    for (var j = 0; j < o.sao; j++) (function (j) { setTimeout(function () { s[j].className = 'co'; am('sao'); }, 250 + j * 300); })(j);
    $('chiTietThang').innerHTML = o.chiTiet;
    $('nutTiep').textContent = o.chuTiep;
    $('nutChonCap').textContent = o.chuCap || 'Chọn cấp';
    bang.tiep = o.tiep; bang.chonCap = o.chonCap;
    $('bangThang').classList.add('hien');
  }
  // Nút Quay lại của Android gọi hàm này. Trả về false khi đang ở màn chính (để app thoát).
  window.quayLai = function () {
    if ($('bangThang').classList.contains('hien')) {
      $('bangThang').classList.remove('hien');
      moMan(chaCua(manHienTai) || 'manChinh');
      return true;
    }
    if (chaCua(manHienTai)) { moMan(chaCua(manHienTai)); return true; }
    return false;
  };

  // ---------- Màn chính ----------
  $('linhVat').innerHTML = hinhCanhCut(null, '#ff5c8a');
  function veNutAm() { $('nutAm').textContent = luu.caiDat.am ? '🔊' : '🔇'; }
  veNutAm();
  $('nutAm').addEventListener('click', function () { luu.caiDat.am = !luu.caiDat.am; ghiLuu(); veNutAm(); am('bam'); });
  var theMo = document.querySelectorAll('.the-mon.mo');
  for (var tm = 0; tm < theMo.length; tm++) theMo[tm].addEventListener('click', function () {
    am('bam');
    var mon = this.getAttribute('data-mon');
    if (mon === 'xephang') moMan('manCap');
    else if (window.TV.moMonHoi) window.TV.moMonHoi(mon);
  });
  var khoa = document.querySelectorAll('.the-mon.khoa');
  for (var k = 0; k < khoa.length; k++) khoa[k].addEventListener('click', function () {
    var el = this; el.style.transform = 'scale(.94)'; setTimeout(function () { el.style.transform = ''; }, 150);
  });
  var nutVe = document.querySelectorAll('[data-ve]');
  // Nút ⬅ trên màn làm giống nút Quay lại của Android (lùi về đúng màn cha)
  for (var v = 0; v < nutVe.length; v++) nutVe[v].addEventListener('click', function () { am('bam'); window.quayLai(); });

  // ---------- Chọn cấp ----------
  function tongSao(cap) { return tong(tienDo().sao[cap]); }
  function veDanhSachCap() {
    var td = tienDo(), html = '';
    for (var c = 1; c < CAP.length; c++) {
      var mo = c <= td.capMo, sao = td.sao[c] || [], xong = sao.length >= SO_VAN;
      html += '<button class="the-cap ' + (mo ? '' : 'khoa ') + (xong ? 'xong' : '') + '" data-cap="' + c + '">' +
        '<span class="so-cap">' + (mo ? c : '🔒') + '</span>' +
        '<span class="mo-ta"><b>' + CAP[c].ten + '</b><small>' + CAP[c].moTa + '</small></span>' +
        '<span class="sao-cap">' + (sao.length ? '★ ' + tongSao(c) + '/' + (SO_VAN * 3) : '') + '</span></button>';
    }
    $('dsCap').innerHTML = html;
    var ds = $('dsCap').querySelectorAll('.the-cap');
    for (var i = 0; i < ds.length; i++) ds[i].addEventListener('click', function () {
      var c = +this.getAttribute('data-cap');
      if (c > tienDo().capMo) { am('sai'); if (this.animate) this.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(8px)' }, { transform: 'translateX(0)' }], 300); return; }
      am('bam'); batDauCap(c);
    });
  }

  // ---------- Chơi ----------
  var van = { cap: 1, so: 0, ds: [], phanTu: [], chon: -1, luot: 0, toiThieu: 0, saiLienTiep: 0, xong: false, deBan: [] };

  function batDauCap(cap) {
    van.cap = cap;
    var daChoi = (tienDo().sao[cap] || []).length;
    // Chơi lại cấp đã xong: đếm ván riêng, giữ nguyên sao cũ. Xong đủ 5 ván mà nhiều sao hơn thì mới thay.
    van.choiLai = daChoi >= SO_VAN;
    van.saoLuot = [];
    van.so = van.choiLai ? 0 : daChoi;
    moMan('manChoi');
    batDauVan();
  }

  function batDauVan(dungLaiDe) {
    huyHen();
    var c = CAP[van.cap];
    van.ds = dungLaiDe ? van.deBan.slice() : van.cap === 'boMe' ? xaoDeBoMe() : taoDe(van.cap);
    van.deBan = van.ds.slice();
    van.chon = -1; van.luot = 0; van.saiLienTiep = 0; van.xong = false; van.dangDoi = false;
    van.toiThieu = soNghichThe(van.ds, c.chieu);
    $('deBai').textContent = c.chieu === 'tang' ? 'Xếp các bạn từ bé đến lớn nhé!' : 'Lần này xếp từ LỚN đến BÉ nhé!';
    var h = $('huong').children; h[0].textContent = c.chieu === 'tang' ? 'Bé' : 'Lớn'; h[2].textContent = c.chieu === 'tang' ? 'Lớn' : 'Bé';
    $('soLuot').textContent = '0';
    noi('');
    anGoiY();
    var cham = '';
    for (var i = 0; i < (van.cap === 'boMe' ? 1 : SO_VAN); i++) cham += '<span class="' + (i < van.so ? 'xong' : i === van.so ? 'dang' : '') + '"></span>';
    $('chamVan').innerHTML = cham;
    var hang = $('hang'); hang.innerHTML = '';
    van.phanTu = van.ds.map(function (so, i) {
      var el = document.createElement('div');
      el.className = 'cc';
      el.innerHTML = hinhCanhCut(so, MAU_KHAN[(so * 7 + i) % MAU_KHAN.length]);
      el.addEventListener('click', function () { chamVao(el); });
      hang.appendChild(el);
      return el;
    });
    xepViTri();
    // Ván đầu tiên bé chơi: 3 giây chưa chạm gì thì tự chỉ chỗ đổi (bé chưa đọc kịp lời dặn)
    if (van.cap === 1 && van.so === 0 && !(tienDo().sao[1] || []).length) {
      hen(function () { if (!van.luot && van.chon < 0) goiY(); }, 3000);
    }
  }

  function xepViTri() {
    var san = $('san'); if (!san || !van.phanTu.length) return;
    var w = san.clientWidth, hCao = san.clientHeight, n = van.phanTu.length;
    var o = Math.min(w * 0.96 / n, 230, hCao * 0.82 * 100 / 132); // bề rộng mỗi ô
    var le = (w - o * n) / 2;
    var rongCc = o * 0.94, caoCc = rongCc * 1.32;
    // Tảng băng cao theo cỡ cánh cụt, chân các bạn đứng giữa mặt băng
    var caoBang = Math.max(50, caoCc * 0.5), dayBang = hCao * 0.04;
    var bang = san.querySelector('.tang-bang');
    bang.style.height = caoBang + 'px';
    van.phanTu.forEach(function (el, i) {
      el.style.width = rongCc + 'px';
      el.style.left = (le + i * o + (o - rongCc) / 2) + 'px';
      el.style.bottom = (dayBang + caoBang * 0.32) + 'px';
    });
    // Điện thoại cầm dọc mà nhiều bạn: nhắc xoay ngang cho to
    $('goiYXoay').style.display = (n >= 5 && window.innerHeight > window.innerWidth && w < 600) ? 'block' : 'none';
    van.oRong = o; van.le = le;
    if (van.goiY >= 0) datMuiTen(van.goiY);
  }
  window.addEventListener('resize', xepViTri);

  function noi(chu) { $('nhanXet').textContent = chu; }

  function hieuUng(el, lop, ms) {
    el.classList.remove(lop); void el.offsetWidth; el.classList.add(lop);
    setTimeout(function () { el.classList.remove(lop); }, ms);
  }

  function dungThuTu(a, b) { return CAP[van.cap].chieu === 'tang' ? a < b : a > b; }

  function chamVao(el) {
    // Trong lúc 2 bạn đang trượt đổi chỗ thì bỏ qua chạm, kẻo chọn nhầm bạn đang đi ngang qua
    if (van.xong || van.dangDoi) return;
    var i = van.phanTu.indexOf(el);
    if (van.chon < 0) { van.chon = i; el.classList.add('chon'); am('chon'); noi(''); return; }
    if (van.chon === i) { el.classList.remove('chon'); van.chon = -1; am('bam'); return; }
    var cu = van.chon;
    van.phanTu[cu].classList.remove('chon');
    van.chon = -1;
    if (Math.abs(cu - i) !== 1) {
      // Không đứng cạnh nhau: nhắc nhẹ, chọn luôn bạn vừa chạm
      am('sai');
      noi('Chỉ đổi chỗ 2 bạn đứng cạnh nhau thôi nhé!');
      hieuUng(van.phanTu[cu], 'lac', 600);
      van.chon = i; el.classList.add('chon');
      return;
    }
    doiCho(Math.min(cu, i), Math.max(cu, i));
  }

  function doiCho(a, b) {
    var dungLuc = !dungThuTu(van.ds[a], van.ds[b]); // true = hai bạn đang ngược, đổi là đúng
    var t = van.ds[a]; van.ds[a] = van.ds[b]; van.ds[b] = t;
    var e = van.phanTu[a]; van.phanTu[a] = van.phanTu[b]; van.phanTu[b] = e;
    van.luot++;
    van.dangDoi = true;
    setTimeout(function () { van.dangDoi = false; }, 380);
    $('soLuot').textContent = van.luot;
    anGoiY();
    am('doi');
    hieuUng(van.phanTu[a], 'nhay', 420); hieuUng(van.phanTu[b], 'nhay', 420);
    xepViTri();
    if (dungLuc) {
      van.saiLienTiep = 0;
      noi(['Đúng rồi!', 'Hay lắm!', 'Tuyệt!', 'Giỏi quá!'][ngauNhien(0, 3)]);
    } else {
      van.saiLienTiep++;
      if (van.cap !== 'boMe') tienDo().sai++;
      var pa = van.phanTu[a], pb = van.phanTu[b];
      hen(function () { am('sai'); hieuUng(pa, 'lac', 600); hieuUng(pb, 'lac', 600); }, 430);
      noi(CAP[van.cap].chieu === 'tang' ? 'Ồ, bạn số bé phải đứng trước chứ! Thử lại nhé.' : 'Ồ, bạn số lớn phải đứng trước chứ! Thử lại nhé.');
      if (van.saiLienTiep >= 2) hen(goiY, 900);
    }
    if (soNghichThe(van.ds, CAP[van.cap].chieu) === 0) {
      van.xong = true;
      var kq = ghiKetQua();
      hen(function () { trinhDienThang(kq); }, 550);
    }
  }

  // ---------- Gợi ý ----------
  van.goiY = -1;
  function goiY() {
    if (van.xong) return;
    for (var i = 0; i < van.ds.length - 1; i++) {
      if (!dungThuTu(van.ds[i], van.ds[i + 1])) {
        anGoiY();
        van.goiY = i;
        van.phanTu[i].classList.add('goiy'); van.phanTu[i + 1].classList.add('goiy');
        datMuiTen(i);
        noi('Thử đổi chỗ 2 bạn đang sáng xem!');
        return;
      }
    }
  }
  function datMuiTen(i) {
    var m = $('muiTen');
    m.style.left = (van.le + (i + 1) * van.oRong) + 'px';
    m.style.bottom = '2%';
    m.style.display = 'block';
  }
  function anGoiY() {
    van.goiY = -1;
    $('muiTen').style.display = 'none';
    van.phanTu.forEach(function (el) { el.classList.remove('goiy'); });
  }
  $('nutGoiY').addEventListener('click', function () { am('bam'); goiY(); });
  $('nutLamLai').addEventListener('click', function () { if (van.xong) return; am('bam'); batDauVan(true); });

  // ---------- Đề xếp hàng của bố mẹ (lát 5) ----------
  function xaoDeBoMe() {
    var ds = CAP.boMe.ds.slice(), lan = 0;
    do {
      for (var i = ds.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = ds[i]; ds[i] = ds[j]; ds[j] = t; }
      lan++;
    } while (soNghichThe(ds, CAP.boMe.chieu) === 0 && lan < 50);
    return ds;
  }
  function choiXepHangBoMe(ds, chieu) {
    CAP.boMe = { so: ds.length, chieu: chieu, ten: 'Đề của bố mẹ', ds: ds.slice() };
    van.cap = 'boMe'; van.so = 0; van.choiLai = true; van.saoLuot = [];
    moMan('manChoi');
    batDauVan();
  }

  // ---------- Thắng ----------
  // Ghi sao ngay lúc bé xếp xong, để bé có rời màn giữa chừng thì kết quả vẫn được lưu đúng
  function ghiKetQua() {
    var sao = van.luot <= van.toiThieu ? 3 : van.luot <= van.toiThieu + 2 ? 2 : 1;
    if (van.cap === 'boMe') { // đề của bố mẹ: chỉ thưởng cá, không tính sao / cấp
      themCa(sao); ghiLuu();
      return { sao: sao, boMe: true, xongCap: true, luot: van.luot, toiThieu: van.toiThieu, cap: van.cap };
    }
    var td = tienDo();
    if (!td.sao[van.cap]) td.sao[van.cap] = [];
    td.dung++;
    van.so++;
    if (van.choiLai) {
      van.saoLuot.push(sao);
      if (van.saoLuot.length >= SO_VAN && tong(van.saoLuot) > tong(td.sao[van.cap])) td.sao[van.cap] = van.saoLuot.slice();
    } else {
      td.sao[van.cap].push(sao);
    }
    var moCapMoi = false;
    if (van.so >= SO_VAN && van.cap === td.capMo && van.cap < CAP.length - 1) { td.capMo = van.cap + 1; moCapMoi = true; }
    themCa(sao); // xếp xong được cá bằng số sao
    ghiLuu();
    return { sao: sao, moCapMoi: moCapMoi, xongCap: van.so >= SO_VAN, luot: van.luot, toiThieu: van.toiThieu, cap: van.cap };
  }

  function trinhDienThang(kq) {
    van.ketQua = kq;
    var sao = kq.sao, moCapMoi = kq.moCapMoi;
    am('thang');
    van.phanTu.forEach(function (el, i) { setTimeout(function () { el.classList.add('mua'); }, i * 80); });
    phaoGiay();
    noi('');

    hen(function () {
      var chiTiet = 'Con đổi chỗ ' + kq.luot + ' lần' + (sao < 3 ? ' (ít nhất chỉ cần ' + kq.toiThieu + ' lần)' : ' – ít nhất có thể!');
      chiTiet += '<br><span class="thuong-ca">+' + sao + ' 🐟</span>';
      if (kq.boMe) {
        moBangThang({ tieuDe: 'Con xếp xong đề của bố mẹ!', sao: sao, chiTiet: chiTiet, chuTiep: 'Ra đề mới ▶', chuCap: 'Về màn chính',
          tiep: function () { moMan('manRaDe'); }, chonCap: function () { moMan('manChinh'); } });
        return;
      }
      if (kq.xongCap) chiTiet += moCapMoi ? '<br>🎉 Con đã mở ' + CAP[van.cap + 1].ten + '!' : '<br>🎉 Con đã xong ' + CAP[van.cap].ten + '!';
      moBangThang({
        tieuDe: sao === 3 ? 'Xuất sắc!' : sao === 2 ? 'Giỏi quá!' : 'Xếp xong rồi!',
        sao: sao, chiTiet: chiTiet,
        chuTiep: kq.xongCap ? (van.cap < CAP.length - 1 ? 'Sang ' + CAP[van.cap + 1].ten + ' ▶' : 'Chơi lại ▶') : 'Ván tiếp ▶',
        tiep: function () {
          if (kq.xongCap) { batDauCap(van.cap < CAP.length - 1 ? van.cap + 1 : van.cap); }
          else { moMan('manChoi'); batDauVan(); }
        },
        chonCap: function () { moMan('manCap'); }
      });
    }, 1300);
  }
  $('nutTiep').addEventListener('click', function () {
    am('bam');
    $('bangThang').classList.remove('hien');
    if (bang.tiep) bang.tiep();
  });
  $('nutChonCap').addEventListener('click', function () {
    am('bam');
    $('bangThang').classList.remove('hien');
    if (bang.chonCap) bang.chonCap();
  });

  function phaoGiay() {
    var hop = $('phaoGiay'), mau = ['#ff5c8a', '#ffd23f', '#2ec4b6', '#8e7dff', '#4cc9f0', '#ff7f3f'];
    for (var i = 0; i < 46; i++) {
      var p = document.createElement('i');
      p.style.left = Math.random() * 100 + '%';
      p.style.background = mau[i % mau.length];
      p.style.animationDuration = (1.6 + Math.random() * 1.4) + 's';
      p.style.animationDelay = (Math.random() * 0.4) + 's';
      hop.appendChild(p);
    }
    setTimeout(function () { hop.innerHTML = ''; }, 3600);
  }

  veSoCa();

  // Lõi dùng chung cho hoi.js
  window.TV = {
    $: $, am: am, hen: hen, huyHen: huyHen, tong: tong, ngauNhien: ngauNhien,
    hinhCanhCut: hinhCanhCut, MAU_KHAN: MAU_KHAN, phaoGiay: phaoGiay, hieuUng: hieuUng,
    moMan: moMan, khiMoMan: khiMoMan, moBangThang: moBangThang,
    beHienTai: beHienTai, ghiLuu: ghiLuu, themCa: themCa,
    luu: function () { return luu; }, veNutAm: veNutAm, chuanHoa: chuanHoa, chaDong: chaDong, choiXepHangBoMe: choiXepHangBoMe,
    manHienTai: function () { return manHienTai; }
  };
  // Cho phiên kiểm thử đọc trạng thái (không ảnh hưởng game)
  window.__toanVui = { van: van, luu: function () { return luu; } };
})();
