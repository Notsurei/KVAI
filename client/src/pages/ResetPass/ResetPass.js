import React, { useState } from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';
import {useNavigate, Link} from 'react-router-dom';

export default function ResetPass() {
    const navigate = useNavigate();

    const [input, setInput] = useState({
        email:'',
        resetToken:'',
        newPassword:'',
        confirm:''
    });

    const sendRequest = async() => {
        const res = await axios.post('http://localhost:4000/api/auth/resetpassword',{
            email:input.email,
            resetToken: input.resetToken,
            newPassword: input.newPassword
        });

        return res.data;
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(input.confirm !== input.newPassword){
            toast.warn('Passwords do not match');
        }

        const data = await sendRequest();

        if(data && data.message === 'No user found'){
            toast.error('No user found');
        }
        else if(data && data.message === 'Invalid or expired token'){
            toast.error('Your token is inavlid or expired');
        }
        else if(data && data.message === 'Password is not strong enough'){
            toast.error('Password is not strong enough')
        }
        else if(data && data.message === 'Updated your account'){
            toast.success('Updated your password');
            setTimeout(() => {
                navigate('/login')
            },2000)
        }
    }

  return (
    <div className='flex items-center justify-center h-screen bg-transparent'>
      <form className='bg-zinc-800 rounded-lg shadow-lg px-8 pt-6 pb-8 mb-6 lg:w-96' onSubmit={handleSubmit}>
        <h2 className='text-center text-gray-300 text-2xl font-semibold mb-6'>Enter your new password</h2>
        
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
          <label className='block text-gray-400 text-sm font-bold mb-2' htmlFor='resetToken'>
            Reset token
          </label>
          <input
            className='shadow appearance-none border border-gray-700 rounded w-full py-3 px-4 bg-zinc-900 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500'
            id='resetToken'
            name='resetToken'
            type='text'
            placeholder='Enter your token'
            onChange={(e) => setInput({ ...input, resetToken: e.target.value })}
            required
          />
        </div>

        
        <div className='mb-6'>
          <label className='block text-gray-400 text-sm font-bold mb-2' htmlFor='newPassword'>
            New password
          </label>
          <input
            className='shadow appearance-none border border-gray-700 rounded w-full py-3 px-4 bg-zinc-900 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500'
            id='newPassword'
            name='newPassword'
            type='password'
            placeholder='Enter your new password'
            onChange={(e) => setInput({ ...input, newPassword: e.target.value })}
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
            Updated
          </button>
        </div>

        
        <div className='text-center mb-4'>
          <button className='btn btn-secondary w-full py-2 bg-zinc-700 hover:bg-zinc-600 text-gray-300 font-bold rounded focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-300'>
            <Link to='/login'>Back to login</Link>
          </button>
        </div>

        
        <div className='text-center text-gray-400'>
          <Link to='/register' className='hover:underline'>Create an account</Link>
        </div>
      </form>
    </div>
  )
}
