const Service = require("../models/serviceModel");
let pdf = require("html-pdf");
let path = require("path");
let ejs = require("ejs");
const fs = require("fs");

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

  print: async (req, res) => {
    function getService() {
      return new Promise((resolve, reject) => {
        Service.getAll(req.db, (err, services) => {
          if (err) {
            reject(console.log(err));
          }
          const data = services.map((service) => {
            return {
              id: service.id,
              nama_layanan: service.nama_layanan.toUpperCase(),
              harga: service.harga,
              keterangan: service.keterangan,
            };
          });
          resolve(data);
        });
      });
    }

    if (fs.existsSync(`report-service.pdf`)) {
      fs.unlink(`report-service.pdf`, (err) => {
        if (err) throw err;
        console.log("successfully deleted");
      });
    }
    const data = {
      data: await getService(),
      tanggalSekarang: fnTanggal(),
    };
    console.log(data);

    ejs.renderFile(
      path.join(__dirname, "../views/services", "report-service.ejs"),
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
            .toFile("report-service.pdf", function (err, data) {
              if (err) {
                res.send(err);
              } else {
                res.download("report-service.pdf");
              }
            });
        }
      }
    );
  },
};
