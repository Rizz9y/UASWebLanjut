const { Sequelize } = require("sequelize");
const mongoose = require("mongoose");
const env = require("./env");

const sequelize = new Sequelize(
  env.MYSQL_DB_NAME,
  env.MYSQL_DB_USER,
  env.MYSQL_DB_PASSWORD,
  {
    host: env.MYSQL_DB_HOST,
    port: 4306,
    dialect: env.MYSQL_DB_DIALECT,
    logging: false, // Atur true untuk melihat query SQL di console
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  }
);

async function connectMySQL() {
  try {
    await sequelize.authenticate();
    console.log("Koneksi MySQL (Sequelize) berhasil.");
  } catch (error) {
    console.error("Gagal koneksi ke MySQL:", error);
    process.exit(1); // Keluar dari aplikasi jika koneksi database gagal
  }
}

// Koneksi MongoDB
async function connectMongoDB() {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/stock_management_logs";
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Koneksi MongoDB berhasil.");
  } catch (error) {
    console.error("Gagal koneksi ke MongoDB:", error);
    process.exit(1);
  }
}

module.exports = { sequelize, connectMySQL, connectMongoDB };
