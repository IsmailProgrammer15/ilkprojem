// Dropdown menüler için mobil uyumluluk
document.querySelectorAll('.dropdown > a').forEach(link => {
    link.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            const dropdown = this.parentElement;
            dropdown.classList.toggle('active');
        }
    });
});

// Login butonu için
document.getElementById('loginBtn').addEventListener('click', function(e) {
    e.preventDefault();
    alert('Giriş sayfası yapım aşamasında!');
});

// Ekran boyutu değiştiğinde dropdownları sıfırla
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        document.querySelectorAll('.dropdown').forEach(dropdown => {
            dropdown.classList.remove('active');
        });
    }
});
// Ürünleri yükle
async function loadProducts() {
    const response = await fetch('/products');
    const data = await response.json();
    displayProducts(data.products);
}

// Ürünleri ekranda göster
function displayProducts(products) {
    const grid = document.querySelector('.product-grid');
    grid.innerHTML = '';
    
    products.forEach(product => {
        grid.innerHTML += `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.price} TL</p>
            <button onclick="addToCart(${product.id})">Sepete Ekle</button>
        </div>
        `;
    });
}

// Yönetici için ürün ekleme formu
function showAddProductForm() {
    document.body.innerHTML += `
    <div class="modal" id="productModal">
        <div class="modal-content">
            <h2>Ürün Ekle</h2>
            <form id="productForm">
                <input type="text" placeholder="Ürün Adı" id="productName" required>
                <select id="productCategory" required>
                    <option value="">Kategori Seçin</option>
                    <option value="Bisikletler">Bisikletler</option>
                    <option value="Yedek Parça">Yedek Parça</option>
                    <option value="Giyim">Giyim</option>
                    <option value="Antrenman">Antrenman</option>
                </select>
                <input type="number" placeholder="Fiyat" id="productPrice" required>
                <input type="text" placeholder="Resim URL" id="productImage">
                <input type="number" placeholder="Stok" id="productStock">
                <button type="submit">Ürünü Ekle</button>
            </form>
        </div>
    </div>
    `;
    
    document.getElementById('productForm').addEventListener('submit', addProduct);
}

// Ürün ekleme fonksiyonu
async function addProduct(e) {
    e.preventDefault();
    
    const newProduct = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        image: document.getElementById('productImage').value || 'https://via.placeholder.com/300x200?text=Urun',
        stock: parseInt(document.getElementById('productStock').value) || 0
    };
    
    const response = await fetch('/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
    });
    
    const result = await response.json();
    if (result.success) {
        alert('Ürün başarıyla eklendi!');
        loadProducts();
        document.getElementById('productModal').remove();
    }
}

// Sayfa yüklendiğinde ürünleri getir
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    // Yönetici girişi yapıldıysa ürün ekle butonu göster
    if (isAdmin) {
        const addBtn = document.createElement('button');
        addBtn.textContent = 'Ürün Ekle';
        addBtn.classList.add('add-product-btn');
        addBtn.onclick = showAddProductForm;
        document.querySelector('.products').prepend(addBtn);
    }
});

// Global değişken
let allProducts = [];

// Ürünleri yükle fonksiyonu
async function loadProducts() {
    const response = await fetch('/products');
    const data = await response.json();
    allProducts = data.products;
    displayProducts(allProducts);
}

// Kategoriye göre filtreleme
function filterProducts(category) {
    const filtered = allProducts.filter(product => 
        product.category === category
    );
    displayProducts(filtered);
    document.querySelector('.products h2').textContent = `${category}`;
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    
    // URL'den kategori parametresini oku
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
        filterProducts(category);
    }
});