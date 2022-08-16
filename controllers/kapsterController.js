const Kapster = require("../models/kapsterModel");
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

  print: async (req, res) => {
    function getKapster() {
      return new Promise((resolve, reject) => {
        Kapster.getAll(req.db, (err, kapsters) => {
          if (err) {
            reject(console.log(err));
          }
          const data = kapsters.map((kapster) => {
            return {
              id: kapster.id,
              nama: kapster.nama.toUpperCase(),
              no_telp: kapster.no_telp,
              alamat: kapster.alamat,
            };
          });
          resolve(data);
        });
      });
    }

    if (fs.existsSync(`report-kapster.pdf`)) {
      fs.unlink(`report-kapster.pdf`, (err) => {
        if (err) throw err;
        console.log("successfully deleted");
      });
    }
    const data = {
      data: await getKapster(),
      tanggalSekarang: fnTanggal(),
    };
    console.log(data);

    ejs.renderFile(
      path.join(__dirname, "../views/kapster", "report-kapster.ejs"),
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
            .toFile("report-kapster.pdf", function (err, data) {
              if (err) {
                res.send(err);
              } else {
                res.download("report-kapster.pdf");
              }
            });
        }
      }
    );
  },
};
