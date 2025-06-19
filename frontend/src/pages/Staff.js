import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../App.css';

function Staff() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [staffList, setStaffList] = useState([
    { id: 1, name: 'MUHAMMAD RIZQY', username: 'rizqy', password: '1234' },
    { id: 2, name: 'MUHAMMAD RIZQY', username: 'rizqy2', password: '1234' },
    { id: 3, name: 'MUHAMMAD RIZQY', username: 'rizqy3', password: '1234' },
    { id: 4, name: 'MUHAMMAD RIZQY', username: 'rizqy4', password: '1234' }
  ]);

  const [editingStaff, setEditingStaff] = useState(null);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleAddStaff = () => {
    const newStaff = {
      id: Date.now(),
      name: 'MUHAMMAD RIZQY',
      username: '',
      password: ''
    };
    setStaffList([...staffList, newStaff]);
  };

  const handleDelete = (id) => {
    const updatedList = staffList.filter((staff) => staff.id !== id);
    setStaffList(updatedList);
  };

  const handleEdit = (staff) => {
    setEditingStaff({ ...staff });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingStaff({ ...editingStaff, [name]: value });
  };

  const handleCancelEdit = () => {
    setEditingStaff(null);
  };

  const handleSaveEdit = () => {
    const updatedList = staffList.map((staff) =>
      staff.id === editingStaff.id ? editingStaff : staff
    );
    setStaffList(updatedList);
    setEditingStaff(null);
  };

  return (
    <div className="kategori-container">
      <Sidebar toggleSidebar={toggleSidebar} isOpen={sidebarOpen} />
      <div className={`main-content ${sidebarOpen ? 'with-sidebar' : ''}`}>
        <header>
          <button className="menu-button" onClick={toggleSidebar}>☰</button>
          <h1>MANAJEMEN STAFF</h1>
        </header>

        <div className="staff-panel">
          {staffList.map((staff) => (
            <div key={staff.id} className="staff-card">
              <div className="staff-photo">FOTO</div>
              <div className="staff-name">{staff.name}</div>
              <div className="staff-actions">
                <button className="edit-btn" onClick={() => handleEdit(staff)}>EDIT</button>
                <button className="hapus-btn" onClick={() => handleDelete(staff.id)}>HAPUS</button>
              </div>
            </div>
          ))}
        </div>

        <div className="tambah-btn-container">
          <button className="tambah-btn" onClick={handleAddStaff}>TAMBAH STAFF</button>
        </div>
      </div>

      {/* Modal untuk edit staff */}
      {editingStaff && (
        <div className="edit-modal">
          <div className="edit-box">
            <h2>{editingStaff.name}</h2>
            <label>EDIT NAMA KARYAWAN</label>
            <input
              type="text"
              name="name"
              value={editingStaff.name}
              onChange={handleInputChange}
            />
            <label>EDIT USERNAME</label>
            <input
              type="text"
              name="username"
              value={editingStaff.username}
              onChange={handleInputChange}
            />
            <label>EDIT PASSWORD</label>
            <input
              type="text" // Diubah dari type="password" menjadi type="text"
              name="password"
              value={editingStaff.password}
              onChange={handleInputChange}
            />
            <div className="edit-buttons">
              <button className="cancel-btn" onClick={handleCancelEdit}>CANCEL</button>
              <button className="save-btn" onClick={handleSaveEdit}>SAVE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Staff;
