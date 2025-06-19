const express = require('express');
const router = express.Router();
const { Category } = require('../models'); // pastikan model Category tersedia

// Tambah kategori
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Nama kategori wajib diisi' });

    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (err) {
    console.error('Gagal tambah kategori:', err);
    res.status(500).json({ error: 'Gagal tambah kategori' });
  }
});

// Ambil semua kategori
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Gagal ambil data kategori' });
  }
});

module.exports = router;
