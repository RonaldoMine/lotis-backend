const connection = require("../database/connection");
const {DataTypes} = require("sequelize");

const Role = connection.define('Role', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "roles",
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = Role;
