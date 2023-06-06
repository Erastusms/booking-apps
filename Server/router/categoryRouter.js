const express = require('express');
const categoryController = require('../controller/categoryContoller');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/CheckRole');
const router = express.Router();

router.post(
  '/create',
  auth,
  checkRole('admin'),
  categoryController.addCategory
);
router.get('/view', auth, categoryController.viewCategory);
router.patch(
  '/update/:id',
  auth,
  checkRole('admin'),
  categoryController.updateCategory
);
router.delete(
  '/delete/:id',
  auth,
  checkRole('admin'),
  categoryController.deleteCategory
);

module.exports = router;
