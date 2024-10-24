import React from 'react';
import './index.css'
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './Context/AuthContext';
import {loadStripe} from '@stripe/stripe-js';
import {Elements} from '@stripe/react-stripe-js'


const root = ReactDOM.createRoot(document.getElementById('root'));

const stripe = loadStripe('pk_test_51PMSvKRqJSDqvP4z1zYepUyRDvDVRTBeqt9R8MZ8yCNMClCCdW0I9JFC8z28oXhIopGplSGCMlJlshZF5lY7VUDF00uAzVJtwL');
const options = {
  mode:'payment',
  currency:'usd',
  amount: 1099
}

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Elements stripe={stripe} options={options}>
          <App />
        </Elements>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);

