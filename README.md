# ShareFile - Platform Berbagi File Modern

![ShareFile](https://img.shields.io/badge/ShareFile-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-000000)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC)

ShareFile adalah platform berbagi file modern dengan antarmuka yang intuitif, dibangun dengan Next.js, TypeScript, Prisma dan Tailwind CSS. Aplikasi ini memungkinkan pengguna untuk mengunggah file hingga 100MB, mendapatkan tautan untuk dibagikan, dan mengunduh file dengan tampilan progres real-time.

![ShareFile Preview](./public/screenshot.png)

## ✨ Fitur Utama

- 🚀 **Upload Intuitif**: Drag & drop atau pilih file, dengan progress bar real-time
- 🔗 **Berbagi Instan**: Dapatkan tautan berbagi langsung setelah upload selesai
- ⚡ **Download Cepat**: Pengalaman download yang lancar dengan informasi kecepatan dan waktu
- 📱 **Responsif**: Antarmuka yang berfungsi dengan baik di desktop maupun perangkat mobile
- 🔒 **Sederhana**: Tanpa perlu login, langsung upload dan bagikan

## 🛠️ Teknologi yang Digunakan

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Socket.IO
- **Database**: PostgreSQL dengan Prisma ORM
- **Styling**: Tailwind CSS dengan komponen kustom
- **File Storage**: Penyimpanan lokal (dapat dikonfigurasi untuk cloud storage)

## 📋 Prasyarat

Sebelum memulai, pastikan Anda telah menginstal:

- Node.js (versi 18 atau lebih baru)
- npm atau yarn
- PostgreSQL (atau gunakan layanan PostgreSQL seperti Railway, Supabase, dll)

## 🚀 Cara Instalasi

### 1. Clone Repositori

```bash
git clone https://github.com/username/sharefile.git
cd sharefile
```

### 2. Instal Dependensi

```bash
npm install
# atau
yarn install
```

### 3. Konfigurasi Environment Variables

Salin file `.env.example` menjadi `.env` dan sesuaikan dengan pengaturan Anda:

```bash
cp .env.example .env
```

Edit file `.env` dan sesuaikan dengan konfigurasi database dan pengaturan aplikasi Anda:

```bash
# Database connection string
DATABASE_URL="postgresql://username:password@localhost:5432/sharefile?schema=public"

# Batas ukuran file upload (dalam bytes, default 100MB)
MAX_FILE_SIZE="104857600"

# Direktori penyimpanan file
UPLOAD_DIR="uploads"
```

### 4. Siapkan Database

Generate Prisma client dan jalankan migrasi untuk menyiapkan database:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Jalankan Aplikasi

#### Mode Development

```bash
npm run dev
# atau
yarn dev
```

Aplikasi akan berjalan di `http://localhost:3000`

#### Mode Production

```bash
npm run build
npm start
# atau
yarn build
yarn start
```

## 📁 Struktur Folder

```
sharefile/
├── prisma/              # Konfigurasi Prisma, migrasi, dan schema
├── public/              # Aset statis, ikon
│   └── icons/           # Ikon untuk berbagai tipe file
├── src/                 # Kode sumber utama
│   ├── app/             # Direktori aplikasi Next.js
│   │   ├── api/         # API routes
│   │   │   ├── download/ # Endpoint untuk download file
│   │   │   ├── socket/   # Konfigurasi Socket.IO untuk real-time progress
│   │   │   └── upload/   # Endpoint untuk upload file
│   │   ├── components/   # Komponen React
│   │   ├── download/     # Halaman download file
│   │   ├── lib/          # Utilitas dan konfigurasi
│   │   └── admin/        # Halaman admin (opsional)
│   └── styles/           # File CSS global dan utilitas
├── uploads/             # Direktori penyimpanan file yang diupload
├── .env                 # Environment variables
├── .env.example         # Contoh environment variables
├── next.config.js       # Konfigurasi Next.js
├── package.json         # Dependensi dan skrip
├── tailwind.config.js   # Konfigurasi Tailwind CSS
└── tsconfig.json        # Konfigurasi TypeScript
```

## 💿 Penggunaan Aplikasi

1. **Upload File**
   - Kunjungi halaman utama aplikasi
   - Tarik dan lepaskan file ke area upload atau klik untuk memilih file
   - Klik tombol "Upload" untuk mulai mengunggah file
   - Tunggu hingga proses upload selesai

2. **Bagikan File**
   - Setelah upload selesai, Anda akan melihat link download
   - Salin link tersebut dengan mengklik tombol "Salin"
   - Bagikan link kepada siapa saja yang perlu mengakses file Anda

3. **Download File**
   - Klik link download yang diterima
   - Halaman download akan menampilkan informasi file
   - Klik tombol "Download Sekarang" untuk memulai proses download
   - Lihat progress, kecepatan, dan estimasi waktu secara real-time

## 👩‍💻 Pengembangan Lebih Lanjut

### Menambahkan Cloud Storage

Secara default, aplikasi menggunakan penyimpanan lokal. Untuk mengintegrasikan cloud storage seperti AWS S3 atau Google Cloud Storage:

1. Install library yang sesuai, misalnya `@aws-sdk/client-s3` untuk AWS S3
2. Buat file konfigurasi di `src/app/lib/storage.ts`
3. Modifikasi `src/app/api/upload/route.ts` dan `src/app/api/download/[key]/route.ts` untuk menggunakan cloud storage

### Menambahkan Autentikasi

Untuk menambahkan autentikasi:

1. Install library seperti NextAuth.js: `npm install next-auth`
2. Konfigurasi provider autentikasi di `src/app/api/auth/[...nextauth]/route.ts`
3. Buat komponen login dan register
4. Tambahkan middleware untuk melindungi rute tertentu

## 📝 Konfigurasi Lanjutan

### Mengubah Batas Ukuran File

Edit variabel `MAX_FILE_SIZE` di file `.env` (dalam bytes):

```bash
# 100MB
MAX_FILE_SIZE="104857600"

# 250MB
MAX_FILE_SIZE="262144000"
```

### Mengubah Direktori Penyimpanan

Edit variabel `UPLOAD_DIR` di file `.env`:

```bash
UPLOAD_DIR="custom-uploads-folder"
```

### Mengubah Port Server

Jalankan aplikasi dengan port kustom:

```bash
PORT=4000 npm start
```

## 🐳 Menggunakan Docker (Opsional)

### 1. Buat Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. Buat Docker Compose

```yaml
version: '3'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/sharefile
    depends_on:
      - db
    volumes:
      - uploads:/app/uploads

  db:
    image: postgres:14
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_DB=sharefile
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
  uploads:
```

### 3. Jalankan dengan Docker Compose

```bash
docker-compose up -d
```

## 🤝 Kontribusi

Kontribusi selalu diterima! Jika Anda ingin berkontribusi:

1. Fork repositori
2. Buat branch fitur (`git checkout -b fitur-baru`)
3. Commit perubahan Anda (`git commit -am 'Menambahkan fitur'`)
4. Push ke branch (`git push origin fitur-baru`)
5. Buat Pull Request baru

## 📄 Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).

## 📞 Kontak

Untuk pertanyaan atau masalah, silakan buka issue di repositori GitHub atau hubungi [alamat email Anda].

---

Dikembangkan dengan ❤️ menggunakan [Next.js](https://nextjs.org/)
