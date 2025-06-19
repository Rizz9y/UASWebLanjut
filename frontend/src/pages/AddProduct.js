import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddProductPage() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: "",
    price: 0,
    stock: 0,
    image: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Produk berhasil ditambahkan!\n(Tapi belum disimpan permanen karena belum ada backend)");
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tambah Produk Baru</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nama Produk:</label><br />
          <input
            type="text"
            value={product.name}
            onChange={(e) => setProduct({ ...product, name: e.target.value })}
          />
        </div>
        <div>
          <label>Harga:</label><br />
          <input
            type="number"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: Number(e.target.value) })}
          />
        </div>
        <div>
          <label>Stok:</label><br />
          <input
            type="number"
            value={product.stock}
            onChange={(e) => setProduct({ ...product, stock: Number(e.target.value) })}
          />
        </div>
        <div>
          <label>URL Gambar:</label><br />
          <input
            type="text"
            value={product.image}
            onChange={(e) => setProduct({ ...product, image: e.target.value })}
          />
        </div>
        <br />
        <button type="submit">Simpan Produk</button>
        <button type="button" onClick={() => navigate("/")}>Batal</button>
      </form>
    </div>
  );
}

export default AddProductPage;
