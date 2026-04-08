// backend/modules/cells/cellManager.js

const Cell = require('./cell');
const eventBus = require('../../core/eventBus');

class CellManager {
    constructor() {
        // تخزين جميع الخلايا
        this.cells = new Map(); // key: cellId → value: Cell instance

        // فهرسة حسب المستخدم
        this.userCells = new Map(); // key: userId → value: [cellId]

        this.init();
    }

    init() {
        // مثال: الاستماع لإعادة تعيين النظام
        eventBus.subscribe('system.reset', () => {
            this.resetAllCells();
        });
    }

    // إنشاء خلية جديدة
    createCell({ type = 'generic', ownerId = null, energy = 0 }) {
        const cell = new Cell({ type, ownerId, energy });

        this.cells.set(cell.id, cell);

        if (ownerId) {
            if (!this.userCells.has(ownerId)) {
                this.userCells.set(ownerId, []);
            }
            this.userCells.get(ownerId).push(cell.id);
        }

        eventBus.publish('cell.created', {
            cellId: cell.id,
            ownerId: cell.ownerId,
            type: cell.type
        });

        return cell;
    }

    // الحصول على خلية عبر ID
    getCell(cellId) {
        return this.cells.get(cellId) || null;
    }

    // الحصول على خلايا مستخدم
    getUserCells(userId) {
        const ids = this.userCells.get(userId) || [];
        return ids.map(id => this.cells.get(id)).filter(Boolean);
    }

    // تحديث طاقة خلية
    updateCellEnergy(cellId, amount) {
        const cell = this.getCell(cellId);
        if (!cell) return false;

        cell.updateEnergy(amount);
        return true;
    }

    // تغيير حالة خلية
    setCellStatus(cellId, status) {
        const cell = this.getCell(cellId);
        if (!cell) return false;

        cell.setStatus(status);
        return true;
    }

    // حذف خلية
    deleteCell(cellId) {
        const cell = this.getCell(cellId);
        if (!cell) return false;

        this.cells.delete(cellId);

        if (cell.ownerId && this.userCells.has(cell.ownerId)) {
            const updated = this.userCells
                .get(cell.ownerId)
                .filter(id => id !== cellId);

            this.userCells.set(cell.ownerId, updated);
        }

        eventBus.publish('cell.deleted', {
            cellId,
            ownerId: cell.ownerId
        });

        return true;
    }

    // إعادة تعيين خلايا مستخدم
    resetUserCells(userId) {
        const cells = this.getUserCells(userId);

        cells.forEach(cell => {
            cell.reset();
        });

        eventBus.publish('user.cells.reset', { userId });
    }

    // إعادة تعيين جميع الخلايا
    resetAllCells() {
        this.cells.forEach(cell => {
            cell.reset();
        });

        eventBus.publish('cells.reset.all', {});
    }

    // إحصائيات عامة
    getStats() {
        return {
            totalCells: this.cells.size,
            totalUsers: this.userCells.size
        };
    }

    // تصدير بيانات الخلايا (للتخزين أو التحليل)
    exportData() {
        const data = [];

        this.cells.forEach(cell => {
            data.push(cell.getInfo());
        });

        return data;
    }
}

module.exports = new CellManager();
