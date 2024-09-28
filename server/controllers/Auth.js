const User = require("../models/User");
const bcrypt = require("bcrypt");
const validator = require("validator");
const asyncHandle = require("express-async-handler");
const jwt = require('jsonwebtoken');
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const getAllUser = async (req, res, next) => {
  let users;

  try {
    users = await User.find();
  } catch (error) {
    next(error);
  }

  if (!users) {
    return res.status(404).json({ message: "No user found" });
  }
  return res.status(200).json(users);
};

const SigningUp = asyncHandle(async (req, res) => {
  const { username, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    res.status(500).json({ message: "an error has occured when finding user" });
  }

  if (existingUser) {
    return res.status(400).json({message: "email is already existing"});
  }

  const Account = new User({
    username,
    email,
    password,
  });
  Account.trialExpires = new Date(
    new Date().getTime() + Account.TrialPeriod * 24 * 60 * 60 * 1000
  )
  if (!username || !email || !password) {
    res.status(500).json("please fill all the field");
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({message: "invalid email"});
  }

  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({message: "invalid password"});
  }
  const salt = await bcrypt.genSalt(10);
  Account.password = await bcrypt.hash(Account.password, salt);
  Account.resetToken = undefined;
  Account.expiredToken = undefined;
  await Account.save();

  return res.status(200).json({message: 'Created successfully', Account});
});

const Login = async (req, res) => {
  const { email, password } = req.body;

  let existingUser = await User.findOne({email});
  if(!existingUser){
    return res.status(404).json({message: 'No user found'});
  }
  let validPassword = await bcrypt.compare(password, existingUser.password);
  if(!validPassword){
    return res.status(400).json({message: 'invalid password'});
  }

  const token = jwt.sign({ id: existingUser?._id }, process.env.JWT_SECRET, {
    expiresIn: '3d'
    });
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    });
    return res
      .status(200)
      .json({ message: "Correct user", user: existingUser });
    
};


const deleteUser =(async(req, res) => {
  const {id} = req.params;

  const existing = await User.findById(id);
  if(!existing){
    return res.status(404).json ("No user found");
  }

  await User.findByIdAndDelete(id);
  return res.status(200).json('deleted')
});

const getSingleUser = async(req, res) => {

  // const find = await User.findById(req?.user?.id).select('-password').populate('payments').populate('ContentHistory');
  const find = await User.findById(req?.user?.id).select('-password');

  if(!find){
    return res.status(404).json('No user found');
  }
  return res.status(200).json({
    status: 'success',
    find
  });
};

const Logout = async(req, res) => {
  res.cookie('token', '', {maxAge: 1});
  res.status(200).json({message: 'logout successfully'});
};

const ForgotPassword = (async(req, res) => {
  const {email} = req.body;

  const find = await User.findOne({email});
  if(!find){
    return res.status(404).json({message: 'No email found'});
  }

  const generatedToken = crypto.randomBytes(10);

  const convertToString = generatedToken.toString('hex');

  find.resetToken = convertToString;
  find.expiredToken = Date.now() + 1800000;

  await find.save();

  const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port: 587,
    secure: false,
    auth:{
      user: process.env.USER_EMAIL,
      pass: process.env.USER_PASSWORD,
    },
    tls:{
      rejectUnauthorized: false
    }
  });

  const mailOption = {
    from: "KVAI support<support@kvblog.com>",
    to: email,
    subject: "Reset Password",
    text: `Please use the following token to reset your password: ${find.resetToken}`,
  }

  transporter.sendMail(mailOption, (error, infor) => {
    if(error){
      console.log(error);
      return res.status(500).json("an error has occurred, try again");
    }
    else {
      console.log("Email sent: " + infor.response);
      return res.status(200).json({
        message: "Your reset code has been sent, check your email",
        data: {
          resetToken: find.resetToken,
          expiredToken: find.expiredToken,
        },
      });
    }
  })
});

const ResetPassword = async (req, res) => {
  const { email, resetToken, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'No user found' });
    }

    if (user.resetToken !== resetToken || user.expiredToken < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    if (!newPassword) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    if (!validator.isStrongPassword(newPassword)) {
      return res.status(400).json({ message: "Password is not strong enough" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    user.resetToken = undefined;
    user.expiredToken = undefined;
    await user.save();

    return res.status(200).json({ message: 'Updated your account' });

  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


const checkAuth = async(req, res) => {
  const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
  if(decoded){
    res.json({
      isAuthenticated: true
    });
    
  }else{
    res.json({
      isAuthenticated: false
    })
  }
}



module.exports = { getAllUser, SigningUp, Login, deleteUser, getSingleUser, Logout, ForgotPassword, ResetPassword, checkAuth };
