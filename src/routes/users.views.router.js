import { Router } from "express";

const routerV = Router();

routerV.get("/login", (req, res) => {
    res.render('login')
});

routerV.get("/register", (req, res) => {
    res.render('register')
});

// Cuando ya tenemos una session activa con los datos del user, renderizamos la vista profile
routerV.get("/", (req, res) => {
    res.render('profile', {
        user: req.session.user
    })

    routerV.get("/error", (req, res) => {
        res.render("error");
    });
});

export default routerV;