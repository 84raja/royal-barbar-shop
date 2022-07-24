const router = require("express").Router();
const verifyUser = require("./config/verify");
const modelRambutController = require("../controllers/modelRambutController");
const multer = require("multer");
//untuk menambahkan path
const path = require("path");

// menentukan lokasi pengunggahan
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage: diskStorage });

router.get("/", verifyUser.isLogin, modelRambutController.index);
router.get("/add", verifyUser.isLogin, modelRambutController.add);
router.post(
  "/store",
  verifyUser.isLogin,
  upload.single("foto"),
  modelRambutController.store
);
router.get("/edit/:id", verifyUser.isLogin, modelRambutController.edit);
router.put(
  "/update/:id",
  verifyUser.isLogin,
  upload.single("foto"),
  modelRambutController.update
);
router.delete(
  "/destroy/:id",
  verifyUser.isLogin,
  modelRambutController.destroy
);

module.exports = router;
