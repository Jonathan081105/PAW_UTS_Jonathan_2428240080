const mongoose = require('mongoose');

// B3. Embedding: field rute berupa subdocument dengan dua field teks sesuai topik, tanpa _id sendiri
const ruteSchema = new mongoose.Schema(
  {
    asal: {
      type: String,
      required: [true, 'Kota asal rute wajib diisi'],
      trim: true
    },
    tujuan: {
      type: String,
      required: [true, 'Kota tujuan rute wajib diisi'],
      trim: true
    }
  },
  {
    _id: false
  }
);

// B2 & B3. Model Utama: Tiket
// Field dengan required, unique, trim, min, createdAt default sekarang, embedding rute, referencing bus
const tiketSchema = new mongoose.Schema(
  {
    kodeTiket: {
      type: String,
      required: [true, 'Kode tiket wajib diisi'],
      unique: true,
      trim: true,
      uppercase: true
    },
    namaPenumpang: {
      type: String,
      required: [true, 'Nama penumpang wajib diisi'],
      trim: true
    },
    harga: {
      type: Number,
      required: [true, 'Harga tiket wajib diisi'],
      min: [0, 'Harga tiket tidak boleh bernilai negatif']
    },
    status: {
      type: String,
      required: [true, 'Status tiket wajib diisi'],
      trim: true,
      default: 'terjadwal'
    },
    rute: {
      type: ruteSchema,
      required: [true, 'Rute tiket wajib diisi']
    },
    bus: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Bus',
      required: [true, 'Referensi bus wajib diisi']
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('Tiket', tiketSchema);
