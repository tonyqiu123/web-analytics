const express = require('express');
const router = express.Router();
const { updateTraffic, getTraffic } = require('../controllers/trafficController');

router.get('/', getTraffic);
router.post('/', updateTraffic);

module.exports = router;