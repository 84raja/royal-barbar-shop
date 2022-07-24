module.exports = {
  getAll: (db, callback) => {
    db.query("SELECT * FROM model_rambut", callback);
  },
  getById: (db, id, callback) => {
    db.query("SELECT * FROM model_rambut WHERE id = " + id, callback);
  },
  store: (db, data, callback) => {
    db.query("INSERT INTO model_rambut SET ? ", data, callback);
  },
  update: (db, id, data, callback) => {
    db.query("UPDATE model_rambut SET ? WHERE id = " + id, data, callback);
  },
  delete: (db, id, callback) => {
    db.query("DELETE FROM model_rambut WHERE id =" + id, callback);
  },
};
