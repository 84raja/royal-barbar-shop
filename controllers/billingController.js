const Booking = require("../models/booking");
const User = require("../models/userModel");
const Kapster = require("../models/kapsterModel");
const Service = require("../models/serviceModel");
const Jadwal = require("../models/jadwalModel");
const Transaksi = require("../models/transaksi");

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

module.exports = {
  index: async (req, res) => {
    async function getBookingAktif() {
      return new Promise((resolve, reject) => {
        Booking.getByTanggal(req.db, fnTanggal(), async (err, datas) => {
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

    const dataBookingAktif = await getBookingAktif();
    res.render("billing/index", {
      page_name: "billing",
      datas: dataBookingAktif,
      title_page: "Hari Ini",
      role: req.session.role,
      tanggal: fnTanggal().substring(1, 11),
    });
  },
  cancel: (req, res) => {
    const { id } = req.params;
    Booking.update(req.db, id, { status: "Batal" }, (err, result) => {
      if (err) {
        console.log(err);
        res.redirect("/billing");
      }
      req.flash("error", "Booking Di Batalkan");
      res.redirect("/billing");
    });
  },
};
