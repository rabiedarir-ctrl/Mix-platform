// backend/modules/cells/cell.js

const eventBus = require('../../core/eventBus');
const { v4: uuidv4 } = require('uuid');

class Cell {
    constructor({ type = 'generic', ownerId = null, energy = 0 }) {
        this.id = uuidv4();
        this.type = type;          // نوع الخلية: userCell, gameCell, dreamCell, etc.
        this.ownerId = ownerId;    // مالك الخلية (userId)
        this.energy = energy;      // طاقة الخلية
        this.status = 'active';    // حالة الخلية: active, inactive, dormant
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }

    // تحديث طاقة الخلية
    updateEnergy(amount) {
        this.energy += amount;
        if (this.energy < 0) this.energy = 0;
        this.updatedAt = new Date();

        // نشر إشعار لتحديث الطاقة
        eventBus.publish('cell.updated', {
            cellId: this.id,
            ownerId: this.ownerId,
            type: this.type,
            energy: this.energy,
            status: this.status
        });
    }

    // تغيير حالة الخلية
    setStatus(newStatus) {
        const validStatuses = ['active', 'inactive', 'dormant'];
        if (validStatuses.includes(newStatus)) {
            this.status = newStatus;
            this.updatedAt = new Date();

            eventBus.publish('cell.statusChanged', {
                cellId: this.id,
                ownerId: this.ownerId,
                type: this.type,
                status: this.status
            });
        }
    }

    // إعادة تعيين الخلية
    reset() {
        this.energy = 0;
        this.status = 'active';
        this.updatedAt = new Date();

        eventBus.publish('cell.reset', {
            cellId: this.id,
            ownerId: this.ownerId,
            type: this.type
        });
    }

    // الحصول على بيانات الخلية
    getInfo() {
        return {
            id: this.id,
            type: this.type,
            ownerId: this.ownerId,
            energy: this.energy,
            status: this.status,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

module.exports = Cell;
