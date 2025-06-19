import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import '../App.css';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [barangMasuk, setBarangMasuk] = useState({});
  const [barangKeluar, setBarangKeluar] = useState({});
  const [totalMasuk, setTotalMasuk] = useState(0);
  const [totalKeluar, setTotalKeluar] = useState(0);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    console.log('Sidebar toggled, isOpen:', !sidebarOpen);
  };

  useEffect(() => {
    fetch('http://localhost:3001/api/stock/in')
      .then((res) => res.json())
      .then((data) => {
        setBarangMasuk(data);
        const total = Object.values(data).reduce((sum, val) => sum + val, 0);
        setTotalMasuk(total);
      })
      .catch((err) => console.error('Gagal ambil data barang masuk:', err));

    fetch('http://localhost:3001/api/stock/out')
      .then((res) => res.json())
      .then((data) => {
        setBarangKeluar(data);
        const total = Object.values(data).reduce((sum, val) => sum + val, 0);
        setTotalKeluar(total);
      })
      .catch((err) => console.error('Gagal ambil data barang keluar:', err));
  }, []);

  return (
    <div className="kategori-container">
      <Sidebar toggleSidebar={toggleSidebar} isOpen={sidebarOpen} />
      <div className={`main-content ${sidebarOpen ? 'with-sidebar' : ''}`}>
        <header>
          <button className="menu-button" onClick={toggleSidebar}>☰</button>
          <h1>DASHBOARD</h1>
        </header>

        <div className="section">
          <h3 className="section-title">Barang Masuk</h3>
          <div className="items-row">
            {Object.entries(barangMasuk).map(([label, value]) => (
              <div key={label} className="item-box">
                <div className="item-label">
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                </div>
                <div className="item-value">{value}</div>
              </div>
            ))}
            <p className="total-text">Total = <strong>{totalMasuk}</strong></p>
          </div>
        </div>

        <div className="section">
          <h3 className="section-title">Barang Keluar</h3>
          <div className="items-row">
            {Object.entries(barangKeluar).map(([label, value]) => (
              <div key={label} className="item-box">
                <div className="item-label">
                  {label.charAt(0).toUpperCase() + label.slice(1)}
                </div>
                <div className="item-value">{value}</div>
              </div>
            ))}
            <p className="total-text">Total = <strong>{totalKeluar}</strong></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
