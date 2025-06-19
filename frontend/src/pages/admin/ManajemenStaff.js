import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import './ManajemenStaff.css';

function ManajemenStaff() {
  const [staffList, setStaffList] = useState([]);
  const [form, setForm] = useState({
    name: '',
    username: '',
    password: '',
    role: '',
  });
  const [editingId, setEditingId] = useState(null);

  const fetchStaff = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/users/staff', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaffList(res.data);
    } catch (err) {
      console.error('Gagal ambil data staff:', err);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      if (editingId) {
        await api.put(`/users/staff/${editingId}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post('/users/staff', form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setForm({ name: '', username: '', password: '', role: '' });
      setEditingId(null);
      fetchStaff();
    } catch (err) {
      console.error('Gagal menyimpan staff:', err);
      alert(err?.response?.data?.message || 'Terjadi kesalahan saat menyimpan.');
    }
  };

  const handleEdit = (item) => {
    setForm({
      name: item.name,
      username: item.username,
      password: '', // Biarkan kosong
      role: item.role,
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin hapus staff ini?')) {
      try {
        const token = localStorage.getItem('token');
        await api.delete(`/users/staff/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchStaff();
      } catch (err) {
        console.error('Gagal menghapus staff:', err);
      }
    }
  };

  return (
    <div className="staff-container">
      <h2>Manajemen Staff</h2>
      <div className="staff-form">
        <input name="name" placeholder="Nama" value={form.name} onChange={handleInput} />
        <input name="username" placeholder="Username" value={form.username} onChange={handleInput} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleInput} />
        <select name="role" value={form.role} onChange={handleInput}>
          <option value="">Pilih Role</option>
          <option value="admin">Admin</option>
          <option value="staf_gudang">Staf Gudang</option>
        </select>
        <button onClick={handleSubmit}>{editingId ? 'Update' : 'Tambah'}</button>
      </div>

      <table className="staff-table">
        <thead>
          <tr>
            <th>Nama</th>
            <th>Username</th>
            <th>Role</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {staffList.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.username}</td>
              <td>{item.role}</td>
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

export default ManajemenStaff;