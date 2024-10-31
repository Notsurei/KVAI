import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Link, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const paymentIntentID = searchParams.get('payment_intent');
  const [paymentStatus, setPaymentStatus] = useState("loading"); 
  const [errorMessage, setErrorMessage] = useState("");


  const verifyPayment = async (paymentID) => {
    try {
      const res = await axios.post(`https://kvai.onrender.com/api/stripe/verify-payment/${paymentID}`, {}, {
        withCredentials: true
      });
      return res.data;
    } catch (error) {
      throw new Error(error.response ? error.response.data.message : "An error occurred during payment verification.");
    }
  };

  useEffect(() => {
    if (paymentIntentID) {
      verifyPayment(paymentIntentID)
        .then(data => {
          if (data.status === "success") {
            setPaymentStatus("success");
          } else {
            setPaymentStatus("failure");
            setErrorMessage(data.message || "Payment verification failed.");
          }
        })
        .catch(error => {
          setPaymentStatus("failure");
          setErrorMessage(error.message || "An error occurred during payment verification.");
        });
    }
  }, [paymentIntentID]);

  return (
    <div className="max-w-lg mx-auto my-10 p-6 shadow-md rounded-lg">
      {paymentStatus === "loading" && (
        <div className="flex flex-col items-center justify-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mb-3" />
          <p className="text-lg text-gray-600">Verifying your payment, please wait...</p>
        </div>
      )}

      {paymentStatus === "success" && (
        <div className="text-center text-green-500">
          <FaCheckCircle className="text-5xl mb-3" />
          <h1 className="text-2xl font-bold mb-3">Payment Successful</h1>
          <p className="text-gray-600 mb-4">
            Thank you for your payment. Your transaction ID is {paymentIntentID}.
          </p>
          <Link
            to="/generate-content"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Start Using AI
          </Link>
        </div>
      )}

      {paymentStatus === "failure" && (
        <div className="text-center text-red-500">
          <FaTimesCircle className="text-5xl mb-3" />
          <p className="text-xl font-bold">Payment Failed</p>
          <p className="text-gray-600 mb-4">{errorMessage}</p>
          <Link
            to="/retry-payment"
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Retry Payment
          </Link>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
