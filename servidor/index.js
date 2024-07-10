const database = require("./db.js");
const User = require("./user.js");
const bodyParser = require("body-parser");
const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const cors = require("cors");
const { error } = require("console");
const { where, INTEGER } = require("sequelize");

const boardsList = fs.readFileSync("./boards.json", "utf8");
let boards = JSON.parse(boardsList);

const app = express();
const port = 8000;

app.use(cors());

(async () => {
    try{
        await database.sync({force: true});

        const newUser = await User.create({
            username: "123",
            password: "123",
            email: "email"
        });
        const newUser2 = await User.create({
            username: "Guilherme",
            password: "123",
            email: "email1"
        });
        const newAdmin = await User.create({
            username: "admin",
            password: "123",
            email: "email2",
            type: "admin"
        });

        await newUser.save();
        await newUser2.save();
        await newAdmin.save();

        const user = await User.findOne({where: {username: "123"}});
        console.log(user.dataValues);
    }catch(error){
        console.log(error);
    }
})();

function createTokenJWT(id, username, type){
    let privateKey = fs.readFileSync("./private.key", "utf8");
    let token = jwt.sign({id, username, type}, privateKey, {
        algorithm: "RS256",
        expiresIn: "1h"
    });
    return token;
}

function verifyTokenJWT(req, res, next){
    if(req.headers["authorization"] === undefined){
        return res.status(401).json(
            {
                authentication: false,
                error:{
                    code: 401,
                    message: "Usuário não logado"
                }
            }
        );
    }
    let header = req.headers["authorization"].split(" ");
    let token = header[1];

    if(!token){
        return res.status(401).json(
            {
                authentication: false,
                error:{
                    code: 401,
                    message: "Token não fornecido / mal formatado"
                }
            }
        );
    }

    const publicKey = fs.readFileSync("./public.key", "utf-8");
    jwt.verify(token, publicKey, {algorithm: ["RS256"]}, (error, decodifiedToken)=>{
        if(error){
            return res.status(401).json(
                {
                    authentication: false,
                    error:{
                        code: 401,
                        message: "Usuário não logado ou sessão expirada"
                    }
                }
            );
        }
        req.user = decodifiedToken;
        next();
    });
}

function isAdmin(user){
    if(user.type === "admin"){
        return true;
    }
    return false;
}

function insertBoard(newBoard){
    const keys = Object.keys(boards);
    const id = parseInt(keys[keys.length - 1]) + 1;
    boards[id] = newBoard;
    fs.writeFileSync("./boards.json", JSON.stringify(boards));
}

function deleteBoard(id){
    delete boards[id];
    fs.writeFileSync("./boards.json", JSON.stringify(boards));
}

async function checkUser(user){
    const databaseUser = await User.findOne({where: {username: user.username}});

    if(!databaseUser) return false;

    const databaseUserData = databaseUser.dataValues;
    
    if(user.password === databaseUserData.password){
        return databaseUserData;
    }

    return false;
}

async function checkUsername(username){
    const user = await User.findOne({where: {username: username}});
    if(!user){
        return true;
    }
    return false;
}

app.post('/user/register', [bodyParser.json(), async (req, res) =>{
    const user = {
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    };

    try{
        if(!await checkUsername(user.username)){
            res.status(400).json(
                {
                    error:{
                        code: 400,
                        message: "Usuário já cadastrado"
                    }
                }
            );
            return;
        }
        await User.create(user);
        res.status(200).json(
            {
                code: 200,
                message: "Cadastro realizado"
            }
        );
    }catch(e){
        res.status(400).json(
            {
                code: e.code,
                error: e
            }
        );
    }
}]);

app.post('/user/login', [bodyParser.json(), async (req, res) => {
    const user = {
        username: req.body.username,
        password:  req.body.password
    };

    try{
        const databaseUser = await checkUser(user);
        if(!databaseUser){
            res.status(401).json(
                {
                    authentication: false,
                    token: null,
                    error: {
                        code: 401,
                        message: "Usuário ou senha incorretos"
                    }
                }
            );
            return;
        }
        
        const token = createTokenJWT(databaseUser.id, databaseUser.username, databaseUser.type);
        res.status(200).json(
            {
                code: 200,
                authentication : true,
                token: token,
                id: databaseUser.id
            }
        );
    }catch(e){
        res.status(e.code).json(
            {
                code: e.code,
                error: e
            }
        );
    }
}]);
app.get('/user', [verifyTokenJWT, async (req, res) =>{
    if(!isAdmin(req.user)){
        res.status(403).json(
            {
                error: {
                    code: 403,
                    message: "Usuário não administrador"
                }
            }
        );
        return;
    }
    const users = await User.findAll();
    res.status(200).json(
        {
            code: 200,
            users
        }
    );
}]);

app.get('/user/:id', [verifyTokenJWT, async (req, res) =>{
    try{
        const user = await User.findOne({where: {id: req.params.id}});
        if(!user){
            res.status(404).json(
                {
                    error: {
                        code: 404,
                        message: "Usuário não encontrado"
                    }
                }
            );
            return;
        }
        res.status(200).json(
            {
                code: 200,
                user,
                isUser: parseInt(req.params.id) === req.user.id? true: false
            }
        );
    }catch(e){
        res.status(400).json(
            {
                error: {
                    code: e.code,
                    error: e
                }
            }
        );
    }
}]);

app.use("/board", [verifyTokenJWT, (req, res, next) =>{
    next();
}]);

app.get("/board", async (req, res) =>{
    res.status(200).json({
        code: 200,
        boards
    });
});

app.get("/board/:id", async (req, res) =>{
    let board = boards[req.params.id];
    if(!board){
        res.status(404).json(
            {
                code: 404,
                message: "Tabuleiro não encontrado"
            }
        );
        return;
    }
    res.status(200).json({
        board: board,
        isAdmin: isAdmin(req.user)
    });
});

app.post("/board", [bodyParser.json(), async (req, res) =>{
    if(!isAdmin(req.user)){
        res.status(403).json(
            {
                error:{
                    code: 403,
                    message: "Usuário não autorizado"
                }
            }
        );
        return;
    }

    const board = req.body.board;
    insertBoard(board);
    res.status(200).json(
        {
            code: 200,
            message: "Tabuleiro inserido"
        }
    );
}]);

app.delete("/board/:id", [bodyParser.json(), async (req, res) =>{
    if(!isAdmin(req.user)){
        res.status(403).json(
            {
                error:{
                    code: 403,
                    message: "Usuário não autorizado"
                }
            }
        );
        return;
    }
    deleteBoard(req.params.id);
    res.status(200).json(
        {
            code: 200,
            message: "Tabuleiro deletado"
        }
    );
}]);

app.get("/checkToken", [verifyTokenJWT, async (req, res) =>{
    res.status(200).json({
        code: 200,
        user: req.user,
        userId: req.user.id,
        type: req.user.type
    });
}]);

app.listen(port, async () => {
    // await database.createTable();
    console.log(`Servidor rodando na porta ${port}!`);
});