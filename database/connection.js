const {Sequelize} = require("sequelize");

const connection = new Sequelize("lotis", "root", "", {
    host: "localhost",
    dialect: "mysql"
})

module.exports = connection
