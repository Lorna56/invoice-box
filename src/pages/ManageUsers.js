import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [actionLoading, setActionLoading] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/admin/users');
        // Ensure all users have a status field
        const usersWithStatus = response.data.map(user => ({
          ...user,
          status: user.status || 'active' // Default to 'active' if status is missing
        }));
        setUsers(usersWithStatus);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    setActionLoading({ ...actionLoading, [userId]: 'delete' });
    try {
      await axios.delete(`/api/admin/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      setSuccessMessage('User deleted successfully!');
      setShowDeleteModal(false);
      setUserToDelete(null);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
      setTimeout(() => setError(''), 3000);
    } finally {
      setActionLoading({ ...actionLoading, [userId]: null });
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  const handleActivateUser = async (userId) => {
    setActionLoading({ ...actionLoading, [userId]: 'activate' });
    try {
      await axios.put(`/api/admin/users/${userId}`, { status: 'active' });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: 'active' } : user
      ));
      setSuccessMessage('User activated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error activating user:', err);
      setError('Failed to activate user');
      setTimeout(() => setError(''), 3000);
    } finally {
      setActionLoading({ ...actionLoading, [userId]: null });
    }
  };

  const handleDeactivateUser = async (userId) => {
    setActionLoading({ ...actionLoading, [userId]: 'deactivate' });
    try {
      await axios.put(`/api/admin/users/${userId}`, { status: 'inactive' });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: 'inactive' } : user
      ));
      setSuccessMessage('User deactivated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error deactivating user:', err);
      setError('Failed to deactivate user');
      setTimeout(() => setError(''), 3000);
    } finally {
      setActionLoading({ ...actionLoading, [userId]: null });
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="flex-1 p-4 md:p-8 pt-16 md:pt-8">
      <div className="max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-xl font-semibold text-gray-900">Manage Users</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all users in your account including their name, email, role and status.
            </p>
          </div>
        </div>
        
        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {successMessage && (
          <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{successMessage}</span>
          </div>
        )}
        
        <div className="mt-8 flex flex-col">
          {/* Table for larger screens */}
          <div className="hidden md:block -my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.status || 'active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          {user.status === 'active' ? (
                            <button
                              onClick={() => handleDeactivateUser(user._id)}
                              disabled={actionLoading[user._id] === 'deactivate'}
                              className="text-yellow-600 hover:text-yellow-900 disabled:opacity-50"
                            >
                              {actionLoading[user._id] === 'deactivate' ? 'Deactivating...' : 'Deactivate'}
                            </button>
                          ) : (
                            <button
                              onClick={() => handleActivateUser(user._id)}
                              disabled={actionLoading[user._id] === 'activate'}
                              className="text-green-600 hover:text-green-900 disabled:opacity-50"
                            >
                              {actionLoading[user._id] === 'activate' ? 'Activating...' : 'Activate'}
                            </button>
                          )}
                          <button
                            onClick={() => openDeleteModal(user)}
                            disabled={actionLoading[user._id] === 'delete'}
                            className="text-red-600 hover:text-red-900 ml-2 disabled:opacity-50"
                          >
                            {actionLoading[user._id] === 'delete' ? 'Deleting...' : 'Delete'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Card layout for mobile */}
          <div className="md:hidden space-y-4">
            {users.map((user) => (
              <div key={user._id} className="bg-white shadow rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                      {user.role}
                    </span>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {user.status || 'active'}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  {user.status === 'active' ? (
                    <button
                      onClick={() => handleDeactivateUser(user._id)}
                      disabled={actionLoading[user._id] === 'deactivate'}
                      className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded hover:bg-yellow-200 disabled:opacity-50"
                    >
                      {actionLoading[user._id] === 'deactivate' ? 'Deactivating...' : 'Deactivate'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActivateUser(user._id)}
                      disabled={actionLoading[user._id] === 'activate'}
                      className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200 disabled:opacity-50"
                    >
                      {actionLoading[user._id] === 'activate' ? 'Activating...' : 'Activate'}
                    </button>
                  )}
                  <button
                    onClick={() => openDeleteModal(user)}
                    disabled={actionLoading[user._id] === 'delete'}
                    className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200 disabled:opacity-50"
                  >
                    {actionLoading[user._id] === 'delete' ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && userToDelete && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto">
              <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 text-center mb-2">Delete User</h3>
              <p className="text-sm text-gray-500 text-center mb-4">
                Are you sure you want to delete {userToDelete.name}? This action is irreversible and will permanently remove all their data including invoices and payment history.
              </p>
              <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 w-full sm:w-auto"
                  onClick={closeDeleteModal}
                  disabled={actionLoading[userToDelete._id] === 'delete'}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 w-full sm:w-auto"
                  onClick={() => handleDeleteUser(userToDelete._id)}
                  disabled={actionLoading[userToDelete._id] === 'delete'}
                >
                  {actionLoading[userToDelete._id] === 'delete' ? 'Deleting...' : 'Yes, Delete User'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;
