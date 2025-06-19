import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import '../App.css';

function Staff() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [staffList, setStaffList] = useState([]);
  const [editingStaff, setEditingStaff] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/api/staff")
      .then(res => res.json())
      .then(data => setStaffList(data))
      .catch(err => console.error("Gagal ambil data staff:", err));
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const handleAddStaff = async () => {
    const newStaff = {
      name: 'Karyawan',
      username: '',
      password: '',
      role: 'staff_gudang'
    };

    try {
      const res = await fetch("http://localhost:3001/api/staff", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff)
      });
      const created = await res.json();
      setStaffList(prev => [...prev, created]);
    } catch (err) {
      console.error("Gagal tambah staff:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3001/api/staff/${id}`, { method: 'DELETE' });
      setStaffList(staffList.filter((staff) => staff.id !== id));
    } catch (err) {
      console.error("Gagal hapus staff:", err);
    }
  };

  const handleEdit = (staff) => setEditingStaff({ ...staff });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingStaff({ ...editingStaff, [name]: value });
  };

  const handleCancelEdit = () => setEditingStaff(null);

  const handleSaveEdit = async () => {
    try {
      await fetch(`http://localhost:3001/api/staff/${editingStaff.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingStaff)
      });

      const updatedList = staffList.map((staff) =>
        staff.id === editingStaff.id ? editingStaff : staff
      );
      setStaffList(updatedList);
      setEditingStaff(null);
    } catch (err) {
      console.error("Gagal update staff:", err);
    }
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
              type="text"
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
