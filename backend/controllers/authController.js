const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const Role = require("../models/RoleModel");

exports.registerUser = async (req, res) => {
    const { username, password, isAdmin } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }
  
    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ username });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
      }
  
      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Find or create the required roles
      const roles = [];
      if (isAdmin) {
        const adminRole = await Role.findOne({ name: 'admin' });
        if (!adminRole) {
          return res.status(400).json({ message: 'Admin role not found.' });
        }
        roles.push(adminRole._id);
      } else {
        const userRole = await Role.findOne({ name: 'user' });
        if (!userRole) {
          return res.status(400).json({ message: 'User role not found.' });
        }
        roles.push(userRole._id);
      }
  
      // Create a new user
      const newUser = new User({
        username,
        password: hashedPassword,
        roles  // Assign roles based on isAdmin
      });
  
      await newUser.save();
  
      return res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Something went wrong. Please try again.' });
    }
  };


exports.loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
         const user = await User.findOne({ username }).populate("roles");
         if (!user) return res.status(400).json({ message: "Invalid credentials" });

         const isMatch = await bcrypt.compare(password, user.password);
         if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

         const token = jwt.sign(
             { id: user._id }, 
             process.env.secret_key, 
             { expiresIn: "1h" }
         );

         return res.json({ token });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


  exports.adminDashboard = async (req, res) => {
    try {
        // Only admins can access this, so fetch all users
        const users = await User.find().populate("roles");
        const userList = users.map(user => ({
            _id: user._id,
            username: user.username,
            roles: user.roles.map(role => role.name),
        }));

        // Send the users list to the admin dashboard
        res.json({ users: userList });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users for admin dashboard' });
    }
};


exports.logoutUser = (req, res) => {
    res.json({ message: "Logged out successfully" });
};
