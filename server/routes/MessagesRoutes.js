const express = require("express");
const { addMessage } = require("../controllers/MessageControllers");
const router = express.Router();

router.route("/addMessage").post(addMessage)

module.exports = router