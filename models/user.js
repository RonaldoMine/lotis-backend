const {DataTypes} = require("sequelize");
const connection = require("../database/connection");
const Role = require("./role");

const User = connection.define('User', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    first_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    last_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    commercial_register_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    cni_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: "users",
    createdAt: "created_at",
    updatedAt: "updated_at"
});
User.belongsTo(Role, {
    foreignKey: {
        name: "role_id",
        defaultValue: 1
    },
    onDelete: "cascade",
    onUpdate: "cascade"
})

module.exports = User;
