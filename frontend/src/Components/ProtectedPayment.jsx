import React, { useContext } from 'react'
import { UserContext } from '../Context/UserContext'
import { Navigate } from 'react-router-dom';
import { PaymentContext } from '../Context/PaymentContext';
import { motion } from "framer-motion"
const ProtectedPayment = ({ element }) => {
    const { user, isAuthenticated, loading } = useContext(UserContext);
    const { paymentInProgress } = useContext(PaymentContext);

    // Wait until loading is complete to make sure the user data is available
    if (loading) {
        return <motion.div
            className="absolute inset-8 rounded-full bg-orange-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
                duration: 1.5,
                repeat: Infinity
            }}
        />; // Or any loading indicator you prefer
    }

    // If user is not authenticated or user data is null, redirect to login
    if (user === null || !isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // If the user is paid, redirect to home page
    const paid = user.isPaid;
    if (paid) {
        // console.log("paid")
        return <Navigate to="/" replace />
    }

    else {
        return element
    }
}

export default ProtectedPayment;
