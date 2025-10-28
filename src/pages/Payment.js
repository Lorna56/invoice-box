import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const Payment = () => {
  const [invoice, setInvoice] = useState(null);
  const [payments, setPayments] = useState([]);
  const [formData, setFormData] = useState({
    amount: 0,
    method: 'bank transfer',
    notes: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { invoiceId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(`/api/invoices/${invoiceId}`);
        setInvoice(response.data);
        
        // Fetch payments for this invoice
        const paymentsResponse = await axios.get(`/api/invoices/${invoiceId}/payments`);
        setPayments(paymentsResponse.data);
        
        // Set default payment amount to remaining balance
        const totalPaid = paymentsResponse.data.reduce((sum, payment) => sum + payment.amount, 0);
        const remainingBalance = response.data.total - totalPaid;
        setFormData({
          ...formData,
          amount: remainingBalance > 0 ? remainingBalance : 0,
        });
        
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch invoice details');
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await axios.post('/api/payments', {
        invoice: invoiceId,
        ...formData,
      });
      navigate(`/invoice/${invoiceId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process payment');
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const remainingBalance = invoice.total - totalPaid;

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Make Payment</h1>

      <div className="mb-6 p-4 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Invoice Details</h2>
        <p className="text-gray-600">Invoice #{invoice.invoiceNumber}</p>
        <p className="text-gray-600">Provider: {invoice.provider.name}</p>
        <p className="text-gray-600">Due Date: {formatDate(invoice.dueDate)}</p>
        <div className="mt-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Total Amount:</span>
            <span className="text-gray-700">{invoice.currency} {invoice.total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-700">Amount Paid:</span>
            <span className="text-gray-700">{invoice.currency} {totalPaid.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold">
            <span className="text-gray-700">Remaining Balance:</span>
            <span className="text-gray-700">{invoice.currency} {remainingBalance.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {remainingBalance > 0 ? (
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
              Payment Amount
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="amount"
              name="amount"
              type="number"
              value={formData.amount}
              onChange={handleChange}
              min="0.01"
              max={remainingBalance}
              step="0.01"
              required
            />
            <p className="text-gray-600 text-xs mt-1">Maximum amount: {invoice.currency} {remainingBalance.toFixed(2)}</p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="method">
              Payment Method
            </label>
            <select
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="method"
              name="method"
              value={formData.method}
              onChange={handleChange}
              required
            >
              <option value="bank transfer">Bank Transfer</option>
              <option value="cash">Cash</option>
              <option value="mobile money">Mobile Money</option>
              <option value="credit card">Credit Card</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="notes">
              Notes (Optional)
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
            ></textarea>
          </div>

          {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate(`/invoice/${invoiceId}`)}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={submitting}
            >
              {submitting ? 'Processing...' : 'Process Payment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
          This invoice has been fully paid.
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Payment History</h2>
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
  );
};

export default Payment;