const mysql = require("mysql2");

--// Runs mysql connections, automatically conecting with your mysql password.
const meatcogs = mysql.createConnection({
  host: "localhost",
  user: "root",
  // Your password
  password: "",
  database: "meatcogs",
});

meatcogs.connect(function (err) {
  if (err) throw err;
});

module.exports = meatcogs;
