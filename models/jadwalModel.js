module.exports = {
  getAll: (db, callback) => {
    db.query(`SELECT * FROM jadwal ORDER BY jadwal.jam ASC`, callback);
  },
  getById: (db, id, callback) => {
    db.query("SELECT * FROM jadwal where id =" + id, callback);
  },
  getByField: (db, field, value, callback) => {
    db.query(`SELECT * FROM jadwal where ${field} = ${value}`, callback);
  },
  store: (db, data, callback) => {
    db.query("INSERT INTO jadwal SET ? ", data, callback);
  },
  delete: (db, id, callback) => {
    db.query("DELETE FROM jadwal WHERE id= " + id, callback);
  },
};
