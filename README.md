# 📚 Toko Buku Jaya — E-Commerce Buku Online

Aplikasi e-commerce toko buku berbasis web yang dibangun menggunakan **Laravel 13**, **React 18**, dan **Inertia.js**. Dilengkapi dengan panel admin, sistem keranjang belanja, alur checkout lengkap, dan integrasi pembayaran **DOKU** (Virtual Account & QRIS).

---

## ✨ Fitur Utama

### 👤 Customer

- Daftar buku dengan filter kategori dan pencarian
- Halaman detail buku dengan ulasan dan rekomendasi
- Keranjang belanja berbasis session
- Alur checkout lengkap (Cart → Payment → Konfirmasi)
- Pembayaran via Virtual Account (BCA, Mandiri, BNI, BRI) dan QRIS
- Halaman status pembayaran (sukses / gagal)

### 🛠️ Admin Panel

- Dashboard dengan metrik: total produk, pesanan, pendapatan, pengguna
- Kelola produk (CRUD): tambah, edit, hapus soft delete, upload cover buku
- Kelola pesanan: daftar, detail, update status (Menunggu → Diproses → Dikirim → Selesai)
- Filter & pencarian pesanan berdasarkan status

### 🔐 Autentikasi

- Register & Login dengan role (admin / customer)
- Middleware proteksi route admin
- Logout dengan session cleanup

---

## 🧰 Tech Stack

| Layer      | Teknologi                        |
| ---------- | -------------------------------- |
| Backend    | PHP 8.3, Laravel 13              |
| Frontend   | React 18, TypeScript, Inertia.js |
| Styling    | Tailwind CSS v4, shadcn/ui       |
| Build Tool | Vite 8                           |
| Database   | MySQL                            |
| Payment    | DOKU (Virtual Account & QRIS)    |
| Auth       | Laravel Breeze                   |
| Routing    | Ziggy                            |

---

## 🚀 Instalasi & Setup Lokal

### Prasyarat

- PHP >= 8.3
- Composer
- Node.js >= 18
- MySQL
- XAMPP / Laragon / Laravel Herd

### Langkah Instalasi

**1. Clone repository**

```bash
git clone https://github.com/daffarj/toko-buku-laravel.git
cd toko-buku-laravel
```

**2. Install dependencies**

```bash
composer install
npm install
```

**3. Setup environment**

```bash
cp .env.example .env
php artisan key:generate
```

**4. Konfigurasi database di `.env`**

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=toko_buku
DB_USERNAME=root
DB_PASSWORD=
```

**5. Konfigurasi DOKU Payment di `.env`**

```env
DOKU_CLIENT_ID=your_client_id
DOKU_SECRET_KEY=your_secret_key
DOKU_BASE_URL=https://api-sandbox.doku.com
```

**6. Jalankan migrasi & seeder**

```bash
php artisan migrate --seed
```

**7. Setup storage & routes**

```bash
php artisan storage:link
php artisan ziggy:generate
```

**8. Jalankan server**

```bash
# Terminal 1
php artisan serve

# Terminal 2
npm run dev
```

Buka `http://127.0.0.1:8000` di browser.

---

## 🔑 Akun Default (Seeder)

| Role     | Email              | Password |
| -------- | ------------------ | -------- |
| Admin    | admin@tokobuku.com | password |
| Customer | budi@example.com   | password |
| Customer | siti@example.com   | password |

---

## 📁 Struktur Project

```
toko-buku-laravel/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/
│   │   │   │   ├── AdminBookController.php    # CRUD produk + dashboard
│   │   │   │   └── AdminOrderController.php   # Kelola pesanan
│   │   │   ├── BookController.php             # Halaman customer
│   │   │   ├── CartController.php             # Keranjang (session)
│   │   │   ├── OrderController.php            # Checkout & payment flow
│   │   │   └── DokuController.php             # Integrasi DOKU
│   │   └── Middleware/
│   │       ├── EnsureIsAdmin.php              # Proteksi route admin
│   │       └── HandleInertiaRequests.php      # Share global props
│   └── Models/
│       ├── Book.php
│       ├── Order.php
│       ├── OrderItem.php
│       ├── CartItem.php
│       ├── Review.php
│       └── User.php
├── resources/js/
│   ├── Pages/
│   │   ├── ProductList.tsx        # Halaman utama daftar buku
│   │   ├── ProductDetail.tsx      # Detail buku
│   │   ├── Cart.tsx               # Keranjang belanja
│   │   ├── PaymentMethod.tsx      # Pilih metode bayar
│   │   ├── PaymentCode.tsx        # Kode VA / QRIS
│   │   ├── PaymentSuccess.tsx     # Pembayaran sukses
│   │   ├── PaymentFailed.tsx      # Pembayaran gagal
│   │   └── admin/
│   │       ├── AdminDashboard.tsx
│   │       ├── AdminProductList.tsx
│   │       ├── AddProduct.tsx
│   │       ├── EditProduct.tsx
│   │       ├── AdminOrderList.tsx
│   │       └── AdminOrderDetail.tsx
│   └── Components/
│       ├── Navbar.tsx
│       ├── AdminLayout.tsx
│       └── CustomerLayout.tsx
├── database/
│   ├── migrations/
│   └── seeders/
├── config/
│   └── doku.php
└── routes/
    ├── web.php
    └── auth.php
```

---

## 🗺️ Daftar Route

### Customer

| Method | URL                | Keterangan          |
| ------ | ------------------ | ------------------- |
| GET    | `/`                | Daftar produk       |
| GET    | `/product/{id}`    | Detail produk       |
| GET    | `/cart`            | Keranjang           |
| POST   | `/cart/add`        | Tambah ke keranjang |
| PATCH  | `/cart/{bookId}`   | Update jumlah       |
| DELETE | `/cart/{bookId}`   | Hapus item          |
| GET    | `/payment`         | Pilih metode bayar  |
| POST   | `/payment/confirm` | Buat order          |
| GET    | `/payment/code`    | Kode pembayaran     |
| POST   | `/payment/verify`  | Verifikasi bayar    |

### Admin

| Method | URL                         | Keterangan            |
| ------ | --------------------------- | --------------------- |
| GET    | `/admin`                    | Dashboard             |
| GET    | `/admin/products`           | Daftar produk         |
| POST   | `/admin/products`           | Tambah produk         |
| PUT    | `/admin/products/{id}`      | Edit produk           |
| DELETE | `/admin/products/{id}`      | Hapus produk          |
| GET    | `/admin/orders`             | Daftar pesanan        |
| GET    | `/admin/orders/{id}`        | Detail pesanan        |
| PATCH  | `/admin/orders/{id}/status` | Update status pesanan |

### DOKU Payment

| Method | URL                         | Keterangan               |
| ------ | --------------------------- | ------------------------ |
| POST   | `/payment/doku/va/create`   | Buat Virtual Account     |
| POST   | `/payment/doku/qris/create` | Buat QRIS                |
| POST   | `/payment/doku/callback`    | Webhook notifikasi bayar |

---

## 💳 Alur Pembayaran DOKU

```
Customer pilih produk
        ↓
Tambah ke keranjang
        ↓
Isi informasi pengiriman & pilih metode bayar
(VA: BCA / Mandiri / BNI / BRI  atau  QRIS)
        ↓
POST /payment/confirm → Order dibuat di DB
        ↓
POST /payment/doku/va/create  atau  /qris/create
        ↓
DOKU API mengembalikan nomor VA / QR String
        ↓
Customer melakukan pembayaran
        ↓
DOKU kirim webhook → POST /payment/doku/callback
        ↓
Status order otomatis berubah → "Diproses"
```

---

## 🧪 Testing Pembayaran (Sandbox)

1. Daftar akun DOKU Developer di [dashboard.doku.com](https://dashboard.doku.com)
2. Isi `DOKU_CLIENT_ID` dan `DOKU_SECRET_KEY` di `.env`
3. Expose localhost dengan ngrok untuk menerima webhook:

```bash
ngrok http 8000
```

4. Tambahkan URL ngrok ke `.env`:

```env
DOKU_CALLBACK_URL=https://xxxx.ngrok.io/payment/doku/callback
```

5. Gunakan fitur **Simulate Payment** di DOKU Sandbox Dashboard untuk test transaksi
6. Pantau log webhook:

```bash
tail -f storage/logs/laravel.log
```

---

## 📝 Lisensi

Project ini dibuat untuk keperluan projek akhir mata kuliah "Implementasi dan Pengujian Sistem". Made with love💖 by group 2.
