const express = require("express");
const router = express.Router();
const { addGigs } = require("../controllers/GigsController");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const authenticateUsers = require("../middlewares/authentication");

router.route("/add").post(authenticateUsers, upload.array("images"), addGigs);

module.exports = router;