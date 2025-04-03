const nodemailer = require('nodemailer');


async function sendEmail(userEmail, userPassword) {
    //הגדרת חשבון המייל השולח
        const transporter = nodemailer.createTransport({
            service: 'gmail', 
            auth: {
                user:'neta303366@gmail.com',
                pass: 'vyyr cgqq sgqz ilkd'
                // user: 'amirneta.lerning@gmail.com',
                // pass: 'AmirnetA05022009'
            }
        });
    
        // הגדרת  המייל
        const mailOptions = {
            from: 'neta303366@gmail.com',
            to: userEmail,                
            subject: 'Password Recovery - amirneta', 
            text: `Your password on amirneta is: ${userPassword}` 
        };
    
        try {
            // שליחת המייל
            await transporter.sendMail(mailOptions);
            console.log('Email sent successfully');
            return true;
        } catch (error) {
            console.error('Error sending email: ', error);
            return false;
        }
    }
    
    
module.exports = sendEmail;