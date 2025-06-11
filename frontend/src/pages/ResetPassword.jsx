import React, { useContext, useState, useEffect } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import { NavLink } from "react-router-dom";
import { UserContext } from "../Context/UserContext";
import { motion } from "framer-motion";

// Replace with your actual image path
const backgroundImage = 'https://images.unsplash.com/photo-1743275062435-70cf579d90e5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const ForgotPassword = () => {
    const { forgotPassword } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [countdown, setCountdown] = useState(300);

    useEffect(() => {
        let timer;
        if (isButtonDisabled && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setIsButtonDisabled(false);
        }
        return () => clearInterval(timer);
    }, [isButtonDisabled, countdown]);

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email address")
            .required("Email is required"),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        setLoading(true);
        setError("");
        setSuccessMessage("");
        try {
            await forgotPassword(values);
            setSuccessMessage("Password reset link sent to your email!");
            setIsButtonDisabled(true);
            setCountdown(300);
        } catch (error) {
            setError(error.message || "Failed to send reset link. Please try again.");
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    const formatCountdown = () => {
        const minutes = Math.floor(countdown / 60);
        const seconds = countdown % 60;
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-white">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 p-8"
            >
                <motion.div
                    initial={{ y: -20 }}
                    animate={{ y: 0 }}
                    className="text-center mb-8"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 mx-auto text-[#F06310] mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <h2 className="text-3xl font-bold text-gray-800">Reset Password</h2>
                    <p className="mt-2 text-gray-600">
                        Enter your email to receive a reset link
                    </p>
                </motion.div>

                <Formik
                    initialValues={{ email: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-6">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F06310] focus:border-[#F06310]"
                                    placeholder="your@email.com"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-red-500 text-sm mt-1"
                                />
                            </motion.div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {successMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-3 bg-green-50 text-green-600 rounded-lg text-sm border border-green-100"
                                >
                                    {successMessage}
                                </motion.div>
                            )}

                            <motion.button
                                whileHover={{ scale: isButtonDisabled ? 1 : 1.02 }}
                                whileTap={{ scale: isButtonDisabled ? 1 : 0.98 }}
                                type="submit"
                                disabled={isSubmitting || loading || isButtonDisabled}
                                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all shadow-md ${loading || isButtonDisabled
                                    ? 'bg-[#F06310]/80 cursor-not-allowed'
                                    : 'bg-[#F06310] hover:bg-[#d8560b]'
                                    }`}
                            >
                                {loading
                                    ? "Sending..."
                                    : isButtonDisabled
                                        ? `Resend in ${formatCountdown()}`
                                        : "Send Reset Link"}
                            </motion.button>
                        </Form>
                    )}
                </Formik>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 text-center text-gray-600 text-sm"
                >
                    Remember your password?{" "}
                    <NavLink
                        to="/login"
                        className="text-[#F06310] hover:underline font-medium"
                    >
                        Sign in
                    </NavLink>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;