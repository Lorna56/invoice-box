// frontend/src/components/DashboardStats.js

import React, { useMemo } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';

// ===================================================================
// == THIS IS THE PART YOU WERE MISSING ==
// == Import the necessary Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register the components within this file
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);
// ===================================================================


const DashboardStats = ({ invoices, userRole }) => {
  // Calculate stats
  const totalInvoices = invoices.length;
  const pendingInvoices = invoices.filter(inv => inv.status === 'pending').length;
  const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
  const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;
  const defaultedInvoices = invoices.filter(inv => inv.status === 'defaulted').length;
  
  // Calculate total amount
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
  const paidAmount = invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.total, 0);
  const pendingAmount = invoices
    .filter(inv => inv.status === 'pending')
    .reduce((sum, inv) => sum + inv.total, 0);
  
  // Memoize the chart data for the doughnut chart
  const statusData = useMemo(() => ({
    labels: ['Pending', 'Paid', 'Overdue', 'Defaulted'],
    datasets: [
      {
        data: [pendingInvoices, paidInvoices, overdueInvoices, defaultedInvoices],
        backgroundColor: [
          '#FCD34D', // yellow-300
          '#34D399', // green-400
          '#F87171', // red-400
          '#9CA3AF', // gray-400
        ],
        borderWidth: 0,
      },
    ],
  }), [pendingInvoices, paidInvoices, overdueInvoices, defaultedInvoices]); // Dependency array
  
  // Memoize the chart data for the bar chart
  const currencyData = useMemo(() => ({
    labels: ['USD', 'UGX', 'LYD'],
    datasets: [
      {
        label: 'Invoice Count',
        data: [
          invoices.filter(inv => inv.currency === 'USD').length,
          invoices.filter(inv => inv.currency === 'UGX').length,
          invoices.filter(inv => inv.currency === 'LYD').length,
        ],
        backgroundColor: '#3B82F6', // blue-500
        borderColor: '#1D4ED8', // blue-700
        borderWidth: 1,
      },
    ],
  }), [invoices]); // Dependency array
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-500">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Total Invoices</p>
            <p className="text-2xl font-semibold text-gray-900">{totalInvoices}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Pending</p>
            <p className="text-2xl font-semibold text-gray-900">{pendingInvoices}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-500">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Paid</p>
            <p className="text-2xl font-semibold text-gray-900">{paidInvoices}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-red-100 text-red-500">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">Overdue</p>
            <p className="text-2xl font-semibold text-gray-900">{overdueInvoices}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Invoice Status</h3>
        <div className="h-64">
          <Doughnut data={statusData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Currency Distribution</h3>
        <div className="h-64">
          <Bar data={currencyData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Total Amount</h3>
        <p className="text-3xl font-bold text-gray-900">
          {invoices.length > 0 ? invoices[0].currency : 'USD'} {totalAmount.toFixed(2)}
        </p>
        <div className="mt-4 space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Paid:</span>
            <span className="text-sm font-medium text-green-600">
              {invoices.length > 0 ? invoices[0].currency : 'USD'} {paidAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Pending:</span>
            <span className="text-sm font-medium text-yellow-600">
              {invoices.length > 0 ? invoices[0].currency : 'USD'} {pendingAmount.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {invoices.slice(0, 3).map((invoice) => (
            <div key={invoice._id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</p>
                <p className="text-xs text-gray-500">
                  {userRole === 'provider' ? invoice.purchaser.name : invoice.provider.name}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {invoice.currency} {invoice.total.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">{invoice.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;

// // frontend/src/components/DashboardStats.js

// import React, { useMemo } from 'react'; // Import useMemo
// import { Doughnut, Bar } from 'react-chartjs-2';

// const DashboardStats = ({ invoices, userRole }) => {
//   // Calculate stats
//   const totalInvoices = invoices.length;
//   const pendingInvoices = invoices.filter(inv => inv.status === 'pending').length;
//   const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
//   const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;
//   const defaultedInvoices = invoices.filter(inv => inv.status === 'defaulted').length;
  
//   // Calculate total amount
//   const totalAmount = invoices.reduce((sum, inv) => sum + inv.total, 0);
//   const paidAmount = invoices
//     .filter(inv => inv.status === 'paid')
//     .reduce((sum, inv) => sum + inv.total, 0);
//   const pendingAmount = invoices
//     .filter(inv => inv.status === 'pending')
//     .reduce((sum, inv) => sum + inv.total, 0);
  
//   // Memoize the chart data for the doughnut chart
//   const statusData = useMemo(() => ({
//     labels: ['Pending', 'Paid', 'Overdue', 'Defaulted'],
//     datasets: [
//       {
//         data: [pendingInvoices, paidInvoices, overdueInvoices, defaultedInvoices],
//         backgroundColor: [
//           '#FCD34D', // yellow-300
//           '#34D399', // green-400
//           '#F87171', // red-400
//           '#9CA3AF', // gray-400
//         ],
//         borderWidth: 0,
//       },
//     ],
//   }), [pendingInvoices, paidInvoices, overdueInvoices, defaultedInvoices]); // Dependency array
  
//   // Memoize the chart data for the bar chart
//   const currencyData = useMemo(() => ({
//     labels: ['USD', 'UGX', 'LYD'],
//     datasets: [
//       {
//         label: 'Invoice Count',
//         data: [
//           invoices.filter(inv => inv.currency === 'USD').length,
//           invoices.filter(inv => inv.currency === 'UGX').length,
//           invoices.filter(inv => inv.currency === 'LYD').length,
//         ],
//         backgroundColor: '#3B82F6', // blue-500
//         borderColor: '#1D4ED8', // blue-700
//         borderWidth: 1,
//       },
//     ],
//   }), [invoices]); // Dependency array
  
//   return (
//     // ... the rest of your component JSX remains the same
//     // Just make sure you are using `statusData` and `currencyData` in your chart components
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//       {/* ... other stat cards ... */}
      
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Invoice Status</h3>
//         <div className="h-64">
//           <Doughnut data={statusData} options={{ maintainAspectRatio: false }} />
//         </div>
//       </div>
      
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Currency Distribution</h3>
//         <div className="h-64">
//           <Bar data={currencyData} options={{ maintainAspectRatio: false }} />
//         </div>
//       </div>
      
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Total Amount</h3>
//         <p className="text-3xl font-bold text-gray-900">
//           {invoices.length > 0 ? invoices[0].currency : 'USD'} {totalAmount.toFixed(2)}
//         </p>
//         <div className="mt-4 space-y-2">
//           <div className="flex justify-between">
//             <span className="text-sm text-gray-600">Paid:</span>
//             <span className="text-sm font-medium text-green-600">
//               {invoices.length > 0 ? invoices[0].currency : 'USD'} {paidAmount.toFixed(2)}
//             </span>
//           </div>
//           <div className="flex justify-between">
//             <span className="text-sm text-gray-600">Pending:</span>
//             <span className="text-sm font-medium text-yellow-600">
//               {invoices.length > 0 ? invoices[0].currency : 'USD'} {pendingAmount.toFixed(2)}
//             </span>
//           </div>
//         </div>
//       </div>
      
//       <div className="bg-white p-6 rounded-lg shadow-md">
//         <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
//         <div className="space-y-3">
//           {invoices.slice(0, 3).map((invoice) => (
//             <div key={invoice._id} className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</p>
//                 <p className="text-xs text-gray-500">
//                   {userRole === 'provider' ? invoice.purchaser.name : invoice.provider.name}
//                 </p>
//               </div>
//               <div className="text-right">
//                 <p className="text-sm font-medium text-gray-900">
//                   {invoice.currency} {invoice.total.toFixed(2)}
//                 </p>
//                 <p className="text-xs text-gray-500">{invoice.status}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardStats;