const express = require("express");
const router = express.Router();
const { createRole, assignRole } = require("../controllers/roleController");
const {authenticateToken, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/", authenticateToken, authorizeRoles("Admin"), createRole);
router.post("/assign", authenticateToken, authorizeRoles("Admin"),assignRole);

module.exports= router;