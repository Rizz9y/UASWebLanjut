const { Supplier } = require("../models");

exports.createSupplier = async (req, res) => {
  const { name, contact_person, phone_number, email, address } = req.body;
  try {
    if (!name) {
      return res.status(400).json({ message: "Nama supplier harus diisi." });
    }
    const supplier = await Supplier.create({
      name,
      contact_person,
      phone_number,
      email,
      address,
    });
    res.status(201).json({ message: "Supplier berhasil dibuat.", supplier });
  } catch (error) {
    console.error("Error creating supplier:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ message: "Nama atau email supplier sudah ada." });
    }
    res.status(500).json({
      message: "Terjadi kesalahan server saat membuat supplier.",
      error: error.message,
    });
  }
};

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      order: [["name", "ASC"]],
    });
    res.status(200).json(suppliers);
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat mengambil supplier.",
      error: error.message,
    });
  }
};

exports.getSupplierById = async (req, res) => {
  const { id } = req.params;
  try {
    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier tidak ditemukan." });
    }
    res.status(200).json(supplier);
  } catch (error) {
    console.error("Error fetching supplier by ID:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat mengambil supplier.",
      error: error.message,
    });
  }
};

exports.updateSupplier = async (req, res) => {
  const { id } = req.params;
  const { name, contact_person, phone_number, email, address } = req.body;
  try {
    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier tidak ditemukan." });
    }
    if (!name) {
      return res
        .status(400)
        .json({ message: "Nama supplier tidak boleh kosong." });
    }
    await supplier.update({
      name: name ?? supplier.name,
      contact_person: contact_person ?? supplier.contact_person,
      phone_number: phone_number ?? supplier.phone_number,
      email: email ?? supplier.email,
      address: address ?? supplier.address,
    });
    res
      .status(200)
      .json({ message: "Supplier berhasil diperbarui.", supplier });
  } catch (error) {
    console.error("Error updating supplier:", error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ message: "Nama atau email supplier sudah ada." });
    }
    res.status(500).json({
      message: "Terjadi kesalahan server saat memperbarui supplier.",
      error: error.message,
    });
  }
};

exports.deleteSupplier = async (req, res) => {
  const { id } = req.params;
  try {
    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier tidak ditemukan." });
    }
    // Opsional: Cek apakah ada stock_transaction yang terkait supplier ini sebelum menghapus
    // const transactionsCount = await StockTransaction.count({ where: { supplierId: id } });
    // if (transactionsCount > 0) {
    //     return res.status(400).json({ message: 'Tidak dapat menghapus supplier karena masih ada transaksi stok yang terkait.' });
    // }

    await supplier.destroy();
    res.status(200).json({ message: "Supplier berhasil dihapus." });
  } catch (error) {
    console.error("Error deleting supplier:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat menghapus supplier.",
      error: error.message,
    });
  }
};
