import express from 'express';

import routerP from './routes/Products.js';
import routerC from './routes/Cart.mjs';
import routerV from './routes/views.router.js';

import { __dirname } from "./utils.js"
import handlebars from "express-handlebars"

import { Server } from "socket.io"
import socketProducts from "./listeners/socketProducts.js"
import socketChat from './listeners/socketChat.js';

import connectToDB from "./config/configServer.js"

// Sessions
import FileStore from 'session-file-store'
import session from 'express-session';
import mongoose from 'mongoose';

//Passport imports
import passport from 'passport';
import initializePassport from './config/passport.config.js';

//import Routers
import viewsRouter from './routes/views.router.js';
import usersViewRouter from './routes/users.views.router.js';
import sessionsRouter from './routes/sessions.router.js'
import githubLoginViewRouter from './routes/github-login.views.router.js'


const app = express();
const PORT = 8080;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"))

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", __dirname + "/views")

//Conectamos nuestra session con el file storage.

const fileStorage = FileStore(session);

 app.use(session({
  //ttl: Time to live in seconds,
  //retries: Reintentos para que el servidor lea el archivo del storage.
  //path: Ruta a donde se buscará el archivo del session store.

  // Usando --> session-file-store
    store: new fileStorage({ path: "./sessions", ttl: 15, retries: 0 }),

    //store: MongoStore.create({
    //mongoUrl: "mongodb+srv://fedemperez05:0523Fede@cluster.mo3k8jw.mongodb.net/?retryWrites=true&w=majority",
    //mongoOptions: { useNewUrlParser: true, useUnifiedTopology: true },
    //ttl: 10
    // }),


  secret: "coderS3cr3t",
  resave: false, //guarda en memoria
  saveUninitialized: true, //lo guarda a penas se crea
}));

//TODO: Middlewares Passport
initializePassport();
app.use(passport.initialize())
app.use(passport.session())


app.use('/api/products', routerP);
app.use('/api/cart', routerC);
app.use('/', routerV);

app.use("/users", usersViewRouter);
app.use("/api/session", sessionsRouter);
app.use("/github", githubLoginViewRouter);

connectToDB()

const httpServer = app.listen(PORT, () => {
  try {
      console.log(`Listening to the port ${PORT}\nAcceder a:`);
      console.log(`\t1). http://localhost:${PORT}/api/products`)
      console.log(`\t2). http://localhost:${PORT}/api/carts`);
  }
  catch (err) {
      console.log(err);
  }
});

const socketServer = new Server(httpServer)
socketProducts(socketServer)
socketChat(socketServer)