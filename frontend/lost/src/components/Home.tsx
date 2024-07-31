import React from 'react';
import { Link } from 'react-router-dom';
import TestimonyCarousel from './TestimonyCarousel';


const Home: React.FC = () => {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl mb-4 text-blue-600">Welcome to Find & Retrieve</h1>
        <p className="text-lg text-gray-600">
          A community-driven platform to help reunite lost items with their rightful owners.
        </p>
      </header>

      <main>
        <section className="mb-8">
          <h2 className="text-2xl text-blue-600 text-center mb-4">How It Works</h2>
          <p className="text-lg text-gray-500">
            Have you found something on the street? Post it here to help the owner find it. Looking for something you lost? Browse through the posts to see if someone has found it.
          </p>
        </section>

        <section className="flex justify-center space-x-4">
          <Link
            to="/create-post"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
          >
            Create a Post
          </Link>
          <Link
            to="/view-posts"
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
          >
            View Posts
          </Link>
        </section>
        <TestimonyCarousel />
      </main>
    </div>
  );
};

export default Home;
