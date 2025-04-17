const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser,getAllUsers, adminDashboard } = require("../controllers/authController");
const { authenticateToken, checkAdminRole } = require('../middleware/authMiddleware');


router.post("/register", registerUser);
router.post("/login", loginUser);
router.get('/users',getAllUsers);
router.post("/logout", logoutUser);

router.get("/admin-dashboard", authenticateToken, checkAdminRole, adminDashboard);

module.exports = router;