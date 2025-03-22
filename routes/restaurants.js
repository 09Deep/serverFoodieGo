const express = require('express');
const router = express.Router();
const Restaurant = require('../models/restaurants');  // Assuming you have a Restaurant model

// GET /api/restaurants
router.get('/', async (req, res) => {
    try {
        const restaurants = await Restaurant.find();  // Fetch all restaurants from MongoDB
        res.status(200).json(restaurants);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching restaurants', error: err });
    }
});

// ✅ NEW: GET /api/restaurants/:id - Fetch restaurant by ID
router.get('/:id', async (req, res) => {
    try {
        console.log("GET api/restaurants/:id");
        console.log("The type of id is ",typeof(req.params.id));
        const restaurant = await Restaurant.findOne({id : Number(req.params.id)});  // Find restaurant by ID

        
        console.log("Fetched restaurant is ", restaurant);

        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        res.status(200).json({ name: restaurant.name });  // Return only the name
    } catch (err) {
        res.status(500).json({ message: 'Error fetching restaurant', error: err });
    }
});

module.exports = router;
