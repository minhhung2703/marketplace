const express = require("express");
const router = express.Router();
const {
    addGig,
    checkGigOrder,
    editGig,
    getGigData,
    getUserAuthGigs,
    searchGigs,
    addReview,
} = require("../controllers/GigsController");

const authenticateUsers = require("../middlewares/authentication");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.route("/add").post(authenticateUsers, upload.array("images"), addGig);
router.route("/get-user-gigs").get(authenticateUsers, getUserAuthGigs)
router.route("/get-gig-data/:gigId").get(getGigData)
router.route("/edit-gig/:gigId").put(authenticateUsers, upload.array("images"), editGig)
router.route("/search-gigs").get(searchGigs);
router.route("/add-review").post(authenticateUsers, addReview);
router.route("/check-gig-order/:gigId").get(authenticateUsers, checkGigOrder);
router.route("/add-review/:gigId").post(authenticateUsers, addReview);

module.exports = router;
