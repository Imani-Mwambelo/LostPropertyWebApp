import React, { useState } from 'react';
import { Github, Linkedin, Twitter, Instagram } from 'lucide-react';

const Footer = () => {
  const [formState, setFormState] = useState({ email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('https://formspree.io/f/mqazevgk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      if (response.ok) {
        setStatus('Thank you for your feedback!');
        setFormState({ email: '', message: '' }); // Reset form fields after successful submission
      } else {
        setStatus('There was an error submitting your feedback. Please try again later.');
      }
    } catch (error) {
      setStatus('There was an error submitting your feedback. Please try again later.');
    }
  };

  return (
    <footer className="text-neutral-500 py-8 bg-gray-100 mt-20">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl mb-4">Get in Touch</h2>
        <div className="flex justify-center mb-6">
          <a
            href="https://github.com/imani-mwambelo"
            className="mx-4 text-blue-500 hover:text-blue-700"
            aria-label="GitHub"
          >
            <Github size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/imani-mwambelo-259453294"
            className="mx-4 text-blue-500 hover:text-blue-700"
            aria-label="LinkedIn"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="https://twitter.com/yourusername"
            className="mx-4 text-blue-500 hover:text-blue-700"
            aria-label="Twitter"
          >
            <Twitter size={24} />
          </a>
          <a
            href="https://instagram.com/mwambeloimani?igsh=YzljYTk1ODg3Zg=="
            className="mx-4 text-blue-500 hover:text-blue-700"
            aria-label="Instagram"
          >
            <Instagram size={24} />
          </a>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto text-left">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-blue-700">
              Email
            </label>
            <div className="mt-1">
              <input
                type="email"
                id="email"
                value={formState.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-blue-700">
              Message
            </label>
            <div className="mt-1">
              <textarea
                id="message"
                value={formState.message}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={3}
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-colors duration-300"
          >
            Send Feedback
          </button>
        </form>
        {status && <p className="mt-4 text-blue-700">{status}</p>}
        <p className="mt-6 mb-2">&copy; {new Date().getFullYear()} Imani Mwambelo. All Rights Reserved.</p>
        <p>
          Built with <span className="text-blue-500">♥</span> using React, Tailwind CSS, and Lucide.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
