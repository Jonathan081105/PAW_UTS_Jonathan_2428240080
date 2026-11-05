const Tiket = require('../models/tiketModel');

// C1. POST [path] -> Status 201
// Hanya field dari tabel topik yang diterima dari body; field lain diabaikan
const createTiket = async (req, res, next) => {
  try {
    const { kodeTiket, namaPenumpang, harga, status, rute, bus } = req.body;
    const tiketData = { kodeTiket, namaPenumpang, harga, rute, bus };

    if (status !== undefined) {
      tiketData.status = status;
    }

    const tiket = await Tiket.create(tiketData);
    res.status(201).json(tiket);
  } catch (error) {
    next(error);
  }
};

// C2 & C3. GET [path] -> Status 200
// C2: Array berisi seluruh data [Utama]
// C3: Filter dengan query parameter [filter] persis. Bila tidak cocok -> []
// C3: Sorting menaik dengan ?sort=[angka] -> .sort({ [angka]: 1 })
// Digabung: ?[filter]=...&sort=[angka]
const getTikets = async (req, res, next) => {
  try {
    const filter = {};
    const validFields = ['status', 'kodeTiket', 'namaPenumpang', 'harga', 'bus'];

    for (const key of Object.keys(req.query)) {
      if (key === 'sort' || key === 'sortBy' || key === 'order') continue;

      if (key === 'asal') {
        filter['rute.asal'] = req.query.asal;
      } else if (key === 'tujuan') {
        filter['rute.tujuan'] = req.query.tujuan;
      } else if (key === 'rute.asal') {
        filter['rute.asal'] = req.query['rute.asal'];
      } else if (key === 'rute.tujuan') {
        filter['rute.tujuan'] = req.query['rute.tujuan'];
      } else if (validFields.includes(key)) {
        filter[key] = key === 'harga' ? Number(req.query[key]) : req.query[key];
      }
    }

    let query = Tiket.find(filter);

    const sortParam = req.query.sort || req.query.sortBy;
    if (sortParam) {
      const sortField = sortParam === '1' || sortParam === 'asc' ? 'harga' : sortParam;
      query = query.sort({ [sortField]: 1 });
    }

    const tikets = await query.exec();
    res.status(200).json(tikets);
  } catch (error) {
    next(error);
  }
};

// C4. GET [path]/:id -> Status 200
// [ref] di-populate (memuat kode dan nama)
// ID tidak ada: 404
// ID salah format: 400 (ditangani CastError di errorHandler)
const getTiketById = async (req, res, next) => {
  try {
    const tiket = await Tiket.findById(req.params.id).populate('bus', 'kode nama');
    if (!tiket) {
      const err = new Error('Tiket tidak ditemukan');
      err.status = 404;
      return next(err);
    }
    res.status(200).json(tiket);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTiket,
  getTikets,
  getTiketById
};
