<p align="center">
  <img src="public/brand/naek.webp" alt="NAEK" height="48" />
</p>

# NAEK — Indonesian Stock Intelligence Platform

NAEK adalah platform open-source untuk memantau, menganalisis, dan belajar tentang
pasar saham Indonesia (BEI/IDX). NAEK **bukan** aplikasi trading — tidak ada fitur
eksekusi order beli/jual. Lihat [`PRD.md`](./PRD.md) untuk kebutuhan produk lengkap
dan [`design.md`](./design.md) untuk panduan desain.

## Status proyek

Tahap: **fondasi (foundation)**. Routing, design system, dan struktur backend sudah
berjalan. Sebagian besar halaman masih berupa placeholder "Fitur belum tersedia"
sesuai roadmap bertahap di `PRD.md`. **Belum ada sumber data pasar yang terhubung** —
semua endpoint market-data akan melaporkan status `unavailable` secara jujur sampai
provider data resmi dikonfigurasi.

## Arsitektur

```text
naek/
├── src/                 # Frontend — React + TypeScript (Vite)
├── public/brand/         # Logo asli naek.webp
├── backend/              # Backend — Go (Golang) modular monolith
│   ├── cmd/api/          # Entry point server HTTP
│   ├── internal/
│   │   ├── config/       # Konfigurasi dari environment variables
│   │   ├── handler/      # HTTP handlers (Gin)
│   │   ├── middleware/   # Request ID, logging, CORS
│   │   ├── service/      # Logika aplikasi/domain
│   │   ├── repository/   # Akses database (pgx)
│   │   └── market/       # Interface provider data pasar + adapter
│   ├── db/
│   │   ├── migrations/   # Migrasi skema PostgreSQL
│   │   └── queries/      # Query SQL untuk sqlc (akan diisi bertahap)
│   └── sqlc.yaml
├── docker-compose.yml    # PostgreSQL lokal
├── .env.example           # Variabel environment frontend (tanpa rahasia)
└── backend/.env.example   # Variabel environment backend (tanpa rahasia)
```

## Menjalankan secara lokal

### 1. Frontend (React + TypeScript + Vite)

Prasyarat: Node.js 20+.

```powershell
npm install
copy .env.example .env.local   # sesuaikan VITE_API_BASE_URL bila perlu
npm run dev
```

Frontend berjalan di `http://localhost:5173`.

Script lain yang tersedia:
- `npm run build` — type-check (`tsc -b`) lalu build produksi (`vite build`).
- `npm run lint` — menjalankan `oxlint`.
- `npm run preview` — preview hasil build produksi.

> Catatan Windows/PowerShell: jika `npm` diblokir oleh execution policy
> (`UnauthorizedAccess` pada `npm.ps1`), jalankan lewat `cmd /c "npm run dev"`
> atau ubah execution policy sesuai kebijakan keamanan tim Anda.

### 2. Database (PostgreSQL)

Gunakan Docker Compose untuk PostgreSQL lokal:

```powershell
docker compose up -d postgres
```

Ini menjalankan PostgreSQL 16 pada port `5432` dengan database `naek`,
user `naek`, password `naek` (hanya untuk pengembangan lokal — jangan dipakai
di produksi). Connection string yang sesuai:

```
postgres://naek:naek@localhost:5432/naek?sslmode=disable
```

Jalankan migrasi dengan [`golang-migrate`](https://github.com/golang-migrate/migrate)
(instal CLI-nya sesuai dokumentasi resmi, lalu):

```powershell
migrate -path backend/db/migrations -database "postgres://naek:naek@localhost:5432/naek?sslmode=disable" up
```

> Lingkungan pengembangan yang digunakan untuk menyusun fondasi ini **tidak memiliki
> Docker maupun PostgreSQL terpasang**, sehingga `docker-compose.yml` dan migrasi di
> atas belum dapat dijalankan dan diverifikasi langsung di sini. Mohon verifikasi di
> lingkungan Anda yang memiliki Docker.

### 3. Backend (Go)

Prasyarat: **Go 1.26.0 atau lebih baru** (lihat direktif `go`/`toolchain` di
`backend/go.mod`). Versi ini dibutuhkan agar dependensi `golang.org/x/net` dan
`golang.org/x/text` berada di versi yang sudah menutup kerentanan keamanan yang
diketahui (lihat bagian [Keamanan dependensi](#keamanan-dependensi-go) di bawah).

Jika toolchain Go yang terpasang lebih lama dari `go 1.26.0`, `go` CLI akan
otomatis mengunduh toolchain `go1.26.9` saat menjalankan perintah apa pun di
`backend/` (butuh akses jaringan sekali, lalu toolchain ter-cache secara lokal).

```powershell
cd backend
copy .env.example .env   # isi DATABASE_URL setelah PostgreSQL berjalan
go mod tidy
go run ./cmd/api
```

Backend berjalan di `http://localhost:8080` (sesuai `PORT` di `.env`).

Endpoint yang sudah tersedia:
- `GET /healthz` — health check, mengembalikan status server.
- `GET /api/v1/market/overview` — ringkasan pasar. Selama `MARKET_DATA_PROVIDER=none`
  (nilai default), endpoint ini **sengaja** mengembalikan `freshness: "unavailable"`
  dan tidak pernah mengirim data harga palsu.
- `GET /api/v1/instruments/search?q=` — pencarian emiten.
- `GET /api/v1/instruments/:ticker` — detail emiten (404 jika ticker tidak dikenal).
- `GET /api/v1/instruments/:ticker/ohlcv?range=` — data historis OHLCV.
- `GET /api/v1/instruments/:ticker/fundamentals?period=` — data fundamental.
- `POST /api/v1/ai/ask` — tanya NAEK AI. Selama `AI_PROVIDER=none` (nilai default),
  endpoint ini mengembalikan `available: false` dengan pesan jujur, bukan jawaban
  yang dikarang.

Perintah lain:
- `go build ./...` — build semua package.
- `go vet ./...` — static analysis.
- `go test ./...` — unit test (akan bertambah seiring fitur dibangun).

### Keamanan dependensi (Go)

Audit keamanan dependensi backend dijalankan dengan
[`govulncheck`](https://go.dev/doc/tutorial/govulncheck):

```powershell
cd backend
go install golang.org/x/vuln/cmd/govulncheck@latest
govulncheck ./...
```

Status saat ini: **0 kerentanan yang terpanggil oleh kode kita** per audit terakhir.
Dependensi utama yang relevan untuk keamanan: `golang.org/x/net`, `golang.org/x/text`,
`golang.org/x/crypto`, dan `github.com/jackc/pgx/v5` — semua sudah diperbarui ke versi
yang menutup CVE yang diketahui. Satu kerentanan residual (`golang.org/x/crypto/openpgp`,
GO-2026-5932) tetap tercatat sebagai dependensi transitif tanpa fix tersedia (paket
tersebut unmaintained secara desain), tetapi **tidak dipanggil** oleh kode NAEK.

Jalankan `govulncheck ./...` secara berkala (misalnya di CI) untuk mendeteksi
kerentanan baru pada rilis dependensi mendatang.

> **Penting:** `govulncheck` (dan semua perintah `go` lainnya) harus dijalankan
> dengan working directory di `backend/`, bukan di root repo `naek/`. Root repo
> tidak memiliki `go.mod` sendiri (itu adalah proyek frontend React/Vite).
> Go akan mencari `go.mod` dengan menyusuri direktori ke atas; jika kebetulan
> ada `go.mod` lain di salah satu direktori leluhur (misalnya proyek Go pribadi
> lain di home directory Anda), perintah `go` yang dijalankan dari luar `backend/`
> bisa diam-diam "menempel" ke module yang salah itu dan menghasilkan error
> seperti `no packages matched the provided patterns`, bukan `no go.mod file`
> yang lebih jelas. Jika Anda melihat salah satu error ini, periksa working
> directory dengan `go env GOMOD` — hasilnya harus persis
> `.../naek/backend/go.mod`.

## Konfigurasi sumber data pasar

NAEK belum terhubung ke penyedia data pasar resmi mana pun. `MARKET_DATA_PROVIDER`
di `backend/.env.example` default ke `none`. Untuk menambahkan konektor data baru:

1. Implementasikan interface `market.Provider` di `backend/internal/market/`.
2. Pastikan setiap data mencantumkan `source`, `observed_at`, dan `freshness_status`
   yang sesuai (`real_time`, `delayed`, `end_of_day`, atau `unavailable`).
3. Dokumentasikan syarat lisensi/API key penyedia tersebut.
4. Jangan menyamarkan data tertunda atau historis sebagai `real_time`.

## Konfigurasi NAEK AI

NAEK AI (asisten riset, lihat `PRD.md` FR-05) **belum terhubung ke penyedia AI
mana pun**. `AI_PROVIDER` di `backend/.env.example` default ke `none`, dan
endpoint `POST /api/v1/ai/ask` akan selalu menjawab `available: false` sampai
provider dikonfigurasi. Ini bukan bug — ini mencegah NAEK mengarang jawaban,
sumber, atau prediksi (lihat `PRD.md` bagian 12, "Safety, Trust, and Compliance
Guardrails").

Untuk mengaktifkan NAEK AI:

1. Pilih provider AI (misalnya OpenAI, Anthropic, atau model lokal) dan dapatkan
   API key-nya.
2. Implementasikan interface `ai.Provider` di `backend/internal/ai/provider.go`
   untuk provider tersebut. Method `Ask` wajib:
   - Mengambil data lewat tool/service yang terdefinisi secara eksplisit
     (bukan hanya mengandalkan pengetahuan internal model).
   - Mengisi ketujuh bagian jawaban (`summary`, `data_observed`, `interpretation`,
     `alternative_scenarios`, `risks_and_limitations`, `what_to_watch`, `sources`)
     sesuai format PRD section 8 — jangan biarkan kosong atau digabung jadi satu
     blok teks bebas.
   - Mencantumkan sumber (`sources`) untuk klaim faktual apa pun.
   - Melaporkan secara jujur ketika data tidak tersedia/usang, bukan menebak.
   - Tidak pernah menjamin arah harga atau memberi instruksi beli/jual.
3. Daftarkan provider baru tersebut di `backend/cmd/api/main.go` berdasarkan
   nilai `cfg.AIProvider` (saat ini hanya `ai.NewNoopProvider()` yang terpasang).
4. Set `AI_PROVIDER` dan `AI_API_KEY` di `backend/.env`.

Jangan menguji atau menampilkan NAEK AI sebagai "sudah berfungsi" sebelum
langkah-langkah ini benar-benar diimplementasikan dengan provider nyata.

## Prinsip produk (ringkas)

- Hanya analisis dan edukasi saham — tidak ada eksekusi transaksi.
- Tidak ada data pasar, berita, atau laporan keuangan yang direka-reka.
- Setiap data eksternal wajib memiliki sumber, timestamp, dan status freshness.
- AI (saat dibangun nanti) akan memisahkan fakta, interpretasi, dan ketidakpastian,
  serta tidak menjamin hasil investasi.

Detail lengkap: [`PRD.md`](./PRD.md) dan [`design.md`](./design.md).

## Kontribusi

Proyek ini open-source dan menerima kontribusi. Ikuti roadmap bertahap di `PRD.md`
(fondasi → Market Overview → Stock Explorer → Fundamental & berita → Watchlist →
NAEK AI → Radar Bullish/Bearish → Multibagger Watch & IHSG Risk Monitor) dan jangan
mengimplementasikan banyak fitur besar sekaligus dalam satu perubahan.
