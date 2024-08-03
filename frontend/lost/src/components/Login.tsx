import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';

const Login: React.FC = () => {
  const [username, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { username, password });
      localStorage.setItem('access_token', response.data.access_token);
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
      setError('Login failed. Please check your credentials and try again.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 shadow-lg rounded">
        <h2 className="text-2xl mb-6 text-center">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-500">Email</label>
          <input
            type="email"
            value={username}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-500 rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-500">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border border-gray-500 rounded"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
          Login
        </button>
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/register" className="text-blue-500">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
