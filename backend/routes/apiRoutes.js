const express = require('express');
const router = express.Router();

// Middlewares
const authMiddleware = require('../middlewares/authMiddleware');
const loggingMiddleware = require('../middlewares/loggingMiddleware');
const errorHandler = require('../middlewares/errorHandler');

// Modules
const cellsRoutes = require('../modules/cells/cellRoutes');
const gamesRoutes = require('../modules/games/gameRoutes');
const walletRoutes = require('../modules/wallet/walletRoutes');
const socialRoutes = require('../modules/social/socialRoutes');

// تطبيق Logging Middleware لجميع الطلبات
router.use(loggingMiddleware);

// مسارات عامة غير محمية
router.get('/status', (req, res) => {
    res.json({ status: 'Mix Platform API is running 🚀', timestamp: new Date() });
});

// مسارات محمية تتطلب JWT
router.use(authMiddleware);
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
     
   
    
// ربط مسارات الموديولات
router.use('/cells', cellsRoutes);
router.use('/games', gamesRoutes);
router.use('/wallet', walletRoutes);
router.use('/social', socialRoutes);

// أي Route غير موجود
router.use((req, res, next) => {
    const err = new Error('API endpoint not found');
    err.status = 404;
    next(err);
});

// Middleware لإدارة الأخطاء
router.use(errorHandler);

module.exports = router;
