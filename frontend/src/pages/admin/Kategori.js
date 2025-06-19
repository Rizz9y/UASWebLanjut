import React, { useEffect, useState } from 'react';
import './Kategori.css';
import api from '../../services/api';

function Kategori() {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  // Ambil data kategori dari server
  const fetchCategories = () => {
    api.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error('Gagal mengambil kategori:', err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Tambah kategori
  const handleAdd = async () => {
    if (!newName.trim()) return;
    try {
      await api.post('/categories', { name: newName });
      setNewName('');
      fetchCategories();
    } catch (err) {
      console.error('Gagal menambahkan:', err);
    }
  };

  // Mulai edit
  const handleEdit = (id, currentName) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  // Simpan hasil edit
  const handleSave = async (id) => {
    try {
      await api.put(`/categories/${id}`, { name: editingName });
      setEditingId(null);
      setEditingName('');
      fetchCategories();
    } catch (err) {
      console.error('Gagal mengedit:', err);
    }
  };

  // Batal edit
  const handleCancel = () => {
    setEditingId(null);
    setEditingName('');
  };

  // Hapus kategori
  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus kategori ini?')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err) {
        console.error('Gagal menghapus:', err);
      }
    }
  };

  return (
    <div className="kategori-container">
      <h2 className="kategori-title">Manajemen Kategori</h2>

      <div className="kategori-form">
        <input
          type="text"
          placeholder="Nama kategori baru"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <button onClick={handleAdd}>Tambah</button>
      </div>

      <table className="kategori-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td>
                {editingId === cat.id ? (
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                ) : (
                  cat.name
                )}
              </td>
              <td>
                {editingId === cat.id ? (
                  <>
                    <button onClick={() => handleSave(cat.id)}>Simpan</button>
                    <button onClick={handleCancel}>Batal</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(cat.id, cat.name)}>Edit</button>
                    <button onClick={() => handleDelete(cat.id)}>Hapus</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Kategori;
