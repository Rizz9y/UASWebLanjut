const { User } = require("../models");
const { hashPassword } = require("./password");

const createInitialAdmin = async () => {
  try {
    const adminExists = await User.findOne({ where: { username: "admin" } });
    if (!adminExists) {
      const hashedPassword = await hashPassword("admin123"); // Ganti dengan password yang kuat di produksi!
      const newAdmin = await User.create({
        name: "Super Admin",
        username: "admin",
        password: hashedPassword,
        role: "admin",
      });
      console.log(
        "Akun Admin default berhasil dibuat (username: admin, password: admin123). Mohon segera ubah password!"
      );
    } else {
      console.log("Akun Admin sudah ada.");
    }
  } catch (error) {
    console.error("Error saat membuat akun Admin awal:", error);
  }
};

module.exports = { createInitialAdmin };
