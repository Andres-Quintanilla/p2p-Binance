module.exports = app => {
    require("./auth.routes.js")(app);
    require("./moneda.routes.js")(app);
    require("./billetera.routes.js")(app);
    require("./transaccion.routes")(app);
    require("./anuncio.routes.js")(app);
    require("./usuario.routes.js")(app);
}