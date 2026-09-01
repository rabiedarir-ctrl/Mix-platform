const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema(
    {
        // المالك
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },

        // الأرصدة
        balance: {
            type: Number,
            default: 0,
            min: 0,
        },
        currency: {
            type: String,
            default: 'MIX',
        },

        // السجل
        transactions: [
            {
                type: String,
                enum: ['deposit', 'withdraw', 'transfer', 'purchase', 'reward'],
            },
            {
                amount: Number,
                description: String,
                status: {
                    type: String,
                    enum: ['pending', 'completed', 'failed'],
                    default: 'completed',
                },
                timestamp: { type: Date, default: Date.now },
            },
        ],

        // الإحصائيات
        totalDeposited: {
            type: Number,
            default: 0,
        },
        totalWithdrawn: {
            type: Number,
            default: 0,
        },
        totalSpent: {
            type: Number,
            default: 0,
        },

        // الحالة
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

// Indexes
WalletSchema.index({ user: 1 });

module.exports = mongoose.model('Wallet', WalletSchema);
