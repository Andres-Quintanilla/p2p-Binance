const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const db = require("./models");

const app = express();
const port = 3000;

app.use(cors({
    origin: ['http://localhost:5173'],
    optionsSuccessStatus: 200
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }
}));

requires("./routes")(app);

db.sequelize.sync().then(() => {
    console.log("Base de datos sincronizada");
});

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});