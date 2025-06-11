import React, { createContext, useState, useEffect, useContext } from "react";
import {
  checkAuth,
  login as loginService,
  logout as logoutService,
  signup as signupService,
  verifyEmail as verifyEmailService,
  forgotPassword as forgotPasswordService,
  getAllUsers as getAllUsersService,
} from "../store/useAuthStore";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook
import { BusinessContext } from "./BusinessContext";
import { toast } from "react-toastify";
// import { useAuthStore } from "../store/useAuthStore";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  // const { businessDetails } = useContext(BusinessContext)

  // Check if user is authenticated on app load
  useEffect(() => {
    const verifyUser = async () => {
      setLoading(true);
      try {
        const response = await checkAuth();
        if (response?.data?.authenticated) {
          setUser(response?.data?.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error verifying user:", error);
        setUser(null);

        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    verifyUser();
  }, []);

  // Login function
  const login = async (credentials) => {
    setLoading(true);
    try {
      const response = await loginService(credentials);
      if (response.data.success) {
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      } else {
        toast.error(response.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
      return;
    } catch (error) {
      if (error.response?.data.reverify) {
        toast.error("Please verify your email to login", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        navigate("/verifyemail");
        return;
      }
 toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      console.error("Login failed:", error);
      setError("Login failed. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    setLoading(true);
    try {
      await logoutService();
      setUser(null);
      setIsAuthenticated(false);
      toast.success("Logged out successfully", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      navigate("/"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error("Failed to logout. Please try again.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } finally {
      setLoading(false);
    }
  };

    // Signup function
    const signup = async (userData) => {
        setLoading(true);
        try {
            // console.log("User data for signup:", userData);
            // alert("User data for signup:");
            const response = await signupService(userData);
            setUser(response.data.user);
            alert("Signed up successfully")
        } catch (error) {
            alert(error.response.data.message)
            console.error("Signup failed:", error);
            setError("Signup failed. Please try again.");
            throw error;
        } finally {
            setLoading(false);
        }
    };
    const verifyEmail = async (data) => {
        setLoading(true);
        try {
            const response = await verifyEmailService(data);
            console.log("Verify email response:", response);
            if (response.data.success) {
                alert("Logged in successfully");
                navigate("/");
                setIsAuthenticated(true);

            } else {
                alert("Email verification failed. Please try again.");
            }

        }
        catch (error) {
            console.error("Verify email failed:", error);
            setError("Verify email failed. Please try again.");
            throw error;
        } finally {
            setLoading(false);
        }
    }
    const getAllUsers = async () => {
        setLoading(true);
        try {
            if (user?.admin) {
                const response = await getAllUsersService();
                console.log("All users fetched successfully:", response.data.allUsers);
                setAllUsers(response.data.allUsers);
            }
            else {
                setError("You are not authorized to access this page.");
                throw new Error("You are not authorized to access this page.");
            }
        }
        catch (error) {
            console.error("Error while fetching all users:", error.message);
            setError("Error while fetching all users. Please try again.");
            throw error;
        }
    }
    const forgotPassword = async (data) => {
        setLoading(true);
        try {
            const response = await forgotPasswordService(data);
            console.log("Forgot password response:", response);
        }
        catch (error) {
            console.error("Forgot password failed:", error);
            setError("Forgot password failed. Please try again.");
            throw error;
        } finally {
            setLoading(false);
        }
    }
    return (
        <UserContext.Provider value={{ user, forgotPassword, verifyEmail, isAuthenticated, loading, error, login, logout, signup, getAllUsers, allUsers }}>
            {children}
        </UserContext.Provider>
    );
};
