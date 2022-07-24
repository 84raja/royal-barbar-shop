module.exports = {
  getBetweenTanggal: (db, tgl1, tgl2, callback) => {
    db.query(
      `SELECT * FROM transaksi WHERE tanggal BETWEEN '${tgl1}' AND '${tgl2}'`,
      callback
    );
  },
  store: (db, data, callback) => {
    db.query(`INSERT INTO transaksi SET ?`, data, callback);
  },
};
