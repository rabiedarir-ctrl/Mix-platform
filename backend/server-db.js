// ===================================================
// Mix Platform - Updated Server with Database
// ===================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/database');

// Models
const User = require('./models/User');
const Post = require('./models/Post');
const Dream = require('./models/Dream');
const Wallet = require('./models/Wallet');

const app = express();

//استحابة الخادم 
const PORT = process.env.PORT || 10000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
    console.log(`Mix API running on ${HOST}:${PORT}`);
});

// ===================================================
// 🔹 Middleware
// ===================================================

app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===================================================
// 🔹 Database Connection
// ===================================================

let dbConnected = false;

connectDB().then(() => {
    dbConnected = true;
    console.log('✅ Database connected');
}).catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    // الاستمرار مع وضع مرحلة التطوير
});

// ===================================================
// 🔹 Health Check
// ===================================================

app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK',
        database: dbConnected ? 'Connected' : 'Disconnected',
        message: 'Mix Platform Backend is running',
        timestamp: new Date().toISOString()
    });
});

// ===================================================
// 🔹 Authentication Routes
// ===================================================

app.post('/api/users/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // التحقق من المستخدم الموجود
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Email or username already exists' });
        }

        // إنشاء مستخدم جديد (بدون تشفير كلمة المرور للتطوير السريع)
        const newUser = new User({
            username,
            email,
            password, // في الإنتاج استخدم bcryptjs
            energy: 100,
            cells: 0,
            wallet: 0,
        });

        await newUser.save();

        // إنشاء محفظة
        await Wallet.create({
            user: newUser._id,
            balance: 0,
        });

        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                energy: newUser.energy,
                cells: newUser.cells,
                wallet: newUser.wallet,
            },
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        // البحث عن المستخدم
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // التحقق من كلمة المرور (بسيطة للتطوير)
        if (user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // تحديث آخر تسجيل دخول
        user.lastLogin = new Date();
        await user.save();

        // إنشاء token (بسيط للتطوير)
        const token = Buffer.from(`${user._id}:${Date.now()}`).toString('base64');

        res.json({
            message: 'Login successful',
            token: token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                energy: user.energy,
                cells: user.cells,
                level: user.level,
                wallet: user.wallet,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/api/users/me', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // فك تشفير Token
        const decoded = Buffer.from(token, 'base64').toString();
        const userId = decoded.split(':')[0];

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({
            id: user._id,
            username: user.username,
            email: user.email,
            energy: user.energy,
            cells: user.cells,
            level: user.level,
            wallet: user.wallet,
            score: user.score,
            notifications: user.notifications,
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ===================================================
// 🔹 Social Routes
// ===================================================

app.get('/api/social/posts', async (req, res) => {
    try {
        const posts = await Post.find({ isPublished: true })
            .populate('author', 'username email profileImage')
            .sort({ createdAt: -1 })
            .limit(20);

        res.json(posts);
    } catch (error) {
        console.error('Get posts error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/social/posts', async (req, res) => {
    try {
        const { content, images } = req.body;
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decoded = Buffer.from(token, 'base64').toString();
        const userId = decoded.split(':')[0];

        const post = new Post({
            content,
            images: images || [],
            author: userId,
        });

        await post.save();
        await post.populate('author', 'username email');

        res.status(201).json(post);
    } catch (error) {
        console.error('Create post error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ===================================================
// 🔹 Dreams Routes
// ===================================================

app.get('/api/dreams', async (req, res) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decoded = Buffer.from(token, 'base64').toString();
        const userId = decoded.split(':')[0];

        const dreams = await Dream.find({ user: userId }).sort({ createdAt: -1 });
        res.json(dreams);
    } catch (error) {
        console.error('Get dreams error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.post('/api/dreams', async (req, res) => {
    try {
        const { title, description, mood, lucidity } = req.body;
        const token = req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decoded = Buffer.from(token, 'base64').toString();
        const userId = decoded.split(':')[0];

        const dream = new Dream({
            title,
            description,
            mood,
            lucidity,
            user: userId,
        });

        await dream.save();
        res.status(201).json(dream);
    } catch (error) {
        console.error('Create dream error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// ===================================================
// 🔹 Games Routes
// ===================================================

app.post('/api/games/btc/start', async (req, res) => {
    res.json({
        message: 'Game started',
        gameSession: {
            id: 'game_' + Date.now(),
            status: 'running',
        },
    });
});

// ===================================================
// 🔹 Store Routes
// ===================================================

app.get('/api/store/items', async (req, res) => {
    res.json([
        {
            id: '1',
            name: 'Energy Boost',
            price: 50,
            description: 'Increase energy by 50',
        },
        {
            id: '2',
            name: 'Cell Multiplier',
            price: 100,
            description: 'Double your cells',
        },
    ]);
});

// ===================================================
// 🔹 404 Handler
// ===================================================

app.use((req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.path,
    });
});

// ===================================================
// 🔹 Server Start
// ===================================================

const PORT = process.env.BACKEND_PORT || process.env.PORT || 3000;
const HOST = process.env.BACKEND_HOST || 'localhost';

app.listen(PORT, HOST, () => {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`✅ Mix Platform Backend is running`);
    console.log(`📍 Server: http://${HOST}:${PORT}`);
    console.log(`🔗 API: http://${HOST}:${PORT}/api`);
    console.log(`🏥 Health: http://${HOST}:${PORT}/health`);
    console.log(`🗄️  Database: ${dbConnected ? 'Connected' : 'Disconnected (dev mode)'}`);
    console.log(`${'='.repeat(50)}\n`);
});

module.exports = app;
