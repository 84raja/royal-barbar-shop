const router = require("express").Router();
const jadwalController = require("../controllers/jadwalController");
const verifyUser = require("./config/verify");

router.get("/", verifyUser.isLogin, jadwalController.index);
router.get("/add", verifyUser.isLogin, jadwalController.add);
router.post("/store", verifyUser.isLogin, jadwalController.store);
router.delete("/destroy/:id", verifyUser.isLogin, jadwalController.destroy);

module.exports = router;
