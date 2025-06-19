import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../App.css';

function Kategori() {
  const initialData = {
    Ransel: [
      "Tas Pinggang Pria dan Wanita",
      "Tas Selempang dan Bahu Pria dan Wanita",
      "Ransel Pria dan Wanita",
      "Tas Pria dan Wanita Lainnya",
      "Tote Bag",
      "Tas Laptop",
      "Tas Anak Pria dan Wanita",
      "Tas Ransel Unisex"
    ],
    Koper: ["Koper Kecil", "Koper Sedang", "Koper Besar"],
    Selendang: ["Selendang Batik", "Selendang Tenun", "Selendang Sutra"]
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dataMap, setDataMap] = useState({ ...initialData });
  const [editableData, setEditableData] = useState([]);
  const [stokMap, setStokMap] = useState({ Ransel: 80, Koper: 80, Selendang: 80 });
  const [editableStok, setEditableStok] = useState(0);

  const categories = Object.keys(initialData);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const openModal = (category) => {
    setSelectedCategory(category);
    setEditableData([...dataMap[category]]);
    setEditableStok(stokMap[category]);
    setIsEditing(false);
  };

  const handleEditToggle = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditableData([...dataMap[selectedCategory]]);
    setEditableStok(stokMap[selectedCategory]);
  };

  const handleSave = () => {
    const updatedMap = { ...dataMap, [selectedCategory]: editableData };
    const updatedStokMap = { ...stokMap, [selectedCategory]: editableStok };
    setDataMap(updatedMap);
    setStokMap(updatedStokMap);
    setIsEditing(false);
  };

  const handleChange = (value, index) => {
    const newData = [...editableData];
    newData[index] = value;
    setEditableData(newData);
  };

  const handleDelete = (index) => {
    const newData = editableData.filter((_, i) => i !== index);
    setEditableData(newData);
  };

  const handleAdd = () => {
    setEditableData([...editableData, ""]);
  };

  const totalStokAll = Object.values(stokMap).reduce((sum, val) => sum + val, 0);

  return (
    <div className="kategori-container">
      {sidebarOpen && <Sidebar toggleSidebar={toggleSidebar} />}

      <div className="main-content">
        <header>
          <button className="menu-button" onClick={toggleSidebar}>☰</button>
          <h1>KATEGORI</h1>
        </header>

        <div className="kategori-grid">
          {categories.map((cat) => (
            <div key={cat} className="kategori-box" onClick={() => openModal(cat)}>
              {cat.toUpperCase()}
            </div>
          ))}
        </div>

        <div className="stok-display" style={{ position: 'static', marginTop: '10px' }}>
          <span>TOTAL STOK</span>
          <div className="stok-count">{totalStokAll}</div>
        </div>

        {selectedCategory && (
          <div className="modal">
            <h2>{selectedCategory.toUpperCase()}</h2>

            {isEditing && (
              <button className="add-btn" onClick={handleAdd}>+ Tambah</button>
            )}

            <div className="modal-list">
              {editableData.map((item, index) => (
                <div key={index} className="modal-item">
                  {isEditing ? (
                    <>
                      <input
                        value={item}
                        onChange={(e) => handleChange(e.target.value, index)}
                      />
                      <button className="delete-btn" onClick={() => handleDelete(index)}>🗑</button>
                    </>
                  ) : (
                    <span>{item}</span>
                  )}
                </div>
              ))}
            </div>

            <div className="modal-footer">
              {isEditing ? (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '15px' }}>
                    <label htmlFor="stokInput">TOTAL STOK</label>
                    <input
                      id="stokInput"
                      type="number"
                      value={editableStok}
                      onChange={(e) => setEditableStok(Number(e.target.value))}
                      style={{ width: '120px', padding: '6px', fontSize: '16px', borderRadius: '6px', border: '1.5px solid #915e3c', marginTop: '5px' }}
                    />
                  </div>
                  <button className="cancel-btn" onClick={handleCancel}>CANCEL</button>
                  <button className="save-btn" onClick={handleSave}>SAVE</button>
                </>
              ) : (
                <>
                  <button className="edit-btn" onClick={handleEditToggle}>EDIT</button>
                  <div className="stok-display">
                    <span>TOTAL STOK</span>
                    <div className="stok-count">{stokMap[selectedCategory]}</div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Kategori;