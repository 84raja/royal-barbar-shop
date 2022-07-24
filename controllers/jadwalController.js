const Jadwal = require("../models/jadwalModel");

module.exports = {
  index: (req, res) => {
    Jadwal.getAll(req.db, (err, jadwals) => {
      if (err) {
        req.flash("error", "gagal menyambil data");
        res.render("jadwal/index", { page_name: "jadwal" });
      }

      res.render("jadwal/index", {
        page_name: "jadwal",
        jadwals,
        role: req.session.role,
      });
    });
  },

  add: (req, res) => {
    res.render("jadwal/addJadwal", {
      page_name: "jadwal",
      role: req.session.role,
    });
  },

  store: (req, res) => {
    const { jam } = req.body;
    Jadwal.store(req.db, { jam: jam }, (err, result) => {
      if (err) {
        console.log(err);
        req.flash("error", "gagal menambahkan data");
        res.redirect("/jadwal");
      }
      req.flash("success", "Data Jadwal Berhasil ditambah");
      res.redirect("/jadwal");
    });
  },

  destroy: (req, res) => {
    const { id } = req.params;
    Jadwal.delete(req.db, id, (err, result) => {
      if (err) {
        req.flash("error", "gagal menghapus data");
        res.redirect("/jadwal");
      }

      req.flash("success", "Data Berhasil dihapus");
      res.redirect("/jadwal");
    });
  },
};
