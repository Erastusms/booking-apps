const express = require('express');
const bookingController = require('../controller/bookingController');
const { uploadSingle } = require('../middleware/multer');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/CheckRole');
const router = express.Router();

router.post('/create', uploadSingle, bookingController.createBooking);
router.get('/view', auth, bookingController.viewBooking);
router.get('/view/:id', auth, bookingController.showDetailBooking);
router.put(
  '/reject/:id',
  auth,
  checkRole('admin'),
  bookingController.actionReject
);
router.put(
  '/accept/:id',
  auth,
  checkRole('admin'),
  bookingController.actionAccept
);
router.delete(
  '/delete/:id',
  auth,
  checkRole('admin'),
  bookingController.deleteBooking
);

module.exports = router;
