const express = require('express');
const router = express.Router();
const DreamWorld = require('../models/DreamWorld');
const { authenticateToken } = require('../core/auth');

// -------------------------------
// 🔹 إنشاء عالم حلم جديد
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { userId, dreamId, title, description, sceneData } = req.body;

        const newDreamWorld = new DreamWorld({
            userId,
            dreamId,
            title,
            description,
            sceneData
        });

        await newDreamWorld.save();
        res.status(201).json({ message: 'تم إنشاء عالم الحلم بنجاح', dreamWorld: newDreamWorld });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------
// 🔹 جلب كل الأحلام الخاصة بمستخدم
router.get('/user/:userId', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const dreams = await DreamWorld.find({ userId });
        res.json(dreams);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------
// 🔹 تحديث بيانات مشهد أو أحداث حلم
router.put('/:dreamId', authenticateToken, async (req, res) => {
    try {
        const { dreamId } = req.params;
        const { sceneData, events, energyImpact } = req.body;

        const dreamWorld = await DreamWorld.findOne({ dreamId });
        if (!dreamWorld) return res.status(404).json({ message: 'عالم الحلم غير موجود' });

        if (sceneData) dreamWorld.sceneData = sceneData;
        if (events) dreamWorld.events = events;
        if (energyImpact !== undefined) dreamWorld.energyImpact = energyImpact;

        await dreamWorld.save();
        res.json({ message: 'تم تحديث عالم الحلم', dreamWorld });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// -------------------------------
// 🔹 إضافة كائن مشهد جديد
router.post('/:dreamId/scene-object', authenticateToken, async (req, res) => {
    try {
        const { dreamId } = req.params;
        const { objData } = req.body;

        const dreamWorld = await DreamWorld.findOne({ dreamId });
        if (!dreamWorld) return res.status(404).json({ message: 'عالم الحلم غير موجود' });

        const objects = dreamWorld.addSceneObject(objData);
        await dreamWorld.save();

        res.json({ message: 'تم إضافة كائن مشهد', objects });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
var  express  =  require ( 'express' ) ; 
var  app  =  express ( ) ;

// إعداد مُحدد معدل الطلبات: بحد أقصى خمسة طلبات في الدقيقة 
var  RateLimit  =  require ( 'express-rate-limit' ) ; 
var  limiter  =  RateLimit ( { 
  windowMs : 15  *  60  *  1000 ,  // 15 دقيقة 
  max : 100 ,  // بحد أقصى 100 طلب لكل windowMs 
} ) ;


// تطبيق محدد معدل الطلبات على جميع الطلبات app.use ( limiter ) ;

app.get ( ' / : path ' , function ( req , res ) { let path = req.params.path ; if ( isValidPath ( path ) ) res.sendFile ( path ) ; } ) ;   
     
   
    
});

// -------------------------------
// 🔹 إضافة حدث تفاعلي جديد
router.post('/:dreamId/event', authenticateToken, async (req, res) => {
    try {
        const { dreamId } = req.params;
        const { eventData } = req.body;

        const dreamWorld = await DreamWorld.findOne({ dreamId });
        if (!dreamWorld) return res.status(404).json({ message: 'عالم الحلم غير موجود' });

        const events = dreamWorld.addEvent(eventData);
        await dreamWorld.save();

        res.json({ message: 'تم إضافة حدث تفاعلي', events });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
var  express  =  require ( 'express' ) ; 
var  app  =  express ( ) ;

// إعداد مُحدد معدل الطلبات: بحد أقصى خمسة طلبات في الدقيقة 
var  RateLimit  =  require ( 'express-rate-limit' ) ; 
var  limiter  =  RateLimit ( { 
  windowMs : 15  *  60  *  1000 ,  // 15 دقيقة 
  max : 100 ,  // بحد أقصى 100 طلب لكل windowMs 
} ) ;


// تطبيق محدد معدل الطلبات على جميع الطلبات app.use ( limiter ) ;

app.get ( ' / : path ' , function ( req , res ) { let path = req.params.path ; if ( isValidPath ( path ) ) res.sendFile ( path ) ; } ) ;   
     
   
    
});

// -------------------------------
// 🔹 التصدير
module.exports = router;
