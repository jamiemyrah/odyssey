const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const restrictions = require("../middlewares/restrictions");
const UserController = require("../controllers/users");

router.route("/find-by-id").get(auth, restrictions, UserController.findById);
router.route("/find-one").get(auth, UserController.findOne);
router
  .route("/find-and-count-all")
  .get(auth, restrictions, UserController.findAndCountAll);
router.route("/create").post(auth, restrictions, UserController.create);
router.route("/login").post(UserController.login);
router.route("/logout").post(auth, UserController.logout);
router.route("/setPassword").post(UserController.setPassword);
router.route("/setUser").post(auth, UserController.setUser);
router.route("/update-by-id").patch(auth, UserController.updateById);
router.route("/update").patch(auth, UserController.update);
router.route("/delete-by-id").delete(auth, UserController.deleteById);
router.route("/delete-one").delete(auth, UserController.deleteOne);

module.exports = router;
