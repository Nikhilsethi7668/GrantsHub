import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import Axios from "../lib/axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { DownloadIcon } from "lucide-react";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [cancelling, setCancelling] = useState(false);

const generateInvoice = (payment) => {
  try {
    // Initialize jsPDF
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    // Add company heade
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text("Grantshub", 105, 20, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("Invoice", 105, 30, { align: "center" });
    
    // Add divider line
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

    // Payment table
    autoTable(doc, {  // Note the direct autoTable call
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
        fontStyle: "bold"
      },
      styles: {
        font: "helvetica",
        fontSize: 10
      }
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("Thank you for your business!", 105, 280, { align: "center" });
    doc.text("Grantshub - Your trusted partner", 105, 285, { align: "center" });

    // Save PDF
    doc.save(`invoice_${payment._id.slice(-8)}.pdf`);
  } catch (error) {
    console.error("Error generating invoice:", error);
    alert("Failed to generate invoice. Please try again.");
  }
};

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await Axios.get("/payment/history");
      setPayments(response.data.payments);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch payment history");
      setLoading(false);
    }
  };

  const handleCancelClick = (payment) => {
    setSelectedPayment(payment);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!selectedPayment) return;

    setCancelling(true);
    try {
      await Axios.post(`/payment/cancel/${selectedPayment._id}`);
      await fetchPayments();
      setCancelDialogOpen(false);
    } catch (err) {
      setError("Failed to cancel subscription");
    } finally {
      setCancelling(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "succeeded":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      case "cancelled":
        return "text-gray-500";
      default:
        return "text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Payment History</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {payments.map((payment) => (
          <div
            key={payment._id}
            className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">
                Payment #{payment._id.slice(-6)}
              </h3>
              <p className="text-gray-600 mb-2">
                Date: {format(new Date(payment.createdAt), "PPP")}
              </p>
              <p className="text-2xl font-bold mb-2">
                ${(payment.amount / 100).toFixed(2)}{" "}
                {payment.currency.toUpperCase()}
              </p>
              <p
                className={`font-medium mb-2 ${getStatusColor(payment.status)}`}
              >
                Status: {payment.status.toUpperCase()}
              </p>
              <p className="text-gray-600 mb-4">
                Payment Method: {payment.paymentMethod}
              </p>
              
             <div className="flex gap-2 justify-center items-center flex-col md:flex-row">
             <button
                onClick={() => generateInvoice(payment)}
                className="w-full bg-blue-50 text-blue-600 border flex justify-center items-center gap-2 border-blue-600 rounded-md px-4 py-2 hover:bg-blue-100 transition-colors"
              >
                <DownloadIcon className="w-6 h-6 mr-2" />Download invoice
              </button>
              {payment.isActive && (
                <button
                  onClick={() => handleCancelClick(payment)}
                  className="w-full bg-red-50 text-red-600 border border-red-600 rounded-md px-4 py-2 hover:bg-red-100 transition-colors"
                >
                  Cancel subscription
                </button>
              )}
             </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cancel Confirmation Modal */}
      {cancelDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Cancel Subscription</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel your subscription? This action
              cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setCancelDialogOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                No, Keep It
              </button>
              <button
                onClick={handleCancelConfirm}
                disabled={cancelling}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Yes, Cancel Subscription"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
