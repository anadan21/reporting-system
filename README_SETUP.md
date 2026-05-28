# 🛠️ Panduan Setup SIBIMA Reporting System

## ⚠️ Penyebab Error 500

Ada 3 penyebab utama error 500 yang sudah diperbaiki:

| # | Masalah | File | Status |
|---|---------|------|--------|
| 1 | `APP_KEY` kosong — Laravel tidak bisa enkripsi/decrypt apapun | `.env` | ✅ Diperbaiki |
| 2 | `ticket` tidak ada di `$fillable` model Report | `app/Models/Report.php` | ✅ Diperbaiki |
| 3 | `status` di-assign string `'open'` padahal ada Enum cast | `app/Http/Controllers/Api/Public/ReportController.php` | ✅ Diperbaiki |
| 4 | `SESSION_DRIVER=database` butuh tabel sessions aktif | `.env.example` | ✅ Diperbaiki (ganti ke `file`) |
| 5 | `CACHE_STORE=database` butuh setup database | `.env.example` | ✅ Diperbaiki (ganti ke `file`) |

---

## 🚀 Langkah Setup Backend (Laravel)

### 1. Masuk ke folder project
```bash
cd reporting-system-main
```

### 2. Install dependencies PHP
```bash
composer install
```

### 3. Buat file `.env` dari template
```bash
cp .env.example .env
```

### 4. ⭐ WAJIB: Generate APP_KEY (ini penyebab utama error 500!)
```bash
php artisan key:generate
```
> Perintah ini akan mengisi `APP_KEY=` di file `.env` secara otomatis.

### 5. Setup database

**Opsi A — SQLite (paling mudah untuk lokal):**
```bash
# Buat file database SQLite
touch database/database.sqlite
```
Pastikan di `.env`:
```
DB_CONNECTION=sqlite
```

**Opsi B — MySQL:**
Edit `.env`:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sibima_db
DB_USERNAME=root
DB_PASSWORD=password_anda
```
Lalu buat database di MySQL:
```sql
CREATE DATABASE sibima_db;
```

### 6. Jalankan migrasi & seeder
```bash
php artisan migrate --seed
```
> Ini akan membuat semua tabel dan menambah akun admin default.

**Akun Admin Default:**
- Email: `admin@it.com`
- Password: `password123`

### 7. Buat symlink storage (untuk upload file)
```bash
php artisan storage:link
```

### 8. Jalankan server Laravel
```bash
php artisan serve
```
> Server berjalan di: `http://localhost:8000`

---

## 🎨 Langkah Setup Frontend (React/Vite)

### 1. Masuk ke folder frontend
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Buat file `.env` frontend
```bash
# Buat file .env di dalam folder frontend/
echo "VITE_API_URL=http://localhost:8000/api" > .env
```

### 4. Jalankan frontend
```bash
npm run dev
```
> Frontend berjalan di: `http://localhost:5173`

---

## ✅ Checklist Sebelum Testing

- [ ] `php artisan key:generate` sudah dijalankan (cek `.env`, `APP_KEY` harus terisi)
- [ ] `php artisan migrate --seed` sudah dijalankan
- [ ] `php artisan serve` berjalan di port 8000
- [ ] `npm run dev` berjalan di folder `frontend/`
- [ ] File `frontend/.env` berisi `VITE_API_URL=http://localhost:8000/api`

---

## 🐛 Troubleshooting

### Error 500 saat login
→ Jalankan `php artisan key:generate`

### Error "Class not found" atau "Target class does not exist"
→ Jalankan `composer dump-autoload`

### Error CORS (blocked by CORS policy)
→ Pastikan frontend berjalan di port yang ada di `config/cors.php` (5173, 5174, atau 5175)

### Error "Table not found" (sessions, cache, jobs)
→ Pastikan `.env` menggunakan `SESSION_DRIVER=file` dan `CACHE_STORE=file`
→ Atau jalankan `php artisan migrate` untuk membuat tabel yang kurang

### Laporan terkirim tapi email tidak masuk
→ Normal jika `MAIL_MAILER=log` — email tersimpan di `storage/logs/laravel.log`
→ Ganti ke SMTP asli jika mau email benar-benar terkirim
