module.exports = app => {
    const router = require("express").Router();
    const billeteraController = require("../controllers/billetera.controller");
    const { requireUser } = require("../middlewares/requires-user");

    router.get("/:monedaId", requireUser, billeteraController.obtenerPorMoneda);
    router.put("/:id/saldo", requireUser, billeteraController.actualizarSaldo);
    router.get("/", requireUser, billeteraController.listar);
    app.use("/billeteras", router);
};