const jwt = require("jsonwebtoken");
const { UserModel, ROLES } = require("../models/User");

const authonticateToken = (req, res, next) => {
  const accessToken = req.cookies?.accessToken; // Extract token from cookies
  if (accessToken == null) return res.sendStatus(401);//אין אקקסס טוקן 

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.sendStatus(401);//הטוקן לא תקין
      req.user = await UserModel.findById(decoded._id);//הטוקן תקין עוברים הלאה
      next();
    }
  );
};

const adminAccess = (req, res, next) => {
  if (req.user && req.user.role == ROLES.Admin) {
    next();
  } else {
    res.status(403).json({ error: "Access denied: Admins only." });
  }
};
exports.authonticateToken = authonticateToken;
exports.adminAccess = adminAccess;
