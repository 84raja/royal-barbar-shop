const Booking = require("../models/booking");
const User = require("../models/userModel");
const Kapster = require("../models/kapsterModel");
const Service = require("../models/serviceModel");
const Jadwal = require("../models/jadwalModel");
const log = require("../models/log");

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

  const tanggal = `"${yyyy}-${mm}-${dd}"`;
  return tanggal;
}
function fnTanggal2() {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const tanggal = `"${yyyy}-${mm}-${dd}"`;
  return tanggal;
}

module.exports = {
  index: async (req, res) => {
    Booking.getByTanggal(req.db, fnTanggal(), async (err, datas) => {
      if (err) {
        console.log(err);
        req.flash("error", "gagal mengambil data !");
        res.render("booking/index", { page_name: "booking", datas: [] });
      }

      // update log new booking to 0
      log.update(req.db, 1, { new_booking: 0 }, async (err, result) => {
        if (err) {
          console.log(err);
          res.end();
        }
      });

      // end update

      const dataBooking = datas.map(async (data) => {
        const id_user = data.id_user;

        function getUser() {
          return new Promise((resolve, reject) => {
            User.getById(req.db, id_user, (err, user) => {
              if (err) {
                reject(err);
              }
              resolve(user[0]);
            });
          });
        }
        function getKapster() {
          return new Promise((resolve, reject) => {
            Kapster.getById(req.db, data.id_kapster, (err, kapster) => {
              if (err) {
                reject(err);
              }
              resolve(kapster[0].nama);
            });
          });
        }
        function getService() {
          return new Promise((resolve, reject) => {
            Service.getById(req.db, data.id_layanan, (err, service) => {
              if (err) {
                reject(err);
              }
              resolve(service[0].nama_layanan);
            });
          });
        }
        function getJadwal() {
          return new Promise((resolve, reject) => {
            Jadwal.getById(req.db, data.id_jadwal, (err, jadwal) => {
              if (err) {
                reject(err);
              }
              resolve(jadwal[0].jam);
            });
          });
        }
        function tanggalToString() {
          const yyyy = data.tanggal.getFullYear();
          let mm = data.tanggal.getMonth() + 1; // Months start at 0!
          let dd = data.tanggal.getDate();

          if (dd < 10) dd = "0" + dd;
          if (mm < 10) mm = "0" + mm;

          const tgl = `${dd}-${mm}-${yyyy}`;
          return tgl;
        }

        const user = await getUser();
        const kapsterName = await getKapster();
        const serviceName = await getService();
        const jam = await getJadwal();
        return {
          id: data.id,
          no_telp: user.no_telp,
          nama: user.nama,
          kapster: kapsterName,
          layanan: serviceName,
          jam: jam,
          tanggal: tanggalToString(),
          status: data.status,
        };
      });
      const dataBookings = await Promise.all(dataBooking);
      const tanggalDisplay = fnTanggal().substring(1, 11);
      res.render("booking/index", {
        page_name: "booking",
        datas: dataBookings,
        tanggal: tanggalDisplay,
        title_page: "Hari Ini",
        role: req.session.role,
      });
    });
  },
  cariBooking: async (req, res) => {
    const { tgl } = req.body;

    const arrTgl = tgl.split("-");

    const tanggal = `"${arrTgl.join("-")}"`;

    Booking.getByTanggal(req.db, tanggal, async (err, datas) => {
      if (err) {
        console.log(err);
        req.flash("error", "gagal mengambil data !");
        res.render("booking/index", { page_name: "booking", datas: [] });
      }

      // update log new booking to 0
      log.update(req.db, 1, { new_booking: 0 }, async (err, result) => {
        if (err) {
          console.log(err);
          res.end();
        }
      });

      // end update

      const dataBooking = datas.map(async (data) => {
        const id_user = data.id_user;

        function getUser() {
          return new Promise((resolve, reject) => {
            User.getById(req.db, id_user, (err, user) => {
              if (err) {
                reject(err);
              }
              resolve(user[0].nama);
            });
          });
        }
        function getKapster() {
          return new Promise((resolve, reject) => {
            Kapster.getById(req.db, data.id_kapster, (err, kapster) => {
              if (err) {
                reject(err);
              }
              resolve(kapster[0].nama);
            });
          });
        }
        function getService() {
          return new Promise((resolve, reject) => {
            Service.getById(req.db, data.id_layanan, (err, service) => {
              if (err) {
                reject(err);
              }
              resolve(service[0].nama_layanan);
            });
          });
        }
        function getJadwal() {
          return new Promise((resolve, reject) => {
            Jadwal.getById(req.db, data.id_jadwal, (err, jadwal) => {
              if (err) {
                reject(err);
              }
              resolve(jadwal[0].jam);
            });
          });
        }
        function tanggalToString() {
          const yyyy = data.tanggal.getFullYear();
          let mm = data.tanggal.getMonth() + 1; // Months start at 0!
          let dd = data.tanggal.getDate();

          if (dd < 10) dd = "0" + dd;
          if (mm < 10) mm = "0" + mm;

          const tgl = `${dd}-${mm}-${yyyy}`;
          return tgl;
        }

        const userName = await getUser();
        const kapsterName = await getKapster();
        const serviceName = await getService();
        const jam = await getJadwal();
        return {
          id: data.id,
          nama: userName,
          kapster: kapsterName,
          layanan: serviceName,
          jam: jam,
          tanggal: tanggalToString(),
          status: data.status,
        };
      });
      const dataBookings = await Promise.all(dataBooking);
      const tanggalDisplay = `${arrTgl.join("-")}`;
      res.render("booking/index", {
        page_name: "booking",
        datas: dataBookings,
        tanggal: tanggalDisplay,
        title_page: "Tanggal",
        role: req.session.role,
      });
    });
  },
  add: async (req, res) => {
    function getUser() {
      return new Promise((resolve, reject) => {
        User.getAll(req.db, (err, users) => {
          if (err) {
            reject(err);
          }
          resolve(users);
        });
      });
    }
    function getKapster() {
      return new Promise((resolve, reject) => {
        Kapster.getAll(req.db, (err, kapsters) => {
          if (err) {
            reject(err);
          }
          resolve(kapsters);
        });
      });
    }
    function getService() {
      return new Promise((resolve, reject) => {
        Service.getAll(req.db, (err, services) => {
          if (err) {
            reject(err);
          }
          resolve(services);
        });
      });
    }

    res.render("booking/add", {
      page_name: "booking",
      users: await getUser(),
      kapsters: await getKapster(),
      services: await getService(),
      role: req.session.role,
    });
  },
  jadwalKapster: async (req, res) => {
    const { id_kapster, tgl } = req.params;

    const arrTgl = tgl.split("-");

    const tanggal = `"${arrTgl.join("-")}"`;

    async function getJadwalKapsterUse() {
      return new Promise((resolve, reject) => {
        Booking.getByKapster(req.db, id_kapster, tanggal, (err, bookings) => {
          if (err) {
            reject(err);
          }
          const jadwalKapsterUse = bookings.map((booking) => {
            return booking.id_jadwal;
          });
          resolve(jadwalKapsterUse);
        });
      });
    }
    async function getJadwal() {
      return new Promise((resolve, reject) => {
        Jadwal.getAll(req.db, (err, jadwals) => {
          if (err) {
            reject(err);
          }

          const arrJadwal = jadwals.map((jadwal) => {
            return {
              id_jadwal: jadwal.id,
              jam: jadwal.jam,
            };
          });
          resolve(arrJadwal);
        });
      });
    }
    const jadwalUse = await getJadwalKapsterUse();
    const jadwal = await getJadwal();
    const arrDataJadwal = [jadwal, jadwalUse];
    res.send(arrDataJadwal);
  },
  store: (req, res) => {
    const { id_user, id_kapster, id_layanan, id_jadwal, tanggal, pesan } =
      req.body;
    const FormData = {
      id_user,
      id_jadwal,
      id_kapster,
      id_layanan,
      tanggal,
      pesan,
    };
    Booking.store(req.db, FormData, (err, result) => {
      if (err) {
        console.err;
        res.redirect("/booking");
      }
      req.flash("success", "Berhasil Melakukan Booking");
      res.redirect("/booking");
    });
  },
  batal: (req, res) => {
    const { id } = req.params;
    Booking.update(req.db, id, { status: "Batal" }, (err, result) => {
      if (err) {
        console.log(err);
        res.redirect("/booking");
      }
      req.flash("error", "Booking Di Batalkan");
      res.redirect("/booking");
    });
  },
  selesai: (req, res) => {
    const { id } = req.params;
    Booking.update(req.db, id, { status: "Selesai" }, (err, result) => {
      if (err) {
        console.log(err);
        res.redirect("/booking");
      }
      req.flash("Success", "Booking Telah diselesaikan");
      res.redirect("/booking");
    });
  },

  reportPdf: async (req, res) => {
    const { tanggal1, tanggal2 } = req.body;
    async function getData() {
      return new Promise((resolve, reject) => {
        Booking.getBetweenTanggal(
          req.db,
          tanggal1,
          tanggal2,
          async (err, datas) => {
            if (err) {
              reject(console.log(err));
            }

            const dataBooking = datas.map(async (data) => {
              const id_user = data.id_user;

              function getUser() {
                return new Promise((resolve, reject) => {
                  User.getById(req.db, id_user, (err, user) => {
                    if (err) {
                      reject(err);
                    }
                    resolve(user[0].nama);
                  });
                });
              }
              function getKapster() {
                return new Promise((resolve, reject) => {
                  Kapster.getById(req.db, data.id_kapster, (err, kapster) => {
                    if (err) {
                      reject(err);
                    }
                    resolve(kapster[0].nama);
                  });
                });
              }
              function getService() {
                return new Promise((resolve, reject) => {
                  Service.getById(req.db, data.id_layanan, (err, service) => {
                    if (err) {
                      reject(err);
                    }
                    resolve(service[0].nama_layanan);
                  });
                });
              }
              function getJadwal() {
                return new Promise((resolve, reject) => {
                  Jadwal.getById(req.db, data.id_jadwal, (err, jadwal) => {
                    if (err) {
                      reject(err);
                    }
                    resolve(jadwal[0].jam);
                  });
                });
              }
              function tanggalToString() {
                const yyyy = data.tanggal.getFullYear();
                let mm = data.tanggal.getMonth() + 1; // Months start at 0!
                let dd = data.tanggal.getDate();

                if (dd < 10) dd = "0" + dd;
                if (mm < 10) mm = "0" + mm;

                const tgl = `${dd}-${mm}-${yyyy}`;
                return tgl;
              }

              const userName = await getUser();
              const kapsterName = await getKapster();
              const serviceName = await getService();
              const jam = await getJadwal();
              return {
                id: data.id,
                nama: userName,
                kapster: kapsterName,
                layanan: serviceName,
                jam: jam,
                tanggal: tanggalToString(),
                status: data.status,
              };
            });
            const dataBookings = await Promise.all(dataBooking);
            resolve(dataBookings);
          }
        );
      });
    }

    if (fs.existsSync(`report.pdf`)) {
      fs.unlink(`report.pdf`, (err) => {
        if (err) throw err;
        console.log("successfully deleted");
      });
    }
    const data = {
      dataBooking: await getData(),
      tanggal1: tanggal1,
      tanggal2: tanggal2,
      tanggalSekarang: fnTanggal().substring(1, 11),
    };
    ejs.renderFile(
      path.join(__dirname, "../views/booking", "report.ejs"),
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
          pdf.create(data, options).toFile("report.pdf", function (err, data) {
            if (err) {
              res.send(err);
            } else {
              res.download("report.pdf");
            }
          });
        }
      }
    );
  },
};
