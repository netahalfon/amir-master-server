const userRouter = require("express").Router();
const userController = require("../controllers/userController");

userRouter.post("/signUp", userController.signUp);
userRouter.post("/login", userController.login);
userRouter.post("/refresh-token", userController.refreshToken);
userRouter.post("/forgotPassword", userController.forgotPassword);

module.exports = { userRouter };
