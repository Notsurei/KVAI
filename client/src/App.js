import React from "react";
import { Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Login from "./pages/login/Login";
import ForgotPass from "./pages/ForgotPass/ForgotPass";
import ResetPass from "./pages/ResetPass/ResetPass";
import Dashboard from "./pages/Dashboard/Dashboard";
import Home from "./pages/Home/Home";
import Register from "./pages/register/Register";
import AboutUs from "./pages/About/AboutUs";
import NavBar from "./components/Navbar";
import AuthRoute from "./Context/AuthRoute";
import Generate from "./pages/Generate/Generate";
import Error from "./pages/Error/Error";
import Plans from "./pages/Plans/Plans";
import FreePlanSignup from "./pages/StripePayment/FreePlanSignup";
import CheckoutForm from './pages/StripePayment/CheckoutForm';
import PaymentSuccess from "./pages/StripePayment/PaymentSuccess";

const Layout = ({ children }) => (
  <>
    <NavBar />
    {children}
  </>
);

function App() {
  return (
    <main data-theme="dracula">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPass />} />
        <Route path="/resetpassword" element={<ResetPass />} />
        <Route path="/dashboard" element={<AuthRoute><Layout><Dashboard/></Layout></AuthRoute>} />
        <Route path="/about" element={<Layout><AboutUs/></Layout>} />
        <Route path="/generate" element={<AuthRoute><Layout><Generate/></Layout></AuthRoute>} />
        <Route path="/" element={<Layout><Home/></Layout>} />
        <Route path="/pricing" element={<AuthRoute><Layout><Plans/></Layout></AuthRoute>}/>
        <Route path="/free-plan-sign-up" element={<AuthRoute><Layout><FreePlanSignup/></Layout></AuthRoute>}/>
        <Route path="/checkout/:plan" element={<AuthRoute><Layout><CheckoutForm/></Layout></AuthRoute>}/>
        <Route path="/success" element={<AuthRoute><Layout><PaymentSuccess/></Layout></AuthRoute>}/>
        <Route path="*" element={<Layout><Error/></Layout>}/>
      </Routes>
      <ToastContainer stacked position='bottom-right' />
    </main>
  );
}

export default App;
