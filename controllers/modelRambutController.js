const Model = require("../models/modelRambutModel");
const fs = require("fs");
let pdf = require("html-pdf");
let path = require("path");
let ejs = require("ejs");

function fnTanggal() {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const tanggal = `${yyyy}-${mm}-${dd}`;
  return tanggal;
}
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
    const { model, keterangan } = req.body;
    let formData = {
      model,
      keterangan,
    };
    if (req.file) {
      console.log("ada file");
      const foto = req.file.filename;
      formData = {
        model,
        foto,
        keterangan,
      };
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

  print: async (req, res) => {
    function getModel() {
      return new Promise((resolve, reject) => {
        Model.getAll(req.db, (err, models) => {
          if (err) {
            reject(console.log(err));
          }
          const data = models.map((model) => {
            return {
              id: model.id,
              nama: model.model.toUpperCase(),
              foto: model.foto,
              keterangan: model.keterangan,
            };
          });
          resolve(data);
        });
      });
    }

    if (fs.existsSync(`report-model.pdf`)) {
      fs.unlink(`report-model.pdf`, (err) => {
        if (err) throw err;
        console.log("successfully deleted");
      });
    }
    const data = {
      data: await getModel(),
      tanggalSekarang: fnTanggal(),
    };
    console.log(data);

    // res.render("model-rambut/report-model-rambut.ejs", {
    //   page_name: "model",
    //   role: req.session.role,
    //   datas: data,
    // });

    ejs.renderFile(
      path.join(__dirname, "../views/model-rambut", "report-model-rambut.ejs"),
      { datas: data },
      (err, data) => {
        if (err) {
          res.send(err);
        } else {
          let options = {
            height: "11.25in",
            width: "8.5in",
            header: {
              height: "20mm",
            },
            footer: {
              height: "20mm",
            },
          };
          pdf
            .create(data, options)
            .toFile("report-model-rambut.pdf", function (err, data) {
              if (err) {
                res.send(err);
              } else {
                res.download("report-model-rambut.pdf");
              }
            });
        }
      }
    );
  },
};
