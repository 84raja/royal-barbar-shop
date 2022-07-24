module.exports = {
  getAll: (db, callback) => {
    db.query("SELECT * FROM layanan", callback);
  },
  getById: (db, id, callback) => {
    db.query("SELECT * FROM layanan WHERE id = " + id, callback);
  },
  store: (db, data, callback) => {
    db.query("INSERT INTO layanan SET ? ", data, callback);
  },
  update: (db, id, data, callback) => {
    db.query("UPDATE layanan SET ? WHERE id = " + id, data, callback);
  },
  delete: (db, id, callback) => {
    db.query("DELETE FROM layanan WHERE id =" + id, callback);
  },
};
