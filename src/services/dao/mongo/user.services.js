import userModel from "./models/userModel.js";
import {ProductModel }from "./models/productModel.js";
import { createHash } from '../../../utils.js';
import { isValidPassword } from '../../../utils.js';
import { generateToken } from '../../../utils.js';
import config from '../../../config/config.js';
/* import { CartModel } from "../models/cartModel.js"; */
import CartServices from "./cart.services.js";

const cartServices = new CartServices();

const PORT = config.port
export default class UserService {

    getAll = async () => {
        let users = await userModel.find();
        return users.map(user => user.toObject());
    };

    save = async (data) => {    
    const exists = await userModel.findOne({ email:data.email });
    if (exists) {
        return null;
    };
    try {
        data.password = createHash(data.password); 
        let user = await userModel.create(data);
        const userId = user._id.toString();
        const  body  = {
            userId,
            products: [],
        }
        let cart = await cartServices.createCart(body);

        if (cart && user) {
            user.carts.push({ "cart": cart._id});
            await user.save();
            return user;
        
        } else {
            return null;
        }
    } catch (error) {
        throw new Error("Error en la creación del usuario: " + error.message);    
    }

    };


    login = async (email, password, res) => {
            const exists = await userModel.findOne({ email });
            if (!exists) {
                return console.log("Usuario no encontrado");
                }
            if (!isValidPassword(exists, password)) {
                return console.log("Los datos ingresados son incorrectos");
            }
                let cartData = await cartServices.getCartById(exists.carts[0].cart._id)
            const tokenUser = {
                name: `${exists.first_name} ${exists.last_name}`,
                email: exists.email,
                role: exists.role,
                cart: exists.carts[0].cart._id,
                cartLength: cartData.products.length
            };
            const accessToken = generateToken(tokenUser);
            //Cookies
            res.cookie('jwtCookieToken', accessToken, {
                maxAge: 60000,  
                httpOnly: true, // no expone la cookie cuando esta en true
               
            })
            res.status(200).send({ message: 'Login exitoso' });
    };


    logout = async (cookieName, res) => {
        res.clearCookie(cookieName);
        return res.send({ message: 'Logout exitoso' });
    };
    
    gitHubLogin = async (user, res) => {
        const tokenUser = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role,
            cart: exists.carts[0].cart._id
        };
        const accessToken = generateToken(tokenUser)
        res.cookie('jwtCookieToken', accessToken, {
            maxAge: 60000,  
            httpOnly: true,
        })
    
        res.redirect('/users');
    };

    loginShowProducts = async (page, req ,res) => {
        let result = await ProductModel.paginate({}, {page, lean: true });
            let prevLink = result.hasPrevPage ? `http://localhost:${PORT}/users?page=${result.prevPage}` : '';
            let nextLink = result.hasNextPage ? `http://localhost:${PORT}/users?page=${result.nextPage}` : '';
            let isValid = !(result.page <= 0 || result.page > result.totalPages)
    
            return res.render('profile', {user: req.user,  result, prevLink, nextLink, isValid })            
    };

    loginAdmin = async (req, res) => {
        let isAdmin = true
        return res.render('profile', {user: req.user, isAdmin})            
    
    }
    deleteInactiveUsers = async (days) => {
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - days);
    
        try {
            const inactiveUsers = await userModel.find({
                last_connection: { $lt: twoDaysAgo },
            });
    
            if (inactiveUsers && inactiveUsers.length > 0) {
                const deletedUsers = [];
                for (const user of inactiveUsers) {
                    await user.remove();
                    deletedUsers.push(user);
                }
    
                return deletedUsers;
            } else {
                return null;
            }
        } catch (error) {
            throw new Error("Error al eliminar usuarios inactivos: " + error.message);
        }
    };
    
}
