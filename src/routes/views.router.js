import { Router } from "express";
import ProductManager from "../dao/managers/ProductManager.js";
import { __dirname } from "../utils.js";
const pm = new ProductManager(__dirname + "/data/data.json")

import cookieParser from 'cookie-parser';

const routerV = Router()

routerV.get("/",async(req,res)=>{
  const listadeproductos=await pm.getProductsView()
  res.render("home",{listadeproductos})
})

routerV.get("/realtimeproducts",(req,res)=>{
res.render("realtimeproducts")
})

routerV.get("/chat",(req,res)=>{
res.render("chat")
})


    //router.use(cookieParser());
    
routerV.use(cookieParser("CoderS3cr3tC0d3"));

routerV.get('/',(req,res)=>{
    res.render('index',{})
});

//Session management:
routerV.get("/session", (req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        res.send(`Se ha visitado este sitio ${req.session.counter} veces.`);
    } else {
        req.session.counter = 1;
        res.send("Bienvenido!");
    }
});
//Register
routerV.get('/register', (req, res) => {
    res.render('register'); // Renderiza la plantilla de registro
});

//Login
routerV.get('/login', (req, res) => {
    const {username, password} = req.query;
    if (username !== 'pepe' || password !== 'pepepass'){
        return res.status(401).send("Login Failed, check your username and password.");
    } else {
        req.session.user = username;
        req.session.admin = true;
        res.send('Login Successful !');
    }
});

routerV.get("/logout", (req, res) => {
    req.session.destroy(error => {
        if (error){
            res.json({error: "error logout", mensaje: "Error al cerrar la sesion"});
        }
        res.send("Sesion cerrada correctamente.");
    });
});

//Auth middleware:
function auth(req, res, next){
    if (req.session.user && req.session.admin) {
        return next();
    } else{
        return res.status(403).send("Usuario no autorizado para ingresar a este recurso.");
    }
}

routerV.get('/private', auth, (req, res) =>{
    res.send("Si estas viendo esto es porque pasaste la autorización a este recurso!");
});



export default routerV ;