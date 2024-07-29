import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';

interface PostFormInputs {
  title: string;
  content: string;
  imageFile: FileList; // Use FileList for file input
  location: string;
  phone_number: string;
}

const CreatePost: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<PostFormInputs>();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit: SubmitHandler<PostFormInputs> = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('location', data.location);
    formData.append('phone_number', data.phone_number);

    if (data.imageFile.length > 0) {
      formData.append('image', data.imageFile[0]); // Add the image file
    }

    try {
      const response = await axios.post('/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 201) {
        alert('Post created successfully!');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('There was an error creating the post.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl mb-4 text-center">Create a New Post</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="title" className="block font-medium">Title</label>
          <input
            id="title"
            {...register('title', { required: 'Title is required' })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
          {errors.title && <p className="text-red-500">{errors.title.message}</p>}
        </div>

        <div>
          <label htmlFor="content" className="block font-medium">Content</label>
          <textarea
            id="content"
            {...register('content', { required: 'Content is required' })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            rows={3}
          />
          {errors.content && <p className="text-red-500">{errors.content.message}</p>}
        </div>

        <div>
          <label htmlFor="image" className="block font-medium">Image</label>
          <input
            type="file"
            id="image"
            accept="image/*"
            {...register('imageFile', { required: 'Image is required' })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            onChange={handleImageChange}
          />
          {errors.imageFile && <p className="text-red-500">{errors.imageFile.message}</p>}
          {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 w-full h-auto" />}
        </div>

        <div>
          <label htmlFor="location" className="block font-medium">Location</label>
          <input
            id="location"
            {...register('location', { required: 'Location is required' })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
          {errors.location && <p className="text-red-500">{errors.location.message}</p>}
        </div>

        <div>
          <label htmlFor="phone_number" className="block font-medium">Phone Number</label>
          <input
            id="phone_number"
            {...register('phone_number', { required: 'Phone number is required', pattern: { value: /^\+?[1-9]\d{1,14}$/, message: 'Enter a valid phone number' } })}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
          {errors.phone_number && <p className="text-red-500">{errors.phone_number.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition-colors duration-300">
          Submit Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
