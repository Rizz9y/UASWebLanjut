const express = require("express");
const router = express.Router();
const supplierController = require("../controllers/supplierController");
const { verifyAuthToken } = require("../middleware/authMiddleware");
const { checkRole } = require("../middleware/roleMiddleware");

// --- Rute untuk Supplier ---
router.post(
  "/",
  verifyAuthToken,
  checkRole(["admin"]),
  supplierController.createSupplier
);

router.get(
  "/",
  verifyAuthToken,
  checkRole(["admin", "staf_gudang"]),
  supplierController.getAllSuppliers
);

router.get(
  "/:id",
  verifyAuthToken,
  checkRole(["admin", "staf_gudang"]),
  supplierController.getSupplierById
);

router.put(
  "/:id",
  verifyAuthToken,
  checkRole(["admin"]),
  supplierController.updateSupplier
);

router.delete(
  "/:id",
  verifyAuthToken,
  checkRole(["admin"]),
  supplierController.deleteSupplier
);

module.exports = router;
