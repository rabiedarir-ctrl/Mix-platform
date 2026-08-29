const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { authenticateToken } = require('../core/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// -------------------------------
// 🔹 تسجيل مستخدم جديد
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // تحقق من وجود المستخدم مسبقًا
        let existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'المستخدم موجود مسبقًا' });

        const newUser = new User({ username, email, password });
        await newUser.save();

        res.status(201).json({ message: 'تم التسجيل بنجاح', userId: newUser._id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
var  express  =  require ( 'express' ) ; 
var  app  =  express ( ) ;

// إعداد مُحدد معدل الطلبات: بحد أقصى خمسة طلبات في الدقيقة 
var  RateLimit  =  require ( 'express-rate-limit' ) ; 
var  limiter  =  RateLimit ( { 
  windowMs : 15  *  60  *  1000 ,  // 15 دقيقة 
  max : 100 ,  // بحد أقصى 100 طلب لكل windowMs 
} ) ;


// تطبيق محدد معدل الطلبات على جميع الطلبات app.use ( limiter ) ;

app.get ( ' / : path ' , function ( req , res ) { let path = req.params.path ; if ( isValidPath ( path ) ) res.sendFile ( path ) ; } ) ;   
     
   
    
// -------------------------------
// 🔹 تسجيل الدخول
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({ message: 'كلمة المرور غير صحيحة' });

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.json({ token, userId: user._id, username: user.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
var  express  =  require ( 'express' ) ; 
var  app  =  express ( ) ;

// إعداد مُحدد معدل الطلبات: بحد أقصى خمسة طلبات في الدقيقة 
var  RateLimit  =  require ( 'express-rate-limit' ) ; 
var  limiter  =  RateLimit ( { 
  windowMs : 15  *  60  *  1000 ,  // 15 دقيقة 
  max : 100 ,  // بحد أقصى 100 طلب لكل windowMs 
} ) ;


// تطبيق محدد معدل الطلبات على جميع الطلبات app.use ( limiter ) ;

app.get ( ' / : path ' , function ( req , res ) { let path = req.params.path ; if ( isValidPath ( path ) ) res.sendFile ( path ) ; } ) ;   
     
     // ------------------------
//🔹  تحديت الطاقة والخلايا
router.put('/:userId/energy', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const { energyChange, cellsChange } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

        if (energyChange) user.updateEnergy(energyChange);
        if (cellsChange) user.cells += cellsChange;

        await user.save();
        res.json({ energy: user.energy, cells: user.cells });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------
// 🔹 إضافة حلم جديد للمستخدم
router.post('/:userId/dreams', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const { dreamData } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

        user.addDream(dreamData);
        await user.save();

        res.status(201).json({ dreams: user.dreams });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

var  express  =  require ( 'express' ) ; 
var  app  =  express ( ) ;

// إعداد مُحدد معدل الطلبات: بحد أقصى خمسة طلبات في الدقيقة 
var  RateLimit  =  require ( 'express-rate-limit' ) ; 
var  limiter  =  RateLimit ( { 
  windowMs : 15  *  60  *  1000 ,  // 15 دقيقة 
  max : 100 ,  // بحد أقصى 100 طلب لكل windowMs 
} ) ;


// تطبيق محدد معدل الطلبات على جميع الطلبات app.use ( limiter ) ;

app.get ( ' / : path ' , function ( req , res ) { let path = req.params.path ; if ( isValidPath ( path ) ) res.sendFile ( path ) ; } ) ;   
     
   
    
// ---------
// -------------------------------
// 🔹 التصدير
module.exports = router;
