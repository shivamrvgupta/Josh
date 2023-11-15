const router = require('express').Router();
const { SettingsControllers } = require('../controllers');
const { AuthMiddleware } = require('../middlewares');

router.get('/notification', AuthMiddleware.authenticateToken , SettingsControllers.getNotify);
router.get('/notification/add', AuthMiddleware.authenticateToken , SettingsControllers.getAddNotify);
router.get('/notification/update/:id', AuthMiddleware.authenticateToken , SettingsControllers.getUpdateNotify);


router.post('/notification/add', AuthMiddleware.authenticateToken , SettingsControllers.postAddNotify);
router.post('/notification/update/:id', AuthMiddleware.authenticateToken , SettingsControllers.postUpdateNotify);
router.get('/notification/send/:id', AuthMiddleware.authenticateToken, SettingsControllers.sendNotification)
module.exports = router;
