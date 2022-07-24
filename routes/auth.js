const router = require("express").Router();
const authController = require("../controllers/authController");
const verifyUser = require("./config/verify");

router.get("/register", verifyUser.isLogout, authController.register);
router.post("/postRegister", verifyUser.isLogout, authController.postRegister);
router.get("/login", verifyUser.isLogout, authController.login);
router.post("/postLogin", verifyUser.isLogout, authController.postLogin);
router.post("/logout", verifyUser.isLogin, authController.logout);

module.exports = router;
