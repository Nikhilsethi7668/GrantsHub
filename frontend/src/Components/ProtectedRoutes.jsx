
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { motion } from 'framer-motion';

const ProtectedRoute = ({ element }) => {
    const { user, isAuthenticated, loading } = useContext(UserContext)
    if (loading) {
        return (
            <motion.div
                className="absolute inset-8 rounded-full bg-orange-500"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{
                    duration: 1.5,
                    repeat: Infinity
                }}
            />
        );
    }

    const token = isAuthenticated;
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return element;
};

export default ProtectedRoute;
