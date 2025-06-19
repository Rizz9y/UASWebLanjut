const { sequelize } = require("../config/database");

// Import semua model
const User = require("./User");
const Product = require("./Product");
const Category = require("./Category");
const Variant = require("./Variant");
const Supplier = require("./Supplier");
const StockTransaction = require("./StockTransaction");

// Define Associations (Relasi antar model MySQL)

// Product - Category (PERBAIKAN DI SINI)
Category.hasMany(Product, { 
  foreignKey: "categoryid",  // ← UBAH dari categoryId ke categoryid
  as: "products" 
});
Product.belongsTo(Category, { 
  foreignKey: "categoryid",  // ← UBAH dari categoryId ke categoryid
  as: "category"             // ← UBAH dari productCategory ke category
});

// Product - Variant (sudah benar)
Product.hasMany(Variant, { foreignKey: "productId", as: "variants" });
Variant.belongsTo(Product, { foreignKey: "productId", as: "product" });

// StockTransaction - Variant (sudah benar)
Variant.hasMany(StockTransaction, {
  foreignKey: "variantId",
  as: "stockTransactions",
});
StockTransaction.belongsTo(Variant, { foreignKey: "variantId", as: "variant" });

// StockTransaction - User (sudah benar)
User.hasMany(StockTransaction, {
  foreignKey: "userId",
  as: "stockTransactions",
});
StockTransaction.belongsTo(User, { foreignKey: "userId", as: "transactionBy" });

// StockTransaction - Supplier (sudah benar)
Supplier.hasMany(StockTransaction, {
  foreignKey: "supplierId",
  as: "stockTransactions",
});
StockTransaction.belongsTo(Supplier, {
  foreignKey: "supplierId",
  as: "supplier",
});

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Koneksi MySQL (Sequelize) berhasil.");

    await sequelize.sync({ force: false });
    console.log("Semua model MySQL disinkronkan.");
  } catch (error) {
    console.error("Gagal koneksi atau sinkronisasi database MySQL:", error);
    process.exit(1);
  }
};

module.exports = {
  sequelize,
  User,
  Product,
  Category,
  Variant,
  Supplier,
  StockTransaction,
  
  syncDatabase,
};
