const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,  // Corrected from 'require' to 'required'
    unique: true
  },
  permissions: [{
    type: String,
    enum: ['create', 'update', 'delete', 'view'],  // Example permissions
    default: ['view'],  // Set a default permission
  }]
});

module.exports = mongoose.model("Role", roleSchema);
