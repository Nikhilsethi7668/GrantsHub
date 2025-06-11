import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard } from 'lucide-react';
import Axios from '../lib/axios';
import { UserContext } from '../Context/UserContext';
import { PaymentContext } from '../Context/PaymentContext';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { paymentInProgress, setPaymentInProgress } = useContext(PaymentContext);
  useEffect(() => {
    setPaymentInProgress(true);


  }, [])



  const { user } = useContext(UserContext)

  const handlePayment = async () => {
    try {
      setPaymentInProgress(true)
      setLoading(true);
      console.log("paymentinProgress is", paymentInProgress)
      setError('');
      // const {user} = useContext(UserContext);

      // Get the token from localStorage
      const token = user;

      if (!token) {
        setError('Please log in to continue with payment');
        console.log('NO TOKEN found');

        navigate('/login', { state: { from: '/payment' } });
        alert(error)
        setPaymentInProgress(false)


        return;
      }

      const response = await Axios.post('/payment/create-checkout-session', {}
      );

      const { id: sessionId } = response.data;
      console.log("response is", response)

      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      if (stripe) {
        const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
        if (stripeError) {
          setError(stripeError.message);
          setPaymentInProgress(false)
        }
      }
    } catch (error) {
      console.error('Payment initiation failed:', error);
      if (error.response?.status === 401) {
        setError('Please log in to continue with payment');
        // navigate('/login', { state: { from: '/payment' } });
        setPaymentInProgress(false)
      } else {
        setError(error.response?.data?.message || 'Failed to initiate payment. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  if (!paymentInProgress) {
    return (
      <h1>Loading.......</h1>

    )
  }

  return (

    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
  <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <CreditCard className="h-12 w-12 text-[#F06310]" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900">Enrollment Fee</h2>
      <p className="mt-2 text-gray-600">Get access to our comprehensive grants database</p>
    </div>

    <div className="border-t border-b border-gray-200 py-4 my-6">
      <div className="flex justify-between items-center">
        <span className="text-gray-600">Enrollment Fee</span>
        <span className="text-lg font-semibold">CAD $120.00</span>
      </div>
    </div>

    {error && (
      <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
        {error}
      </div>
    )}

    <div className="space-y-4">
      <button
        onClick={handlePayment}
        disabled={loading}
        className={`w-full bg-[#F06310] text-white py-3 px-4 rounded-md hover:bg-[#d8560b] transition duration-200 flex items-center justify-center space-x-2 ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? (
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
        ) : (
          <>
            <CreditCard className="h-5 w-5" />
            <span>Pay with Stripe</span>
          </>
        )}
      </button>
    </div>

    <p className="mt-4 text-sm text-gray-500 text-center">
      Secure payment processed by Stripe
    </p>
  </div>
</div>
  );
};

export default PaymentPage;