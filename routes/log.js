const router = require("express").Router();
const logController = require("../controllers/logController");

router.get("/", logController.cekLogin);

module.exports = router;
