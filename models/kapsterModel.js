module.exports = {
  getAll: (db, callback) => {
    db.query("SELECT * FROM kapster", callback);
  },
  getById: (db, id, callback) => {
    db.query("SELECT * FROM kapster where id = " + id, callback);
  },
  store: (db, data, callback) => {
    db.query("INSERT INTO kapster SET ?", data, callback);
  },
  update: (db, id, data, callback) => {
    db.query("UPDATE kapster SET ? WHERE id = " + id, data, callback);
  },
  delete: (db, id, callback) => {
    db.query("DELETE FROM kapster WHERE id =" + id, callback);
  },
};
