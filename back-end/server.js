const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

// Import routes
const vehicleRoutes = require("./routes/vehicleRoutes");
const accidentRoutes = require("./routes/accidentRoutes");
const cors = require("cors");

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(express.json());

// Welcome route
app.use(cors());

// Welcome route
app.get("/", (req, res) => {
  res.send(
    "Welcome to Car Accident Prevention and Emergency Response System API"
  );
});

// Swagger documentation setup
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// Use routes
app.use("/api", vehicleRoutes);
app.use("/api", accidentRoutes);

// Connect to MongoDB
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost/car_accident_system";
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(
    `Swagger documentation available at http://localhost:${PORT}/api-docs`
  );
  console.log(
    "Car Accident Prevention and Emergency Response System API is online"
  );
});
