const Bus = require('../models/busModel');

// C1. POST [pathPendukung] -> Status 201 (Menyimpan { kode, nama })
const createBus = async (req, res, next) => {
  try {
    const { kode, nama } = req.body;
    const bus = await Bus.create({ kode, nama });
    res.status(201).json(bus);
  } catch (error) {
    next(error);
  }
};

// C1. GET [pathPendukung] -> Status 200 (Array berisi seluruh data [Pendukung])
const getBuses = async (req, res, next) => {
  try {
    const buses = await Bus.find();
    res.status(200).json(buses);
  } catch (error) {
    next(error);
  }
};

// GET [pathPendukung]/:id -> Detail satu bus
const getBusById = async (req, res, next) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) {
      const err = new Error('Bus tidak ditemukan');
      err.status = 404;
      return next(err);
    }
    res.status(200).json(bus);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBus,
  getBuses,
  getBusById
};
