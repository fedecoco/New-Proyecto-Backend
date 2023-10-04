import passport from 'passport';
import passportLocal from 'passport-local';
import userModel from '../dao/models/user.model.js';
import GitHubStrategy from 'passport-github2';
import { createHash, isValidPassword } from '../utils.js';


// TODO: Implementacion passport
// declaracion de estrategia
const localStrategy = passportLocal.Strategy

const initializePassport = () => {

// TODO: Estrategia de Login con GitHub
passport.use('github', new GitHubStrategy(
    {
        clientID:'Iv1.36cfd4410007d7e8',
        clientSecret:'6694735641060dba9a8aa729ffabbb6a5b0cda32',
        callbackUrl:'http://localhost:8080/api/session/githubcallback'
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log("Profile obtenido del usuario: ");
        console.log(profile);

        try {
            const user = await userModel.findOne({ email: profile._json.email })
            console.log("Usuario encontrado para login:");
            console.log(user);

            if (!user) {
                console.warn("User doesn't exists with username: " + profile._json.email);
                let newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    age: 18,
                    email: profile._json.email,
                    password: '',
                    loggedBy: "GitHub"
                }
                const result = await userModel.create(newUser)
                done(null, result)
            }
            else {
                return done(null, user)
            }
        } catch (error) {
            return done(error)
        }
    }))





    // Register
    passport.use('register', new localStrategy(
        // passReqToCallback: para convertirlo en un callback de request, para asi poder iteracturar con la data que viene del cliente
        // usernameField: renombramos el username
        { passReqToCallback: true, usernameField: 'email' },

        async (req, username, password, done) => {
            // Logica que teniamos en session.router
            const { first_name, last_name, email, age } = req.body;
            try {
                const exists = await userModel.findOne({ email })
                if (exists) {
                    return res.status(400).send({ status: 'error', message: 'usuario ya existe' })
                }
                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                const result = await userModel.create(user);

                // si esta todo ok
                return done(null, result)

            } catch (error) {
                return done("Error registrando el usuario: " + error);
            }

        }
    ));


    // Login
    passport.use('login', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' },
        async (req, username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username })
                console.log("Usuario encontrado para login:");
                console.log(user);
                if (!user) {
                    console.warn("User doesn't exists with username: " + username);
                    return done(null, false)
                }
                // Validacion de el password
                if (!isValidPassword(user, password)) {
                    return done(null, false)
                }
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }
    ));



    //Funciones de Serializacion y Desserializacion
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("Error deserializando el usuario: " + error);
        }
    });

}



export default initializePassport;