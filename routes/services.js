const router = require("express").Router();
const servicesController = require("../controllers/servicesController");
const verifyUser = require("../routes/config/verify");

router.get("/", verifyUser.isLogin, servicesController.index);
router.get("/add", verifyUser.isLogin, servicesController.add);
router.post("/store", verifyUser.isLogin, servicesController.store);
router.get("/edit/:id", verifyUser.isLogin, servicesController.edit);
router.put("/update/:id", verifyUser.isLogin, servicesController.update);
router.delete("/destroy/:id", verifyUser.isLogin, servicesController.destroy);
router.get("/print", verifyUser.isLogin, servicesController.print);

module.exports = router;
