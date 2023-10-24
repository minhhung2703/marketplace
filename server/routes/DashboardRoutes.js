const express = require("express")
const router = express.Router();
const authenticateUsers = require("../middlewares/authentication");
const { getSellerData } = require("../controllers/DashboardController");

router.route("/seller").get(authenticateUsers, getSellerData)

module.exports = router;