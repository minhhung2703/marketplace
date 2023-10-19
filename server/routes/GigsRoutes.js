const express = require("express");
const router = express.Router();
const {
    addGigs,
    getUserAuthGigs,
    getGigData,
    editGig
} = require("../controllers/GigsController");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const authenticateUsers = require("../middlewares/authentication");

router.route("/add").post(authenticateUsers, upload.array("images"), addGigs);
router.route("/get-user-gigs").get(authenticateUsers, getUserAuthGigs);
router.route("/get-gig-data/:gigId").get(getGigData);
router.route("/edit-gig/:gigId").put(authenticateUsers, upload.array("images"), editGig)
module.exports = router;