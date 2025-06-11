import { jsPDF } from "jspdf";
import "jspdf-autotable";

export const InvoiceButton = ({ payment }) => {
  const generateInvoice = () => {
    const doc = new jsPDF();
    
    // Add company logo and name
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("Grantshub", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("Invoice", 105, 30, { align: "center" });
    
    // Add a line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 35, 190, 35);
    
    // Invoice details
    doc.setFontSize(10);
    doc.text(`Invoice #: ${payment._id.slice(-8)}`, 20, 45);
    doc.text(`Date: ${new Date(payment.createdAt).toLocaleDateString()}`, 20, 50);
    doc.text(`Customer ID: ${payment.userId._id.slice(-8)}`, 20, 55);
    
    // Billing information
    doc.setFontSize(12);
    doc.text("Bill To:", 140, 45);
    doc.setFontSize(10);
    doc.text(payment.billingDetails.name, 140, 50);
    doc.text(payment.billingDetails.email, 140, 55);
    doc.text(
      `${payment.billingDetails.address.line1}, ${payment.billingDetails.address.city}`,
      140,
      60
    );
    
    // Payment details table
    doc.autoTable({
      startY: 70,
      head: [["Description", "Amount"]],
      body: [
        ["Subscription Payment", `${(payment.amount / 100).toFixed(2)} ${payment.currency.toUpperCase()}`],
        ["Payment Method", payment.paymentMethod],
        ["Status", payment.status.toUpperCase()],
        ["Transaction ID", payment.stripePaymentIntentId],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
      },
    });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for your business!", 105, 280, { align: "center" });
    doc.text("Grantshub - Your trusted partner", 105, 285, { align: "center" });
    
    // Save the PDF
    doc.save(`invoice_${payment._id.slice(-8)}.pdf`);
  };

  return (
    <button
      onClick={generateInvoice}
      className="w-full bg-blue-50 text-blue-600 border border-blue-600 rounded-md px-4 py-2 hover:bg-blue-100 transition-colors mt-4"
    >
      Download Invoice
    </button>
  );
};