const express = require("express");
const { addMessage, getMessages } = require("../controllers/MessageControllers");
const router = express.Router();

router.route("/addMessage").post(addMessage)
router.route("/getMessage").get(getMessages)

module.exports = router