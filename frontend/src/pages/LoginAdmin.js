// src/pages/LoginAdmin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginAdmin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log("Coba login dengan", username, password);
    if (username === 'admin' && password === '1234') {
      console.log("Login berhasil");
      localStorage.setItem('isLoggedIn', 'true');
      navigate('/dashboard');
    } else {
      console.log("Login gagal");
      setError('Username atau password salah');
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
