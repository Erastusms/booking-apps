const express = require('express');
const infoController = require('../controller/infoController');
const { uploadSingle } = require('../middleware/multer');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/CheckRole');
const router = express.Router();

router.post(
  '/create',
  auth,
  checkRole('admin'),
  uploadSingle,
  infoController.addInfo
);
router.get('/view', infoController.viewInfo);
router.patch(
  '/update/:id',
  auth,
  checkRole('admin'),
  uploadSingle,
  infoController.updateInfo
);
router.delete(
  '/delete/:id',
  auth,
  checkRole('admin'),
  infoController.deleteInfo
);

module.exports = router;
