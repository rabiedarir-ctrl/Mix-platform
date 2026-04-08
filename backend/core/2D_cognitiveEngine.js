// backend/core/cognitiveEngine.js

const eventBus = require('./eventBus');
const signalTranslator = require('./signalTranslator');
const cellManager = require('../modules/cells/cellManager');
const cellFactory = require('../modules/cells/cellFactory');

class CognitiveEngine {
    constructor() {
        this.active = true;
        this.init();
    }

    init() {
        // استقبال أي Signal من النظام
        eventBus.subscribe('signal.received', (signal) => {
            this.processSignal(signal);
        });

        // استقبال إشارات غير معروفة
        eventBus.subscribe('signal.unknown', (signal) => {
            this.handleUnknownSignal(signal);
        });

        // مثال: ربط أحداث النظام
        eventBus.subscribe('user.created', ({ userId }) => {
            cellFactory.autoCreateCellsForUser(userId);
        });
    }

    // 🧠 معالجة الإشارة
    processSignal(signal) {
        if (!this.active) return;

        try {
            const classification = signalTranslator.classify(signal);

            eventBus.publish('cognitive.processing', {
                signalId: signal.id,
                type: signal.type,
                classification
            });

            switch (signal.type) {

                case 'text':
                    this.handleTextSignal(signal);
                    break;

                case 'game':
                    this.handleGameSignal(signal);
                    break;

                case 'dream':
                    this.handleDreamSignal(signal);
                    break;

                case 'system':
                    this.handleSystemSignal(signal);
                    break;

                default:
                    this.handleGenericSignal(signal);
            }

        } catch (error) {
            eventBus.publish('cognitive.error', {
                error: error.message,
                signal
            });
        }
    }

    // 📝 نص
    handleTextSignal(signal) {
        const userId = signal.meta?.userId;

        if (!userId) return;

        const userCells = cellManager.getUserCells(userId);

        userCells.forEach(cell => {
            if (cell.type === 'userCell') {
                // تأثير النص على الطاقة
                cell.updateEnergy(signal.intensity);

                eventBus.publish('cognitive.text.processed', {
                    userId,
                    cellId: cell.id,
                    intensity: signal.intensity
                });
            }
        });
    }

    // 🎮 لعبة
    handleGameSignal(signal) {
        const userId = signal.meta?.userId;

        if (!userId) return;

        const userCells = cellManager.getUserCells(userId);

        userCells.forEach(cell => {
            if (cell.type === 'gameCell') {
                if (cell.state !== 'playing') {
                    cell.startGame();
                }

                cell.addScore(signal.intensity * 10);

                eventBus.publish('cognitive.game.processed', {
                    userId,
                    cellId: cell.id,
                    scoreImpact: signal.intensity * 10
                });
            }
        });
    }

    // 🌙 حلم
    handleDreamSignal(signal) {
        const userId = signal.meta?.userId;

        if (!userId) return;

        const userCells = cellManager.getUserCells(userId);

        userCells.forEach(cell => {
            if (cell.type === 'dreamCell') {
                cell.receiveSignal(signal);

                eventBus.publish('cognitive.dream.processed', {
                    userId,
                    cellId: cell.id
                });
            }
        });
    }

    // ⚙️ نظام
    handleSystemSignal(signal) {
        const event = signal.content;

        eventBus.publish('cognitive.system.processed', {
            event,
            timestamp: Date.now()
        });

        // مثال: إعادة تعيين
        if (event === 'reset') {
            cellManager.resetAllCells();
        }
    }

    // 🔁 عام
    handleGenericSignal(signal) {
        eventBus.publish('cognitive.generic.processed', {
            signal
        });
    }

    // ❓ إشارات غير معروفة
    handleUnknownSignal(signal) {
        eventBus.publish('cognitive.unknown', {
            signal
        });
    }

    // تشغيل / إيقاف
    setActive(state) {
        this.active = state;

        eventBus.publish('cognitive.stateChanged', {
            active: this.active
        });
    }
}

module.exports = new CognitiveEngine();
