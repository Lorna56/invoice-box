import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import ExportInvoice from '../components/ExportInvoice';

const InvoiceDetails = () => {
  const [invoice, setInvoice] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(`/api/invoices/${id}`);
        setInvoice(response.data);
        
        // Fetch payments for this invoice
        const paymentsResponse = await axios.get(`/api/invoices/${id}/payments`);
        setPayments(paymentsResponse.data);
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch invoice details');
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    setStatusUpdateLoading(true);
    try {
      await axios.put(`/api/invoices/${id}`, { status: newStatus });
      setInvoice({ ...invoice, status: newStatus });
      setStatusUpdateLoading(false);
    } catch (err) {
      setError('Failed to update invoice status');
      setStatusUpdateLoading(false);
    }
  };

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

  if (error || !invoice) {
    return <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error || 'Invoice not found'}</div>;
  }

  return (
    <div className="flex">
      <div className="flex-1 p-8">
        <div className="mb-4">
          <button
            onClick={() => navigate(user?.role === 'provider' ? '/provider-dashboard' : '/purchaser-dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
        </div>
        
        <div id="invoice-content" className="bg-white shadow-md rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Invoice Details</h1>
              <p className="text-gray-600">Invoice #{invoice.invoiceNumber}</p>
            </div>
            <div className="text-right">
              <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusColor(invoice.status)}`}>
                {invoice.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Provider</h3>
              <p className="text-gray-600">{invoice.provider.name}</p>
              <p className="text-gray-600">{invoice.provider.email}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Purchaser</h3>
              <p className="text-gray-600">{invoice.purchaser.name}</p>
              <p className="text-gray-600">{invoice.purchaser.email}</p>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Invoice Items</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {invoice.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {item.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.currency} {item.unitPrice.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.currency} {item.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Invoice Details</h3>
              <p className="text-gray-600">Issue Date: {formatDate(invoice.createdAt)}</p>
              <p className="text-gray-600">Due Date: {formatDate(invoice.dueDate)}</p>
              <p className="text-gray-600">Currency: {invoice.currency}</p>
            </div>
            <div className="text-right">
              <p className="text-gray-600">Subtotal: {invoice.currency} {invoice.subtotal.toFixed(2)}</p>
              <p className="text-gray-600">Tax: {invoice.currency} {invoice.tax.toFixed(2)}</p>
              <p className="text-xl font-bold text-gray-800">Total: {invoice.currency} {invoice.total.toFixed(2)}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            {user.role === 'provider' && invoice.status === 'pending' && (
              <button
                onClick={() => handleStatusUpdate('overdue')}
                disabled={statusUpdateLoading}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {statusUpdateLoading ? 'Updating...' : 'Mark as Overdue'}
              </button>
            )}
            {user.role === 'provider' && invoice.status === 'pending' && (
              <button
                onClick={() => handleStatusUpdate('defaulted')}
                disabled={statusUpdateLoading}
                className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                {statusUpdateLoading ? 'Updating...' : 'Mark as Defaulted'}
              </button>
            )}
            {user.role === 'purchaser' && invoice.status === 'pending' && (
              <button
                onClick={() => navigate(`/payment/${invoice._id}`)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Make Payment
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Print Invoice
            </button>
            <ExportInvoice invoiceId={invoice._id} />
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Payment History</h2>
          {payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Notes
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.map((payment) => (
                    <tr key={payment._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(payment.paymentDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {invoice.currency} {payment.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.method}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' : 
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.notes || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No payments made yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetails;


