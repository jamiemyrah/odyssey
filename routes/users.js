const express = require('express');
const router = express.Router();
const UserController  = require('../controllers/users');

router.route('/find-by-id').get(UserController.findById);
router.route('/find-one').get(UserController.findOne);
router.route('/find-and-count-all').get(UserController.findAndCountAll);
router.route('/create').post(UserController.create);
router.route('/update').patch(UserController.update);
router.route('/login').post(UserController.login);
router.route('/setPassword').post(UserController.setPassword);
router.route('/update-by-id').patch(UserController.updateById);
router.route('/update').patch(UserController.update);
router.route('/delete-by-id').delete(UserController.deleteById);
router.route('/delete-one').delete(UserController.deleteOne);



module.exports = router;
