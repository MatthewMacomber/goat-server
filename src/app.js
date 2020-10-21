require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');

// Enviroment imports.
const { NODE_ENV } = require('./config');

// Router imports.
const authRouter = require('./auth/auth-router');
const userRouter = require('./users/users-router');
const goalsRouter = require('./goals/goals-router');
const rewardsRouter =require('./rewards/rewards-router');

const app = express();

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}));
app.use(cors());
app.use(helmet());

//Use Routers.
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/goals', goalsRouter);
app.use('/api/rewards', rewardsRouter);

// Handle and display error messages.
app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === 'production') {
    response = { error: { message: 'server error'} };
  } else {
    console.log(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
  next();
});

module.exports = app;
