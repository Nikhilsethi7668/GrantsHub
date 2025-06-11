import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircle } from 'lucide-react';
import { PaymentContext } from '../Context/PaymentContext';

const PurchaseCancel = () => {
  const navigate = useNavigate();
  const { setPaymentInProgress } = useContext(PaymentContext)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Cancelled</h2>
        <p className="text-gray-600 mb-6">
          Your payment was cancelled. No charges were made to your account.
        </p>
        <div className="space-y-4">
          <button
            onClick={() => navigate('/payment')}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition duration-200 w-full"
          >
            Try Again
          </button>
          <button
            onClick={() => {
              setPaymentInProgress(false)
              navigate('/')
            }}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md hover:bg-gray-300 transition duration-200 w-full"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseCancel;