const express = require('express');
const itemController = require('../controller/itemController');
const imageController = require('../controller/imageController');
const { uploadMultiple } = require('../middleware/multer');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/CheckRole');
const router = express.Router();

router.post(
  '/create',
  auth,
  checkRole('admin'),
  uploadMultiple,
  itemController.addItem
);
router.get('/view', itemController.viewItem);
router.patch(
  '/update/:id',
  auth,
  checkRole('admin'),
  itemController.updateItem
);
router.delete(
  '/delete/:id',
  auth,
  checkRole('admin'),
  itemController.deleteItem
);

router.post(
  '/add-image/:itemId',
  auth,
  checkRole('admin'),
  uploadMultiple,
  imageController.addImageItem
);
router.delete(
  '/delete-image/:itemId/:id',
  auth,
  checkRole('admin'),
  imageController.deleteImageItem
);

module.exports = router;
