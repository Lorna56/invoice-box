// // frontend/src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from './contexts/AuthContext';
// import PrivateRoute from './components/PrivateRoute';
// import Layout from './components/Layout'; // Import the new Layout component

// // Page imports
// import Landing from './pages/Landing';
// import Login from './pages/Login';
// import Register from './pages/Register';
// import ProviderDashboard from './pages/ProviderDashboard';
// import PurchaserDashboard from './pages/PurchaserDashboard';
// import AdminDashboard from './pages/AdminDashboard'; // <-- IMPORT ADMIN DASHBOARD
// import InvoiceDetails from './pages/InvoiceDetails';
// import CreateInvoice from './pages/CreateInvoice';
// import Payment from './pages/Payment';

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="min-h-screen bg-gray-50">
//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<Landing />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
            

//             {/* Protected Routes with a persistent Layout */}
//             <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
//               <Route path="provider-dashboard" element={<ProviderDashboard />} />
//               <Route path="purchaser-dashboard" element={<PurchaserDashboard />} />
//                <Route path="admin-dashboard" element={<AdminDashboard />} /> {/* <-- ADD ADMIN ROUTE */}
//               <Route path="invoice/:id" element={<InvoiceDetails />} />
//               <Route path="create-invoice" element={<CreateInvoice />} />
//               <Route path="payment/:invoiceId" element={<Payment />} />
//             </Route>
//           </Routes>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

// Page imports
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProviderDashboard from './pages/ProviderDashboard';
import PurchaserDashboard from './pages/PurchaserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ManageUsers from './pages/ManageUsers';
import AllInvoices from './pages/AllInvoices';
import ActivityLog from './pages/ActivityLog';
import Settings from './pages/Settings';
import InvoiceDetails from './pages/InvoiceDetails';
import CreateInvoice from './pages/CreateInvoice';
import Payment from './pages/Payment';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Routes with a persistent Layout */}
            <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
              {/* User Dashboards */}
              <Route path="provider-dashboard" element={<ProviderDashboard />} />
              <Route path="purchaser-dashboard" element={<PurchaserDashboard />} />
              <Route path="settings" element={<Settings />} />

              {/* Admin Routes */}
              <Route path="admin-dashboard" element={<AdminDashboard />} />
              <Route path="admin/users" element={<ManageUsers />} />
              <Route path="admin/invoices" element={<AllInvoices />} />
              <Route path="admin/activity" element={<ActivityLog />} />

              {/* Other Protected Routes */}
              <Route path="invoice/:id" element={<InvoiceDetails />} />
              <Route path="create-invoice" element={<CreateInvoice />} />
              <Route path="payment/:invoiceId" element={<Payment />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;