require("dotenv").config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "*", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));


// Routes
const inventoryRoutes = require("./src/routes/inventoryRoutes");
const stockRoutes = require("./src/routes/stockRoutes");
const productRoutes = require("./src/routes/productRoutes");
const userRoutes = require("./src/routes/userRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");


app.use("/api/dashboard", dashboardRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/stocks", stockRoutes);
app.use("/api/products", productRoutes);
app.use("/users", userRoutes);

// Database Connection
mongoose.connect(process.env.MONGODB_URI).then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT} and connected to MongoDB Atlas.`);
    })
})
.catch((error) => {
    console.log(`error connecting to MongoDB Atlas: ${error.message}`);
});