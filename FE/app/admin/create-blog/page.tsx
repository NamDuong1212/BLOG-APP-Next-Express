'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';


const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const currentUserID = '66dd5a565e5c0727974510fd'; 
  const access_Token = localStorage.getItem('access_token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`http://localhost:8080/post/create/${currentUserID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${access_Token}`
        },
        body: JSON.stringify({ title, content, author })
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
        <div>
          <label htmlFor="content" className="block mb-1">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded-md"
            rows="10"
          />
        </div>
        <div>
          <label htmlFor="author" className="block mb-1">Author</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
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