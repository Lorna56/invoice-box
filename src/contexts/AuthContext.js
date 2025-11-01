// import React, { createContext, useState, useEffect, useContext } from 'react';
// import api from '../api'; // Import the configured API instance

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       // Use the configured API instance instead of direct axios
//       api.get('/api/auth/profile')
//         .then(response => {
//           setUser(response.data);
//           setIsAuthenticated(true);
//           setLoading(false);
//         })
//         .catch(error => {
//           console.error('Error fetching user profile:', error);
//           localStorage.removeItem('token');
//           setLoading(false);
//         });
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const login = async (email, password) => {
//     try {
//       console.log('Attempting login to:', api.defaults.baseURL + '/api/auth/login');
//       const response = await api.post('/api/auth/login', { email, password });
//       const { token, user: userData } = response.data;
      
//       localStorage.setItem('token', token);
//       setUser(userData);
//       setIsAuthenticated(true);
      
//       return userData;
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error.response?.data || { message: 'Login failed' };
//     }
//   };

//   const register = async (name, email, password, role) => {
//     try {
//       console.log('Attempting registration to:', api.defaults.baseURL + '/api/auth/register');
//       const response = await api.post('/api/auth/register', { name, email, password, role });
//       const { token, user: userData } = response.data;
      
//       localStorage.setItem('token', token);
//       setUser(userData);
//       setIsAuthenticated(true);
      
//       return userData;
//     } catch (error) {
//       console.error('Registration error:', error);
//       throw error.response?.data || { message: 'Registration failed' };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     setIsAuthenticated(false);
//   };

//   const updateUser = (userData) => {
//     setUser(userData);
//   };

//   const isAdmin = () => {
//     return user && user.role === 'admin';
//   };

//   // Make sure all values are provided in the context value
//   const value = {
//     user,
//     isAuthenticated,
//     loading,
//     login,
//     register,
//     logout,
//     updateUser,
//     isAdmin
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get('/api/auth/profile')
        .then(response => {
          setUser(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error(error);
          localStorage.removeItem('token');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUser(response.data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  const register = async (name, email, password, role) => {
    try {
      const response = await axios.post('/api/auth/register', { name, email, password, role });
      localStorage.setItem('token', response.data.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      setUser(response.data);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  // Add this helper function
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// import React, { createContext, useState, useEffect, useContext } from 'react';
// import axios from 'axios';

// const AuthContext = createContext();

// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
//       axios.get('/api/auth/profile')
//         .then(response => {
//           setUser(response.data);
//           setLoading(false);
//         })
//         .catch(error => {
//           console.error(error);
//           localStorage.removeItem('token');
//           setLoading(false);
//         });
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const login = async (email, password) => {
//     try {
//       const response = await axios.post('/api/auth/login', { email, password });
//       localStorage.setItem('token', response.data.token);
//       axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
//       setUser(response.data);
//       return response.data;
//     } catch (error) {
//       throw error.response.data;
//     }
//   };

//   const register = async (name, email, password, role) => {
//     try {
//       const response = await axios.post('/api/auth/register', { name, email, password, role });
//       localStorage.setItem('token', response.data.token);
//       axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
//       setUser(response.data);
//       return response.data;
//     } catch (error) {
//       throw error.response.data;
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     delete axios.defaults.headers.common['Authorization'];
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, register, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };