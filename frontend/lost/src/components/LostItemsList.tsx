// src/components/LostItemsList.tsx
import React, { useState } from 'react';
import { useFetchPosts } from '../hooks/useFetchPosts';

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

const LostItemsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const { data: posts = [], isLoading, error } = useFetchPosts(searchTerm);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts: {error.message}</p>;

  // Extract unique locations for filtering options
  const uniqueLocations = Array.from(new Set(posts.map((item: Post) => item.location)));

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl text-blue-500 mb-6">Discover your lost item</h2>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center">
        <input
          type="text"
          placeholder="Search by title, description, or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded mb-4 md:mb-0"
        />
        <select
          value={uniqueLocations[0] || ''} // Set default value if uniqueLocations is empty
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
        >
          <option value="">Filter by location</option>
          {uniqueLocations.map((location) => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((item: Post) => (
          <div key={item.id} className="shadow-lg rounded-lg overflow-hidden">
            <img
              src={`https://lostpropertywebapp.onrender.com/.${item.image_url}`} // Ensure the full path to the image
              alt={item.title}
              className="object-fit:cover max-width: 100% max-height: 100%"
            />
            <div className="p-4">
              <h3 className="text-xl mb-2">{item.title}</h3>
              <p className="text-gray-500 mb-2">{item.location}</p>
              <p className="text-gray-500 mb-2">{item.phone_number}</p>
              {item.description && <p className="text-gray-500">{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LostItemsList;
