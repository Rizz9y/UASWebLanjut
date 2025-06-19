const { sequelize } = require("../config/database");

// Import semua model
const User = require("./User");
const Product = require("./Product");
const Category = require("./Category");
const Variant = require("./Variant");
const Supplier = require("./Supplier");
const StockTransaction = require("./StockTransaction");


// Define Associations (Relasi antar model MySQL)

// Product - Category
Category.hasMany(Product, { foreignKey: "categoryId", as: "products" });
Product.belongsTo(Category, { foreignKey: "categoryId", as: "productCategory" });

// Product - Variant
Product.hasMany(Variant, { foreignKey: "productId", as: "variants" });
Variant.belongsTo(Product, { foreignKey: "productId", as: "product" });

// StockTransaction - Variant
Variant.hasMany(StockTransaction, {
  foreignKey: "variantId",
  as: "stockTransactions",
});
StockTransaction.belongsTo(Variant, { foreignKey: "variantId", as: "variant" });

// StockTransaction - User
User.hasMany(StockTransaction, {
  foreignKey: "userId",
  as: "stockTransactions",
});
StockTransaction.belongsTo(User, { foreignKey: "userId", as: "transactionBy" });

// StockTransaction - Supplier
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
