const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");
const { verifyAuthToken } = require("../middleware/authMiddleware");
const { checkRole } = require("../middleware/roleMiddleware");

// --- Rute untuk Transaksi Stok ---

router.post(
  "/in",
  verifyAuthToken,
  checkRole(["admin", "staf_gudang"]),
  stockController.stockIn
);

router.post(
  "/out",
  verifyAuthToken,
  checkRole(["admin", "staf_gudang"]),
  stockController.stockOut
);

router.post(
  "/adjust",
  verifyAuthToken,
  checkRole(["admin", "staf_gudang"]),
  stockController.stockAdjustment
);

router.get(
  "/history",
  verifyAuthToken,
  checkRole(["admin", "staf_gudang"]),
  stockController.getStockHistory
);

router.get(
  "/summary",
  verifyAuthToken,
  checkRole(["admin", "staf_gudang"]),
  stockController.getCurrentStockSummary
);

module.exports = router;
