import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ProviderDashboard from './pages/ProviderDashboard';
import PurchaserDashboard from './pages/PurchaserDashboard';
import InvoiceDetails from './pages/InvoiceDetails';
import CreateInvoice from './pages/CreateInvoice';
import Payment from './pages/Payment';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<PrivateRoute><ProviderDashboard /></PrivateRoute>} />
              <Route path="/provider-dashboard" element={<PrivateRoute><ProviderDashboard /></PrivateRoute>} />
              <Route path="/purchaser-dashboard" element={<PrivateRoute><PurchaserDashboard /></PrivateRoute>} />
              <Route path="/invoice/:id" element={<PrivateRoute><InvoiceDetails /></PrivateRoute>} />
              <Route path="/create-invoice" element={<PrivateRoute><CreateInvoice /></PrivateRoute>} />
              <Route path="/payment/:invoiceId" element={<PrivateRoute><Payment /></PrivateRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;