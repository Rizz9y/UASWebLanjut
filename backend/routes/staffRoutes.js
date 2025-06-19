const express = require("express");
const router = express.Router();
const { User } = require("../models");

// Ambil semua staff (filter role)
router.get("/", async (req, res) => {
  try {
    const staff = await User.findAll({
      where: { role: "staff_gudang" }
    });
    res.json(staff);
  } catch (err) {
    res.status(500).json({ error: "Gagal ambil staff" });
  }
});

// Tambah staff
router.post("/", async (req, res) => {
  try {
    const { name, username, password } = req.body;

    const newStaff = await User.create({
      name,
      username,
      password,
      role: "staf_gudang"
    });

    res.status(201).json(newStaff);
  } catch (err) {
    res.status(500).json({ error: "Gagal tambah staff", detail: err.message });
  }
});

// Update staff
router.put("/:id", async (req, res) => {
  try {
    await User.update(req.body, { where: { id: req.params.id } });
    res.json({ message: "Staff diperbarui" });
  } catch (err) {
    res.status(500).json({ error: "Gagal update staff" });
  }
});

// Hapus staff
router.delete("/:id", async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: "Staff dihapus" });
  } catch (err) {
    res.status(500).json({ error: "Gagal hapus staff" });
  }
});

module.exports = router;
