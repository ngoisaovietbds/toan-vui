/* Tự sinh bởi cong-cu/tao_ban_web.py, đừng sửa tay. Lưu sẵn toàn bộ game để chơi không cần mạng. */
var BO_NHO = 'toanvui-0.11.0-5acabcbd';
var FILE = ["./", "./cachlam.js", "./choicung.js", "./cuahang.js", "./game.css", "./game.js", "./giong/cau-doc.js", "./giong/co-san.js", "./giong/g_bm_hoi.m4a", "./giong/g_bm_xong.m4a", "./giong/g_ch_chao.m4a", "./giong/g_ch_mua.m4a", "./giong/g_ch_thieu.m4a", "./giong/g_chao.m4a", "./giong/g_cl_buoc.m4a", "./giong/g_cl_chon.m4a", "./giong/g_cl_dung.m4a", "./giong/g_cl_gop.m4a", "./giong/g_cl_gop_bo.m4a", "./giong/g_cl_muoi.m4a", "./giong/g_cl_phai.m4a", "./giong/g_cl_tach.m4a", "./giong/g_cl_tach_tru.m4a", "./giong/g_cl_thao.m4a", "./giong/g_cl_trai.m4a", "./giong/g_con_2_phut.m4a", "./giong/g_ct_cong.m4a", "./giong/g_ct_dv.m4a", "./giong/g_ct_goiy_dem.m4a", "./giong/g_ct_goiy_gach.m4a", "./giong/g_ct_muon.m4a", "./giong/g_ct_nho.m4a", "./giong/g_ct_tru.m4a", "./giong/g_dem_de.m4a", "./giong/g_dem_goiy.m4a", "./giong/g_dk_bm_thang.m4a", "./giong/g_dk_con_thang.m4a", "./giong/g_dk_hoa.m4a", "./giong/g_dung_1.m4a", "./giong/g_dung_2.m4a", "./giong/g_dung_3.m4a", "./giong/g_dung_4.m4a", "./giong/g_dung_5.m4a", "./giong/g_hoan_thanh.m4a", "./giong/g_lb_chuc.m4a", "./giong/g_lb_de.m4a", "./giong/g_lb_dv.m4a", "./giong/g_lb_goiy.m4a", "./giong/g_len_cap.m4a", "./giong/g_mo_bot.m4a", "./giong/g_mo_chiadoi.m4a", "./giong/g_mo_gapdoi.m4a", "./giong/g_mo_giadinh.m4a", "./giong/g_mo_kyluc.m4a", "./giong/g_mo_luoi.m4a", "./giong/g_mo_them.m4a", "./giong/g_mo_x10.m4a", "./giong/g_mo_x5.m4a", "./giong/g_nc_b2.m4a", "./giong/g_nc_b4.m4a", "./giong/g_nc_b5.m4a", "./giong/g_nc_bang.m4a", "./giong/g_nc_chia.m4a", "./giong/g_nc_deu.m4a", "./giong/g_nc_goiy_chia.m4a", "./giong/g_nc_goiy_nhan.m4a", "./giong/g_nc_het.m4a", "./giong/g_nc_lay.m4a", "./giong/g_nc_nhan.m4a", "./giong/g_nc_nhay.m4a", "./giong/g_nc_nhom.m4a", "./giong/g_nc_ve0.m4a", "./giong/g_nc_xoay.m4a", "./giong/g_nghi.m4a", "./giong/g_sai_1.m4a", "./giong/g_st_de.m4a", "./giong/g_st_goiy.m4a", "./giong/g_tu_sua.m4a", "./giong/g_xep_xong.m4a", "./giong/g_xh_canh.m4a", "./giong/g_xh_de.m4a", "./giong/g_xh_de_giam.m4a", "./giong/g_xh_goiy.m4a", "./giong/g_xh_sai.m4a", "./giong/g_xh_sai_giam.m4a", "./giong/g_xuat_sac.m4a", "./giong.js", "./hoi.js", "./icon-192.png", "./icon-512.png", "./index.html", "./luyen.js", "./manifest.json", "./phuhuynh.js"];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(BO_NHO).then(function (c) { return c.addAll(FILE.map(function (f) { return new Request(f, { cache: 'reload' }); })); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k.indexOf('toanvui-') === 0 && k !== BO_NHO; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
// Lấy từ bộ nhớ trên máy trước (chạy nhanh, không cần mạng); không có mới tải về rồi cất lại
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin || /version\.json$/.test(u.pathname)) return;   // version.json luôn hỏi mạng
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(function (r) {
    return r || fetch(e.request).then(function (m) {
      if (m.ok) { var b = m.clone(); caches.open(BO_NHO).then(function (c) { c.put(e.request, b); }); }
      return m;
    });
  }));
});
