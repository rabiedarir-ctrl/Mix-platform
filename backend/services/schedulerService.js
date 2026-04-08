// backend/services/schedulerService.js

const eventBus = require('../core/eventBus');

class SchedulerService {
    constructor() {
        this.jobs = new Map();       // key: jobName → value: intervalId
        this.timeouts = new Map();   // key: jobName → value: timeoutId

        this.init();
    }

    init() {
        // مثال: تشغيل دورة طاقة كل 5 ثواني
        this.scheduleInterval('energy.cycle', () => {
            eventBus.publish('energy.cycle', {
                timestamp: Date.now()
            });
        }, 5000);

        // مثال: حفظ الذاكرة كل 30 ثانية
        this.scheduleInterval('memory.persist', () => {
            eventBus.publish('memory.persist', {
                timestamp: Date.now()
            });
        }, 30000);
    }

    // جدولة مهمة متكررة (Interval)
    scheduleInterval(name, task, interval) {
        if (this.jobs.has(name)) {
            this.cancelJob(name);
        }

        const id = setInterval(() => {
            try {
                task();
                eventBus.publish('scheduler.executed', {
                    name,
                    type: 'interval',
                    timestamp: Date.now()
                });
            } catch (error) {
                eventBus.publish('scheduler.error', {
                    name,
                    error: error.message
                });
            }
        }, interval);

        this.jobs.set(name, id);
    }

    // جدولة مهمة لمرة واحدة (Timeout)
    scheduleTimeout(name, task, delay) {
        if (this.timeouts.has(name)) {
            this.cancelTimeout(name);
        }

        const id = setTimeout(() => {
            try {
                task();
                eventBus.publish('scheduler.executed', {
                    name,
                    type: 'timeout',
                    timestamp: Date.now()
                });
            } catch (error) {
                eventBus.publish('scheduler.error', {
                    name,
                    error: error.message
                });
            } finally {
                this.timeouts.delete(name);
            }
        }, delay);

        this.timeouts.set(name, id);
    }

    // إلغاء مهمة متكررة
    cancelJob(name) {
        const job = this.jobs.get(name);
        if (job) {
            clearInterval(job);
            this.jobs.delete(name);

            eventBus.publish('scheduler.cancelled', {
                name,
                type: 'interval'
            });
        }
    }

    // إلغاء مهمة مؤقتة
    cancelTimeout(name) {
        const timeout = this.timeouts.get(name);
        if (timeout) {
            clearTimeout(timeout);
            this.timeouts.delete(name);

            eventBus.publish('scheduler.cancelled', {
                name,
                type: 'timeout'
            });
        }
    }

    // تشغيل مهمة مرة واحدة فوراً
    runNow(name, task) {
        try {
            task();

            eventBus.publish('scheduler.executed', {
                name,
                type: 'instant',
                timestamp: Date.now()
            });
        } catch (error) {
            eventBus.publish('scheduler.error', {
                name,
                error: error.message
            });
        }
    }

    // جدولة دورة طاقة للخلايا
    scheduleCellEnergyCycle(cellManager, interval = 5000) {
        this.scheduleInterval('cells.energyCycle', () => {
            const allCells = cellManager.exportData();

            allCells.forEach(cell => {
                eventBus.publish('cell.energy.tick', {
                    cellId: cell.id,
                    ownerId: cell.ownerId,
                    energy: cell.energy
                });
            });
        }, interval);
    }

    // جدولة تحليل الأحلام
    scheduleDreamAnalysis(cellManager, interval = 10000) {
        this.scheduleInterval('dream.analysis', () => {
            const allCells = cellManager.exportData();

            allCells
                .filter(cell => cell.type === 'dreamCell')
                .forEach(cell => {
                    eventBus.publish('dream.analyze', {
                        cellId: cell.id,
                        ownerId: cell.ownerId
                    });
                });
        }, interval);
    }

    // إحصائيات
    getStats() {
        return {
            activeIntervals: this.jobs.size,
            activeTimeouts: this.timeouts.size,
            jobs: Array.from(this.jobs.keys()),
            timeouts: Array.from(this.timeouts.keys())
        };
    }

    // إيقاف كل العمليات (مهم عند shutdown)
    shutdown() {
        this.jobs.forEach((id, name) => {
            clearInterval(id);
        });

        this.timeouts.forEach((id, name) => {
            clearTimeout(id);
        });

        this.jobs.clear();
        this.timeouts.clear();

        eventBus.publish('scheduler.shutdown', {
            timestamp: Date.now()
        });
    }
}

module.exports = new SchedulerService();
