const notFoundHandler = (req, res, next) => {
  const error = new Error(`Rute ${req.originalUrl} tidak ditemukan`);
  error.status = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  // 1. Body JSON rusak
  if (
    (err instanceof SyntaxError && err.status === 400 && 'body' in err) ||
    err.type === 'entity.parse.failed'
  ) {
    return res.status(400).json({
      message: 'Format JSON tidak valid'
    });
  }

  // 2. ID bukan ObjectId (CastError) - tanpa menyebut nama model
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Format ID tidak valid'
    });
  }

  // 3. Pelanggaran Schema (ValidationError)
  if (err.name === 'ValidationError') {
    const detail = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      message: 'Data tidak valid',
      detail
    });
  }

  // 4. Nilai unik bentrok (kode 11000)
  if (err.code === 11000) {
    const fields = Object.keys(err.keyPattern || err.keyValue || {}).join(', ');
    return res.status(409).json({
      message: fields ? `Data dengan ${fields} tersebut sudah terdaftar` : 'Data unik bentrok'
    });
  }

  // 5. Galat yang dilempar sengaja (mis. data tidak ditemukan)
  if (err.status || err.statusCode) {
    const status = err.status || err.statusCode;
    return res.status(status).json({
      message: err.message
    });
  }

  // 6. Galat lain yang tidak terduga (500, tanpa stack trace)
  return res.status(500).json({
    message: 'Terjadi kesalahan pada server'
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
};
