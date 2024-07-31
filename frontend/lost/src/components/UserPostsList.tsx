import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchUserPosts } from '../hooks/useFetchUserPosts';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';

interface Post {
    id: number;
    title: string;
    image_url: string;
    location: string;
    phone_number: string;
    description: string;
    created_at: string;
    owner_id: number;
  }
  

const UserPostsList: React.FC = () => {
  const navigate = useNavigate();
  const { data: userPosts = [], isLoading, error, deletePost } = useFetchUserPosts();

  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [updatedLocation, setUpdatedLocation] = useState('');
  const [updatedPhoneNumber, setUpdatedPhoneNumber] = useState('');
  const [updatedImage, setUpdatedImage] = useState<File | null>(null);
  const [updatedImagePreview, setUpdatedImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      toast.error('Error loading your posts. Make sure you have logged in to see your posts.');
    }
  }, [error]);

  const handleDeleteConfirm = (postId: number) => {
    setIsDeleting(postId);
  };

  const handleDelete = async () => {
    if (isDeleting !== null) {
      try {
        await deletePost(isDeleting);
        toast.success('Post deleted successfully!');
      } catch (error) {
        toast.error('Error deleting the post.');
      } finally {
        setIsDeleting(null);
      }
    }
  };

  const handleCancelDelete = () => {
    setIsDeleting(null);
  };

  const handleUpdate = (post: Post) => {
    setEditingPost(post);
    setUpdatedTitle(post.title);
    setUpdatedDescription(post.description);
    setUpdatedLocation(post.location);
    setUpdatedPhoneNumber(post.phone_number);
    setUpdatedImagePreview(`http://localhost:8000${post.image_url}`);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUpdatedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUpdatedImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPost) {
      const formData = new FormData();
      if (updatedImage) {
        formData.append('file', updatedImage);
      }
      formData.append('title', updatedTitle);
      formData.append('description', updatedDescription);
      formData.append('location', updatedLocation);
      formData.append('phone_number', updatedPhoneNumber);

      try {
        await api.put(`/posts/${editingPost.id}`, formData);
        toast.success('Post updated successfully!');
        setEditingPost(null);
      } catch (error) {
        toast.error('Error updating the post.');
      }
    }
  };

  const handleBack = () => {
    navigate('/'); // Navigate back to the home page
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="flex items-center mb-4">
        <button
          onClick={handleBack}
          className="flex items-center bg-gray-100 hover:bg-gray-200 p-2 rounded"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </button>
        <h2 className="text-2xl text-blue-500 ml-4">Your Posts</h2>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <LoaderCircle className="animate-spin w-10 h-10 text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {userPosts.map((item: Post) => (
            <div
              key={item.id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <img
                src={`http://localhost:8000${item.image_url}`} // Full path to the image
                alt={item.title}
                className="object-fit: cover max-width: 100% max-height: 100%"
              />
              <div className="p-3">
                <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-500 text-sm mb-1">{item.location}</p>
                <p className="text-gray-500 text-sm mb-1">{item.phone_number}</p>
                {item.description && (
                  <p className="text-gray-500 text-sm">{item.description}</p>
                )}
                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={() => handleUpdate(item)}
                    className="bg-blue-500 text-white text-sm px-3 py-1 rounded"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteConfirm(item.id)}
                    className="bg-red-500 text-white text-sm px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isDeleting !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-xs w-full">
            <h2 className="text-lg mb-4">Are you sure you want to delete this post?</h2>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {editingPost && (
        <div className="mt-10 inset-0 flex items-center justify-center bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full sm:max-w-md md:max-w-lg lg:max-w-xl">
            <h2 className="text-lg mb-4">Update Post</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  value={updatedDescription}
                  onChange={(e) => setUpdatedDescription(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  type="text"
                  id="location"
                  value={updatedLocation}
                  onChange={(e) => setUpdatedLocation(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phone_number"
                  value={updatedPhoneNumber}
                  onChange={(e) => setUpdatedPhoneNumber(e.target.value)}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Image
                </label>
                <input
                  type="file"
                  id="image"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-500  file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                {updatedImagePreview && (
                  <img src={updatedImagePreview} alt="Preview" className="mt-4 w-full h-auto " />
                )}
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPostsList;
