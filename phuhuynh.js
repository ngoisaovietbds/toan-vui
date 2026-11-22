/* Toán Vui Cùng Bố Mẹ – lát 4: Góc bố mẹ và giới hạn thời gian chơi mỗi ngày.
 * Khoá trẻ em bằng một phép nhân người lớn (bảng 6–9), gõ bằng bàn phím số riêng của game.
 * Thời gian chỉ tính khi app đang hiện trên màn hình và không ở Góc bố mẹ. */
(function () {
  'use strict';
  var TV = window.TV, $ = TV.$, am = TV.am, ng = TV.ngauNhien;
  var TEN_MON = { xephang: 'Xếp hàng', dem: 'Đếm cá', lonbe: 'Lớn – bé', sothieu: 'Số còn thiếu', congtru: 'Cộng trừ', nhanchia: 'Nhân chia' };
  var SO_CAP = { xephang: 4, dem: 3, lonbe: 3, sothieu: 4, congtru: 4, nhanchia: 6 };
  var NHIP = 5; // giây giữa 2 lần cộng giờ chơi

  function ngayHom(d) {
    d = d || new Date();
    return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
  }
  function giayHomNay() { return TV.beHienTai().thoiGian[ngayHom()] || 0; }
  function phutThem() { var t = TV.beHienTai().themPhut; return t.ngay === ngayHom() ? t.phut : 0; }
  function gioiHanGiay() { var g = TV.luu().caiDat.gioiHan; return g > 0 ? (g + phutThem()) * 60 : 0; }

  // ---------- Khoá trẻ em ----------
  var cua = { dung: 0, nhap: '', khiDung: null };
  function moCuaBoMe(khiDung) {
    cua.khiDung = khiDung;
    taoCauBoMe();
    $('cuaBoMe').classList.add('hien');
  }
  function taoCauBoMe() {
    var a = ng(6, 9), b = ng(6, 9);
    cua.dung = a * b; cua.nhap = '';
    $('cauBoMe').textContent = a + ' × ' + b + ' = ?';
    veNhap();
  }
  function veNhap() { $('oNhapBoMe').textContent = cua.nhap || ' '; }
  (function veBanPhim() {
    var h = '';
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '⌫', '0', 'OK'].forEach(function (k) { h += '<button data-phim="' + k + '">' + k + '</button>'; });
    $('banPhimBoMe').innerHTML = h;
    var ds = $('banPhimBoMe').querySelectorAll('button');
    for (var i = 0; i < ds.length; i++) ds[i].addEventListener('click', function () {
      var k = this.getAttribute('data-phim');
      am('bam');
      if (k === '⌫') cua.nhap = cua.nhap.slice(0, -1);
      else if (k === 'OK') {
        if (+cua.nhap === cua.dung && cua.nhap !== '') {
          $('cuaBoMe').classList.remove('hien');
          var f = cua.khiDung; cua.khiDung = null;
          if (f) f();
          return;
        }
        am('sai'); TV.hieuUng($('oNhapBoMe'), 'lac-ngang', 320); taoCauBoMe(); return;
      } else if (cua.nhap.length < 3) cua.nhap += k;
      veNhap();
    });
  })();
  $('nutHuyBoMe').addEventListener('click', function () { am('bam'); cua.khiDung = null; $('cuaBoMe').classList.remove('hien'); });
  $('nutBoMe').addEventListener('click', function () { am('bam'); moCuaBoMe(function () { TV.moMan('manPhuHuynh'); }); });

  // ---------- Giới hạn thời gian ----------
  var daNhac = false;
  function demGio() {
    if (document.visibilityState === 'hidden') return;
    if (TV.manHienTai() === 'manPhuHuynh' || $('manHetGio').classList.contains('hien')) return;
    var be = TV.beHienTai(), n = ngayHom();
    be.thoiGian[n] = (be.thoiGian[n] || 0) + NHIP;
    // Giữ 14 ngày gần nhất cho gọn bộ nhớ
    var cacNgay = Object.keys(be.thoiGian).filter(function (k) { return k !== n; }).sort();
    while (cacNgay.length > 13) delete be.thoiGian[cacNgay.shift()];
    TV.ghiLuu();
    kiemTraGio();
  }
  function kiemTraGio() {
    var gh = gioiHanGiay();
    if (!gh) { daNhac = false; return; }
    var con = gh - giayHomNay();
    if (con <= 0) { moHetGio(); return; }
    if (con <= 120 && !daNhac) {
      daNhac = true;
      var nh = $('nhacGio'); nh.textContent = '⏰ Còn 2 phút nữa là nghỉ nhé!'; nh.classList.add('hien');
      setTimeout(function () { nh.classList.remove('hien'); }, 5000);
    }
    if (con > 120) daNhac = false;
  }
  function moHetGio() {
    if ($('manHetGio').classList.contains('hien')) return;
    TV.huyHen();
    $('bangThang').classList.remove('hien');
    $('ccNgu').innerHTML = TV.hinhCuaBe ? TV.hinhCuaBe('#8e7dff') : TV.hinhCanhCut(null, '#8e7dff');
    var phut = Math.round(giayHomNay() / 60);
    $('loiHetGio').textContent = 'Hôm nay con đã chơi ' + phut + ' phút rồi. Cánh cụt cũng đi ngủ đây, mai mình chơi tiếp nhé! 💤';
    $('manHetGio').classList.add('hien');
    TV.moMan('manChinh');
  }
  $('nutMoThem').addEventListener('click', function () {
    am('bam');
    moCuaBoMe(function () {
      var be = TV.beHienTai(), n = ngayHom();
      if (be.themPhut.ngay !== n) be.themPhut = { ngay: n, phut: 0 };
      // Mở thêm tính từ lúc này: đủ để còn 10 phút
      var canThem = Math.ceil((giayHomNay() + 600) / 60) - TV.luu().caiDat.gioiHan;
      be.themPhut.phut = Math.max(be.themPhut.phut + 10, canThem);
      TV.ghiLuu();
      daNhac = false;
      $('manHetGio').classList.remove('hien');
    });
  });
  setInterval(demGio, NHIP * 1000);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'visible') kiemTraGio(); });
  setTimeout(kiemTraGio, 300); // mở app lúc đã hết giờ thì khoá luôn

  // Nút Quay lại của Android khi đang mở khoá trẻ em / màn hết giờ
  var quayLaiGoc = window.quayLai;
  window.quayLai = function () {
    if ($('cuaBoMe').classList.contains('hien')) { cua.khiDung = null; $('cuaBoMe').classList.remove('hien'); return true; }
    if ($('manHetGio').classList.contains('hien')) return false; // hết giờ: Quay lại thì thoát app
    return quayLaiGoc();
  };

  // ---------- Màn Góc bố mẹ ----------
  TV.khiMoMan.manPhuHuynh = veGocBoMe;
  function veGocBoMe() {
    var be = TV.beHienTai(), cd = TV.luu().caiDat;
    // Thời gian 7 ngày
    var hom = new Date(), cot = '', max = 1, ds = [];
    for (var i = 6; i >= 0; i--) {
      var d = new Date(hom.getFullYear(), hom.getMonth(), hom.getDate() - i);
      var p = Math.round((be.thoiGian[ngayHom(d)] || 0) / 60);
      ds.push({ nhan: i === 0 ? 'Nay' : ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2), p: p });
      if (p > max) max = p;
    }
    ds.forEach(function (x) {
      cot += '<div class="cot-ngay"><span class="so-phut">' + x.p + '</span><i style="height:' + Math.max(3, x.p / max * 100) + '%"></i><b>' + x.nhan + '</b></div>';
    });
    var homNay = Math.round(giayHomNay() / 60), tong7 = ds.reduce(function (a, x) { return a + x.p; }, 0);
    $('phThoiGian').innerHTML = '<p class="ph-lon">Hôm nay: <b>' + homNay + ' phút</b>' +
      (cd.gioiHan ? ' / ' + (cd.gioiHan + phutThem()) + ' phút' : ' (không giới hạn)') + '</p>' +
      '<div class="bieu-do-ngay">' + cot + '</div><p class="ph-ghi">7 ngày qua: ' + tong7 + ' phút, trung bình ' + Math.round(tong7 / 7) + ' phút/ngày.</p>';

    // Kết quả từng màn
    var bang = '<table class="bang-ph"><tr><th>Màn</th><th>Cấp</th><th>Đúng</th><th>Chọn lại</th><th>Tỉ lệ đúng</th></tr>', yeu = null;
    Object.keys(TEN_MON).forEach(function (m) {
      var t = be.mon[m], tong = t.dung + t.sai, tl = tong ? Math.round(t.dung / tong * 100) : null;
      if (m === 'xephang') { // xếp hàng: dung = số ván xong, sai = lần đổi sai
        bang += '<tr><td>' + TEN_MON[m] + '</td><td>' + t.capMo + '/' + SO_CAP[m] + '</td><td>' + t.dung + ' ván</td><td>' + t.sai + ' lần đổi sai</td><td>–</td></tr>';
        return;
      }
      bang += '<tr><td>' + TEN_MON[m] + '</td><td>' + t.capMo + '/' + SO_CAP[m] + '</td><td>' + t.dung + '</td><td>' + t.sai + '</td><td>' + (tl === null ? '–' : tl + '%') + '</td></tr>';
      if (tong >= 10 && (!yeu || tl < yeu.tl)) yeu = { m: m, tl: tl };
    });
    bang += '</table>';
    bang += yeu && yeu.tl < 85 ? '<p class="ph-goi-y">💡 Nên luyện thêm: <b>' + TEN_MON[yeu.m] + '</b> (tỉ lệ đúng ' + yeu.tl + '%).</p>'
      : '<p class="ph-ghi">Chơi thêm vài ván để game biết bé cần luyện phần nào.</p>';
    bang += '<p class="ph-ghi">🐟 Cá đang có: <b>' + be.ca + '</b></p>';
    var yeuNc = TV.thuoc ? TV.thuoc.dsYeu(6) : [];
    if (yeuNc.length) bang += '<p class="ph-goi-y">🔁 Phép nhân chia bé hay vấp (game đang cho ra lại nhiều hơn): <b>' + yeuNc.join(' · ') + '</b></p>';
    if (be.phanXa && be.phanXa.lan) bang += '<p class="ph-ghi">⚡ Phản xạ nhanh: chơi ' + be.phanXa.lan + ' lần, kỷ lục <b>' + be.phanXa.kyLuc + '</b> câu/phút.</p>';
    $('phKetQua').innerHTML = bang;

    // Chỉnh cấp
    var cc = '';
    Object.keys(TEN_MON).forEach(function (m) {
      cc += '<label class="dong-ph"><span>' + TEN_MON[m] + '</span><select data-mon="' + m + '">';
      for (var c = 1; c <= SO_CAP[m]; c++) cc += '<option value="' + c + '"' + (be.mon[m].capMo === c ? ' selected' : '') + '>Mở đến Cấp ' + c + '</option>';
      cc += '</select></label>';
    });
    $('phChinhCap').innerHTML = cc;
    var sel = $('phChinhCap').querySelectorAll('select');
    for (var s = 0; s < sel.length; s++) sel[s].addEventListener('change', function () {
      TV.beHienTai().mon[this.getAttribute('data-mon')].capMo = +this.value; TV.ghiLuu();
    });

    // Cài đặt
    var gh = '';
    [0, 10, 15, 20, 30, 45, 60].forEach(function (p) { gh += '<option value="' + p + '"' + (cd.gioiHan === p ? ' selected' : '') + '>' + (p ? p + ' phút' : 'Không giới hạn') + '</option>'; });
    $('phCaiDat').innerHTML = '<label class="dong-ph"><span>Giới hạn mỗi ngày</span><select id="chonGioiHan">' + gh + '</select></label>' +
      '<label class="dong-ph"><span>Âm thanh</span><button class="nut phu nho" id="nutAmPh">' + (cd.am ? '🔊 Đang bật' : '🔇 Đang tắt') + '</button></label>' +
      '<label class="dong-ph"><span>Giọng bố mẹ đọc<br><small class="ph-ghi">Đã thu ' + (TV.giong ? TV.giong.soCau() + '/' + TV.giong.tongCau : '0') + ' câu</small></span>' +
      '<button class="nut phu nho" id="nutGiongPh">' + (cd.giong !== false ? '🗣 Đang bật' : '🤐 Đang tắt') + '</button></label>';
    $('chonGioiHan').addEventListener('change', function () { TV.luu().caiDat.gioiHan = +this.value; TV.ghiLuu(); daNhac = false; veGocBoMe(); });
    $('nutAmPh').addEventListener('click', function () { cd.am = !cd.am; TV.ghiLuu(); TV.veNutAm(); am('bam'); veGocBoMe(); });
    $('nutGiongPh').addEventListener('click', function () { cd.giong = cd.giong === false; TV.ghiLuu(); am('bam'); veGocBoMe(); });
    datLaiNutXoa();
  }

  // Xoá tiến độ: bấm 2 lần trong 5 giây
  var choXoa = null;
  function datLaiNutXoa() { clearTimeout(choXoa); choXoa = null; $('nutXoaTienDo').textContent = 'Xoá tiến độ'; $('nutXoaTienDo').classList.remove('canh-bao'); }
  $('nutXoaTienDo').addEventListener('click', function () {
    am('bam');
    if (!choXoa) {
      this.textContent = 'Bấm lần nữa để xoá hẳn'; this.classList.add('canh-bao');
      choXoa = setTimeout(datLaiNutXoa, 5000);
      return;
    }
    var L = TV.luu(), beCu = L.be[L.beDangChoi];
    L.be[L.beDangChoi] = { ten: '', mon: {}, thoiGian: beCu.thoiGian, themPhut: beCu.themPhut };
    TV.chuanHoa(L);
    TV.ghiLuu();
    datLaiNutXoa();
    veGocBoMe();
    var nh = $('nhacGio'); nh.textContent = 'Đã xoá tiến độ của bé.'; nh.classList.add('hien');
    setTimeout(function () { nh.classList.remove('hien'); }, 3000);
  });

  TV.moCuaBoMe = moCuaBoMe;   // dùng chung cho Bố mẹ ra đề, Đối kháng (rà lát 5)
  window.__toanVuiPH = { ngayHom: ngayHom, demGio: demGio, kiemTraGio: kiemTraGio, cua: cua };
})();
