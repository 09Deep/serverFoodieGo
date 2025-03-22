const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

//  MongoDB Atlas connection string


const mongoURI = process.env.MONGO_URI;

//  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connect(mongoURI)

  .then(() => console.log('Connected to MongoDB Atlas!'))
  .catch((err) => console.error('Could not connect to MongoDB:', err));

// Middleware to parse incoming JSON data
app.use(express.json());

// Enable Cross-Origin Resource Sharing (CORS)
//app.use(cors());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
// app.use((req, res, next) => {
//   res.setHeader("Content-Security-Policy", "default-src 'self'; connect-src 'self' http://localhost:3000");
//   next();
// });
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

