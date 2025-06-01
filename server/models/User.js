//models/User.js
const mongoose = require("mongoose");

const ROLES = {
  User: "User",
  Admin: "Admin",
};

const UserSchema = new mongoose.Schema({
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
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserProgress",
  },
});

const UserModel = mongoose.model("users", UserSchema);
module.exports.UserModel = UserModel;
module.exports.ROLES = ROLES;
