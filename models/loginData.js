// const mongoose = require('mongoose');

// const loginDataSchema = new mongoose.Schema({
//     username: { type: String, required: true, unique: true },
//     password: { type: String, required: true }, // It's important to hash the password in practice!
//     email: { type: String, required: true },
//     createdAt: { type: Date, default: Date.now },
//     updatedAt: { type: Date, default: Date.now }
// });

// const LoginData = mongoose.model('LoginData', loginDataSchema);

// module.exports = LoginData;

/////////////////////////////////////////////////////////////////////////////////////////////

// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');

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

/////////////////////////////////////////////////////////////////////////////////////////////////////

const mongoose = require('mongoose');

// Define the schema
const loginDataSchema = new mongoose.Schema({
    //username: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true }, // Plain text for now
    email: { type: String, required: true },
    cid: { type: String, required:true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const LoginData = mongoose.model('LoginData', loginDataSchema,'loginData');

module.exports = LoginData;

