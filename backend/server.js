const app = require("./app");
const env = require("./config/env");
const { connectMySQL } = require("./config/database"); // HAPUS connectMongoDB
const { syncDatabase } = require("./models");
const { createInitialAdmin } = require("./utils/initialAdminSetup");

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);

const PORT = env.PORT;

async function startServer() {
  await connectMySQL(); // Koneksikan ke MySQL

  // HAPUS: await connectMongoDB();

  await syncDatabase();
  await createInitialAdmin();

  app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT} (${env.NODE_ENV} mode)`);
    console.log(`Akses API di http://localhost:${PORT}`);
  });
}

startServer();
