const { where } = require("sequelize");
const db = require("../models");
const { generateAuthToken, generatePassword } = require("../utils/auth.utils");

exports.register = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).send(
            { message: " El usuario y la contraseña son requeridas" }
        );
    }

    const existeUsuario = await db.usuario.findOne({
        where:{
            email: email
        }
    });
    if(existeUsuario){
        return res.status(400).send(
            { message: "El correo ya existe" }
        );
    }

    const hashedPassword = await generatePassword(password);
    try{
        const usuario = await db.usuario.create({
            email: email,
            password: hashedPassword,
            esAdmin: false
        });
        res.send(
            {
                id: usuario.id,
                email: usuario.email,
            }
        );
    }catch (error) {
        return res.status(500).send(
            { message: "Error al registrar el usuario" }
        );
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(400).send(
            {message: "El usuario y la contraseña son requeridas"}
        );
    }

    const usuario = await db.usuario.findOne({
        where: {
            email: email
        }
    })
    if(!usuario){
        return res.status(401).send(
            {message: "Usuario o contraseña incorrectos"}
        );
    }

    const hashedPassword = generatePassword(password);
    if(usuario.password !== hashedPassword){
        return res.status(401).send(
            {message: "Usuario o contraseña incorrectos"}
        );
    }

    try{
        const authToken = await db.authToken.create({
            usuarioId: usuario.id,
            token: generateAuthToken(usuario.email)
        });
        res.send(
            {
                token: authToken.token,
                email: usuario.email,
                esAdmin: usuario.esAdmin
            }
        );
    }catch (error){
        return res.status(500).send(
            {message: "Error al crear el token de autenticacion"}
        );
    }
};