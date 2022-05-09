const usersRouter = require('./usersRouter.js');
const authRouter = require('./authRouter.js');
const questionsRouter = require('./questionsRouter.js');
// const answersRouter = require('./answersRouter.js');
const utilitiesRouter = require('./utilitiesRouter.js');
const express = require('express');
const censusRouter = express.Router();
const votumRouter = express.Router();

// Votum routers
const votumRouters = [
  usersRouter,
  //  answersRouter,
  questionsRouter,
  utilitiesRouter
];
votumRouter.use('/votum', votumRouters);

// Census[WIP] routers
const censusRouters = [authRouter];
censusRouter.use('/census', censusRouters);

const routers = [votumRouter, censusRouter];

module.exports = routers;
