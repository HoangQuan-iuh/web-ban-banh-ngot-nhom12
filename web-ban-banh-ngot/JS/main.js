// --------- DỮ LIỆU SẢN PHẨM ----------
var dsSanPham = [
    {
        id: "p1", name: "Pink Celebration Cake", gia: 450000, img: "birthday.jfif", cat: "banhkem",
        badge: "Ưu đãi", size: "18cm", flavor: "Vani và dâu",
        desc: "Chiếc bánh kem màu hồng nhẹ nhàng, phù hợp cho sinh nhật, kỷ niệm và những dịp đặc biệt.",
        ingredients: ["Bột mì", "Trứng gà", "Sữa tươi", "Đường", "Kem tươi", "Hương vani", "Dâu tây"]
    },
    {
        id: "p2", name: "Confetti Cake", gia: 390000, img: "cakesale.jfif", cat: "banhkem",
        badge: "Best Seller", size: "18cm", flavor: "Vani và cốm màu",
        desc: "Bánh kem vani rắc cốm nhiều màu, vui mắt và hợp cho tiệc sinh nhật của các bạn nhỏ.",
        ingredients: ["Bột mì", "Trứng gà", "Sữa tươi", "Đường", "Kem tươi", "Cốm trang trí"]
    },
    {
        id: "p3", name: "Cupcake Box", gia: 250000, img: "cupcakebox.jfif", cat: "cupcake",
        size: "Hộp 6 cái", flavor: "Nhiều vị",
        desc: "Hộp 6 chiếc cupcake với nhiều hương vị, tiện làm quà tặng hoặc dùng trong buổi tiệc.",
        ingredients: ["Bột mì", "Trứng gà", "Bơ", "Đường", "Kem bơ", "Socola"]
    },
    {
        id: "p4", name: "Rose Cake", gia: 420000, img: "rosecake.jfif", cat: "banhkem",
        size: "18cm", flavor: "Vani và hoa hồng",
        desc: "Bánh kem trang trí hoa hồng kem bơ thủ công, thích hợp làm quà tặng người thân.",
        ingredients: ["Bột mì", "Trứng gà", "Sữa tươi", "Đường", "Kem bơ", "Hương hoa hồng"]
    },
    {
        id: "p5", name: "Classic Cream Cake", gia: 350000, img: "cake.jpg", cat: "banhkem",
        size: "16cm", flavor: "Kem tươi truyền thống",
        desc: "Bánh kem tươi truyền thống, vị thanh nhẹ, hợp với mọi lứa tuổi.",
        ingredients: ["Bột mì", "Trứng gà", "Sữa tươi", "Đường", "Kem tươi"]
    },
    {
        id: "p6", name: "Chocolate Cupcake", gia: 45000, img: "cupcake.jfif", cat: "cupcake",
        size: "1 cái", flavor: "Socola",
        desc: "Cupcake socola mềm xốp, phủ kem socola đậm vị.",
        ingredients: ["Bột mì", "Trứng gà", "Bột cacao", "Đường", "Socola"]
    },
    {
        id: "p7", name: "Chocolate Cookies", gia: 80000, img: "cookies.jfif", cat: "cookies",
        size: "Hộp 6 cái", flavor: "Socola chip",
        desc: "Cookies giòn bên ngoài, mềm bên trong, nhiều socola chip.",
        ingredients: ["Bột mì", "Bơ", "Đường nâu", "Trứng gà", "Socola chip"]
    },
    {
        id: "p8", name: "Rainbow Cake Pops", gia: 60000, img: "cakepop.png", cat: "cakepop",
        size: "Hộp 4 cây", flavor: "Vani",
        desc: "Cake pops nhiều màu sắc, nhỏ xinh, rất hợp cho tiệc và quà tặng.",
        ingredients: ["Bột mì", "Trứng gà", "Kem bơ", "Socola trắng", "Cốm màu"]
    }
];

var loaiBanh = { all: "Tất cả", banhkem: "Bánh kem", cupcake: "Cupcake", cookies: "Cookies", cakepop: "Cake Pops" };
var slToiDa = 20;          // số lượng tối đa mỗi món
var mienPhiShip = 500000;  // đơn từ mức này trở lên được miễn phí giao hàng
var phiShip = 30000;


// ---------- HÀM TIỆN ÍCH ----------

// Đọc dữ liệu từ localStorage (chưa có hoặc bị lỗi thì trả về giá trị mặc định)
function getData(key, macDinh) {
    try {
        var data = JSON.parse(localStorage.getItem(key));
        return data === null ? macDinh : data;
    } catch (e) {
        return macDinh;
    }
}

function saveData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function formatPrice(n) {
    return Number(n).toLocaleString("vi-VN") + "đ";
}

// Đổi các ký tự đặc biệt của HTML để dữ liệu người nhập không bị hiểu thành thẻ HTML
function esc(s) {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function findProduct(id) {
    return dsSanPham.find(p => p.id === id);
}

function imgPath(tenFile) {
    return "../img/" + tenFile; // ảnh nằm ở thư mục img, ngang hàng với HTML
}

// Hiện thông báo nhỏ ở góc màn hình. type: "success" (mặc định), "warn", "error"
function showToast(msg, type) {
    var box = document.getElementById("toastBox");
    if (!box) {
        box = document.createElement("div");
        box.id = "toastBox";
        box.setAttribute("role", "status");
        document.body.appendChild(box);
    }
    var toast = document.createElement("div");
    toast.className = "sw-toast " + (type || "success");
    toast.textContent = msg;
    box.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}


// ---------- TÀI KHOẢN ----------

function getUsers() {
    return getData("usersList", []);
}

// Trả về tài khoản đang đăng nhập, chưa đăng nhập thì trả về null
function getCurrentUser() {
    var user = getData("currentUser", null);
    if (user && getUsers().some(u => u.email === user.email)) return user;
    return null;
}

// Lưu thông tin người đang đăng nhập (không lưu mật khẩu)
function saveCurrentUser(user) {
    saveData("currentUser", { name: user.name, email: user.email, phone: user.phone });
}

// Đăng ký: trả về "" nếu thành công, hoặc câu thông báo lỗi
function registerUser(ten, email, sdt, matkhau) {
    email = email.trim().toLowerCase();
    var users = getUsers();

    if (users.some(u => u.email === email)) {
        return "Email này đã được đăng ký. Hãy đăng nhập hoặc dùng email khác.";
    }

    var newUser = {
        name: ten.trim().replace(/\s+/g, " "),
        email: email,
        phone: sdt.replace(/[\s.]/g, ""),
        password: matkhau // thực tế mật khẩu phải được mã hóa, nhưng đồ án để dạng text cũng ổn
    };
    users.push(newUser);
    saveData("usersList", users);
    saveCurrentUser(newUser); // đăng ký xong tự đăng nhập
    return "";
}

// Đăng nhập: trả về "" nếu thành công, hoặc câu thông báo lỗi
function loginUser(email, matkhau) {
    email = email.trim().toLowerCase();
    var user = getUsers().find(u => u.email === email && u.password === matkhau);
    if (!user) return "Email hoặc mật khẩu không đúng.";
    saveCurrentUser(user);
    return "";
}

function logoutUser() {
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
}

// Tên trang hiện tại kèm tham số, ví dụ "chi-tiet-banh.html?id=p1"
function getCurrentPage() {
    return location.pathname.split("/").pop() + location.search;
}

function goLogin() {
    window.location.href = "dangnhap.html?next=" + encodeURIComponent(getCurrentPage());
}

// Trang cần quay lại sau khi đăng nhập (chỉ nhận trang .html trong web, tránh bị chuyển ra trang lạ)
function getNextUrl() {
    var next = new URLSearchParams(location.search).get("next");
    if (next && regTrangNoiBo.test(next)) return next;
    return "index.html";
}

// Gọi ở đầu các trang bắt buộc đăng nhập (giỏ hàng, đặt bánh, đơn hàng)
// Trả về true nếu đã đăng nhập, ngược lại chuyển sang trang đăng nhập
function requireLogin() {
    if (getCurrentUser()) return true;
    showToast("Vui lòng đăng nhập để đặt bánh.", "warn");
    window.location.replace("dangnhap.html?next=" + encodeURIComponent(getCurrentPage()));
    return false;
}


// ---------- GIỎ HÀNG (mỗi tài khoản có một giỏ riêng) ----------
// Mỗi phần tử trong giỏ: { id, sl }  (tên và giá lấy từ dsSanPham theo id)

function getCartKey() {
    var user = getCurrentUser();
    return user ? "giohang_" + user.email : null;
}

function getCart() {
    var key = getCartKey();
    if (!key) return [];
    return getData(key, []).filter(item => findProduct(item.id)); // bỏ món không còn trong danh sách
}

function saveCart(giohang) {
    var key = getCartKey();
    if (key) saveData(key, giohang);
    updateCartCount();
}

function updateCartCount() {
    var countElem = document.getElementById("cartBadge");
    if (!countElem) return;
    var total = getCart().reduce((sum, item) => sum + item.sl, 0);
    countElem.textContent = total > 99 ? "99+" : total;
    countElem.classList.toggle("d-none", total === 0);
}

// Thêm vào giỏ: trả về true nếu thêm được.
// Nếu chưa đăng nhập thì nhớ món này, chuyển sang trang đăng nhập (đăng nhập xong sẽ tự thêm).
function addToCart(id, sl) {
    sl = Math.floor(Number(sl));
    if (!findProduct(id) || isNaN(sl) || sl < 1) {
        showToast("Số lượng không hợp lệ.", "error");
        return false;
    }

    if (!getCurrentUser()) {
        // sessionStorage: chỉ nhớ tạm trong lần duyệt web này
        sessionStorage.setItem("choThem", JSON.stringify({ id: id, sl: sl }));
        showToast("Vui lòng đăng nhập để đặt bánh.", "warn");
        setTimeout(goLogin, 700);
        return false;
    }

    var giohang = getCart();
    var existingItem = giohang.find(item => item.id === id);
    if (existingItem) {
        existingItem.sl = Math.min(slToiDa, existingItem.sl + sl);
    } else {
        giohang.push({ id: id, sl: Math.min(slToiDa, sl) });
    }

    saveCart(giohang);
    showToast('Đã thêm "' + findProduct(id).name + '" vào giỏ hàng.');
    return true;
}

// Tính tiền: tạm tính, phí giao hàng, tổng tiền
function calcTotal(giohang) {
    var tamTinh = giohang.reduce((sum, item) => sum + findProduct(item.id).gia * item.sl, 0);
    var ship = (tamTinh === 0 || tamTinh >= mienPhiShip) ? 0 : phiShip;
    return { tamTinh: tamTinh, ship: ship, tongTien: tamTinh + ship };
}

// Sau khi đăng nhập xong, tự thêm món mà khách vừa bấm "Đặt mua" lúc chưa đăng nhập
function addPendingItem() {
    var cho = null;
    try {
        cho = JSON.parse(sessionStorage.getItem("choThem"));
    } catch (e) {
        cho = null;
    }
    if (cho && getCurrentUser()) {
        sessionStorage.removeItem("choThem");
        addToCart(cho.id, cho.sl);
    }
}


// ---------- ĐƠN HÀNG ----------

// Đơn hàng của tài khoản đang đăng nhập, đơn mới nhất lên đầu
function getOrders() {
    var user = getCurrentUser();
    if (!user) return [];
    return getData("donhang", []).filter(o => o.email === user.email).reverse();
}

// Tạo đơn từ giỏ hàng hiện tại, xong thì làm trống giỏ. Trả về đơn hàng (hoặc null nếu lỗi)
function placeOrder(info) {
    var user = getCurrentUser();
    var giohang = getCart();
    if (!user || giohang.length === 0) return null;

    var t = calcTotal(giohang);
    var order = {
        id: "SW" + String(Date.now()).slice(-8),
        email: user.email,
        info: info,
        tamTinh: t.tamTinh,
        ship: t.ship,
        tongTien: t.tongTien,
        items: giohang.map(item => {
            var p = findProduct(item.id);
            return { id: p.id, name: p.name, gia: p.gia, sl: item.sl };
        }),
        createdAt: new Date().toISOString()
    };

    var orders = getData("donhang", []);
    orders.push(order);
    saveData("donhang", orders);
    saveCart([]);
    return order;
}


// ---------- GIAO DIỆN CHUNG (thanh menu) ----------

// Đã đăng nhập thì đổi nút "Đăng nhập" thành menu tài khoản
function renderAuth() {
    var box = document.getElementById("authArea");
    var user = getCurrentUser();
    if (!box || !user) return;

    box.innerHTML = `
        <div class="dropdown">
            <a class="btn-login dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <i class="bi bi-person-circle"></i><span class="user-name">${esc(user.name.split(" ").pop())}</span>
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
                <li><span class="dropdown-item-text small text-muted">${esc(user.email)}</span></li>
                <li><hr class="dropdown-divider"></li>
                <li><a class="dropdown-item" href="gio-hang.html">Giỏ hàng</a></li>
                <li><a class="dropdown-item" href="don-hang.html">Đơn hàng của tôi</a></li>
                <li><button type="button" class="dropdown-item" onclick="logoutUser()">Đăng xuất</button></li>
            </ul>
        </div>`;
}

// Nút "Đặt mua" (thẻ có thuộc tính data-buy="mã bánh") ở trang chủ và trang sản phẩm
document.addEventListener("click", function (e) {
    var nut = e.target.closest("[data-buy]");
    if (nut) {
        e.preventDefault();
        addToCart(nut.dataset.buy, 1);
    }
});

// Chạy khi tải xong giao diện
document.addEventListener("DOMContentLoaded", () => {
    renderAuth();
    updateCartCount();
    addPendingItem();
});
