const express = require('express');
const router = express.Router();
const vnpayController = require('../controllers/PaymentController');

router.get('/create_payment_url', vnpayController.createPayment);
router.get('/vnpay-return', vnpayController.vnpayReturn);
module.exports = router;
