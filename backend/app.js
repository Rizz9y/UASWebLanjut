const express = require("express");
const cors = require("cors");
const app = express();

// Middleware Global
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const stockRoutes = require("./routes/stockRoutes");
const categoryRoutes = require("./routes/categories");
const staffRoutes = require('./routes/staffRoutes');



// Root Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Stock Management API is running!" });
});

// Gunakan Routes
app.use('/api/categories', categoryRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/suppliers", supplierRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/categories", categoryRoutes);

// General Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Terjadi kesalahan pada server!");
});

module.exports = app;
