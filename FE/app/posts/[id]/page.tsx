'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import gigachad from '@/public/img/gigachad.jpg';
import { AiFillHeart, AiOutlineHeart, AiOutlineComment, AiTwotoneCalendar } from 'react-icons/ai';

const PostDetail = () => {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [postLikes, setPostLikes] = useState(0);
  const [postComments, setPostComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userID, setUserID] = useState(null);
  const params = useParams();
  const router = useRouter();
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  
  useEffect(() => {
    const userID = localStorage.getItem('user_id');
    if (userID) {
      setUserID(userID);
    }
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

  const fetchPost = async () => {
    try {
      const response = await fetch(`${baseURL}/post/${params.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch post');
      }
      const data = await response.json();
      setPost(data);
      setPostLikes(data.likes?.length || 0);
      setPostComments(data.comments || []);
      setIsLiked(data.likes?.includes(userID));
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load post');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (params.id && userID) {
      fetchPost();
    }
  }, [params.id, userID]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Error state UI
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h2 className="text-2xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button
            onClick={() => router.back()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Not found state UI
  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Post not found</h2>
          <button
            onClick={() => router.back()}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Handle like/unlike section for the post
  const handleLike = () => {
    setIsLiked(!isLiked);
    setPostLikes(isLiked ? postLikes - 1 : postLikes + 1);
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !userID) return;
    try {
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(`${baseURL}/comment/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, 
        },
        body: JSON.stringify({
          content: newComment,
          post_id: post._id,  
          post_user_id: post.author._id 
        }),
      });

      if (!response.ok) throw new Error('Failed to submit comment');
      const newCommentData = await response.json();
      setPostComments([...postComments, newCommentData]);
      setNewComment('');
    } catch (err) {
      setError('Error submitting comment: ' + err.message);
    }
  };

  return (
    <section className="container max-w-3xl">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col justify-center items-center py-10">
          <Image
            src={post?.author?.avatar?.url ? post.author.avatar.url : gigachad} // Default image because there' re no image attribute in backend (Same thing goes with post image)
            alt="author avatar"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full"
          />
          <div className="text-center">
            <p className="text-whiteColor">{post.author}</p>
            <p>{post.author.designation}</p>
          </div>
        </div>
        <div className="text-center space-y-3">
          <h2>{post.title}</h2>
          <p className="flex items-center justify-center gap-3">
            <span className="text-primaryColor">{post.category}</span>
            <span className="flex items-center gap-1">
              <AiTwotoneCalendar />
              {formatDateTime(post.createdAt)}
            </span>
          </p>
        </div>
      </div>

      <div>
        <Image
          src={post?.image ? post.image.url : gigachad}
          alt="post image"
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-full rounded-lg py-10"
        />
      </div>

      <div className="text-start space-y-5">
        {post.content.split('\n').map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="py-12">
        <div className="flex gap-10 items-center text-xl justify-center">
          <div className="flex items-center gap-1">
            <p>{postLikes}</p>
            {isLiked ? (
              <AiFillHeart onClick={handleLike} size={20} color="#ed5784" cursor="pointer" />
            ) : (
              <AiOutlineHeart onClick={handleLike} size={20} cursor="pointer" />
            )}
          </div>
          <div className="flex items-center gap-1">
            <p>{postComments.length}</p>
            <AiOutlineComment size={20} />
          </div>
        </div>
      </div>

      {/* Comment section */}      
      <div className="space-y-5">
        <h3 className="text-xl font-bold">Comments</h3>
        
        {/* Comments list */}
        <div className="space-y-4">
          {postComments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            postComments.map((comment, index) => (
              <div key={index} className="border border-gray-300 p-4 rounded-md">
                <p className="font-semibold">{comment.user.name}</p>
                <p className="text-sm text-gray-500">{formatDateTime(comment.createdAt)}</p>
                <p className="mt-2">{comment.content}</p>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col gap-2">
          <textarea
            className="border p-2 rounded-md"
            rows="3"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button
            onClick={handleCommentSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
          >
            Post Comment
          </button>
        </div>
      </div>
    </section>
  );
};

export default PostDetail;
