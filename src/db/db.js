const mongoose = require('mongoose');



function connectDB() {
    mongoose.connect(process.env.MONGO_URI)
    // checking connection status whether mongoDB connected or Not //
        .then(() => {
            console.log("MongoDB connected");
        })
        .catch((err) => {
            console.log("MongoDB connection error:", err);
        })
}

module.exports = connectDB;