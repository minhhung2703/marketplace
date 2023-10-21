const express = require("express")
const { createOrder } = require("../controllers/OrderControllers")
const authenticateUsers = require("../middlewares/authentication")
const router = express.Router()

router.route("/create").post(authenticateUsers, createOrder)

module.exports = router