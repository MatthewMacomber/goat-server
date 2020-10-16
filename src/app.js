require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middleware/error-handler');

// Enviroment imports.
const { NODE_ENV } = require('./config');

// Router imports.
const authRouter = require('./auth/auth-router');
const userRouter = require('./user/user-router');
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
app.use(errorHandler());

module.exports = app;
