const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
    id: {type: Number, required:true},
    name: { type: String, required: true },
    location: { type: String, required: true },
    rating: { type: Number, required: true, min: 0, max: 5 },
    contact: { type: Number, required: true }
    // You can add other fields as per your restaurant data
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;
