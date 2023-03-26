const {DataTypes} = require("sequelize");
const connection = require("../database/connection");
const Land = require("./land");
const User = require("./user");

const File = connection.define('File', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    path: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "files",
    createdAt: "created_at",
    updatedAt: "updated_at"
});
File.belongsTo(Land, {
    foreignKey: "land_id",
    onDelete: "cascade",
    onUpdate: "cascade"
})
File.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "cascade",
    onUpdate: "cascade"
})

module.exports = File;
