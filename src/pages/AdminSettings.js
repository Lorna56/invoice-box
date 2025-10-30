import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const AdminSettings = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [user]);

  const { name, email } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put('/api/users/profile', { name, email });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Settings</h1>
      {message && <div className={`p-3 rounded mb-4 ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input type="text" name="name" value={name} onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight" />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input type="email" name="email" value={email} onChange={onChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight" />
        </div>
        <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
          {loading ? 'Updating...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default AdminSettings;