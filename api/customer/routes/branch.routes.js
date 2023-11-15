const router = require('express').Router();
const { BranchController } = require('../controllers');
const { AuthMiddleware } = require('../middlewares');


router.get('/test', (req, res) => {
  res.send('About birds');
});

router.get('/nearest-branch',AuthMiddleware.authenticateToken ,BranchController.getNearestBranch)
router.get('/branchProducts',AuthMiddleware.authenticateToken ,BranchController.branchProducts)
router.get('/getDeliveryFees',AuthMiddleware.authenticateToken ,BranchController.getDeliveryFees)

module.exports = router;