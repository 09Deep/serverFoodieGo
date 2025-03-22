const express = require('express');
const router = express.Router();
const Menu = require('../models/menu');  // Assuming you have a Menu model

// GET /api/menu/:restaurantId
router.get('/:restaurantId', async (req, res) => {
    try {
        const restaurantId = Number(req.params.restaurantId);
        console.log("Fetching the menu for restaurant", restaurantId);
        console.log("type of restID is ",typeof(restaurantId));

        const menu = await Menu.findOne({ restID: restaurantId });  // Fetch the menu based on restaurantId
        console.log("Found the restaurant menu ",menu );
        
        res.status(200).json(menu);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching menu', error: err });
    }
});

module.exports = router;


// const express = require("express");
// const router = express.Router();
// const Menu = require("../models/Menu"); // Assuming your menu schema is in models/Menu.js

// // Get menu by restaurant ID
// router.get("/menu/:restID", async (req, res) => {
//     try {
//         const restID = parseInt(req.params.restID);
//         const restaurantMenu = await Menu.findOne({ restID });

//         if (!restaurantMenu) {
//             return res.status(404).json({ message: "Restaurant not found" });
//         }

//         res.json(restaurantMenu.menu);
//     } catch (error) {
//         console.error("Error fetching menu:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// });

// module.exports = router;
