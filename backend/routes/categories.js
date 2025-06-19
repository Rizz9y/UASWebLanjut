const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Ambil semua kategori
router.get('/', categoryController.getAllCategories);

// Tambah kategori
router.post('/', categoryController.createCategory);

// Edit kategori berdasarkan ID
router.put('/:id', categoryController.updateCategory);

// Hapus kategori berdasarkan ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
