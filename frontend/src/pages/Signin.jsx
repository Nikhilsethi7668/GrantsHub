import React, { useContext, useState, useEffect } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from '../Context/UserContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';
import backgroundImage from '../assets/backgroundImage.jpg';

const validationSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

const SignIn = () => {
    const { login, loading, user, logout, isAuthenticated } = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (data, resetForm) => {
        try {
            await login(data);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        } catch (error) {
            console.error('Login error:', error);
            setErrorMessage('Invalid email or password');
            resetForm();
        }
    };

    if (!loading&&isAuthenticated) {
         navigate('/');
        return (
            <div className="min-h-screen flex items-center justify-center p-4 font-sans bg-white mt-8">
                <div className="max-w-md w-full bg-white p-10 rounded-xl border border-gray-200 text-center shadow-lg">
                    <h1 className="text-4xl font-bold mb-6 font-['Poppins'] text-gray-800">Welcome back!</h1>
                    <p className="mb-8 text-gray-600">You're already logged in as {user.name || 'User'}</p>
                    <button
                        onClick={logout}
                        className="w-full py-3 px-4 bg-[#F06310] hover:bg-[#d8560b] rounded-lg font-medium text-white transition-all duration-300 shadow-md"
                    >
                        Log out
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center mt-8 bg-white" style={{
            fontFamily: "'Poppins', sans-serif"
        }}>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-md w-full bg-white p-10 rounded-xl border border-gray-200 shadow-lg"
            >
                <h1 className="text-4xl font-bold text-gray-800 text-center mb-10">Login</h1>

                <Formik
                    initialValues={{ email: '', password: '' }}
                    validationSchema={validationSchema}
                    onSubmit={(data, { resetForm }) => {
                        const formattedData = { ...data, email: data.email.toLowerCase() };
                        handleLogin(formattedData, resetForm);
                    }}
                >
                    {({ isSubmitting }) => (
                        <Form className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <Field
                                    id="email"
                                    name="email"
                                    type="email"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F06310]/50 focus:border-[#F06310]/50 text-gray-800 placeholder-gray-400"
                                    placeholder="your@email.com"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-red-500 text-xs mt-2"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <NavLink
                                        to="/forgot"
                                        className="text-xs text-[#F06310] hover:underline"
                                    >
                                        Forgot password?
                                    </NavLink>
                                </div>
                                <Field
                                    id="password"
                                    name="password"
                                    type="password"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F06310]/50 focus:border-[#F06310]/50 text-gray-800 placeholder-gray-400"
                                    placeholder="••••••••"
                                />
                                <ErrorMessage
                                    name="password"
                                    component="div"
                                    className="text-red-500 text-xs mt-2"
                                />
                            </div>

                            {errorMessage && (
                                <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
                                    {errorMessage}
                                </div>
                            )}

                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-[#F06310] focus:ring-[#F06310] border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-700"
                                >
                                    Remember me
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || loading}
                                className={`w-full py-3 px-4 rounded-lg font-medium text-white ${loading
                                        ? 'bg-[#F06310]/80 cursor-not-allowed'
                                        : 'bg-[#F06310] hover:bg-[#d8560b]'
                                    } transition-all duration-300 shadow-md`}
                            >
                                {loading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </Form>
                    )}
                </Formik>

                <div className="mt-8 text-center text-gray-600 text-sm">
                    Don't have an account?{' '}
                    <NavLink
                        to="/register"
                        className="text-[#F06310] hover:underline font-medium"
                    >
                        Sign up
                    </NavLink>
                </div>
            </motion.div>
        </div>
    );
};

export default SignIn;