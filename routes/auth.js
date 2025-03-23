// const express = require('express');
// const router = express.Router();

// // POST /api/auth/login
// router.post('/login', (req, res) => {
//     const { username, password } = req.body;

//     // Example: Authenticate user logic (this should interact with your MongoDB)
//     // For now, return a dummy response.
//     if (username === 'admin' && password === 'password') {
//         res.status(200).json({ message: 'Login successful' });
//     } else {
//         res.status(400).json({ message: 'Invalid credentials' });
//     }
// });

// module.exports = router;


//////////////////////////////////////////////////////////////////////////

// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs'); // Use bcryptjs instead of bcrypt

// // Define the schema
// const loginDataSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     email: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now }
// });

// // Hash the password before saving
// loginDataSchema.pre('save', async function (next) {
//     if (!this.isModified('password')) return next();

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(this.password, 10);
//     this.password = hashedPassword;
//     next();
// });

// // Method to compare passwords
// loginDataSchema.methods.comparePassword = async function (candidatePassword) {
//     return bcrypt.compare(candidatePassword, this.password);
// };

// const LoginData = mongoose.model('LoginData', loginDataSchema);

// module.exports = LoginData;


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs'); // Ensure this is installed
// const LoginData = require('../models/loginData'); // Correct model path

// // POST /api/auth/login
// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
        
//         // 1️⃣ Check if user exists
//         const user = await LoginData.findOne({ username });
//         if (!user) {
//             return res.status(400).json({ message: 'Invalid username or password' });
//         }

//         // 2️⃣ Compare password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: 'Invalid username or password' });
//         }

//         // 3️⃣ Login successful
//         res.status(200).json({ message: 'Login successful', userId: user._id });

//     } catch (error) {
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// });

// module.exports = router;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const express = require('express');
// const router = express.Router();
// //const bcrypt = require('bcryptjs');
// const LoginData = require('../models/loginData');

// // POST /api/auth/login
// router.post('/login', async (req, res) => {
//     const { email, password } = req.body;  // Accept email instead of username

//     try {
//         // Check if user exists by email
//         const user = await LoginData.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

    
//         // Compare plain text password with stored password (if storing hashed, use bcrypt.compare)
//         if (password !== user.password) {  // If passwords are NOT hashed
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         // Login successful, return cid along with success message
//         res.status(200).json({ 
//             message: "Login successful",
//             cid: user.cid  // Send back the customer ID
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// module.exports = router;


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const express = require("express");
// const router = express.Router();
// const LoginData = require("../models/loginData"); // Ensure correct path
// //const bcrypt = require('bcryptjs');

// router.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;
        
//         // Log received data
//         console.log("Received login request:", email, password);

//         // Find user by email
//         const user = await LoginData.findOne({ email });

//         // Log the retrieved user
//         console.log("Found user:", user);

//         if (!user) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         // Check password (plain text comparison)
//         if (user.password !== password) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         res.status(200).json({ message: "Login successful" });

//     } catch (error) {
//         console.error("Login error:", error);
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// });


// module.exports = router;

const express = require("express");
const router = express.Router();
const LoginData = require("../models/loginData"); // Ensure correct path

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log("Received login request:", email, password);

    try {
        // Debug: Log the search query
        console.log("Searching for:",  email );

        // Find user by email
        const user = await LoginData.findOne( { email: new RegExp(`^${email}$`, "i") } );

        // Debug: Log found user
        console.log("Found user:", user);
        console.log("User's password :",user.password);
        console.log("User's cid is :",user.cid);
        console.log("user's _id is :", user._id);

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Compare password (no hashing for now)
        if (password !== user.password) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.status(200).json({ 
            message: "Login successful",
            customerID:user.cid 
        });

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
