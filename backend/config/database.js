const { Sequelize } = require("sequelize");
const env = require("./env");

const sequelize = new Sequelize(
  env.MYSQL_DB_NAME,
  env.MYSQL_DB_USER,
  env.MYSQL_DB_PASSWORD,
  {
    host: env.MYSQL_DB_HOST,
    port: 3306,
    dialect: env.MYSQL_DB_DIALECT,
    logging: false,
    pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
  }
);

async function connectMySQL() {
  try {
    await sequelize.authenticate();
    console.log("Koneksi MySQL (Sequelize) berhasil.");
  } catch (error) {
    console.error("Gagal koneksi ke MySQL:", error);
    process.exit(1);
  }
}

module.exports = { sequelize, connectMySQL };
