
//import dependencias
import express from 'express';
//cors
//import cors from 'cors';

import {__dirname} from './utils.js';

/* import { Server } from 'socket.io'; */
import handlebars from 'express-handlebars';
import cookieParser from 'cookie-parser';

//import router
import productRoutes from './routes/mongo/product.router.js'
import cartRoutes from './routes/mongo/cart.router.js';
import usersViewRouter from './routes/mongo/users.views.router.js';
import userRouter from './routes/mongo/users.router.js'
import views from './routes/mongo/views.router.js';
import ticketRouter from './routes/mongo/ticket.router.js';
import mockProd from './routes/mock/mock.router.js';

import MongoStore from 'connect-mongo';  
import mongoose from 'mongoose'; 
//import dotenv
 import dotenv from 'dotenv'; 
import config from './config/config.js';
import './config/db.js'

//PARA SESSION
import session from 'express-session';

//import for passport
import passport from 'passport';
import initializePassport from './config/passport.config.js';

//import Swagger
import swaggerUI from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';




//Logger

import { addLogger } from './config/logger.config.js';

const app = express();

// Habilitar CORS
//app.use(cors());


//config Swagger
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Proyecto Backend CoderHouse",
            description: "Doc para uso de Swagger"
        }
    },
    apis: ["./src/docs/**/*.yml"]
};
const specs = swaggerJsDoc(swaggerOptions);


//Cookies
app.use(cookieParser("CoderS3cr3tC0d3"));


//Middlewares
app.use(addLogger)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Middleware para archivos estaticos
app.use(express.static(__dirname + '/public'));

//middeleware para passport
initializePassport();
app.use(passport.initialize());

//Config Handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(session({
  mongoUrl: config.mongo_Url,
  ttl: 60,
  secret: "coderS3cr3t",
  resave: true, 
  saveUninitialized: false, 
  
}));
  



//ROUTERS
app.use("/api/products", productRoutes)
app.use("/api/carts", cartRoutes);  
app.use("/products", views);
app.use("/carts", views);
app.use("/users", usersViewRouter);
app.use("/api/users", userRouter);
app.use("/api/ticket", ticketRouter);
app.use("/mockingproducts", mockProd);
app.use("/loggerTest", addLogger);
//endpoint Swagger
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));



const PORT = process.env.PORT  || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
    });


