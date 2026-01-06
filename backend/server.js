const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Connect to MongoDB
const connectDB = async () => {
    try {
        // Try connecting to local MongoDB first
        await mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 2000 });
        console.log('MongoDB Connected (Local)');
    } catch (err) {
        console.log('Local MongoDB not found, starting embedded database...');
        try {
            // Force MongoDB binary download to local folder to avoid global cache corruption
            process.env.MONGOMS_DOWNLOAD_DIR = path.join(__dirname, '.mongo-bin');

            const { MongoMemoryServer } = require('mongodb-memory-server');
            // Fallback to in-memory database (no persistence) to avoid file lock issues
            const mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            console.log(`Embedded MongoDB started at ${uri}`);

            await mongoose.connect(uri);
            console.log('MongoDB Connected (Embedded - In Memory)');
        } catch (fallbackErr) {
            console.error('Fatal: Could not connect to any MongoDB instance.', fallbackErr);
            process.exit(1);
        }
    }
};

connectDB();

const authRoutes = require('./routes/authRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const orderRoutes = require('./routes/orderRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/pdfs', pdfRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
