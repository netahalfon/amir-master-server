//models/User.js
const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const ROLES = {
  User: "User",
  Admin: "Admin",
};

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: [ROLES.User, ROLES.Admin],
    default: ROLES.User,
  },
  refreshToken: String,
  progress: {
    type: Types.ObjectId,
    ref: "UserProgress",
  },
});

const UserModel = mongoose.model("users", userSchema);
module.exports.UserModel = UserModel;
module.exports.ROLES = ROLES;
