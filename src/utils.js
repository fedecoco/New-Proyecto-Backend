import {fileURLToPath} from 'url'
import { dirname } from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from './config/config.js'
import {faker as faker} from '@faker-js/faker';
//Configuracion de Multer para subir archivos
import multer from 'multer'
import nodemailer from 'nodemailer';

// Encriptacion
export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

//administracion archivos locales
const __filename = fileURLToPath(import.meta.url);
export const __dirname = dirname(__filename);


//Configuracion de Multer para subir archivos
function createMulterMiddleware(destination) {
  return multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, destination);
      },
      filename: function (req, file, cb) {
        const email = req.params.user;
        const baseName = file.originalname.slice(file.originalname.length - 4);
        if (destination === `${__dirname}/public/profile` ){
          cb(null, `avatar_${email}_${baseName}`);
        }else if (destination === `${__dirname}/public/products`){
          cb(null, `prodImg_${email}_${baseName}`);
        }else{
          cb(null, file.fieldname +`_${email}_${baseName}`);
        
        }
        
      },
    }),
    onError: function (err, next) {
      console.log(err);
      next();
    },
  });
}

export const upProfileImg = createMulterMiddleware(`${__dirname}/public/profile`);
export const upProdImg = createMulterMiddleware(`${__dirname}/public/products`);
export const upUserDocs = createMulterMiddleware(`${__dirname}/public/documents`);



/*const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, `${__dirname}/public/img`)},

        filename: function(req, file, cb) {
            cb(null, file.originalname)
        }
    });    
export const uploader = multer({storage, onError: function(err, next) {
    console.log(err);
    next();
    }
});  */



//Config JWT

export const PRIVATE_KEY = config.jwtPrivateKey;

export const generateToken = (user) => {
    return jwt.sign({user}, PRIVATE_KEY, {expiresIn: '60s'})
};

export const authToken = (req, res, next) => {
    //el JWT de autorizacion se guarda en el header de la peticion
    const authHeader = req.headers.authorization;
    if (!authHeader){ 
        return res.status(401).send({error: 'User not authenticated or missing token'})
    };
    const token = authHeader.split(' ')[1]; // se hace el split para retirar la palabra Bearer y quedarnos solo con el token
    
    //validar token
    jwt.verify(token, PRIVATE_KEY, (error, credentials) => {
        if (error) return res.status(403).send({error: 'Invalid token, access denied'});
        //token ok
        req.user = credentials.user;
        next();
    });
};

//creamos base de productos con Faker
export const generateProducts = () => {
    return{
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.string.alpha(5),
        price: faker.commerce.price(),
        thumbnail: faker.image.avatar(),
        stock: faker.number.int(500),
        available: faker.datatype.boolean(),
    }
};



// Función para enviar correo cuando un producto es eliminado
export const sendProductDeletedEmail = async (email, productName) => {
  try {
      await transporter.sendMail({
          from: config.gmailUser,
          to: email,
          subject: 'Producto Eliminado',
          text: `Estimado usuario premium,\n\nEl producto ${productName} ha sido eliminado de su cuenta.\n\nGracias por utilizar nuestros servicios.`,
      });
      console.log(`Correo enviado a ${email} por eliminación de producto.`);
  } catch (error) {
      console.error(`Error al enviar correo a ${email}: ${error.message}`);
  }
};
//transporter de Nodemailer
export const transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  auth: {
      user: config.gmailUser, 
      pass: config.gmailPass
  }
});

// Función para enviar correo cuando un usuario inactivo es eliminado
export const sendInactiveUserEmail = async (email) => {
  try {
      await transporter.sendMail({
          from: config.gmailUser,
          to: email,
          subject: 'Cuenta Eliminada por Inactividad',
          text: `Estimado usuario,\n\nSu cuenta ha sido eliminada debido a la inactividad durante un período prolongado.\n\nGracias por utilizar nuestros servicios.`,
      });
      console.log(`Correo enviado a ${email} por eliminación de cuenta inactiva.`);
  } catch (error) {
      console.error(`Error al enviar correo a ${email}: ${error.message}`);
  }
};