const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const restrictions = require("../middlewares/restrictions");
const OrderItemController = require("../controllers/order-items");

router.route("/find-by-id").get(auth, OrderItemController.findById);
router.route("/find-one").get(auth, OrderItemController.findOne);
router
  .route("/find-and-count-all")
  .get(auth, restrictions, OrderItemController.findAndCountAll);

router.route("/create").post(auth, restrictions, OrderItemController.create);
router.route("/update-by-id").patch(auth, OrderItemController.updateById);
router.route("/update").patch(auth, OrderItemController.update);
router.route("/delete-by-id").delete(auth, OrderItemController.deleteById);
router.route("/delete").delete(auth, OrderItemController.delete);
router.route("/delete-one").delete(auth, OrderItemController.deleteOne);

module.exports = router;
