var banhHienTai = null; // bánh đang xem
document.addEventListener("DOMContentLoaded", () => {
    // Lấy mã bánh từ địa chỉ trang
    var id = new URLSearchParams(location.search).get("id");
    banhHienTai = findProduct(id);

    if (!banhHienTai) {
        document.getElementById("detail").innerHTML = `
            <div class="panel text-center">
                <p>Không tìm thấy sản phẩm này.</p>
                <a class="btn-pink" href="sanpham.html">Xem tất cả bánh</a>
            </div>`;
        return;
    }
    renderDetail(banhHienTai);
});

function renderDetail(p) {
    document.title = p.name + " - SweetE's Bakery";
    document.getElementById("detail").innerHTML = `
        <div class="panel">
            <div class="row g-4">
                <div class="col-md-6"><img class="detail-img" src="${imgPath(p.img)}" alt="${esc(p.name)}"></div>
                <div class="col-md-6">
                    <h1 class="page-title mb-2">${esc(p.name)}</h1>
                    <p class="summary-total mb-3">${formatPrice(p.gia)}</p>
                    <p>${esc(p.desc)}</p>
                    <p class="mb-1"><strong>Kích thước:</strong> ${esc(p.size)}</p>
                    <p class="mb-1"><strong>Hương vị:</strong> ${esc(p.flavor)}</p>
                    <p><strong>Tình trạng:</strong> Còn hàng</p>

                    <label class="form-label fw-bold" for="qty">Số lượng</label>
                    <div class="input-group mb-3" style="width:150px">
                        <button class="btn btn-outline-secondary" type="button" onclick="changeQty(-1)" aria-label="Giảm">-</button>
                        <input id="qty" type="number" class="form-control text-center" value="1" min="1" max="${slToiDa}" oninput="checkQty()">
                        <button class="btn btn-outline-secondary" type="button" onclick="changeQty(1)" aria-label="Tăng">+</button>
                    </div>
                    <div class="text-danger small mb-2" id="qtyErr" role="alert"></div>

                    <div class="product-actions">
                        <button class="btn-outline-pink" type="button" onclick="addDetailToCart()">Thêm vào giỏ</button>
                        <button class="btn-buy" type="button" onclick="buyNow()">Đặt mua ngay</button>
                        <a class="btn-outline-pink" href="sanpham.html">Quay lại</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="panel mt-4">
            <h2 class="h5">Thành phần</h2>
            <ul class="mb-0">${p.ingredients.map(i => `<li>${esc(i)}</li>`).join("")}</ul>
        </div>`;
}

// Nút + / - đổi số lượng (từ 1 đến slToiDa)
function changeQty(delta) {
    var input = document.getElementById("qty");
    var val = (parseInt(input.value) || 1) + delta;
    if (val < 1) val = 1;
    if (val > slToiDa) val = slToiDa;
    input.value = val;
    checkQty();
}

// Kiểm tra số lượng nhập vào: đúng thì trả về số lượng, sai thì báo lỗi và trả về 0
function checkQty() {
    var v = document.getElementById("qty").value.trim();
    var n = Number(v);
    var err = document.getElementById("qtyErr");

    if (!regSoNguyen.test(v) || n < 1 || n > slToiDa) {
        err.textContent = "Số lượng phải là số nguyên từ 1 đến " + slToiDa + ".";
        return 0;
    }
    err.textContent = "";
    return n;
}

function addDetailToCart() {
    var sl = checkQty();
    if (sl > 0) addToCart(banhHienTai.id, sl);
}

// Đặt mua ngay: thêm vào giỏ rồi chuyển sang trang giỏ hàng
function buyNow() {
    var sl = checkQty();
    if (sl > 0 && addToCart(banhHienTai.id, sl)) {
        window.location.href = "gio-hang.html";
    }
}
