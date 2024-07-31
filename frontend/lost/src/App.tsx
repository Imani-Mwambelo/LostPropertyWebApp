// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import CreatePost from './components/CreatePost';
import LostItemsList from './components/LostItemsList';
import Footer from './components/Footer';
import UserPostsList from './components/UserPostsList';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-post" element={<CreatePost />} />
        <Route path="/view-posts" element={<LostItemsList />} />
        <Route path="/my-posts" element={<UserPostsList />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
