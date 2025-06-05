const { DataTypes } = require("sequelize");

module.exports = function (sequelize) {
    const Anuncio = sequelize.define('Anuncio', {
        tipo: {
            type: DataTypes.ENUM('compra', 'venta'),
            allowNull: false
        },
        precioUnitario: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0.01
            }
        },
        cantidadDisponible: {
            type: DataTypes.FLOAT,
            allowNull: false,
            validate: {
                min: 0.01
            }
        },
        descripcionPago: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        imagenPago: {
            type: DataTypes.STRING, 
            allowNull: true
        }
    });

    return Anuncio;
};
