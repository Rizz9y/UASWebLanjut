import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../App.css';

function Kategori() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [editableProducts, setEditableProducts] = useState([]);
  const [totalStock, setTotalStock] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [categories, setCategories] = useState([
    { id: 1, name: 'Ransel' },
    { id: 2, name: 'Koper' },
    { id: 3, name: 'Selendang' },
  ]);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProductName, setNewProductName] = useState('');

  const dummyProductsByCategory = {
    Ransel: [
      { id: 101, name: 'Tas Pinggang Pria dan Wanita', editable: true },
      { id: 102, name: 'Tas Selempang dan Bahu Pria dan Wanita', editable: true },
      { id: 103, name: 'Ransel Pria dan Wanita', editable: true },
      { id: 104, name: 'Tas Pria dan Wanita Lainnya', editable: true },
      { id: 105, name: 'Tote Bag', editable: true },
      { id: 106, name: 'Tas Laptop', editable: true },
      { id: 107, name: 'Tas Anak Pria dan Wanita', editable: true },
      { id: 108, name: 'Tas Ransel Unisex', editable: true },
    ],
    Koper: [
      { id: 201, name: 'Koper Sedang', editable: true },
      { id: 202, name: 'Koper Besar', editable: true },
    ],
    Selendang: [
      { id: 301, name: 'Selendang Batik', editable: true },
      { id: 302, name: 'Selendang Tenun', editable: true },
    ],
  };

  const dummyStock = {
    Ransel: 80,
    Koper: 30,
    Selendang: 60,
  };

  const openModal = (category) => {
    setSelectedCategory(category);
    const categoryProducts = dummyProductsByCategory[category.name] || [];
    setProducts(categoryProducts);
    setEditableProducts(categoryProducts.map(p => ({ ...p })));
    setTotalStock(dummyStock[category.name] || 0);
    setIsEditing(false);
  };

  const closeModal = () => {
    setSelectedCategory(null);
    setProducts([]);
    setEditableProducts([]);
    setIsEditing(false);
    setShowAddProduct(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setProducts(editableProducts);
    if (selectedCategory) {
      dummyProductsByCategory[selectedCategory.name] = editableProducts;
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditableProducts(products.map(p => ({ ...p })));
    setIsEditing(false);
  };

  const handleProductChange = (productId, newName) => {
    setEditableProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, name: newName }
          : product
      )
    );
  };

  const handleDeleteProduct = (productId) => {
    setEditableProducts(prev => prev.filter(product => product.id !== productId));
  };

  const handleDeleteCategory = () => {
    if (selectedCategory && window.confirm(`Apakah Anda yakin ingin menghapus kategori "${selectedCategory.name}"?`)) {
      setCategories(prev => prev.filter(cat => cat.id !== selectedCategory.id));
      delete dummyProductsByCategory[selectedCategory.name];
      delete dummyStock[selectedCategory.name];
      closeModal();
    }
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      const newCategory = {
        id: Math.max(...categories.map(c => c.id)) + 1,
        name: newCategoryName.trim()
      };
      setCategories(prev => [...prev, newCategory]);
      setNewCategoryName('');
      setShowAddCategory(false);
      dummyProductsByCategory[newCategory.name] = [];
      dummyStock[newCategory.name] = 0;
    }
  };

  const handleCancelAddCategory = () => {
    setNewCategoryName('');
    setShowAddCategory(false);
  };

  const handleAddProduct = () => {
    if (newProductName.trim() && selectedCategory) {
      const newProduct = {
        id: Math.max(...editableProducts.map(p => p.id), 0) + 1,
        name: newProductName.trim(),
        editable: true
      };
      setEditableProducts(prev => [...prev, newProduct]);
      setNewProductName('');
      setShowAddProduct(false);
      dummyProductsByCategory[selectedCategory.name] = [...editableProducts, newProduct];
      setTotalStock(prev => prev + 1); // Update total stock (simplified increment)
    }
  };

  const handleCancelAddProduct = () => {
    setNewProductName('');
    setShowAddProduct(false);
  };

  return (
    <div className="kategori-container">
      {sidebarOpen && <Sidebar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />}

      <div className="main-content">
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