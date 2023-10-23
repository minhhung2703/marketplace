const express = require("express");
const {
    createOrder,
    confirmOrder,
    getBuyerOrders,
    getSellerOrders
} = require("../controllers/OrderControllers");
const authenticateUsers = require("../middlewares/authentication");
const router = express.Router();

router.route("/create").post(authenticateUsers, createOrder);
router.route("/success").put(authenticateUsers, confirmOrder);
router.route("/get-buyer-orders").get(authenticateUsers, getBuyerOrders);
router.route("/get-seller-orders").get(authenticateUsers, getSellerOrders)

module.exports = router