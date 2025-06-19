const { User } = require("../models");
const { comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Username atau password salah." });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Username atau password salah." });
    }

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    const token = generateToken(payload);

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
    res
      .status(500)
      .json({ message: "Terjadi kesalahan server saat proses login." });
  }
};
