import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react"; // Import useState
import { RiRobot3Fill } from "react-icons/ri";
import { MdDashboard, MdOutlinePayment } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { FcAbout } from "react-icons/fc";
import { useAuth } from "../Context/AuthContext";

export default function NavBar() {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State to control dropdown

  const SendRequest = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      logout();
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await SendRequest();
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="w-full shadow" onSubmit={handleSubmit}>
      <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
        <div className="md:hidden relative">
          <button
            onClick={toggleDropdown}
            className="btn btn-ghost"
            aria-label="Toggle dropdown"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute top-12 left-0 mt-2 w-52 p-2 shadow bg-base-100 rounded-box z-10">
              <Link
                to="/"
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
              >
                <FaHome />
                <span>Home</span>
              </Link>
              {isAuthenticated && (
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
                >
                  <MdDashboard />
                  <span>Dashboard</span>
                </Link>
              )}
              {isAuthenticated && (
                <Link
                  to="/pricing"
                  className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
                >
                  <MdOutlinePayment />
                  <span>Pricing</span>
                </Link>
              )}
              {isAuthenticated && (
                <button className="btn bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Link
                    to="/generate"
                    className="flex items-center animate-bounce"
                  >
                    Chat now
                  </Link>
                </button>
              )}
              
              <Link
                to="/about"
                className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded"
              >
                <FcAbout />
                <span>About Us</span>
              </Link>
              {!isAuthenticated ? (
                <div className="">
                  <Link to="/login" className="btn bg-purple-500 text-white">
                    Login
                  </Link>
                  <Link to="/register" className="btn bg-pink-500 text-white">
                    Sign Up
                  </Link>
                </div>
              ) : (
                <button
                  className="btn btn-error text-white"
                  onClick={handleSubmit}
                >
                  Logout
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 py-3 md:py-0">
          <Link to="/" className="flex items-center space-x-2">
            <RiRobot3Fill />
            <h2 className="text-2xl font-bold">KVAI</h2>
          </Link>
        </div>

        <div className="hidden md:flex md:items-center space-x-6">
          <Link
            to="/"
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
          >
            <FaHome />
            <span>Home</span>
          </Link>
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
            >
              <MdDashboard />
              <span>Dashboard</span>
            </Link>
          )}
          <Link
            to="/about"
            className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
          >
            <FcAbout />
            <span>About Us</span>
          </Link>
          {isAuthenticated && (
            <Link
              to="/pricing"
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600"
            >
              <MdOutlinePayment />
              <span>Pricing</span>
            </Link>
          )}
          {isAuthenticated && (
            <button className="btn bg-gradient-to-r from-purple-500 to-pink-500 text-white">
              <Link to="/generate" className="flex items-center animate-bounce">
                Chat now
              </Link>
            </button>
          )}
        </div>

        {!isAuthenticated ? (
          <div className="hidden md:flex space-x-4">
            <Link to="/login" className="btn bg-purple-500 text-white">
              Login
            </Link>
            <Link to="/register" className="btn bg-pink-500 text-white">
              Sign Up
            </Link>
          </div>
        ) : (
          <button className="btn btn-error text-white" onClick={handleSubmit}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
