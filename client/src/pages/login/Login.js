import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';


export default function Login() {
  const navigate = useNavigate();
  const {isAuthenticated, login} = useAuth();

  useEffect(() => {
    if(isAuthenticated){
      navigate('/dashboard');
    }
    
  },[isAuthenticated, navigate]);
  
  const [input, setInput] = useState({
    email: '',
    password: '',
  });

  const SendRequest = async () => {
    try {
      const res = await axios.post('http://localhost:4000/api/auth/login', {
        email: input.email,
        password: input.password
      }, {
        withCredentials: true
      });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await SendRequest();

    if (data && data.message === 'No user found') {
      toast.error("This email is not in use");
    } else if (data && data.message === 'invalid Password') {
      toast.error("Wrong password");
    } else if (data && data.message === 'Correct user') {
      toast.success('Signing in');
      login();
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }
  };

  return (
    <div className='flex items-center justify-center h-screen bg-transparent'>
      <form className='bg-zinc-800 rounded-lg shadow-lg px-8 pt-6 pb-8 mb-6 lg:w-96' onSubmit={handleSubmit}>
        <h2 className='text-center text-gray-300 text-2xl font-semibold mb-6'>Login</h2>
        
        
        <div className='mb-6'>
          <label className='block text-gray-400 text-sm font-bold mb-2' htmlFor='Email'>
            Email
          </label>
          <input
            className='shadow appearance-none border border-gray-700 rounded w-full py-3 px-4 bg-zinc-900 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500'
            id='Email'
            name='Email'
            type='email'
            placeholder='Enter your email'
            onChange={(e) => setInput({ ...input, email: e.target.value })}
            required
          />
        </div>

        
        <div className='mb-6'>
          <label className='block text-gray-400 text-sm font-bold mb-2' htmlFor='Password'>
            Password
          </label>
          <input
            className='shadow appearance-none border border-gray-700 rounded w-full py-3 px-4 bg-zinc-900 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500'
            id='Password'
            name='Password'
            type='password'
            placeholder='Enter your password'
            onChange={(e) => setInput({ ...input, password: e.target.value })}
            required
          />
        </div>

        
        <div className='mb-4'>
          <button className='btn btn-primary w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300' type='submit'>
            Login
          </button>
        </div>

        
        <div className='text-center mb-4'>
          <button className='btn btn-secondary w-full py-2 bg-zinc-700 hover:bg-zinc-600 text-gray-300 font-bold rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300'>
            <Link to='/register'>Create an account</Link>
          </button>
        </div>

        
        <div className='text-center text-gray-400'>
          <Link to='/forgotpassword' className='hover:underline'>Forgot your password?</Link>
        </div>
      </form>
    </div>
  );
}
