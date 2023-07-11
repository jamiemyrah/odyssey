const express = require('express');
const router = express.Router();
const OrderController  = require('../controllers/orders');

// router.route('/find-by-id').get(OrderController.findById);
router.route('/find-one').get(OrderController.findOne);
router.route('/find-and-count-all').get(OrderController.findAndCountAll);
router.route('/create').post(OrderController.create);
router.route('/update-by-id').patch(OrderController.updateById);
router.route('/update').patch(OrderController.update);
router.route('/delete-by-id').delete(OrderController.deleteById);
router.route('/delete').delete(OrderController.delete);
router.route('/delete-one').delete(OrderController.deleteOne);



module.exports = router;
