const { User } = require("../models");
const { comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");
const { saveLog } = require("../utils/logger");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      await saveLog({
        level: "warn",
        message: `Percobaan login gagal (username tidak ditemukan): ${username}`,
        user: username,
      });
      return res.status(401).json({ message: "Username atau password salah." });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      await saveLog({
        level: "warn",
        message: `Percobaan login gagal (password salah): ${username}`,
        user: username,
      });
      return res.status(401).json({ message: "Username atau password salah." });
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    const token = generateToken(payload);

    await saveLog({
      level: "info",
      message: `Login berhasil untuk user: ${username}`,
      user: username,
    });

    res.status(200).json({
      message: "Login berhasil!",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        name: user.name,
      },
    });
  } catch (error) {
    console.error("Error saat login:", error);
    await saveLog({
      level: "error",
      message: `Error saat login untuk user: ${username}`,
      meta: { error: error.message },
      user: username,
    });
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server saat proses login." });
  }
};
