const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated');
const {handleStripePayment, handleFreeSubscription, verifyPayment} = require('../controllers/HandleStripePayment');

const StripeRouter = express.Router();

StripeRouter.post('/checkout', isAuthenticated ,handleStripePayment);
StripeRouter.post('/free-plan', isAuthenticated, handleFreeSubscription);
StripeRouter.post('/verify-payment/:paymentId', isAuthenticated, verifyPayment);

module.exports= StripeRouter;



