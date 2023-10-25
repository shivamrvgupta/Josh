const router = require('express').Router();
const authRoutes = require('./auth.routes');
const orderRoutes = require('./orders.routes')

router.use('/', authRoutes);
router.use('/order', orderRoutes);


module.exports = router;
