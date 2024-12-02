import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true); // Show loading state
    setError(''); // Clear previous errors
    try {
      await axios.post('https://b894-196-249-97-31.ngrok-free.app/users', { username, email, password });
      toast.success('Account created! Redirecting to login...', {
        position: 'top-right',
        autoClose: 3000, // Toast disappears after 3 seconds
      });
      setTimeout(() => navigate('/login'), 3000); // Wait for 3 seconds before redirecting
    } catch (error) {
      console.error('Registration failed', error);
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md p-8 shadow-lg rounded bg-white">
        <h2 className="text-2xl mb-6 text-center">Create Account</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="mb-4">
          <label className="block text-gray-500">Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border border-gray-500 rounded"
            required
            disabled={loading} // Disable while loading
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-500">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-500 rounded"
            required
            disabled={loading}
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
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-500">Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className={`w-full bg-blue-500 text-white py-2 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Register;
