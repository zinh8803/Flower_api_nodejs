// orderRoute.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/OrderController");


router.post("/", orderController.createOrder);

router.post("/:id/user=:user_id", orderController.cancelOrder);

router.get("/user/:id", orderController.getUserOrders);
router.get("/:id/user=:user_id", orderController.getOrderById);
router.get("/", orderController.getAllOrders);

module.exports = router;