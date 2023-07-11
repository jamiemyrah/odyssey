const express = require('express');
const router = express.Router();
const OrderItemController  = require('../controllers/order-items');

router.route('/find-by-id').get(OrderItemController.findById);
router.route('/find-one').get(OrderItemController.findOne);
router.route('/find-and-count-all').get(OrderItemController.findAndCountAll);

router.route('/create').post(OrderItemController.create);

router.route('/update-by-id').patch(OrderItemController.updateById);
router.route('/update').patch(OrderItemController.update);
router.route('/delete-by-id').delete(OrderItemController.deleteById);
router.route('/delete').delete(OrderItemController.delete);
router.route('/delete-one').delete(OrderItemController.deleteOne);



module.exports = router;
