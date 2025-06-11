import React, { createContext, useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { getBusinessData, uploadBusinessDetails } from "../store/useAuthStore";

export const BusinessContext = createContext();

const BusinessProvider = ({ children }) => {
    const [businessDetails, setBusinessDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            fetchBusinessData(user._id);
        }
    }, [user]);

    const fetchBusinessData = async (id) => {
        try {
            setLoading(true);
            const response = await getBusinessData(id);            
            const fetchedData = response?.data?.businessdetails[0] || null;            
            setBusinessDetails(fetchedData);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch business data");
        } finally {
            setLoading(false);
        }
    };

    const handleUploadBusinessDetails = async (id, businessData) => {
        try {
            setLoading(true);
            const response = await uploadBusinessDetails(id, businessData);
            await fetchBusinessData(user._id); // Refresh business data
            return response;
        } catch (err) {
            setError(err.response?.data?.message || "Failed to upload business data");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearBusinessData = () => {
        setBusinessDetails(null);
    };

    return (
        <BusinessContext.Provider
            value={{
                businessDetails,
                setBusinessDetails,
                loading,
                error,
                fetchBusinessData,
                handleUploadBusinessDetails,
                clearBusinessData,
            }}
        >
            {children}
        </BusinessContext.Provider>
    );
};

export default BusinessProvider;
