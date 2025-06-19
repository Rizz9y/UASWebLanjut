import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginAdmin from './pages/LoginAdmin';
import Dashboard from './pages/Dashboard';
import Kategori from './pages/Kategori';
import Staff from './pages/Staff';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginAdmin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kategori" element={<Kategori />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;