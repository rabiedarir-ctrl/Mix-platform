
'use strict';

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const User = require('./models/User');

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters');
}

// ===============================
// 1. إعدادات CORS والطلبات
// ===============================

const allowedOrigins = (process.env.FRONTEND_URL || '')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (
            !origin ||
            allowedOrigins.length === 0 ||
            allowedOrigins.includes(origin)
        ) {
            return callback(null, true);
        }

        return callback(new Error('Origin not allowed'));
    },
    credentials: true
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// ===============================
// 2. قاعدة SQLite المحلية
// ===============================

const databaseDirectory = path.join(__dirname, 'database');

if (!fs.existsSync(databaseDirectory)) {
    fs.mkdirSync(databaseDirectory, { recursive: true });
}

const sqlitePath = path.join(
    databaseDirectory,
    'mix-platform.db'
);

const sqlite = new sqlite3.Database(sqlitePath, error => {
    if (error) {
        console.error('SQLite connection error:', error.message);
        return;
    }

    console.log('SQLite connected:', sqlitePath);

    sqlite.serialize(() => {
        sqlite.run('PRAGMA foreign_keys = ON');

        sqlite.run(`
            CREATE TABLE IF NOT EXISTS local_users (
                id TEXT PRIMARY KEY,
                username TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                fullname TEXT DEFAULT '',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                updated_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);

        sqlite.run(`
            CREATE TABLE IF NOT EXISTS activity_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                event_type TEXT NOT NULL,
                description TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);

        sqlite.run(`
            CREATE TABLE IF NOT EXISTS sync_queue (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                operation TEXT NOT NULL,
                payload TEXT,
                status TEXT DEFAULT 'pending',
                created_at TEXT DEFAULT CURRENT_TIMESTAMP
            )
        `);
    });
});

// ===============================
// 3. أدوات مساعدة
// ===============================

function createToken(user) {
    return jwt.sign(
        {
            id: user._id.toString(),
            username: user.username,
            email: user.email
        },
        JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d'
        }
    );
}

function saveLocalUser(user) {
    return new Promise((resolve, reject) => {
        sqlite.run(
            `INSERT INTO local_users
             (id, username, email, fullname, updated_at)
             VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
             ON CONFLICT(id) DO UPDATE SET
             username = excluded.username,
             email = excluded.email,
             fullname = excluded.fullname,
             updated_at = CURRENT_TIMESTAMP`,
            [
                user._id.toString(),
                user.username,
                user.email,
                user.fullname || ''
            ],
            error => {
                if (error) return reject(error);
                resolve();
            }
        );
    });
}

function logActivity(userId, eventType, description) {
    sqlite.run(
        `INSERT INTO activity_logs
         (user_id, event_type, description)
         VALUES (?, ?, ?)`,
        [userId, eventType, description],
        error => {
            if (error) {
                console.error('SQLite log error:', error.message);
            }
        }
    );
}

// ===============================
// 4. التحقق من تسجيل الدخول
// ===============================

function authenticateToken(req, res, next) {
    const authorization = req.headers.authorization || '';

    if (!authorization.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'يجب تسجيل الدخول'
        });
    }

    const token = authorization.slice(7);

    jwt.verify(token, JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.status(403).json({
                success: false,
                message: 'رمز الدخول غير صالح أو منتهي'
            });
        }

        req.user = decoded;
        next();
    });
}

// ===============================
// 5. حالة الخادم وقواعد البيانات
// ===============================

app.get('/api/status', (req, res) => {
    res.json({
        success: true,
        server: 'online',
        mongodb: mongoose.connection.readyState === 1
            ? 'connected'
            : 'disconnected',
        sqlite: sqlite.open
            ? 'connected'
            : 'check connection',
        platform: 'Mix Platform'
    });
});

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Mix Platform API is running'
    });
});

// ===============================
// 6. إنشاء حساب
// ===============================

app.post('/api/users/register', async (req, res, next) => {
    try {
        const {
            username,
            email,
            password,
            confirmPassword,
            fullname,
            phone,
            termsAccepted
        } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'يرجى ملء البيانات المطلوبة'
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'كلمتا المرور غير متطابقتين'
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'كلمة المرور قصيرة'
            });
        }

        if (termsAccepted !== true) {
            return res.status(400).json({
                success: false,
                message: 'يجب الموافقة على الشروط'
            });
        }

        const cleanUsername = username.trim();
        const cleanEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            $or: [
                { username: cleanUsername },
                { email: cleanEmail }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'اسم المستخدم أو البريد الإلكتروني مستخدم'
            });
        }

        const user = await User.create({
            username: cleanUsername,
            email: cleanEmail,
            password,
            fullname: fullname || '',
            phone: phone || '',
            termsAcceptedAt: new Date()
        });

        await saveLocalUser(user);

        logActivity(
            user._id.toString(),
            'register',
            'New account created'
        );

        const token = createToken(user);

        return res.status(201).json({
            success: true,
            message: 'تم إنشاء الحساب بنجاح',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullname: user.fullname
            }
        });

    } catch (error) {
        next(error);
    }
});

// ===============================
// 7. تسجيل الدخول
// ===============================

app.post('/api/users/login', async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const login = (email || username || '').trim();

        if (!login || !password) {
            return res.status(400).json({
                success: false,
                message: 'يرجى إدخال بيانات الدخول'
            });
        }

        const user = await User.findOne({
            $or: [
                { email: login.toLowerCase() },
                { username: login }
            ]
        }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'بيانات الدخول غير صحيحة'
            });
        }

        if (user.isActive === false) {
            return res.status(403).json({
                success: false,
                message: 'الحساب غير مفعل'
            });
        }

        const validPassword =
            await user.comparePassword(password);

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'بيانات الدخول غير صحيحة'
            });
        }

        user.lastLogin = new Date();
        await user.save();

        await saveLocalUser(user);

        logActivity(
            user._id.toString(),
            'login',
            'User logged in'
        );

        const token = createToken(user);

        return res.json({
            success: true,
            message: 'تم تسجيل الدخول بنجاح',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                fullname: user.fullname
            }
        });

    } catch (error) {
        next(error);
    }
});

// ===============================
// 8. بيانات المستخدم الحالي
// ===============================

app.get('/api/users/me', authenticateToken, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id)
            .select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'المستخدم غير موجود'
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {
        next(error);
    }
});

// ===============================
// 9. الملفات الثابتة
// ===============================

const frontendPath = path.join(__dirname, '..', 'frontend');

app.use(express.static(frontendPath));

// ===============================
// 10. معالجة الأخطاء
// ===============================

app.use('/api', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    });
});

app.use((error, req, res, next) => {
    console.error(error);

    if (error.code === 11000) {
        return res.status(409).json({
            success: false,
            message: 'البيانات مسجلة مسبقاً'
        });
    }

    res.status(500).json({
        success: false,
        message: 'حدث خطأ داخلي في الخادم'
    });
});

// ===============================
// 11. تشغيل الخادم
// ===============================

async function startServer() {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error('MONGODB_URI is missing in .env');
        }

        await mongoose.connect(mongoURI, {
            dbName: process.env.DB_NAME || 'mix-platform',
            serverSelectionTimeoutMS: 10000
        });

        console.log('MongoDB connected successfully');

        app.listen(PORT, HOST, () => {
            console.log(
                `Mix Platform running at http://localhost:${PORT}`
            );
        });

    } catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
}

startServer();

module.exports = app;
