const express = require('express');
const customerController = require('../controller/customerController');
const { uploadSingle } = require('../middleware/multer');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/CheckRole');
const router = express.Router();

router.post(
  '/create',
  auth,
  checkRole('admin'),
  uploadSingle,
  customerController.addCustomer
);
router.get('/view', auth, customerController.viewCustomer);
router.patch(
  '/update/:id',
  auth,
  checkRole('admin'),
  customerController.updateCustomer
);
router.delete(
  '/delete/:id',
  auth,
  checkRole('admin'),
  customerController.deleteCustomer
);

module.exports = router;
