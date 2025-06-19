import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../App.css';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    console.log('Sidebar toggled, isOpen:', !sidebarOpen); // Debug untuk memeriksa state
  };

  const barangMasuk = { ransel: 56, koper: 6, selempang: 20 };
  const barangKeluar = { ransel: 20, koper: 5, selempang: 45 };

  const totalMasuk =
    barangMasuk.ransel + barangMasuk.koper + barangMasuk.selempang;
  const totalKeluar =
    barangKeluar.ransel + barangKeluar.koper + barangKeluar.selempang;

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
