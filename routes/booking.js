const router = require("express").Router();
const verifyUser = require("./config/verify");
const bookingController = require("../controllers/bookingController");

router.get("/", verifyUser.isLogin, bookingController.index);
router.post("/cari-booking", verifyUser.isLogin, bookingController.cariBooking);
router.get("/add", verifyUser.isLogin, bookingController.add);
router.post("/store", verifyUser.isLogin, bookingController.store);
router.get("/jadwal-kapster/:id_kapster/:tgl", bookingController.jadwalKapster);
router.put("/cancel/:id", verifyUser.isLogin, bookingController.batal);
router.put("/done/:id", verifyUser.isLogin, bookingController.selesai);

router.post("/report-booking", verifyUser.isLogin, bookingController.reportPdf);

module.exports = router;
