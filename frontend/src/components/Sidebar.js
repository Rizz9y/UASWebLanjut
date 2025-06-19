import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Sidebar = ({ toggleSidebar, isOpen }) => {
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleSidebar(); // Tutup sidebar hanya jika terbuka dan klik di luar
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleSidebar, isOpen]); // Tambahkan isOpen sebagai dependency

  return (
    <div ref={sidebarRef} className={`sidebar ${isOpen ? 'open' : ''}`}>
      <h2>Menu</h2>
      <div className="sidebar-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/dashboard">Manajemen Barang</Link>
        <Link to="/kategori">Kategori</Link>
        <Link to="/staff">Staff</Link>
      </div>
    </div>
  );
};

export default Sidebar;
