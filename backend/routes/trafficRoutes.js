const express = require('express');
const router = express.Router();
const { updateTraffic, getTraffic } = require('../controllers/trafficController');

router.get('/', getTraffic);
router.put('/', updateTraffic);

module.exports = router;