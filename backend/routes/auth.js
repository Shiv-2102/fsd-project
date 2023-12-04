const express = require('express'); // Imported express and router
const router = express.Router();
const User = require('../models/User'); // Imported Schema to Create User
const nodemailer = require('nodemailer'); // Imported NodeMailer to Send OTP via email
const { body, validationResult } = require('express-validator'); // Express Validator
// BCryptJs for Hashing Password
const bcrypt = require('bcryptjs');

// JSON WEB TOKEN to generate tokens for users
const jwt = require('jsonwebtoken');

// Middleware to fetch user details for endpoints that require loggedin user
const fetchuser = require('../middleware/fetchuser');


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


// Route 1: Validating and Saving User Credentials
router.post('/createuser', [
    body('username').isLength({ min: 5 }),
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 8 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    //checking if a user with the provided username already exists 
    try {
        let success = false;
        // Check if user with the entered username already exists
        let user = await User.findOne({ username: req.body.username });
        if (user) {
            return res.status(400).json({ error: "A User with this username already exists!" });
        }

        let user2 = await User.findOne({ email: req.body.email });
        if (user2) {
            return res.status(400).json({ error: "A User with this email already exists!" });
        }

        // Adding Salt to password for high security
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // If the email doesn't exist:
        user = await User.create({
            username: req.body.username,
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });

        // Generate token by sign function of JWT using ID and SECRET MESSAGE 
        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, process.env.JWT_SECRET);
        success = true;
        res.json({ success, authToken });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});


// Route 2: Login END point using username and password
router.post('/login', [
    body('username', "Please Enter a Valid Username!").isLength({ min: 5 }),
    body('password', "Password Can not be blank!").exists(),

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }

    //Extracting username and password from body
    const { username, password } = req.body;

    try {
        let success = false;
        // Check if user exists in database
        let user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json("Please Enter Correct User Credentials!");
        }

        // Comparing passwords using bycrpt 
        const passCompare = await bcrypt.compare(password, user.password);
        if (!passCompare) {
            return res.status(400).json("Please Enter Correct User Credentials!");
        }

        // Generate token by sign function of JWT using ID and SECRET MESSAGE 
        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, process.env.JWT_SECRET);
        success = true;
        res.json({ success, authToken });
    }

    catch (error) {
        res.status(500).send("Server Error! Please Try Again");
    }

}
);

// Route 3: Get Loggedin User details
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        let userId = req.user.id;
        const user = await User.findById({ _id: userId }).select("-password");
        res.send(user);
    }
    catch (error) {
        res.status(500).send("Internal Server Error!");
    }
});

// Route 4: Reset Password (Requires Authentication)
router.post('/sendotp', [
    body('email').isEmail(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let success = false;
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const OTP = generateOTP();

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset OTP for CloudBook',
            text: `Your OTP for password reset is: ${OTP}`,
        }

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return res.status(500).json({ success: false, error: 'Failed to send OTP' });
            } else {
                user.otp = OTP;
                user.save();

                res.status(200).json({ success: true, message: 'OTP sent to your email' });
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});


// Route 5: Verify OTP
router.post('/verifyotp', [
    body('email').isEmail(),
    body('otp').isNumeric().isLength({ min: 6, max: 6 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let success = false;
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP' });
        }

        res.status(200).json({ success: true, message: 'OTP verified successfully' });
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

// Route 6: Reset Password for OTP-verified users
router.post('/resetpassword', [
    body('otp').isNumeric().isLength({ min: 6, max: 6 }),
    body('newPassword').isLength({ min: 8 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { otp, newPassword } = req.body;
        const user = await User.findOne({ otp });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        user.otp = null;


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);


        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ success: true, message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
});


module.exports = router;
