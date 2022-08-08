const router = require("express").Router();
const verifyUser = require("./config/verify");
const transaksiController = require("../controllers/transaksiController");

router.get("/", verifyUser.isLogin, transaksiController.index);
router.post("/store", verifyUser.isLogin, transaksiController.store);
router.post("/lihat", verifyUser.isLogin, transaksiController.cariTransaksi);
router.get(
  "/download/:tgl1/:tgl2",
  verifyUser.isLogin,
  transaksiController.download
);
router.post(
  "/donwload-laporan-bulanan",
  verifyUser.isLogin,
  transaksiController.downloadMonth
);

module.exports = router;
