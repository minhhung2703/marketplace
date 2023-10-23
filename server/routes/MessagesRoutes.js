const express = require("express");
const { addMessage, getMessages, getUnreadMessage } = require("../controllers/MessageControllers");
const authenticateUsers = require("../middlewares/authentication");
const router = express.Router();

router.route("/add-message/:orderId").post(authenticateUsers, addMessage)
router.route("/get-message/:orderId").get(authenticateUsers, getMessages)
router.route("/get-unread-message").get(authenticateUsers, getUnreadMessage)

module.exports = router