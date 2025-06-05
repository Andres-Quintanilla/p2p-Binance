module.exports = app => {
    const router = require("express").Router();
    const usuarioController = require("../controllers/usuario.controller");
    const { requireUser } = require("../middlewares/requires-user");
    const { requireAdmin } = require("../middlewares/requires-admin");
    

    router.get("/", requireUser, requireAdmin, usuarioController.listarUsuarios);
    router.put("/:id/hacer-admin", requireUser, requireAdmin, usuarioController.hacerAdmin);
    app.use("/usuarios", router);
};