const mysql = require("mysql")
const connection = mysql.createConnection({
    user: "root",
    password: "",
    host: "localhost",
    database: "lotis"
})

module.exports = connection
