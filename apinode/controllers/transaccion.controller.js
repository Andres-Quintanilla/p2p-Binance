const db = require("../models");
const { asegurarBilletera } = require("../utils/billetera.utils");

exports.transferir = async (req, res) => {
  const usuario = res.locals.usuario;
  const { billeteraOrigenId, monedaDestinoId, monto, billeteraDestinoUsuarioId } = req.body;

  try {
    const billeteraOrigen = await db.billetera.findOne({
      where: { id: billeteraOrigenId, usuarioId: usuario.id },
      include: [db.moneda],
    });

    if (!billeteraOrigen || billeteraOrigen.saldo < monto) {
      return res.status(400).send({ message: "Saldo insuficiente o billetera inválida" });
    }

    const billeteraDestino = await asegurarBilletera(billeteraDestinoUsuarioId, monedaDestinoId);
    await billeteraDestino.reload({ include: [db.moneda] });

    const montoEnSus = monto * billeteraOrigen.moneda.valorEnSus;
    const montoConvertido = montoEnSus / billeteraDestino.moneda.valorEnSus;

    billeteraOrigen.saldo -= monto;
    billeteraDestino.saldo += montoConvertido;

    await billeteraOrigen.save();
    await billeteraDestino.save();

    await db.transaccion.create({
      tipo: "transferencia",
      monto,
      estado: "completada",
      usuarioCompradorId: usuario.id,
      usuarioVendedorId: billeteraDestinoUsuarioId,
      billeteraOrigenId: billeteraOrigen.id,
      billeteraDestinoId: billeteraDestino.id,
    });

    res.send({ message: "Transferencia realizada correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al procesar la transferencia" });
  }
};

exports.comprar = async (req, res) => {
  const usuario = res.locals.usuario;
  const anuncioId = req.params.anuncioId;

  try {
    const anuncio = await db.anuncio.findByPk(anuncioId);
    if (!anuncio || anuncio.tipo !== "venta") {
      return res.status(400).send({ message: "El anuncio no es válido para compra" });
    }

    const transaccion = await db.transaccion.create({
      tipo: "compra",
      monto: anuncio.cantidadDisponible,
      estado: "pendiente",
      anuncioId: anuncio.id,
      billeteraOrigenId: null,
      billeteraDestinoId: null,
      usuarioCompradorId: usuario.id,
      usuarioVendedorId: anuncio.usuarioId,
    });

    res.status(201).send(transaccion);
  } catch (error) {
    res.status(500).send({ message: "Error al iniciar la compra" });
  }
};

exports.vender = async (req, res) => {
  const usuario = res.locals.usuario;
  const anuncioId = req.params.anuncioId;

  try {
    const anuncio = await db.anuncio.findByPk(anuncioId);
    if (!anuncio || anuncio.tipo !== "compra") {
      return res.status(400).send({ message: "El anuncio no es válido para venta" });
    }

    const transaccion = await db.transaccion.create({
      tipo: "venta",
      monto: anuncio.cantidadDisponible,
      estado: "pendiente",
      anuncioId: anuncio.id,
      billeteraOrigenId: null,
      billeteraDestinoId: null,
      usuarioVendedorId: usuario.id,
      usuarioCompradorId: anuncio.usuarioId,
    });

    res.status(201).send(transaccion);
  } catch (error) {
    res.status(500).send({ message: "Error al iniciar la venta" });
  }
};

exports.subirComprobante = async (req, res) => {
  const usuario = res.locals.usuario;
  const transaccionId = req.params.id;
  const descripcionPago = req.body?.descripcionPago || null;
  const imagen = req.files?.comprobante;

  try {
    const transaccion = await db.transaccion.findByPk(transaccionId);
    if (!transaccion || transaccion.usuarioCompradorId !== usuario.id) {
      return res.status(403).send({ message: "No autorizado" });
    }

    if (imagen) {
      const nombreArchivo = `uploads/${Date.now()}-${imagen.name}`;
      await imagen.mv(nombreArchivo);
      transaccion.imagenComprobante = nombreArchivo;
    }

    transaccion.descripcionPago = descripcionPago;
    await transaccion.save();

    res.send({ message: "Comprobante subido correctamente" });
  } catch (error) {
    res.status(500).send({ message: "Error al subir el comprobante" });
  }
};

exports.obtenerPendientesVendedor = async (req, res) => {
  const usuario = res.locals.usuario;
  try {
    const pendientes = await db.transaccion.findAll({
      where: {
        usuarioVendedorId: usuario.id,
        estado: "pendiente",
      },
      include: [
        { model: db.usuario, as: "usuarioComprador", attributes: ["email"] },
        {
          model: db.anuncio,
          include: [db.moneda],
        },
      ],
    });

    res.send(pendientes);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al obtener transacciones pendientes" });
  }
};

exports.obtenerPendientesComprador = async (req, res) => {
  const usuario = res.locals.usuario;
  try {
    const pendientes = await db.transaccion.findAll({
      where: {
        usuarioCompradorId: usuario.id,
      },
      include: [
        { model: db.usuario, as: "usuarioVendedor", attributes: ["email"] },
        {
          model: db.anuncio,
          include: [db.moneda],
        },
      ],
      order: [['createdAt', 'DESC']]
    });

    res.send(pendientes);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al obtener transacciones del comprador" });
  }
};


exports.confirmarTransaccion = async (req, res) => {
  const usuario = res.locals.usuario;
  const transaccionId = req.params.id;
  const billeteraDestinoId = req.body?.billeteraDestinoId;

  try {
    const transaccion = await db.transaccion.findByPk(transaccionId, {
      include: [
        {
          model: db.anuncio,
          include: [db.moneda],
        },
      ],
    });

    if (
      !transaccion ||
      transaccion.usuarioVendedorId !== usuario.id ||
      transaccion.estado !== "pendiente"
    ) {
      return res.status(400).send({ message: "Transacción inválida" });
    }

    const monedaId = transaccion.Anuncio?.monedaId;
    const billeteraOrigen = await db.billetera.findOne({
      where: { usuarioId: usuario.id, monedaId },
    });

    const billeteraDestino = await db.billetera.findByPk(billeteraDestinoId);

    if (!billeteraOrigen || !billeteraDestino || billeteraOrigen.saldo < transaccion.monto) {
      return res.status(400).send({ message: "Fondos insuficientes o billeteras inválidas" });
    }

    billeteraOrigen.saldo -= transaccion.monto;
    billeteraDestino.saldo += transaccion.monto;
    await billeteraOrigen.save();
    await billeteraDestino.save();

    transaccion.estado = "completada";
    transaccion.billeteraOrigenId = billeteraOrigen.id;
    transaccion.billeteraDestinoId = billeteraDestino.id;
    await transaccion.save();

    await db.transaccion.create({
        tipo: "compra",
        monto: transaccion.monto,
        estado: "completada",
        descripcionPago: transaccion.descripcionPago,
        imagenComprobante: transaccion.imagenComprobante,
        usuarioCompradorId: transaccion.usuarioCompradorId,
        usuarioVendedorId: transaccion.usuarioVendedorId,
        anuncioId: transaccion.anuncioId,
        billeteraOrigenId: billeteraOrigen.id,
        billeteraDestinoId: billeteraDestino.id
    });


    res.send({ message: "Transacción confirmada y fondos liberados" });
  } catch (error) {
    console.error("Error al confirmar transacción:", error);
    res.status(500).send({ message: "Error al confirmar la transacción" });
  }
};


exports.cancelarTransaccion = async (req, res) => {
  const usuario = res.locals.usuario;
  const transaccionId = req.params.id;

  try {
    const transaccion = await db.transaccion.findByPk(transaccionId);

    if (!transaccion || transaccion.usuarioVendedorId !== usuario.id || transaccion.estado !== "pendiente") {
      return res.status(400).send({ message: "Transacción inválida o ya procesada" });
    }

    transaccion.estado = "cancelada";
    await transaccion.save();

    res.send({ message: "Transacción cancelada correctamente" });
  } catch (error) {
    console.error("Error al cancelar transacción:", error);
    res.status(500).send({ message: "Error interno del servidor" });
  }
};

exports.finalizar = async (req, res) => {
  const usuario = res.locals.usuario;
  const transaccionId = req.params.id;

  try {
    const transaccion = await db.transaccion.findByPk(transaccionId);

    if (!transaccion || transaccion.usuarioCompradorId !== usuario.id || transaccion.estado !== "completada") {
      return res.status(400).send({ message: "Transacción inválida o aún no confirmada por el vendedor" });
    }

    transaccion.estado = "finalizada";
    await transaccion.save();

    res.send({ message: "Transacción finalizada correctamente" });
  } catch (error) {
    console.error("Error al finalizar transacción:", error);
    res.status(500).send({ message: "Error al finalizar la transacción" });
  }
};
