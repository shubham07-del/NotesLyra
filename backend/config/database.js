const dns = require("dns")
dns.setServers(["8.8.8.8"])
const mongoose = require('mongoose');

async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected to server');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    }
}

module.exports = connectToDB;
