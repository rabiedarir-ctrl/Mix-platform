const Game = require('../models/gameModel.advanced');
const EnergyModel = require('../models/energyModel');
const eventBus = require('../core/eventBus');

/**
 * GameService
 * مسؤول عن إدارة الألعاب وربطها مع الطاقة والمكافآت
 */
class GameService {
    /**
     * بدء لعبة جديدة للمستخدم
     * @param {String} userId
     * @param {String} gameType
     */
    static async startGame(userId, gameType) {
        const existingGame = await Game.findOne({ userId, gameType, status: 'active' });
        if (existingGame) {
            return existingGame; // اللعبة ما زالت جارية
        }

        const newGame = new Game({
            userId,
            gameType,
            status: 'active'
        });

        await newGame.save();

        // نشر حدث بدء اللعبة
        eventBus.publish('game.started', { userId, gameType, gameId: newGame._id });

        return newGame;
    }

    /**
     * تحديث نتيجة اللعبة
     * @param {String} gameId
     * @param {Object} options
     *  {scoreDelta, levelDelta, energyCost, result, rewardItems}
     */
    static async updateGame(gameId, options) {
        const game = await Game.findById(gameId);
        if (!game) throw new Error('Game not found');

        return await game.updateGameAdvanced(options);
    }

    /**
     * إنهاء اللعبة يدويًا
     * @param {String} gameId
     * @param {String} result - "win", "lose", "paused"
     */
    static async endGame(gameId, result = 'completed') {
        const game = await Game.findById(gameId);
        if (!game) throw new Error('Game not found');

        game.status = result;
        game.lastPlayed = new Date();
        await game.save();

        eventBus.publish('game.ended', {
            userId: game.userId,
            gameType: game.gameType,
            status: result,
            gameId: game._id
        });

        return game;
    }

    /**
     * استرجاع كل الألعاب لمستخدم
     * @param {String} userId
     */
    static async getUserGames(userId) {
        return await Game.find({ userId }).sort({ lastPlayed: -1 });
    }

    /**
     * استرجاع اللعبة النشطة للمستخدم ونوع محدد
     */
    static async getActiveGame(userId, gameType) {
        return await Game.findOne({ userId, gameType, status: 'active' });
    }
}

module.exports = GameService;
