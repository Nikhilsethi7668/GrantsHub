import React, { useContext, useState, useEffect } from "react";
import { HiMail, HiLockClosed, HiRefresh } from "react-icons/hi";
import { UserContext } from "../Context/UserContext";
import { motion } from "framer-motion";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import backgroundImage from '../assets/backgroundImage.jpg';

const VerifyEmail = () => {
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const { verifyEmail } = useContext(UserContext);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(30);


    useEffect(() => {
        let timer;
        if (resendDisabled && countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        } else if (countdown === 0) {
            setResendDisabled(false);
            setCountdown(30);
        }
        return () => clearInterval(timer);
    }, [resendDisabled, countdown]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (code.length !== 6) {
            setError("Verification code must be exactly 6 digits.");
            setIsSubmitting(false);
            return;
        }

        setError("");
        setSuccessMessage("");

        try {
            await verifyEmail({ code });
            setSuccessMessage("Email verified successfully! Redirecting...");
            setCode("");
        } catch (error) {
            setError(error.message || "Invalid or expired verification code.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = () => {
        setResendDisabled(true);
        // Add your resend logic here
        alert("Verification code resent to your email!");
    };

    const particlesInit = async (engine) => {
        await loadFull(engine);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative bg-white">
            {/* Main Content */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 z-10 mx-4"
            >
                <div className="p-10">
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mb-8"
                    >
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 1 }}
                            className="inline-block mb-4"
                        >
                            <HiMail className="h-16 w-16 mx-auto text-[#F06310] p-3 bg-orange-100 rounded-full" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-gray-800">Verify Your Email</h2>
                        <p className="mt-2 text-gray-600">
                            Enter the 6-digit code sent to your email
                        </p>
                    </motion.div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <motion.div
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="relative">
                                <input
                                    id="verification-code"
                                    name="code"
                                    type="text"
                                    required
                                    className={`w-full px-5 py-4 bg-gray-50 border ${error ? 'border-red-400' : 'border-gray-200'} rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F06310] focus:border-[#F06310]`}
                                    placeholder="Enter 6-digit code"
                                    value={code}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, ''); // Only allow digits
                                        setCode(value.slice(0, 6)); // Limit to 6 characters
                                        setError("");
                                    }}
                                    maxLength={6}
                                />
                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-500 text-sm mt-2"
                                    >
                                        {error}
                                    </motion.p>
                                )}
                                {successMessage && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-green-500 text-sm mt-2"
                                    >
                                        {successMessage}
                                    </motion.p>
                                )}
                            </div>
                        </motion.div>

                        <motion.button
                            whileHover={{ scale: isSubmitting ? 1 : 1.03 }}
                            whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
                            type="submit"
                            disabled={code.length !== 6 || isSubmitting}
                            className={`w-full py-4 px-6 rounded-lg font-medium text-white flex items-center justify-center space-x-2 ${code.length !== 6 || isSubmitting
                                ? 'bg-[#F06310]/80 cursor-not-allowed'
                                : 'bg-[#F06310] hover:bg-[#d8560b] shadow-lg'
                                } transition-all duration-300`}
                        >
                            <HiLockClosed className="h-5 w-5" />
                            <span>{isSubmitting ? 'Verifying...' : 'Verify Email'}</span>
                        </motion.button>
                    </form>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-6 text-center"
                    >
                        <button
                            onClick={handleResend}
                            disabled={resendDisabled}
                            className={`flex items-center justify-center space-x-1 text-sm font-medium ${resendDisabled
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-[#F06310] hover:text-[#d8560b]'
                                } transition-colors`}
                        >
                            <HiRefresh className={`h-4 w-4 ${resendDisabled ? '' : 'animate-spin-once'}`} />
                            <span>
                                {resendDisabled
                                    ? `Resend in ${countdown}s`
                                    : "Didn't receive code? Resend"}
                            </span>
                        </button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Floating bubbles decoration (optional) */}
            <div className="absolute bottom-0 left-0 right-0 h-20 overflow-hidden z-0">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{ y: 0, x: Math.random() * 100 }}
                        animate={{
                            y: [-20, window.innerHeight + 20],
                            x: [Math.random() * 100, Math.random() * 100]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="absolute rounded-full bg-[#F06310]/10 border border-[#F06310]/20"
                        style={{
                            width: `${Math.random() * 20 + 10}px`,
                            height: `${Math.random() * 20 + 10}px`,
                            left: `${Math.random() * 100}%`
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default VerifyEmail;
