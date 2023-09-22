const express = require('express');
const router = express.Router();
const { updateTraffic, getTraffic, getFirstDateOfDomain } = require('../controllers/trafficController');

router.get('/', getTraffic);
router.post('/', updateTraffic);
router.get('/getFirstDate/', getFirstDateOfDomain);

module.exports = router;