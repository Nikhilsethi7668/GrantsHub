import React, { useContext, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { UserContext } from '../Context/UserContext';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

// Replace with your actual image path
const backgroundImage = 'https://images.unsplash.com/photo-1743275062435-70cf579d90e5?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

const validationSchema = Yup.object({
  firstName: Yup.string()
    .required('First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name cannot be longer than 50 characters'),
  lastName: Yup.string()
    .required('Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name cannot be longer than 50 characters'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password cannot be longer than 20 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const RegistrationPage = () => {
  const { signup, verifyEmail } = useContext(UserContext);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      const response = await signup(values); // response me OTP aayega
      if (response && response.otp) {
        console.log('OTP:', response.otp); // OTP console me print hoga
      }
      setRegistrationSuccess(true);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerification = async (values) => {
    setIsSubmitting(true);
    try {
      await verifyEmail(values);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-sans bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200"
      >
        <div className="flex flex-col lg:flex-row">
          {/* Left Side - Features */}
          <div className="lg:w-1/2 p-8 bg-[#F06310] text-white">
            <motion.h1
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              className="text-3xl font-bold mb-6"
            >
              Join GrantsHub
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-8"
            >
              Create your account to access exclusive funding opportunities.
            </motion.p>

            <div className="space-y-5">
              <motion.div
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <FeatureCard
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                  title="Easy Applications"
                  description="Streamlined process for multiple grants"
                  iconColor="text-white"
                />
              </motion.div>

              <motion.div
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <FeatureCard
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                  title="Secure Platform"
                  description="Your data is always protected"
                  iconColor="text-white"
                />
              </motion.div>

              <motion.div
                initial={{ x: -20 }}
                animate={{ x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <FeatureCard
                  icon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  }
                  title="Fast Access"
                  description="Immediate access to all features"
                  iconColor="text-white"
                />
              </motion.div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="lg:w-1/2 bg-white p-8">
            {registrationSuccess ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Verify Your Email</h2>
                <p className="mb-6 text-gray-600">We've sent a 6-digit code to your email</p>

                <Formik
                  initialValues={{ code: '' }}
                  validationSchema={Yup.object({
                    code: Yup.string()
                      .required('Verification code is required')
                      .length(6, 'Code must be 6 characters')
                  })}
                  onSubmit={handleVerification}
                >
                  <Form className="space-y-4">
                    <div>
                      <Field
                        name="code"
                        type="text"
                        placeholder="Enter 6-digit code"
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F06310] focus:border-[#F06310]"
                      />
                      <ErrorMessage name="code" component="div" className="text-red-500 text-sm mt-1" />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full py-3 px-4 bg-[#F06310] hover:bg-[#d8560b] text-white rounded-lg transition shadow-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isSubmitting ? 'Verifying...' : 'Verify Account'}
                    </motion.button>
                  </Form>
                </Formik>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Account</h2>

                <Formik
                  initialValues={{
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    confirmPassword: ''
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleSubmit}
                >
                  {() => (
                    <Form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Field
                            name="firstName"
                            type="text"
                            placeholder="First name"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F06310] focus:border-[#F06310]"
                          />
                          <ErrorMessage name="firstName" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                        <div>
                          <Field
                            name="lastName"
                            type="text"
                            placeholder="Last name"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F06310] focus:border-[#F06310]"
                          />
                          <ErrorMessage name="lastName" component="div" className="text-red-500 text-sm mt-1" />
                        </div>
                      </div>

                      <div>
                        <Field
                          name="email"
                          type="email"
                          placeholder="Email address"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F06310] focus:border-[#F06310]"
                        />
                        <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <Field
                          name="password"
                          type="password"
                          placeholder="Password"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F06310] focus:border-[#F06310]"
                        />
                        <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <div>
                        <Field
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm password"
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F06310] focus:border-[#F06310]"
                        />
                        <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full py-3 px-4 bg-[#F06310] hover:bg-[#d8560b] text-white rounded-lg transition shadow-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {isSubmitting ? 'Creating Account...' : 'Register'}
                      </motion.button>
                    </Form>
                  )}
                </Formik>

                <div className="mt-6 text-center text-gray-600 text-sm">
                  Already have an account?{' '}
                  <NavLink
                    to="/login"
                    className="text-[#F06310] hover:underline font-medium"
                  >
                    Sign in
                  </NavLink>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="flex items-start space-x-3 p-4 bg-white/10 rounded-lg border border-white/20 hover:bg-white/15 transition-colors">
    <div className="mt-1 text-purple-200">{icon}</div>
    <div>
      <h3 className="font-medium text-white">{title}</h3>
      <p className="text-sm text-white/80">{description}</p>
    </div>
  </div>
);

export default RegistrationPage;