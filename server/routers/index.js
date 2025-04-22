const express = require("express");
const { userRouter } = require('./user');
const { wordBankRouter } = require('./wordsBank');

const apiRouter = express.Router();

apiRouter.use('/user', userRouter);
apiRouter.use('/wordBank', wordBankRouter);

module.exports = apiRouter;
