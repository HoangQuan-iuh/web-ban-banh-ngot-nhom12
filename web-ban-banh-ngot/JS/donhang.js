// Một dòng thông tin (bỏ qua nếu không có nội dung)
function dongThongTin(label, value) {
    if (!value) return "";
    return `<div class="mb-1"><strong>${label}:</strong> ${esc(value)}</div>`;
}

// Hiển thị danh sách đơn hàng
function renderOrders() {
    var box = document.getElementById("orderList");
    var orders = getOrders();
    var openId = new URLSearchParams(location.search).get("id"); // đơn cần mở sẵn

    if (orders.length === 0) {
        box.innerHTML = `
            <div class="panel text-center py-5">
                <p class="mb-3">Bạn chưa có đơn hàng nào.</p>
                <a class="btn-pink text-decoration-none" href="sanpham.html">Chọn bánh ngay</a>
            </div>`;
        return;
    }

    var html = orders.map((o, index) => {
        // Mở sẵn đơn có mã trên địa chỉ trang, nếu không có thì mở đơn mới nhất
        var open = openId ? o.id === openId : index === 0;
        var i = o.info;

        var dsMon = o.items.map(it =>
            `<div class="summary-line"><span>${esc(it.name)} x ${it.sl}</span><span>${formatPrice(it.gia * it.sl)}</span></div>`
        ).join("");

        return `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button${open ? "" : " collapsed"}" type="button" data-bs-toggle="collapse" data-bs-target="#o${index}" aria-expanded="${open}">
                        <span class="me-3 fw-bold">${esc(o.id)}</span>
                        <span class="text-muted me-3">${esc(new Date(o.createdAt).toLocaleString("vi-VN"))}</span>
                        <span class="badge bg-warning text-dark me-3">Chờ xác nhận</span>
                        <span class="ms-auto me-3 fw-bold">${formatPrice(o.tongTien)}</span>
                    </button>
                </h2>
                <div id="o${index}" class="accordion-collapse collapse${open ? " show" : ""}" data-bs-parent="#orders">
                    <div class="accordion-body">
                        <div class="row g-4">
                            <div class="col-md-6">
                                <h3 class="h6">Sản phẩm</h3>
                                ${dsMon}
                                <hr>
                                <div class="summary-line"><span>Tạm tính</span><span>${formatPrice(o.tamTinh)}</span></div>
                                <div class="summary-line"><span>Phí giao hàng</span><span>${o.ship ? formatPrice(o.ship) : "Miễn phí"}</span></div>
                                <div class="summary-line summary-total"><span>Tổng cộng</span><span>${formatPrice(o.tongTien)}</span></div>
                            </div>
                            <div class="col-md-6">
                                <h3 class="h6">Thông tin nhận bánh</h3>
                                ${dongThongTin("Người nhận", i.name)}
                                ${dongThongTin("Điện thoại", i.phone)}
                                ${dongThongTin("Email", i.email)}
                                ${dongThongTin("Địa chỉ", i.address)}
                                ${dongThongTin("Ngày nhận", i.date ? i.date.split("-").reverse().join("/") : "")}
                                ${dongThongTin("Khung giờ", i.time)}
                                ${dongThongTin("Chữ viết lên bánh", i.cakeText)}
                                ${dongThongTin("Ghi chú", i.note)}
                                ${dongThongTin("Thanh toán", i.pay)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
    }).join("");

    box.innerHTML = `<div class="accordion" id="orders">${html}</div>`;
}

// Chạy khi tải xong giao diện (trang này bắt buộc đăng nhập)
document.addEventListener("DOMContentLoaded", () => {
    if (!requireLogin()) return;
    renderOrders();
});
