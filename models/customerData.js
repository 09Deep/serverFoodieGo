const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    addressLine1: { type: String, required: true },
    addressLine2: { type: String }, // Optional
    city: { type: String, required: true },
    province: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true }
});


const customerDataSchema = new mongoose.Schema({
    cid: { type: String, ref: 'LoginData', required: true }, // Reference to LoginData
    activeCart: [
        {
            restaurantId: Number,
            restaurantName: String,
            items: [
                {
                    itemId: Number,
                    itemName: String,
                    quantity: Number,
                    price: Number
                }
            ]
        }
    ],
    orderHistory: [
        {
            orderId: { type: Number, required: true },
            restaurantName: { type:String, required:true },
            restaurantId: { type: Number, required: true },
            orderDetails: { type: Array, required: true }, // The details of the items in the order
            totalAmount: { type: Number, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    likedRestaurants: [{ type: Number}],  // Array of liked restaurants (referencing restaurant IDs)
    creditCards: [{ type: String }],
    addresses: [addressSchema]
}, {
    collection: "customerData", 
    timestamps: true
});

const CustomerData = mongoose.model('CustomerData', customerDataSchema);

module.exports = CustomerData;
