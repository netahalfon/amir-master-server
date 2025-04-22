const userRouter = require("express").Router();
const { authonticateToken } = require("../middlewares/authonticateToken");
const {UserModel} = require("../models/User");
const sendEmail = require("../utils/sendMail");
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const saltRounds = 10;

// signUp
userRouter.post("/signUp", async (req, res) => {
  try {
    //chack if user already exists
    const { email, name, password } = req.body;
    const existingUser = await UserModel.findOne({ email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    //create new user
    const user = await UserModel.create({
      name: name,
      email: email,
      password: hashedPassword,
    });
    delete user.password; // remove password from the response
    delete user.refreshToken; // remove refreshToken from the response
    return res.status(200).json({
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// login
userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "The password is incorrect" });

    const payload = { _id: user._id, name: user.name, role: user.role };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    // שמירה של ה־refreshToken (לדוגמה: בזיכרון או DB)
    user.refreshToken = refreshToken;
    await user.save();

    // שליחת הטוקנים ללקוח
    res.status(200).json({
      accessToken,
      refreshToken,
    });

    

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

userRouter.post("/refresh-token", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ message: "No token provided" });

  try {
    const user = await UserModel.findOne({ refreshToken });
    if (!user) return res.status(403).json({ message: "Invalid token" });

    const callback = (err, decoded) => {
      if (err)
        return res.status(403).json({ message: "Token verification failed" });

      const payload = {
        _id: decoded._id,
        name: decoded.name,
        isAdmin: decoded.isAdmin,
      };

      const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "15m",
      });
      res.status(200).json({
        accessToken,
        refreshToken,
      });
    };
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, callback);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// forgot password
userRouter.post("/forgotPassword", (req, res) => {
  const { email } = req.body;
  UserModel.findOne({ email: email })
    .then((user) => {
      if (user) {
        sendEmail(user.email, user.password);
        res.status(200).json(user);
      } else {
        res.status(404).json({ message: "User not found" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
});

exports.userRouter = userRouter;
