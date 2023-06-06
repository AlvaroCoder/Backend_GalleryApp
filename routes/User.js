
const routes = require('express').Router();
const {UserModel} = require('../services/ConnectionDatabase');
const bcrypt = require('bcrypt');
const uuid = require('uuid')
const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET;

function sendError(errorText) {
    return {
        error : true,
        status : 404,
        message : `Error : ${errorText}`
    }

}

routes.post('/',(req,res, next)=>{
    const authHeader = req.headers["authorization"];
    if (authHeader == null) return res.sendStatus(403);
    jwt.verify(authHeader, secret, (err, user) => {
        if (err) return res.sendStatus(404);
        next();
    });
});

routes.post("/login",async (req,res)=>{
    const body = req.body;
    const {username, password} = body;
    const prevUsernames = await UserModel.ValidateUsername(username);
    if (Number(prevUsernames.prevUsername) <= 0) {
        const err = sendError("This username does not exists");
        res.status(err.status).send(err);
        return;
    }
    const dataUser = await UserModel.GetUserByUsername(username);
    const correctPass = await bcrypt.compare(password, dataUser.password_hash);
    if (!correctPass) {
        const err = sendError("Password incorrect");
        res.status(err.status).send(err);
        return;
    }
    const token = jwt.sign(dataUser, secret, {expiresIn : '1d'})
    res.status(202).send({
        error : false,
        token: token
    })
});

routes.post("/signup",async (req,res)=>{
    const body = req.body;
    const {username, email, password}= body;
    const prevEmails = await UserModel.ValidateEmails(email);
    if (Number(prevEmails.prevEmails) > 0) {
        const err = sendError("Email already in use")
        res.status(err.status).send(err)
        return;
    }
    const prevUsernames = await UserModel.ValidateUsername(username);
    if (Number(prevUsernames.prevUsername) > 0) {
        const err = sendError("This username exists")
        res.status(err.status).send(err);
        return;
    }
    const idUser = uuid.v4();
    const password_hash = bcrypt.hashSync(password, 10);
    const date = new Date()
    const created_at = date.getFullYear()+'-'+(date.getUTCMonth()+1).toString().padStart(2, "0")+'-'+date.getDate().toString().padStart(2, "0")
    const dataUser = {
        idUser,
        username,
        email,
        password,
        password_hash,
        created_at
    }
    const response = await UserModel.CreateUser(dataUser);
    const token = jwt.sign(dataUser, secret, {expiresIn : '1d'})
    res.status(202).send({
        error : false,
        token : token,
        affectedRows : response
    });
})

module.exports = routes;