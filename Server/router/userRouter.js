const express = require('express');
const userController = require('../controller/userController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/CheckRole');
const router = express.Router();

router.post('/create', auth, checkRole('admin'), userController.addUser);
router.get('/view', auth, userController.viewUser);
router.patch(
  '/update/:id',
  auth,
  checkRole('admin'),
  userController.updateUser
);
router.delete(
  '/delete/:id',
  auth,
  checkRole('admin'),
  userController.deleteUser
);

router.post('/login', userController.login);
router.post('/logout', auth, userController.logout);
router.post('/logoutAll', auth, userController.logoutAll);
router.get('/info', auth, userController.viewMe);

module.exports = router;
