const router = require("express").Router();
const verifyUser = require("./config/verify");
const billingController = require("../controllers/billingController");

router.get("/", verifyUser.isLogin, billingController.index);
router.put("/cancel/:id", verifyUser.isLogin, billingController.cancel);

module.exports = router;
