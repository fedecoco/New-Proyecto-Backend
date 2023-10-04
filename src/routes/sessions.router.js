import { Router } from 'express';
import userModel from '../dao/models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';
import passport from 'passport';


const routerV = Router();

// TODO: Router github
routerV.get("/github", passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });


// githubcallback
routerV.get("/githubcallback", passport.authenticate('github', { failureRedirect: '/github/error' }), async (req, res) => {
    const user = req.user;
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    };
    req.session.admin = true;
    res.redirect("/users");
});




routerV.post("/register", passport.authenticate('register', { failureRedirect: '/api/session/fail-register' }), async (req, res) => {
    console.log("Registrando nuevo usuario.");
    res.status(201).send({ status: "success", message: "Usuario creado con extito." })

})

routerV.post("/login", passport.authenticate(
    'login', { failureRedirect: '/api/session/fail-login' })
    , async (req, res) => {
        console.log("User found to login:");
        const user = req.user;
        console.log(user);
        if (!user) return res.status(401).send({ status: "error", error: "El usuario y la contraseña no coinciden!" });
        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            age: user.age
        };
        req.session.admin = true;
        res.send({ status: "success", payload: req.session.user, message: "Primer logueo realizado!! :)" })
  
    // Validacion con bcrypt
    if (!isValidPassword(user, password)) {
        return res.status(401).send({ status: "error", error: "Incorrect credentials" });
    }
});
    

    


routerV.get("/fail-register", (req, res) => {
    res.status(401).send({ error: "Failed to process register!" });
});

routerV.get("/fail-login", (req, res) => {
    res.status(401).send({ error: "Failed to process login!" });
});

export default routerV;