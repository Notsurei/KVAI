const express = require('express');
const { SigningUp, getAllUser, Login, deleteUser, getSingleUser, Logout, ForgotPassword, ResetPassword, checkAuth } = require('../controllers/Auth');
const isAuthenticated = require('../middleware/isAuthenticated');

const authRouter = express.Router();

authRouter.get('/', getAllUser);
authRouter.get('/profile', isAuthenticated ,getSingleUser);
authRouter.get('/checkauth', isAuthenticated, checkAuth);
authRouter.post('/logout', Logout);
authRouter.post('/login', Login);
authRouter.post('/register', SigningUp);
authRouter.post('/forgotpassword', ForgotPassword);
authRouter.post('/resetpassword', ResetPassword);
authRouter.delete('/delete/:id', deleteUser);


module.exports = authRouter;