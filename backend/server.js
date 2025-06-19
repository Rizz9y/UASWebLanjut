const app = require("./app");
const env = require("./config/env");
const { connectMySQL } = require("./config/database");
const { syncDatabase } = require("./models");
const { createInitialAdmin } = require("./utils/initialAdminSetup");

const productRoutes = require("./routes/products"); // Tambahkan rute produk
const adminRoutes = require('./routes/admin'); // Rute admin yang sudah ada

app.use("/api/products", productRoutes); // Gunakan rute produk
app.use('/api/admin', adminRoutes); // Gunakan rute admin
const adminRoutes = require("./routes/admin");
const categoryRoutes = require("./routes/categories");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");


const PORT = env.PORT || 5000;

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
    // ✅ Koneksi database
    await connectMySQL();
    console.log("✅ Terkoneksi ke MySQL");

    // ✅ Sinkronisasi model Sequelize
    await syncDatabase();
    console.log("✅ Database disinkronisasi");

    // ✅ Buat akun admin default jika belum ada
    await createInitialAdmin();
    console.log("✅ Admin awal dicek/dibuat");

    // ✅ Gunakan semua rute
    app.use("/api/admin", adminRoutes);
    app.use("/api/categories", categoryRoutes);
   // Ubah bagian ini:
    app.use("/api/products", productRoutes);  
    app.use("/api/auth", authRoutes);         


    // ✅ Jalankan server
    app.listen(PORT, () => {
      console.log(`Server berjalan di port ${PORT} (${env.NODE_ENV} mode)`);
      console.log(`Akses API di: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Gagal menjalankan server:", error.message);
    process.exit(1);
  }
}

startServer();
