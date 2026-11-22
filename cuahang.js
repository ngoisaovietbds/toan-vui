/* Toán Vui Cùng Bố Mẹ – cửa hàng (lát 6, mở rộng ở lát 12 – đặc tả mục 12).
 * Bé dùng cá thưởng đổi đồ cho cánh cụt của mình. Cá chỉ là điểm thưởng trong game, không liên quan tiền thật.
 * 4 tab: Đồ đeo (mỗi chỗ đeo 1 món) · Màu (khăn, thân) · Nhà tuyết (đồ trang trí, đặt ở màn Nhà tuyết) · Thú cưng (dắt 1 bạn).
 * Hình phụ kiện vẽ trên cùng khung 100×132 với hình cánh cụt; thú cưng và đồ nhà tuyết có khung riêng. */
(function () {
  'use strict';
  var TV = window.TV, $ = TV.$, am = TV.am;

  // ---------- Đồ đeo ----------
  var PK = [
    { ma: 'no_hong', ten: 'Nơ hồng', cho: 'dau', gia: 5,
      ve: '<path d="M60 16 L74 8 L74 26 Z M76 16 L62 8 L62 26 Z" fill="#ff5c8a" transform="translate(-2 4)"/><circle cx="66" cy="21" r="4" fill="#ff2f6d"/>' },
    { ma: 'hoa', ten: 'Bông hoa', cho: 'dau', gia: 8,
      ve: '<g transform="translate(30 22)"><circle cx="0" cy="-7" r="5.5" fill="#ffb3c6"/><circle cx="6.7" cy="-2" r="5.5" fill="#ffb3c6"/><circle cx="4" cy="6" r="5.5" fill="#ffb3c6"/><circle cx="-4" cy="6" r="5.5" fill="#ffb3c6"/><circle cx="-6.7" cy="-2" r="5.5" fill="#ffb3c6"/><circle r="4" fill="#ffd23f"/></g>' },
    { ma: 'kinh', ten: 'Kính tròn', cho: 'mat', gia: 10,
      ve: '<circle cx="39" cy="40" r="9.5" fill="rgba(255,255,255,.25)" stroke="#16324f" stroke-width="2.6"/><circle cx="61" cy="40" r="9.5" fill="rgba(255,255,255,.25)" stroke="#16324f" stroke-width="2.6"/><path d="M48.5 40 Q50 37 51.5 40" stroke="#16324f" stroke-width="2.6" fill="none"/>' },
    { ma: 'no_co', ten: 'Nơ cổ', cho: 'co', gia: 12,
      ve: '<path d="M50 66 L38 59 L38 73 Z M50 66 L62 59 L62 73 Z" fill="#2ec4b6"/><circle cx="50" cy="66" r="3.6" fill="#13897d"/>' },
    { ma: 'mu_len', ten: 'Mũ len', cho: 'dau', gia: 15,
      ve: '<path d="M25 33 Q50 2 75 33 Z" fill="#e63946"/><rect x="23" y="29" width="54" height="8" rx="4" fill="#fff"/><circle cx="50" cy="11" r="6" fill="#fff"/>' },
    { ma: 'que_kem', ten: 'Que kem', cho: 'tay', gia: 15,
      ve: '<path d="M86 98 L80 80 L92 80 Z" fill="#e0a060"/><path d="M81 84 L91 84 M82 89 L90 89" stroke="#b97a3a" stroke-width="1"/><circle cx="86" cy="75" r="7.5" fill="#ffb3c6"/><circle cx="86" cy="67" r="2.6" fill="#e63946"/>' },
    { ma: 'kinh_tim', ten: 'Kính trái tim', cho: 'mat', gia: 20,
      ve: '<path d="M39 49 L30 40 Q27 34 33 33 Q37 33 39 37 Q41 33 45 33 Q51 34 48 40 Z" fill="rgba(255,92,138,.8)" stroke="#e0245e" stroke-width="1.6"/><path d="M61 49 L52 40 Q49 34 55 33 Q59 33 61 37 Q63 33 67 33 Q73 34 70 40 Z" fill="rgba(255,92,138,.8)" stroke="#e0245e" stroke-width="1.6"/><path d="M48 38 L52 38" stroke="#e0245e" stroke-width="2"/>' },
    { ma: 'bong_bay', ten: 'Bóng bay', cho: 'tay', gia: 20,
      ve: '<path d="M10 92 Q4 70 13 44" stroke="#666" stroke-width="1.2" fill="none"/><ellipse cx="13" cy="30" rx="10" ry="13" fill="#ff5c8a"/><path d="M10 43 L16 43 L13 47 Z" fill="#ff5c8a"/><ellipse cx="9" cy="25" rx="2.5" ry="4" fill="#fff" opacity=".6"/>' },
    { ma: 'mu_thuy_thu', ten: 'Mũ thuỷ thủ', cho: 'dau', gia: 20,
      ve: '<ellipse cx="50" cy="29" rx="27" ry="6" fill="#fff" stroke="#c9dbe8"/><path d="M32 29 Q50 8 68 29 Z" fill="#fff" stroke="#c9dbe8"/><rect x="32" y="24" width="36" height="5" fill="#2a7ab8"/>' },
    { ma: 'kinh_ram', ten: 'Kính râm', cho: 'mat', gia: 22,
      ve: '<rect x="28" y="34" width="20" height="13" rx="5" fill="#16324f"/><rect x="52" y="34" width="20" height="13" rx="5" fill="#16324f"/><path d="M48 39 L52 39" stroke="#16324f" stroke-width="3"/><rect x="31" y="36" width="6" height="3" rx="1.5" fill="#fff" opacity=".5"/>' },
    { ma: 'cai_o', ten: 'Cái ô', cho: 'tay', gia: 24,
      ve: '<path d="M13 100 L13 50" stroke="#5a3d2b" stroke-width="2.4"/><path d="M13 100 Q13 104 17 103" stroke="#5a3d2b" stroke-width="2.4" fill="none"/><path d="M0 52 Q13 30 26 52 Q22 48 19.5 52 Q16 48 13 52 Q10 48 6.5 52 Q4 48 0 52 Z" fill="#4cc9f0" stroke="#2a90b8" stroke-width="1"/>' },
    { ma: 'co', ten: 'Lá cờ', cho: 'tay', gia: 25,
      ve: '<path d="M91 100 L91 52" stroke="#8a5a2b" stroke-width="2.5"/><path d="M91 52 L91 72 L70 62 Z" fill="#e63946"/><path d="M84 59 L85.2 62 L88.4 62 L85.8 64 L86.8 67 L84 65.2 L81.2 67 L82.2 64 L79.6 62 L82.8 62 Z" fill="#ffd23f" transform="translate(-2 0)"/>' },
    { ma: 'mat_na', ten: 'Mặt nạ siêu nhân', cho: 'mat', gia: 26,
      ve: '<path d="M22 35 Q50 27 78 35 L76 47 Q64 51 50 45 Q36 51 24 47 Z" fill="#e63946"/><circle cx="39" cy="40" r="6.5" fill="#1b2438"/><circle cx="61" cy="40" r="6.5" fill="#1b2438"/><circle cx="41" cy="37.5" r="2.2" fill="#fff"/><circle cx="63" cy="37.5" r="2.2" fill="#fff"/><path d="M22 35 L14 31 M78 35 L86 31" stroke="#e63946" stroke-width="3"/>' },
    { ma: 'tai_nghe', ten: 'Tai nghe', cho: 'dau', gia: 28,
      ve: '<path d="M21 44 Q50 0 79 44" stroke="#3a3f55" stroke-width="5" fill="none"/><rect x="14" y="37" width="12" height="18" rx="5" fill="#ff5c8a"/><rect x="74" y="37" width="12" height="18" rx="5" fill="#ff5c8a"/>' },
    { ma: 'mu_sinh_nhat', ten: 'Mũ sinh nhật', cho: 'dau', gia: 30,
      ve: '<path d="M37 30 L50 -2 L63 30 Z" fill="#8e7dff"/><path d="M41 21 L59 21 M44 13 L56 13" stroke="#ffd23f" stroke-width="3"/><circle cx="50" cy="-3" r="5" fill="#ff5c8a"/>' },
    { ma: 'tai_tho', ten: 'Tai thỏ', cho: 'dau', gia: 30,
      ve: '<ellipse cx="38" cy="8" rx="6.5" ry="17" fill="#fff" stroke="#ffc2d4" stroke-width="1.5" transform="rotate(-10 38 8)"/><ellipse cx="38" cy="8" rx="3.2" ry="12" fill="#ffb3c6" transform="rotate(-10 38 8)"/><ellipse cx="62" cy="8" rx="6.5" ry="17" fill="#fff" stroke="#ffc2d4" stroke-width="1.5" transform="rotate(10 62 8)"/><ellipse cx="62" cy="8" rx="3.2" ry="12" fill="#ffb3c6" transform="rotate(10 62 8)"/><path d="M28 28 Q50 16 72 28" stroke="#ff5c8a" stroke-width="4" fill="none"/>' },
    { ma: 'vong_ngoc', ten: 'Vòng cổ ngọc', cho: 'co', gia: 32,
      ve: '<g fill="#f6f1ff" stroke="#c9bdf5" stroke-width="1"><circle cx="30" cy="62" r="2.8"/><circle cx="35" cy="65" r="2.8"/><circle cx="40" cy="67" r="2.8"/><circle cx="45" cy="68.5" r="2.8"/><circle cx="55" cy="68.5" r="2.8"/><circle cx="60" cy="67" r="2.8"/><circle cx="65" cy="65" r="2.8"/><circle cx="70" cy="62" r="2.8"/></g><circle cx="50" cy="72" r="4.5" fill="#8e7dff" stroke="#fff" stroke-width="1.2"/>' },
    { ma: 'mu_cao_boi', ten: 'Mũ cao bồi', cho: 'dau', gia: 35,
      ve: '<ellipse cx="50" cy="28" rx="35" ry="6.5" fill="#a0522d"/><path d="M31 28 Q33 6 50 11 Q67 6 69 28 Z" fill="#b5651d"/><rect x="32" y="21" width="36" height="4.5" fill="#5a2e0e"/>' },
    { ma: 'vuong_mien', ten: 'Vương miện', cho: 'dau', gia: 40,
      ve: '<path d="M30 31 L33 12 L42 23 L50 7 L58 23 L67 12 L70 31 Z" fill="#ffd23f" stroke="#e0a800" stroke-width="1.5"/><circle cx="50" cy="24" r="3.2" fill="#e63946"/><circle cx="39" cy="26" r="2.4" fill="#2ec4b6"/><circle cx="61" cy="26" r="2.4" fill="#2ec4b6"/>' },
    { ma: 'dua_phep', ten: 'Đũa phép', cho: 'tay', gia: 40,
      ve: '<path d="M87 100 L94 62" stroke="#8a5a2b" stroke-width="2.6"/><path d="M95 50 L97.6 56.4 L104.4 56.8 L99.2 61.2 L100.9 67.9 L95 64.2 L89.1 67.9 L90.8 61.2 L85.6 56.8 L92.4 56.4 Z" fill="#ffd23f" stroke="#e0a800" stroke-width="1"/><circle cx="102" cy="48" r="1.6" fill="#ffd23f"/><circle cx="88" cy="46" r="1.2" fill="#ffd23f"/>' },
    { ma: 'mu_phu_thuy', ten: 'Mũ phù thuỷ', cho: 'dau', gia: 45,
      ve: '<ellipse cx="50" cy="30" rx="31" ry="5.5" fill="#5b3fa0"/><path d="M34 30 L57 -10 L67 30 Z" fill="#6c4bc4"/><path d="M36 25 L65 25" stroke="#ffd23f" stroke-width="3"/><path d="M53 8 L54.4 11.2 L57.8 11.4 L55.2 13.6 L56 17 L53 15.2 L50 17 L50.8 13.6 L48.2 11.4 L51.6 11.2 Z" fill="#ffd23f"/>' },
    { ma: 'ao_choang', ten: 'Áo choàng siêu nhân', cho: 'lung', gia: 60,
      ve: '<path d="M20 62 L2 122 L30 114 Z" fill="#e63946"/><path d="M80 62 L98 122 L70 114 Z" fill="#e63946"/><path d="M20 62 Q50 72 80 62" stroke="#c1121f" stroke-width="3" fill="none"/><circle cx="50" cy="67" r="4" fill="#ffd23f"/>' },
    { ma: 'sung_ky_lan', ten: 'Sừng kỳ lân', cho: 'dau', gia: 60,
      ve: '<path d="M45 25 L50 -6 L55 25 Z" fill="#ffd23f" stroke="#e0a800" stroke-width="1.2"/><path d="M46.5 18 L53.5 15 M47.5 10 L52.5 7.5 M48.6 3 L51.4 1.5" stroke="#e0a800" stroke-width="1.4"/><circle cx="36" cy="25" r="3.5" fill="#ffb3c6"/><circle cx="64" cy="25" r="3.5" fill="#bde0fe"/>' },
    { ma: 'canh_tien', ten: 'Cánh tiên', cho: 'lung', gia: 70,
      ve: '<ellipse cx="6" cy="58" rx="11" ry="20" fill="rgba(200,230,255,.85)" stroke="#8ecae6" stroke-width="1.5" transform="rotate(-25 6 58)"/><ellipse cx="94" cy="58" rx="11" ry="20" fill="rgba(200,230,255,.85)" stroke="#8ecae6" stroke-width="1.5" transform="rotate(25 94 58)"/><ellipse cx="7" cy="86" rx="7" ry="12" fill="rgba(255,214,232,.85)" stroke="#ffafcc" stroke-width="1.3" transform="rotate(20 7 86)"/><ellipse cx="93" cy="86" rx="7" ry="12" fill="rgba(255,214,232,.85)" stroke="#ffafcc" stroke-width="1.3" transform="rotate(-20 93 86)"/>' }
  ];
  var THU_TU_VE = ['lung', 'tay', 'co', 'mat', 'dau']; // vẽ đồ sau lưng trước, đồ trên đầu sau cùng
  var TEN_CHO = { dau: 'đầu', mat: 'mắt', co: 'cổ', tay: 'tay', lung: 'lưng' };

  // ---------- Màu ----------
  var MAU = [
    { ma: 'khan_hong', ten: 'Khăn hồng', loai: 'khan', mau: '#ff5c8a', gia: 0 },
    { ma: 'khan_do', ten: 'Khăn đỏ', loai: 'khan', mau: '#e63946', gia: 6 },
    { ma: 'khan_vang', ten: 'Khăn vàng', loai: 'khan', mau: '#ffb703', gia: 6 },
    { ma: 'khan_xanh', ten: 'Khăn xanh lá', loai: 'khan', mau: '#2ec4b6', gia: 8 },
    { ma: 'khan_tim', ten: 'Khăn tím', loai: 'khan', mau: '#8e7dff', gia: 8 },
    { ma: 'khan_cam', ten: 'Khăn cam', loai: 'khan', mau: '#ff7f3f', gia: 10 },
    { ma: 'than_den', ten: 'Thân xanh đen', loai: 'than', mau: '#2b3a55', toi: '#22304a', gia: 0 },
    { ma: 'than_bien', ten: 'Thân xanh biển', loai: 'than', mau: '#1f5f9e', toi: '#184c80', gia: 25 },
    { ma: 'than_soco', ten: 'Thân sô-cô-la', loai: 'than', mau: '#6b4226', toi: '#55341e', gia: 35 },
    { ma: 'than_hong', ten: 'Thân hồng phấn', loai: 'than', mau: '#c76b98', toi: '#a85580', gia: 50 }
  ];

  // ---------- Thú cưng (khung 60×60) ----------
  var THU = [
    { ma: 'hai_cau', ten: 'Hải cẩu con', gia: 40,
      ve: '<ellipse cx="27" cy="44" rx="21" ry="11" fill="#9aa8b8"/><path d="M8 44 Q2 40 4 50 Q8 48 10 47 Z" fill="#8492a3"/><circle cx="40" cy="31" r="12" fill="#a9b6c5"/><circle cx="36" cy="29" r="2.4" fill="#1b2438"/><circle cx="45" cy="29" r="2.4" fill="#1b2438"/><circle cx="36.8" cy="28.2" r=".8" fill="#fff"/><circle cx="45.8" cy="28.2" r=".8" fill="#fff"/><ellipse cx="41" cy="35" rx="3" ry="2" fill="#1b2438"/><path d="M34 36 L27 35 M34 38 L27 39 M48 36 L55 35 M48 38 L55 39" stroke="#5a6676" stroke-width=".8"/><ellipse cx="25" cy="53" rx="6" ry="2.5" fill="#8492a3"/>' },
    { ma: 'hai_au', ten: 'Chim hải âu', gia: 50,
      ve: '<ellipse cx="30" cy="36" rx="14" ry="12" fill="#fff" stroke="#d6e2ea"/><path d="M18 34 Q6 26 4 36 Q12 38 18 40 Z" fill="#b7c4cf"/><path d="M42 34 Q54 26 56 36 Q48 38 42 40 Z" fill="#b7c4cf"/><circle cx="30" cy="22" r="9" fill="#fff" stroke="#d6e2ea"/><circle cx="27" cy="21" r="1.8" fill="#1b2438"/><circle cx="33" cy="21" r="1.8" fill="#1b2438"/><path d="M28 25 L36 26 L28 28 Z" fill="#ff9f1c"/><path d="M26 47 L24 54 M34 47 L36 54" stroke="#ff9f1c" stroke-width="2"/>' },
    { ma: 'ca_voi', ten: 'Cá voi con', gia: 80,
      ve: '<path d="M6 38 Q8 22 30 22 Q50 22 52 36 Q52 48 32 50 Q12 52 6 38 Z" fill="#4c8fd6"/><path d="M12 42 Q30 52 48 42 Q40 50 30 50 Q18 50 12 42 Z" fill="#dff1ff"/><path d="M52 34 Q60 26 58 38 Q60 46 52 40 Z" fill="#3c7cc0"/><circle cx="20" cy="33" r="2.4" fill="#1b2438"/><circle cx="20.8" cy="32.2" r=".8" fill="#fff"/><circle cx="16" cy="39" r="2.5" fill="#ff9bb5" opacity=".6"/><path d="M26 20 Q24 12 20 10 M26 20 Q27 11 30 8 M26 20 Q30 13 34 12" stroke="#7fc8f8" stroke-width="2" fill="none"/>' },
    { ma: 'cao_tuyet', ten: 'Cáo tuyết', gia: 100,
      ve: '<path d="M44 44 Q60 40 56 28 Q52 36 44 38 Z" fill="#fff" stroke="#dbe5ec"/><ellipse cx="30" cy="42" rx="14" ry="10" fill="#fff" stroke="#dbe5ec"/><path d="M18 26 L20 12 L28 22 Z M42 26 L40 12 L32 22 Z" fill="#fff" stroke="#dbe5ec"/><path d="M21 21 L21.5 15 L25 20 Z M39 21 L38.5 15 L35 20 Z" fill="#ffc2d4"/><path d="M16 28 Q30 18 44 28 Q40 38 30 38 Q20 38 16 28 Z" fill="#fff" stroke="#dbe5ec"/><circle cx="25" cy="28" r="2" fill="#1b2438"/><circle cx="35" cy="28" r="2" fill="#1b2438"/><circle cx="30" cy="33" r="1.8" fill="#1b2438"/>' },
    { ma: 'gau_trang', ten: 'Gấu trắng con', gia: 120,
      ve: '<ellipse cx="30" cy="44" rx="17" ry="12" fill="#f7fbff" stroke="#dbe5ec"/><circle cx="30" cy="25" r="13" fill="#f7fbff" stroke="#dbe5ec"/><circle cx="19" cy="15" r="4.5" fill="#f7fbff" stroke="#dbe5ec"/><circle cx="41" cy="15" r="4.5" fill="#f7fbff" stroke="#dbe5ec"/><circle cx="25" cy="23" r="2.2" fill="#1b2438"/><circle cx="35" cy="23" r="2.2" fill="#1b2438"/><ellipse cx="30" cy="29" rx="5" ry="3.5" fill="#e8eef3"/><ellipse cx="30" cy="28" rx="2.2" ry="1.6" fill="#1b2438"/><circle cx="21" cy="29" r="2.4" fill="#ff9bb5" opacity=".6"/><circle cx="39" cy="29" r="2.4" fill="#ff9bb5" opacity=".6"/>' }
  ];

  // ---------- Đồ trang trí Nhà tuyết (khung 100×100). w = bề rộng theo % cảnh; troi = treo trên trời ----------
  var NHA = [
    { ma: 'bong_tuyet', ten: 'Bông tuyết', gia: 5, w: 7, troi: true,
      ve: '<g stroke="#9ad7f5" stroke-width="7" stroke-linecap="round"><path d="M50 8 L50 92 M14 29 L86 71 M14 71 L86 29"/><path d="M50 22 L40 12 M50 22 L60 12 M50 78 L40 88 M50 78 L60 88" stroke-width="5"/></g>' },
    { ma: 'dam_may', ten: 'Đám mây', gia: 8, w: 16, troi: true,
      ve: '<path d="M18 74 Q2 74 4 58 Q6 44 22 46 Q24 26 44 28 Q58 16 72 30 Q92 28 94 48 Q100 72 80 74 Z" fill="#fff" stroke="#d6eaf6" stroke-width="3"/>' },
    { ma: 'ngoi_sao', ten: 'Ngôi sao', gia: 10, w: 8, troi: true,
      ve: '<path d="M50 6 L62 38 L96 38 L68 58 L79 92 L50 72 L21 92 L32 58 L4 38 L38 38 Z" fill="#ffd23f" stroke="#e0a800" stroke-width="4"/>' },
    { ma: 'co_nheo', ten: 'Cờ đuôi nheo', gia: 12, w: 24, troi: true,
      ve: '<path d="M2 20 Q50 42 98 20" stroke="#8a5a2b" stroke-width="3" fill="none"/><path d="M10 24 L18 50 L26 28 Z" fill="#e63946"/><path d="M30 30 L38 56 L46 33 Z" fill="#ffd23f"/><path d="M52 33 L60 58 L68 31 Z" fill="#2ec4b6"/><path d="M73 29 L81 53 L88 25 Z" fill="#8e7dff"/>' },
    { ma: 'den_long', ten: 'Đèn lồng', gia: 14, w: 8,
      ve: '<path d="M50 4 L50 16" stroke="#5a3d2b" stroke-width="4"/><rect x="36" y="14" width="28" height="8" rx="3" fill="#b5651d"/><ellipse cx="50" cy="52" rx="30" ry="32" fill="#ff5c5c"/><path d="M30 30 Q50 52 30 76 M70 30 Q50 52 70 76 M50 20 L50 84" stroke="#c1121f" stroke-width="2.5" fill="none"/><rect x="36" y="82" width="28" height="8" rx="3" fill="#b5651d"/><path d="M46 90 L44 100 M54 90 L56 100 M50 90 L50 100" stroke="#ffd23f" stroke-width="2.5"/>' },
    { ma: 'cay_keo', ten: 'Cây kẹo', gia: 15, w: 7,
      ve: '<path d="M60 96 L60 30 Q60 8 40 8 Q22 8 22 26" stroke="#fff" stroke-width="16" fill="none" stroke-linecap="round"/><path d="M60 96 L60 30 Q60 8 40 8 Q22 8 22 26" stroke="#e63946" stroke-width="16" fill="none" stroke-linecap="round" stroke-dasharray="10 10"/>' },
    { ma: 'hop_qua', ten: 'Hộp quà', gia: 20, w: 9,
      ve: '<rect x="12" y="40" width="76" height="56" rx="5" fill="#8e7dff"/><rect x="6" y="28" width="88" height="18" rx="5" fill="#a798ff"/><rect x="44" y="28" width="12" height="68" fill="#ffd23f"/><path d="M50 28 Q30 4 22 18 Q20 28 50 28 Q80 28 78 18 Q70 4 50 28 Z" fill="#ffd23f"/>' },
    { ma: 'nguoi_tuyet', ten: 'Người tuyết', gia: 30, w: 13,
      ve: '<circle cx="50" cy="72" r="26" fill="#fff" stroke="#d6eaf6" stroke-width="3"/><circle cx="50" cy="34" r="18" fill="#fff" stroke="#d6eaf6" stroke-width="3"/><circle cx="43" cy="31" r="2.6" fill="#1b2438"/><circle cx="57" cy="31" r="2.6" fill="#1b2438"/><path d="M50 36 L66 40 L50 41 Z" fill="#ff9f1c"/><path d="M34 48 Q50 56 66 48 L66 54 Q50 62 34 54 Z" fill="#e63946"/><circle cx="50" cy="66" r="3" fill="#1b2438"/><circle cx="50" cy="78" r="3" fill="#1b2438"/><path d="M26 64 L8 52 M74 64 L92 52" stroke="#8a5a2b" stroke-width="4"/><rect x="36" y="10" width="28" height="8" rx="2" fill="#1b2438"/><rect x="40" y="0" width="20" height="12" rx="2" fill="#1b2438"/>' },
    { ma: 'cay_thong', ten: 'Cây thông', gia: 40, w: 15,
      ve: '<rect x="42" y="80" width="16" height="18" fill="#8a5a2b"/><path d="M50 4 L82 40 L64 40 L88 66 L66 66 L94 86 L6 86 L34 66 L12 66 L36 40 L18 40 Z" fill="#2e9e5b"/><path d="M28 62 Q50 54 72 62 M22 82 Q50 72 78 82" stroke="#fff" stroke-width="3" fill="none" opacity=".8"/><circle cx="40" cy="48" r="4" fill="#e63946"/><circle cx="62" cy="58" r="4" fill="#ffd23f"/><circle cx="34" cy="74" r="4" fill="#4cc9f0"/><circle cx="66" cy="76" r="4" fill="#ff5c8a"/><path d="M50 0 L53 8 L61 8 L55 13 L57 21 L50 16 L43 21 L45 13 L39 8 L47 8 Z" fill="#ffd23f"/>' },
    { ma: 'banh_kem', ten: 'Bánh kem', gia: 50, w: 10,
      ve: '<rect x="14" y="54" width="72" height="40" rx="6" fill="#ffb3c6"/><path d="M14 62 Q24 72 34 62 Q44 72 54 62 Q64 72 74 62 Q80 68 86 62 L86 54 L14 54 Z" fill="#fff"/><rect x="22" y="34" width="56" height="22" rx="5" fill="#fff3c4"/><rect x="47" y="14" width="6" height="20" fill="#4cc9f0"/><path d="M50 4 Q56 10 50 14 Q44 10 50 4 Z" fill="#ff9f1c"/><circle cx="30" cy="76" r="3.5" fill="#e63946"/><circle cx="50" cy="80" r="3.5" fill="#e63946"/><circle cx="70" cy="76" r="3.5" fill="#e63946"/>' },
    { ma: 'xe_truot', ten: 'Xe trượt tuyết', gia: 60, w: 16,
      ve: '<path d="M10 76 L82 76 Q96 76 94 62" stroke="#8a5a2b" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="16" y="42" width="66" height="24" rx="5" fill="#e63946"/><path d="M24 66 L24 76 M74 66 L74 76" stroke="#8a5a2b" stroke-width="5"/><rect x="22" y="46" width="54" height="5" rx="2" fill="#ffd23f"/>' },
    { ma: 'ho_ca', ten: 'Hồ cá', gia: 70, w: 20,
      ve: '<ellipse cx="50" cy="62" rx="46" ry="22" fill="#cfe9f7" stroke="#9ad7f5" stroke-width="4"/><ellipse cx="50" cy="64" rx="38" ry="15" fill="#4cc9f0"/><path d="M30 62 Q38 56 46 62 Q38 68 30 62 Z M46 62 L52 57 L52 67 Z" fill="#ff9f1c"/><path d="M58 68 Q64 63 70 68 Q64 73 58 68 Z M70 68 L75 64 L75 72 Z" fill="#ff5c8a"/><ellipse cx="40" cy="58" rx="6" ry="2" fill="#fff" opacity=".6"/>' },
    { ma: 'cau_truot', ten: 'Cầu trượt tuyết', gia: 90, w: 24,
      ve: '<path d="M70 96 L70 26 L88 26 L88 96" stroke="#7fbfdf" stroke-width="6" fill="none"/><path d="M70 40 L88 40 M70 54 L88 54 M70 68 L88 68 M70 82 L88 82" stroke="#7fbfdf" stroke-width="4"/><path d="M70 28 Q40 30 30 70 Q24 92 6 94 L6 100 Q34 100 40 76 Q48 40 72 38 Z" fill="#cfe9f7" stroke="#9ad7f5" stroke-width="3"/>' },
    { ma: 'leu_tuyet', ten: 'Lều tuyết', gia: 110, w: 24,
      ve: '<path d="M4 92 Q4 22 50 22 Q96 22 96 92 Z" fill="#fff" stroke="#bcdcee" stroke-width="3"/><path d="M8 72 L92 72 M14 52 L86 52 M26 34 L74 34 M30 92 L30 72 M60 72 L60 52 M40 52 L40 34 M70 92 L70 72 M50 34 L50 22" stroke="#bcdcee" stroke-width="2.5"/><path d="M36 92 Q36 64 50 64 Q64 64 64 92 Z" fill="#2b3a55"/>' },
    { ma: 'cau_vong', ten: 'Cầu vồng', gia: 120, w: 30, troi: true,
      ve: '<path d="M4 90 A46 46 0 0 1 96 90" stroke="#e63946" stroke-width="8" fill="none"/><path d="M12 90 A38 38 0 0 1 88 90" stroke="#ff9f1c" stroke-width="8" fill="none"/><path d="M20 90 A30 30 0 0 1 80 90" stroke="#ffd23f" stroke-width="8" fill="none"/><path d="M28 90 A22 22 0 0 1 72 90" stroke="#2ec4b6" stroke-width="8" fill="none"/><path d="M36 90 A14 14 0 0 1 64 90" stroke="#8e7dff" stroke-width="8" fill="none"/>' },
    { ma: 'ca_voi_phun', ten: 'Cá voi phun nước', gia: 150, w: 24,
      ve: '<path d="M6 70 Q8 44 44 44 Q78 44 82 64 Q82 84 50 86 Q18 88 6 70 Z" fill="#4c8fd6"/><path d="M14 74 Q44 92 76 74 Q66 86 48 86 Q26 86 14 74 Z" fill="#dff1ff"/><path d="M82 62 Q96 50 94 66 Q98 80 82 70 Z" fill="#3c7cc0"/><circle cx="28" cy="62" r="4" fill="#1b2438"/><circle cx="29.5" cy="60.5" r="1.4" fill="#fff"/><path d="M44 42 Q40 22 30 18 M44 42 Q46 18 54 12 M44 42 Q52 24 62 22" stroke="#7fc8f8" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="30" cy="16" r="3" fill="#7fc8f8"/><circle cx="55" cy="10" r="3" fill="#7fc8f8"/><circle cx="63" cy="21" r="3" fill="#7fc8f8"/>' }
  ];

  var THEO_MA = {};
  PK.forEach(function (p) { p.loai = 'deo'; THEO_MA[p.ma] = p; });
  MAU.forEach(function (p) { THEO_MA[p.ma] = p; });
  THU.forEach(function (p) { p.loai = 'thu'; THEO_MA[p.ma] = p; });
  NHA.forEach(function (p) { p.loai = 'nha'; THEO_MA[p.ma] = p; });

  function tuiDo() {
    var be = TV.beHienTai();
    if (!be.phuKien) be.phuKien = { co: [], deo: {} };
    return be.phuKien;
  }
  function nha() {
    var be = TV.beHienTai();
    if (!be.nha) be.nha = { co: [], dat: [] };
    return be.nha;
  }
  function coMon(ma) { var p = THEO_MA[ma]; return p.gia === 0 || (p.loai === 'nha' ? nha().co : tuiDo().co).indexOf(ma) >= 0; }

  // ---------- Vẽ cánh cụt của bé ----------
  function lopPhuKien(deo) {
    var h = '';
    THU_TU_VE.forEach(function (cho) { var p = THEO_MA[(deo || {})[cho]]; if (p) h += p.ve; });
    return h;
  }
  function hinhThu(ma) { var p = THEO_MA[ma]; return p ? '<svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + p.ve + '</svg>' : ''; }
  TV.hinhCuaBe = function (mauKhan) {
    var tui = tuiDo(), khan = THEO_MA[tui.khan] || MAU[0], than = THEO_MA[tui.than] || MAU[6];
    var s = TV.hinhCanhCut(null, mauKhan || khan.mau);
    if (than.ma !== 'than_den') s = s.split('#2b3a55').join(than.mau).split('#22304a').join(than.toi);
    return s.replace('</svg>', lopPhuKien(tui.deo) + '</svg>');
  };
  // Cánh cụt kèm thú cưng đứng cạnh (nếu có)
  TV.hinhCuaBeVaThu = function (mauKhan) {
    var thu = tuiDo().thu;
    return '<span class="cc-be">' + TV.hinhCuaBe(mauKhan) + (thu ? '<span class="thu-cung">' + hinhThu(thu) + '</span>' : '') + '</span>';
  };
  function veLinhVat() {
    $('linhVat').innerHTML = TV.hinhCuaBeVaThu();
    $('linhVatHoi').innerHTML = TV.hinhCuaBeVaThu();
  }
  veLinhVat();
  var moChinhCu = TV.khiMoMan.manChinh;
  TV.khiMoMan.manChinh = function () { if (moChinhCu) moChinhCu(); veLinhVat(); };
  TV.khiMoMan.manHoi = function () { $('linhVatHoi').innerHTML = TV.hinhCuaBeVaThu(); };

  // ---------- Màn cửa hàng ----------
  var tab = 'deo';
  var TEN_TAB = { deo: '🎩 Đồ đeo', mau: '🎨 Màu', nha: '🏠 Nhà tuyết', thu: '🐾 Thú cưng' };
  function capNhatCa() {
    var be = TV.beHienTai(), soCa = document.querySelectorAll('.so-ca b');
    for (var i = 0; i < soCa.length; i++) soCa[i].textContent = be.ca;
    if ($('caCuaHang')) $('caCuaHang').textContent = be.ca;
  }
  function veCuaHang() {
    var tui = tuiDo(), ca = TV.beHienTai().ca, h = '', t = '';
    $('xemTruocCc').innerHTML = TV.hinhCuaBeVaThu();
    capNhatCa();
    ['deo', 'mau', 'nha', 'thu'].forEach(function (k) { t += '<button class="chip' + (k === tab ? ' chon' : '') + '" data-tab="' + k + '">' + TEN_TAB[k] + '</button>'; });
    $('tabShop').innerHTML = t;
    var ds = tab === 'deo' ? PK : tab === 'mau' ? MAU : tab === 'thu' ? THU : NHA;
    ds = ds.slice().sort(function (a, b) { return a.gia - b.gia; });
    ds.forEach(function (p) {
      var co = coMon(p.ma), dung = false, anh, chu;
      if (p.loai === 'deo') { dung = tui.deo[p.cho] === p.ma; anh = TV.hinhCanhCut(null, '#dfe7ee').replace('</svg>', p.ve + '</svg>'); }
      else if (p.loai === 'khan' || p.loai === 'than') {
        dung = (p.loai === 'khan' ? (tui.khan || 'khan_hong') : (tui.than || 'than_den')) === p.ma;
        anh = p.loai === 'khan' ? TV.hinhCanhCut(null, p.mau) : TV.hinhCanhCut(null, '#dfe7ee').split('#2b3a55').join(p.mau).split('#22304a').join(p.toi);
      }
      else if (p.loai === 'thu') { dung = tui.thu === p.ma; anh = hinhThu(p.ma); }
      else { var daDat = nha().dat.some(function (x) { return x.ma === p.ma; }); dung = daDat; anh = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' + p.ve + '</svg>'; }
      if (p.loai === 'nha') chu = !co ? '🐟 ' + p.gia : dung ? '🏠 Đã đặt' : '📦 Trong kho';
      else chu = dung ? (p.loai === 'thu' ? '✔ Đang dắt' : p.loai === 'deo' ? '✔ Đang đeo' : '✔ Đang dùng') : co ? 'Chạm để dùng' : '🐟 ' + p.gia;
      h += '<button class="mon-do loai-' + p.loai + (dung ? ' dang-deo' : co ? ' da-co' : ca >= p.gia ? '' : ' thieu') + (p.gia >= 60 && !co ? ' mo-uoc' : '') + '" data-ma="' + p.ma + '">' +
        '<span class="anh-do">' + anh + '</span><b>' + p.ten + '</b><i>' + chu + '</i></button>';
    });
    $('dsDo').innerHTML = h;
    var nut = $('dsDo').querySelectorAll('.mon-do');
    for (var i = 0; i < nut.length; i++) nut[i].addEventListener('click', function () { chamDo(this.getAttribute('data-ma'), this); });
    var nt = $('tabShop').querySelectorAll('[data-tab]');
    for (var j = 0; j < nt.length; j++) nt[j].addEventListener('click', function () { am('bam'); tab = this.getAttribute('data-tab'); veCuaHang(); });
    $('nutVaoNha').style.display = tab === 'nha' ? '' : 'none';
  }
  function noiCuaHang(chu) { $('loiCuaHang').textContent = chu; }
  function dung(p) { // đeo / dùng món đã có (bấm lại thì tháo, trừ màu)
    var tui = tuiDo();
    if (p.loai === 'deo') {
      if (tui.deo[p.cho] === p.ma) { delete tui.deo[p.cho]; noiCuaHang('Đã tháo ' + p.ten.toLowerCase() + '.'); return; }
      tui.deo[p.cho] = p.ma; noiCuaHang('Cánh cụt đeo ' + p.ten.toLowerCase() + ' ở ' + TEN_CHO[p.cho] + ' rồi!');
    } else if (p.loai === 'khan') { tui.khan = p.ma; noiCuaHang('Cánh cụt quàng ' + p.ten.toLowerCase() + ' rồi!'); }
    else if (p.loai === 'than') { tui.than = p.ma; noiCuaHang('Cánh cụt đổi sang ' + p.ten.toLowerCase() + ' rồi!'); }
    else if (p.loai === 'thu') {
      if (tui.thu === p.ma) { tui.thu = null; noiCuaHang(p.ten + ' về nhà nghỉ rồi.'); return; }
      tui.thu = p.ma; noiCuaHang(p.ten + ' đi theo cánh cụt rồi!');
    }
  }
  function chamDo(ma, nut) {
    var p = THEO_MA[ma], be = TV.beHienTai();
    if (p.loai === 'nha') {
      if (coMon(ma)) { am('bam'); noiCuaHang('Món này có rồi. Vào Nhà tuyết để đặt nhé!'); return; }
      if (be.ca < p.gia) { am('sai'); TV.hieuUng(nut, 'lac-ngang', 320); noiCuaHang('Con cần thêm ' + (p.gia - be.ca) + ' cá nữa nhé! Chơi thêm để bắt cá nào!'); return; }
      be.ca -= p.gia; nha().co.push(ma);
      am('thang'); TV.phaoGiay();
      noiCuaHang('Đẹp quá! Cánh cụt thích lắm! ' + p.ten + ' đã vào kho, vào Nhà tuyết để đặt nhé.');
    } else if (coMon(ma)) { am('chon'); dung(p); }
    else if (be.ca >= p.gia) {
      be.ca -= p.gia; tuiDo().co.push(ma); dung(p);
      am('thang'); TV.phaoGiay();
      noiCuaHang('Đẹp quá! Cánh cụt thích lắm!');
    } else {
      am('sai'); TV.hieuUng(nut, 'lac-ngang', 320);
      noiCuaHang('Con cần thêm ' + (p.gia - be.ca) + ' cá nữa nhé! Chơi thêm để bắt cá nào!');
      return;
    }
    TV.ghiLuu();
    veCuaHang();
    TV.hieuUng($('xemTruocCc'), 'vui', 700);
  }
  TV.khiMoMan.manCuaHang = function () { noiCuaHang('Con muốn mua gì cho cánh cụt nào?'); veCuaHang(); };
  $('nutCuaHang').addEventListener('click', function () { am('bam'); TV.moMan('manCuaHang'); });
  document.querySelector('.so-ca-chinh').addEventListener('click', function () { am('bam'); TV.moMan('manCuaHang'); });
  $('nutVaoNha').addEventListener('click', function () { am('bam'); TV.moMan('manNhaBang'); });

  // ---------- Màn Nhà tuyết ----------
  var chon = -1;   // món đang chọn (để hiện nút ✕ cất)
  // Giữ món đồ nằm trọn trong cảnh: đồ neo ở cạnh dưới giữa, cao bằng rộng (khung 100×100), cảnh 16:10 (rà 0.10.1)
  function kep(d, p) {
    var nuaW = p.w / 2, cao = p.w * 1.6;
    // làm tròn trước rồi mới kẹp theo cận đã làm tròn vào trong, để không lố mép 2–4 px (rà 0.10.2)
    d.x = Math.max(Math.ceil(nuaW), Math.min(Math.floor(100 - nuaW), Math.round(d.x)));
    d.y = Math.max(Math.ceil(Math.min(cao + 1, 96)), Math.min(98, Math.round(d.y)));
  }
  function veNha() {
    var n = nha(), h = '';
    // Cánh cụt và thú cưng đứng giữa nhà, luôn đứng trước đồ trang trí (0.10.4); món đang chọn nổi trên cả cánh cụt
    h += '<span class="vat nha-cc" style="left:50%;top:78%;width:16%;z-index:500">' + TV.hinhCuaBeVaThu() + '</span>';
    n.dat.forEach(function (d, i) {
      var p = THEO_MA[d.ma]; if (!p) return;
      kep(d, p);   // đồ đang kẹt sát mép (bản cũ) tự về trong cảnh
      h += '<span class="vat' + (i === chon ? ' chon' : '') + '" data-i="' + i + '" style="left:' + d.x + '%;top:' + d.y + '%;width:' + p.w + '%;z-index:' + (i === chon ? 600 : 100 + i) + '">' +
        '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">' + p.ve + '</svg>' + (i === chon ? '<button class="cat-vat' + (d.y - p.w * 1.6 < 12 ? ' cat-duoi' : '') + (d.x + p.w / 2 > 96 ? ' cat-trong' : '') + '" data-cat="' + i + '" aria-label="Cất">✕</button>' : '') + '</span>';
    });
    $('canhNha').innerHTML = '<div class="nen-troi"></div><div class="nen-tuyet"></div>' + h;
    // Kho: món đã mua nhưng chưa đặt
    var kho = n.co.filter(function (ma) { return !n.dat.some(function (x) { return x.ma === ma; }); });
    var k = '';
    kho.forEach(function (ma) { var p = THEO_MA[ma]; k += '<button class="mon-kho" data-dat="' + ma + '"><svg viewBox="0 0 100 100">' + p.ve + '</svg><b>' + p.ten + '</b></button>'; });
    $('khoNha').innerHTML = k || '<p class="ph-ghi">' + (n.co.length ? 'Đã đặt hết đồ rồi! Kéo để đổi chỗ, chạm vào món đồ rồi bấm ✕ để cất.' : 'Kho trống. Vào cửa hàng, tab Nhà tuyết để mua đồ trang trí nhé!') + '</p>';
    $('loiNha').textContent = n.dat.length ? 'Kéo đồ để đổi chỗ. Chạm vào một món rồi bấm ✕ để cất vào kho.' : kho.length ? 'Chạm vào đồ trong kho để đặt vào nhà nhé!' : 'Nhà còn trống, mua đồ ở cửa hàng nhé!';
    ganKeo();
    var kd = $('khoNha').querySelectorAll('[data-dat]');
    for (var i = 0; i < kd.length; i++) kd[i].addEventListener('click', function () { datRa(this.getAttribute('data-dat')); });
    var ct = $('canhNha').querySelectorAll('[data-cat]');
    for (var j = 0; j < ct.length; j++) ct[j].addEventListener('pointerdown', function (e) {
      e.stopPropagation(); e.preventDefault();
      am('bam'); nha().dat.splice(+this.getAttribute('data-cat'), 1); chon = -1; TV.ghiLuu(); veNha();
    });
  }
  function datRa(ma) {
    var p = THEO_MA[ma];
    var x = 12 + Math.random() * 76, y = p.troi ? 10 + Math.random() * 22 : 58 + Math.random() * 30;
    if (!p.troi && x > 38 && x < 62) x = x < 50 ? 30 : 70;   // không đặt chồng lên cánh cụt
    nha().dat.push({ ma: ma, x: Math.round(x), y: Math.round(y) });
    chon = -1; am('chon'); TV.ghiLuu(); veNha();
  }
  function ganKeo() { // kéo để đổi chỗ, chạm (không kéo) để chọn
    var canh = $('canhNha'), vat = canh.querySelectorAll('.vat[data-i]');
    for (var i = 0; i < vat.length; i++) (function (el) {
      var idx = +el.getAttribute('data-i'), bd = null;
      el.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        var r0 = canh.getBoundingClientRect(), d0 = nha().dat[idx];
        // nhớ độ lệch giữa ngón tay và điểm neo, để món không nhảy khi bắt đầu kéo (rà 0.10.1)
        bd = { x: e.clientX, y: e.clientY, keo: false,
          lx: (e.clientX - r0.left) / r0.width * 100 - d0.x, ly: (e.clientY - r0.top) / r0.height * 100 - d0.y };
        try { el.setPointerCapture(e.pointerId); } catch (er) { /* máy cũ không có */ }
      });
      el.addEventListener('pointermove', function (e) {
        if (!bd) return;
        if (!bd.keo && Math.abs(e.clientX - bd.x) + Math.abs(e.clientY - bd.y) < 6) return;
        bd.keo = true;
        var r = canh.getBoundingClientRect(), d = nha().dat[idx];
        d.x = (e.clientX - r.left) / r.width * 100 - bd.lx;
        d.y = (e.clientY - r.top) / r.height * 100 - bd.ly;
        kep(d, THEO_MA[d.ma]);
        el.style.left = d.x + '%'; el.style.top = d.y + '%'; el.style.zIndex = 999;   // đang kéo thì nổi lên trên
      });
      el.addEventListener('pointerup', function () {
        if (!bd) return;
        var keo = bd.keo; bd = null;
        if (keo) {   // món vừa kéo xếp lên trên cùng, không bị món khác che (rà 0.10.0)
          var ds = nha().dat; ds.push(ds.splice(idx, 1)[0]); chon = -1; TV.ghiLuu(); veNha(); return;
        }
        am('bam'); chon = chon === idx ? -1 : idx; veNha();
      });
      el.addEventListener('pointercancel', function () { bd = null; });
    })(vat[i]);
  }
  TV.khiMoMan.manNhaBang = function () { chon = -1; capNhatCa(); veNha(); };
  $('nutNhaBang').addEventListener('click', function () { am('bam'); TV.moMan('manNhaBang'); });
  $('nutMuaDoNha').addEventListener('click', function () { am('bam'); tab = 'nha'; TV.moMan('manCuaHang'); });

  TV.PHU_KIEN = PK;
  TV.CUA_HANG = { PK: PK, MAU: MAU, THU: THU, NHA: NHA, THEO_MA: THEO_MA, datRa: datRa, chamDo: chamDo };
})();
