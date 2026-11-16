require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse URL-encoded bodies from HTML forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static frontend files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure Nodemailer transporter with Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD
    }
});

// POST endpoint to handle form submission
app.post('/subscribe', async (req, res) => {
    const userEmail = req.body.email;

    const mailOptions = {
        from: `"DEV@Deakin Insider" <${process.env.GMAIL_USER}>`,
        to: userEmail,
        subject: 'Welcome to DEV@Deakin!',
        text: 'Thank you for subscribing to our Daily Insider!',
        html: '<strong>Thank you for subscribing to our Daily Insider! We are excited to have you on board.</strong>',
    };

    try {
        // Send email asynchronously
        await transporter.sendMail(mailOptions);
        console.log(`Status:202: Welcome email successfully sent to ${userEmail}`);
        
        // Return successful status 200 message back to the frontend
        res.status(200).send(`
            <h2>Success!</h2>
            <p>Welcome email has been sent to ${userEmail}. Check your inbox!</p>
            <a href="/">Go back</a>
        `);
    } catch (error) {
        console.error('Error sending email:', error);
        // Send proper HTTP error response status code
        res.status(500).send('There was an error sending the welcome email. Please try again.');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`DEV@Deakin server running at http://localhost:${PORT}`);
});