'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPost, setEditingPost] = useState(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', author: '' });
  const router = useRouter();
  

  useEffect(() => {
    fetchPosts();
  }, []);
  const accessToken = localStorage.getItem('access_token');
  const userID = localStorage.getItem('user_id');
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${baseURL}/post/getPost`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
  
      if (data.length === 0) {
        setError('Oops, no post at all');
      } else {
        setPosts(data);
      }
    } catch (err) {
      setError('Error fetching posts: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  
const handleDelete = async (postID) => {
  console.log('Attempting to delete post with ID:', postID);
  if (window.confirm('Are you sure you want to delete this post?')) {
    setIsLoading(true);  
    try {
      const response = await fetch(`${baseURL}/post/deletePost/${userID}/${postID}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete post');

      setPosts((prevPosts) => {
        const updatedPosts = prevPosts.filter(post => post._id !== postID);
        if (updatedPosts.length === 0) {
          setError('Oops, no post at all');
        }
        return updatedPosts;
      });
    } catch (err) {
      console.error('Error deleting post:', err.message);
    } finally {
      setIsLoading(false);  
    }
  }
};

  const handleEdit = (post) => {
    setEditingPost({ ...post });
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(`${baseURL}/post/updatePost/${userID}/${editingPost._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(editingPost)
      });
      if (!response.ok) throw new Error('Failed to update post');
      const updatedPost = await response.json();
      setPosts(posts.map(post => post._id === updatedPost._id ? updatedPost : post));
      setEditingPost(null);
    } catch (err) {
      setError('Error updating post: ' + err.message);
    }
  };
  const handleRead = (postID) => {
    router.push(`/posts/${postID}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Post Management</h1>

      {editingPost && (
        <div className="mb-4 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Edit Post</h2>
          <input
            type="text"
            value={editingPost.title}
            onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <textarea
            value={editingPost.content}
            onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
            rows="4"
          />
          <input
            type="text"
            value={editingPost.author}
            onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
            className="w-full p-2 mb-2 border rounded"
          />
          <button onClick={handleUpdate} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
            Update
          </button>
          <button onClick={() => setEditingPost(null)} className="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
        </div>
      )}

<ul>
        {posts.map(post => (
          <li key={post._id} className="mb-4 p-4 border rounded">
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p>{post.content}</p>
            <p className="text-sm text-gray-500">Author: {post.author}</p>
            <div className="mt-2">
              <button onClick={() => handleEdit(post)} className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">
                Edit
              </button>
              <button onClick={() => handleDelete(post._id)} className="bg-red-500 text-white px-3 py-1 rounded mr-2">
                Delete
              </button>
              <button onClick={() => handleRead(post._id)} className="bg-green-500 text-white px-3 py-1 rounded">
                Read
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostManagement;
