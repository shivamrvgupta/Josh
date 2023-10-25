const router = require('express').Router();
const { OrderController } = require('../controllers');
const { AuthMiddleware } = require('../middlewares');


router.get('/get', AuthMiddleware.authenticateToken ,OrderController.orderList);
router.get('/get-order', AuthMiddleware.authenticateToken ,OrderController.perOrder);
router.get('/previous-order', AuthMiddleware.authenticateToken ,OrderController.previousOrder);
router.post('/delete', AuthMiddleware.authenticateToken ,OrderController.deleteOrder);
router.post('/update-status', AuthMiddleware.authenticateToken ,OrderController.updateDeliveryStatus);
router.post('/update-payment', AuthMiddleware.authenticateToken ,OrderController.updatePaymentStatus);

module.exports = router;