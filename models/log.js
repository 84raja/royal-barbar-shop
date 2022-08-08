module.exports = {
  getById: (db, id, callback) => {
    db.query("SELECT * FROM log where id =" + id, callback);
  },

  update: (db, id, data, callback) => {
    db.query("UPDATE log SET ? WHERE id = 1 ", data, callback);
  },
};
