const Service = require("../models/serviceModel");

module.exports = {
  index: (req, res) => {
    Service.getAll(req.db, (err, services) => {
      if (err) throw err;
      res.render("services/index", {
        page_name: "services",
        role: req.session.role,
        services: services,
      });
    });
  },

  add: (req, res) => {
    res.render("services/addService", {
      page_name: "services",
      role: req.session.role,
    });
  },

  store: (req, res) => {
    const { nama_layanan, harga, keterangan } = req.body;
    const formData = {
      nama_layanan,
      harga,
      keterangan,
    };
    Service.store(req.db, formData, (err, result) => {
      if (err) {
        console.error(err.sql);
        req.flash("error", `gagal menyimpan data`);
        res.redirect("/services");
      }
      req.flash("success", "Data Layanan Berhasil ditambahakan");
      res.redirect("/services");
    });
  },

  edit: (req, res) => {
    const { id } = req.params;
    Service.getById(req.db, id, (err, service) => {
      if (err) {
        console.error(err);
        req.flash("error", `gagal menyambil data`);
        res.redirect("/services");
      }
      res.render("services/editService", {
        page_name: "services",
        role: req.session.role,
        service: service[0],
      });
    });
  },

  update: (req, res) => {
    const { id } = req.params;
    const { nama_layanan, harga, keterangan } = req.body;
    const formData = {
      nama_layanan,
      harga,
      keterangan,
    };
    Service.update(req.db, id, formData, (err, result) => {
      if (err) {
        req.flash("error", `gagal update data`);
        res.redirect("/services");
      }
      req.flash("success", "Data berhasil diubah");
      res.redirect("/services");
    });
  },

  destroy: (req, res) => {
    const { id } = req.params;
    Service.delete(req.db, id, (err, result) => {
      if (err) {
        req.flash("error", `gagal menghapus data`);
        res.redirect("/services");
      }
      req.flash("success", "Data berhasil dihapus");
      res.redirect("/services");
    });
  },
};
