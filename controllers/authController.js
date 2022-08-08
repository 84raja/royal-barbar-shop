const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const log = require("../models/log");

function fnTanggalToday() {
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
  register: (req, res) => {
    res.render("auth/register", {
      name_page: "register",
    });
  },
  postRegister: (req, res) => {
    const { nama, email, password, no_telp } = req.body;
    const passwordHash = bcrypt.hashSync(password, 10);
    const dataForm = {
      nama,
      email,
      no_telp,
      password: passwordHash,
    };
    User.store(req.db, dataForm, (err, result) => {
      if (err) {
        req.flash("error", `${err.message}`);
        res.redirect("/auth/register");
      }
      req.flash("success", "Berhasil Register !");
      res.redirect("/auth/login");
    });
  },
  login: async (req, res) => {
    async function cekDate() {
      return new Promise((resolve, reject) => {
        log.getById(req.db, 1, (err, result) => {
          if (err) {
            reject(console.log(err));
            res.end();
          }
          resolve(result[0]);
        });
      });
    }
    const dataLog = await cekDate();
    const tanggalLog = dataLog.tanggal;
    let record_login = dataLog.record_login;

    if (tanggalLog != fnTanggalToday()) {
      log.update(
        req.db,
        1,
        { record_login: 1, tanggal: fnTanggalToday() },
        async (err, result) => {
          if (err) {
            console.log(err);
            res.end();
          }
          const data = await cekDate();
          record_login = data.record_login;
        }
      );
    }
    res.render("auth/login", {
      name_page: "register",
      pengunjung: record_login,
    });
  },
  postLogin: async (req, res) => {
    const { email, password } = req.body;

    //update log pengunjung
    async function cekDate() {
      return new Promise((resolve, reject) => {
        log.getById(req.db, 1, (err, result) => {
          if (err) {
            reject(console.log(err));
            res.end();
          }
          resolve(result[0]);
        });
      });
    }
    const dataLog = await cekDate();
    const tanggalLog = dataLog.tanggal;
    if (tanggalLog == fnTanggalToday()) {
      let data = await cekDate();
      let record_login = data.record_login + 1;
      console.log(record_login);
      log.update(req.db, 1, { record_login }, async (err, result) => {
        if (err) {
          console.log(err);
          res.end();
        }
      });
    }
    // end update log pengunjung

    User.getByEmail(req.db, email, (err, result) => {
      if (err) {
        console.log(err);
      }

      if (
        result.length === 0 ||
        !bcrypt.compareSync(password, result[0].password)
      ) {
        console.log(result.length);
        req.flash("error", `Masukan email dan password dengan benar !`);
        res.redirect("/auth/login");
      } else {
        console.log(result.length);
        req.session.loggedin = true;
        req.session.idUser = result[0].id;
        req.session.nama = result[0].nama;
        req.session.role = result[0].role;
        req.session.save();
        if (req.session.role == "Pelanggan") {
          res.redirect("/customer/home");
        } else {
          res.redirect("/billing");
        }
      }
    });
  },
  logout: (req, res) => {
    req.session.destroy();
    res.redirect("/auth/login");
  },
};
