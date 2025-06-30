const userRouter = require("express").Router();
const userController = require("../controllers/userController");

userRouter.get("/google-configurations",userController.googleConfigurations);
userRouter.get("/user-info", userController.userInfo);
userRouter.post("/signup", userController.signUp);
userRouter.post("/google-signup", userController.googleSignup);
userRouter.post("/login", userController.login);
userRouter.post("/google-login", userController.googleLogin);
userRouter.get("/refresh-token", userController.refreshToken);
userRouter.post("/forgot-password", userController.forgotPassword);
userRouter.post("/logout", userController.logout);
userRouter.post("/reset-password", userController.resetPassword);

module.exports = { userRouter };
