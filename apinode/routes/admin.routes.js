router.put("/billetera/:id/saldo", async (req, res) => {
  const { id } = req.params;
  const { saldo } = req.body;

  try {
    const billetera = await db.billetera.findByPk(id);
    if (!billetera) return res.status(404).send({ message: "Billetera no encontrada" });

    billetera.saldo = saldo;
    await billetera.save();

    res.send({ message: "Saldo actualizado correctamente", billetera });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al actualizar el saldo" });
  }
});
