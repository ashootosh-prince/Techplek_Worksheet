const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");
const Role = require("../models/RoleModel");

exports.registerUser = async (req, res) => {
    const { username, password, isAdmin } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });

        if (isAdmin) {
            let adminRole = await Role.findOne({ name: 'Admin' });
            if (!adminRole) adminRole = await Role.create({ name: 'Admin', permissions: ['create', 'read', 'update', 'delete'] });

            user.roles = [adminRole._id]; // Assign admin role to the user
        }

        await user.save();
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        res.status(500).json({ message: error.message });
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

exports.getAllUsers = async (req, res) => {
    try {
      const users = await User.find().populate("roles"); 
      const userList = users.map(user => ({
        _id: user._id,
        username: user.username,
        roles: user.roles.map(role => role.name) 
      }));
      res.json({ users: userList });
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
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
