import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import api from '../lib/axios';
import Confetti from 'react-confetti';
import { PaymentContext } from '../Context/PaymentContext';

const PurchaseSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { setPaymentInProgress, paymentInProgress } = useContext(PaymentContext)

  useEffect(() => {
    const confirmPayment = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        if (!sessionId) {
          setError('Invalid session ID');
          return;
        }

        await api.post('/payment/checkout-success', { sessionId });
        setLoading(false);
      } catch (error) {
        console.error('Payment confirmation failed:', error);
        setError('Failed to confirm payment');
        setLoading(false);
      }
    };

    confirmPayment();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => navigate('/payment')}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Confetti />
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your payment. You now have full access to our grants database.
        </p>
        <button
          onClick={() => {
            setPaymentInProgress(false)
            window.location.reload();

            // alert("now pymntprgrss is ", paymentInProgress)

            navigate('/grants')
          }
          }
          className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition duration-200"
        >
          View Grants Database
        </button>
      </div>
    </div>
  );
};

export default PurchaseSuccess;
