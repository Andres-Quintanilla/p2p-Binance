const db = require("../models/");

exports.crearMoneda = async (req, res) => {
  const { nombre, valorEnSus } = req.body;

  if (!nombre || !valorEnSus) {
    return res.status(400).send({ message: "Nombre y valorEnSus son requeridos" });
  }

  try {
    const existente = await db.moneda.findOne({ where: { nombre } });
    if (existente) {
      return res.status(400).send({ message: "La moneda ya existe" });
    }

    const nueva = await db.moneda.create({ nombre, valorEnSus });
    res.status(201).send(nueva);
  } catch (error) {
    console.error("Error al crear la moneda:", error);
    res.status(500).send({ message: "Error al crear la moneda" });
  }
};

exports.listarMonedas = async (req, res) => {
    try {
        const monedas = await db.moneda.findAll();
        res.status(200).json(monedas);
    } catch (error) {
        console.error("Error al obtener monedas:", error);
        res.status(500).send({ message: "Error al obtener las monedas" });
    }
};
