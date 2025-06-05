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

exports.obtenerPorMoneda = async (req, res) => {
  const usuario = res.locals.usuario;
  const monedaId = req.params.monedaId;

  try {
    let billetera = await db.billetera.findOne({
      where: {
        usuarioId: usuario.id,
        monedaId,
      },
      include: [db.moneda],
    });

    if (!billetera) {
      billetera = await db.billetera.create({ usuarioId: usuario.id, monedaId, saldo: 0 });
      await billetera.reload({ include: [db.moneda] });
    }

    const transacciones = await db.transaccion.findAll({
      where: {
        [db.Sequelize.Op.or]: [
          { billeteraOrigenId: billetera.id },
          { billeteraDestinoId: billetera.id },
        ],
        estado: 'completada',
      },
      order: [['createdAt', 'DESC']],
    });

    const movimientos = transacciones.map(tx => {
      const esSalida = tx.billeteraOrigenId === billetera.id;
      const tipoMovimiento = esSalida ? 'ENVÍO' : 'RECIBIDO';
      const tipo = tx.tipo.toUpperCase();
      return {
        id: tx.id,
        tipo: `${tipoMovimiento} - ${tipo}`,
        monto: tx.monto,
        estado: tx.estado
      };
    });

    res.send({ ...billetera.toJSON(), movimientos });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al obtener la billetera" });
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
