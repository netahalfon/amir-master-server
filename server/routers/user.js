const userRouter = require("express").Router();
const userController = require("../controllers/userController");

userRouter.get("/userInfo", userController.userInfo);
userRouter.post("/signUp", userController.signUp);
userRouter.post("/login", userController.login);
userRouter.get("/refreshToken", userController.refreshToken);
userRouter.post("/forgotPassword", userController.forgotPassword);
userRouter.post("/logout", userController.logout);
userRouter.post("/resetPassword", userController.resetPassword);

module.exports = { userRouter };
