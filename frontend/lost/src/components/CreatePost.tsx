import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PostForm from './PostForm';


interface Post {
  id: number;
  title: string;
  owner_name: string;
  location: string;
  phone_number: string;
  description: string;
  created_at: string;
  owner_id: number;
}

interface LocationState {
  mode?: 'create' | 'update';
  post?: Post; // Assuming Post is the type of a post object
}

const CreatePost: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode = 'create', post } = (location.state as LocationState) || {};

  const handleSuccess = () => {
    const successMessage = mode === 'create' 
      ? 'Post created successfully!'
      : 'Post updated successfully!';

    toast.success(`${successMessage}`, {
      position: 'top-right',
      autoClose: 3000,
    });
    setTimeout(() => navigate('/view-posts'), 3000);
  };
  
  const redirectPath = mode === 'create' ? '/view-posts' : '/my-posts';

  const handleBack = () => {
    navigate(redirectPath);
  };

  

  return (
    <div className="max-w-lg mx-auto p-4">
      <ToastContainer />
      <PostForm 
        mode={mode}
        initialPost={mode === 'update' ? post : undefined} 
        onSuccess={handleSuccess} 
        onClose={handleBack} 
      />
    </div>
  );
};

export default CreatePost;
