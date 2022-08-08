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
  cekLogin: async (req, res) => {
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
          const record_login = await cekDate();
          console.log(record_login);
          res.send(record_login);
        }
      );
    } else {
      let data = await cekDate();
      let record_login = data.record_login + 1;
      console.log(record_login);
      log.update(req.db, 1, { record_login }, async (err, result) => {
        if (err) {
          console.log(err);
          res.end();
        }
        const record_login = await cekDate();
        res.send(record_login);
      });
    }
  },
};
