import React, { useState, useRef, useEffect } from 'react';
import { useFetchPosts } from '../hooks/useFetchPosts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader } from 'lucide-react'; // Assuming you are using Lucide React icons

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
  const [locationFilter, setLocationFilter] = useState<string>('');
  const { data: posts = [], isLoading, error } = useFetchPosts(searchTerm);
  
  const errorToastShown = useRef(false); // Tracks if the error toast has already been shown

  // Show toast for error only once
  useEffect(() => {
    if (error && !errorToastShown.current) {
      toast.error(`Error loading posts: ${error.message}`);
      errorToastShown.current = true; // Mark that error has been shown
    }
  }, [error]);

  // Extract unique locations for filtering options
  const uniqueLocations = Array.from(new Set(posts.map((item: Post) => item.location)));

  // Filter posts based on location
  const filteredPosts = posts.filter((post: Post) =>
    locationFilter ? post.location === locationFilter : true
  );

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
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded"
        >
          <option value="">Filter by location</option>
          {uniqueLocations.map((location) => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
      </div>

      {/* Loading state with spinner */}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Loader className="animate-spin h-12 w-12 text-blue-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((item: Post) => (
            <div key={item.id} className="shadow-lg rounded-lg overflow-hidden">
              <img
                src={`${item.image_url}`} // Using your Vercel URL
                alt={item.title}
                className="w-full h-48 object-cover"
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
      )}

      {/* Toast container for displaying error messages */}
      <ToastContainer />
    </div>
  );
};

export default LostItemsList;
