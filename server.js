const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// MongoDB connection string from environment variable
const mongoURI = process.env.MONGO_URI;

// Ensure the mongoURI is set in the environment variables
if (!mongoURI) {
  console.error("MONGO_URI is not set in environment variables");
  process.exit(1); // Exit the app if the environment variable is missing
}

// Connect to MongoDB
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB Atlas!');

    console.log("MongoDB connected to:", mongoose.connection.host);
    console.log("Using database:", mongoose.connection.name);
    // Middleware to parse incoming JSON data
    app.use(express.json());

    // Enable Cross-Origin Resource Sharing (CORS)
    app.use(cors({ 
        origin: ["http://localhost:3000","https://my-foodie-go.vercel.app"], credentials: true }));

    // Import routes (auth, restaurants, menu, customers, etc.)
    const authRoutes = require('./routes/auth');
    const restaurantRoutes = require('./routes/restaurants');
    const menuRoutes = require('./routes/menu');
    const customerRoutes = require('./routes/customerData');

    // Use routes
    app.use('/api/auth', authRoutes);
    app.use('/api/restaurants', restaurantRoutes);
    app.use('/api/menu', menuRoutes);
    app.use('/api/customers', customerRoutes);

    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err);
    process.exit(1); // Exit the app with an error code
  });


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

