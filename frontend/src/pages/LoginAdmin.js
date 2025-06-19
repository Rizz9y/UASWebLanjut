import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Simpan status login dan token
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminName', data.user.name);

        navigate('/dashboard');
      } else {
        setError(data.message || 'Username atau password salah');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Terjadi kesalahan koneksi ke server.');
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">LOGIN</h1>

      <div className="input-group">
        <input
          type="text"
          placeholder="USERNAME"
          className="login-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      <div className="input-group">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="PASSWORD"
          className="login-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button className="login-button" onClick={handleLogin}>LOGIN</button>
    </div>
  );
};

export default LoginAdmin;
