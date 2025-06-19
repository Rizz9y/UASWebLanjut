const { User } = require("../models");
const { hashPassword } = require("../utils/password");

exports.createStaffAccount = async (req, res) => {
  const { name, username, password } = req.body;

  try {
    if (!name || !username || !password) {
      return res
        .status(400)
        .json({ message: "Nama, username, dan password harus diisi." });
    }

    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({
        message: "Username sudah digunakan. Mohon gunakan yang lain.",
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await User.create({
      name,
      username,
      password: hashedPassword,
      role: "staf_gudang",
    });

    res.status(201).json({
      message: "Akun staf berhasil dibuat.",
      user: {
        id: newUser.id,
        name: newUser.name,
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Error saat membuat akun staf:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat membuat akun staf.",
      error: error.message,
    });
  }
};

exports.getAllStaffAccounts = async (req, res) => {
  try {
    const staffUsers = await User.findAll({
      where: { role: "staf_gudang" },
      attributes: ["id", "name", "username", "role", "createdAt", "updatedAt"],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json(staffUsers);
  } catch (error) {
    console.error("Error saat mengambil akun staf:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat mengambil akun staf.",
      error: error.message,
    });
  }
};

exports.updateStaffAccount = async (req, res) => {
  const { id } = req.params;
  const { name, username, password } = req.body;

  try {
    const user = await User.findByPk(id);
    if (!user || user.role !== "staf_gudang") {
      return res.status(404).json({ message: "Akun staf tidak ditemukan." });
    }

    user.name = name !== undefined ? name : user.name;
    user.username = username !== undefined ? username : user.username;
    if (password) {
      user.password = await hashPassword(password);
    }

    await user.save();

    res.status(200).json({
      message: "Akun staf berhasil diperbarui.",
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error saat memperbarui akun staf:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat memperbarui akun staf.",
      error: error.message,
    });
  }
};

exports.deleteStaffAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const userToDelete = await User.findByPk(id);
    if (!userToDelete || userToDelete.role !== "staf_gudang") {
      return res.status(404).json({
        message: "Akun staf tidak ditemukan atau tidak dapat dihapus.",
      });
    }

    const result = await User.destroy({
      where: { id: id, role: "staf_gudang" },
    });

    if (result === 0) {
      return res.status(404).json({
        message: "Akun staf tidak ditemukan atau tidak dapat dihapus.",
      });
    }

    res.status(200).json({ message: "Akun staf berhasil dihapus." });
  } catch (error) {
    console.error("Error saat menghapus akun staf:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat menghapus akun staf.",
      error: error.message,
    });
  }
};
