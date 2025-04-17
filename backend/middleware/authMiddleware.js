require('dotenv').config()
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.sendStatus(401);

    try {
        const decoded = jwt.verify(token, process.env.secret_key);
        req.user = await User.findById(decoded.id).populate("roles");
        if (!req.user) {
            return res.sendStatus(404);
        }
        next(); 
    } catch (err) {
        return res.sendStatus(403);
    }
};

const checkAdminRole = (req, res, next) => {
    const user = req.user;

    const isAdmin = user.roles.some(role => role.name === 'Admin');  // Check if user has Admin role

    if (!isAdmin) {
        return res.status(403).json({ message: 'Access Denied: You do not have admin privileges' });
    }

    next();
};

const authorizeRoles = ( ...allowedRoles) => {
    return (req, res, next) => {
        const userRoles = req.user.roles.map(role => role.name);
        if (!allowedRoles.some(role => userRoles.includes(role))) {
            return res.status(403).json({message: "Access denied"});
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRoles, checkAdminRole };