module.exports = {
  getAll: (db, callback) => {
    db.query("SELECT * FROM user", callback);
  },
  getById: (db, id, callback) => {
    db.query("SELECT * FROM user WHERE id = " + id, callback);
  },
  getByEmail: (db, email, callback) => {
    db.query("SELECT * FROM user WHERE email = " + `'${email}'`, callback);
  },
  store: (db, data, callback) => {
    db.query("INSERT INTO user SET ? ", data, callback);
  },
  update: (db, id, data, callback) => {
    db.query("UPDATE user SET ? WHERE id = " + id, data, callback);
  },
  delete: (db, id, callback) => {
    db.query("DELETE FROM user WHERE id =" + id, callback);
  },
};
