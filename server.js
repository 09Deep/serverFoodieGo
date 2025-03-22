  const express = require('express');
  const mongoose = require('mongoose');
  const cors = require('cors');
  const app = express();
  
  //  MongoDB Atlas connection string
  //  const uri = 'mongodb+srv://deep09:Janvi@2121525@cluster0.uog30.mongodb.net/';
  //  const uri = "mongodb+srv://deep09:Janvi@2121525@cluster0.mongodb.net/FoodDeliveryMFG?retryWrites=true&w=majority";
const uri = 'mongodb+srv://deep09:Janvi%402121525@cluster0.uog30.mongodb.net/FoodDeliveryMFG';

//  mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  mongoose.connect(uri)

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

// const express = require('express');
// const mongoose = require('mongoose');
// const app = express();
// const PORT = 5000;

// // Middleware to parse JSON
// app.use(express.json());

// // Basic route
// app.get('/', (req, res) => {
//     res.send('Hello, World!');
// });

// // Start server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });

////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const authRoutes = require('./routes/auth'); // Import auth routes

// const app = express();
// app.use(express.json()); // Ensure JSON parsing
// app.use(cors()); // Enable CORS

// // Routes
// app.use('/api/auth', authRoutes); // ✅ Correct path for authentication

// const PORT = 5000;

// // MongoDB Connection
// mongoose.connect('mongodb+srv://deep09:Janvi@2121525@cluster0.uog30.mongodb.net/', {
// }).then(() => {
//     console.log('Connected to MongoDB Atlas!');
//     app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }).catch(err => console.error('Could not connect to MongoDB:', err));
