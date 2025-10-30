import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('/api/auth/reset-password', { token, newPassword });
      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // This wrapper centers the content vertically and horizontally
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your new password below.
          </p>
        </div>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
          {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
          
          {!token && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4" role="alert">
              <strong className="font-bold">Invalid or missing token.</strong>
              <p className="text-sm mt-2">Please check the link from your email and try again.</p>
            </div>
          )}
          
          {token && !message && (
            <form onSubmit={onSubmit} className="space-y-6">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

// import React, { useState, useEffect } from 'react';
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const ResetPassword = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const token = searchParams.get('token');

//   const [newPassword, setNewPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     if (!token) {
//       setError('Invalid or missing reset token.');
//     }
//   }, [token]);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     if (!token) return;
    
//     setLoading(true);
//     setError('');
//     try {
//       const response = await axios.post('/api/auth/reset-password', { token, newPassword });
//       setMessage(response.data.message);
//       setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
//     } catch (error) {
//       setError(error.response?.data?.message || 'An error occurred.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
//       <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
      
//       {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
//       {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
      
//       {token && !message && (
//         <form onSubmit={onSubmit}>
//           <div className="mb-4">
//             <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
//               New Password
//             </label>
//             <input
//               className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//               id="newPassword"
//               type="password"
//               placeholder="Enter your new password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               required
//             />
//           </div>
          
//           <button
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
//             type="submit"
//             disabled={loading}
//           >
//             {loading ? 'Resetting...' : 'Reset Password'}
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default ResetPassword;