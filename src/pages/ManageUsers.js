// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ManageUsers = () => {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const response = await axios.get('/api/admin/users');
//         setUsers(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError('Failed to fetch users');
//         setLoading(false);
//       }
//     };

//     fetchUsers();
//   }, []);

//   const handleDeleteUser = async (userId) => {
//     if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
//       try {
//         await axios.delete(`/api/admin/users/${userId}`);
//         setUsers(users.filter(user => user._id !== userId));
//       } catch (err) {
//         setError('Failed to delete user');
//       }
//     }
//   };

//   const handleToggleStatus = async (userId, currentStatus) => {
//     const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
//     try {
//       await axios.put(`/api/admin/users/${userId}`, { status: newStatus });
//       setUsers(users.map(user => 
//         user._id === userId ? { ...user, status: newStatus } : user
//       ));
//     } catch (err) {
//       setError('Failed to update user status');
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>;

//   return (
//     <div>
//       <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h1>
//       <div className="bg-white shadow-md rounded-lg overflow-hidden">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//               <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {users.map((user) => (
//               <tr key={user._id}>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                     user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                   }`}>
//                     {user.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
//                   <button
//                     onClick={() => handleToggleStatus(user._id, user.status)}
//                     className={`text-indigo-600 hover:text-indigo-900`}
//                   >
//                     {user.status === 'active' ? 'Deactivate' : 'Activate'}
//                   </button>
//                   <button
//                     onClick={() => handleDeleteUser(user._id)}
//                     className="text-red-600 hover:text-red-900"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default ManageUsers;
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('/api/admin/users');
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await axios.delete(`/api/admin/users/${userId}`);
        setUsers(users.filter(user => user._id !== userId));
        setSuccessMessage('User deleted successfully!');
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await axios.put(`/api/admin/users/${userId}`, { status: newStatus });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, status: newStatus } : user
      ));
      setSuccessMessage(`User status updated to ${newStatus}.`);
    } catch (err) {
      setError('Failed to update user status');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Users</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {successMessage && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{successMessage}</div>}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  {user.status === 'active' ? (
                    <button onClick={() => handleToggleStatus(user._id, user.status)} className="text-indigo-600 hover:text-indigo-900">Deactivate</button>
                  ) : (
                    <button onClick={() => handleToggleStatus(user._id, user.status)} className="text-green-600 hover:text-green-900">Activate</button>
                  )}
                  <button onClick={() => handleDeleteUser(user._id)} className="text-red-600 hover:text-red-900 ml-2">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;