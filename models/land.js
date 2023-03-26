const {DataTypes} = require("sequelize");
const connection = require("../database/connection");
const User = require("./user");

const Land = connection.define('Land', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    town: {
        type: DataTypes.STRING,
        allowNull: false
    },
    district: {
        type: DataTypes.STRING,
        allowNull: false
    },
    localisation: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reference_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    surface: {
        type: DataTypes.STRING,
        allowNull: false
    },
    map_coordinates: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: "lands",
    createdAt: "created_at",
    updatedAt: "updated_at"
});
Land.belongsTo(User, {
    foreignKey: "user_id",
    onDelete: "cascade",
    onUpdate: "cascade"
})

module.exports = Land;
