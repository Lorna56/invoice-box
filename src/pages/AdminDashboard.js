import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardStats from '../components/DashboardStats';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/stats');
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch system stats');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
      
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.users.total}</p>
            <div className="mt-2 text-sm text-gray-600">
              {stats.users.providers} Providers, {stats.users.purchasers} Purchasers
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Invoices</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.invoices.total}</p>
            <div className="mt-2 text-sm text-gray-600">
              {stats.invoices.paid} Paid, {stats.invoices.pending} Pending
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-green-600">
              USD {stats.revenue.toFixed(2)}
            </p>
            <div className="mt-2 text-sm text-gray-600">From all paid invoices</div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Overdue Invoices</h3>
            <p className="text-3xl font-bold text-red-600">{stats.invoices.overdue}</p>
            <div className="mt-2 text-sm text-gray-600">Require attention</div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">System Overview</h2>
        <p className="text-gray-600">
          Welcome to the admin dashboard. From here, you can oversee the entire InvoiceBox platform.
          Use the sidebar to navigate to different management sections.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;