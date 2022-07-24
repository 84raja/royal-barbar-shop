const router = require("express").Router();
const verifyUser = require("./config/verify");
const customerController = require("../controllers/customerController");

router.get("/home", verifyUser.isLogin, customerController.home);
router.get("/booking", verifyUser.isLogin, customerController.indexBooking);
router.post(
  "/store-booking",
  verifyUser.isLogin,
  customerController.storeBooking
);
router.get(
  "/model-rambut",
  verifyUser.isLogin,
  customerController.indexModelRambut
);
router.put("/cancel/:id", verifyUser.isLogin, customerController.cancel);

module.exports = router;
