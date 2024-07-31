import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white sticky top-0 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl text-blue-500">Find & Retrieve</Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link to="/" className=" text-neutral-500 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link to="/my-posts" className="text-neutral-500 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">My Posts</Link>
              <Link to="/login" className="text-neutral-500 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
              <Link to="/register" className="text-neutral-500 hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium">Create Account</Link>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button onClick={toggleMenu} className="text-gray-700 hover:text-blue-500 focus:outline-none focus:text-blue-500">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} md:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className=" hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium">Home</Link>
          <Link to="/my-posts" className=" hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium">My posts</Link>
          <Link to="/login" className=" hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium">Login</Link>
          <Link to="/register" className=" hover:text-blue-500 block px-3 py-2 rounded-md text-base font-medium">Create Account</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
