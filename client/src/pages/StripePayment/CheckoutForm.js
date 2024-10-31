import React, { useState } from 'react';
import axios from 'axios';
import {PaymentElement, useStripe, useElements} from '@stripe/react-stripe-js';
import { useParams, useSearchParams } from 'react-router-dom';

export default function CheckoutForm() {
    const params = useParams();
    const [SearchParams] =useSearchParams();
    const plan = params.plan;
    const amount = SearchParams.get('amount');
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState(null);

    const sendRequest = async(payload) => {
        const res = await axios.post('https://kvai.onrender.com/stripe/checkout',{
            amount:Number(payload.amount),
            subscriptionPlan: payload.plan
        },{
            withCredentials: true
        });

        return res.data;
    }

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(elements === null){
            return;
        }

        const {error:submitError} = await elements.submit();
        if(submitError){
            return;
        }
        try {
            const data = {
                amount: amount,
                plan: plan
            }

            await sendRequest(data)
            const {error} = await stripe.confirmPayment({
                elements: elements,
                clientSecret:'pi_3Q6Wg2RqJSDqvP4z14yJl8lH_secret_veQoOh5MKz5vxumK8c7RpZ6bC',
                confirmParams:{
                    return_url:'http://localhost:3000/success'
                }
            });
            if(error){
                setErrorMessage(error.message);
            }
        } catch (error) {
            setErrorMessage(error.message);
        }
    }   

  return (
    <div className='bg-grey-900 h-screen -mt-4 flex justify-center items-center'>
        <form onSubmit={handleSubmit} className='w-96 mx-auto my-4 p-6 bg-white rounded-lg shadow-md'>
            <div className='mb-4'>
                <PaymentElement/>
            </div>
            <button type='submit' className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-500 to-pink-500">
                Pay
            </button>
            {errorMessage && (<div className='text-red-500 mt-4'>{errorMessage}</div>)}
        </form>
    </div>
  )
}
