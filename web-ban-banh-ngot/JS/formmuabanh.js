document.addEventListener("DOMContentLoaded", () => {
    // Trang này bắt buộc đăng nhập và phải có bánh trong giỏ
    if (!requireLogin()) return;
    var giohang = getCart();
    if (giohang.length === 0) {
        window.location.replace("gio-hang.html");
        return;
    }

    var user = getCurrentUser();
    var form = document.getElementById("orderForm");
    var ht = document.getElementById("name");
    var sdt = document.getElementById("phone");
    var email = document.getElementById("email");
    var diachi = document.getElementById("address");
    var ngay = document.getElementById("date");
    var gio = document.getElementById("time");
    var chuBanh = document.getElementById("cakeText");
    var ghichu = document.getElementById("note");

    // Điền sẵn thông tin của tài khoản đang đăng nhập
    ht.value = user.name;
    email.value = user.email;
    sdt.value = user.phone || "";
    ngay.min = layNgayMai(); // chỉ cho chọn từ ngày mai trở đi

    // Tóm tắt đơn hàng bên phải
    var t = calcTotal(giohang);
    document.getElementById("summary").innerHTML = `
        <h2 class="h5 mb-3">Đơn hàng của bạn</h2>
        ${giohang.map(item => {
            var p = findProduct(item.id);
            return `<div class="summary-line"><span>${esc(p.name)} x ${item.sl}</span><span>${formatPrice(p.gia * item.sl)}</span></div>`;
        }).join("")}
        <hr>
        <div class="summary-line"><span>Phí giao hàng</span><span>${t.ship ? formatPrice(t.ship) : "Miễn phí"}</span></div>
        <div class="summary-line summary-total"><span>Tổng cộng</span><span>${formatPrice(t.tongTien)}</span></div>`;

    // Kiểm tra ngay khi người dùng rời ô nhập / gõ lại
    ganKiemTra(ht, () => kiemtraTen(ht.value));
    ganKiemTra(sdt, () => kiemtraSDT(sdt.value));
    ganKiemTra(email, () => kiemtraEmail(email.value));
    ganKiemTra(diachi, () => kiemtraDiaChi(diachi.value));
    ganKiemTra(ngay, () => kiemtraNgay(ngay.value));
    ganKiemTra(gio, () => kiemtraChon(gio.value));
    ganKiemTra(chuBanh, () => kiemtraChuBanh(chuBanh.value));
    ganKiemTra(ghichu, () => kiemtraGhiChu(ghichu.value));

    // Kiểm tra toàn bộ form, đúng hết thì trả về true
    function kiemtra() {
        var ok = true;
        if (!hienKetQua(ht, kiemtraTen(ht.value))) ok = false;
        if (!hienKetQua(sdt, kiemtraSDT(sdt.value))) ok = false;
        if (!hienKetQua(email, kiemtraEmail(email.value))) ok = false;
        if (!hienKetQua(diachi, kiemtraDiaChi(diachi.value))) ok = false;
        if (!hienKetQua(ngay, kiemtraNgay(ngay.value))) ok = false;
        if (!hienKetQua(gio, kiemtraChon(gio.value))) ok = false;
        if (!hienKetQua(chuBanh, kiemtraChuBanh(chuBanh.value))) ok = false;
        if (!hienKetQua(ghichu, kiemtraGhiChu(ghichu.value))) ok = false;
        return ok;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!kiemtra()) {
            focusLoiDauTien(form);
            return;
        }

        // Gom thông tin người nhận
        var info = {
            name: ht.value.trim().replace(/\s+/g, " "),
            phone: sdt.value.replace(/[\s.]/g, ""),
            email: email.value.trim(),
            address: diachi.value.trim().replace(/\s+/g, " "),
            date: ngay.value,
            time: gio.value,
            cakeText: chuBanh.value.trim(),
            note: ghichu.value.trim(),
            pay: document.querySelector('input[name="pay"]:checked').value
        };

        var order = placeOrder(info);
        if (!order) {
            showToast("Không thể đặt hàng. Vui lòng thử lại.", "error");
            return;
        }

        // Đặt xong: thay form bằng thông báo thành công
        document.getElementById("orderRow").innerHTML = `
            <div class="col-lg-7 mx-auto">
                <div class="panel text-center py-5">
                    <i class="bi bi-check-circle" style="font-size:56px;color:var(--pink)"></i>
                    <h2 class="mt-3">Đặt bánh thành công!</h2>
                    <p>Mã đơn hàng: <strong>${order.id}</strong></p>
                    <p class="text-muted">Chúng mình sẽ liên hệ qua số ${esc(info.phone)} để xác nhận đơn.
                        Nhận bánh ngày ${esc(info.date.split("-").reverse().join("/"))}, khung giờ ${esc(info.time)}.</p>
                    <a class="btn-pink text-decoration-none me-2" href="don-hang.html?id=${order.id}">Xem đơn hàng</a>
                    <a class="btn-outline-pink text-decoration-none" href="index.html">Về trang chủ</a>
                </div>
            </div>`;
        showToast("Đặt bánh thành công!");
    });
});
