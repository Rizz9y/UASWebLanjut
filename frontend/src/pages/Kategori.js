// Refactored React component to fetch category and product data from backend API
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import '../App.css';

function Kategori() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [editableProducts, setEditableProducts] = useState([]);
  const [totalStock, setTotalStock] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProductName, setNewProductName] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Gagal ambil kategori:', err));
  }, []);

  const openModal = (category) => {
  setSelectedCategory(category);

  const token = localStorage.getItem("adminToken");

  fetch(`http://localhost:3001/api/products?category=${category.name}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => {
      if (!res.ok) {
        throw new Error(`Gagal fetch produk. Status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      if (!Array.isArray(data)) {
        throw new Error("Data produk bukan array");
      }
      setProducts(data);
      setEditableProducts(data.map(p => ({ ...p })));
      setTotalStock(data.length);
    })
    .catch(err => console.error('Gagal ambil produk:', err));

  setIsEditing(false);
};


  const closeModal = () => {
    setSelectedCategory(null);
    setProducts([]);
    setEditableProducts([]);
    setIsEditing(false);
    setShowAddProduct(false);
  };

  const handleEdit = () => setIsEditing(true);

  const handleSave = () => {
    fetch(`http://localhost:3001/api/products/update`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ category: selectedCategory.name, products: editableProducts })
    })
      .then(res => res.json())
      .then(() => {
        setProducts(editableProducts);
        setIsEditing(false);
      })
      .catch(err => console.error('Gagal simpan perubahan:', err));
  };

  const handleCancel = () => {
    setEditableProducts(products.map(p => ({ ...p })));
    setIsEditing(false);
  };

const handleCancelAddProduct = () => {
  setNewProductName('');
  setShowAddProduct(false);
};

  const handleProductChange = (productId, newName) => {
    setEditableProducts(prev =>
      prev.map(product => product.id === productId ? { ...product, name: newName } : product)
    );
  };

  const handleDeleteProduct = (productId) => {
    setEditableProducts(prev => prev.filter(product => product.id !== productId));
  };

  const handleDeleteCategory = () => {
    if (selectedCategory && window.confirm(`Yakin hapus kategori "${selectedCategory.name}"?`)) {
      fetch(`http://localhost:3001/api/categories/${selectedCategory.id}`, {
        method: 'DELETE'
      })
        .then(() => {
          setCategories(prev => prev.filter(cat => cat.id !== selectedCategory.id));
          closeModal();
        })
        .catch(err => console.error('Gagal hapus kategori:', err));
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      fetch('http://localhost:3001/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() })
      })
        .then(res => res.json())
        .then((newCat) => {
          setCategories(prev => [...prev, newCat]);
          setNewCategoryName('');
          setShowAddCategory(false);
        })
        .catch(err => console.error('Gagal tambah kategori:', err));
    }
  };

  const handleCancelAddCategory = () => {
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  const handleAddProduct = () => {
    if (newProductName.trim() && selectedCategory) {
      const newProduct = {
        name: newProductName.trim(),
        category: selectedCategory.name
      };
      fetch(`http://localhost:3001/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      })
        .then(res => res.json())
        .then((createdProduct) => {
          setEditableProducts(prev => [...prev, createdProduct]);
          setNewProductName('');
          setShowAddProduct(false);
          setTotalStock(prev => prev + 1);
        })
        .catch(err => console.error('Gagal tambah produk:', err));
    }
  };

  return (
    <div className="kategori-container">
      <Sidebar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isOpen={sidebarOpen} />
      <div className={`main-content ${sidebarOpen ? 'with-sidebar' : ''}`}>
        <header>
          <button className="menu-button" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h1>KATEGORI</h1>
        </header>

        <div className="kategori-grid">
          {categories.map((cat) => (
            <div key={cat.id} className="kategori-box" onClick={() => openModal(cat)}>
              {cat.name.toUpperCase()}
            </div>
          ))}
          {showAddCategory ? (
            <div className="kategori-box add-category-form">
              <input
                type="text"
                placeholder="Nama kategori..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="add-category-input"
                autoFocus
              />
              <div className="add-category-buttons">
                <button onClick={handleAddCategory} className="save-btn">SIMPAN</button>
                <button onClick={handleCancelAddCategory} className="cancel-btn">BATAL</button>
              </div>
            </div>
          ) : (
            <div className="kategori-box add-kategori-box" onClick={() => setShowAddCategory(true)}>
              <div className="add-kategori-content">
                <span className="plus-icon">+</span>
                <span>TAMBAH KATEGORI</span>
              </div>
            </div>
          )}
        </div>

        {selectedCategory && (
          <div className="modal-overlay">
            <div className="modal">
              <button className="back-button" onClick={closeModal}>×</button>
              <h2>{selectedCategory.name.toUpperCase()}</h2>

              <ul className="modal-list">
                {editableProducts.map((product) => (
                  <li key={product.id} className="modal-item">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={product.name}
                          onChange={(e) => handleProductChange(product.id, e.target.value)}
                          className="edit-input"
                        />
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteProduct(product.id)}
                          title="Hapus produk"
                        >
                          🗑️
                        </button>
                      </>
                    ) : (
                      <span className="product-name">{product.name}</span>
                    )}
                  </li>
                ))}
              </ul>

              {showAddProduct && (
                <div className="add-category-form" style={{ marginTop: '20px' }}>
                  <input
                    type="text"
                    placeholder="Nama type produk..."
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="add-category-input"
                    autoFocus
                  />
                  <div className="add-category-buttons">
                    <button onClick={handleAddProduct} className="save-btn">SIMPAN</button>
                    <button onClick={handleCancelAddProduct} className="cancel-btn">BATAL</button>
                  </div>
                </div>
              )}

              <div className="modal-footer">
                {!showAddProduct && (
                  <>
                    {isEditing ? (
                      <>
                        <button className="cancel-btn" onClick={handleCancel}>CANCEL</button>
                        <button className="save-btn" onClick={handleSave}>SAVE</button>
                      </>
                    ) : (
                      <>
                        <button className="edit-btn" onClick={handleEdit}>EDIT</button>
                        <button className="hapus-kategori-btn" onClick={handleDeleteCategory}>
                          HAPUS KATEGORI
                        </button>
                        <button className="add-btn" onClick={() => setShowAddProduct(true)}>
                          TAMBAH TYPE
                        </button>
                      </>
                    )}
                  </>
                )}
              </div>

              <div className="stok-display">
                <span>TOTAL STOK</span>
                <div className="stok-count">{totalStock}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Kategori;