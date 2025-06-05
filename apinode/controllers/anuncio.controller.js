const db = require("../models");
const { Op, where } = require("sequelize");

exports.crear = async (req, res) => {
    const usuario = res.locals.usuario;
    const { tipo, precioUnitario, cantidadDisponible, descripcionPago, imagenPago, monedaId } = req.body;

    if (!tipo || !precioUnitario || !cantidadDisponible || !monedaId) {
        return res.status(400).send({ message: "Faltan datos obligatorios" });
    }

    try {
        if (tipo === 'venta') {
            const billetera = await db.billetera.findOne({
                where: {
                    usuarioId: usuario.id,
                    monedaId
                }
            });

            if (!billetera || billetera.saldo < cantidadDisponible) {
                return res.status(400).send({
                    message: "Saldo insuficiente para crear el anuncio de venta"
                });
            }

            billetera.saldo -= cantidadDisponible;
            await billetera.save();
        }

        const anuncio = await db.anuncio.create({
            tipo,
            precioUnitario,
            cantidadDisponible,
            descripcionPago,
            imagenPago,
            usuarioId: usuario.id,
            monedaId
        });

        res.status(201).send(anuncio);

    } catch (error) {
        console.error("Error al crear anuncio:", error);
        res.status(500).send({ message: "Error al crear el anuncio" });
    }
};


exports.listar = async (req, res) => {
    const tipo = req.query.tipo;
    const usuario = res.locals.usuario;

    try{
        const where = {
            ...(tipo && { tipo }),
            usuarioId: { [Op.ne]: usuario.id }
        };

        const anuncios = await db.anuncio.findAll({
            where,
            include: [db.usuario, db.moneda]
        });

        res.send(anuncios);

    }catch (error){
        res.status(500).send(
            {message: "Error al obtener los anuncios"}
        );
    }
};

exports.detalle = async (req, res) => {
    const id = req.params.id;

    try {
        const anuncio = await db.anuncio.findOne({
            where: { 
                id 
            },
            include: [db.usuario, db.moneda]
        });

        if(!anuncio){
            return res.status(404).send(
                {message: "Anuncio no encontrado"}
            );
        }

        res.send(anuncio);
    }catch (error){
        res.status(500).send(
            {message: "Error al obtener el anuncio"}
        );
    }
};

exports.misAnuncios = async (req, res) => {
    const usuario = res.locals.usuario;

    try {
        const anuncios = await db.anuncio.findAll({
            where: {
                usuarioId: usuario.id
            },
            include: [db.moneda]
        });
        
        res.send(anuncios);
    }catch (error){
        console.error("Error al obtener tus anuncios: ",error);
        res.status(500).send({message: "Error al obtener tus anuncios"})
    }
};