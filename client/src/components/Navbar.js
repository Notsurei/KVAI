import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RiRobot3Fill } from "react-icons/ri";
import { MdDashboard } from "react-icons/md";
import { FaHome } from "react-icons/fa";
import { FcAbout } from "react-icons/fc";
import { useAuth } from "../Context/AuthContext";

export default function NavBar() {
    const { logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const SendRequest = async() => {
        try{const res = await axios.post('http://localhost:4000/api/auth/logout',{},{
            withCredentials: true
        });
        logout();

        return res.data;}
        catch(error){
            console.log(error);
        }
    }

    const handleSubmit = async(e) => {
        e.preventDefault();
        SendRequest();
        navigate('/');

    }


    return (
        <nav className="w-full shadow" onSubmit={handleSubmit}>
            <div className="justify-between px-4 mx-auto lg:max-w-7xl md:items-center md:flex md:px-8">
                <div>
                    <div className="flex flex-row items-center justify-between py-3 md:py-5 md:block">
                        <Link to="/" className="flex items-center space-x-2">
                            <RiRobot3Fill />
                            <h2 className="text-2xl font-bold">KVAI</h2>
                        </Link>
                    </div>
                </div>
                <div>
                    <div className={`flex-1 justify-self-center pb-3 mt-8 md:block md:pb-0 md:mt-0`}>
                        <ul className="items-center justify-center space-y-8 md:flex md:space-x-6 md:space-y-0">
                            <li className="text-gray-600 hover:text-blue-600">
                                <Link to="/" className="flex items-center space-x-2">
                                    <FaHome />
                                    <span>Home</span>
                                </Link>
                            </li>
                            {isAuthenticated && <li className="text-gray-600 hover:text-blue-600">
                                <Link to="/dashboard" className="flex items-center space-x-2">
                                    <MdDashboard />
                                    <span>Dashboard</span>
                                </Link>
                            </li>}
                            <li className="text-gray-600 hover:text-blue-600">
                                <Link to="/about" className="flex items-center space-x-2">
                                    <FcAbout/>
                                    <span>About Us</span>
                                </Link>
                            </li>
                            {isAuthenticated && <li>
                                <button className='btn decoration-0 bg-gradient-to-r from-purple-500 to-pink-500'>
                                    <Link className='text-white flex items-center animate-bounce' to='/generate'>
                                        Chat now
                                    </Link>
                                </button>
                            </li>}
                        </ul>
                    </div>
                </div>
                {!isAuthenticated && <div className='flex flex-col items-center justify-between md:block'>
                    <button className='btn decoration-0 mr-2 bg-purple-500'>
                        <Link className='text-white flex items-center' to='/login'>
                            Login
                        </Link>
                    </button>
                    <button className='btn decoration-0 bg-pink-500'>
                        <Link className='text-white flex items-center' to='/register'>
                            Sign up
                        </Link>
                    </button>
                </div>}
                {isAuthenticated && <div className='flex justify-end md:block'>
                    <button className='btn btn-error decoration-0 text-white' onClick={handleSubmit}>
                        Logout
                    </button>
                </div>}
            </div>
        </nav>
    );
}
