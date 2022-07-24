const roter = require("express").Router();
const verifyUser = require("./config/verify");
const kapsterController = require("../controllers/kapsterController");

roter.get("/", verifyUser.isLogin, kapsterController.index);
roter.get("/add", verifyUser.isLogin, kapsterController.add);
roter.post("/store", verifyUser.isLogin, kapsterController.store);
roter.get("/edit/:id", verifyUser.isLogin, kapsterController.edit);
roter.put("/update/:id", verifyUser.isLogin, kapsterController.update);
roter.delete("/destroy/:id", verifyUser.isLogin, kapsterController.destroy);

module.exports = roter;
