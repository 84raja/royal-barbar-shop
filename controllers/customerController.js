const Booking = require("../models/booking");
const User = require("../models/userModel");
const Kapster = require("../models/kapsterModel");
const Service = require("../models/serviceModel");
const Jadwal = require("../models/jadwalModel");
const Model = require("../models/modelRambutModel");
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
  home: async (req, res) => {
    async function getBookingAktif() {
      return new Promise((resolve, reject) => {
        Booking.getByUser(req.db, req.session.idUser, async (err, datas) => {
          if (err) {
            reject(console.log(err));
          }
          const dataBookingAktif = datas.map(async (data) => {
            const id_user = await data.id_user;
            function getUser() {
              return new Promise((resolve, reject) => {
                User.getById(req.db, id_user, (err, user) => {
                  if (err) {
                    reject(console.log(err));
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
                  resolve(service[0]);
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
            const service = await getService();
            const jam = await getJadwal();
            return {
              id: data.id,
              nama: userName,
              kapster: kapsterName,
              layanan: service["nama_layanan"],
              harga: service["harga"],
              jam: jam,
              tanggal: tanggalToString(),
              status: data.status,
            };
          });

          const dataBookingAktifs = await Promise.all(dataBookingAktif);
          resolve(dataBookingAktifs);
        });
      });
    }
    async function getRiwyatBooking() {
      return new Promise((resolve, reject) => {
        Booking.getByUserNonAktif(
          req.db,
          req.session.idUser,
          async (err, datas) => {
            if (err) {
              reject(console.log(err));
            }
            const dataBooking = datas.map(async (data) => {
              const id_user = await data.id_user;
              function getUser() {
                return new Promise((resolve, reject) => {
                  User.getById(req.db, id_user, (err, user) => {
                    if (err) {
                      reject(console.log(err));
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
                    resolve(service[0]);
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
              const service = await getService();
              const jam = await getJadwal();
              return {
                id: data.id,
                nama: userName,
                kapster: kapsterName,
                layanan: service["nama_layanan"],
                harga: service["harga"],
                jam: jam,
                tanggal: tanggalToString(),
                status: data.status,
              };
            });

            const dataRiwayatBooking = await Promise.all(dataBooking);
            resolve(dataRiwayatBooking);
          }
        );
      });
    }
    const dataBookingAktif = await getBookingAktif();
    const dataRiwayatBooking = await getRiwyatBooking();
    console.log(dataRiwayatBooking);
    res.render("customer/home", {
      page_name: "home",
      datas: dataBookingAktif,
      dataRiwayatBooking: dataRiwayatBooking,
      title_page: "Hari Ini",
      role: req.session.role,
    });
  },
  indexBooking: async (req, res) => {
    const id_user = req.session.idUser;
    function getUser() {
      return new Promise((resolve, reject) => {
        User.getById(req.db, id_user, (err, users) => {
          if (err) {
            reject(err);
          }
          resolve(users[0]);
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

    res.render("customer/booking", {
      page_name: "booking",
      user: await getUser(),
      kapsters: await getKapster(),
      services: await getService(),
      role: req.session.role,
    });
  },
  storeBooking: async (req, res) => {
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

    Booking.store(req.db, FormData, async (err, result) => {
      if (err) {
        console.log(err);
        res.redirect("/customer/home");
      }

      //hitung log boking baru
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
        let new_booking = data.new_booking + 1;
        console.log(new_booking);
        log.update(req.db, 1, { new_booking }, async (err, result) => {
          if (err) {
            console.log(err);
            res.end();
          }
        });
      }
      // end hitung

      req.flash("success", "Berhasil Melakukan Booking");
      res.redirect("/customer/home");
    });
  },
  indexModelRambut: (req, res) => {
    Model.getAll(req.db, (err, models) => {
      if (err) {
        // res.send(err);
        req.flash("error", `Gagal Mengambil data ! error : ${err.code}`);
        res.render("customer/model-rambut", {
          page_name: "customerModel",
          models: [],
        });
      }
      res.render("customer/model-rambut", {
        page_name: "customerModel",
        models: models,
        role: req.session.role,
      });
    });
  },
  cancel: (req, res) => {
    const { id } = req.params;
    Booking.update(req.db, id, { status: "Batal" }, (err, result) => {
      if (err) {
        console.log(err);
        res.redirect("/booking");
      }
      req.flash("error", "Booking Di Batalkan");
      res.redirect("/customer/home");
    });
  },
};
