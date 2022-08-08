const Booking = require("../models/booking");
const Transaksi = require("../models/transaksi");
const fs = require("fs");
const ejs = require("ejs");
const path = require("path");
let pdf = require("html-pdf");

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
    Transaksi.getBetweenTanggal(
      req.db,
      fnTanggal(),
      fnTanggal(),
      (err, transaksi) => {
        if (err) {
          console.log(err);
          res.end();
        }

        const datas = transaksi.map((data) => {
          function tanggalToString() {
            const yyyy = data.tanggal.getFullYear();
            let mm = data.tanggal.getMonth() + 1; // Months start at 0!
            let dd = data.tanggal.getDate();

            if (dd < 10) dd = "0" + dd;
            if (mm < 10) mm = "0" + mm;

            const tgl = `${dd}-${mm}-${yyyy}`;
            return tgl;
          }
          const harga = data.harga.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          });
          return {
            pelanggan: data.pelanggan,
            layanan: data.layanan,
            kapster: data.kapster,
            harga: harga,
            tanggal: tanggalToString(),
          };
        });
        res.render("transaksi/index", {
          page_name: "transaksi",
          role: req.session.role,
          datas: datas,
          tanggal1: fnTanggal(),
          tanggal2: fnTanggal(),
        });
      }
    );
  },
  store: (req, res) => {
    const { id_booking, pelanggan, kapster, layanan, harga } = req.body;
    const idBooking = id_booking;
    const FormData = {
      pelanggan,
      kapster,
      layanan,
      harga,
      tanggal: fnTanggal(),
    };
    Transaksi.store(req.db, FormData, (err, result) => {
      if (err) {
        console.log(err);
        res.end();
      }
      Booking.update(
        req.db,
        idBooking,
        { status: "Selesai" },
        (err, result) => {
          if (err) {
            console.log(err);
            res.end();
          }
          req.flash("success", "Layanan Telah diselesaikan");
          res.redirect("/billing");
        }
      );
    });
  },

  cariTransaksi: (req, res) => {
    const { tanggal1, tanggal2 } = req.body;

    Transaksi.getBetweenTanggal(
      req.db,
      tanggal1,
      tanggal2,
      (err, transaksi) => {
        if (err) {
          console.log(err);
          res.end();
        }

        const datas = transaksi.map((data) => {
          function tanggalToString() {
            const yyyy = data.tanggal.getFullYear();
            let mm = data.tanggal.getMonth() + 1; // Months start at 0!
            let dd = data.tanggal.getDate();

            if (dd < 10) dd = "0" + dd;
            if (mm < 10) mm = "0" + mm;

            const tgl = `${dd}-${mm}-${yyyy}`;
            return tgl;
          }
          const harga = data.harga.toLocaleString("id-ID", {
            style: "currency",
            currency: "IDR",
          });
          return {
            pelanggan: data.pelanggan,
            layanan: data.layanan,
            kapster: data.kapster,
            harga: harga,
            tanggal: tanggalToString(),
          };
        });
        res.render("transaksi/index", {
          page_name: "transaksi",
          role: req.session.role,
          datas: datas,
          tanggal1: tanggal1,
          tanggal2: tanggal2,
        });
      }
    );
  },
  download: async (req, res) => {
    const { tgl1, tgl2 } = req.params;

    function getData() {
      return new Promise((resolve, reject) => {
        Transaksi.getBetweenTanggal(req.db, tgl1, tgl2, (err, transaksi) => {
          if (err) {
            reject(console.log(err));
          }
          const datas = transaksi.map((data) => {
            function tanggalToString() {
              const yyyy = data.tanggal.getFullYear();
              let mm = data.tanggal.getMonth() + 1; // Months start at 0!
              let dd = data.tanggal.getDate();

              if (dd < 10) dd = "0" + dd;
              if (mm < 10) mm = "0" + mm;

              const tgl = `${dd}-${mm}-${yyyy}`;
              return tgl;
            }
            //int to string
            const harga = data.harga.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            });
            return {
              pelanggan: data.pelanggan,
              layanan: data.layanan,
              kapster: data.kapster,
              harga: data.harga,
              tanggal: tanggalToString(),
            };
          });
          resolve(datas);
        });
      });
    }

    const data = {
      data: await getData(),
      tanggal1: tgl1,
      tanggal2: tgl2,
      tanggalSekarang: fnTanggal(),
    };

    if (fs.existsSync(`report-transaksi.pdf`)) {
      fs.unlink(`report-transaksi.pdf`, (err) => {
        if (err) throw err;
        console.log("successfully deleted");
      });
    }
    //make pdf and download file
    ejs.renderFile(
      path.join(__dirname, "../views/transaksi", "report-transaksi.ejs"),
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
            .toFile("report-transaksi.pdf", function (err, data) {
              if (err) {
                res.send(err);
              } else {
                res.download("report-transaksi.pdf");
              }
            });
        }
      }
    );
  },
  downloadMonth: async (req, res) => {
    const { monthAndYear } = req.body;
    const arrMonthAndYear = monthAndYear.split("-");
    const year = arrMonthAndYear[0];
    const month = arrMonthAndYear[1];
    console.log(year, month);
    function getData() {
      return new Promise((resolve, reject) => {
        Transaksi.getMonth(req.db, month, (err, transaksi) => {
          if (err) {
            reject(console.log(err));
          }
          const datas = transaksi.map((data) => {
            function tanggalToString() {
              const yyyy = data.tanggal.getFullYear();
              let mm = data.tanggal.getMonth() + 1; // Months start at 0!
              let dd = data.tanggal.getDate();

              if (dd < 10) dd = "0" + dd;
              if (mm < 10) mm = "0" + mm;

              const tgl = `${dd}-${mm}-${yyyy}`;
              return tgl;
            }
            //int to string
            const harga = data.harga.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            });
            return {
              pelanggan: data.pelanggan,
              layanan: data.layanan,
              kapster: data.kapster,
              harga: data.harga,
              tanggal: tanggalToString(),
            };
          });
          resolve(datas);
        });
      });
    }

    const data = {
      data: await getData(),
      month: month,
      year: year,
      tanggalSekarang: fnTanggal(),
    };

    if (fs.existsSync(`report-transaksi-bulanan.pdf`)) {
      fs.unlink(`report-transaksi-bulanan.pdf`, (err) => {
        if (err) throw err;
        console.log("successfully deleted");
      });
    }
    //make pdf and download file
    ejs.renderFile(
      path.join(
        __dirname,
        "../views/transaksi",
        "report-transaksi-bulanan.ejs"
      ),
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
            .toFile("report-transaksi-bulanan.pdf", function (err, data) {
              if (err) {
                res.send(err);
              } else {
                res.download("report-transaksi-bulanan.pdf");
              }
            });
        }
      }
    );
  },
};
