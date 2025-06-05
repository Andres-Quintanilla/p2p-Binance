const {DataTypes} = require("sequelize");

module.exports = (sequelize) => {
    const Moneda = sequelize.define("Moneda",{
        nombre:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        valorEnSus:{
            type: DataTypes.FLOAT,
            allowNull: false,
            validate:{
                min: 0.0001
            }
        }
    });
    return Moneda;
};