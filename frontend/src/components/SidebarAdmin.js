import React from 'react';
import { Link } from 'react-router-dom';

function SidebarAdmin() {
  return (
    <div className="sidebar">
      <h3>Admin Panel</h3>
      <ul>
        <li><Link to="/admin/dashboard">Dashboard</Link></li>
        <li><Link to="/admin/kategori">Kategori</Link></li>
        <li><Link to="/admin/barang">Manajemen Barang</Link></li>
        <li><Link to="/admin/staff">Manajemen Staff</Link></li>
      </ul>
    </div>
  );
}

export default SidebarAdmin;
