const express = require('express');
const dashboardController = require('../controller/dashboardController');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/view', auth, dashboardController.viewDashboard);

module.exports = router;
