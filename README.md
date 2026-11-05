# UTS Pengembangan Aplikasi Web II : RESTful API Sistem Agent Bus

> **Mata Kuliah:** Pengembangan Aplikasi Web II (SI0027)  
> **Dosen Penguji:** Nur Rachmat, M.Kom.  
> **Nama Mahasiswa:** Jonathan Immanuel A.  
> **NIM:** 2428240080  
> **Kelas:** SI5B  
> **Topik Penugasan:** Agent Bus (Pemesanan Tiket Bus)  
> **Repository Utama:** [https://github.com/Jonathan081105/PAW_UTS_Jonathan_2428240080.git](https://github.com/Jonathan081105/PAW_UTS_Jonathan_2428240080.git)  
> **Repository Cermin/Salinan:** [https://github.com/achmadhafistasetyanto2529250027-a11y/PAW_UTS_Jonathan_2428240080.git](https://github.com/achmadhafistasetyanto2529250027-a11y/PAW_UTS_Jonathan_2428240080.git)

---

## 📌 Deskripsi Proyek

Proyek ini adalah implementasi RESTful API terstruktur (*routes*, *controllers*, *models*, *middlewares*) untuk sistem **Agent Bus** (Tiket Bus) yang terhubung penuh ke basis data NoSQL **MongoDB** menggunakan **Mongoose ODM** dan **Express 5**. Proyek ini dikembangkan untuk memenuhi seluruh kriteria evaluasi Ujian Tengah Semester (UTS) Gasal 2026/2027.

Proyek ini menerapkan prinsip:
1. **Pemisahan Konfigurasi Lingkungan (`dotenv`)**: Seluruh konfigurasi penting (`PORT`, `MONGODB_URI`, `CORS_ORIGIN`) dimuat dari berkas `.env` tanpa ada nilai konfigurasi yang ditulis langsung (*hardcoded*) di dalam kode. Berkas `.env.example` disediakan dengan nilai pengganti (*dummy*), dan `.env` diabaikan oleh `.gitignore`.
2. **Keamanan CORS Terbatas**: Middleware `cors` dikonfigurasi secara ketat hanya mengizinkan *origin* dari `process.env.CORS_ORIGIN` (`http://localhost:5173`) dengan metode HTTP `GET` dan `POST`.
3. **Error Handling Terpusat**: Seluruh galat (*error*) ditangani secara terpusat oleh `middlewares/errorHandler.js` (`notFoundHandler` dan `errorHandler` dengan empat parameter) yang didaftarkan paling akhir pada alur middleware `app.js`.
4. **Data Modeling NoSQL (Embedding & Referencing)**:
   - **Entity Pendukung (`Bus`)**: Menyimpan armada bus dengan atribut `kode` (unik, wajib, huruf besar otomatis) dan `nama` (wajib, trim).
   - **Entity Utama (`Tiket`)**: Menyimpan data tiket pemesanan bus dengan atribut `kodeTiket` (unik, wajib, trim, uppercase), `namaPenumpang` (wajib, trim), `harga` (wajib, tipe Number, nilai minimal 0), `status` (wajib, nilai bawaan `'terjadwal'`), dan `createdAt` (nilai bawaan waktu sekarang).
   - **Embedding Subdocument (`rute`)**: Menyimpan kota `asal` dan kota `tujuan` perjalanan sebagai subdokumen tanpa memiliki `_id` sendiri (`_id: false`).
   - **Referencing (`bus`)**: Menghubungkan tiket ke dokumen armada bus menggunakan `mongoose.Schema.Types.ObjectId` dengan referensi ke model `Bus` (`ref: 'Bus'`), yang di-populate pada endpoint detail.
5. **Operasi CRUD, Filtering, dan Sorting**:
   - Create dan Read entity pendukung (`/bus`).
   - Create entity utama dengan validasi ketat dan penyaringan *field* di luar tabel topik (`/tiket`).
   - Read seluruh data utama (`GET /tiket`).
   - Filtering data dengan *query parameter* `?[filter]=...` persis, mengembalikan array kosong `[]` jika tidak ada kecocokan.
   - Sorting menaik dinamis `?sort=[angka]` (misalnya `?sort=harga`).
   - Penggabungan filter dan sorting secara simultan (`?status=terjadwal&sort=harga`).
   - Read detail tiket tunggal dengan `.populate('bus', 'kode nama')`, penanganan status 404 untuk ID tidak ditemukan, dan status 400 untuk ID salah format (*CastError* tanpa menyebut nama model).

---

## 🗄️ Desain Schema Basis Data

### 1. Model Pendukung: `Bus` (`models/busModel.js`)
| Field | Tipe | Aturan Validasi | Keterangan |
| :--- | :--- | :--- | :--- |
| `kode` | String | `required`, `unique`, `uppercase`, `trim` | Kode identitas bus (mis. `BUS-01`) |
| `nama` | String | `required`, `trim` | Nama/operator bus (mis. `Sinar Jaya Executive`) |

### 2. Model Utama: `Tiket` (`models/tiketModel.js`)
| Field | Tipe | Aturan Validasi | Keterangan |
| :--- | :--- | :--- | :--- |
| `kodeTiket` | String | `required`, `unique`, `trim`, `uppercase` | Kode unik tiket (mis. `TKT-2026-001`) |
| `namaPenumpang` | String | `required`, `trim` | Nama lengkap penumpang |
| `harga` | Number | `required`, `min: 0` | Harga tiket bus dalam Rupiah |
| `status` | String | `required`, `trim`, `default: 'terjadwal'` | Status tiket (`terjadwal`, `berangkat`, `selesai`, `batal`) |
| `rute` | Object | Subdocument (`_id: false`) | **Embedding**: berisi `asal` dan `tujuan` |
| `rute.asal` | String | `required`, `trim` | Kota keberangkatan (mis. `Palembang`) |
| `rute.tujuan` | String | `required`, `trim` | Kota tujuan (mis. `Jakarta`) |
| `bus` | ObjectId | `required`, `ref: 'Bus'` | **Referencing**: referensi ID ke koleksi `Bus` |
| `createdAt` | Date | `default: Date.now` | Waktu pencatatan tiket otomatis |

---

## 🚀 Dokumentasi Endpoint RESTful API

Seluruh endpoint utama mendukung path bahasa Indonesia (`/bus`, `/tiket`) maupun alias standar (`/buses`, `/tickets`).

| Kode Soal | Metode | Endpoint | Status Sukses | Deskripsi & Ketentuan |
| :---: | :---: | :--- | :---: | :--- |
| **C1** | `POST` | `/bus` | `201 Created` | Menyimpan armada bus baru `{ kode, nama }`. |
| **C1** | `GET` | `/bus` | `200 OK` | Mengembalikan *Array* berisi seluruh data bus. |
| **C1** | `POST` | `/tiket` | `201 Created` | Menyimpan tiket baru. Hanya *field* tabel topik yang diterima dari body, *field* lain diabaikan. |
| **C2** | `GET` | `/tiket` | `200 OK` | Mengembalikan *Array* berisi seluruh data tiket. |
| **C3** | `GET` | `/tiket?status=terjadwal` | `200 OK` | Memfilter data tiket berdasarkan nilai status sama persis. Mengembalikan `[]` jika tidak cocok. |
| **C3** | `GET` | `/tiket?sort=harga` | `200 OK` | Mengurutkan data tiket secara menaik berdasarkan field nominal (`harga`). |
| **C3** | `GET` | `/tiket?status=terjadwal&sort=harga` | `200 OK` | Menggabungkan *filtering* dan *sorting* secara bersamaan. |
| **C4** | `GET` | `/tiket/:id` | `200 OK` | Mengambil detail tiket tunggal dengan relasi `bus` di-populate (memuat `kode` dan `nama`). |

---

## 🛡️ Standar Respons Error Handling Terpusat (A3)

Semua respons kesalahan dikembalikan dalam format konsisten `{ "message": "..." }`:

| Kondisi Galat | Status Code | Format Respons JSON | Keterangan |
| :--- | :---: | :--- | :--- |
| **Rute tidak ada** | `404 Not Found` | `{ "message": "Rute ... tidak ditemukan" }` | Mengakses rute yang tidak terdaftar |
| **Body JSON rusak** | `400 Bad Request` | `{ "message": "Format JSON tidak valid" }` | Syntax JSON request body tidak valid |
| **ID bukan ObjectId (*CastError*)** | `400 Bad Request` | `{ "message": "Format ID tidak valid" }` | Format ID URL salah, tanpa menyebut nama model |
| **Pelanggaran Schema (*ValidationError*)** | `400 Bad Request` | `{ "message": "Data tidak valid", "detail": [...] }` | Nilai field tidak memenuhi aturan validasi Mongoose |
| **Nilai unik bentrok (*code 11000*)** | `409 Conflict` | `{ "message": "Data dengan ... sudah terdaftar" }` | Duplikasi nilai unik pada `kode` bus atau `kodeTiket` |
| **Data tidak ditemukan** | `404 Not Found` | `{ "message": "Tiket tidak ditemukan" }` | ID berformat benar tetapi dokumen tidak ada di database |
| **Galat tidak terduga** | `500 Server Error` | `{ "message": "Terjadi kesalahan pada server" }` | Error internal server tanpa memaparkan *stack trace* |

---

## 💻 Panduan Instalasi & Menjalankan Proyek

### 1. Kloning Repositori
```bash
git clone https://github.com/Jonathan081105/PAW_UTS_Jonathan_2428240080.git
cd PAW_UTS_Jonathan_2428240080
```

### 2. Pasang Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (`.env`)
Salin berkas `.env.example` menjadi `.env` lalu sesuaikan dengan konfigurasi MongoDB lokal / cloud Anda:
```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/uts_paw2_2428240080
CORS_ORIGIN=http://localhost:5173
```

### 4. Seeding Data Awal ke Basis Data
Jalankan skrip seeder untuk menginisialisasi koleksi armada bus dan tiket demo:
```bash
npm run seed
```
Output yang diharapkan:
```
MongoDB terhubung untuk seeding data...
Koleksi lama berhasil dibersihkan.
Berhasil menambahkan 4 data bus.
Berhasil menambahkan 5 data tiket.
Seeding selesai dengan sukses!
```

### 5. Menjalankan Server
```bash
# Mode pengembangan dengan nodemon:
npm run dev

# Mode produksi:
npm start
```
Server akan aktif di: `http://localhost:4000`

---

## 🧪 Pengujian Otomatis dengan Postman & Newman

Koleksi pengujian otomatis lengkap dan environment telah disediakan di dalam folder `postman/`:
- **Collection**: `postman/PAW_UTS_Agent_Bus.postman_collection.json`
- **Environment**: `postman/PAW_UTS_Environment.postman_environment.json`

### Menjalankan Pengujian via Newman CLI:
```bash
npx newman run postman/PAW_UTS_Agent_Bus.postman_collection.json -e postman/PAW_UTS_Environment.postman_environment.json
```
**Hasil Evaluasi Pengujian Otomatis:**
- Total Request: 14 skenario (Positive & Negative)
- Total Asersi: 28 assertions
- Hasil: **100% Passed (0 Failed)**
