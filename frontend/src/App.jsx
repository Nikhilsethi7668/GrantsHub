import React, { useContext } from "react";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Page Components
import Dashboard from "./pages/Dashboard";
import Signin from "./pages/Signin";
import Registration from "./pages/Registration";
import ForgotPassword from "./pages/ResetPassword";
import BusinessRegistration from "./pages/AddBusinessDetails";
import AboutGrants from "./pages/Grants";
import HowItWorks from "./pages/Works";
import AboutUs from "./pages/About";
import Contact from "./pages/Contact";
import Layout from "./Layouts/Layout";
import PaymentPage from "./pages/paymentPage";
import CheckoutPage from "./pages/checkoutPage.jsx";
import PurchaseSuccess from "./pages/purchaseSuccess.jsx";
import PurchaseCancel from "./pages/purchaseCancel.jsx";
import AddGrants from "./pages/addGrants.jsx";

import { UserContext } from "./Context/UserContext";
import ProtectedRoute from "./Components/ProtectedRoutes";
import ProtectedPayment from "./Components/ProtectedPayment";
import ProfileLayout from "./pages/profile/ProfileLayout";
import MyProfile from "./pages/profile/MyProfile";
import ExploreFunding from "./pages/profile/ExploreFunding";
import Logout from "./pages/profile/Logout";

import Home from "./pages/profile/Home";
import PremiumProtectRoute from "./Components/PremiumProtector";
import VerifyEmail from "./pages/VerifyEmail.jsx";
import ProtectedAdmin from "./Components/ProtectedAdmin.jsx";
import ManageUsers from "./pages/Admin/ManageUsers.jsx";
import UpdatePassword from "./pages/UpdatePassword.jsx";
import ProtectedRouteWithBusiness from "./Components/PrortectedRouteBusiness";
import FundingPreview from "./pages/Admin/Preview.jsx";
import PaymentHistory from "./Components/PaymentHistory.jsx";

// Stripe configuration
const stripePromise = loadStripe(
  "pk_live_51O9WLWCUcnLOCBA6qB87zOZ8ZuxFjZJeztSD2yzhPXLi53JOdjriWisqKLhYw1JK0eTiX9yEKzfdaRFSlhDUGyX2007tqYkyqF"
);
const stripeOptions = {
  appearance: {
    theme: "stripe",
  },
};

const App = () => {
  const { user } = useContext(UserContext);

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Routes that require the layout (Navbar and Footer) */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/grants" element={<AboutGrants />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Signin />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/verifyemail" element={<VerifyEmail />} />
      </Route>

      {/* Routes without layout */}

      {/* Add Business Details - No restriction */}
      <Route
        path="/add-business-details"
        element={<ProtectedRoute element={<BusinessRegistration />} />}
      />

     <Route path="/preview" element={<ProtectedRouteWithBusiness
            element={<FundingPreview />}/>} />

      {/* Payment routes */}
      <Route
        path="/payment"
        element={
          <ProtectedRouteWithBusiness
            element={
              <Elements stripe={stripePromise} options={stripeOptions}>
                <PaymentPage />
              </Elements>
            }
          />
        }
      />
      <Route
        path="/checkout-success"
        element={<ProtectedPayment element={<CheckoutPage />} />}
      />
      <Route
        path="/purchase-success"
        element={<ProtectedPayment element={<PurchaseSuccess />} />}
      />
      <Route
        path="/purchase-cancel"
        element={<ProtectedPayment element={<PurchaseCancel />} />}
      />

      {/* Admin-Only Route */}
      <Route
        path="/add-grants"
        element={<ProtectedAdmin element={<AddGrants />} />}
      />

      {/* Nested Routes for /home */}
      <Route
        path="/profile"
        element={<PremiumProtectRoute element={<ProfileLayout />} />}
      >
        <Route index element={<Home />} />
        <Route path="explore-funding" element={<ExploreFunding />} />
       
        <Route path="my-profile" element={<MyProfile />} />
        <Route path="payment-history" element={<PaymentHistory />} />
        <Route path="logout" element={<Logout />} />
        <Route
          path="admin/manage-users"
          element={<ProtectedAdmin element={<ManageUsers />} />}
        />
      </Route>
      <Route path="/reset-password/:token" element={<UpdatePassword />} />
    </Routes>
  );
};

export default App;
