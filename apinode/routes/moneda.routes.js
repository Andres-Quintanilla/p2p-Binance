module.exports = app => {
    const router = require("express").Router();
    const monedaController = require("../controllers/moneda.controller")
    const { requireUser } = require("../middlewares/requires-user");
    const { requireAdmin } = require("../middlewares/requires-admin");

    router.get("/", requireUser, monedaController.listarMonedas);
    router.post("/", requireUser, requireAdmin, monedaController.crearMoneda);
    app.use("/monedas", router);
};