/* Toán Vui Cùng Bố Mẹ – các màn hỏi–đáp: Đếm, Lớn–bé–bằng, Số còn thiếu (lát 2).
 * Dùng lõi chung window.TV (game.js). Mỗi cấp 10 câu. Sai thì làm lại đúng câu đó, không mất câu đã đúng.
 * Sai 2 lần một câu thì hiện gợi ý. Câu đúng ngay lần đầu được 1 cá. */
(function () {
  'use strict';
  var TV = window.TV, $ = TV.$, am = TV.am, hen = TV.hen, ng = TV.ngauNhien;
  var SO_CAU = 10;   // số câu mỗi cấp; đề của bố mẹ thì bằng số câu bố mẹ ra

  function tron(ds) { for (var i = ds.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = ds[i]; ds[i] = ds[j]; ds[j] = t; } return ds; }
  var MAU_CA = ['#ff9f1c', '#ff5c8a', '#4cc9f0', '#8e7dff', '#2ec4b6', '#ffb703'];
  function hinhCa(mau) {
    return '<svg viewBox="0 0 64 40" aria-hidden="true"><path d="M48 20 L63 7 L63 33 Z" fill="' + mau + '"/>' +
      '<ellipse cx="29" cy="20" rx="24" ry="14" fill="' + mau + '"/>' +
      '<path d="M31 7 Q38 20 31 33" stroke="rgba(255,255,255,.55)" stroke-width="2.5" fill="none"/>' +
      '<circle cx="15" cy="16" r="3.4" fill="#1b2438"/><circle cx="16" cy="15" r="1.1" fill="#fff"/></svg>';
  }
  // Chọn đáp án nhiễu quanh đáp án đúng, không trùng, không âm, không vượt trần
  function dapAnNhieu(dung, buocs, tran, tranh) {
    var ds = [dung], lan = 0;
    tranh = tranh || [];
    while (ds.length < 4 && lan < 100) {
      lan++;
      var b = buocs[ng(0, buocs.length - 1)] * (Math.random() < 0.5 ? -1 : 1);
      var x = dung + b;
      if (x >= 0 && x <= tran && ds.indexOf(x) < 0 && tranh.indexOf(x) < 0) ds.push(x);
    }
    for (var y = 0; ds.length < 4 && y <= tran; y++) if (ds.indexOf(y) < 0 && tranh.indexOf(y) < 0) ds.push(y);
    return tron(ds);
  }

  // =====================================================================
  //  Các màn. Mỗi màn: ten, loiDan, CAP[cap] = {ten, moTa}, taoCau(cap) → câu.
  //  Câu: { khoa, de, ve(san), dapAn: [..], dung, goiY(san), khiDung(san) }
  // =====================================================================
  var MON = {};

  // ---------- B. Đếm cá ----------
  MON.dem = {
    ten: 'Đếm cá', loiDan: 'Đếm xem có bao nhiêu con cá. Chạm vào từng con để đánh dấu cho dễ đếm nhé!',
    CAP: [null,
      { ten: 'Cấp 1', moTa: 'Đếm đến 10' },
      { ten: 'Cấp 2', moTa: 'Đếm đến 20' },
      { ten: 'Cấp 3', moTa: 'Đếm theo chục, đến 100' }],
    taoCau: function (cap) {
      var n, chuc = 0, le = 0;
      if (cap === 1) n = ng(1, 10);
      else if (cap === 2) n = ng(11, 20);
      else { chuc = ng(2, 9); le = ng(0, 9); n = chuc * 10 + le; }
      var mau = MAU_CA[ng(0, MAU_CA.length - 1)];
      return {
        khoa: 'dem' + n, de: 'Có bao nhiêu con cá?',
        dapAn: dapAnNhieu(n, cap === 3 ? [10, 1, 2] : [1, 2, 3], cap === 1 ? 12 : cap === 2 ? 25 : 99, [0]),
        dung: n,
        ve: function (san) {
          var html = '';
          if (cap === 1) {
            // Cá rải ngẫu nhiên trong lưới 5×4, lệch nhẹ cho tự nhiên
            var o = tron(Array.apply(null, Array(20)).map(function (_, i) { return i; })).slice(0, n);
            html = '<div class="be-ca luoi-ca">';
            for (var i = 0; i < 20; i++) {
              html += o.indexOf(i) >= 0
                ? '<button class="ca" data-gt="1" style="transform:translate(' + ng(-12, 12) + '%,' + ng(-12, 12) + '%) rotate(' + ng(-12, 12) + 'deg)">' + hinhCa(mau) + '</button>'
                : '<span class="o-trong"></span>';
            }
            html += '</div>';
          } else if (cap === 2) {
            // Xếp theo khung 10 (2 hàng × 5) cho bé đếm theo nhóm
            html = '<div class="be-ca khung-muoi">';
            for (var k = 0; k < n; k++) {
              if (k === 10) html += '</div><div class="be-ca khung-muoi">';
              html += '<button class="ca" data-gt="1">' + hinhCa(mau) + '</button>';
            }
            html += '</div>';
            html = '<div class="hai-khung">' + html + '</div>';
          } else {
            html = '<div class="be-ca hang-chuc">';
            for (var c = 0; c < chuc; c++) {
              html += '<button class="xau" data-gt="10">';
              for (var m = 0; m < 10; m++) html += hinhCa(mau);
              html += '</button>';
            }
            html += '<div class="ca-le">';
            for (var l = 0; l < le; l++) html += '<button class="ca" data-gt="1">' + hinhCa(mau) + '</button>';
            html += '</div></div><p class="chu-nho">Mỗi xâu có 10 con cá</p>';
          }
          san.innerHTML = html;
          ganDanhDau(san);
        },
        goiY: function (san) {
          // Tự đánh dấu lần lượt để bé thấy cách đếm
          var ds = san.querySelectorAll('[data-gt]');
          for (var i = 0; i < ds.length; i++) ds[i].classList.remove('da-dem');
          var cu = san.querySelectorAll('.nhan-dem');
          for (var x = 0; x < cu.length; x++) cu[x].remove();
          san.__thuTu = [];
          for (var j = 0; j < ds.length; j++) (function (el, j) {
            hen(function () { danhDau(san, el, true); }, 250 * j);
          })(ds[j], j);
          return 'Cùng đếm từng con nhé!';
        }
      };
    }
  };
  // Chạm vào cá / xâu cá để đánh dấu: hiện số đếm cộng dồn
  function ganDanhDau(san) {
    san.__thuTu = [];
    var ds = san.querySelectorAll('[data-gt]');
    for (var i = 0; i < ds.length; i++) ds[i].addEventListener('click', function () { am('bam'); danhDau(san, this); });
  }
  function danhDau(san, el, chiThem) {
    var tt = san.__thuTu, vt = tt.indexOf(el);
    if (vt >= 0) { if (chiThem) return; tt.splice(vt, 1); el.classList.remove('da-dem'); }
    else { tt.push(el); el.classList.add('da-dem'); }
    var dem = 0;
    tt.forEach(function (x) {
      dem += +x.getAttribute('data-gt');
      var nhan = x.querySelector('.nhan-dem');
      if (!nhan) { nhan = document.createElement('i'); nhan.className = 'nhan-dem'; x.appendChild(nhan); }
      nhan.textContent = dem;
    });
    var bo = el.querySelector('.nhan-dem'); if (vt >= 0 && bo) bo.remove();
  }

  // ---------- C. Lớn – bé – bằng ----------
  function chamSo(n) { // hàng chấm cá nhỏ để bé so bằng mắt
    var h = '<div class="cham-so">';
    for (var i = 0; i < n; i++) h += '<i' + (i > 0 && i % 5 === 0 ? ' class="cach"' : '') + '></i>';
    return h + '</div>';
  }
  MON.lonbe = {
    ten: 'Lớn – bé – bằng', loiDan: 'Hai bạn cánh cụt giơ số. Con chọn dấu đúng: bé hơn (<), bằng (=) hay lớn hơn (>).',
    CAP: [null,
      { ten: 'Cấp 1', moTa: 'Số đến 10, có chấm để đếm' },
      { ten: 'Cấp 2', moTa: 'Số đến 20' },
      { ten: 'Cấp 3', moTa: 'Số đến 100' }],
    taoCau: function (cap) {
      var a, b;
      if (Math.random() < 0.15) { a = cap === 1 ? ng(1, 10) : cap === 2 ? ng(5, 20) : ng(10, 99); b = a; }
      else {
        do {
          if (cap === 1) { a = ng(1, 10); b = ng(1, 10); }
          else if (cap === 2) { a = ng(1, 20); b = ng(1, 20); if (a < 11 && b < 11) a += 10; }
          else if (Math.random() < 0.4) { var ch = ng(1, 9); a = ch * 10 + ng(0, 9); b = ch * 10 + ng(0, 9); } // cùng hàng chục
          else { a = ng(10, 99); b = ng(10, 99); }
        } while (a === b);
      }
      var dau = a < b ? '<' : a > b ? '>' : '=';
      return {
        chu: a + '  ?  ' + b,
        khoa: 'lb' + a + '_' + b, de: 'Chọn dấu đúng nhé!',
        dapAn: ['<', '=', '>'], dung: dau, giuThuTu: true,
        nhanDapAn: { '<': 'bé hơn', '=': 'bằng', '>': 'lớn hơn' },
        ve: function (san) {
          san.innerHTML = '<div class="so-sanh">' +
            '<div class="ben">' + TV.hinhCanhCut(a, '#ff5c8a') + (cap === 1 ? chamSo(a) : '<div class="phu-ben"></div>') + '</div>' +
            '<div class="o-dau" id="oDau">?</div>' +
            '<div class="ben">' + TV.hinhCanhCut(b, '#4cc9f0') + (cap === 1 ? chamSo(b) : '<div class="phu-ben"></div>') + '</div></div>';
        },
        goiY: function (san) {
          var phu = san.querySelectorAll('.phu-ben');
          if (cap === 2) { phu[0].innerHTML = chamSo(a); phu[1].innerHTML = chamSo(b); return 'Đếm chấm xem bên nào nhiều hơn nhé!'; }
          if (cap === 3) {
            phu[0].innerHTML = '<p class="tach-so"><b>' + Math.floor(a / 10) + '</b> chục <b>' + (a % 10) + '</b> đơn vị</p>';
            phu[1].innerHTML = '<p class="tach-so"><b>' + Math.floor(b / 10) + '</b> chục <b>' + (b % 10) + '</b> đơn vị</p>';
            return Math.floor(a / 10) === Math.floor(b / 10) ? 'Số chục bằng nhau, so tiếp số đơn vị nhé!' : 'So số chục trước nhé!';
          }
          return 'Đếm chấm dưới mỗi bạn xem bên nào nhiều hơn!';
        },
        khiDung: function () { var o = $('oDau'); if (o) { o.textContent = dau; o.classList.add('da-dien'); } }
      };
    }
  };

  // ---------- F. Số còn thiếu ----------
  MON.sothieu = {
    ten: 'Số còn thiếu', loiDan: 'Một bạn cánh cụt bị che số. Con đoán xem bạn ấy đeo số mấy nhé!',
    CAP: [null,
      { ten: 'Cấp 1', moTa: 'Đếm thêm 1' },
      { ten: 'Cấp 2', moTa: 'Đếm thêm 2' },
      { ten: 'Cấp 3', moTa: 'Đếm thêm 5' },
      { ten: 'Cấp 4', moTa: 'Đếm thêm 10' }],
    taoCau: function (cap) {
      var buoc = [0, 1, 2, 5, 10][cap], dau;
      if (cap === 1) dau = ng(1, 15);
      else if (cap === 2) dau = ng(0, 20);
      else if (cap === 3) dau = 5 * ng(0, 11);
      else dau = ng(0, 9) + 10 * ng(0, 5);
      var day = [0, 1, 2, 3, 4].map(function (i) { return dau + i * buoc; });
      var an = ng(1, 4), dung = day[an];
      return {
        chu: day.map(function (x, i) { return i === an ? '?' : x; }).join(', '),
        khoa: 'st' + dau + '_' + buoc + '_' + an, de: 'Bạn đeo dấu ? là số mấy?',
        // Không lấy số đang hiện trên hàng làm đáp án nhiễu
        dapAn: dapAnNhieu(dung, buoc > 1 ? [buoc, 1, 2] : [1, 2, 3, 4, 5], 99, day.filter(function (x) { return x !== dung; })), dung: dung,
        ve: function (san) {
          var h = '<div class="hang-cc-hoi">';
          day.forEach(function (x, i) {
            h += '<div class="o-cc' + (i === an ? ' an' : '') + '">' + TV.hinhCanhCut(i === an ? '?' : x, TV.MAU_KHAN[i]) +
              (i < 4 ? '<span class="buoc-nhay">+' + buoc + '</span>' : '') + '</div>';
          });
          san.innerHTML = h + '</div>';
        },
        goiY: function (san) { san.querySelector('.hang-cc-hoi').classList.add('hien-buoc'); return 'Mỗi bạn hơn bạn đứng trước ' + buoc + ' đơn vị đấy!'; },
        khiDung: function (san) {
          var o = san.querySelector('.o-cc.an');
          if (o) { o.innerHTML = TV.hinhCanhCut(dung, TV.MAU_KHAN[an]) + (an < 4 ? '<span class="buoc-nhay">+' + buoc + '</span>' : ''); o.classList.remove('an'); TV.hieuUng(o, 'nhay-len', 500); }
        }
      };
    }
  };


  // ---------- D. Cộng trừ ----------
  function nhomCa(n, mau, boDi) { // n cá nhỏ; boDi = số con cuối bị "cho đi" (gạch)
    var h = '<div class="nhom-ca-nho">';
    for (var i = 0; i < n; i++) h += '<span class="ca-nho' + (boDi && i >= n - boDi ? ' bi-di' : '') + '">' + hinhCa(mau) + '</span>';
    return h + '</div>';
  }
  function bieuThuc(a, dau, b, hoiCho) { // hoiCho: 'kq' (a dau b = ?)
    return '<div class="phep-tinh"><span>' + a + '</span><span class="dau-pt">' + dau + '</span><span>' + b + '</span>' +
      '<span class="dau-pt">=</span><span class="o-hoi">?</span></div>';
  }
  function datTinh(a, dau, b) { // đặt tính dọc: thẳng hàng chục, hàng đơn vị
    function hang(x) { var t = Math.floor(x / 10), u = x % 10; return '<span class="cot-chuc">' + (t || '') + '</span><span class="cot-dv">' + u + '</span>'; }
    return '<div class="dat-tinh"><div class="dong"><span class="cot-dau"></span>' + hang(a) + '</div>' +
      '<div class="dong"><span class="cot-dau">' + dau + '</span>' + hang(b) + '</div><div class="gach"></div></div>';
  }
  function dienKetQua(san, kq) { var o = san.querySelector('.o-hoi'); if (o) { o.textContent = kq; o.classList.add('da-dien'); } }

  MON.congtru = {
    ten: 'Cộng trừ', loiDan: 'Cánh cụt bắt thêm cá (+) hoặc cho bạn bớt cá (−). Con tính xem còn bao nhiêu nhé!',
    CAP: [null,
      { ten: 'Cấp 1', moTa: 'Cộng, trừ trong 10' },
      { ten: 'Cấp 2', moTa: 'Cộng, trừ trong 20' },
      { ten: 'Cấp 3', moTa: 'Trong 100, không nhớ' },
      { ten: 'Cấp 4', moTa: 'Trong 100, có nhớ' }],
    taoCau: function (cap) {
      var cong = Math.random() < 0.5, a, b, ta, ua, tb, ub;
      if (cap === 1) {
        if (cong) { a = ng(1, 9); b = ng(1, 10 - a); } else { a = ng(2, 10); b = ng(1, a - 1); }
      } else if (cap === 2) {
        if (cong) { do { a = ng(2, 18); b = ng(1, 20 - a); } while (a + b <= 10); } else { a = ng(11, 20); b = ng(2, 10); }
      } else if (cap === 3) {
        if (cong) { ta = ng(1, 8); ua = ng(0, 8); tb = ng(0, 9 - ta); ub = ng(0, 9 - ua); }
        else { ta = ng(2, 9); ua = ng(1, 9); tb = ng(0, ta - 1); ub = ng(0, ua); }
        a = ta * 10 + ua; b = tb * 10 + ub; if (b === 0) b = cong ? 1 : (ua >= 1 ? 1 : 10);
      } else {
        if (cong) { ta = ng(1, 7); ua = ng(1, 9); tb = ng(0, 8 - ta); ub = ng(10 - ua, 9); }
        else { ta = ng(2, 9); ua = ng(0, 8); tb = ng(0, ta - 1); ub = ng(ua + 1, 9); }
        a = ta * 10 + ua; b = tb * 10 + ub;
      }
      var dau = cong ? '+' : '−', kq = cong ? a + b : a - b;
      return {
        chu: a + ' ' + dau + ' ' + b + ' = ?',
        pt: { a: a, dau: dau, b: b, kq: kq },   // cho khung "Cách làm" (cachlam.js)
        khoa: 'ct' + a + dau + b, de: cong ? 'Cộng vào được bao nhiêu?' : 'Bớt đi còn bao nhiêu?',
        dapAn: dapAnNhieu(kq, cap >= 3 ? [1, 2, 10] : [1, 2, 3], 100), dung: kq,
        ve: function (san) {
          var minh = '';
          if (cap === 1 || (cap === 2 && !cong)) {
            minh = cong ? '<div class="minh-hoa">' + nhomCa(a, '#ff9f1c') + '<b class="dau-lon">+</b>' + nhomCa(b, '#4cc9f0') + '</div>'
              : '<div class="minh-hoa">' + nhomCa(a, '#ff9f1c', b) + '</div>';
          }
          san.innerHTML = bieuThuc(a, dau, b) + minh + '<div class="goi-y-hoi"></div>';
        },
        goiY: function (san) {
          var o = san.querySelector('.goi-y-hoi');
          if (cap <= 2) {
            if (!san.querySelector('.minh-hoa')) o.innerHTML = cong ? '<div class="minh-hoa">' + nhomCa(a, '#ff9f1c') + '<b class="dau-lon">+</b>' + nhomCa(b, '#4cc9f0') + '</div>' : '';
            return cong ? 'Đếm tiếp thêm ' + b + ' con từ ' + a + ' nhé!' : 'Đếm số cá không bị gạch nhé!';
          }
          o.innerHTML = datTinh(a, dau, b);
          if (cap === 3) return 'Tính hàng đơn vị trước, rồi đến hàng chục nhé!';
          return cong ? 'Hàng đơn vị cộng được quá 10 thì nhớ 1 sang hàng chục nhé!' : 'Hàng đơn vị không đủ trừ thì mượn 1 chục nhé!';
        },
        khiDung: function (san) { dienKetQua(san, kq); }
      };
    }
  };

  // ---------- E. Nhân chia ----------
  function cacNhom(soNhom, moiNhom) {
    var h = '<div class="cac-nhom">';
    for (var g = 0; g < soNhom; g++) {
      h += '<div class="nhom" style="grid-template-columns:repeat(' + Math.min(moiNhom, 5) + ',16px)">';
      for (var i = 0; i < moiNhom; i++) h += '<i></i>';
      h += '</div>';
    }
    return h + '</div>';
  }
  // Số lớn (trên 50) vẽ thành thanh chục: mỗi thanh 10 chấm, cộng chấm lẻ; gọn hơn hẳn 100 chấm rời (rà 0.9.0)
  function veThanhChuc(n, lop) {
    var h = '<span class="thanh-chuc ' + (lop || '') + '">';
    for (var i = 0; i < Math.floor(n / 10); i++) h += '<span class="thanh10"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>';
    if (n % 10) { h += '<span class="le-chuc">'; for (var j = 0; j < n % 10; j++) h += '<i></i>'; h += '</span>'; }
    return h + '</span>';
  }
  TV.veThanhChuc = veThanhChuc;
  var BANG_NC = [null, [10, 5], [10, 5], [2, 4], [2, 4], [3], [3]];
  TV.BANG_NC = BANG_NC;
  MON.nhanchia = {
    ten: 'Nhân chia', loiDan: 'Mỗi bạn cánh cụt bắt mấy con cá, cả đàn bắt bao nhiêu? Chia đều cá cho các bạn, mỗi bạn được mấy?',
    CAP: [null,
      { ten: 'Cấp 1', moTa: 'Nhân bảng 10 và 5' },
      { ten: 'Cấp 2', moTa: 'Chia bảng 10 và 5' },
      { ten: 'Cấp 3', moTa: 'Nhân bảng 2 và 4' },
      { ten: 'Cấp 4', moTa: 'Chia bảng 2 và 4' },
      { ten: 'Cấp 5', moTa: 'Nhân bảng 3' },
      { ten: 'Cấp 6', moTa: 'Chia bảng 3' }],
    taoCau: function (cap) {
      // Dễ trước, khó sau: 10 → 5 → 2 → 4 → 3 (đặc tả mục 11.1). Cấp lẻ là nhân, cấp chẵn là chia cùng bảng.
      var dsBang = BANG_NC[cap] || [2, 5], nhan = cap % 2 === 1, bang, lan;
      // Khoảng 1/3 số câu lấy từ phép bé hay sai hoặc chậm (đặc tả mục 11.5)
      var yeu = Math.random() < 0.34 && TV.thuoc ? TV.thuoc.chonYeu(dsBang, nhan) : null;
      if (yeu) { bang = yeu.bang; lan = yeu.lan; } else { bang = dsBang[ng(0, dsBang.length - 1)]; lan = ng(1, 10); }
      if (nhan) {
        var tich = bang * lan;
        return {
          chu: bang + ' × ' + lan + ' = ?',
          pt: { a: bang, dau: '×', b: lan, kq: tich },   // cho khung "Cách làm" (đặc tả mục 10)
          khoa: 'n' + bang + 'x' + lan, de: lan + ' bạn, mỗi bạn bắt ' + bang + ' con cá. Cả đàn bắt mấy con?',
          dapAn: dapAnNhieu(tich, [bang, 1, 2], 100), dung: tich,
          ve: function (san) { san.innerHTML = bieuThuc(bang, '×', lan) + cacNhom(lan, bang) + '<div class="goi-y-hoi"></div>'; },
          goiY: function (san) {
            var ds = []; for (var i = 0; i < lan; i++) ds.push(bang);
            if (tich > 50) { var cn = san.querySelector('.cac-nhom'); if (cn) cn.style.display = 'none'; }   // số lớn: gợi ý thay chỗ hình (rà 0.9.0)
            san.querySelector('.goi-y-hoi').innerHTML = '<p class="cong-lap">' + ds.join(' + ') + '</p>';
            return bang + ' được lấy ' + lan + ' lần. Cộng dồn lên nhé!';
          },
          khiDung: function (san) { dienKetQua(san, tich); }
        };
      }
      var tong = bang * lan;
      return {
        chu: tong + ' : ' + bang + ' = ?',
        pt: { a: tong, dau: ':', b: bang, kq: lan },
        khoa: 'c' + tong + ':' + bang, de: 'Có ' + tong + ' con cá chia đều cho ' + bang + ' bạn. Mỗi bạn được mấy con?',
        dapAn: dapAnNhieu(lan, [1, 2, 3], 12), dung: lan,
        ve: function (san) {
          var hinh = tong > 50 ? veThanhChuc(tong) : cacNhom(1, tong).replace('class="nhom"', 'class="nhom khoi"').replace('repeat(5,', 'repeat(10,');
          var h = bieuThuc(tong, ':', bang) + '<div class="minh-hoa">' + hinh + '</div><div class="hang-ban">';
          for (var i = 0; i < bang; i++) h += '<span class="ban-nho">' + TV.hinhCanhCut(null, TV.MAU_KHAN[i]) + '</span>';
          san.innerHTML = h + '</div><div class="goi-y-hoi"></div>';
        },
        goiY: function (san) {
          // Gợi ý thay chỗ hình cũ, không chồng thêm (rà 0.9.0)
          var mh = san.querySelector('.minh-hoa'), hb = san.querySelector('.hang-ban');
          if (mh) mh.innerHTML = ''; if (hb) hb.style.display = 'none';
          san.querySelector('.goi-y-hoi').innerHTML = lan > 5 && bang * lan > 50
            ? '<div class="cac-nhom">' + (function () { var x = ''; for (var g = 0; g < bang; g++) x += veThanhChuc(lan, 'nho-gon'); return x; })() + '</div>'
            : cacNhom(bang, lan);
          return 'Chia thành ' + bang + ' phần bằng nhau, đếm một phần nhé!';
        },
        khiDung: function (san) { dienKetQua(san, lan); }
      };
    }
  };

  // =====================================================================
  //  Bộ máy chơi chung
  // =====================================================================
  var hoi = { mon: null, cap: 1, so: 0, cau: null, saiCau: 0, saiVan: 0, khoa: false, deCu: [], caVan: 0, chuoi: 0, ganDay: [] };
  var CHUOI_LEN_CAP = 5;   // đúng ngay 5 câu liên tiếp thì lên cấp
  // Trong 4 câu gần nhất có 2 câu phải chọn lại thì lùi nhẹ 1 cấp, không báo (đặc tả mục 3)
  function tienDoMon(mon) { return TV.beHienTai().mon[mon]; }

  TV.moMonHoi = function (mon) {
    if (!MON[mon]) return;
    hoi.mon = mon;
    TV.moMan('manCapHoi');
  };
  TV.khiMoMan.manCapHoi = function () {
    var m = MON[hoi.mon], td = tienDoMon(hoi.mon), html = '';
    $('tenMonHoi').textContent = m.ten;
    $('loiDanMonHoi').textContent = m.loiDan;
    for (var c = 1; c < m.CAP.length; c++) {
      var mo = c <= td.capMo, sao = td.sao[c] || 0;
      html += '<button class="the-cap ' + (mo ? '' : 'khoa ') + (sao ? 'xong' : '') + '" data-cap="' + c + '">' +
        '<span class="so-cap">' + (mo ? c : '🔒') + '</span>' +
        '<span class="mo-ta"><b>' + m.CAP[c].ten + '</b><small>' + m.CAP[c].moTa + '</small></span>' +
        '<span class="sao-cap">' + (sao ? '★★★'.slice(0, sao) + '<s>' + '★★★'.slice(sao) + '</s>' : '') + '</span></button>';
    }
    $('dsCapHoi').innerHTML = html;
    var ds = $('dsCapHoi').querySelectorAll('.the-cap');
    for (var i = 0; i < ds.length; i++) ds[i].addEventListener('click', function () {
      var c = +this.getAttribute('data-cap');
      if (c > tienDoMon(hoi.mon).capMo) { am('sai'); TV.hieuUng(this, 'lac-ngang', 320); return; }
      am('bam'); batDauCapHoi(c);
    });
  };
  TV.khiMoMan.manHoi = function () { veLinhVat(); };

  function veLinhVat() { $('linhVatHoi').innerHTML = TV.hinhCanhCut(null, '#ff5c8a'); }

  function batDauCapHoi(cap) {
    hoi.cap = cap; hoi.so = 0; hoi.saiVan = 0; hoi.deCu = []; hoi.caVan = 0; hoi.chuoi = 0; hoi.ganDay = [];
    hoi.soCau = hoi.mon === 'bome' ? hoi.dsCoDinh.length : SO_CAU;
    hoi.capChon = cap;
    // Bé thoát giữa ván rồi vào lại đúng màn, đúng cấp đã chọn: làm tiếp từ câu đang dở (rà lát 2, lỗi 2)
    var d = hoi.dangDo;
    if (d && d.mon === hoi.mon && d.capChon === cap && hoi.mon !== 'bome') {
      hoi.cap = d.cap; hoi.so = d.so; hoi.saiVan = d.saiVan; hoi.caVan = d.caVan;
    }
    hoi.dangDo = null;
    TV.moMan('manHoi');
    cauMoi();
  }

  function veCham() {
    var h = '';
    for (var i = 0; i < hoi.soCau; i++) h += '<span class="' + (i < hoi.so ? 'xong' : i === hoi.so ? 'dang' : '') + '"></span>';
    $('chamHoi').innerHTML = (hoi.mon === 'bome' ? '<em class="ten-cap-dang">Đề bố mẹ</em>' : '<em class="ten-cap-dang">Cấp ' + hoi.cap + '</em>') + h;
  }

  function cauMoi() {
    TV.huyHen();
    var m = MON[hoi.mon], cau, lan = 0;
    do { cau = m.taoCau(hoi.cap); lan++; } while (hoi.deCu.indexOf(cau.khoa) >= 0 && lan < 30);
    hoi.deCu.push(cau.khoa); if (hoi.deCu.length > 6) hoi.deCu.shift();
    hoi.cau = cau; hoi.saiCau = 0; hoi.khoa = false; hoi.daXem = false; hoi.daGhi = false; hoi.batDau = Date.now();
    // Nút "Cách làm" chỉ có ở màn Cộng trừ (đặc tả mục 9)
    var nutCach = $('nutCachLam');
    nutCach.style.display = cau.pt && TV.cachLam ? '' : 'none';
    nutCach.classList.remove('nhap-nhay');
    $('deHoi').textContent = cau.de;
    $('nhanXetHoi').textContent = '';
    veCham();
    var san = $('sanHoi');
    cau.ve(san);
    var h = '';
    cau.dapAn.forEach(function (d) {
      var chu = String(d).replace(/</g, '&lt;').replace(/>/g, '&gt;');
      h += '<button class="nut-dap' + (cau.giuThuTu ? ' dau' : '') + '" data-dap="' + chu + '"><b>' + chu + '</b>' +
        (cau.nhanDapAn ? '<small>' + cau.nhanDapAn[d] + '</small>' : '') + '</button>';
    });
    $('dapAnHoi').innerHTML = h;
    var nut = $('dapAnHoi').querySelectorAll('.nut-dap');
    for (var i = 0; i < nut.length; i++) nut[i].addEventListener('click', function () { chon(this); });
  }

  function chon(nut) {
    if (hoi.khoa || nut.disabled) return;
    var cau = hoi.cau, td = tienDoMon(hoi.mon), san = $('sanHoi');
    var gt = nut.getAttribute('data-dap');
    if (String(cau.dung) === gt) {
      hoi.khoa = true;
      nut.classList.add('dung');
      am('chon'); setTimeout(function () { am('sao'); }, 120);
      TV.hieuUng($('linhVatHoi'), 'vui', 700);
      if (cau.khiDung) cau.khiDung(san);
      td.dung++;
      var thuong = hoi.saiCau === 0 && !hoi.daXem;   // đã mở "Cách làm" thì không được cá, không tính chuỗi
      ghiThuoc(cau, hoi.daXem ? 'cham' : (Date.now() - hoi.batDau > 5000 ? 'cham' : Date.now() - hoi.batDau < 3000 ? 'nhanh' : 'dung'));
      if (thuong) { hoi.caVan++; TV.themCa(1); }
      $('nhanXetHoi').textContent = thuong ? ['Đúng rồi! +1 🐟', 'Giỏi quá! +1 🐟', 'Tuyệt vời! +1 🐟'][ng(0, 2)] : 'Đúng rồi! Con đã tự sửa được, giỏi lắm!';
      hoi.so++;
      // Chuỗi lên cấp: đúng ngay và không xem cách làm. Xét lùi cấp: chỉ tính lần chọn sai (rà 0.7.0)
      var thongBaoCap = doiCapTuDong(thuong, hoi.saiCau === 0);
      if (thongBaoCap) $('nhanXetHoi').textContent = thongBaoCap;
      veCham();
      hoi.dangDo = hoi.so < hoi.soCau ? { mon: hoi.mon, capChon: hoi.capChon, cap: hoi.cap, so: hoi.so, saiVan: hoi.saiVan, caVan: hoi.caVan } : null;
      if (hoi.so >= hoi.soCau) { var kq = ghiKetQuaCap(); hen(function () { trinhDien(kq); }, 900); }
      else { TV.ghiLuu(); hen(cauMoi, 1300); }
    } else {
      nut.classList.add('sai'); nut.disabled = true;
      am('sai');
      ghiThuoc(cau, 'sai');
      TV.hieuUng($('linhVatHoi'), 'lac', 600);
      hoi.saiCau++; hoi.saiVan++; td.sai++;
      TV.ghiLuu();
      var loi = 'Chưa đúng rồi, con thử lại nhé!';
      if (hoi.saiCau >= 2 && cau.goiY) loi = cau.goiY(san) || loi;
      if (hoi.saiCau >= 2 && cau.pt) $('nutCachLam').classList.add('nhap-nhay');
      $('nhanXetHoi').textContent = loi;
    }
  }

  // Mỗi câu chỉ ghi 1 lần (lần chọn đầu tiên). Chỉ ghi phép nhân chia.
  function ghiThuoc(cau, loai) {
    if (hoi.daGhi || !cau.pt || !TV.thuoc || (cau.pt.dau !== '×' && cau.pt.dau !== ':')) return;
    hoi.daGhi = true;
    TV.thuoc.ghi(cau.pt, loai);
  }

  // Sau mỗi câu đúng: xét lên / lùi cấp. Trả về lời báo khi lên cấp (lùi cấp thì không báo).
  function doiCapTuDong(dungNgay, khongSai) {
    var m = MON[hoi.mon], td = tienDoMon(hoi.mon), max = m.CAP.length - 1;
    if (khongSai === undefined) khongSai = dungNgay;
    hoi.chuoi = dungNgay ? hoi.chuoi + 1 : 0;
    hoi.ganDay.push(khongSai); if (hoi.ganDay.length > 4) hoi.ganDay.shift();
    if (hoi.so >= hoi.soCau || hoi.mon === 'bome') return '';   // câu cuối: để bảng thắng báo; đề bố mẹ không đổi cấp
    if (hoi.chuoi >= CHUOI_LEN_CAP && hoi.cap < max) {
      td.sao[hoi.cap] = 3;
      hoi.cap++; hoi.chuoi = 0; hoi.ganDay = [];
      if (td.capMo < hoi.cap) td.capMo = hoi.cap;
      hoi.deCu = [];
      setTimeout(function () { am('thang'); }, 200);
      return '🎉 Giỏi quá! Lên Cấp ' + hoi.cap + ' rồi!';
    }
    var soSai = hoi.ganDay.filter(function (x) { return !x; }).length;
    if (soSai >= 2 && hoi.cap > 1) { hoi.cap--; hoi.chuoi = 0; hoi.ganDay = []; hoi.deCu = []; }
    return '';
  }

  // Ghi kết quả ngay khi xong câu cuối (bé có rời màn giữa chừng thì vẫn lưu đúng)
  function ghiKetQuaCap() {
    var td = tienDoMon(hoi.mon), m = MON[hoi.mon];
    var sao = hoi.saiVan === 0 ? 3 : hoi.saiVan <= 3 ? 2 : 1;
    if (hoi.mon === 'bome') { TV.ghiLuu(); return { sao: sao, boMe: true, cap: 1, ca: hoi.caVan, sai: hoi.saiVan }; }
    var cu = td.sao[hoi.cap] || 0, kyLuc = sao > cu && cu > 0;
    if (sao > cu) td.sao[hoi.cap] = sao;
    var moCapMoi = false;
    if (hoi.cap === td.capMo && hoi.cap < m.CAP.length - 1) { td.capMo = hoi.cap + 1; moCapMoi = true; }
    TV.ghiLuu();
    return { sao: sao, moCapMoi: moCapMoi, kyLuc: kyLuc, cap: hoi.cap, ca: hoi.caVan, sai: hoi.saiVan };
  }

  function trinhDien(kq) {
    var m = MON[hoi.mon], coCapSau = kq.cap < m.CAP.length - 1;
    am('thang'); TV.phaoGiay();
    var ct = 'Con làm đúng ' + hoi.soCau + ' câu' + (kq.sai ? ', có ' + kq.sai + ' lần chọn lại' : ', không sai câu nào!') +
      '<br><span class="thuong-ca">+' + kq.ca + ' 🐟</span>';
    if (kq.boMe) {
      TV.moBangThang({ tieuDe: 'Con giải xong đề của bố mẹ!', sao: kq.sao, chiTiet: ct, chuTiep: 'Ra đề mới ▶', chuCap: 'Về màn chính',
        tiep: function () { TV.moMan('manRaDe'); }, chonCap: function () { TV.moMan('manChinh'); } });
      return;
    }
    if (kq.kyLuc) ct += '<br>🏅 Kỷ lục mới của ' + m.CAP[kq.cap].ten + '!';
    if (kq.moCapMoi) ct += '<br>🎉 Con đã mở ' + m.CAP[kq.cap + 1].ten + '!';
    TV.moBangThang({
      tieuDe: kq.sao === 3 ? 'Xuất sắc!' : kq.sao === 2 ? 'Giỏi quá!' : 'Hoàn thành!',
      sao: kq.sao, chiTiet: ct,
      chuTiep: coCapSau ? 'Sang ' + m.CAP[kq.cap + 1].ten + ' ▶' : 'Chơi lại ▶',
      tiep: function () { batDauCapHoi(coCapSau ? kq.cap + 1 : kq.cap); },
      chonCap: function () { TV.moMan('manCapHoi'); }
    });
  }

  // ---------- Đề của bố mẹ (lát 5): danh sách phép tính cố định ----------
  MON.bome = {
    ten: 'Đề của bố mẹ', loiDan: '', CAP: [null, { ten: 'Đề bố mẹ', moTa: '' }],
    taoCau: function () { return hoi.dsCoDinh[hoi.so]; }
  };
  // pt = {a, dau ('+','−','×',':'), b, kq}
  function cauPhepTinh(pt, thuTu) {
    return {
      chu: pt.a + ' ' + pt.dau + ' ' + pt.b + ' = ?', khoa: 'bm' + thuTu, de: 'Bố mẹ hỏi con nè!',
      dapAn: dapAnNhieu(pt.kq, pt.kq >= 20 ? [1, 2, 10] : [1, 2, 3], Math.min(999, Math.max(100, pt.kq + 20))), dung: pt.kq,
      ve: function (san) { san.innerHTML = bieuThuc(pt.a, pt.dau, pt.b) + '<div class="goi-y-hoi"></div>'; },
      goiY: function (san) {
        var o = san.querySelector('.goi-y-hoi');
        if ((pt.dau === '+' || pt.dau === '−') && pt.a < 100 && pt.b < 100) {
          o.innerHTML = datTinh(pt.a, pt.dau, pt.b);
          return 'Đặt tính rồi tính hàng đơn vị trước nhé!';
        }
        if (pt.dau === '×' && pt.b <= 10 && pt.a * pt.b <= 100) {
          var ds = []; for (var i = 0; i < pt.b; i++) ds.push(pt.a);
          o.innerHTML = '<p class="cong-lap">' + ds.join(' + ') + '</p>';
          return 'Cộng dồn lên nhé!';
        }
        if (pt.dau === ':') return 'Nghĩ xem ' + pt.b + ' nhân mấy thì bằng ' + pt.a + ' nhé!';
        return 'Con tính chậm từng bước nhé!';
      },
      khiDung: function (san) { dienKetQua(san, pt.kq); }
    };
  }
  TV.choiDeBoMe = function (dsPhepTinh) {
    hoi.mon = 'bome';
    hoi.dsCoDinh = dsPhepTinh.map(cauPhepTinh);
    batDauCapHoi(1);
  };
  TV.chaDong.manHoi = function () { return hoi.mon === 'bome' ? 'manRaDe' : null; };

  $('nutCachLam').addEventListener('click', function () {
    if (!hoi.cau || !hoi.cau.pt || !TV.cachLam || hoi.khoa) return;
    am('bam');
    hoi.daXem = true;
    this.classList.remove('nhap-nhay');
    TV.cachLam.mo(hoi.cau.pt, false);
  });

  TV.MON_HOI = MON;
  window.__toanVuiHoi = hoi; // cho phiên kiểm thử đọc trạng thái
})();
