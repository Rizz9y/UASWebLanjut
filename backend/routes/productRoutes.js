const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { verifyAuthToken } = require("../middleware/authMiddleware");
const { checkRole } = require("../middleware/roleMiddleware");



app.use("/api/products", productRoutes);

// --- Rute untuk Kategori ---
router.post(
  "/categories",
  verifyAuthToken,
  checkRole(["admin"]),
  productController.createCategory
);
router.get(
  "/categories",
  verifyAuthToken,
  checkRole(["admin", "staf_gudang"]),
  productController.getAllCategories
);
router.put(
  "/categories/:id",
  verifyAuthToken,
  checkRole(["admin"]),
  productController.updateCategory
);
router.delete(
  "/categories/:id",
  verifyAuthToken,
  checkRole(["admin"]),
  productController.deleteCategory
);

// --- Rute untuk Produk & Varian ---
router.post(
  "/",
  verifyAuthToken,
  checkRole(["admin"]),
  productController.createProduct
);

router.get(
  "/",
  verifyAuthToken,
  checkRole(["admin", "staf_gudang"]),
  productController.getAllProducts
);

router.get(
  "/:id",
  verifyAuthToken,
  checkRole(["admin", "staf_gudang"]),
  productController.getProductById
);

router.put(
  "/:id",
  verifyAuthToken,
  checkRole(["admin"]),
  productController.updateProduct
);

router.delete(
  "/:id",
  verifyAuthToken,
  checkRole(["admin"]),
  productController.deleteProduct
);

// --- Rute untuk Ringkasan Kategori ---
router.get(
  "/category-summary",
  verifyAuthToken,
  checkRole(["admin", "staf_gudang"]),
  productController.getCategorySummary
);

module.exports = router;
