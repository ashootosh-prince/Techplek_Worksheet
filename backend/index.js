require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const roleRoutes = require("./routes/roleRouters");
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());


//database connection
mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("database connected"))
.catch(err => 
    console.log("database connection error", err)
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));