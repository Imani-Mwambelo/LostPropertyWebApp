import React, { useState, useRef, useEffect } from 'react';
import { useFetchPosts } from '../hooks/useFetchPosts';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Loader } from 'lucide-react';

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

const LostItemsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const { data: posts = [], isLoading, error } = useFetchPosts(searchTerm);
  
  const errorToastShown = useRef(false);

  useEffect(() => {
    if (error && !errorToastShown.current) {
      toast.error(`Error loading posts: ${error.message}`);
      errorToastShown.current = true;
    }
  }, [error]);

  const uniqueLocations = Array.from(new Set(posts.map((item: Post) => item.location)));

  const filteredPosts = posts.filter((post: Post) =>
    locationFilter ? post.location === locationFilter : true
  );

  return (
    <div className="container mx-auto p-4 h-120">
      <h2 className="text-2xl text-blue-500 text-center mb-6">Discover your lost item</h2>
      
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
        <div className="h-96 overflow-y-auto"> {/* Set fixed height and enable scrolling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPosts.map((item: Post) => (
              <div key={item.id} className="shadow-lg rounded-lg overflow-hidden">
                {/* <img
                  src={`http://127.0.0.1:8000${item.image_url}`}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                /> */}
                <div className="p-4 text-center">
                  <h3 className="text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-500 mb-2">Owner: {item.owner_name}</p>
                  <p className="text-gray-500 mb-2">Found at : {item.location}</p>
                  <p className="text-gray-500 mb-2">Check Me: {item.phone_number}</p>
                  {item.description && <p className="text-gray-500">{item.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default LostItemsList;
