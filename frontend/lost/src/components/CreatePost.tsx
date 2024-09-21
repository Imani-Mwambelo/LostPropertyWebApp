import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import PostForm from './PostForm';

const CreatePost: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    toast.success('Post created successfully! Redirecting to home...', {
      position: 'top-right',
      autoClose: 3000, // Toast disappears after 3 seconds
    });
    setTimeout(() => navigate('/'), 3000); // Redirect after 3 seconds
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <ToastContainer />
      <div className="flex items-center mb-4">
        {/* Back button to go to the previous page */}
        {/* <button
          onClick={handleBack}
          className="flex items-center bg-gray-100 hover:bg-gray-200 p-2 rounded"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </button> */}
      </div>
      <PostForm mode="create" onSuccess={handleSuccess} onClose={handleBack} />
    </div>
  );
};

export default CreatePost;
