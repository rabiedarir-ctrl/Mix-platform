// backend/modules/wallet/walletService.js

const eventBus = require('../../core/eventBus');
const { v4: uuidv4 } = require('uuid');

// نموذج بيانات مؤقت (يمكن استبداله بقاعدة بيانات)
const wallets = new Map(); // key: userId, value: { balance, transactions: [] }

class WalletService {

    constructor() {
        this.init();
    }

    init() {
        // الاشتراك في الإشارات العامة من النظام
        eventBus.subscribe('cell.updated', ({ cellId, energy }) => {
            this.rewardEnergy(cellId, energy);
        });

        eventBus.subscribe('transaction.request', (data) => {
            this.handleTransaction(data);
        });
    }

    // إنشاء محفظة جديدة للمستخدم
    createWallet(userId) {
        if (!wallets.has(userId)) {
            wallets.set(userId, { balance: 0, transactions: [] });
            console.log(`[WalletService] Wallet created for user ${userId}`);
        }
        return wallets.get(userId);
    }

    // استرجاع رصيد المستخدم
    getBalance(userId) {
        const wallet = wallets.get(userId);
        return wallet ? wallet.balance : 0;
    }

    // إضافة رصيد (مثال: مكافأة طاقة أو إيداع)
    addBalance(userId, amount, reason = 'Reward') {
        const wallet = wallets.get(userId);
        if (!wallet) return false;

        wallet.balance += amount;
        wallet.transactions.push({
            id: uuidv4(),
            type: 'credit',
            amount,
            reason,
            date: new Date()
        });

        // إشعار النظام
        eventBus.publish('wallet.updated', {
            userId,
            balance: wallet.balance,
            type: 'credit',
            amount,
            reason
        });

        return wallet.balance;
    }

    // خصم رصيد المستخدم
    deductBalance(userId, amount, reason = 'Purchase') {
        const wallet = wallets.get(userId);
        if (!wallet || wallet.balance < amount) return false;

        wallet.balance -= amount;
        wallet.transactions.push({
            id: uuidv4(),
            type: 'debit',
            amount,
            reason,
            date: new Date()
        });

        eventBus.publish('wallet.updated', {
            userId,
            balance: wallet.balance,
            type: 'debit',
            amount,
            reason
        });

        return wallet.balance;
    }

    // التعامل مع طلبات المعاملات
    handleTransaction({ fromUserId, toUserId, amount }) {
        if (!wallets.has(fromUserId) || !wallets.has(toUserId)) return false;

        const success = this.deductBalance(fromUserId, amount, 'Transfer');
        if (!success) return false;

        this.addBalance(toUserId, amount, 'Transfer');

        return true;
    }

    // مكافأة المستخدم بناءً على الطاقة (مثال من الخلايا)
    rewardEnergy(userId, energy) {
        const reward = Math.floor(energy * 0.1); // 10% من الطاقة كمكافأة
        if (reward > 0) {
            this.addBalance(userId, reward, 'Energy Reward');
        }
    }

    // استرجاع سجل المعاملات
    getTransactions(userId) {
        const wallet = wallets.get(userId);
        return wallet ? wallet.transactions : [];
    }
}

module.exports = new WalletService();
