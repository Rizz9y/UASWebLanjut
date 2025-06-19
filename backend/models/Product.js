const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    categoryid: {
      type: DataTypes.INTEGER, // ← UBAH DARI STRING KE INTEGER
      allowNull: false,
      references: {
        model: 'Categories', // ← TAMBAH FOREIGN KEY REFERENCE
        key: 'id'
      }
    },
    sku_master: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    base_price_buy: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    base_price_sell: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    image_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);



module.exports = Product;
