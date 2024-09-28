const User = require('../models/User');

const checkAPIRequestLimit = async(req, res, next) => {
    if(!req.user){
        return res.status(401).json({message: 'Not Authorized'});
    }

    const user = await User.findById(req?.user?.id);
    if(!user){
        return res.status(404).json({message: "No user found"});
    }
    let requestLimit = 0;
    if(user?.trialActive){
        requestLimit = user?.monthlyRequestCount
    }
    if(user?.apiRequestCount >= requestLimit){
        return res.status(404).json("API request limit reached, please subcribe to plan");
    }
    next();
};

module.exports = checkAPIRequestLimit;