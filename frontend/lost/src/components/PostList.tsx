import React, { useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Post {
  id: number;
  title: string;
  content: string;
  image_url: string;
  location: string;
  phone_number: string;
  user_id: number; // Assuming each post has a user_id for ownership
}

const PostList: React.FC<{ currentUserId: number }> = ({ currentUserId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Fetch posts from the backend using useQuery with an options object
  const { data: posts, isLoading, isError } = useQuery<Post[]>({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await axios.get('/api/posts');
      return response.data;
    },
  });

  // Mutation for liking a post
  const likeMutation = useMutation<unknown, Error, number>({
    mutationFn: async (postId: number) => {
      const response = await axios.post(`/api/posts/${postId}/like`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // Mutation for deleting a post
  const deleteMutation = useMutation<unknown, Error, number>({
    mutationFn: async (postId: number) => {
      await axios.delete(`/api/posts/${postId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  // Filter posts based on search term
  const filteredPosts = posts?.filter((post) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Render each post in a card
  const renderPostCard = (post: Post) => (
    <div key={post.id} className="bg-white shadow-md rounded-lg p-4 mb-4">
      <img
        src={post.image_url}
        alt={post.title}
        className="w-full h-48 object-cover rounded-md mb-2"
      />
      <h3 className="text-xl font-bold mb-2">{post.title}</h3>
      <p className="text-gray-600 mb-2">{post.content}</p>
      <p className="text-gray-800 mb-2">Location: {post.location}</p>
      <p className="text-gray-800 mb-4">Contact: {post.phone_number}</p>
      <button
        onClick={() => likeMutation.mutate(post.id)}
        className="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded-md transition-colors duration-300 mr-2"
      >
        Like
      </button>
      {post.user_id === currentUserId && (
        <>
          <button
            onClick={() => handleEdit(post.id)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded-md transition-colors duration-300 mr-2"
          >
            Edit
          </button>
          <button
            onClick={() => deleteMutation.mutate(post.id)}
            className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded-md transition-colors duration-300"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );

  // Handle editing a post (Placeholder function)
  const handleEdit = (postId: number) => {
    // Implement edit functionality here (navigate to edit page or show edit form)
    alert(`Edit post with ID: ${postId}`);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Posts</h2>

      <input
        type="text"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-6 px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
      />

      {isLoading ? (
        <p>Loading posts...</p>
      ) : isError ? (
        <p>Failed to load posts. Please try again later.</p>
      ) : (
        <div>
          {filteredPosts?.map((post) => renderPostCard(post))}
        </div>
      )}
    </div>
  );
};

export default PostList;
