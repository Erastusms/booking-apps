const express = require('express');
const homeController = require('../controller/homeController');
const router = express.Router();

router.get('/', homeController.viewHomePage);
router.get('/item/:id', homeController.viewDetailPage);

module.exports = router;
