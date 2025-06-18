// backend/server.js
const express = require("express");
const app = express();

const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./db/db");

const OrderRoute = require('./route/OrderRoute');


dotenv.config();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();
// Middleware
app.use(cors());
app.use(express.json());



// Basic route
app.use('/api/order', OrderRoute);


// Root Route
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});