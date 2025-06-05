const { sequelize } = require("../config/db.config");

const usuario = require("./usuario")(sequelize);
const authToken = require("./authToken")(sequelize);
const moneda = require("./moneda")(sequelize);
const billetera = require("./billetera")(sequelize);
const transaccion = require("./transaccion")(sequelize);
const anuncio = require("./anuncio")(sequelize);


usuario.hasMany(authToken, {
    foreignKey: "usuarioId",
    as: "tokens"
});
authToken.belongsTo(usuario, {
    foreignKey: "usuarioId"
});

usuario.hasMany(billetera, {
    foreignKey: "usuarioId"
});
billetera.belongsTo(usuario, {
    foreignKey: "usuarioId"
});

moneda.hasMany(billetera, {
    foreignKey: "monedaId"
});
billetera.belongsTo(moneda, {
    foreignKey: "monedaId"
});

usuario.hasMany(anuncio, {
    foreignKey: "usuarioId"
});
anuncio.belongsTo(usuario, {
    foreignKey: "usuarioId"
});

anuncio.belongsTo(moneda, {
    foreignKey: "monedaId"
});


transaccion.belongsTo(usuario, {
    as: "usuarioComprador",
    foreignKey: "usuarioCompradorId"
});
transaccion.belongsTo(usuario, {
    as: "usuarioVendedor",
    foreignKey: "usuarioVendedorId"
});

transaccion.belongsTo(anuncio, {
    foreignKey: "anuncioId"
});

transaccion.belongsTo(billetera, {
    as: "billeteraOrigen",
    foreignKey: "billeteraOrigenId"
});
transaccion.belongsTo(billetera, {
    as: "billeteraDestino",
    foreignKey: "billeteraDestinoId"
});

billetera.hasMany(transaccion, {
    foreignKey: "billeteraOrigenId",
    as: "Transaccions"
});

module.exports = {
    usuario,
    authToken,
    moneda,
    billetera,
    transaccion,
    anuncio,
    sequelize,
    Sequelize: sequelize.Sequelize
};
