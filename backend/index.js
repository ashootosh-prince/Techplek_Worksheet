require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRouters");
const cors = require('cors');
const Role = require("../backend/models/RoleModel")

const app = express();

// Middleware
app.use(express.json());
app.use(cors());


//database connection
// mongoose.connect(process.env.DB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => console.log("database connected"))
// .catch(err => 
//     console.log("database connection error", err)
// );

mongoose.connect('process.env.DB_URL', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    // Check if the 'admin' role already exists
    const adminRole = await Role.findOne({ name: 'admin' });

    if (!adminRole) {
      // Create the admin role if it doesn't exist
      await Role.create({
        name: 'admin',
        permissions: ['create', 'update', 'delete', 'view']  // Adjust permissions as necessary
      });
      console.log('Admin role created');
    } else {
      console.log('Admin role already exists');
    }

    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));