import React, { useContext } from 'react'
import { UserContext } from '../Context/UserContext';
import { Navigate } from 'react-router-dom';
import { motion } from "framer-motion"

const ProtectedAdmin = ({ element }) => {
    const { user, loading } = useContext(UserContext);
    if (loading) {
        return <motion.div
            className="absolute inset-8 rounded-full bg-orange-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
                duration: 1.5,
                repeat: Infinity
            }}
        />;
    }
    if (!user?.admin) {
        return <Navigate to="/" replace />;
    }

    return element;
}

export default ProtectedAdmin
