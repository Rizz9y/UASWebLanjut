import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const Sidebar = ({ toggleSidebar }) => {
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        toggleSidebar();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [toggleSidebar]);

  return (
    <div ref={sidebarRef} className="sidebar">
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
