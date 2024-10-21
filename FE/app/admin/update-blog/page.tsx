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

  const accessToken = localStorage.getItem('access_token');
  const userID = localStorage.getItem('user_id');
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    fetchPosts();
  }, []);

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

  // Fetch posts and flatten the category structure
  const fetchPosts = async () => {
    try {
      const response = await fetch(`${baseURL}/post/getHomePost`);
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();

      if (!data || data.length === 0) {
        setError('No posts available');
        return;
      }

      // Flatten the nested structure from backend
      const flattenedPosts = data.reduce((acc, category) => {
        const postsInCategory = category.blogs.map(blog => ({...blog,categoryName: category.name}));
        return [...acc, ...postsInCategory];
      }, []);

      // Sort posts by creation date
      const sortedPosts = flattenedPosts.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setPosts(sortedPosts);
    } catch (err) {
      setError('Error fetching posts: ' + err.message);
      toast.error('Failed to fetch posts');
    } finally {
      setIsLoading(false);
    }
  };

  // Delete post
  const handleDelete = async (postID) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${baseURL}/post/deletePost/${postID}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.msg || 'Failed to delete post');
      }
      // Fetch posts list after delete
      await fetchPosts();
      toast.success('Post deleted successfully');
    } catch (err) {
      console.error('Error deleting post:', err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

// Update post
const handleUpdate = async (post) => {
  try {
    if (!post.title || !post.content) {
      toast.error('Title and content are required');
      return;
    }

    const response = await fetch(`${baseURL}/post/${post._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title: post.title,
        content: post.content,
        category: post.category._id,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.msg || 'Failed to update post');
    }
    // Fetch posts list after update
    await fetchPosts();

    setEditingPostId(null);
    toast.success('Post updated successfully');
  } catch (err) {
    toast.error(err.message);
  }
};

  const handleRead = (postId) => {
    router.push(`/posts/${postId}`); // Navigate to posts/[id]
  };

  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Post Management</h1>
      <ul className="space-y-4">
        {posts.map((post) => (
          <li key={post._id} className="mb-4 p-4 border rounded shadow-sm hover:shadow-md transition-shadow">
            {editingPostId === post._id ? (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Edit Post</h2>
                <div>
                  <label className="text-xl font-semibold">Title</label>
                  <input
                    type="text"
                    value={post.title}
                    onChange={(e) =>
                      setPosts(prevPosts =>prevPosts.map(p =>p._id === post._id ? { ...p, title: e.target.value } : p) // Browse through the id match with post id to change the value
                      )
                    }
                    className="w-full p-2 mb-2 border rounded"
                  />
                </div>

                <div>
                  <label className="text-xl font-semibold">Content</label>
                  <textarea
                    value={post.content}
                    onChange={(e) =>
                      setPosts(prevPosts =>prevPosts.map(p =>p._id === post._id ? { ...p, content: e.target.value } : p) // Same things 
                      )
                    }
                    className="w-full p-2 mb-2 border rounded"
                  />
                </div>
                <label className="text-xl font-semibold">Author</label>
                <input
                  type="text"
                  value={post.author}
                  disabled
                  className="w-full p-2 mb-2 border rounded"
                />

                <div>
                  <label className="text-xl font-semibold">Category</label>
                  <input
                    type="text"
                    value={post.categoryName}
                    disabled
                    className="w-full p-2 mb-2 border rounded"
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdate(post)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setEditingPostId(null)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-500">Category: {post.category.name}</p>
                <p className="text-sm text-gray-500">Created: {formatDateTime(post.createdAt)}</p>
                <p className="text-sm text-gray-500">Updated: {formatDateTime(post.updatedAt)}</p>
                <p className="mt-2">{post.content}</p>
                <p className="text-sm text-gray-500">Author: {post.author}</p>
                
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => setEditingPostId(post._id)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleRead(post._id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition-colors"
                  >
                    Read
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostManagement;