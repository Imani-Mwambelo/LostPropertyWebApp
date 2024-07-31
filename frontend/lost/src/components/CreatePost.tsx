import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import { ArrowLeft } from 'lucide-react'; // Import an arrow icon from lucide-react
import { ToastContainer, toast } from 'react-toastify'; // Import ToastContainer and toast
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import api from '../api';

const CreatePost: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (image) {
      const formData = new FormData();
      formData.append('file', image);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('location', location);
      formData.append('phone_number', phoneNumber);

      try {
        await api.post('/posts', formData);
        toast.success('Post created successfully!');
        navigate('/'); // Navigate back to home after successful post
      } catch (error) {
        console.error('Error creating post:', error);
        toast.error('There was an error creating the post. Make sure you have logged in.');
      }
    }
  };

  const handleBack = () => {
    navigate('/'); // Navigate back to the home page
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <ToastContainer /> {/* Add ToastContainer for toast notifications */}
      <div className="flex items-center mb-4">
        <button
          onClick={handleBack}
          className="flex items-center bg-gray-100 hover:bg-gray-200 p-2 rounded"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </button>
        <h2 className="text-xl ml-4 text-center">Create a New Post</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-medium">Title</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label htmlFor="description" className="block font-medium">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            rows={2}
          />
        </div>

        <div>
          <label htmlFor="location" className="block font-medium">Location</label>
          <input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label htmlFor="phone_number" className="block font-medium">Phone Number</label>
          <input
            id="phone_number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>

        <div>
          <label htmlFor="image" className="block font-medium">Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
          {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 w-full h-auto" />}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-colors duration-300"
        >
          Submit Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
