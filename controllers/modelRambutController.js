const Model = require("../models/modelRambutModel");
const fs = require("fs");

module.exports = {
  index: (req, res) => {
    Model.getAll(req.db, (err, models) => {
      if (err) {
        // res.send(err);
        req.flash("error", `Gagal Mengambil data ! error : ${err.code}`);
        res.render("model-rambut/index", {
          page_name: "model",
          models: [],
        });
      }
      res.render("model-rambut/index", {
        page_name: "model",
        role: req.session.role,
        models: models,
      });
    });
  },
  add: (req, res) => {
    res.render("model-rambut/add", {
      page_name: "model",
      role: req.session.role,
    });
  },
  store: (req, res) => {
    console.log(req.file.path);
    const foto = req.file.filename;
    const { model, keterangan } = req.body;
    const formData = {
      model,
      foto,
      keterangan,
    };
    console.log(formData);
    Model.store(req.db, formData, (err, result) => {
      if (err) {
        console.log(err);
        req.flash("error", `Gagal Menyimpan data ! error : ${err.Error}`);
        res.redirect("/model-rambut");
      }
      req.flash("success", `Berhasil Menyimpan data`);
      res.redirect("/model-rambut");
    });
  },
  edit: (req, res) => {
    const { id } = req.params;
    Model.getById(req.db, id, (err, model) => {
      if (err) {
        console.log(err);
        req.flash("error", `Gagal mengambil data ! error : ${err.Error}`);
        res.redirect("/model-rambut");
      }
      res.render("model-rambut/edit", {
        page_name: "model",
        role: req.session.role,
        model: model[0],
      });
    });
  },
  update: (req, res) => {
    const { id } = req.params;
    const foto = req.file.filename;
    const { model, keterangan } = req.body;
    const formData = {
      model,
      foto,
      keterangan,
    };
    if (req.file) {
      console.log("ada file");
      Model.getById(req.db, id, async (err, model) => {
        console.log("ada foto di images");

        if (fs.existsSync(`public/images/${model[0].foto}`)) {
          fs.unlink(`public/images/${model[0].foto}`, (err) => {
            if (err) throw err;
            console.log("successfully deleted");
          });
        }
      });
    }

    Model.update(req.db, id, formData, (err, result) => {
      if (err) {
        console.log(err);
        req.flash("error", `Gagal Menyimpan data ! error : ${err.Error}`);
        res.redirect("/model-rambut");
      }

      req.flash("success", `Berhasil Update data`);
      res.redirect("/model-rambut");
    });
  },
  destroy: (req, res) => {
    const { id } = req.params;
    Model.getById(req.db, id, async (err, model) => {
      if (fs.existsSync(`public/images/${model[0].foto}`)) {
        fs.unlink(`public/images/${model[0].foto}`, (err) => {
          if (err) throw err;
          console.log("successfully deleted");
        });
      }
    });
    Model.delete(req.db, id, (err, result) => {
      if (err) {
        console.log(err);
        req.flash("error", `Gagal Menghapus data ! error : ${err.Error}`);
        res.redirect("/model-rambut");
      } else {
        req.flash("success", `Berhasil Menghapus data`);
        res.redirect("/model-rambut");
      }
    });
  },
};
