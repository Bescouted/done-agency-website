import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Schemas
const ContentSchema = new mongoose.Schema({
    type: { type: String, required: true, unique: true }, // 'projects', 'services', 'footer', 'videos'
    data: { type: mongoose.Schema.Types.Mixed, required: true }
});

const Content = mongoose.model('Content', ContentSchema);

// Cloudinary Config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'done-agency',
        allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
    },
});

const upload = multer({ storage: storage });

// API: Upload Image
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.json({ filePath: req.file.path });
});

// Generic Get/Save Handlers
const handleGet = async (type, res) => {
    try {
        const content = await Content.findOne({ type });
        res.json(content ? content.data : []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const handleSave = async (type, data, res) => {
    try {
        await Content.findOneAndUpdate(
            { type },
            { data },
            { upsert: true, new: true }
        );
        res.send(`${type} saved successfully.`);
    } catch (error) {
        res.status(500).send(`Error saving ${type}.`);
    }
};

// Routes
app.get('/api/projects', (req, res) => handleGet('projects', res));
app.post('/api/projects', (req, res) => handleSave('projects', req.body, res));

app.get('/api/services', (req, res) => handleGet('services', res));
app.post('/api/services', (req, res) => handleSave('services', req.body, res));

app.get('/api/footer', (req, res) => handleGet('footer', res));
app.post('/api/footer', (req, res) => handleSave('footer', req.body, res));

app.get('/api/videos', (req, res) => handleGet('videos', res));
app.post('/api/videos', (req, res) => handleSave('videos', req.body, res));

app.get('/api/hero', (req, res) => handleGet('hero', res));
app.post('/api/hero', (req, res) => handleSave('hero', req.body, res));

// Auth Endpoint
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'; // Default fallback

    if (password === ADMIN_PASSWORD) {
        res.json({ success: true, token: 'fake-jwt-token-for-demo' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid password' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
