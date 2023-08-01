const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const restrictions = require("../middlewares/restrictions");
const OrderController = require("../controllers/orders");

router.route("/find-by-id").get(auth, restrictions, OrderController.findById);
router.route("/find-one").get(auth, restrictions, OrderController.findOne);
router
  .route("/find-and-count-all")
  .get(auth, restrictions, OrderController.findAndCountAll);
router.route("/create").post(auth, restrictions, OrderController.create);
router.route("/update-by-id").patch(auth, OrderController.updateById);
router.route("/update").patch(auth, OrderController.update);
router.route("/delete-by-id").delete(auth, OrderController.deleteById);
router.route("/delete").delete(auth, OrderController.delete);
router.route("/delete-one").delete(auth, OrderController.deleteOne);

module.exports = router;
