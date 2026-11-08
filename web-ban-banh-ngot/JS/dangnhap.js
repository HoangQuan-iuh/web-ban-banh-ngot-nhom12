document.addEventListener("DOMContentLoaded", () => {
    // Đã đăng nhập rồi thì chuyển đi luôn
    if (getCurrentUser()) {
        window.location.replace(getNextUrl());
        return;
    }

    // Giữ lại trang cần quay về (?next=...) khi bấm sang trang đăng ký
    var next = new URLSearchParams(location.search).get("next");
    if (next) {
        document.getElementById("toRegister").href = "dangky.html?next=" + encodeURIComponent(next);
    }

    var form = document.getElementById("loginForm");
    var alertBox = document.getElementById("formAlert");
    var email = document.getElementById("email");
    var matkhau = document.getElementById("password");

    ganKiemTra(email, () => kiemtraEmail(email.value));
    ganKiemTra(matkhau, () => kiemtraMKDangNhap(matkhau.value));

    function kiemtra() {
        var ok = true;
        if (!hienKetQua(email, kiemtraEmail(email.value))) ok = false;
        if (!hienKetQua(matkhau, kiemtraMKDangNhap(matkhau.value))) ok = false;
        return ok;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        alertBox.classList.add("d-none");

        if (!kiemtra()) {
            focusLoiDauTien(form);
            return;
        }

        var loi = loginUser(email.value, matkhau.value);
        if (loi) {
            // Sai email hoặc mật khẩu
            alertBox.textContent = loi;
            alertBox.classList.remove("d-none");
        } else {
            window.location.href = getNextUrl();
        }
    });
});
