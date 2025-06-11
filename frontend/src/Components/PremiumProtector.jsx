import React, { useContext } from "react";
import { Navigate } from "react-router-dom"; // Ensure Navigate is imported
import { UserContext } from "../Context/UserContext";
import { BusinessContext } from "../Context/BusinessContext";
import { motion } from "framer-motion";
function PremiumProtectRoute({ element }) {
    const { user, loading } = useContext(UserContext);
    const { businessDetails } = useContext(BusinessContext);
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
    // If user is not authenticated or doesn't have a paid subscription, redirect to the 'get-premium' page
    if (!user?.isPaid && !user?.admin) {
        return <Navigate to="/payment" replace />;
    }

    // If user is authenticated but business details are missing, redirect to the 'add-business-details' page


    // Render the provided element if all checks pass
    return element;
}

export default PremiumProtectRoute;
