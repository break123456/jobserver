const nodemailer = require('nodemailer');

exports.sendMailUtil = async (subject, text, to) => {
     // Create a transporter using Gmail
     const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL, // Your Gmail address
            pass: process.env.PASSWORD, // Your Gmail password or app-specific password
        },
    });

    const mailOptions = {
        from: process.env.EMAIL,
        to: to,
        subject: subject,
        text: text,
    };

    try {
        await transporter.sendMail(mailOptions);
        return [true,  'Email sent successfully'];

    } catch (error) {
        console.error(error);
        return [false, error];
    }
}

exports.isEmailValid = (email) => {
 // Verify email format (basic validation)
 const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
 if (!email || !emailRegex.test(email)) {
    return false;
 }
 return true;
}