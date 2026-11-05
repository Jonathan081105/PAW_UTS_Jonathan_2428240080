const mongoose = require('mongoose');

// B3. Model Pendukung: Bus
// Field kode (String, wajib, unik, disimpan huruf besar) dan nama (String, wajib, trim)
const busSchema = new mongoose.Schema(
  {
    kode: {
      type: String,
      required: [true, 'Kode bus wajib diisi'],
      unique: true,
      uppercase: true,
      trim: true
    },
    nama: {
      type: String,
      required: [true, 'Nama bus wajib diisi'],
      trim: true
    }
  },
  {
    versionKey: false
  }
);

module.exports = mongoose.model('Bus', busSchema);
