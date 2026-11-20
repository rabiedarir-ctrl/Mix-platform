-- ==========================================
-- Mix Platform - قاعدة بيانات موحدة
-- يشمل: المستخدمين، الأحلام، العوالم، المحفظة، الرسائل، المساعد الأمني، الإشارات
-- ==========================================

-- جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    energy_level REAL DEFAULT 100.0,
    frequency REAL DEFAULT 0.0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- بيانات أولية للمستخدمين
INSERT INTO users (username, password_hash, energy_level, frequency)
VALUES 
('king', 'hashed_password_king', 100.0, 50.0),
('user1', 'hashed_password_1', 80.0, 30.0),
('user2', 'hashed_password_2', 60.0, 20.0);

-- جدول الأحلام
CREATE TABLE IF NOT EXISTS dreams (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    dream_name TEXT,
    dream_data TEXT,
    energy_effect REAL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- بيانات أولية للأحلام
INSERT INTO dreams (user_id, dream_name, dream_data, energy_effect)
VALUES
(1, 'Dream of Light', '{}', 10.0),
(2, 'Night Vision', '{}', 5.0);

-- جدول العوالم الافتراضية
CREATE TABLE IF NOT EXISTS dream_worlds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    world_name TEXT,
    world_type TEXT,
    description TEXT,
    light_stack_data TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- بيانات أولية للعوالم
INSERT INTO dream_worlds (world_name, world_type, description, light_stack_data)
VALUES
('Default World', 'default', 'البيئة الافتراضية الأساسية', '{}'),
('Dream Realm', 'dream', 'عالم الأحلام الفردي', '{}'),
('City World', 'city', 'العالم الحضري المتقدم', '{}');

-- جدول المحفظة
CREATE TABLE IF NOT EXISTS wallets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    currency_type TEXT,
    balance REAL DEFAULT 0,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- بيانات أولية للمحفظة
INSERT INTO wallets (user_id, currency_type, balance)
VALUES
(1, 'CRD', 1000),
(2, 'CRD', 500),
(3, 'CRD', 200);

-- جدول الرسائل
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER,
    receiver_id INTEGER,
    content TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(sender_id) REFERENCES users(id),
    FOREIGN KEY(receiver_id) REFERENCES users(id)
);

-- بيانات أولية للرسائل
INSERT INTO messages (sender_id, receiver_id, content)
VALUES
(2, 1, 'مرحبا يا ملك المنصة'),
(3, 1, 'تم تحديث طاقتي اليوم');

-- جدول المساعد الأمني
CREATE TABLE IF NOT EXISTS assistant_security_log (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT,
    status TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- بيانات أولية للأمن
INSERT INTO assistant_security_log (user_id, action, status)
VALUES
(1, 'System Boot', 'OK'),
(2, 'Unauthorized Access Attempt', 'Blocked');

-- جدول الإشارات الحسية / الدماغية
CREATE TABLE IF NOT EXISTS sensory_signals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    brain_signal_data TEXT,
    light_stack_data TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
);

-- بيانات أولية للإشارات
INSERT INTO sensory_signals (user_id, brain_signal_data, light_stack_data)
VALUES
(1, '{"alpha":0.8,"beta":0.2}', '{"intensity":0.7}'),
(2, '{"alpha":0.5,"beta":0.4}', '{"intensity":0.5}');
