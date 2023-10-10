const express = require("express")
const router = express.Router()
const {
    signup,
    login,
    getUserInfo,
    setUserInfo,
    setUserImage,
    logout,
} = require("../controllers/AuthControllers");

const authenticateUsers = require("../middlewares/authentication");
const multer = require("multer");
const upload = multer({ dest: "uploads/profiles/" });

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);

router.route("/get-user-info").post(authenticateUsers, getUserInfo);
router.route("/set-user-info").post(authenticateUsers, setUserInfo);
router.route("/set-user-image").post(authenticateUsers, upload.single("images"), setUserImage);
// router.route("/set-user-image").post(authenticateUsers, setUserImage);

module.exports = router;