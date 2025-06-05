module.exports = app => {
    const router = require("express").Router();
    const anuncioController = require("../controllers/anuncio.controller");
    const { requireUser } = require("../middlewares/requires-user");

    router.get("/mis-anuncios", requireUser, anuncioController.misAnuncios);

    router.post("/", requireUser, anuncioController.crear);
    router.get("/", requireUser, anuncioController.listar);
    router.get("/:id", requireUser, anuncioController.detalle);
    
    app.use("/anuncios", router);
};