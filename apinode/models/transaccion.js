const {DataTypes} = require("sequelize");

module.exports = (sequelize) =>{
    const Transaccion = sequelize.define("Transaccion",{
        tipo: {
            type: DataTypes.ENUM('compra', 'venta', 'transferencia'),
            allowNull: false
        },
        monto: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        estado: {
            type: DataTypes.ENUM('pendiente', 'completada', 'cancelada'),
            allowNull: false,
            defaultValue: 'pendiente'
        },
        descripcionPago:{
            type: DataTypes.STRING
        },
        imagenComprobante:{
            type: DataTypes.STRING
        }
    });
    return Transaccion;
};