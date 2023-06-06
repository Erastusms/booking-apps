const express = require('express');
const featureController = require('../controller/featureController');
const { uploadSingle } = require('../middleware/multer');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/CheckRole');
const router = express.Router();

router.post(
  '/create',
  auth,
  checkRole('admin'),
  uploadSingle,
  featureController.addFeature
);
router.get('/view', auth, featureController.viewFeature);
router.patch(
  '/update/:id',
  auth,
  checkRole('admin'),
  uploadSingle,
  featureController.updateFeature
);
router.delete(
  '/delete/:id',
  auth,
  checkRole('admin'),
  featureController.deleteFeature
);

module.exports = router;
