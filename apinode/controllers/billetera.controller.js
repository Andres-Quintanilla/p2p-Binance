const db = require("../models");

exports.listar = async (req, res) => {
  try {
    const usuario = res.locals.usuario;

    const billeteras = await db.billetera.findAll({
      where: { usuarioId: usuario.id },
      include: [{ model: db.moneda }]
    });

    res.send(billeteras);
  } catch (error) {
    res.status(500).send({ message: "Error al obtener las billeteras" });
  }
};

exports.detalle = async (req, res) => {
  const monedaId = req.params.id;
  const usuario = res.locals.usuario;

  try {
    let billetera = await db.billetera.findOne({
      where: {
        monedaId,
        usuarioId: usuario.id
      },
      include: [
        { model: db.moneda },
        {
          model: db.transaccion,
          as: "Transaccions", 
          required: false
        }
      ]
    });

    // Si no existe, crearla
    if (!billetera) {
      billetera = await db.billetera.create({
        usuarioId: usuario.id,
        monedaId,
        saldo: 0
      });

      // Recargar con los includes
      billetera = await db.billetera.findOne({
        where: { id: billetera.id },
        include: [
          { model: db.moneda },
          {
            model: db.transaccion,
            as: "Transaccions",
            required: false
          }
        ]
      });
    }

    res.send(billetera);
  } catch (error) {
    console.error("Error en detalle billetera:", error);
    res.status(500).send({ message: "Error al obtener el detalle de la billetera" });
  }
};

exports.actualizarSaldo = async (req, res) => {
  try {
    const billetera = await db.billetera.findByPk(req.params.id);
    if (!billetera) return res.status(404).send({ message: "Billetera no encontrada" });

    billetera.saldo = req.body.saldo;
    await billetera.save();

    res.send(billetera);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al actualizar el saldo" });
  }
};
