const mongoose = require('mongoose');

// Define the structure of a menu item
const menuItemSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    restID: {type: Number, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    // You can add other properties like category (e.g., pizza, salad)
});

// Define the menu schema, which contains an array of items
const menuSchema = new mongoose.Schema({
    restaurantId: { type: Number, ref: 'restaurants', required: true }, // Reference to the restaurant
    items: [menuItemSchema],  // Array of menu items
}, {
    timestamps: true
});

const Menu = mongoose.model('Menu', menuSchema,'menu');

module.exports = Menu;




