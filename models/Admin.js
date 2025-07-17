const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,      // Add this to auto-trim spaces
    lowercase: true  // Add this to store in lowercase
  },
  password: { 
    type: String, 
    required: true 
  }
}, { timestamps: true }); // Add timestamps for created/updated

module.exports = mongoose.model("Admin", adminSchema);