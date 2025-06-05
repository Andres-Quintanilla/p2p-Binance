module.exports = app => {
  const router = require("express").Router();
  const transaccionController = require("../controllers/transaccion.controller");
  const { requireUser } = require("../middlewares/requires-user");

  // Confirmar y cancelar una transacción
  router.put("/:id/confirmar", requireUser, transaccionController.confirmarTransaccion);
  router.put("/:id/cancelar", requireUser, transaccionController.cancelarTransaccion);

  // Subir comprobante
  router.put("/:id/comprobante", requireUser, transaccionController.subirComprobante);

  // Ver pendientes
  router.get("/pendientes-vendedor", requireUser, transaccionController.obtenerPendientesVendedor);
  router.get("/pendientes-comprador", requireUser, transaccionController.obtenerPendientesComprador);

  // Transferencia directa
  router.post("/transferencia", requireUser, transaccionController.transferir);

  // Comprar o vender según anuncio
  router.post("/comprar/:anuncioId", requireUser, transaccionController.comprar);
  router.post("/vender/:anuncioId", requireUser, transaccionController.vender);

  app.use("/transacciones", router);
};
