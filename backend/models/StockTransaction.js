const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const StockTransaction = sequelize.define(
  "StockTransaction",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("IN", "OUT", "ADJUSTMENT"),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    transaction_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    adjustment_reason: {
      type: DataTypes.ENUM(
        "DAMAGED",
        "LOST",
        "OVERSTOCK",
        "ERROR_INPUT",
        "OTHER"
      ),
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = StockTransaction;
