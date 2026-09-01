// ===================================================
// Mix Platform - Backend Server
// ===================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ===================================================
// 🔹 Middleware
// ===================================================

app.use(cors({
    origin: '*',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===================================================
// 🔹 Health Check
// ===================================================

app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Mix Platform Backend is running',
        timestamp: new Date().toISOString()
    });
});

// ===================================================
// 🔹 Authentication Routes
// ===================================================

app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ 
            error: 'البريد الإلكتروني وكلمة المرور مطلوبة' 
        });
    }
    
    // مثال توضيحي - في الإنتاج استخدم قاعدة بيانات حقيقية
    const token = 'demo_token_' + Date.now();
    
    res.json({
        message: 'تم تسجيل الدخول بنجاح',
        token: token,
        user: {
            id: '1',
            email: email,
            username: email.split('@')[0],
            energy: 100,
            cells: 10,
            level: 1,
            wallet: 0,
            notifications: [
                { message: '🎉 مرحباً بك في Mix Platform!' }
            ]
        }
    });
});

app.post('/api/users/register', (req, res) => {
    const { email, password, username } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ 
            error: 'البريد الإلكتروني وكلمة المرور مطلوبة' 
        });
    }
    
    const token = 'demo_token_' + Date.now();
    
    res.json({
        message: 'تم إنشاء الحساب بنجاح',
        token: token,
        user: {
            id: '1',
            email: email,
            username: username || email.split('@')[0],
            energy: 100,
            cells: 0,
            level: 1,
            wallet: 0
        }
    });
});

// ===================================================
// 🔹 User Routes
// ===================================================

app.get('/api/users/me', (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ error: 'غير مصرح' });
    }
    
    res.json({
        id: '1',
        email: 'demo@example.com',
        username: 'demo_user',
        energy: 100,
        cells: 10,
        level: 1,
        wallet: 0,
        score: 1500,
        notifications: [
            { message: 'لديك رسالة جديدة' },
            { message: 'تم تحديث النظام' }
        ]
    });
});

// ===================================================
// 🔹 Social Routes
// ===================================================

app.get('/api/social/posts', (req, res) => {
    res.json([
        {
            id: '1',
            user: 'user1',
            content: 'منشور تجريبي 1',
            createdAt: new Date(),
            comments: []
        },
        {
            id: '2',
            user: 'user2',
            content: 'منشور تجريبي 2',
            createdAt: new Date(),
            comments: []
        }
    ]);
});

app.post('/api/social/posts', (req, res) => {
    res.json({
        message: 'تم نشر المنشور بنجاح',
        post: req.body
    });
});

// ===================================================
// 🔹 Games Routes
// ===================================================

app.post('/api/games/btc/start', (req, res) => {
    res.json({
        message: 'تم بدء اللعبة',
        gameSession: {
            id: 'game_' + Date.now(),
            status: 'running'
        }
    });
});

// ===================================================
// 🔹 Wallet Routes
// ===================================================

app.get('/api/wallet/:userId/balance', (req, res) => {
    res.json({
        balance: 0,
        currency: 'MIX'
    });
});

// ===================================================
// 🔹 Dreams Routes
// ===================================================

app.get('/api/dreams', (req, res) => {
    res.json([
        {
            id: '1',
            title: 'حلم تجريبي',
            description: 'هذا حلم تجريبي للتجربة',
            createdAt: new Date()
        }
    ]);
});

// ===================================================
// 🔹 Store Routes
// ===================================================

app.get('/api/store/items', (req, res) => {
    res.json([
        {
            id: '1',
            name: 'عنصر تجريبي',
            price: 100,
            description: 'عنصر للتجربة'
        }
    ]);
});

// ===================================================
// 🔹 404 Handler
// ===================================================

app.use((req, res) => {
    res.status(404).json({
        error: 'المسار غير موجود',
        path: req.path
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
    console.log(`${'='.repeat(50)}\n`);
});

module.exports = app;
