const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Variant = sequelize.define(
  "Variant",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    sku: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    color: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    size: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    material: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    additional_features: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price_buy: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    price_sell: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Variant;
