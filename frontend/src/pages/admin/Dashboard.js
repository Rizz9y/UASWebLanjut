import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import api from '../../services/api';

function Dashboard() {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/products/category-summary', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSummary(res.data);
      } catch (err) {
        console.error('Gagal ambil ringkasan:', err);
      }
    };

    fetchSummary();
  }, []);

  return (
    <div className="dashboard-container">
      <h2>Ringkasan Barang per Kategori</h2>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Kategori</th>
            <th>Total Barang</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((item, index) => (
            <tr key={index}>
              <td>{item.category?.name || 'Tidak diketahui'}</td>
              <td>{item.totalBarang}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
