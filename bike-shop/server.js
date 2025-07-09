const express = require('express');
const mysql = require('mysql2');
const app = express();

// MySQL bağlantısı (şifreniz yoksa password: '' şeklinde bırakın)
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'bike_shop'
});

// Middleware ayarları
app.use(express.json());

// Giriş endpoint'i
app.post('/login', (req, res) => {
    const { email, sifre } = req.body;
    
    db.query(
        'SELECT * FROM users WHERE email = ? AND password = ?',
        [email, sifre],
        (err, results) => {
            if (err) {
                console.error('MySQL hatası:', err);
                return res.status(500).json({ 
                    basarili: false, 
                    mesaj: 'Sunucu hatası' 
                });
            }
            
            if (results.length > 0) {
                res.json({ 
                    basarili: true, 
                    kullanici: results[0].username,
                    mesaj: 'Giriş başarılı' 
                });
            } else {
                res.json({ 
                    basarili: false, 
                    mesaj: 'Yanlış email veya şifre!' 
                });
            }
        }
    );
});

// Sunucuyu başlat
app.listen(3000, () => {
    console.log('Sunucu http://localhost:3000 adresinde çalışıyor');
});
// products.json dosyasını oku
const products = require('./products.json');

// Tüm ürünleri getir
app.get('/products', (req, res) => {
    res.json(products);
});

// Yeni ürün ekle
app.post('/products', (req, res) => {
    const newProduct = {
        id: products.products.length + 1,
        ...req.body
    };
    
    products.products.push(newProduct);
    
    // Dosyaya yaz (gerçek uygulamada veritabanı kullanın)
    require('fs').writeFileSync('./products.json', JSON.stringify(products, null, 2));
    
    res.json({ success: true, product: newProduct });
});

// Kategoriye göre ürün getirme
app.get('/products/:category', (req, res) => {
    const category = req.params.category;
    const filtered = products.products.filter(p => p.category === category);
    res.json({ products: filtered });
});