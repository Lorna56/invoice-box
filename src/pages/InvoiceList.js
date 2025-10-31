import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        // Try different possible endpoints
        let endpoint;
        let response;
        
        // First try the specific endpoints
        if (user.role === 'provider') {
          try {
            response = await axios.get('/api/invoices/provider');
          } catch (err) {
            console.log('Provider endpoint failed, trying alternative');
            // Try getting all invoices and filter on frontend
            response = await axios.get('/api/invoices');
            response.data = response.data.filter(invoice => 
              invoice.provider && invoice.provider._id === user._id
            );
          }
        } else if (user.role === 'purchaser') {
          try {
            response = await axios.get('/api/invoices/purchaser');
          } catch (err) {
            console.log('Purchaser endpoint failed, trying alternative');
            // Try getting all invoices and filter on frontend
            response = await axios.get('/api/invoices');
            response.data = response.data.filter(invoice => 
              invoice.purchaser && invoice.purchaser._id === user._id
            );
          }
        } else {
          throw new Error('Invalid user role');
        }

        setInvoices(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching invoices:', err);
        
        // Try one more approach - get all invoices
        try {
          console.log('Trying to get all invoices as fallback');
          const response = await axios.get('/api/invoices');
          
          // Filter based on user role
          let filteredInvoices = [];
          if (user.role === 'provider') {
            filteredInvoices = response.data.filter(invoice => 
              invoice.provider && invoice.provider._id === user._id
            );
          } else if (user.role === 'purchaser') {
            filteredInvoices = response.data.filter(invoice => 
              invoice.purchaser && invoice.purchaser._id === user._id
            );
          }
          
          setInvoices(filteredInvoices);
          setLoading(false);
        } catch (fallbackErr) {
          console.error('Fallback also failed:', fallbackErr);
          setError('Failed to fetch invoices. Please try again later.');
          setLoading(false);
        }
      }
    };

    fetchInvoices();
  }, [user]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'defaulted':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Try Again
        </button>
        <button
          onClick={() => navigate(user?.role === 'provider' ? '/provider-dashboard' : '/purchaser-dashboard')}
          className="ml-4 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg h-full">
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h1 className="text-lg leading-6 font-medium text-gray-900">
                {user.role === 'provider' ? 'Your Invoices' : 'Invoices to Pay'}
              </h1>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                {user.role === 'provider' 
                  ? 'View and manage all invoices you have created' 
                  : 'View and pay all invoices sent to you'}
              </p>
            </div>
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {invoices.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {invoices.map((invoice) => (
                    <li key={invoice._id}>
                      <div 
                        className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer"
                        onClick={() => navigate(`/invoice/${invoice._id}`)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-indigo-600 truncate">
                              Invoice #{invoice.invoiceNumber}
                            </p>
                            <p className="ml-2 text-sm text-gray-500">
                              {formatDate(invoice.createdAt)}
                            </p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                              {invoice.status}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {user.role === 'provider' 
                                ? `To: ${invoice.purchaser?.name || 'Unknown'}` 
                                : `From: ${invoice.provider?.name || 'Unknown'}`}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <p>
                              {invoice.currency} {invoice.total.toFixed(2)}
                            </p>
                            <p className="ml-4">
                              Due: {formatDate(invoice.dueDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No invoices</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {user.role === 'provider' 
                      ? 'Get started by creating a new invoice.' 
                      : 'You have no invoices to pay at the moment.'}
                  </p>
                  {user.role === 'provider' && (
                    <div className="mt-6">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={() => navigate('/create-invoice')}
                      >
                        Create Invoice
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;