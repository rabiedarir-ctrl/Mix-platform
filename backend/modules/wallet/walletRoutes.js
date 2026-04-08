// backend/modules/wallet/walletRoutes.js

const express = require('express');
const router = express.Router();
const walletService = require('./walletService');

// Middleware للتحقق من المستخدم (مثال JWT أو session)
function authMiddleware(req, res, next) {
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
}

// إنشاء محفظة جديدة للمستخدم
router.post('/create', authMiddleware, (req, res) => {
    const wallet = walletService.createWallet(req.user.id);
    res.json({
        message: 'Wallet created successfully',
        balance: wallet.balance
    });
});

// استرجاع الرصيد الحالي
router.get('/balance', authMiddleware, (req, res) => {
    const balance = walletService.getBalance(req.user.id);
    res.json({
        balance
    });
});

// إضافة رصيد (إيداع أو مكافأة)
router.post('/credit', authMiddleware, (req, res) => {
    const { amount, reason } = req.body;
    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

    const newBalance = walletService.addBalance(req.user.id, amount, reason);
    res.json({
        message: 'Balance credited successfully',
        balance: newBalance
    });
});

// خصم رصيد (شراء أو خصم)
router.post('/debit', authMiddleware, (req, res) => {
    const { amount, reason } = req.body;
    if (!amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid amount' });
    }

    const newBalance = walletService.deductBalance(req.user.id, amount, reason);
    if (newBalance === false) {
        return res.status(400).json({ error: 'Insufficient balance' });
    }

    res.json({
        message: 'Balance debited successfully',
        balance: newBalance
    });
});

// تحويل رصيد لمستخدم آخر
router.post('/transfer', authMiddleware, (req, res) => {
    const { toUserId, amount } = req.body;
    if (!toUserId || !amount || amount <= 0) {
        return res.status(400).json({ error: 'Invalid transfer data' });
    }

    const success = walletService.handleTransaction({
        fromUserId: req.user.id,
        toUserId,
        amount
    });

    if (!success) {
        return res.status(400).json({ error: 'Transfer failed (check balance or user ID)' });
    }

    res.json({
        message: 'Transfer completed successfully',
        balance: walletService.getBalance(req.user.id)
    });
});

// استرجاع سجل المعاملات
router.get('/transactions', authMiddleware, (req, res) => {
    const transactions = walletService.getTransactions(req.user.id);
    res.json({ transactions });
});

module.exports = router;
