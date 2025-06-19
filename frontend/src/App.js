import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import Kategori from './pages/admin/Kategori';
import ManajemenBarang from './pages/admin/ManajemenBarang';
import ManajemenStaff from './pages/admin/ManajemenStaff';
import SidebarAdmin from './components/SidebarAdmin';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/admin/*"
          element={
            <div className="admin-layout">
              <SidebarAdmin />
              <div className="main-content">
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="kategori" element={<Kategori />} />
                  <Route path="barang" element={<ManajemenBarang />} />
                  <Route path="staff" element={<ManajemenStaff />} />
                </Routes>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
