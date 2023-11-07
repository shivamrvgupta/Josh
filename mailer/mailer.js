const nodemailer = require('nodemailer');
const fs = require('fs')



module.exports = {
    sendCustomMail : async (recipientEmail, subject, renderedEmailContent) => {
        // Create a transporter using your email provider's SMTP settings
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'joshfuels.india@gmail.com', // Replace with your Gmail email address
                pass: 'wwvvmxaagrubckyb', // Replace with your Gmail password or an app-specific password
            },
        });
    
        try {

            // Define the email message
            let mailOptions = {
                from: 'admin@joshfuels.com', // Sender's email address
                to: recipientEmail,
                cc: "accounts@joshfuels.com", // Recipient's email address
                subject: subject, // Subject of the email
                html: renderedEmailContent, // Use the HTML template content
            };
    
            // Send the email
            let info = await transporter.sendMail(mailOptions);
            console.log('Email sent: ' + info.response);
            console.log('Email : ' + mailOptions.to);
            return { success: true, message: 'Email sent successfully' };
        } catch (error) {
            console.error(error);
            return { success: false, error: 'Failed to send email' };
        }
    },
    verifyEmail: '../../../src/views/mail/email_verification.html',
    invoiceEmail: '../../../src/views/mail/invoice.html',
    
}