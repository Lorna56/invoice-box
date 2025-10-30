import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PasswordInput from '../components/PasswordInput';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Capture the user data returned from the login function
      const userData = await login(email, password);

      // Navigate to the correct dashboard based on the user's role
      if (userData.role === 'provider') {
        navigate('/provider-dashboard');
      } else if (userData.role === 'purchaser') {
        navigate('/purchaser-dashboard');
      } else if (userData.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        // Fallback to the landing page if the role is something unexpected
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Failed to login');
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
            Sign in to your account
          </h2>
        </div>
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <PasswordInput
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {loading ? 'Logging in...' : 'Sign in'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                Forgot your password?
              </Link>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';
// import PasswordInput from '../components/PasswordInput';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   // frontend/src/pages/Login.js

// // ... (imports and component setup)

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError('');
//   setLoading(true);
  
//   try {
//     // Capture the user data returned from the login function
//     const userData = await login(email, password);

//     // Navigate to the correct dashboard based on the user's role
//     if (userData.role === 'provider') {
//       navigate('/provider-dashboard');
//     } else if (userData.role === 'purchaser') {
//       navigate('/purchaser-dashboard');
//        } else if (userData.role === 'admin') { // <-- ADD THIS CHECK
//       navigate('/admin-dashboard');
//     } else {
//       // Fallback to the landing page if the role is something unexpected
//       navigate('/');
//     }
//   } catch (err) {
//     setError(err.message || 'Failed to login');
//   } finally {
//     setLoading(false);
//   }
// };



//   return (
//     <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
//       <h2 className="text-2xl font-bold text-center mb-6">Login to InvoiceBox</h2>
      
//       {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
//       <form onSubmit={handleSubmit}>
//         <div className="mb-4">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
//             Email
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="email"
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
        
//         <PasswordInput
//           id="password"
//           label="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           required
//         />
        
//         <div className="flex items-center justify-between">
//           <button
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
//             type="submit"
//             disabled={loading}
//           >
//             {loading ? 'Logging in...' : 'Login'}
//           </button>
//         </div>
//       </form>
      
//       <div className="mt-4 text-center">
//   <p className="text-sm text-gray-600">
//     <Link to="/forgot-password" className="text-blue-600 hover:text-blue-800">
//       Forgot your password?
//     </Link>
//   </p>
//   <p className="text-sm text-gray-600 mt-2">
//     Don't have an account? <Link to="/register" className="text-blue-600 hover:text-blue-800">Register</Link>
//   </p>
// </div>
//     </div>
//   );
// };

// export default Login;

