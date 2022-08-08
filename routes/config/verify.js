module.exports = {
  isLogin(req, res, next) {
    if (req.session.loggedin === true) {
      next();
      return;
    } else {
      req.flash("error", `Silahkan Login Terlebih Dahulu !`);
      req.session.destroy(function (err) {
        res.redirect("/auth/login");
      });
    }
  },
  isLogout(req, res, next) {
    if (req.session.loggedin !== true) {
      next();
      return;
    } else if (req.session.role == "Pelanggan") {
      res.redirect("/customer/home");
    } else {
      res.redirect("/billing");
    }
  },
};
