'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  _id: string;
  name: string;
}

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  const router = useRouter();
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const userName = localStorage.getItem('user_name');
    if (userName) {
      setAuthor(userName);
    }
    fetchCategories();
  }, []);

  // Fetch category from database
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${baseURL}/category/get`);
      const data = await response.json();
      setCategories(data.categories);
      // Set default selected category if categories exist
      if (data.categories.length > 0) {
        setSelectedCategory(data.categories[0].name);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  // Create post
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const access_Token = localStorage.getItem('access_token');
      const userID = localStorage.getItem('user_id');
      
      const response = await fetch(`${baseURL}/post/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_Token}`
        },
        body: JSON.stringify({ 
          title, 
          content, 
          author,
          category: selectedCategory 
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const data = await response.json();
      console.log('Post created:', data);
      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="container">
      <div className="max-w-lg mx-auto py-10 space-y-10">
        <h1 className="text-center special-word">Create New Post</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block mb-1">Title</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          
          {/* Fetch list categories from database in dropdown form */}
          <div>
            <label htmlFor="category" className="block mb-1">Category</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md bg-white"
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="content" className="block mb-1">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md"
              rows="4"
            />
          </div>

          <div>
            <label htmlFor="author" className="block mb-1">Author</label>
            <input
              type="text"
              id="author"
              value={author}
              disabled
              required
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}
          
          <button
            type="submit"
            disabled={isLoading}
            className="btn w-full"
          >
            {isLoading ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreatePost;