const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports = {
  register: (req, res) => {
    res.render("auth/register", { name_page: "register" });
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
  login: (req, res) => {
    res.render("auth/login", { name_page: "register" });
  },
  postLogin: (req, res) => {
    const { email, password } = req.body;

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
