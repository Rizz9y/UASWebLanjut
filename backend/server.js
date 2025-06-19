const app = require("./app");
const env = require("./config/env");
const { connectMySQL } = require("./config/database");
const { syncDatabase } = require("./models");
const { createInitialAdmin } = require("./utils/initialAdminSetup");

const PORT = env.PORT;

async function startServer() {
  await connectMySQL(); // Koneksikan ke MySQL

  await syncDatabase(); // Sinkronkan model MySQL (membuat tabel jika belum ada)

  await createInitialAdmin(); // Buat akun Admin awal jika belum ada

  app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT} (${env.NODE_ENV} mode)`);
    console.log(`Akses API di http://localhost:${PORT}`);
  });
}

startServer();
