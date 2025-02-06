// Import mongoose for interacting with MongoDB
const mongoose = require("mongoose");
// Load environment variables from .env file
require("dotenv").config(); 

// Function to connect to MongoDB using the URI from environment variables
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected...");
    } catch (err) {
        console.error("MongoDB Connection Failed:", err.message);
        process.exit(1); 
    }
};

// Export the function to be used in other parts of the application
module.exports = connectDB; // Export database connection function
