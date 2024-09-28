import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { TypeAnimation } from "react-type-animation";
import { useAuth } from "../../Context/AuthContext";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [user, setUser] = useState(null);

  const SendRequest = async () => {
    const res = await axios.get("http://localhost:4000/api/auth/profile", {
      withCredentials: true,
    });

    setUser(res.data);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else {
      SendRequest();
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="mx-auto bg-gray-900 p-4 w-screen">
      <TypeAnimation
        className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-600 m-10 h-10"
        sequence={["Welcome to KVAI", 1000, "Here is your dashboard", 1000]}
        wrapper="span"
        speed={50}
        style={{ fontSize: "2em", display: "inline-block" }}
        repeat={Infinity}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user && (
          <div className="mb-6 bg-white p-4 shadow rounded-lg">
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Profile Information
            </h2>
            <div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="username"
                >
                  Name
                </label>
                <p
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                  id="username"
                >
                  {user.find.username}
                </p>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <p
                  className="border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                  id="email"
                >
                  {user.find.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {user && (
          <div className="mb-6 bg-white p-4 shadow rounded-lg">
            <h2 className="mb-4 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Credit Usage
            </h2>
            <div>
              <p className="mb-4 text-black">
                Monthly Credit: {user.find.monthlyRequestCount}
              </p>
              <p className="mb-4 text-black">
                Credit Used: {user.find.apiRequestCount}
              </p>
              <p className="mb-4 text-black">
                Credit Remaining:{" "}
                {user.find.monthlyRequestCount - user.find.apiRequestCount}
              </p>
              <p className="mb-4 text-black">
                Next Billing Date: {new Date(user.find.updatedAt).toString()}
              </p>
            </div>
          </div>
        )}

        {user && (
          <div className="mb-6 bg-white p-4 shadow rounded-lg">
            <h2 className="mb-4 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Payment & Plans
            </h2>
            <div>
              <p className="mb-4 text-black">
                Current Plan: {user.find.subscriptionPlan}
              </p>
              <Link
                to="/plans"
                className=" py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Upgrade Plan
              </Link>
            </div>
          </div>
        )}

        {user && (
          <div className="mb-6 bg-white p-4 shadow rounded-lg">
            <h2 className="mb-4 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Trial Information
            </h2>
            <div>
              <p className="mb-4 text-black">
                Trial Status: {user.find.trialActive ? "Yes" : "No"}
              </p>
              <p className="mb-4 text-black">
                Expires on: {new Date(user.find.trialExpires).toString()}
              </p>
              <Link
                to="/plans"
                className=" py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-indigo-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Upgrade to Premium
              </Link>
            </div>
          </div>
        )}

        {user && (<div className="mb-6 bg-white p-4 shadow rounded-lg col-span-1 md:col-span-2">
          <h2 className="mb-4 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Payment History
          </h2>
          {user.find.payments.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {user.find.payments.map((payment, index) => (
                <li
                  key={index}
                  className="py-4 hover:bg-gray-50 transition duration-150 ease-in-out"
                >
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div className="mb-2 sm:mb-0">
                      <p className="text-sm font-medium text-indigo-600">
                        {user.find.subscriptionPlan}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(user.find.createdAt).toString()}
                      </p>
                    </div>
                    <div className="flex items-center">
                      <p
                        className={`text-sm font-semibold ${
                          user.status === "success"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {user.status}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <h1 className="text-pink-500">No Payment History</h1>
          )}
        </div>)}
      </div>
    </div>
  );
};

export default Dashboard;
