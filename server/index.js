const express = require('express');
var cron = require('node-cron');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRouter = require('./routes/Auth');
const errorHandle = require('./middleware/Errorhandler');
const AIRouter = require('./routes/AIRouter');
const StripeRouter = require('./routes/StripeRouter');
const User = require('./models/User');


const app = express();


app.use(cors({
    origin: 'https://kvai.vercel.app/',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(morgan('combined'));
app.use('/api/auth', authRouter);
app.use('/api/AI', AIRouter);
app.use('/api/stripe', StripeRouter);


app.use(errorHandle);


    

//trial plan
cron.schedule('0 0 * * * *', async() => {
    try {
        const today = new Date()
        await User.updateMany({
            subscriptionPlan:'Free',
            trialExpires: {
                $lt: today
            }
        },{
            monthlyRequestCount: 100
        })
    } catch (error) {
        console.log(error);
    }
})

//basic plan
cron.schedule('0 0 1 * * *', async() => {
    try {
        const today = new Date()
        await User.updateMany({
            subscriptionPlan:'Basic',
            nextBillingDate: {$lt: today}
        },{
            monthlyRequestCount: 500
        })
    } catch (error) {
        console.log(error);
    }
})

//free plan
// cron.schedule('0 0 1 * * *', async() => {
//     try {
//         const today = new Date()
//         await User.updateMany({
//             subscriptionPlan:'Free',
//             nextBillingDate: {$lt: today}
//         },{
//             monthlyRequestCount: 0
//         })
//     } catch (error) {
//         console.log(error);
//     }
// })

//Premium plan
cron.schedule('0 0 1 * * *', async() => {
    try {
        const today = new Date()
        await User.updateMany({
            subscriptionPlan:'Premium',
            nextBillingDate: {$lt: today}
        },{
            monthlyRequestCount: 1000
        })
    } catch (error) {
        console.log(error);
    }
})



dotenv.config();



const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});


mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('database connected');
}).catch((error) => {
    console.log(error);
})
