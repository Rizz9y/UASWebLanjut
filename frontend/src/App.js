// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import LoginAdmin from "./pages/LoginAdmin";
import Dashboard from "./pages/Dashboard";
import Kategori from "./pages/Kategori";
import Staff from "./pages/Staff";
import "./App.css";

// Komponen stok
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import Sidebar from "./components/Sidebar";
import Hamburger from "./components/Hamburger";
import { initialProducts } from "./data/products";

// Komponen Tambah Produk
function AddProduct() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    id: "",
    name: "",
    price: "",
    image: ""
  });

  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Produk ditambahkan:", product);
    navigate("/stok");
  };

  return (
    <div className="main-content" style={{ padding: "50px" }}>
      <h1>Tambah Produk</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: "400px" }}>
        <input type="text" name="id" placeholder="ID Produk" onChange={handleChange} required />
        <input type="text" name="name" placeholder="Nama Produk" onChange={handleChange} required />
        <input type="text" name="price" placeholder="Harga" onChange={handleChange} required />
        <input type="text" name="image" placeholder="URL Gambar" onChange={handleChange} />
        <button type="submit" className="add-btn" style={{ marginTop: "10px" }}>Simpan</button>
      </form>
    </div>
  );
}

// Halaman Manajemen Stok
function ProductPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSelect = (product) => setSelectedProduct(product);
  const handleClose = () => setSelectedProduct(null);

  const handleSave = (updatedProduct) => {
    const updatedList = products.map((item) =>
      item.id === updatedProduct.id ? updatedProduct : item
    );
    setProducts(updatedList);
    setSelectedProduct(null);
  };

  return (
    <div className="app">
      <Hamburger onClick={() => setMenuOpen(!menuOpen)} />
      <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className={`main-content ${menuOpen ? "shifted" : ""}`}>
        <div style={{ position: "relative", marginBottom: "20px" }}>
          <h1 className="page-title" style={{ textAlign: "center" }}>
            Manajemen Stok Produk
          </h1>
          <button
            className="add-button"
            onClick={() => navigate("/add")}
            style={{
              position: "absolute",
              right: "500px",
              top: "0",
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#955c33",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            + Tambah Produk
          </button>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={handleSelect}
            />
          ))}
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

// Root Router
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginAdmin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kategori" element={<Kategori />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/stok" element={<ProductPage />} />
        <Route path="/add" element={<AddProduct />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
