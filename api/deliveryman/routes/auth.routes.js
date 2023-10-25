const router = require('express').Router();
const { AuthController } = require('../controllers');
const { AuthMiddleware, MulterMiddleware } = require('../middlewares');


router.get('/getProfile',AuthMiddleware.authenticateToken , AuthController.getProfile);
router.post('/login', AuthController.login);
router.get('/userdata',AuthMiddleware.authenticateToken ,AuthController.getUser);
router.post('/logout', AuthMiddleware.authenticateToken ,AuthController.logout);



module.exports = router;