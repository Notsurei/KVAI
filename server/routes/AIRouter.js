const express = require('express');
const isAuthenticated = require('../middleware/isAuthenticated');
const { AIGenerated } = require('../controllers/AIcontroller');
const checkAPIRequestLimit = require('../middleware/checkAPIRequestLimit');

const AIRouter = express.Router();

AIRouter.post('/generate', isAuthenticated, checkAPIRequestLimit ,AIGenerated);

module.exports= AIRouter



