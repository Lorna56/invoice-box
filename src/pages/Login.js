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
      // Handle different types of errors
      let errorMessage = 'Failed to login';
      
      if (err.response && err.response.data) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to determine error type and styling
  const getErrorType = (message) => {
    if (message && message.includes('deactivated')) {
      return 'deactivated';
    } else if (message && message.includes('deleted')) {
      return 'deleted';
    } else {
      return 'error';
    }
  };

  const errorType = getErrorType(error);

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
          {error && (
            <div className={`p-3 rounded mb-4 ${
              errorType === 'deactivated' 
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' 
                : errorType === 'deleted'
                ? 'bg-red-100 text-red-800 border border-red-300'
                : 'bg-red-100 text-red-700'
            }`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {errorType === 'deactivated' ? (
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : errorType === 'deleted' ? (
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm ${
                    errorType === 'deactivated' 
                      ? 'text-yellow-800' 
                      : errorType === 'deleted'
                      ? 'text-red-800'
                      : 'text-red-700'
                  }`}>
                    {error}
                  </p>
                  {errorType === 'deactivated' && (
                    <p className="mt-1 text-sm text-yellow-700">
                      Please contact support if you believe this is an error.
                    </p>
                  )}
                  {errorType === 'deleted' && (
                    <div className="mt-2">
                      <p className="text-sm text-red-700">
                        This action is permanent. If you believe this is an error, please contact our support team immediately.
                      </p>
                      <p className="mt-1 text-xs text-red-600">
                        Support: support@yourcompany.com
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          
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
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
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