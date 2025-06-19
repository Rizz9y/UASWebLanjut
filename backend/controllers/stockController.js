const {
  StockTransaction,
  Variant,
  Product,
  User,
  Supplier,
  Category,
  sequelize,
} = require("../models");

// Fungsi Pembantu untuk Memperbarui Stok Varian
const updateVariantStock = async (variantId, quantityChange, transaction) => {
  const variant = await Variant.findByPk(variantId, { transaction });
  if (!variant) {
    throw new Error("Varian tidak ditemukan.");
  }
  variant.stock_quantity += quantityChange;
  if (variant.stock_quantity < 0) {
    throw new Error("Stok tidak mencukupi untuk operasi ini.");
  }
  await variant.save({ transaction });
  return variant;
};

// 1. Pencatatan Stok Masuk ('IN')
exports.stockIn = async (req, res) => {
  const { variantId, quantity, supplierId, notes } = req.body;
  const userId = req.user.id; // Diambil dari token JWT

  if (!variantId || !quantity || quantity <= 0) {
    return res
      .status(400)
      .json({ message: "Variant ID dan kuantitas masuk harus valid." });
  }

  const t = await sequelize.transaction(); // Mulai transaksi
  try {
    const variant = await updateVariantStock(variantId, quantity, t);

    const transactionRecord = await StockTransaction.create(
      {
        type: "IN",
        variantId,
        quantity,
        supplierId,
        userId,
        notes,
      },
      { transaction: t }
    );

    await t.commit(); // Commit transaksi
    res.status(201).json({
      message: "Stok masuk berhasil dicatat.",
      transaction: transactionRecord,
      current_stock: variant.stock_quantity,
    });
  } catch (error) {
    await t.rollback(); // Rollback jika ada error
    console.error("Error recording stock IN:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat mencatat stok masuk.",
      error: error.message,
    });
  }
};

// 2. Pencatatan Stok Keluar ('OUT')
exports.stockOut = async (req, res) => {
  const { variantId, quantity, notes } = req.body;
  const userId = req.user.id;

  if (!variantId || !quantity || quantity <= 0) {
    return res
      .status(400)
      .json({ message: "Variant ID dan kuantitas keluar harus valid." });
  }

  const t = await sequelize.transaction(); // Mulai transaksi
  try {
    const variant = await updateVariantStock(variantId, -quantity, t); // Kuantitas dikurangi

    const transactionRecord = await StockTransaction.create(
      {
        type: "OUT",
        variantId,
        quantity,
        userId,
        notes,
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({
      message: "Stok keluar berhasil dicatat.",
      transaction: transactionRecord,
      current_stock: variant.stock_quantity,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error recording stock OUT:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat mencatat stok keluar.",
      error: error.message,
    });
  }
};

// 3. Penyesuaian Stok ('ADJUSTMENT')
exports.stockAdjustment = async (req, res) => {
  const { variantId, quantity_change, adjustment_reason, notes } = req.body; // quantity_change bisa positif atau negatif
  const userId = req.user.id;

  if (
    !variantId ||
    quantity_change === undefined ||
    isNaN(quantity_change) ||
    !adjustment_reason
  ) {
    return res.status(400).json({
      message:
        "Variant ID, kuantitas perubahan, dan alasan penyesuaian harus valid.",
    });
  }

  const t = await sequelize.transaction(); // Mulai transaksi
  try {
    const variant = await updateVariantStock(variantId, quantity_change, t);

    const transactionRecord = await StockTransaction.create(
      {
        type: "ADJUSTMENT",
        variantId,
        quantity: quantity_change, // Simpan sebagai jumlah perubahan
        adjustment_reason,
        userId,
        notes,
      },
      { transaction: t }
    );

    await t.commit();
    res.status(201).json({
      message: "Penyesuaian stok berhasil dicatat.",
      transaction: transactionRecord,
      current_stock: variant.stock_quantity,
    });
  } catch (error) {
    await t.rollback();
    console.error("Error recording stock adjustment:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat mencatat penyesuaian stok.",
      error: error.message,
    });
  }
};

// Mendapatkan Riwayat Transaksi Stok
exports.getStockHistory = async (req, res) => {
  const { type, variantId, supplierId, userId, startDate, endDate } = req.query; // Filter dari query params
  const whereClause = {};

  if (type) whereClause.type = type;
  if (variantId) whereClause.variantId = variantId;
  if (supplierId) whereClause.supplierId = supplierId;
  if (userId) whereClause.userId = userId;
  if (startDate && endDate) {
    whereClause.transaction_date = {
      [sequelize.Op.between]: [new Date(startDate), new Date(endDate)],
    };
  } else if (startDate) {
    whereClause.transaction_date = {
      [sequelize.Op.gte]: new Date(startDate),
    };
  } else if (endDate) {
    whereClause.transaction_date = {
      [sequelize.Op.lte]: new Date(endDate),
    };
  }

  try {
    const transactions = await StockTransaction.findAll({
      where: whereClause,
      include: [
        {
          model: Variant,
          as: "variant",
          include: [{ model: Product, as: "product", attributes: ["name"] }],
        },
        {
          model: User,
          as: "transactionBy",
          attributes: ["name", "username", "role"],
        },
        { model: Supplier, as: "supplier", attributes: ["name"] },
      ],
      order: [
        ["transaction_date", "DESC"],
        ["createdAt", "DESC"],
      ],
    });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching stock history:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server saat mengambil riwayat stok.",
      error: error.message,
    });
  }
};

// Mendapatkan Ringkasan Stok Saat Ini per Varian (untuk Laporan Ringkasan)
exports.getCurrentStockSummary = async (req, res) => {
  try {
    const stockSummary = await Variant.findAll({
      include: [
        {
          model: Product,
          as: "product",
          attributes: [
            "name",
            "sku_master",
            "base_price_sell",
            "unit",
            "image_url",
          ],
          include: [{ model: Category, as: "category", attributes: ["name"] }],
        },
      ],
      attributes: [
        "id",
        "sku",
        "color",
        "size",
        "material",
        "additional_features",
        "price_buy",
        "price_sell",
        "stock_quantity",
      ],
      order: [
        [{ model: Product, as: "product" }, "name", "ASC"],
        ["sku", "ASC"],
      ],
    });
    res.status(200).json(stockSummary);
  } catch (error) {
    console.error("Error fetching current stock summary:", error);
    res.status(500).json({
      message:
        "Terjadi kesalahan server saat mengambil ringkasan stok saat ini.",
      error: error.message,
    });
  }
};
