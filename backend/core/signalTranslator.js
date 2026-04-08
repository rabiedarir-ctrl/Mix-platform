// backend/core/signalTranslator.js

const eventBus = require('./eventBus');
const { v4: uuidv4 } = require('uuid');

class SignalTranslator {
    constructor() {
        this.adapters = new Map(); // أنواع المحولات (text, game, system...)
        this.init();
    }

    init() {
        // تسجيل المحولات الافتراضية
        this.registerDefaultAdapters();
    }

    // تسجيل Adapter جديد
    registerAdapter(type, handler) {
        this.adapters.set(type, handler);
    }

    // تسجيل الأنواع الافتراضية
    registerDefaultAdapters() {

        // 🧠 نص (Text Input)
        this.registerAdapter('text', (input) => {
            return {
                type: 'text',
                content: input.content || '',
                intensity: this.calculateIntensity(input.content),
                meta: {
                    length: input.content?.length || 0
                }
            };
        });

        // 🎮 إشارة لعبة
        this.registerAdapter('game', (input) => {
            return {
                type: 'game',
                content: input.action || 'unknown',
                intensity: input.score ? Math.min(input.score / 100, 10) : 1,
                meta: {
                    score: input.score || 0
                }
            };
        });

        // 🌙 إشارة حلم
        this.registerAdapter('dream', (input) => {
            return {
                type: 'dream',
                content: input.symbol || 'unknown',
                intensity: input.intensity || 1,
                meta: {
                    source: 'dream'
                }
            };
        });

        // ⚙️ نظام
        this.registerAdapter('system', (input) => {
            return {
                type: 'system',
                content: input.event || 'unknown',
                intensity: 1,
                meta: {
                    priority: input.priority || 'normal'
                }
            };
        });
    }

    // تحويل input إلى signal موحد
    translate(input = {}) {
        const { type } = input;

        if (!type || !this.adapters.has(type)) {
            return this.createUnknownSignal(input);
        }

        const adapter = this.adapters.get(type);

        const baseSignal = adapter(input);

        const signal = {
            id: uuidv4(),
            type: baseSignal.type,
            content: baseSignal.content,
            intensity: baseSignal.intensity || 1,
            meta: baseSignal.meta || {},
            timestamp: Date.now()
        };

        // نشر الإشارة للنظام
        eventBus.publish('signal.received', signal);

        return signal;
    }

    // حساب شدة الإشارة للنص
    calculateIntensity(text = '') {
        if (!text) return 1;

        const lengthFactor = Math.min(text.length / 50, 5);

        const emotionalBoost = /(!|\?|🔥|⚡)/.test(text) ? 2 : 1;

        return Math.floor((lengthFactor + 1) * emotionalBoost);
    }

    // إشارة غير معروفة
    createUnknownSignal(input) {
        const signal = {
            id: uuidv4(),
            type: 'unknown',
            content: JSON.stringify(input),
            intensity: 1,
            meta: {
                originalType: input.type || null
            },
            timestamp: Date.now()
        };

        eventBus.publish('signal.unknown', signal);

        return signal;
    }

    // تحويل مجموعة Inputs دفعة واحدة
    batchTranslate(inputs = []) {
        return inputs.map(input => this.translate(input));
    }

    // تحليل سريع للإشارة (تصنيف)
    classify(signal) {
        if (!signal) return 'invalid';

        if (signal.type === 'text') {
            if (signal.intensity > 5) return 'strong_text';
            return 'normal_text';
        }

        if (signal.type === 'game') {
            return signal.intensity > 5 ? 'high_performance' : 'low_performance';
        }

        if (signal.type === 'dream') {
            return 'subconscious_signal';
        }

        return 'generic';
    }
}

module.exports = new SignalTranslator();
