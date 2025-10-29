import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ExportInvoice = ({ invoiceId }) => {
  const handleExport = async () => {
    const element = document.getElementById('invoice-content');
    
    try {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save(`invoice-${invoiceId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <button
      onClick={handleExport}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Export as PDF
    </button>
  );
};

export default ExportInvoice;