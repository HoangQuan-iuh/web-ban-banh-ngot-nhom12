// Hiển thị danh sách món trong giỏ và phần tổng tiền
function renderCartPage() {
    var box = document.getElementById("cartBox");
    var giohang = getCart();

    if (giohang.length === 0) {
        box.innerHTML = `
            <div class="panel text-center py-5">
                <p class="mb-3">Giỏ hàng đang trống.</p>
                <a class="btn-pink" href="sanpham.html">Chọn bánh ngay</a>
            </div>`;
        return;
    }

    var t = calcTotal(giohang);

    var html = giohang.map(item => {
        var p = findProduct(item.id);
        return `
            <div class="cart-row">
                <img src="${imgPath(p.img)}" alt="${esc(p.name)}">
                <div class="info">
                    <a class="fw-bold text-decoration-none text-dark" href="chi-tiet-banh.html?id=${p.id}">${esc(p.name)}</a>
                    <div class="text-muted">${formatPrice(p.gia)}</div>
                </div>
                <div class="qty-box">
                    <button type="button" onclick="updateQuantity('${p.id}', -1)" aria-label="Giảm">-</button>
                    <span>${item.sl}</span>
                    <button type="button" onclick="updateQuantity('${p.id}', 1)" aria-label="Tăng">+</button>
                </div>
                <strong style="min-width:100px;text-align:right">${formatPrice(p.gia * item.sl)}</strong>
                <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeItem('${p.id}')" aria-label="Xóa ${esc(p.name)}">
                    <i class="bi bi-trash"></i>
                </button>
            </div>`;
    }).join("");

    box.innerHTML = `
        <div class="row g-4">
            <div class="col-lg-8"><div class="panel py-2">${html}</div></div>
            <div class="col-lg-4">
                <div class="panel">
                    <div class="summary-line"><span>Tạm tính</span><span>${formatPrice(t.tamTinh)}</span></div>
                    <div class="summary-line"><span>Phí giao hàng</span><span>${t.ship ? formatPrice(t.ship) : "Miễn phí"}</span></div>
                    <div class="text-muted small mb-3">Miễn phí giao hàng cho đơn từ ${formatPrice(mienPhiShip)}.</div>
                    <hr>
                    <div class="summary-line summary-total"><span>Tổng cộng</span><span>${formatPrice(t.tongTien)}</span></div>
                    <a class="btn-pink w-100 text-center text-decoration-none d-block mt-3" href="form-mua-banh.html">Tiến hành đặt bánh</a>
                </div>
            </div>
        </div>`;
}

// Tăng/giảm số lượng 1 món (tối thiểu 1, tối đa slToiDa)
function updateQuantity(id, change) {
    var giohang = getCart();
    var item = giohang.find(i => i.id === id);
    if (item) {
        item.sl = Math.min(slToiDa, Math.max(1, item.sl + change));
        saveCart(giohang);
        renderCartPage();
    }
}

// Xóa hoàn toàn 1 món khỏi giỏ
function removeItem(id) {
    var giohang = getCart().filter(i => i.id !== id);
    saveCart(giohang);
    renderCartPage();
}

// Chạy khi tải xong giao diện (trang này bắt buộc đăng nhập)
document.addEventListener("DOMContentLoaded", () => {
    if (!requireLogin()) return;
    renderCartPage();
});
