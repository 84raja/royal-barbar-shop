const router = require("express").Router();
const userController = require("../controllers/userController");
const verifyUser = require("./config/verify");

router.get("/", verifyUser.isLogin, userController.index);
router.get("/add", verifyUser.isLogin, userController.addForm);
router.post("/store", verifyUser.isLogin, userController.store);
router.get("/edit/:id", verifyUser.isLogin, userController.edit);
router.put("/update/:id", verifyUser.isLogin, userController.update);
router.get("/print", verifyUser.isLogin, userController.print);
router.delete("/destroy/:id", verifyUser.isLogin, userController.destroy);

module.exports = router;
