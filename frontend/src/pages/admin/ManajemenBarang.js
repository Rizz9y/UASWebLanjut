import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './ManajemenBarang.css';

function ManajemenBarang() {
  const [barangList, setBarangList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: '',
    sku_master: '',
    base_price_buy: '',
    base_price_sell: '',
    unit: '',
    categoryid: '', // ← UBAH DARI categoryId KE categoryid
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBarang = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBarangList(res.data);
    } catch (err) {
      console.error('Gagal ambil data barang:', err);
      alert('Gagal mengambil data barang!');
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
    if (!form.stock || form.stock < 0) {
      alert('Stok harus diisi dan tidak boleh negatif!');
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

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const dataToSend = {
        ...form,
        name: form.name.trim(),
        sku_master: form.sku_master.trim() || undefined,
        unit: form.unit.trim(),
        base_price_buy: parseFloat(form.base_price_buy),
        base_price_sell: parseFloat(form.base_price_sell),
        stock: parseInt(form.stock),
        categoryid: parseInt(form.categoryid),
      };

      if (!dataToSend.sku_master) {
        delete dataToSend.sku_master;
      }

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

      setForm({ 
        name: '', 
        sku_master: '',
        base_price_buy: '', 
        base_price_sell: '', 
        unit: '', 
        stock: 0, 
        categoryid: '' 
      });
      setEditingId(null);
      fetchBarang();
    } catch (err) {
      console.error('Gagal menyimpan:', err);
      if (err.response?.status === 409) {
        if (err.response.data.message.includes('SKU')) {
          alert('SKU sudah ada! Silakan gunakan SKU yang berbeda atau biarkan kosong untuk generate otomatis.');
        } else {
          alert('Data sudah ada (duplikat)!');
        }
      } else if (err.response?.status === 400) {
        if (err.response.data.errors) {
          const errorMessages = err.response.data.errors.map(error => `${error.field}: ${error.message}`).join('\n');
          alert(`Validation Error:\n${errorMessages}`);
        } else {
          alert(err.response.data.message || 'Data tidak valid!');
        }
      } else if (err.response?.status === 404) {
        alert(err.response.data.message || 'Data tidak ditemukan!');
      } else {
        alert(err?.response?.data?.message || 'Terjadi kesalahan saat menyimpan.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      sku_master: item.sku_master || '',
      base_price_buy: item.base_price_buy || '',
      base_price_sell: item.base_price_sell || '',
      unit: item.unit,
      stock: item.stock || 0,
      categoryid: item.categoryid,
    });
    setEditingId(item.id);
  };

  const handleCancel = () => {
    setForm({ 
      name: '', 
      sku_master: '',
      base_price_buy: '', 
      base_price_sell: '', 
      unit: '', 
      stock: 0, 
      categoryid: '' 
    });
    setEditingId(null);
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
        alert(err?.response?.data?.message || 'Gagal menghapus data!');
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="barang-container">
      <h2>Manajemen Barang</h2>
      <div className="barang-form">
        <input 
          name="name" 
          placeholder="Nama Barang *" 
          value={form.name} 
          onChange={handleInput} 
          required
          disabled={loading}
        />
        <input 
          name="sku_master" 
          placeholder="SKU (opsional - akan generate otomatis jika kosong)" 
          value={form.sku_master} 
          onChange={handleInput}
          disabled={loading}
        />
        <input 
          name="base_price_buy" 
          placeholder="Harga Beli *" 
          type="number"
          step="0.01"
          value={form.base_price_buy} 
          onChange={handleInput} 
          required
          disabled={loading}
        />
        <input 
          name="base_price_sell" 
          placeholder="Harga Jual *" 
          type="number"
          step="0.01"
          value={form.base_price_sell} 
          onChange={handleInput} 
          required
          disabled={loading}
        />
        <input 
          name="stock" 
          placeholder="Stok Barang *" 
          type="number"
          min="0"
          value={form.stock} 
          onChange={handleInput} 
          required
          disabled={loading}
        />
        <input 
          name="unit" 
          placeholder="Satuan (contoh: kg, pcs, liter) *" 
          value={form.unit} 
          onChange={handleInput} 
          required
          disabled={loading}
        />
        <select 
          name="categoryid" 
          value={form.categoryid} 
          onChange={handleInput}
          required
          disabled={loading}
        >
          <option value="">Pilih Kategori *</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button onClick={handleSubmit} disabled={loading}>
          {loading ? 'Menyimpan...' : (editingId ? 'Update' : 'Tambah')}
        </button>
        {editingId && (
          <button onClick={handleCancel} disabled={loading}>
            Batal
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="barang-table">
          <thead>
            <tr>
              <th>Nama</th>
              <th>SKU</th>
              <th>Harga Beli</th>
              <th>Harga Jual</th>
              <th>Stok</th>
              <th>Satuan</th>
              <th>Kategori</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {barangList.length === 0 ? (
              <tr>
                <td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>
                  Tidak ada data barang
                </td>
              </tr>
            ) : (
              barangList.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.sku_master}</td>
                  <td>{formatCurrency(item.base_price_buy)}</td>
                  <td>{formatCurrency(item.base_price_sell)}</td>
                  <td>{item.stock}</td>
                  <td>{item.unit}</td>
                  <td>{item.category?.name || '-'}</td>
                  <td>
                    <button 
                      onClick={() => handleEdit(item)}
                      disabled={loading}
                      style={{marginRight: '5px'}}
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      disabled={loading}
                      style={{backgroundColor: '#dc3545', borderColor: '#dc3545'}}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManajemenBarang;