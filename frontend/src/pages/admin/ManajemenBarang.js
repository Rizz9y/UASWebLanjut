import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './ManajemenBarang.css';

function ManajemenBarang() {
  const [barangList, setBarangList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    base_price_buy: '',
    base_price_sell: '',
    unit: '',
    categoryid: '', // ← UBAH DARI categoryId KE categoryid
  });
  const [editingId, setEditingId] = useState(null);

  const fetchBarang = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBarangList(res.data);
    } catch (err) {
      console.error('Gagal ambil data barang:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/products/categories', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data);
    } catch (err) {
      console.error('Gagal ambil kategori:', err);
    }
  };

  useEffect(() => {
    fetchBarang();
    fetchCategories();
  }, []);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    // VALIDASI FORM SEBELUM KIRIM
    if (!form.name.trim()) {
      alert('Nama barang harus diisi!');
      return;
    }
    if (!form.base_price_buy || form.base_price_buy <= 0) {
      alert('Harga beli harus diisi dan lebih dari 0!');
      return;
    }
    if (!form.base_price_sell || form.base_price_sell <= 0) {
      alert('Harga jual harus diisi dan lebih dari 0!');
      return;
    }
    if (!form.unit.trim()) {
      alert('Satuan harus diisi!');
      return;
    }
    if (!form.categoryid) {
      alert('Kategori harus dipilih!');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      // KONVERSI HARGA KE NUMBER
      const dataToSend = {
        ...form,
        base_price_buy: parseFloat(form.base_price_buy),
        base_price_sell: parseFloat(form.base_price_sell),
      };
      
      // DEBUG: CEK DATA YANG AKAN DIKIRIM
      console.log('Data yang akan dikirim:', dataToSend);
      
      if (editingId) {
        await api.put(`/products/${editingId}`, dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Data berhasil diupdate!');
      } else {
        await api.post('/products', dataToSend, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert('Data berhasil ditambahkan!');
      }
      
      setForm({ name: '', base_price_buy: '', base_price_sell: '', unit: '', categoryid: '' });
      setEditingId(null);
      fetchBarang();
    } catch (err) {
      console.error('Gagal menyimpan:', err);
      
      // DEBUG: TAMPILKAN DETAIL ERROR
      console.log('Error response:', err.response?.data);
      console.log('Error status:', err.response?.status);
      
      alert(err?.response?.data?.message || 'Terjadi kesalahan saat menyimpan.');
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      base_price_buy: item.base_price_buy || '',
      base_price_sell: item.base_price_sell || '',
      unit: item.unit,
      categoryid: item.categoryid, // ← UBAH DARI categoryId KE categoryid
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin hapus barang ini?')) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchBarang();
        alert('Data berhasil dihapus!');
      } catch (err) {
        console.error('Gagal menghapus:', err);
        alert('Gagal menghapus data!');
      }
    }
  };

  return (
    <div className="barang-container">
      <h2>Manajemen Barang</h2>
      <div className="barang-form">
        <input 
          name="name" 
          placeholder="Nama Barang" 
          value={form.name} 
          onChange={handleInput} 
          required
        />
        <input 
          name="base_price_buy" 
          placeholder="Harga Beli" 
          type="number"
          value={form.base_price_buy} 
          onChange={handleInput} 
          required
        />
        <input 
          name="base_price_sell" 
          placeholder="Harga Jual" 
          type="number"
          value={form.base_price_sell} 
          onChange={handleInput} 
          required
        />
        <input 
          name="unit" 
          placeholder="Satuan (contoh: kg, pcs, liter)" 
          value={form.unit} 
          onChange={handleInput} 
          required
        />
        <select 
          name="categoryid" 
          value={form.categoryid} 
          onChange={handleInput}
          required
        >
          <option value="">Pilih Kategori</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button onClick={handleSubmit}>
          {editingId ? 'Update' : 'Tambah'}
        </button>
        {editingId && (
          <button 
            onClick={() => {
              setForm({ name: '', base_price_buy: '', base_price_sell: '', unit: '', categoryid: '' });
              setEditingId(null);
            }}
          >
            Batal
          </button>
        )}
      </div>

      <table className="barang-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>SKU</th>
            <th>Harga Beli</th>
            <th>Harga Jual</th>
            <th>Satuan</th>
            <th>Kategori</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {barangList.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.sku_master}</td>
              <td>Rp {item.base_price_buy}</td>
              <td>Rp {item.base_price_sell}</td>
              <td>{item.unit}</td>
              <td>{item.category?.name || '-'}</td>
              <td>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.id)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManajemenBarang;