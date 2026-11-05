const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB terhubung dengan sukses');
  } catch (error) {
    console.error('Koneksi ke MongoDB gagal:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
