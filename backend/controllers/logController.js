const Log = require("../models/Log"); // Import Log model (MongoDB)

exports.getRecentLogs = async (req, res) => {
  try {
    // Ambil 100 log terakhir, bisa ditambahkan filter/paginasi nanti
    const logs = await Log.find({})
      .sort({ timestamp: -1 }) // Urutkan dari yang terbaru
      .limit(100);
    res.status(200).json(logs);
  } catch (error) {
    console.error("Error fetching logs:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat mengambil log.",
      error: error.message,
    });
  }
};
