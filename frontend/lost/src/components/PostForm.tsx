import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api/api';

type Post = {
  title: string;
  description: string;
  location: string;
  phone_number: string;
  image_url?: string;
};

interface PostFormProps {
  mode: 'create' | 'update' | 'delete';
  initialPost?: Post; // Adjusted for the initial post data
  postId?: number;
  onClose: () => void; // To close the form
  onSuccess: () => void; // Callback for successful action
}

const PostForm: React.FC<PostFormProps> = ({ mode, initialPost, postId, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [post, setPost] = useState<Post>(initialPost || { title: '', description: '', location: '', phone_number: '' });

  useEffect(() => {
    if (mode === 'update' && postId && !initialPost) {
      // Fetch the post data to pre-fill form in update mode
      const fetchPost = async () => {
        try {
          const response = await api.get(`/posts/${postId}`);
          const postData = response.data;
          setPost(postData);
          setImagePreview(postData.image_url);
        } catch (error) {
          console.error('Failed to fetch post:', error);
        }
      };
      fetchPost();
    }
  }, [mode, postId, initialPost]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('http://127.0.0.1:8000/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    console.log(data.image_url);
    return data.image_url;
  };

  

  const createPost = async (imageUrl: string): Promise<any>=> {
    const postData = {
      title: post.title,
      image_url: imageUrl || post.image_url, // Keep existing image if not updated
      location: post.location,
      phone_number: post.phone_number,
      description: post.description
    };
    await api.post('/posts', postData);
  };

  const updatePost = async (imageUrl?: string): Promise<any> => {
     const postData = {
    title: post.title,
    image_url: imageUrl || post.image_url, // Keep existing image if not updated
    location: post.location,
    phone_number: post.phone_number,
    description: post.description
  };
  
    console.log('Sending update post data:', postData); // Debugging to see what you're sending
  
    try {
      const response = await api.put(`/posts/${postId}`, postData);
      console.log('Update response:', response);
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  };
  

  const deletePost = async () => {
    await api.delete(`/posts/${postId}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'create' && inputFileRef.current?.files && inputFileRef.current.files[0]) {
        const file = inputFileRef.current.files[0];
        const imageUrl = await uploadImage(file);
        await createPost(imageUrl);
        toast.success('Post created successfully!');
        onSuccess();
      } else if (mode === 'update' && postId) {
        let imageUrl;
        if (inputFileRef.current?.files && inputFileRef.current.files[0]) {
          const file = inputFileRef.current.files[0];
          imageUrl = await uploadImage(file);
        }
        await updatePost(imageUrl);
        toast.success('Post updated successfully!');
        onSuccess();
      } else if (mode === 'delete' && postId) {
        await deletePost();
        toast.success('Post deleted successfully!');
        onSuccess();
      }
    } catch (error) {
      console.error('Error processing post:', error);
      toast.error('There was an error. Please try again.');
    }
  };

  const handleBack = () => {
    onClose();
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <ToastContainer />
      <div className="flex items-center mb-4">
        <button
          onClick={handleBack}
          className="flex items-center bg-gray-100 hover:bg-gray-200 p-2 rounded"
        >
          <ArrowLeft className="w-5 h-5 mr-1" /> Back
        </button>
        <h2 className="text-xl ml-4 text-center">
          {mode === 'create' ? 'Create a New Post' : mode === 'update' ? 'Update Post' : 'Delete Post'}
        </h2>
      </div>

      {mode !== 'delete' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block font-medium">Title</label>
            <input
              id="title"
              value={post.title}
              onChange={(e) => setPost({ ...post, title: e.target.value })}
              className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label htmlFor="description" className="block font-medium">Description</label>
            <textarea
              id="description"
              value={post.description}
              onChange={(e) => setPost({ ...post, description: e.target.value })}
              className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
              rows={2}
            />
          </div>

          <div>
            <label htmlFor="location" className="block font-medium">Location</label>
            <input
              id="location"
              value={post.location}
              onChange={(e) => setPost({ ...post, location: e.target.value })}
              className="w-full px-3 py-1 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div>
            <label htmlFor="phone_number" className="block font-medium">Phone Number</label>
            <input
              id="phone_number"
              value={post.phone_number}
              onChange={(e) => setPost({ ...post, phone_number: e.target.value })}
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
              ref={inputFileRef}
            />
            {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 w-full h-auto" />}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 active:bg-blue-700 active:scale-95 text-white py-2 rounded-md transition-all duration-300 ease-in-out transform"
            >
            {mode === 'create' ? 'Submit Post' : 'Update Post'}
          </button>

        </form>
      ) : (
        <div>
          <p>Are you sure you want to delete this post?</p>
          <button
            onClick={handleSubmit}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition-colors duration-300"
          >
            Delete Post
          </button>
        </div>
      )}
    </div>
  );
};

export default PostForm;
