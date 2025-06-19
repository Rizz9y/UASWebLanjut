require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || "development",
  JWT_SECRET:
    process.env.JWT_SECRET || "fallback_secret_ini_tidak_aman_di_prod", // Ganti di produksi!

  MYSQL_DB_HOST: process.env.DB_HOST_MYSQL,
  MYSQL_DB_USER: process.env.DB_USER_MYSQL,
  MYSQL_DB_PASSWORD: process.env.DB_PASSWORD_MYSQL,
  MYSQL_DB_NAME: process.env.DB_NAME_MYSQL,
  MYSQL_DB_DIALECT: "mysql",
};
