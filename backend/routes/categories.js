const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyAuthToken } = require('../middleware/authMiddleware'); // pastikan path sesuai

// Gunakan middleware untuk semua route kategori
router.use(verifyAuthToken);

// Ambil semua kategori
router.get('/', categoryController.getAllCategories);

// Tambah kategori
router.post('/', categoryController.createCategory);

// Edit kategori berdasarkan ID
router.put('/:id', categoryController.updateCategory);

// Hapus kategori berdasarkan ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
