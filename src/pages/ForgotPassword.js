import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [resetLink, setResetLink] = useState('');
  const [loading, setLoading] = useState(false);

  const apiUrl = process.env.REACT_APP_API_URL; // <-- Use backend URL from .env

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResetLink('');
    setMessage('');

    try {
      const response = await axios.post(`${apiUrl}api/auth/forgot-password`, { email });
      setMessage(response.data.message);

      if (response.data.resetLink) {
        setResetLink(response.data.resetLink);
      }
    } catch (error) {
      console.error(error.response || error);
      setMessage(
        error.response?.data?.message || 'An error occurred. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Forgot Password</h2>
      <p className="text-gray-600 text-center mb-6">
        Enter your email address and we will generate a password reset link for you.
      </p>

      {message && (
        <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4 text-center">
          {message}
        </div>
      )}

      {resetLink && (
        <div
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 break-all"
          role="alert"
        >
          <strong className="font-bold">Reset Link Generated!</strong>
          <p className="text-sm mt-2">Click the link below to reset your password:</p>
          <a
            href={resetLink}
            className="font-semibold underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {resetLink}
          </a>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email Address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Generate Reset Link'}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <Link to="/login" className="text-blue-600 hover:text-blue-800 text-sm">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;


// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';

// const ForgotPassword = () => {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');
//   const [resetLink, setResetLink] = useState(''); // <-- Add state for the link
//   const [loading, setLoading] = useState(false);

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setResetLink(''); // Clear previous link
//     try {
//       const response = await axios.post('/api/auth/forgot-password', { email });
//       setMessage(response.data.message);
//       // Check if the response contains the resetLink
//       if (response.data.resetLink) {
//         setResetLink(response.data.resetLink);
//       }
//     } catch (error) {
//       setMessage('An error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
//       <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Forgot Password</h2>
//       <p className="text-gray-600 text-center mb-6">
//         Enter your email address and we will generate a password reset link for you.
//       </p>
      
//       {message && <div className="bg-blue-100 text-blue-700 p-3 rounded mb-4 text-center">{message}</div>}
      
//       {/* Display the reset link if it exists */}
//       {resetLink && (
//         <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4" role="alert">
//           <strong className="font-bold">Reset Link Generated!</strong>
//           <p className="text-sm mt-2 break-all">
//             Click the link below to reset your password:
//           </p>
//           <a 
//             href={resetLink} 
//             className="font-semibold underline"
//             target="_blank" 
//             rel="noopener noreferrer"
//           >
//             {resetLink}
//           </a>
//         </div>
//       )}
      
//       <form onSubmit={onSubmit}>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//             Email Address
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="email"
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
        
//         <div className="flex items-center justify-between">
//           <button
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
//             type="submit"
//             disabled={loading}
//           >
//             {loading ? 'Generating...' : 'Generate Reset Link'}
//           </button>
//         </div>
//       </form>
      
//       <div className="mt-6 text-center">
//         <Link to="/login" className="text-blue-600 hover:text-blue-800 text-sm">
//           Back to Login
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default ForgotPassword;
