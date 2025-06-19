const { Category, Product } = require('../models');

// Tambah kategori
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Nama kategori wajib diisi.' });

    const newCategory = await Category.create({ name });
    res.status(201).json(newCategory);
  } catch (err) {
    res.status(500).json({ message: 'Gagal tambah kategori.', error: err.message });
  }
};

// Ambil semua kategori
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Gagal ambil kategori.', error: err.message });
  }
};

// Edit kategori berdasarkan ID
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Nama kategori wajib diisi.' });
    }

    const [updated] = await Category.update({ name }, { where: { id } });

    if (updated === 0) {
      return res.status(404).json({ message: 'Kategori tidak ditemukan.' });
    }

    res.status(200).json({ message: 'Kategori berhasil diperbarui.' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengedit kategori.', error: err.message });
  }
};

// Hapus kategori berdasarkan ID
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const usedByProducts = await Product.findOne({ where: { categoryId: id } });
    if (usedByProducts) {
      return res.status(400).json({
        message: 'Kategori tidak bisa dihapus karena masih digunakan oleh produk.'
      });
    }

    const deleted = await Category.destroy({ where: { id } });

    if (deleted) {
      return res.status(200).json({ message: 'Kategori berhasil dihapus.' });
    }

    return res.status(404).json({ message: 'Kategori tidak ditemukan.' });

  } catch (err) {
    res.status(500).json({
      message: 'Terjadi kesalahan saat menghapus kategori.',
      error: err.message
    });
  }
};
