import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { BusinessContext } from "../Context/BusinessContext";
import { motion } from "framer-motion";

function ProtectedRouteWithBusiness({ element }) {
    const { user, loading: userLoading } = useContext(UserContext);
    const { businessDetails, loading: businessLoading } = useContext(BusinessContext);

    if (userLoading || businessLoading) {
        return <motion.div
            className="absolute inset-8 rounded-full bg-orange-500"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{
                duration: 1.5,
                repeat: Infinity
            }}
        />;
    }

    console.log("bussiness detial", businessDetails, businessLoading, userLoading);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!businessDetails || !user?.admin) {
        return <Navigate to="/add-business-details" replace />;
    }

    return element;
}

export default ProtectedRouteWithBusiness;
