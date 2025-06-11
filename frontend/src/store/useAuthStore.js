// src/services/authService.js
import Axios from "../lib/axios";
import { Navigate } from "react-router-dom";

// Signup function
export const signup = async (data) => {
  try {
    const response = await Axios.post("/auth/signup", data, {
      // withCredentials: true,
    });

    // No need to manually store the token since it's in the cookie
    return response;
  } catch (error) {
    console.error(
      "Error during signup:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Login function
export const login = async (data) => {
  try {
    const response = await Axios.post("/auth/login", data, {
      withCredentials: true, // Ensures cookies are sent with the request
    });

    return response;
  } catch (error) {
    console.error("Error during login:", error.response?.data || error.message);
    throw error;
  }
};

// Logout function
export const logout = async () => {
  try {
    const response = await Axios.post("/auth/logout", {}, { withCredentials: true });
    return response; // Return response instead of showing alert
  } catch (error) {
    console.error(
      "Error during logout:",
      error.response?.data || error.message
    );
    throw error; // Throw the error to be handled by the caller
  }
};

// Check authentication (verify cookie)
export const checkAuth = async () => {
  try {
    const response = await Axios.get("/auth/verify", { withCredentials: true });
    console.log(response);
    return response; // Returns respnse data if authenticated
  } catch (error) {
    console.error(
      "Error checking authentication:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const uploadBusinessDetails = async (id, businessData) => {
  try {
    const response = await Axios.post(
      `/business/business-form/${id}`,
      businessData
    );
    console.log("Business details uploaded successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error uploading business details:", error.message);
    throw error;
  }
};
export const getBusinessData = async (id) => {
  try {
    const response = await Axios.get(`/business/${id}`); // Ensure cookies are sent if required
    console.log("Fetched business data successfully:", response.data);
    return response; // Returns the complete response object
  } catch (error) {
    console.error(
      "Error fetching business details:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// export const fetchGrants = async () => {
//   try {
//     const response = await Axios.get("/grants/get-grants", {
//       timeout: 10000, // 10 seconds timeout
//     });
//     console.log("Fetched grants successfully:", response.data);
//     return response.data.data[0].OpportunitySynopsisDetail_1_0; // Return the actual data
//   } catch (error) {
//     console.error("Error while fetching grants:", error.message);
//     // alert(error.message); // Display the error message
//     throw error;
//   }
// };

// import Axios from "axios";

// Updated fetchMatchedGrantsAPI function that includes filters
export const fetchMatchedGrantsAPI = async (userId, filters = {}) => {
  try {
    // Construct query parameters from filters
    const params = new URLSearchParams();
    
    // Only add filters that have values
    if (filters.sector) params.append('sector', filters.sector);
    if (filters.fundingType) params.append('fundingType', filters.fundingType);
    if (filters.maxAmount) params.append('maxAmount', filters.maxAmount);
    if (filters.region) params.append('region', filters.region);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.limit) params.append('limit', filters.limit);

    const response = await Axios.get(`/grants/recommended-grants/${userId}?${params.toString()}`, {
      timeout: 60000,
    });

    console.log("Matched grants fetched successfully:", response.data);
    return response.data; // Return the full response data
  } catch (error) {
    console.error("Error while fetching matched grants:", error.message);
    throw error;
  }
};

export const verifyEmail = async (data) => {
  try {
    const response = await Axios.post("/auth/verify-email", data);
    return response;
  } catch (error) {
    console.error("Error while verifying email:", error.message);
    throw error;
  }
};

export const forgotPassword = async (data) => {
  try {
    const response = await Axios.post("/auth/forgot-password", data);
    return response;
  } catch (error) {
    console.error("Error while forgot password:", error.message);
    throw error;
  }
};

export const getAllUsers = async () => {
  try {
    const response = await Axios.get("/auth/get-all-users");
    console.log("All users fetched successfully:", response.data);
    return response;
  } catch (error) {
    console.error("Error while fetching all users:", error.message);
    return error;
  }
};

export const deleteUser = async (userId) => {
  try {
    const response = await Axios.delete(`/auth/delete-user/${userId}`);
    return response;
  } catch (error) {
    console.error("Error while deleting user:", error.message);
    throw error;
  }
};
