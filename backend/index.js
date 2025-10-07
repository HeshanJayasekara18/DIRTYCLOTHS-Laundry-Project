const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("./db/db");
const OrderRoute = require("./route/OrderRoute");
const PackageRoute = require("./route/PackageRoute");
const authRoutes = require("./route/auth");
const ContactRoute = require("./route/ContactRoute");

dotenv.config(); // Load environment variables

// Validate required environment variables
if (!process.env.JWT_SECRET) {
  console.error("Error: JWT_SECRET is not defined in .env");
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS setup for multiple origins
const allowedOrigins = [
  "http://localhost:3000",
  "https://dirtyclothslaundry.netlify.app"
];

app.use(cors({
  origin: function(origin, callback){
    if(!origin) return callback(null, true); // allow non-browser requests like Postman
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'Uploads')));

// Routes
app.use("/api/order", OrderRoute);
app.use("/api/package", PackageRoute);
app.use("/api/auth", authRoutes);
app.use("/api/contact", ContactRoute);

// Root Route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Something went wrong!" });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
