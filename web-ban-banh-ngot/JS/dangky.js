document.addEventListener("DOMContentLoaded", () => {
    // Đã đăng nhập rồi thì không cần đăng ký nữa
    if (getCurrentUser()) {
        window.location.replace(getNextUrl());
        return;
    }

    // Giữ lại trang cần quay về (?next=...) khi bấm sang trang đăng nhập
    var next = new URLSearchParams(location.search).get("next");
    if (next) {
        document.getElementById("toLogin").href = "dangnhap.html?next=" + encodeURIComponent(next);
    }

    var form = document.getElementById("registerForm");
    var alertBox = document.getElementById("formAlert");
    var ht = document.getElementById("name");
    var email = document.getElementById("email");
    var sdt = document.getElementById("phone");
    var matkhau = document.getElementById("password");
    var nhaplai = document.getElementById("confirm");
    var dongy = document.getElementById("terms");

    // Kiểm tra ngay khi người dùng rời ô nhập / gõ lại
    ganKiemTra(ht, () => kiemtraTen(ht.value));
    ganKiemTra(email, () => kiemtraEmail(email.value));
    ganKiemTra(sdt, () => kiemtraSDT(sdt.value));
    ganKiemTra(matkhau, () => kiemtraMatKhau(matkhau.value));
    ganKiemTra(nhaplai, () => kiemtraNhapLaiMK(matkhau.value, nhaplai.value));
    ganKiemTra(dongy, () => kiemtraDongY(dongy));

    // Gõ lại mật khẩu thì kiểm tra lại ô nhập lại mật khẩu
    matkhau.addEventListener("input", () => {
        if (nhaplai.value !== "") {
            hienKetQua(nhaplai, kiemtraNhapLaiMK(matkhau.value, nhaplai.value));
        }
    });

    // Kiểm tra toàn bộ form, đúng hết thì trả về true
    function kiemtra() {
        var ok = true;
        if (!hienKetQua(ht, kiemtraTen(ht.value))) ok = false;
        if (!hienKetQua(email, kiemtraEmail(email.value))) ok = false;
        if (!hienKetQua(sdt, kiemtraSDT(sdt.value))) ok = false;
        if (!hienKetQua(matkhau, kiemtraMatKhau(matkhau.value))) ok = false;
        if (!hienKetQua(nhaplai, kiemtraNhapLaiMK(matkhau.value, nhaplai.value))) ok = false;
        if (!hienKetQua(dongy, kiemtraDongY(dongy))) ok = false;
        return ok;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Ngăn chặn load lại trang
        alertBox.classList.add("d-none");

        if (!kiemtra()) {
            focusLoiDauTien(form);
            return;
        }

        var loi = registerUser(ht.value, email.value, sdt.value, matkhau.value);
        if (loi) {
            // Ví dụ: email đã tồn tại
            alertBox.textContent = loi;
            alertBox.classList.remove("d-none");
        } else {
            window.location.href = getNextUrl();
        }
    });
});
