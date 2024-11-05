import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import axiosInstance from '../axiosInstance';
import moment from 'moment';

const PostForm = () => {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); 
  const userId = JSON.parse(localStorage.getItem('userInfo')).id;
  const token = localStorage.getItem('token');
  const config = {
     headers: {
       Authorization: `Bearer ${token}`,
     },
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    const config = {
       headers: {
         Authorization: `Bearer ${token}`,
       },
    };

    const fetchData = async () => {
      try {
        if (id) {
          const response = await axiosInstance.get(`/posts/${id}`, config);
          setFormData({
            title: response.data.title || '',
            description: response.data.description || '',
            image: null, 
          });
          setIsEditing(true);
        } else if (userId) {
          const response = await axiosInstance.get(`/posts/user/${userId}`, config);
          setPosts(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    
    fetchData();
  }, [id, userId]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0], 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append('title', formData.title); 
    data.append('description', formData.description); 
    if (formData.image) {
      data.append('image', formData.image); 
    }
  
    try {
      if (isEditing) {
        await axiosInstance.put(`/posts/${id}`, data, config);
        alert('Post updated successfully!');
      } else {
        await axiosInstance.post('/posts', data, config);
        alert('Post created successfully!');
      }
      navigate('/');
    } catch (error) {
      console.error('Error submitting form:', error);
      if (error.response) {
        console.log('Response data:', error.response.data);
        alert(`Error: ${error.response.data.message || 'An error occurred'}`);
      } else {
        alert('Error: Could not connect to server');
      }
    }
  };

  const handleDelete = async (id) => {
    
    const token = localStorage.getItem('token');

    const config = {
       headers: {
         Authorization: `Bearer ${token}`,
       },
    };

    await axiosInstance.delete(`/posts/${id}`, config);
    setPosts(posts.filter(post => post._id !== id));
    alert('Post deleted successfully!');
  };

  return (
    <div className="flex flex-col items-center px-4 sm:px-8 md:px-12 lg:px-24 xl:px-32 bg-gray-100 min-h-screen">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-6 sm:p-8 md:p-10 lg:p-12 bg-white shadow-lg rounded-lg mb-8"
      >
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Content</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Image</label>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="w-full text-gray-700 border border-gray-300 rounded px-4 py-2 focus:outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {isEditing ? 'Update' : 'Create'}
        </button>
      </form>
      
      <ul className="w-full max-w-3xl space-y-6">
        {posts.map(post => (
          <li
            key={post._id}
            className="bg-white shadow-md rounded p-4 md:p-6 text-left"
          >
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover rounded mb-4"/>
            <h2 className="text-xl font-semibold">{post.title}</h2>
            <p className="mt-2 text-gray-700">{post.description}</p>
            <p className="mt-2 text-gray-500 text-sm">
              {moment(post.createdAt).fromNow()}
            </p>
            <div className="mt-2 flex justify-end space-x-4">
              <Link
                to={`/edit-post/${post._id}`}
                className="text-blue-500 hover:underline"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(post._id)}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
   
};

export default PostForm;
