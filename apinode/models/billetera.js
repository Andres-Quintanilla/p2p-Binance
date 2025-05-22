const {DataTypes} = require('sequelize');

module.exports = (sequelize) =>{
    const Billetera = sequelize.define("Billetera",{
        saldo: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        }
    });
    return Billetera;
};