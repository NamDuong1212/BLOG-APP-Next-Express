'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

const PostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPostId, setEditingPostId] = useState(null); 
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);

  const accessToken = localStorage.getItem('access_token');
  const userID = localStorage.getItem('user_id');
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    return date.toLocaleString('en-US', options);
  };

  {/* Fetch post */}
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${baseURL}/post/getPost`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();

      if (data.length === 0) {
        setError('Oops, no post at all');
      } else {

        const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
      }
    } catch (err) {
      setError('Error fetching posts: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  {/* Delete post */}
  const handleDelete = async (postID) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setIsLoading(true);
      try {
        const response = await fetch(`${baseURL}/post/deletePost/${userID}/${postID}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) throw new Error('Failed to delete post');

        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postID));
      } catch (err) {
        console.error('Error deleting post:', err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  {/* Update post */}
  const handleUpdate = async (updatedPost) => {
    try {
      const response = await fetch(`${baseURL}/post/updatePost/${userID}/${updatedPost._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updatedPost),
      });
      if (!response.ok) throw new Error('Failed to update post');
      
      const newPostData = await response.json();
      setPosts((prevPosts) =>prevPosts.map((post) => (post._id === newPostData._id ? newPostData : post))
      );
      setEditingPostId(null); 
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
      <ul>
        {/* Showing post list*/}
        {posts.map((post) => (
          <li key={post._id} className="mb-4 p-4 border rounded">
            {editingPostId === post._id ? (
              <div className="mb-4 p-4 border rounded">
                <h2 className="text-xl font-semibold mb-2">Edit Post</h2>
                <input
                  type="text"
                  value={post.title}
                  onChange={(e) =>
                    setPosts((prevPosts) =>prevPosts.map((p) =>p._id === post._id ? { ...p, title: e.target.value } : p)
                    )
                  }
                  className="w-full p-2 mb-2 border rounded"
                />
                <textarea
                  value={post.content}
                  onChange={(e) =>
                    setPosts((prevPosts) =>prevPosts.map((p) =>p._id === post._id ? { ...p, content: e.target.value } : p)
                    )
                  }
                  className="w-full p-2 mb-2 border rounded"
                  rows="4"
                />
                <input
                  type="text"
                  value={post.author}
                  disabled
                  className="w-full p-2 mb-2 border rounded"
                />
                <button
                  onClick={() => handleUpdate(post)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => setEditingPostId(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-500">Created: {formatDateTime(post.createdAt)}</p>
                <p className="text-sm text-gray-500">Updated: {formatDateTime(post.updatedAt)}</p>
                <p>{post.content}</p>
                <p className="text-sm text-gray-500">Author: {post.author}</p>
                <div className="mt-2">
                  <button
                    onClick={() => setEditingPostId(post._id)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleRead(post._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Read
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostManagement;
