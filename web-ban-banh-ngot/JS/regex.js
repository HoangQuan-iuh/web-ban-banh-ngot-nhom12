
// Chữ cái tiếng Việt có dấu (ghép vào các regex bên dưới)
var chuCai = "A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠ-ỹ";

var regTen = new RegExp("^[" + chuCai + "]+([ '’-][" + chuCai + "]+)+$"); // ít nhất 2 từ, chỉ có chữ cái (giữa các từ có thể là dấu cách, - hoặc ')
var regEmail = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
var regSDT = /^(0|\+84)[35789]\d{8}$/; // 10 số, bắt đầu bằng 03, 05, 07, 08, 09 (hoặc +84 thay cho số 0)
var regDiaChi = new RegExp("^[" + chuCai + "0-9 ,./#()-]{10,150}$");
var regChuBanh = new RegExp("^[" + chuCai + "0-9 ,.!'’-]{0,40}$"); // chữ viết lên bánh, tối đa 40 ký tự
var regSoNguyen = /^\d+$/;
var regTrangNoiBo = /^[a-z0-9-]+\.html(\?[\w=&%.-]*)?$/i; // chỉ cho quay lại trang .html trong web

// ---------- CÁC HÀM KIỂM TRA ----------
function kiemtraTen(v) {
    v = v.trim().replace(/\s+/g, " ").normalize("NFC"); // gộp nhiều khoảng trắng thành 1
    if (!regTen.test(v) || v.length > 50) {
        return "Nhập họ tên đầy đủ (ít nhất 2 từ, chỉ gồm chữ cái).";
    }
    return "";
}

function kiemtraEmail(v) {
    if (!regEmail.test(v.trim())) {
        return "Email không hợp lệ (ví dụ: tenban@gmail.com).";
    }
    return "";
}

function kiemtraSDT(v) {
    v = v.replace(/[\s.]/g, ""); // bỏ khoảng trắng và dấu chấm: 091.234.5678 -> 0912345678
    if (!regSDT.test(v)) {
        return "Số điện thoại không hợp lệ (10 số, bắt đầu bằng 03, 05, 07, 08 hoặc 09).";
    }
    return "";
}

// Mật khẩu: mỗi điều kiện kiểm tra bằng 1 regex đơn giản
function kiemtraMatKhau(v) {
    if (v.length < 8 || v.length > 32) return "Mật khẩu phải từ 8 đến 32 ký tự.";
    if (/\s/.test(v)) return "Mật khẩu không được chứa khoảng trắng.";
    if (!/[a-z]/.test(v)) return "Mật khẩu phải có ít nhất 1 chữ thường.";
    if (!/[A-Z]/.test(v)) return "Mật khẩu phải có ít nhất 1 chữ hoa.";
    if (!/\d/.test(v)) return "Mật khẩu phải có ít nhất 1 chữ số.";
    return "";
}

function kiemtraMKDangNhap(v) {
    if (v === "") return "Vui lòng nhập mật khẩu.";
    return "";
}

function kiemtraNhapLaiMK(matkhau, nhaplai) {
    if (nhaplai === "" || nhaplai !== matkhau) return "Mật khẩu nhập lại không khớp.";
    return "";
}

function kiemtraDongY(checkbox) {
    if (!checkbox.checked) return "Bạn cần đồng ý với điều khoản để tiếp tục.";
    return "";
}

function kiemtraDiaChi(v) {
    v = v.trim().replace(/\s+/g, " ").normalize("NFC");
    if (!regDiaChi.test(v)) {
        return "Nhập địa chỉ giao hàng đầy đủ (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành).";
    }
    return "";
}

// Ngày mai theo dạng yyyy-mm-dd (cùng dạng với giá trị của <input type="date">)
function layNgayMai() {
    var d = new Date();
    d.setDate(d.getDate() + 1);
    var thang = String(d.getMonth() + 1).padStart(2, "0");
    var ngay = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + thang + "-" + ngay;
}

function kiemtraNgay(v) {
    if (v === "" || v < layNgayMai()) return "Ngày nhận bánh phải từ ngày mai trở đi.";
    return "";
}

function kiemtraChon(v) {
    if (v === "") return "Vui lòng chọn mục này.";
    return "";
}
function kiemtraChuBanh(v) {
    v = v.trim().replace(/\s+/g, " ").normalize("NFC");
    if (!regChuBanh.test(v)) return "Tối đa 40 ký tự, chỉ gồm chữ, số và dấu câu thông thường.";
    return "";
}
function kiemtraGhiChu(v) {
    if (v.trim().length > 200) return "Ghi chú tối đa 200 ký tự.";
    return "";
}
// ---------- HIỂN THỊ KẾT QUẢ LÊN GIAO DIỆN ----------
// Đánh dấu ô nhập đúng/sai (class của Bootstrap) và hiện câu lỗi.
// Dưới mỗi ô cần có 1 thẻ <div class="invalid-feedback" id="loi-<id của ô>"></div>
// Trả về true nếu ô hợp lệ.
function hienKetQua(input, loi) {
    var box = document.getElementById("loi-" + input.id);
    input.classList.remove("is-invalid", "is-valid");
    if (box) box.innerText = loi;

    if (loi !== "") {
        input.classList.add("is-invalid");
        return false;
    }
    if (input.value.trim() !== "") {
        input.classList.add("is-valid");
    }
    return true;
}

// Kiểm tra ngay khi rời khỏi ô, và kiểm tra lại khi gõ (sau khi ô đã được đánh dấu)
// hamLayLoi là hàm trả về câu lỗi của ô đó (hoặc "" nếu đúng)
function ganKiemTra(input, hamLayLoi) {
    input.addEventListener("blur", function () {
        hienKetQua(input, hamLayLoi());
    });
    input.addEventListener("change", function () {
        hienKetQua(input, hamLayLoi());
    });
    input.addEventListener("input", function () {
        if (input.classList.contains("is-invalid") || input.classList.contains("is-valid")) {
            hienKetQua(input, hamLayLoi());
        }
    });
}

// Đưa con trỏ vào ô sai đầu tiên của form
function focusLoiDauTien(form) {
    var oLoi = form.querySelector(".is-invalid");
    if (oLoi) oLoi.focus();
}
