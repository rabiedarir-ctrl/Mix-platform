const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../core/auth');
const BtcGame = require('../modules/games/btc_game');
const User = require('../models/User');

// -------------------------------
// 🔹 بدء جلسة لعبة بيتكوين
router.post('/btc/start', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

        // بدء اللعبة وربطها بالمستخدم
        const gameSession = BtcGame.startSession(userId);

        res.json({ message: 'تم بدء لعبة BTC', gameSession });
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
// 🔹 تحديث حالة اللعبة
router.post('/btc/update', authenticateToken, async (req, res) => {
    try {
        const { userId, score, energyChange } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

        // تحديث النقاط والطاقة للمستخدم
        const result = BtcGame.updateSession(userId, { score, energyChange });
        user.energy += energyChange;
        await user.save();

        res.json({ message: 'تم تحديث اللعبة', result, energy: user.energy });
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
// 🔹 إنهاء جلسة اللعبة
router.post('/btc/end', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

        const finalResult = BtcGame.endSession(userId);
        res.json({ message: 'تم إنهاء اللعبة', finalResult });
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
// 🔹 التصدير
module.exports = router;
