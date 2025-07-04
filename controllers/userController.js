// controllers/userController.js
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const { UserModel } = require("../models/User");
const UserProgress = require("../models/UserProgress");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const sendEmail = require("../utils/sendMail");
require("dotenv").config();

const saltRounds = 10;
const REFRESH_TOKEN_TIME_IN_MILISECONDS = 7 * 24 * 60 * 60 * 1000; // 7 days
const ACCESS_TOKEN_TIME_IN_MILISECONDS = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_TIME = "7d"; // 7 days
const ACCESS_TOKEN_TIME = "15m"; // 15 minutes


exports.signUp = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const emailTrimmed = email.trim().toLowerCase();
    const existingUser = await UserModel.findOne({ emailTrimmed });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userProgress = await new UserProgress().save();

    const user = await UserModel.create({
      name,
      email: emailTrimmed,
      password: hashedPassword,
      progress: userProgress._id.toString(),
    });

    const payload = { _id: user._id, name: user.name, role: user.role };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_TIME,
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_TIME,
    });

    user.refreshToken = refreshToken;
    await user.save();

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: ACCESS_TOKEN_TIME_IN_MILISECONDS,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: REFRESH_TOKEN_TIME_IN_MILISECONDS,
      })
      .status(200)
      .json({
        email: user.email,
        role: user.role,
        name: user.name,
      });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.googleSignup = async (req, res) => {
  try {
    const { id_token } = req.body;
    if (!id_token) {
      return res.status(400).json({ message: "Missing ID token" });
    }

    // אימות הטוקן מול גוגל
    const ticket = await client.verifyIdToken({ idToken: id_token });
    const payload = ticket.getPayload();

    const email = payload.email.toLowerCase().trim();
    const name = payload.name;

    // בדיקה אם המשתמש כבר קיים
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists, please log in" });
    }

    // יצירת progress חדש
    const userProgress = await new UserProgress().save();

    // יצירת משתמש חדש
    const user = await UserModel.create({
      name,
      email,
      password: null, // כי זה רישום דרך גוגל
      progress: userProgress._id.toString(),
    });

    // יצירת טוקנים
    const jwtPayload = { _id: user._id, name: user.name, role: user.role };

    const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_TIME,
    });

    const refreshToken = jwt.sign(jwtPayload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_TIME,
    });

    user.refreshToken = refreshToken;
    await user.save();

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: ACCESS_TOKEN_TIME_IN_MILISECONDS,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: REFRESH_TOKEN_TIME_IN_MILISECONDS,
      })
      .status(200)
      .json({
        email: user.email,
        role: user.role,
        name: user.name,
      });
  } catch (error) {
    console.error("Google signup error:", error);
    return res.status(500).json({ message: "Google signup failed" });
  }
};


exports.googleLogin = async (req, res) => {
  try {
    const { id_token } = req.body;
    if (!id_token) {
      return res.status(400).json({ message: "Missing ID token" });
    }

    // אימות מול Google עם Client ID שמוגדר מראש
    const ticket = await client.verifyIdToken({ idToken: id_token });
    const payload = ticket.getPayload();
    const email = payload.email.toLowerCase().trim();
    const name = payload.name;

    // בדיקה אם המשתמש כבר קיים במערכת
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message:
          "User not found. Please sign up with email and password before using Google login.",
      });
    }

    // יצירת טוקנים
    const jwtPayload = { _id: user._id, name: user.name, role: user.role };

    const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_TIME,
    });

    const refreshToken = jwt.sign(jwtPayload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_TIME,
    });

    user.refreshToken = refreshToken;
    await user.save();

    // שליחת הטוקנים ב־cookie
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: ACCESS_TOKEN_TIME_IN_MILISECONDS,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: REFRESH_TOKEN_TIME_IN_MILISECONDS,
      })
      .status(200)
      .json({
        email: user.email,
        role: user.role,
        name: user.name,
      });
  } catch (error) {
    console.error("Google login error:", error);
    return res.status(500).json({ message: "Google login failed" });
  }
};

exports.googleConfigurations = (req, res) => {
    res.json({ clientId: process.env.GOOGLE_CLIENT_ID });
}

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("login called", email, password);
  try {
    const user = await UserModel.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "User email or password not correct" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(404)
        .json({ message: "User email or password not correct" });

    const payload = { _id: user._id, name: user.name, role: user.role };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: ACCESS_TOKEN_TIME,
    });
    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_TIME,
    });

    user.refreshToken = refreshToken;
    await user.save();

    // שליחת cookies
    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true, // רק אם יש HTTPS
        sameSite: "None",
        maxAge: ACCESS_TOKEN_TIME_IN_MILISECONDS,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: REFRESH_TOKEN_TIME_IN_MILISECONDS,
      })
      .status(200)
      .json({
        email: user.email,
        role: user.role,
        name: user.name,
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.refreshToken = async (req, res) => {
  console.log(
    "refresh called" +
      req.cookies.refreshToken +
      "\n \n " +
      req.cookies.accessToken
  );
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken)
    return res.status(401).json({ message: "No token provided" });

  try {
    const user = await UserModel.findOne({ refreshToken });
    if (!user) return res.status(401).json({ message: "Invalid token" });

    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err)
          return res.status(401).json({ message: "Token verification failed" });

        const payload = {
          _id: decoded._id,
          name: decoded.name,
          isAdmin: decoded.isAdmin,
        };

        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
          expiresIn: ACCESS_TOKEN_TIME,
        });

        // todo: act like login
        res
          .cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true, // רק אם יש HTTPS
            sameSite: "None",
            maxAge: ACCESS_TOKEN_TIME_IN_MILISECONDS,
          })
          .status(200)
          .json({
            email: user.email,
            role: user.role,
            name: user.name,
          });
      }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.forgotPassword = (req, res) => {
  console.log("forgotPassword called");
  const { email } = req.body;
  UserModel.findOne({ email })
    .then((user) => {
      if (user) {
        sendEmail(user.email);
      }
      res.status(200).json({
        message: "If a user with that email exists, a reset link was sent.",
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ message: "Logged out" });
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  console.log("resetPassword called", token, newPassword);

  try {
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Missing token or password" });
    }

    // אימות הטוקן
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET);
    const email = decoded.email;

    // חיפוש המשתמש לפי האימייל מהטוקן
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // הצפנת הסיסמה החדשה
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // עדכון במסד
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    console.error("resetPassword error:", err);
    if (err.name === "TokenExpiredError") {
      return res.status(400).json({ message: "Reset link has expired" });
    }
    return res.status(500).json({ message: "Invalid or expired token" });
  }
};

exports.userInfo = async (req, res) => {
  try {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken)
      return res.status(401).json({ message: "No token provided" });
    else {
      jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decoded) => {
          if (err)
            return res
              .status(403)
              .json({ message: "Token verification failed" });
          const user = await UserModel.findById(decoded._id);
          if (!user) return res.status(404).json({ message: "User not found" });
          res.status(200).json({
            email: user.email,
            role: user.role,
            name: user.name,
          });
        }
      );
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
