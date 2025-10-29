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

  // frontend/src/pages/Login.js

// ... (imports and component setup)

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
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mt-10">
      <h2 className="text-2xl font-bold text-center mb-6">Login to InvoiceBox</h2>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <PasswordInput
          id="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-blue-600 hover:text-blue-800">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../contexts/AuthContext';

// const Login = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
  
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);
    
//     try {
//       await login(email, password);
//       navigate('/');
//     } catch (err) {
//       setError(err.message || 'Failed to login');
//     } finally {
//       setLoading(false);
//     }
//   };

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
        
//         <div className="mb-6">
//           <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
//             Password
//           </label>
//           <input
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             id="password"
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
        
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
//         <p className="text-sm text-gray-600">
//           Don't have an account? <Link to="/register" className="text-blue-600 hover:text-blue-800">Register</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Login;