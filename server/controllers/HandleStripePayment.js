require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { calculateNextBillingDate } = require('../utils/calculateNextBillingDate');
const renewSubcripstionPlan = require('../utils/renewSubscription');
const Payment = require('../models/Payment');
const User = require('../models/User');


const handleStripePayment = async(req, res) => {
    const {amount, subscriptionPlan} = req.body;
    const user = req?.user;
    console.log(user);
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Number(amount) * 100,
            currency: 'usd',
            metadata:{
                userId: user?._id.toString(),
                userEmail: user?.email,
                subscriptionPlan
            }
        });
        console.log(paymentIntent);
        res.json({
            clientSecret: paymentIntent?.client_secret,
            paymentId: paymentIntent?.id,
            metadata: paymentIntent?.metadata
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message: error});
    }
};

const handleFreeSubscription = async(req, res) => {
    const user = req?.user;


    try {
        if(renewSubcripstionPlan(user)){
            user.subscriptionPlan = 'Free';
            user.monthlyRequestCount = 100
            user.apiRequestCount = 0;
            user.nextBillingDate = calculateNextBillingDate();
            const newPayment = await Payment.create({
                user: user?._id,
                subscriptionPlan: 'Free',
                amount: 0,
                status:'success',
                reference: Math.random().toString(36).substring(7),
                monthlyRequestCount: 0,
                currency: 'usd'
            });
            user.payments.push(newPayment._id);
            await user.save();
            res.json({
                status:'success',
                message:'subscription updated'
            });
            
        }else{
            return res.status(403).json({error: 'subscription is not renewed yet'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json(error.message);
    }
};

const verifyPayment = async(req, res) => {
    const{ paymentId} = req.params;
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
        if(paymentIntent.status !== 'success'){
            const metadata = paymentIntent.metadata;
            const subscriptionPlan = metadata?.subscriptionPlan;
            const userEmail = metadata?.userEmail;
            const userId = metadata?.userId;

            const userFound = await User.findById(userId)
            if(!userFound){
                return res.status(404).json({
                    status: 'false',
                    message:'No user found'
                });
            }
            const amount = paymentIntent.amount / 100;
            const currency = paymentIntent?.currency;
            const paymentId = paymentIntent?.id;

            const newPayment = await Payment.create({
                user: userId,
                email: userEmail,
                subscriptionPlan,
                amount,
                currency,
                status: 'success',
                reference: paymentId
            });

            if(subscriptionPlan === 'Basic'){
                const updatedUser = await User.findByIdAndUpdate(userId, {
                    subscriptionPlan,
                    TrialPeriod: 0,
                    nextBillingDate: calculateNextBillingDate(),
                    apiRequestCount: 0,
                    monthlyRequestCount: 200,
                    subscriptionPlan:'Basic',
                    $addToSet: {payments: newPayment?._id}
                });
                res.json({
                    status: true,
                    message: 'payment verified',
                    updatedUser
                })
            }
            if(subscriptionPlan === 'Premium'){
                const updatedUser = await User.findByIdAndUpdate(userId, {
                    subscriptionPlan,
                    TrialPeriod: 0,
                    nextBillingDate: calculateNextBillingDate(),
                    apiRequestCount: 0,
                    monthlyRequestCount: 500,
                    subscriptionPlan: 'Premium',
                    $addToSet: {payments: newPayment?._id}
                });
                res.json({
                    status: true,
                    message: 'payment verified',
                    updatedUser
                })
            }
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error});
    }
}

module.exports = {handleStripePayment, handleFreeSubscription, verifyPayment};