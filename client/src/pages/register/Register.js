import React, { useEffect, useState } from 'react';
import axios from "axios";
import {toast} from 'react-toastify';
import {useNavigate, Link} from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';

export default function Register() {
  const navigate = useNavigate();
  const {isAuthenticated} = useAuth();
  const [input, setInput] = useState({
    username:'',
    email:'',
    password:'',
    confirm:''
  });

  useEffect(() => {
    if(isAuthenticated){
      navigate('/dashboard');
    }
  })

  const SendRequest = async() => {
    try{
      const res = await axios.post('https://kvai.onrender.com/api/auth/register',{
      username: input.username,
      email:input.email,
      password: input.password
      });

      return res.data;
    }
    catch(error){
      console.error(error)
    }
  };

  const handleSubmit = async(e) => {
    e.preventDefault();

    if(input.password !== input.confirm){
      toast.warn("passwords do not match");
    }
    const data = await SendRequest();

    if(data && data.message === 'email is already existing'){
      toast.warn('This email is already in used, find another one');
    }
    else if(data && data.message === 'invalid email'){
      toast.warn("Invalid email");
    }
    else if(data && data.message === 'invalid password'){
      toast.warn("Password is not strong enough")
    }
    else if(data && data.message === 'Created successfully'){
      toast.success('Created your account');
      setTimeout(() => {
        navigate('/login')
      },2000)
    }
  }

  return (
    <div className='flex items-center justify-center h-screen bg-transparent'>
      <form className='bg-zinc-800 rounded-lg shadow-lg px-8 pt-6 pb-8 mb-6 lg:w-96' onSubmit={handleSubmit}>
        <h2 className='text-center text-gray-300 text-2xl font-semibold mb-6'>Sign up</h2>

        <div className='mb-6'>
          <label className='block text-gray-400 text-sm font-bold mb-2' htmlFor='Username'>
            Username
          </label>
          <input
            className='shadow appearance-none border border-gray-700 rounded w-full py-3 px-4 bg-zinc-900 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500'
            id='Username'
            name='Username'
            type='text'
            placeholder='Enter your Username'
            onChange={(e) => setInput({ ...input, username: e.target.value })}
            required
          />
        </div>
        
        
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

        <div className='mb-6'>
          <label className='block text-gray-400 text-sm font-bold mb-2' htmlFor='Confirm'>
            Confirm your password
          </label>
          <input
            className='shadow appearance-none border border-gray-700 rounded w-full py-3 px-4 bg-zinc-900 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500'
            id='Confirm'
            name='Confirm'
            type='password'
            placeholder='Confirm your password'
            onChange={(e) => setInput({ ...input, confirm: e.target.value })}
            required
          />
        </div>

        
        <div className='mb-4'>
          <button className='btn btn-primary w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300' type='submit'>
            Sign up
          </button>
        </div>

        
        <div className='text-center mb-4'>
          <button className='btn btn-secondary w-full py-2 bg-zinc-700 hover:bg-zinc-600 text-gray-300 font-bold rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300'>
            <Link to='/login'>Already have an account?</Link>
          </button>
        </div>

        
        <div className='text-center text-gray-400'>
          <Link to='/forgotpassword' className='hover:underline'>Forgot your password?</Link>
        </div>
      </form>
    </div>
  )
}
