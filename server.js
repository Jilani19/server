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

<<<<<<< HEAD
// Health check endpoint for backend
=======
// Health check routes
app.get("/health", (req, res) => {
  res.json({ status: "Backend is running!" });
});

>>>>>>> e116614f7b3f08e961e7675d4efde3f6e2ad9fca
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running!" });
});

// ✅ CORS configuration
const allowedOrigins = [
  "https://company-form.onrender.com", // Render frontend
  "http://localhost:3000",             // Local dev
];

<<<<<<< HEAD
const corsOptions = {
=======
app.use(cors({
>>>>>>> e116614f7b3f08e961e7675d4efde3f6e2ad9fca
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.error("❌ Blocked by CORS:", origin);
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

app.use(cors(corsOptions));

// Preflight OPTIONS request handler
app.options("*", cors(corsOptions));

// Middleware
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("🚀 Company Management API Running");
});

// API routes
app.use("/api", companyRoutes); // CRUD for companies
app.use("/api", authRoutes);    // Admin login & register

// Swagger API docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
