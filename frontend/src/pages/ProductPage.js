import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import ProductModal from "../components/ProductModal";
import Sidebar from "../components/Sidebar";
import Hamburger from "../components/Hamburger";
import { initialProducts } from "../data/products";
import "../App.css";

function ProductPage() {
  const [products, setProducts] = useState(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleClose = () => {
    setSelectedProduct(null);
  };

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

      <div className="main-content-wrapper">
        <div className="button-bar">
          <button onClick={() => navigate("/tambah-produk")} className="add-button">
            + Tambah Produk
          </button>
        </div>

        <div className={`main-content ${menuOpen ? "shifted" : ""}`}>
          <h1 className="page-title">Manajemen Stok Produk</h1>
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

export default ProductPage;
