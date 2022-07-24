const User = require("../models/userModel");
const bcrypt = require("bcrypt");

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
};
