// backend/modules/cells/cellTypes/gameCell.js

const Cell = require('../cell');
const eventBus = require('../../../core/eventBus');

class GameCell extends Cell {
    constructor({ ownerId, energy = 50 }) {
        super({
            type: 'gameCell',
            ownerId,
            energy
        });

        // خصائص خاصة بالألعاب
        this.score = 0;
        this.level = 1;
        this.combo = 0;
        this.state = 'idle'; // idle | playing | paused | finished
    }

    // بدء اللعب
    startGame() {
        this.state = 'playing';

        eventBus.publish('gameCell.started', {
            cellId: this.id,
            ownerId: this.ownerId
        });
    }

    // إيقاف مؤقت
    pauseGame() {
        if (this.state !== 'playing') return;

        this.state = 'paused';

        eventBus.publish('gameCell.paused', {
            cellId: this.id,
            ownerId: this.ownerId
        });
    }

    // إنهاء اللعبة
    endGame() {
        this.state = 'finished';

        eventBus.publish('gameCell.ended', {
            cellId: this.id,
            ownerId: this.ownerId,
            score: this.score
        });

        // مكافأة بناءً على الأداء
        this.rewardPlayer();
    }

    // تحديث النقاط (Score)
    addScore(points) {
        if (this.state !== 'playing') return;

        this.score += points;
        this.combo += 1;

        // زيادة طاقة حسب الأداء
        this.updateEnergy(Math.floor(points * 0.2));

        // زيادة المستوى كل 100 نقطة
        if (this.score >= this.level * 100) {
            this.levelUp();
        }

        eventBus.publish('gameCell.scoreUpdated', {
            cellId: this.id,
            ownerId: this.ownerId,
            score: this.score,
            combo: this.combo,
            level: this.level
        });
    }

    // خسارة أو كسر الكومبو
    breakCombo() {
        this.combo = 0;

        eventBus.publish('gameCell.comboBroken', {
            cellId: this.id,
            ownerId: this.ownerId
        });
    }

    // رفع المستوى
    levelUp() {
        this.level += 1;

        // مكافأة طاقة
        this.updateEnergy(30);

        eventBus.publish('gameCell.levelUp', {
            cellId: this.id,
            ownerId: this.ownerId,
            level: this.level
        });
    }

    // استهلاك طاقة أثناء اللعب
    consumeEnergy(amount) {
        if (this.energy < amount) {
            this.endGame();
            return false;
        }

        this.updateEnergy(-amount);
        return true;
    }

    // مكافأة اللاعب بعد نهاية اللعبة
    rewardPlayer() {
        const reward = Math.floor(this.score * 0.1);

        eventBus.publish('gameCell.reward', {
            cellId: this.id,
            ownerId: this.ownerId,
            reward,
            score: this.score
        });
    }

    // إعادة تعيين اللعبة
    resetGame() {
        this.score = 0;
        this.level = 1;
        this.combo = 0;
        this.state = 'idle';

        this.reset();

        eventBus.publish('gameCell.reset', {
            cellId: this.id,
            ownerId: this.ownerId
        });
    }

    // معلومات موسعة
    getInfo() {
        return {
            ...super.getInfo(),
            score: this.score,
            level: this.level,
            combo: this.combo,
            state: this.state
        };
    }
}

module.exports = GameCell;
