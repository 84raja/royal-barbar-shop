const User = require("../models/userModel");
const bcrypt = require("bcrypt");
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
    User.getAll(req.db, (err, datas) => {
      if (err) {
        req.flash("error", `${err.message}`);
        res.render("users/index", { data: "", page_name: "users" });
      }
      const data = datas.map((user) => {
        return {
          id: user.id,
          nama: user.nama.toUpperCase(),
          email: user.email,
          no_telp: user.no_telp,
          alamat: user.alamat,
          role: user.role,
        };
      });

      res.render("users/index", {
        data: data,
        role: req.session.role,
        page_name: "users",
      });
    });
  },

  addForm: (req, res) => {
    User.getAll(req.db, (err, result) => {
      if (err) {
        throw err;
      } else {
        const roles = result.map((user) => {
          return (userRole = user.role);
        });

        getRole(roles);
      }
    });

    function getRole(roles) {
      const hasOwner = roles.includes("Owner");
      res.render("users/addUser", {
        page_name: "users",
        hasOwner,
        role: req.session.role,
      });
    }
  },

  store: (req, res) => {
    const { nama, email, no_telp, alamat, role, password } = req.body;
    const hashPassword = bcrypt.hashSync(password, 10);
    const formData = {
      nama,
      email,
      no_telp,
      alamat,
      role,
      password: hashPassword,
    };
    User.store(req.db, formData, (err, result) => {
      if (err) {
        req.flash("error", `${err.message}`);
        res.redirect("/users");
      }
      req.flash("success", "Data User Berhasil ditambahakan");
      res.redirect("/users");
    });
  },

  edit: async (req, res) => {
    const { id } = req.params;
    function getRole() {
      return new Promise((resolve, reject) => {
        User.getAll(req.db, (err, result) => {
          if (err) {
            reject(err);
          }
          const roles = result.map((user) => {
            return (userRole = user.role);
          });
          resolve(roles);
        });
      });
    }
    function getUser() {
      return new Promise((resolve, reject) => {
        User.getById(req.db, id, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result[0]);
        });
      });
    }

    const roles = await getRole();
    const user = await getUser();
    const hasOwner = await roles.includes("Owner");
    res.render("users/editUser", {
      page_name: "users",
      role: req.session.role,
      hasOwner: hasOwner,
      user: user,
    });
  },
  update: (req, res) => {
    const { id } = req.params;
    const { nama, email, no_telp, alamat, role } = req.body;
    const formData = {
      nama,
      email,
      no_telp,
      alamat,
      role,
    };
    User.update(req.db, id, formData, (err, result) => {
      if (err) {
        req.flash("error", `${err.message}`);
        res.redirect("/users");
        console.log(err.message);
      }
      req.flash("success", "Data berhasil diubah");
      res.redirect("/users");
    });
  },
  destroy: (req, res) => {
    const { id } = req.params;
    User.delete(req.db, id, (err, result) => {
      if (err) {
        req.flash("error", `${err.message}`);
        res.redirect("/users");
      }
      req.flash("success", "Data berhasil dihapus");
      res.redirect("/users");
    });
  },

  print: async (req, res) => {
    function getUser() {
      return new Promise((resolve, reject) => {
        User.getAll(req.db, (err, users) => {
          if (err) {
            reject(console.log(err));
          }
          const data = users.map((user) => {
            return {
              id: user.id,
              nama: user.nama.toUpperCase(),
              email: user.email,
              no_telp: user.no_telp,
              alamat: user.alamat,
              role: user.role,
            };
          });
          resolve(data);
        });
      });
    }

    if (fs.existsSync(`report-user.pdf`)) {
      fs.unlink(`report-user.pdf`, (err) => {
        if (err) throw err;
        console.log("successfully deleted");
      });
    }
    const data = {
      data: await getUser(),
      tanggalSekarang: fnTanggal(),
    };
    console.log(data);

    ejs.renderFile(
      path.join(__dirname, "../views/users", "report-user.ejs"),
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
            .toFile("report-user.pdf", function (err, data) {
              if (err) {
                res.send(err);
              } else {
                res.download("report-user.pdf");
              }
            });
        }
      }
    );
  },
};
