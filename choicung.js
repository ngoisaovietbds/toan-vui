/* Toán Vui Cùng Bố Mẹ – lát 5: chơi cùng bố mẹ.
 * 1) Bố mẹ ra đề: gõ phép tính (bé chọn đáp án) hoặc dãy số (bé xếp hàng cánh cụt).
 * 2) Đối kháng 2 người: chia đôi màn hình, nửa trên quay ngược cho bố mẹ ngồi đối diện.
 *    Mỗi bên một câu riêng, đề của bố mẹ khó hơn một cấp. Ai đúng trước thì được điểm. 10 câu. */
(function () {
  'use strict';
  var TV = window.TV, $ = TV.$, am = TV.am, hen = TV.hen;
  function thoat(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function bao(chu) { var nh = $('nhacGio'); nh.textContent = chu; nh.classList.add('hien'); setTimeout(function () { nh.classList.remove('hien'); }, 2600); }

  // =====================================================================
  //  1) Bố mẹ ra đề
  // =====================================================================
  var raDe = { tab: 'pt', nhap: '', ds: [], day: '', chieu: 'tang' };
  var TOI_DA_CAU = 10;

  function vePhim(id, phim, khiBam) {
    var h = '';
    phim.forEach(function (k) { h += '<button data-k="' + thoat(k) + '"' + (/[+−×:,]/.test(k) ? ' class="phim-dau"' : '') + '>' + thoat(k) + '</button>'; });
    $(id).innerHTML = h;
    var ds = $(id).querySelectorAll('button');
    for (var i = 0; i < ds.length; i++) ds[i].addEventListener('click', function () { am('bam'); khiBam(this.getAttribute('data-k')); });
  }
  vePhim('phimPhepTinh', ['7', '8', '9', '+', '4', '5', '6', '−', '1', '2', '3', '×', '⌫', '0', ':', 'C'], function (k) {
    if (k === '⌫') raDe.nhap = raDe.nhap.slice(0, -1);
    else if (k === 'C') raDe.nhap = '';
    else if (/[+−×:]/.test(k)) { if (/^\d+$/.test(raDe.nhap)) raDe.nhap += k; }
    else { var m = raDe.nhap.match(/(\d*)$/)[1]; if (m.length < 3) raDe.nhap += k; }
    veRaDe();
  });
  vePhim('phimDaySo', ['7', '8', '9', '4', '5', '6', '1', '2', '3', '⌫', '0', ','], function (k) {
    if (k === '⌫') raDe.day = raDe.day.slice(0, -1);
    else if (k === ',') { if (/\d$/.test(raDe.day) && raDe.day.split(',').length < 8) raDe.day += ','; }
    else { var m = raDe.day.match(/(\d*)$/)[1]; if (m.length < 3) raDe.day += k; }
    veRaDe();
  });

  // Đọc "8+5" → {a, dau, b, kq}; trả về chuỗi lỗi nếu phép tính không hợp lệ cho bé
  function docPhepTinh(s) {
    var m = s.match(/^(\d{1,3})([+−×:])(\d{1,3})$/);
    if (!m) return 'Gõ đủ: số, dấu, số. Ví dụ 8 + 5';
    var a = +m[1], dau = m[2], b = +m[3], kq;
    if (dau === '+') kq = a + b;
    else if (dau === '−') { if (b > a) return 'Phép trừ cho bé: số trước phải lớn hơn hoặc bằng số sau'; kq = a - b; }
    else if (dau === '×') kq = a * b;
    else { if (b === 0) return 'Không chia được cho 0'; if (a % b) return 'Phép chia phải chia hết để bé làm được'; kq = a / b; }
    if (kq > 999) return 'Kết quả lớn quá (tối đa 999)';
    return { a: a, dau: dau, b: b, kq: kq };
  }

  function veRaDe() {
    var laPt = raDe.tab === 'pt';
    $('tabPhepTinh').classList.toggle('chon', laPt); $('tabDaySo').classList.toggle('chon', !laPt);
    $('khungPhepTinh').style.display = laPt ? '' : 'none'; $('khungDaySo').style.display = laPt ? 'none' : '';
    $('manHinhPt').textContent = raDe.nhap.replace(/([+−×:])/, ' $1 ') || ' ';
    var h = '';
    raDe.ds.forEach(function (pt, i) { h += '<span class="the-de">' + pt.a + ' ' + pt.dau + ' ' + pt.b + '<button data-xoa="' + i + '" aria-label="Xoá">✕</button></span>'; });
    $('dsDeBoMe').innerHTML = h || '<span class="ph-ghi">Chưa có câu nào. Gõ phép tính rồi bấm "Thêm câu".</span>';
    var x = $('dsDeBoMe').querySelectorAll('[data-xoa]');
    for (var i = 0; i < x.length; i++) x[i].addEventListener('click', function () { am('bam'); raDe.ds.splice(+this.getAttribute('data-xoa'), 1); veRaDe(); });
    $('demDeBoMe').textContent = raDe.ds.length + '/' + TOI_DA_CAU;
    $('nutGiaiDe').disabled = !raDe.ds.length;
    $('manHinhDay').textContent = raDe.day.split(',').join(', ') || ' ';
    $('chieuTang').classList.toggle('chon', raDe.chieu === 'tang'); $('chieuGiam').classList.toggle('chon', raDe.chieu === 'giam');
  }
  $('tabPhepTinh').addEventListener('click', function () { am('bam'); raDe.tab = 'pt'; veRaDe(); });
  $('tabDaySo').addEventListener('click', function () { am('bam'); raDe.tab = 'day'; veRaDe(); });
  $('chieuTang').addEventListener('click', function () { am('bam'); raDe.chieu = 'tang'; veRaDe(); });
  $('chieuGiam').addEventListener('click', function () { am('bam'); raDe.chieu = 'giam'; veRaDe(); });
  $('nutThemCau').addEventListener('click', function () {
    var pt = docPhepTinh(raDe.nhap);
    if (typeof pt === 'string') { am('sai'); bao(pt); return; }
    if (raDe.ds.length >= TOI_DA_CAU) { am('sai'); bao('Tối đa ' + TOI_DA_CAU + ' câu một lần'); return; }
    am('chon'); raDe.ds.push(pt); raDe.nhap = ''; veRaDe();
  });
  $('nutGiaiDe').addEventListener('click', function () {
    if (!raDe.ds.length) return;
    am('bam'); TV.choiDeBoMe(raDe.ds.slice());
  });
  $('nutXepDay').addEventListener('click', function () {
    var ds = raDe.day.split(',').filter(function (x) { return x !== ''; }).map(Number);
    var khac = ds.filter(function (x, i) { return ds.indexOf(x) === i; });
    if (ds.length < 3) { am('sai'); bao('Cần ít nhất 3 số, cách nhau bằng dấu phẩy'); return; }
    if (khac.length !== ds.length) { am('sai'); bao('Các số phải khác nhau'); return; }
    am('bam'); TV.choiXepHangBoMe(ds, raDe.chieu);
  });
  TV.khiMoMan.manRaDe = veRaDe;

  // =====================================================================
  //  2) Đối kháng 2 người
  // =====================================================================
  var MON_DK = [['congtru', 'Cộng trừ'], ['nhanchia', 'Nhân chia'], ['lonbe', 'Lớn – bé'], ['sothieu', 'Số còn thiếu']];
  var SO_LUOT = 10;
  var dk = { mon: 'congtru', capBe: 1, luot: 0, diem: { be: 0, bm: 0 }, cau: {}, khoaBen: {}, xong: false };

  function capToiDa(mon) { return TV.MON_HOI[mon].CAP.length - 1; }
  function capBoMe() { return Math.min(dk.capBe + 1, capToiDa(dk.mon)); }

  function veCaiDatDk() {
    $('dkChoi').style.display = 'none'; $('dkCaiDat').style.display = '';
    var h = '';
    MON_DK.forEach(function (x) { h += '<button class="chip' + (dk.mon === x[0] ? ' chon' : '') + '" data-mon="' + x[0] + '">' + x[1] + '</button>'; });
    $('dkChonMon').innerHTML = h;
    var c = '';
    for (var i = 1; i <= capToiDa(dk.mon); i++) c += '<button class="chip' + (dk.capBe === i ? ' chon' : '') + '" data-cap="' + i + '">Cấp ' + i + '</button>';
    $('dkChonCap').innerHTML = c;
    $('dkGhiCap').textContent = 'Đề của bố mẹ: Cấp ' + capBoMe() + (capBoMe() === dk.capBe ? ' (đã là cấp cao nhất)' : ' (khó hơn con một cấp)');
    var m = $('dkChonMon').querySelectorAll('[data-mon]');
    for (var j = 0; j < m.length; j++) m[j].addEventListener('click', function () {
      am('bam'); dk.mon = this.getAttribute('data-mon');
      dk.capBe = Math.min(TV.beHienTai().mon[dk.mon].capMo, capToiDa(dk.mon)); veCaiDatDk();
    });
    var cc = $('dkChonCap').querySelectorAll('[data-cap]');
    for (var k = 0; k < cc.length; k++) cc[k].addEventListener('click', function () { am('bam'); dk.capBe = +this.getAttribute('data-cap'); veCaiDatDk(); });
  }
  TV.khiMoMan.manDoiKhang = function () {
    dk.capBe = Math.min(TV.beHienTai().mon[dk.mon].capMo, capToiDa(dk.mon));
    veCaiDatDk();
  };
  $('dkBatDau').addEventListener('click', function () { am('bam'); batDauDk(); });

  function batDauDk() {
    dk.luot = 0; dk.diem = { be: 0, bm: 0 }; dk.xong = false;
    $('dkCaiDat').style.display = 'none'; $('dkChoi').style.display = '';
    luotMoi();
  }
  function luotMoi() {
    TV.huyHen();
    dk.khoaBen = { be: false, bm: false }; dk.daCoNguoi = false;
    var m = TV.MON_HOI[dk.mon];
    dk.cau.be = m.taoCau(dk.capBe);
    do { dk.cau.bm = m.taoCau(capBoMe()); } while (dk.cau.bm.khoa === dk.cau.be.khoa);
    $('dkLuot').textContent = 'Câu ' + (dk.luot + 1) + '/' + SO_LUOT;
    veBen('be'); veBen('bm');
  }
  function veBen(ben) {
    var q = dk.cau[ben], o = $(ben === 'be' ? 'dkDuoi' : 'dkTren');
    var h = '<div class="dk-dau"><span class="dk-ten">' + (ben === 'be' ? '🧒 Con' : '👪 Bố mẹ') + '</span><span class="dk-diem">' + dk.diem[ben] + '</span></div>' +
      '<div class="dk-de">' + thoat(q.chu) + '</div><div class="dk-nut">';
    q.dapAn.forEach(function (d) { h += '<button class="nut-dap" data-dap="' + thoat(d) + '"><b>' + thoat(d) + '</b></button>'; });
    o.innerHTML = h + '</div>';
    var nut = o.querySelectorAll('.nut-dap');
    for (var i = 0; i < nut.length; i++) nut[i].addEventListener('click', function () { chonDk(ben, this); });
  }
  function chonDk(ben, nut) {
    if (dk.xong || dk.daCoNguoi || dk.khoaBen[ben] || nut.disabled) return;
    var q = dk.cau[ben], o = $(ben === 'be' ? 'dkDuoi' : 'dkTren');
    if (nut.getAttribute('data-dap') === String(q.dung)) {
      dk.daCoNguoi = true;
      nut.classList.add('dung'); am('chon');
      dk.diem[ben]++;
      o.querySelector('.dk-diem').textContent = dk.diem[ben];
      o.classList.add('thang-luot');
      if (ben === 'be') TV.themCa(1);
      // Bên kia: hiện đáp án đúng của họ
      var benKia = ben === 'be' ? 'bm' : 'be', oKia = $(benKia === 'be' ? 'dkDuoi' : 'dkTren');
      var dungKia = oKia.querySelector('.nut-dap[data-dap="' + String(dk.cau[benKia].dung).replace(/"/g, '\\"') + '"]');
      if (dungKia) dungKia.classList.add('goi-dung');
      dk.luot++;
      TV.ghiLuu();
      hen(function () {
        o.classList.remove('thang-luot');
        if (dk.luot >= SO_LUOT) ketThucDk(); else luotMoi();
      }, 1300);
    } else {
      nut.classList.add('sai'); nut.disabled = true; am('sai');
      dk.khoaBen[ben] = true; o.classList.add('bi-khoa');   // chọn sai: chờ 1,2 giây mới được chọn tiếp
      hen(function () { dk.khoaBen[ben] = false; o.classList.remove('bi-khoa'); }, 1200);
    }
  }
  function ketThucDk() {
    dk.xong = true;
    var be = dk.diem.be, bm = dk.diem.bm;
    var tieuDe = be > bm ? 'Con thắng rồi! 🏆' : be < bm ? 'Bố mẹ thắng!' : 'Hoà nhau!';
    if (be > bm) TV.phaoGiay();
    am('thang');
    TV.moBangThang({
      tieuDe: tieuDe, sao: be > bm ? 3 : be === bm ? 2 : 1,
      chiTiet: 'Con ' + be + ' – ' + bm + ' Bố mẹ<br><span class="thuong-ca">+' + be + ' 🐟</span>' + (be < bm ? '<br>Lần sau con phục thù nhé!' : ''),
      chuTiep: 'Chơi lại ▶', chuCap: 'Về màn chính',
      tiep: function () { TV.moMan('manDoiKhang'); batDauDk(); },
      chonCap: function () { TV.moMan('manChinh'); }
    });
  }
  // Đang chơi đối kháng mà bấm Quay lại: về màn chọn trước, rồi mới ra màn chính
  TV.chaDong.manDoiKhang = function () {
    if ($('dkChoi').style.display !== 'none') { TV.huyHen(); dk.xong = true; setTimeout(veCaiDatDk, 0); return 'manDoiKhang'; }
    return null;
  };

  window.__toanVuiCC = { raDe: raDe, dk: dk, docPhepTinh: docPhepTinh };
})();
(function () {
  var TV = window.TV;
  document.getElementById('nutRaDe').addEventListener('click', function () { TV.am('bam'); TV.moCuaBoMe(function () { TV.moMan('manRaDe'); }); });
  document.getElementById('nutDoiKhang').addEventListener('click', function () { TV.am('bam'); TV.moCuaBoMe(function () { TV.moMan('manDoiKhang'); }); });
})();
