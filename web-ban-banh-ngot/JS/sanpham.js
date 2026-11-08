// Điều kiện lọc hiện tại
var locLoai = "all";   // loại bánh đang chọn
var tuKhoa = "";       // từ khóa tìm kiếm (chữ thường)
var kieuSapXep = "";   // "asc" = giá tăng dần, "desc" = giá giảm dần, "" = không sắp xếp

// Hiển thị danh sách bánh theo điều kiện lọc
function renderProducts() {
    var list = dsSanPham.filter(p =>
        (locLoai === "all" || p.cat === locLoai) &&
        (tuKhoa === "" || p.name.toLowerCase().includes(tuKhoa))
    );

    if (kieuSapXep === "asc") list.sort((a, b) => a.gia - b.gia);
    if (kieuSapXep === "desc") list.sort((a, b) => b.gia - a.gia);

    document.getElementById("resultCount").textContent = list.length + " sản phẩm";
    var grid = document.getElementById("productList");

    if (list.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <p class="mb-3">Không tìm thấy bánh phù hợp.</p>
                <a class="btn-outline-pink" href="sanpham.html">Xem tất cả bánh</a>
            </div>`;
        return;
    }

    grid.innerHTML = list.map(p => `
        <div class="col-6 col-md-4 col-xl-3">
            <div class="product-card">
                <a class="product-image" href="chi-tiet-banh.html?id=${p.id}">
                    <img src="${imgPath(p.img)}" alt="${esc(p.name)}" loading="lazy">
                </a>
                <h5><a href="chi-tiet-banh.html?id=${p.id}">${esc(p.name)}</a></h5>
                <p class="price">${formatPrice(p.gia)}</p>
                <div class="product-actions">
                    <a class="btn-outline-pink" href="chi-tiet-banh.html?id=${p.id}">Xem chi tiết</a>
                    <button type="button" class="btn-buy" data-buy="${p.id}">Đặt mua</button>
                </div>
            </div>
        </div>`).join("");
}

document.addEventListener("DOMContentLoaded", () => {
    var params = new URLSearchParams(location.search);
    var search = document.getElementById("searchInput");

    // Tạo ô chọn loại bánh từ danh sách loaiBanh
    var options = Object.keys(loaiBanh).map(k => `<option value="${k}">${loaiBanh[k]}</option>`).join("");
    document.getElementById("filters").innerHTML = `<select id="catSelect" class="form-select" aria-label="Loại bánh">${options}</select>`;
    var catSelect = document.getElementById("catSelect");

    // Lấy điều kiện lọc từ địa chỉ trang, ví dụ sanpham.html?cat=cupcake&q=socola
    var cat = params.get("cat");
    locLoai = Object.keys(loaiBanh).includes(cat) ? cat : "all";
    catSelect.value = locLoai;
    search.value = params.get("q") || "";
    tuKhoa = search.value.trim().toLowerCase();

    // Đổi điều kiện lọc thì vẽ lại danh sách
    search.addEventListener("input", () => {
        tuKhoa = search.value.trim().toLowerCase();
        renderProducts();
    });
    catSelect.addEventListener("change", () => {
        locLoai = catSelect.value;
        renderProducts();
    });
    document.getElementById("sortPrice").addEventListener("change", (e) => {
        kieuSapXep = e.target.value;
        renderProducts();
    });

    renderProducts();
});
