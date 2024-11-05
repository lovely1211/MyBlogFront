import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import moment from 'moment';

const PostList = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const fetchPosts = async () => {
      const response = await axiosInstance.get('/posts', config);
      setPosts(response.data);
    };
    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col items-center bg-gray-300 min-h-screen p-4">
      <div className="flex justify-between items-center w-full max-w-3xl">
        <h1 className="font-bold text-2xl">Explore Blogify</h1>
        <Link
          to="/create-post"
          className="text-lg font-semibold bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Create New Post
        </Link>
      </div>
      <ul className="mt-6 space-y-4 w-full max-w-3xl">
        {posts.map(post => (
          <li
            key={post._id}
            className="bg-white shadow-md rounded p-4 text-left"
          >
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded mb-4" />
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-gray-700">{post.description}</p>
            <p className="mt-2 text-gray-500 text-sm">
              {moment(post.createdAt).fromNow()}
            </p>
            <div className="mt-4 flex justify-end space-x-4"></div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PostList;
