# Sistem Manajemen Data Mahasiswa

Aplikasi Laravel API dan Next.js untuk pengelolaan data mahasiswa serta dashboard statistik Universitas Cakrawala Nusantara.

## Struktur

```text
.
├── backend/                 # Laravel API, Sanctum, migration, seeder, test
├── frontend/                # Next.js App Router, Tailwind CSS, UI
├── .agents/                 # Skill design-taste-frontend
└── PRD_Sistem_Manajemen_Data_Mahasiswa.md
```

## Jalankan lokal

### Backend

```powershell
cd backend
copy .env.example .env
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

API berjalan pada `http://localhost:8000`. Endpoint awal: `GET /api/health`.

`.env.example` memakai MySQL. Konfigurasikan `DB_*` lalu buat database `ujikom` sebelum menjalankan migration. Konfigurasi `.env` lokal saat ini memakai SQLite agar fondasi aplikasi dapat diuji tanpa server MySQL/MariaDB.

### Frontend

```powershell
cd frontend
copy .env.local.example .env.local
npm install
npm run dev
```

Frontend berjalan pada `http://localhost:3000`.

## Verifikasi

```powershell
cd backend
php artisan test
vendor\bin\pint --format agent

cd ..\frontend
npm run lint
npm run build
```
