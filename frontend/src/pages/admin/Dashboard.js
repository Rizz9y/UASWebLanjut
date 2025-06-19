// DashboardBarang.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import './Dashboard.css';

function DashboardBarang() {
  const [barangList, setBarangList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchBarang();
    fetchCategories();
    fetchHistory();
  }, []);

  const fetchBarang = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBarangList(res.data);
    } catch (err) {
      console.error('Gagal mengambil barang:', err);
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
      console.error('Gagal mengambil kategori:', err);
    }
  };

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await api.get('/products/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistory(res.data);
    } catch (err) {
      console.error('Gagal mengambil riwayat:', err);
    }
  };

  const totalAll = barangList.length;

  const countByCategoryName = (name) =>
    barangList.filter((item) => item.category?.name?.toLowerCase() === name.toLowerCase()).length;

  const categoryCounts = [
    { name: 'Ransel', total: countByCategoryName('Ransel') },
    { name: 'Selempang', total: countByCategoryName('Selempang') },
    { name: 'Koper', total: countByCategoryName('Koper') },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      <div className="total-section">
        <div className="total-card">
          <h3>Total Semua Barang</h3>
          <p>{totalAll}</p>
        </div>
      </div>

      <div className="kategori-tabel-wrapper">
        <h3>Jumlah Barang </h3>
        <table className="kategori-table">
          <thead>
            <tr>
              <th>Nama Kategori</th>
              <th>Total Barang</th>
            </tr>
          </thead>
          <tbody>
            {categoryCounts.map((cat, index) => (
              <tr key={index}>
                <td>{cat.name}</td>
                <td>{cat.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="history-section">
        <h3>Riwayat Barang Masuk & Keluar</h3>
        <table className="history-table">
          <thead>
            <tr>
              <th>Nama Barang</th>
              <th>Status</th>
              <th>Tanggal</th>
              <th>Jam</th>
            </tr>
          </thead>
          <tbody>
            {history.map((log, index) => (
              <tr key={index}>
                <td>{log.productName}</td>
                <td>{log.status}</td>
                <td>{new Date(log.timestamp).toLocaleDateString()}</td>
                <td>{new Date(log.timestamp).toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DashboardBarang;
