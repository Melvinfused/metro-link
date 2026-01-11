import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Paths
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const UPLOADS_DIR = path.join(PUBLIC_DIR, 'uploads');
const FRONTEND_DATA_FILE = path.join(PUBLIC_DIR, 'tiles.json');
const PROFILE_CONFIG_FILE = path.join(PUBLIC_DIR, 'profile.json');

// Ensure uploads directory exists
await fs.mkdir(UPLOADS_DIR, { recursive: true });

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function (req, file, cb) {
        // Sanitize filename and add timestamp to prevent caching issues
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- TILES ENDPOINTS ---

// Get all tiles
app.get('/api/tiles', async (req, res) => {
    try {
        const data = await fs.readFile(FRONTEND_DATA_FILE, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        // If file doesn't exist, return empty array
        if (error.code === 'ENOENT') return res.json([]);
        console.error('Error reading tiles:', error);
        res.status(500).json({ error: 'Failed to read tiles' });
    }
});

// Save tiles (supports both legacy array and new sections format)
app.post('/api/save-tiles', async (req, res) => {
    try {
        const data = req.body;

        // Validate format: either array (legacy) or object with sections
        const isLegacyArray = Array.isArray(data);
        const isSectionsFormat = data && data.sections && Array.isArray(data.sections);

        if (!isLegacyArray && !isSectionsFormat) {
            return res.status(400).json({ error: 'Invalid format: must be array or { sections: [...] }' });
        }

        await fs.writeFile(FRONTEND_DATA_FILE, JSON.stringify(data, null, 2));
        console.log('✅ Tiles saved');
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving tiles:', error);
        res.status(500).json({ error: 'Failed to save tiles' });
    }
});

// --- PROFILE ENDPOINTS ---

// Get profile config
app.get('/api/profile', async (req, res) => {
    try {
        const data = await fs.readFile(PROFILE_CONFIG_FILE, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        // Default profile if not exists
        if (error.code === 'ENOENT') {
            return res.json({
                name: "Melvin Francy",
                image: null
            });
        }
        console.error('Error reading profile:', error);
        res.status(500).json({ error: 'Failed to read profile' });
    }
});

// Save profile config
app.post('/api/save-profile', async (req, res) => {
    try {
        const profile = req.body;
        await fs.writeFile(PROFILE_CONFIG_FILE, JSON.stringify(profile, null, 2));
        console.log('✅ Profile saved');
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).json({ error: 'Failed to save profile' });
    }
});

// --- UPLOAD ENDPOINTS ---

// Upload Profile Picture
app.post('/api/upload-profile', upload.single('profileImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    // Return the path relative to public folder (for frontend to access)
    const relativePath = `/uploads/${req.file.filename}`;
    res.json({ success: true, path: relativePath });
});

// Upload Icon
app.post('/api/upload-icon', upload.single('iconImage'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const relativePath = `/uploads/${req.file.filename}`;
    res.json({ success: true, path: relativePath });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📂 Uploads: ${UPLOADS_DIR}`);
});
