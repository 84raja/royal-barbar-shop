const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bc-ex-royal-barbershop",
});

connection.connect((err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("Koneksi ke database berhasil");
  }
});

module.exports = connection;
