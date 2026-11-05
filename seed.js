require('dotenv').config();
const mongoose = require('mongoose');
const Bus = require('./models/busModel');
const Tiket = require('./models/tiketModel');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB terhubung untuk seeding data...');

    // Bersihkan data lama
    await Bus.deleteMany({});
    await Tiket.deleteMany({});
    console.log('Koleksi lama berhasil dibersihkan.');

    // 1. Data Bus (Entity Pendukung: kode [unik, uppercase], nama)
    const buses = await Bus.insertMany([
      { kode: 'BUS-01', nama: 'Sinar Jaya Executive' },
      { kode: 'BUS-02', nama: 'Rosalia Indah Super Top' },
      { kode: 'BUS-03', nama: 'Harapan Jaya VIP' },
      { kode: 'BUS-04', nama: 'Pahala Kencana Bisnis' }
    ]);
    console.log(`Berhasil menambahkan ${buses.length} data bus.`);

    // 2. Data Tiket (Entity Utama: kodeTiket, namaPenumpang, harga, status, rute, bus)
    const tikets = await Tiket.insertMany([
      {
        kodeTiket: 'TKT-2026-001',
        namaPenumpang: 'Jonathan Immanuel',
        harga: 250000,
        status: 'terjadwal',
        rute: {
          asal: 'Palembang',
          tujuan: 'Jakarta'
        },
        bus: buses[0]._id
      },
      {
        kodeTiket: 'TKT-2026-002',
        namaPenumpang: 'Siti Rahma',
        harga: 320000,
        status: 'terjadwal',
        rute: {
          asal: 'Palembang',
          tujuan: 'Bandung'
        },
        bus: buses[1]._id
      },
      {
        kodeTiket: 'TKT-2026-003',
        namaPenumpang: 'Ahmad Fauzi',
        harga: 180000,
        status: 'berangkat',
        rute: {
          asal: 'Palembang',
          tujuan: 'Lampung'
        },
        bus: buses[2]._id
      },
      {
        kodeTiket: 'TKT-2026-004',
        namaPenumpang: 'Budi Santoso',
        harga: 400000,
        status: 'selesai',
        rute: {
          asal: 'Palembang',
          tujuan: 'Yogyakarta'
        },
        bus: buses[3]._id
      },
      {
        kodeTiket: 'TKT-2026-005',
        namaPenumpang: 'Dewi Lestari',
        harga: 275000,
        status: 'terjadwal',
        rute: {
          asal: 'Palembang',
          tujuan: 'Jakarta'
        },
        bus: buses[0]._id
      }
    ]);
    console.log(`Berhasil menambahkan ${tikets.length} data tiket.`);

    console.log('Seeding selesai dengan sukses!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding gagal:', error.message);
    process.exit(1);
  }
};

seedData();
