module.exports = {
  getAll: (db, callback) => {
    db.query("SELECT * FROM booking ORDER BY booking.status ASC", callback);
  },
  getById: (db, id, callback) => {
    db.query("SELECT * FROM booking WHERE id = " + id, callback);
  },
  getByTanggal: (db, tgl, callback) => {
    db.query(`SELECT * FROM booking WHERE tanggal = ${tgl} `, callback);
  },
  getBetweenTanggal: (db, tgl1, tgl2, callback) => {
    db.query(
      `SELECT * FROM booking WHERE tanggal BETWEEN '${tgl1}' AND '${tgl2}' AND status = 'Selesai' `,
      callback
    );
  },
  getByKapster: (db, kapster, tanggal, callback) => {
    db.query(
      `SELECT * FROM booking WHERE id_kapster = ${kapster} AND tanggal = ${tanggal} AND status != 'Batal'`,
      callback
    );
  },
  getByUser: (db, idUser, callback) => {
    db.query(
      `SELECT * FROM booking WHERE id_user = ${idUser} AND status = 'Booking'`,
      callback
    );
  },
  getByUserNonAktif: (db, idUser, callback) => {
    db.query(
      `SELECT * FROM booking WHERE id_user = ${idUser} AND status = 'Selesai' OR status = 'Batal'`,
      callback
    );
  },
  store: (db, data, callback) => {
    db.query("INSERT INTO booking SET ? ", data, callback);
  },
  update: (db, id, data, callback) => {
    db.query("UPDATE booking SET ? WHERE id = " + id, data, callback);
  },
  delete: (db, id, callback) => {
    db.query("DELETE FROM booking WHERE id =" + id, callback);
  },
};
