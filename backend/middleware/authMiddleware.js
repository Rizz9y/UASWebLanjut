const { verifyToken } = require("../utils/jwt");

const verifyAuthToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res
      .status(401)
      .json({ message: "Akses ditolak. Token tidak ditemukan." });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Akses ditolak. Format token tidak valid." });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return res
      .status(403)
      .json({ message: "Token tidak valid atau kadaluarsa." });
  }

  req.user = decoded; // Menyimpan payload user yang terdekode ke objek request
  next();
};

module.exports = { verifyAuthToken };
