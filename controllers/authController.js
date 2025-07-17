const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const trimmedEmail = email.trim().toLowerCase();
    const admin = await Admin.findOne({ email: trimmedEmail });
    
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" }); // 401 instead of 404
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Login failed" });
  }
};

// Admin Register
exports.createAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const trimmedEmail = email.trim().toLowerCase();
    
    // Check if admin exists
    const existing = await Admin.findOne({ email: trimmedEmail });
    if (existing) {
      return res.status(409).json({ message: "Admin already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create and save admin
    const newAdmin = new Admin({ 
      email: trimmedEmail, 
      password: hashedPassword 
    });
    
    await newAdmin.save();

    res.status(201).json({ message: "Admin registered successfully" });
  } catch (err) {
    console.error("Registration Error:", err);
    
    // Handle duplicate key error
    if (err.code === 11000) {
      return res.status(409).json({ message: "Admin already exists" });
    }
    
    res.status(500).json({ error: "Registration failed" });
  }
};