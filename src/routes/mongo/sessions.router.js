import { Router } from 'express';
import passport from 'passport';
import userModel from '../dao/models/user.model.js';
import { isValidPassword } from '../../utils.js';

const routerV = Router();

routerV.get("/github", passport.authenticate('github', { scope: ['user:email'] }));

routerV.get("/githubcallback", passport.authenticate('github', { failureRedirect: '/github/error' }), async (req, res) => {
    try {
        const user = req.user;
        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age
        };
        req.session.admin = true;
        res.redirect("/users");
    } catch (error) {
        console.error("Error en GitHub Callback:", error);
        res.render('error', { error: "Error en GitHub Callback" });
    }
});

routerV.post("/register", passport.authenticate('register', { failureRedirect: '/api/session/fail-register' }), async (req, res) => {
    res.status(201).send({ status: "success", message: "Usuario creado con éxito." });
});

routerV.post("/login", passport.authenticate('login', { failureRedirect: '/api/session/fail-login' }), async (req, res) => {
    try {
        const user = req.user;
        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age
        };
        req.session.admin = true;
        res.send({ status: "success", payload: req.session.user, message: "Primer inicio de sesión exitoso!" });
    } catch (error) {
        console.error("Error en Login:", error);
        res.status(401).send({ status: "error", error: "Error en el proceso de inicio de sesión." });
    }
});

routerV.get("/fail-register", (req, res) => {
    res.status(401).send({ error: "Error en el proceso de registro." });
});

routerV.get("/fail-login", (req, res) => {
    res.status(401).send({ error: "Error en el proceso de inicio de sesión." });
});

export default routerV;
