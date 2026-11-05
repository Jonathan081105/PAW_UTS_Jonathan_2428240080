require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

const busRoutes = require('./routes/busRoutes');
const tiketRoutes = require('./routes/tiketRoutes');

const app = express();

// A2. Middleware CORS (hanya mengizinkan process.env.CORS_ORIGIN, method GET dan POST)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST']
  })
);

// Body parser JSON
app.use(express.json());

// Rute dasar informasi API
app.get('/', (req, res) => {
  res.status(200).json({
    nama: 'RESTful API Sistem Agent Bus',
    nim: '2428240080',
    topik: 'Agent Bus',
    endpoints: {
      bus: ['GET /bus', 'POST /bus', 'GET /bus/:id'],
      tiket: [
        'GET /tiket',
        'POST /tiket',
        'GET /tiket/:id',
        'GET /tiket?status=...',
        'GET /tiket?sort=harga'
      ]
    }
  });
});

// Mounting routes untuk entity Pendukung (Bus) dan Utama (Tiket)
// Mendukung bahasa Indonesia (/bus, /tiket) dan standar (/buses, /tickets)
app.use('/bus', busRoutes);
app.use('/buses', busRoutes);
app.use('/tiket', tiketRoutes);
app.use('/tickets', tiketRoutes);

// Penanganan error terpusat didaftarkan paling akhir
app.use(notFoundHandler);
app.use(errorHandler);

// B1. Hubungkan ke MongoDB, server baru menerima request setelah koneksi berhasil
const startServer = async () => {
  await connectDB();
  const PORT = process.env.PORT;
  app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
  });
};

if (require.main === module) {
  startServer();
}
module.exports = app;
