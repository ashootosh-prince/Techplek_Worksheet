const express = require("express");
const router = express.Router();
const { registerUser, loginUser, logoutUser, adminDashboard } = require("../controllers/authController");
const { authenticateToken, checkAdminRole } = require('../middleware/authMiddleware');


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

router.get("/admin-dashboard", authenticateToken, checkAdminRole, adminDashboard);


module.exports = router;