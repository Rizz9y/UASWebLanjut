const app = require("./app");
const env = require("./config/env");
const { connectMySQL } = require("./config/database");
const { syncDatabase } = require("./models");
const { createInitialAdmin } = require("./utils/initialAdminSetup");

const productRoutes = require("./routes/products"); // Tambahkan rute produk
const adminRoutes = require('./routes/admin'); // Rute admin yang sudah ada

app.use("/api/products", productRoutes); // Gunakan rute produk
app.use('/api/admin', adminRoutes); // Gunakan rute admin

const PORT = env.PORT;

async function startServer() {
  try {
    await connectMySQL(); // Koneksikan ke MySQL
    await syncDatabase();
    await createInitialAdmin();

    app.listen(PORT, () => {
      console.log(`Server berjalan di port ${PORT} (${env.NODE_ENV} mode)`);
      console.log(`Akses API di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Gagal memulai server:", error);
    process.exit(1);
  }
}

startServer();
