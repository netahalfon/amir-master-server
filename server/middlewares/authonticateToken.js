const jwt = require('jsonwebtoken');
const {UserModel,ROLES} = require('../models/User');

const authonticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const access_token = authHeader && authHeader.split(' ')[1];
    if (access_token == null) return res.sendStatus(401); 

    jwt.verify(access_token, process.env.ACCESS_TOKEN_SECRET,async (err, decoded) => {
        if (err) return res.sendStatus(403); 
        req.user = await UserModel.findById(decoded._id);
        next();
    });
}
const adminAccess = (req, res, next) => {
    if(req.user && req.user.role == ROLES.Admin){
        next();
    }
    else {
        res.status(403).json({ error: 'Access denied: Admins only.' });
    }   
}

exports.authonticateToken = authonticateToken;
exports.adminAccess = adminAccess;