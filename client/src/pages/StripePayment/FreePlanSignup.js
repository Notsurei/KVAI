import React from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const FreePlanSignup = () => {

    const sendRequest = async() => {
        try {
            const res = await axios.post('http://localhost:4000/api/stripe/free-plan', {}, {
                withCredentials: true
            });
            return res.data;
        } catch (error) {
            console.log(error);
            toast.error('Failed to update subscription.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = await sendRequest();

        if (data && data.message === 'subscription is not renewed yet') {
            toast.error('Subscription is not renewed yet');
        } else if (data) {
            toast.success('Subscription updated successfully!');
        }
    };

    const planDetails = {
        name: "Free",
        price: "$0.00/month",
        features: ["5 Credits", "1 User", "Basic Support"],
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-900 flex justify-center items-center p-6">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
                    Confirm Your {planDetails.name} Plan
                </h2>

                <p className="text-center text-gray-600 mb-4">
                    Enjoy our free plan with no costs involved. Get started now and
                    upgrade anytime to access more features.
                </p>
                <ul className="list-disc list-inside mb-6 text-gray-600">
                    {planDetails.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                    ))}
                </ul>
                <div className="text-center text-green-600 font-bold mb-6">
                    {planDetails.price} - No Payment Required
                </div>
                <button
                    onClick={handleSubmit}
                    className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Confirm Free Plan : {planDetails.price}
                </button>

            </div>
        </div>
    );
};

export default FreePlanSignup;
