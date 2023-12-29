import passport from 'passport';
import passportLocal from 'passport-local';
import jwtStrategy from 'passport-jwt';
import ExtractJwt from 'passport-jwt';
import config from "../config/config.js";
import userModel from '../services/dao/mongo/models/userModel.js';
import GitHubStrategy from 'passport-github2';
import { createHash, isValidPassword, PRIVATE_KEY } from '../utils.js';
import dotenv from 'dotenv';
import { cartService } from "../services/factory.js";

dotenv.config();

const { Strategy: JwtStrategy, ExtractJwt: JwtExtractJwt } = jwtStrategy;


const localStrategy = passportLocal.Strategy;

const initializePassport = () => {
  // JWT Strategy 
   const PRIVATE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5ct';
  passport.use('jwt', new JwtStrategy(
    {
      jwtFromRequest: JwtExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: PRIVATE_KEY,
    },
    async (jwt_payload, done) => {
      try {
        return done(null, jwt_payload.user);
      } catch (error) {
        console.error(error);
        return done(error);
      }
    }
  ));
  // Github Strategy
  passport.use('github', new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID || config.gitHubClientId,
    clientSecret: process.env.GITHUB_CLIENT_SECRET || config.gitHubClientSecret,
    callbackURL: process.env.GITHUB_CALLBACK_URL || config.gitHubCallbackUrl,
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await userModel.findOne({ email: profile._json.email });
      if (!user) {
        const newUser = {
          first_name: profile._json.name,
          last_name: "",
          email: profile._json.email,
          age: "",
          password: "",
          logedBy: "GitHub",
        };
        const result = await userModel.create(newUser);

        const userId = result._id.toString();
        const body = {
          userId,
          products: [],
        };
        const cart = await cartService.createCart(body);

        result.carts.push({ "cart": cart._id });
        await result.save();
        return done(null, result);
      } else {
        return done(null, user);
      }
    } catch (error) {
      return done("Error registrando al usuario" + error);
    }
  }));

  // Resto de las estrategias...

  // Register
  passport.use('register', new localStrategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, username, password, done) => {
      const { first_name, last_name, email, age } = req.body;
      try {
        const exists = await userModel.findOne({ email });
        if (exists) {
          return res.status(400).send({ status: 'error', message: 'usuario ya existe' });
        }
        const user = {
          first_name,
          last_name,
          email,
          age,
          password: createHash(password),
        };
        const result = await userModel.create(user);
        return done(null, result);
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
        const user = await userModel.findOne({ email: username });
        console.log("Usuario encontrado para login:");
        console.log(user);
        if (!user) {
          console.warn("User doesn't exist with username: " + username);
          return done(null, false);
        }
        if (!isValidPassword(user, password)) {
          return done(null, false);
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  ));

  // Funciones de Serializacion y Desserializacion
  passport.serializeUser((user, done) => {
    const serializedUser = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    done(null, serializedUser);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      let user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      console.error("Error deserializando el usuario: " + error);
    }
  });
};

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwtCookieToken"];
  }
  return token;
};

export default initializePassport;
