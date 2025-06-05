const db = require("../models");

const asegurarBilletera = async (usuarioId, monedaId) => {
    let billetera = await db.billetera.findOne({
        where: {
            usuarioId,
            monedaId
        }
    });

    if(!billetera){
        billetera = await db.billetera.create({
            usuarioId,
            monedaId,
            saldo: 0
        });
    }

    return billetera;
};

module.exports = {
    asegurarBilletera
};