import React, { useState } from "react";

const ProductModal = ({ product, onClose, onSave }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tempVariants, setTempVariants] = useState(
    JSON.parse(JSON.stringify(product.variants))
  );
  const [isEditing, setIsEditing] = useState(false);

  const selectedVariant = tempVariants[selectedIndex];

  const handleChangeStock = (delta) => {
    const updated = [...tempVariants];
    updated[selectedIndex].stock += delta;
    if (updated[selectedIndex].stock < 0) updated[selectedIndex].stock = 0;
    setTempVariants(updated);
  };

  const handleSave = () => {
  const confirmSave = window.confirm("Yakin ingin mengubah stok?");
  if (confirmSave) {
    const updatedProduct = { ...product, variants: tempVariants };
    onSave(updatedProduct);
    setIsEditing(false);
  }
};


  const totalStock = tempVariants.reduce((sum, v) => sum + v.stock, 0);

  return (
    <div className="modal-overlay">
      <div className="modal">
        <img
          src={selectedVariant.image}
          alt={selectedVariant.color}
          style={{ width: 200 }}
        />
        <div className="modal-content">
          <h2>{product.name}</h2>

          <p>Warna:</p>
          <div style={{ display: "flex", gap: "10px", marginBottom: 10 }}>
            {tempVariants.map((v, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                style={{
                  backgroundColor: i === selectedIndex ? "#955c33" : "#ccc",
                  color: i === selectedIndex ? "white" : "black",
                  padding: "5px 10px",
                  border: "none",
                  borderRadius: "5px",
                }}
              >
                {v.color}
              </button>
            ))}
          </div>

          <p>Stok: {selectedVariant.stock}</p>

        {isEditing && (
  <div className="stock-control">
    <button onClick={() => handleChangeStock(-1)}>-</button>
    
    <input
      type="number"
      value={selectedVariant.stock}
      onChange={(e) => {
        const updated = [...tempVariants];
        let val = parseInt(e.target.value);
        if (isNaN(val) || val < 0) val = 0;
        updated[selectedIndex].stock = val;
        setTempVariants(updated);
      }}
      style={{
        width: "60px",
        textAlign: "center",
        fontSize: "18px",
        padding: "4px",
      }}
    />
    
    <button onClick={() => handleChangeStock(1)}>+</button>
  </div>
)}


          <p>Total semua stok: {totalStock}</p>

          <div style={{ marginTop: "10px" }}>
            {isEditing ? (
              <button className="save-btn" onClick={handleSave}>
                Simpan
              </button>
            ) : (
              <button
                className="save-btn"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            )}
            <button className="close-btn" onClick={onClose}>
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal; 