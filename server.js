// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const companyRoutes = require("./routes/companyRoutes");
const authRoutes = require("./routes/authRoutes");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger/swaggerConfig");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();

// Health check routes
app.get("/health", (req, res) => {
  res.json({ status: "Backend is running!" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running!" });
});

// ✅ CORS configuration
const allowedOrigins = [
  "https://company-form.onrender.com",  // Render frontend
  "http://localhost:3000"               // For local dev
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Middleware
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("🚀 Company Management API Running");
});

// API routes
app.use("/api", companyRoutes);     // CRUD for companies
app.use("/api", authRoutes);        // Admin login & register

// Swagger API docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
