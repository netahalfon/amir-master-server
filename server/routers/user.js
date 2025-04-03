const userRouter = require("express").Router();
const UserModel = require('../models/User');
const sendEmail = require('../utils/sendMail');


// signUp
userRouter.post('/signUp', async (req, res) => {
    try{
        //chack if user already exists
        const {email}= req.body;
        const existingUser = await UserModel.findOne({email: email})
        if(existingUser){
            return res.status(400).json({message: 'User with this email already exists'});
        }
        //create new user
        const user = await UserModel.create(req.body);
        return res.status(200).json(user);
    }catch(err){
        return res.status(500).json({message:err.message});
    } 
});

// login
userRouter.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (user.password === password) {
                    res.status(200).json(user);
                } else {
                    res.status(401).json({ message: 'The password is incorrect ' });
                }
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});

// forgot password
userRouter.post('/forgotPassword', (req, res) => {
    const { email } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                sendEmail(user.email, user.password); 
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});


exports.userRouter = userRouter;