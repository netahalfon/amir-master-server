//routers/index.js
const express = require("express");

const { userRouter } = require("./user");
const { wordBankRouter } = require("./wordsBank");
const { userProgressRouter } = require("./userProgress");
const { chaptersRouter } = require("./chapters");
const {simulationRouter} = require("./simulation");

const apiRouter = express.Router();

apiRouter.use("/user", userRouter);
apiRouter.use("/user/progress", userProgressRouter); // שימוש
apiRouter.use("/wordBank", wordBankRouter);
apiRouter.use("/chapters", chaptersRouter); // שימוש
apiRouter.use("/simulation", simulationRouter); // שימוש

module.exports = apiRouter;
