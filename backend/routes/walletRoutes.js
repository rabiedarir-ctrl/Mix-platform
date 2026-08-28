const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { authenticateToken } = require('../core/auth');

// ------------------------------
// 🔹 جلب رصيد المستخدم
router.get('/:userId/balance', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

        res.json({ balance: user.walletBalance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------
// 🔹 إنشاء معاملة جديدة
router.post('/:userId/transaction', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const { type, amount, currency, linkedGameEvent } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'المستخدم غير موجود' });

        const transaction = new Transaction({
            userId,
            type,
            amount,
            currency,
            linkedGameEven
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
     
   
    
        });

        // تحديث الرصيد تلقائيًا إذا كانت المعاملة إيداع أو سحب
        if (type === 'deposit') user.walletBalance += amount;
        else if (type === 'withdraw') user.walletBalance -= amount;

        await transaction.save();
        await user.save();

        res.status(201).json({ message: 'تم إنشاء المعاملة', transaction, balance: user.walletBalance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------
// 🔹 جلب جميع المعاملات الخاصة بالمستخدم
router.get('/:userId/transactions', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const transactions = await Transaction.find({ userId }).sort({ createdAt: -1 });
        res.json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------
// 🔹 تحديث حالة المعاملة

router.put('/transaction/:transactionId/status', authenticateToken, async (req, res) => {
    try {
        const { transactionId } = req.params;
        const { status } = req.body;

        const transaction = await Transaction.findById(transactionId);
        if (!transaction) return res.status(404).json({ message: 'المعاملة غير موجودة' });

        transaction.updateStatus(status);
        await transaction.save();

        res.json({ message: 'تم تحديث حالة المعاملة', transaction });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
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
