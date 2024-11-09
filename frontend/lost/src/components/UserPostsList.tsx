import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFetchUserPosts } from '../hooks/useFetchUserPosts';
import { ArrowLeft, LoaderCircle } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
    navigate('/create-post', { state: { mode: 'update', post } });
  };

  return (
    <div className="container mx-auto p-4">
      <ToastContainer />
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate('/')}
          className="flex items-center bg-gray-100 hover:bg-gray-200 p-2 rounded"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </button>
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
                src={`${item.image_url}`}
                alt={item.title}
                className="w-full h-48 object-cover"
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
    </div>
  );
};

export default UserPostsList;
