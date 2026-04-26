# AI Candidate Profiler

Proyek ini adalah aplikasi web yang menggunakan AI untuk menganalisis profil kandidat berdasarkan CV yang diunggah. Aplikasi ini membantu proses rekrutmen dengan memberikan wawasan objektif dan terukur tentang kandidat.

## Fitur

- Upload CV kandidat dalam format PDF
- Analisis otomatis menggunakan AI (Google Gemini)
- Tampilan hasil analisis yang mudah dipahami
- Antarmuka web responsif

## Prasyarat

- Docker & Docker Compose terinstal di mesin lokal atau server
- API Key dari Google AI Studio (untuk Gemini API)

## Instalasi dan Menjalankan (Local/Docker)

### 1. Clone Repositori

```bash
git clone https://github.com/FirmanWijayaKusuma/AI-Candidate-Profiler.git
cd AI-Candidate-Profiler
```

### 2. Konfigurasi API Key

Buat file `.env` di dalam folder `backend/`:

```env
GEMINI_API_KEY=your_api_key_here
```

### 3. Update URL Endpoint

Pastikan URL fetch di `frontend/src/App.jsx` mengarah ke `localhost:8000` (untuk local) atau IP Publik AWS Anda.

### 4. Jalankan dengan Docker Compose

```bash
docker-compose up -d --build
```

### 5. Akses Aplikasi

Buka browser dan akses `http://localhost:5173`.

## Deployment di AWS EC2

1. Luncurkan instance Ubuntu t2.micro di AWS.
2. Buka port 5173 (Frontend) dan 8000 (Backend) pada Security Group.
3. Lakukan `git pull` kode sumber ke server.
4. Jalankan `sudo docker-compose up -d --build`.

## Kesimpulan & Visi

Proyek ini mendemonstrasikan bagaimana teknologi AI dapat diintegrasikan ke dalam alur kerja profesional untuk menyelesaikan masalah bisnis yang konkret secara efisien. Dengan pendekatan data-driven, proses rekrutmen tidak lagi hanya mengandalkan intuisi, melainkan didukung oleh analisis yang objektif dan terukur.
