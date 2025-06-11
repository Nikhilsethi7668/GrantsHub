import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import { UserContext } from "./UserContext";
import { fetchMatchedGrantsAPI } from "../store/useAuthStore";
import { BusinessContext } from "./BusinessContext";

export const GrantsContext = createContext();

export const GrantsContextProvider = ({ children }) => {
    const [matchedGrants, setMatchedGrants] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const { user } = useContext(UserContext);
    const { businessDetails } = useContext(BusinessContext);

    const fetchMatchedGrants = useCallback(async (filters = {}) => {
        if (!user || !businessDetails) {
            console.warn("User or business details are not available");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const matchedGrantsResponse = await fetchMatchedGrantsAPI(
                user._id,
                {
                    sector: filters.sector,
                    fundingType: filters.fundingType,
                    maxAmount: filters.maxAmount,
                    region: filters.region,
                    sortBy: filters.sortBy,
                    sortOrder: filters.sortOrder,
                    limit: filters.limit
                }
            );

            // Transform the response to match our frontend format
            const grants = matchedGrantsResponse.data.rawResponse.grants.map(grant => ({
                programName: grant.programName,
                description: grant.description,
                maxAmount: grant.maxAmount,
                percentCovered: grant.percentCovered,
                sectors: grant.sectors,
                region: grant.region,
                fundingType: grant.fundingType,
                deadline: grant.deadline,
                link: grant.link,
                score: grant.score,
            }));

            // added by shohail
             grants.sort((a, b) => {
            const valA = a['score'];
            const valB = b['score'];

            if (valA === undefined || valB === undefined) return 0;

            return filters.sortOrder === "asc" ? valA - valB : valB - valA; 
        });

            setMatchedGrants(grants);
            console.log("Matched grants2222:", grants);
        } catch (error) {
            console.error(`Error fetching matched grants for user ${user._id}:`, error);
            setError(error.message || "Failed to fetch grants");
        } finally {
            setIsLoading(false);
        }
    }, [user, businessDetails]);

    // Fetch grants when business details are available
    useEffect(() => {
        if (user && businessDetails) {
            fetchMatchedGrants();
        }
    }, [businessDetails]);

    // Context value
    const contextValue = {
        matchedGrants,
        fetchMatchedGrants,
        isLoading,
        error
    };

    return (
        <GrantsContext.Provider value={contextValue}>
            {children}
        </GrantsContext.Provider>
    );
};