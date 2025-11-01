import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PasswordStrength from '../components/PasswordStrength';
import PasswordInput from '../components/PasswordInput'; // Ensure you export this separately

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL; // <-- Use backend URL from .env

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing reset token.');
    }
  }, [token]);

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    if (passwordError) setPasswordError('');
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setError('');
    setPasswordError('');

    if (!token) return;

    if (!isPasswordValid) {
      setPasswordError('Please create a stronger password before continuing');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${apiUrl}/api/auth/reset-password`, { token, newPassword });
      setMessage(response.data.message);
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
                <PasswordInput
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter your new password"
                  className={passwordError ? 'border-red-500' : ''}
                  required
                />
                <PasswordStrength 
                  password={newPassword} 
                  onValidationChange={setIsPasswordValid}
                  minStrength={60}
                  showError={submitAttempted && !isPasswordValid}
                  errorMessage="Password is too weak. Please make it stronger before continuing."
                />
                {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading || !isPasswordValid}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                    isPasswordValid
                      ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                      : 'bg-gray-400 cursor-not-allowed'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
                {!isPasswordValid && newPassword && (
                  <p className="mt-2 text-sm text-gray-500 text-center">
                    Please create a stronger password to continue
                  </p>
                )}
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
// import PasswordStrength from '../components/PasswordStrength';

// const PasswordInput = ({ id, name, value, onChange, placeholder, className = '', required = false }) => {
//   const [showPassword, setShowPassword] = useState(false);
  
//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };
  
//   return (
//     <div className="relative">
//       <input
//         id={id}
//         name={name}
//         type={showPassword ? 'text' : 'password'}
//         autoComplete="new-password"
//         required={required}
//         className={`appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`}
//         placeholder={placeholder}
//         value={value}
//         onChange={onChange}
//       />
//       <button
//         type="button"
//         className="absolute inset-y-0 right-0 pr-3 flex items-center"
//         onClick={togglePasswordVisibility}
//       >
//         {showPassword ? (
//           <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
//           </svg>
//         ) : (
//           <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//           </svg>
//         )}
//       </button>
//     </div>
//   );
// };

// const ResetPassword = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const token = searchParams.get('token');

//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [isPasswordValid, setIsPasswordValid] = useState(false);
//   const [submitAttempted, setSubmitAttempted] = useState(false);
//   const [passwordError, setPasswordError] = useState('');

//   useEffect(() => {
//     if (!token) {
//       setError('Invalid or missing reset token.');
//     }
//   }, [token]);

//   const handlePasswordChange = (e) => {
//     setNewPassword(e.target.value);
//     // Clear password error when user starts typing
//     if (passwordError) {
//       setPasswordError('');
//     }
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitAttempted(true);
//     setError('');
//     setPasswordError('');
    
//     if (!token) return;
    
//     // Check if password is valid
//     if (!isPasswordValid) {
//       setPasswordError('Please create a stronger password before continuing');
//       return;
//     }
    
//     // Check if passwords match
//     if (newPassword !== confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }
    
//     setLoading(true);
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
//     // This wrapper centers the content vertically and horizontally
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Reset your password
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Enter your new password below.
//           </p>
//         </div>
//         <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
//           {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
//           {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
          
//           {!token && (
//             <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4" role="alert">
//               <strong className="font-bold">Invalid or missing token.</strong>
//               <p className="text-sm mt-2">Please check the link from your email and try again.</p>
//             </div>
//           )}
          
//           {token && !message && (
//             <form onSubmit={onSubmit} className="space-y-6">
//               <div>
//                 <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
//                 <PasswordInput
//                   id="newPassword"
//                   name="newPassword"
//                   value={newPassword}
//                   onChange={handlePasswordChange}
//                   placeholder="Enter your new password"
//                   className={passwordError ? 'border-red-500' : ''}
//                   required
//                 />
//                 <PasswordStrength 
//                   password={newPassword} 
//                   onValidationChange={setIsPasswordValid}
//                   minStrength={60}
//                   showError={submitAttempted && !isPasswordValid}
//                   errorMessage="Password is too weak. Please make it stronger before continuing."
//                 />
//                 {passwordError && (
//                   <p className="mt-1 text-sm text-red-600">{passwordError}</p>
//                 )}
//               </div>
              
//               <div>
//                 <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
//                 <PasswordInput
//                   id="confirmPassword"
//                   name="confirmPassword"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   placeholder="Confirm your new password"
//                   required
//                 />
//               </div>
              
//               <div>
//                 <button
//                   type="submit"
//                   disabled={loading || !isPasswordValid}
//                   className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
//                     isPasswordValid
//                       ? 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
//                       : 'bg-gray-400 cursor-not-allowed'
//                   } focus:outline-none focus:ring-2 focus:ring-offset-2`}
//                 >
//                   {loading ? 'Resetting...' : 'Reset Password'}
//                 </button>
//                 {!isPasswordValid && newPassword && (
//                   <p className="mt-2 text-sm text-gray-500 text-center">
//                     Please create a stronger password to continue
//                   </p>
//                 )}
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResetPassword;


// // import React, { useState, useEffect } from 'react';
// // import { useSearchParams, useNavigate } from 'react-router-dom';
// // import axios from 'axios';

// // const ResetPassword = () => {
// //   const [searchParams] = useSearchParams();
// //   const navigate = useNavigate();
// //   const token = searchParams.get('token');

// //   const [newPassword, setNewPassword] = useState('');
// //   const [message, setMessage] = useState('');
// //   const [error, setError] = useState('');
// //   const [loading, setLoading] = useState(false);

// //   useEffect(() => {
// //     if (!token) {
// //       setError('Invalid or missing reset token.');
// //     }
// //   }, [token]);

// //   const onSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!token) return;
    
// //     setLoading(true);
// //     setError('');
// //     try {
// //       const response = await axios.post('/api/auth/reset-password', { token, newPassword });
// //       setMessage(response.data.message);
// //       setTimeout(() => navigate('/login'), 3000); // Redirect after 3 seconds
// //     } catch (error) {
// //       setError(error.response?.data?.message || 'An error occurred.');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     // This wrapper centers the content vertically and horizontally
// //     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
// //       <div className="max-w-md w-full space-y-8">
// //         <div>
// //           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
// //             Reset your password
// //           </h2>
// //           <p className="mt-2 text-center text-sm text-gray-600">
// //             Enter your new password below.
// //           </p>
// //         </div>
// //         <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
// //           {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
// //           {message && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{message}</div>}
          
// //           {!token && (
// //             <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4" role="alert">
// //               <strong className="font-bold">Invalid or missing token.</strong>
// //               <p className="text-sm mt-2">Please check the link from your email and try again.</p>
// //             </div>
// //           )}
          
// //           {token && !message && (
// //             <form onSubmit={onSubmit} className="space-y-6">
// //               <div>
// //                 <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
// //                 <input
// //                   id="newPassword"
// //                   name="newPassword"
// //                   type="password"
// //                   autoComplete="new-password"
// //                   required
// //                   className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
// //                   placeholder="Enter your new password"
// //                   value={newPassword}
// //                   onChange={(e) => setNewPassword(e.target.value)}
// //                 />
// //               </div>
              
// //               <div>
// //                 <button
// //                   type="submit"
// //                   disabled={loading}
// //                   className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
// //                 >
// //                   {loading ? 'Resetting...' : 'Reset Password'}
// //                 </button>
// //               </div>
// //             </form>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ResetPassword;

