module.exports = app => {
  const router = require("express").Router();
  const transaccionController = require("../controllers/transaccion.controller");
  const { requireUser } = require("../middlewares/requires-user");

  router.put("/:id/confirmar", requireUser, transaccionController.confirmarTransaccion);
  router.put("/:id/cancelar", requireUser, transaccionController.cancelarTransaccion);
  router.put("/:id/comprobante", requireUser, transaccionController.subirComprobante);
  router.get("/pendientes-vendedor", requireUser, transaccionController.obtenerPendientesVendedor);
  router.get("/pendientes-comprador", requireUser, transaccionController.obtenerPendientesComprador);
  router.post("/transferencia", requireUser, transaccionController.transferir);
  router.post("/comprar/:anuncioId", requireUser, transaccionController.comprar);
  router.post("/vender/:anuncioId", requireUser, transaccionController.vender);

  app.use("/transacciones", router);
};
