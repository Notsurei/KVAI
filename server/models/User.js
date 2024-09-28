const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true,
    },
    TrialPeriod:{
        type:Number,
        default: 3
    },
    trialActive:{
        type: Boolean,
        default: true
    },
    trialExpires:{
        type: Date
    },
    subscriptionPlan:{
        type: String,
        enum: ['Free', 'Basic', 'Premium'],
        default:'Free'
    },
    apiRequestCount:{
        type: Number,
        default: 0
    },
    monthlyRequestCount:{
        type: Number,
        default: 100
    },
    nextBillingDate:{
        type: Date
    },
    payments:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Payment'
        }
    ],
    history:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ContentHistory'
        }
    ],
    resetToken: String,
    expiredToken: String,
},{
    timestamps: true,
    toJSON:{virtuals: true},
    toObject: {virtuals: true}
});

// userSchema.virtual('isTrialActive').get(function(){
//     return this.trialActive && new Date() < this.trialExpires;

// });

const User = mongoose.model('User', userSchema);
module.exports = User;