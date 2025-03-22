// server/routes/customerData.js
const express = require('express');
const CustomerData = require('../models/customerData');  // Model for customer data
const router = express.Router();


// Get customer data by ID
router.get("/:cid", async (req, res) => {
  try {
      const customer = await CustomerData.findOne({ cid: req.params.cid });
      if (!customer) return res.status(404).json({ message: "Customer not found" });
      res.json(customer);
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
});

// GET /api/customers/:cid/liked-restaurants
router.get("/:cid/liked-restaurants", async (req, res) => {
    try {
        console.log("GET /api/customers/:cid/liked-restaurants");

        const cid = req.params.cid.trim();  // Remove extra spaces
        console.log("GET - Fetch liked restaurant for CID:", cid);
  
        const customer = await CustomerData.findOne({ cid: cid });  // Ensure case-sensitive match
        console.log("GET - Found customer:", customer);
        console.log("GET - List of liked rest",customer.likedRestaurants);
  
        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }
  
        res.status(200).json({ likedRestaurants: customer.likedRestaurants });
    } catch (error) {
        console.error("Error fetching liked restaurants:", error);
        res.status(500).json({ message: "Server error" });
    }
  });
  

// Add a liked restaurant
router.post("/:cid/liked-restaurants", async (req, res) => {
  try {
      console.log("POST /api/customers/:cid/liked-restaurants");

      const { restaurantId } = req.body;
      console.log("POST - req to like restaurant",restaurantId);
      console.log("POST - Type of restID",typeof(restaurantId));

      const customer = await CustomerData.findOne({ cid: req.params.cid });
      console.log("POST - This customer liked this restaurant", customer);  

      if (!customer) return res.status(404).json({ message: "Customer not found" });

      if (!customer.likedRestaurants.includes(restaurantId)) {
          console.log("POST - Adding restaurant liked restaurants");
          customer.likedRestaurants.push(restaurantId);
          await customer.save();
      }
      res.json({ message: "Restaurant added to liked list", likedRestaurants: customer.likedRestaurants });
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
});

// Remove a liked restaurant
router.delete("/:cid/liked-restaurants/:restaurantId", async (req, res) => {
  try {
      console.log("DELETE /api/customers/:cid/liked-restaurants/:restaurantId");

      const customer = await CustomerData.findOne({ cid: req.params.cid });
      console.log("DELETE - Found customer in the list")
      if (!customer) return res.status(404).json({ message: "Customer not found" });

      customer.likedRestaurants = customer.likedRestaurants.filter(id => id !== req.params.restaurantId);
      await customer.save();

      console.log("DELETE - Successfully Rest removed (Disliked)");
      res.json({ message: "Restaurant removed", likedRestaurants: customer.likedRestaurants });
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
});

// Add item to cart
router.post("/:cid/cart", async (req, res) => {
    try {
        console.log("POST api/customers/:cid/cart");
        const { restaurantId : restaurantIdStr, restaurantName, itemId, itemName, newQuantity : quantity, price} = req.body;
        const restaurantId = Number(restaurantIdStr);
        
        console.log("  This is the request",req.body);
        console.log("  Number of QUANTITY IS ---", quantity);
        console.log("  Type of QUANTITY IS ---",typeof quantity );
        console.log("  Price of item is ",price);
        console.log("  Type of that price is", typeof price);


        console.log("  Finding customer");
        const customer = await CustomerData.findOne({ cid: req.params.cid });
        console.log("  Customer found", customer);
        
        
        if (!customer) return res.status(404).json({ message: "Customer not found" });
        
        console.log("  Type of restaurantID is",typeof restaurantId);

        let restaurantCart = customer.activeCart.find(cart => cart.restaurantId === restaurantId);
        console.log("  This is the Cart",restaurantCart);


        if (!restaurantCart) {
                console.log("  Nothing from this particular rest in the cart")
            customer.activeCart.push({
                restaurantId,
                restaurantName,
                items: [{ itemId, itemName, quantity, price }]
            });
        } else {
            let item = restaurantCart.items.find(i => i.itemId === itemId);
            if (item) {
                    console.log("  Found the same item in the cart, increase quantity");
                    item.quantity += 1;
            } else {
                    console.log("  Add item to the cart");
                restaurantCart.items.push({ itemId, itemName, quantity });
            }
        }

        await customer.save();
        res.json({ message: "Item added to cart", activeCart: customer.activeCart });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});


// GET active cart for a given customer ID (cid)
router.get("/:cid/cart", async (req, res) => {
    try {
      console.log("GET api/customers/:cid/cart");  
      const customer = await CustomerData.findOne({ cid: req.params.cid }, { activeCart: 1, _id: 0 });
      
      if (!customer) {
        return res.status(404).json({ message: "Customer not found" });
      }

      console.log("   Found the customer",customer);
      res.status(200).json({ activeCart: customer.activeCart });
    } catch (error) {
      console.error("Error fetching active cart:", error);
      res.status(500).json({ message: "Server error" });
    }
  });
  

// Decrease quantity of an item in cart
router.patch("/:cid/cart/:restaurantId/:itemId/decrease", async (req, res) => {
    try {

        console.log("PATCH  api/customers/:cid/cart/:restaurantId/:itemId/decrease");

        const customer = await CustomerData.findOne({ cid: req.params.cid });

        if (!customer) return res.status(404).json({ message: "Customer not found" });
  
        console.log("  Customer Found",customer);
  
        // Find restaurant cart
        //let restaurantCart = customer.activeCart.find(cart => cart.restaurantId === restaurantId);
        const restaurantId = Number(req.params.restaurantId);
        const itemId = Number(req.params.itemId);
        

        let restaurantCart = customer.activeCart.find(cart => cart.restaurantId === restaurantId);
        if (!restaurantCart) return res.status(404).json({ message: "Restaurant cart not found" });
  
        console.log("  Restaurant cart found",restaurantCart);
        

        // Find the item inside the restaurant's cart
        let itemIndex = restaurantCart.items.findIndex(i => i.itemId === req.params.itemId);
        // if (itemIndex === -1) return res.status(404).json({ message: "Item not found in cart" });
        let item = restaurantCart.items.find(i => i.itemId === itemId);
        if(!item) return res.status(404).json({ message: "Item not found in cart" });

        console.log("  We found the item", item);
        // Decrease quantity by 1
        if (item.quantity > 1) {

            console.log("  quantity is more than 1, current is",item.quantity);
            item.quantity -= 1;
        } else {
            // If quantity is 1, remove the item completely
            console.log("  quantity is 1, removing item completely, current quantity",item.quantity);
            restaurantCart.items.splice(itemIndex, 1);
        }
  
        // If the restaurant cart is empty after updating, remove the restaurant from activeCart
        if (restaurantCart.items.length === 0) {
            customer.activeCart = customer.activeCart.filter(cart => cart.restaurantId !== req.params.restaurantId);
        }
  
        await customer.save();
        res.json({ message: "Quantity decreased", activeCart: customer.activeCart });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});  


// Remove item from cart
router.delete("/:cid/cart/:restaurantId/:itemId", async (req, res) => {
  try {
      const customer = await CustomerData.findOne({ cid: req.params.cid });
      if (!customer) return res.status(404).json({ message: "Customer not found" });

      console.log("  Customer FOund");

      const restaurantId = Number(req.params.restaurantId);
      const itemId = Number(req.params.itemId);

      // Find an item from a given restaurantID
      let restaurantCart = customer.activeCart.find(cart => cart.restaurantId === restaurantId);

      console.log("  This is restaurant cart", restaurantCart);

      if (restaurantCart) {
          restaurantCart.items = restaurantCart.items.filter(i => i.itemId !== itemId);
          if (restaurantCart.items.length === 0) {
              customer.activeCart = customer.activeCart.filter(cart => cart.restaurantId !== restaurantId);
          }
      }

      await customer.save();
      res.json({ message: "Item removed from cart", activeCart: customer.activeCart });
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
});

// Clear entire cart
router.delete("/:cid/cart", async (req, res) => {
  try {
      const customer = await CustomerData.findOne({ cid: req.params.cid });
      if (!customer) return res.status(404).json({ message: "Customer not found" });

      customer.activeCart = [];
      await customer.save();
      res.json({ message: "Cart cleared", activeCart: customer.activeCart });
  } catch (error) {
      res.status(500).json({ message: "Server error" });
  }
});

// 🚀 Add a new credit card
router.post('/:customerId/credit-cards', async (req, res) => {
    try {
        const { customerId } = req.params;
        const { cardNumber } = req.body;

        console.log("POST api/:customerId/credit-cards");
        console.log("   This is the customerId ",customerId);
        console.log("   This is the card Number ",cardNumber);
        console.log("   type of cardNumber ",typeof cardNumber);

        // Validate input
        if (!cardNumber) {
            return res.status(400).json({ message: "Credit card number is required." });
        }

        // Find the customer and update their creditCards array
        const customer = await CustomerData.findOneAndUpdate(
            { cid: customerId },
            { $addToSet: { creditCards: cardNumber } }, // Prevent duplicate cards
            { new: true }
        );

        console.log("   Customer Found",customer);

        if (!customer) {
            return res.status(404).json({ message: "Customer not found." });
        }

        res.json({ message: "Credit card added successfully!", creditCards: customer.creditCards });
    } catch (error) {
        console.error("Error adding credit card:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// 🚀 Remove a credit card
router.delete('/:customerId/credit-cards/:cardNumber', async (req, res) => {
    try {
        const { customerId, cardNumber } = req.params;

        // Find the customer and remove the card from the creditCards array
        const customer = await CustomerData.findOneAndUpdate(
            { cid: customerId },
            { $pull: { creditCards: cardNumber } }, // Remove specific card
            { new: true }
        );

        if (!customer) {
            return res.status(404).json({ message: "Customer not found." });
        }

        res.json({ message: "Credit card removed successfully!", creditCards: customer.creditCards });
    } catch (error) {
        console.error("Error removing credit card:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get('/:customerId/credit-cards', async (req, res) => {
    
    try {
       
        console.log("GET  api/customers/:customerId/cards");
        const { customerId } = req.params;
        console.log("   This is the customerID ",customerId);
        let customer = await CustomerData.findOne({ cid: customerId });
        console.log(" This is the customer ",customer);
        if (!customer) {
            return res.status(404).json({ message: "Customer not found." });
        }

        // Ensure an empty array is returned instead of null/undefined
        res.json({ paymentMethod: customer.creditCards || [] });

    } catch (error) {
        console.error("Error fetching credit cards:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/:customerId/addresses", async (req, res) => {
    try {
        console.log("GET api/customers/:customerId/addresses");

        const { customerId } = req.params;
        const customer = await CustomerData.findOne({ cid: customerId });

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        console.log("   Found customer:", customer);
        res.json({ addresses: customer.addresses || [] });

    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


router.post("/:customerId/addresses", async (req, res) => {
    try {
        console.log("POST api/customers/:customerId/addresses");

        const { customerId } = req.params;
        const newAddress = req.body;

        console.log("   Customer ID:", customerId);
        console.log("   New Address:", newAddress);

        if (!newAddress || Object.keys(newAddress).length === 0) {
            return res.status(400).json({ message: "Address data is required." });
        }

        const customer = await CustomerData.findOneAndUpdate(
            { cid: customerId },
            { $push: { addresses: newAddress } },
            { new: true }
        );

        if (!customer) {
            return res.status(404).json({ message: "Customer not found" });
        }

        console.log("   Updated Customer:", customer);
        res.status(200).json({ message: "Address added successfully", addresses: customer.addresses });

    } catch (error) {
        console.error("Error adding address:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});


module.exports = router;
