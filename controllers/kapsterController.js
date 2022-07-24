const Kapster = require("../models/kapsterModel");

module.exports = {
  index: (req, res) => {
    Kapster.getAll(req.db, (err, kapsters) => {
      if (err) {
        console.log(err);
        req.flash("error", "gagal menyambil data");
        res.render("kapster/index", { page_name: "kapster", kapsters: [] });
      }
      res.render("kapster/index", {
        page_name: "kapster",
        kapsters,
        role: req.session.role,
      });
    });
  },
  add: (req, res) => {
    res.render("kapster/addKapster", {
      page_name: "kapster",
      role: req.session.role,
    });
  },
  store: (req, res) => {
    const { nama, no_telp, alamat } = req.body;
    const formData = {
      nama,
      no_telp,
      alamat,
    };
    Kapster.store(req.db, formData, (err, result) => {
      if (err) {
        console.log(err);
        req.flash("error", "gagal menyambil data");
        res.render("kapster/index", { page_name: "kapster", kapsters: [] });
      }
      req.flash("success", "Berhasil menambah data kapster !");
      res.redirect("/kapster");
    });
  },
  edit: (req, res) => {
    const { id } = req.params;
    Kapster.getById(req.db, id, (err, kapster) => {
      if (err) {
        console.log(err);
        req.flash("error", "gagal menyambil data");
        res.render("kapster/index", { page_name: "kapster", kapsters: [] });
      }
      console.log(kapster);
      res.render("kapster/editKapster", {
        page_name: "kapster",
        role: req.session.role,
        kapster: kapster[0],
      });
    });
  },
  update: (req, res) => {
    const { id } = req.params;
    const { nama, alamat, no_telp } = req.body;
    const formData = {
      nama,
      alamat,
      no_telp,
    };
    Kapster.update(req.db, id, formData, (err, result) => {
      if (err) {
        console.log(err);
        req.flash("error", "gagal update data");
        res.render("kapster/index", { page_name: "kapster", kapsters: [] });
      }
      req.flash("success", "Berhasil Mengubah data kapster !");
      res.redirect("/kapster");
    });
  },
  destroy: (req, res) => {
    const { id } = req.params;
    Kapster.delete(req.db, id, (err, result) => {
      if (err) {
        console.log(err);
        req.flash("error", "gagal menghapus data");
        res.render("kapster/index", { page_name: "kapster", kapsters: [] });
      }
      req.flash("success", "Berhasil menghapus data kapster !");
      res.redirect("/kapster");
    });
  },
};
