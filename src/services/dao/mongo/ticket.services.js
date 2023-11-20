import { CartModel } from "./models/cartModel.js";
import userModel  from "./models/userModel.js";
import { ProductModel } from "./models/productModel.js";
import { TicketModel } from "./models/ticketModel.js";
import CartServices from "./cart.services.js";


const cartServices = new CartServices();


function generateCode () {
    return (new Date()).getTime();
};

//busca al usuario para obtener datos
async function getUser (userId) {
    let userData = await userModel.findOne({_id: userId});
    return userData;
}

//busca al carrito para obtener datos
async function getCartById (cartId) {
    let cartData = await CartModel.findOne({_id: cartId});
    return cartData;
}

//suma todos los precios de los productos
async function sumarPrecio(arrayDeObjetos) {
    const total = arrayDeObjetos.reduce((acumulador, objeto) => {
        if (objeto.product && objeto.product.price) {
            const precioPorCantidad = objeto.product.price * objeto.quantity;
            return acumulador + precioPorCantidad;
        }
        return acumulador;
    }, 0);
    return total;
}

export default class TicketServices {

    create = async (data) => {
        //busco el carrito
        const cart = await getCartById(data)

        //obtengo el dato del usuario del carrito y obtengo los datos del usuario
        const user = await getUser( cart.userId); 

        //genero el codigo
        const code = generateCode();

        //array de datos
        const productsWithStock = [];
        const productsWithOutStock = [];

        for (let i = 0; i < cart.products.length; i++) {
            try {
                if (cart.products[i].product.stock < cart.products[i].quantity) {
                    console.log(`No hay stock suficiente para el producto id: ${cart.products[i].product._id}, el producto queda en el carrito de compras hasta que haya stock disponible`);
                    productsWithOutStock.push(cart.products[i]);
                } else {
                    productsWithStock.push(cart.products[i]);
                    await ProductModel.updateOne(
                        { _id: cart.products[i].product._id },
                        { $inc: { stock: -cart.products[i].quantity } }
                    );
                    await cartServices.deleteProdInCart(cart._id, cart.products[i].product._id);
                }
            } catch (error) {
                // Manejar cualquier error aquí, si es necesario
                console.error('Error en el ciclo: ' + error.message);
            }
        }

        if (productsWithStock.length === 0) {
            // El array está vacío, no se puede crear el ticket
            return null;
        }

        //obtengo el total
        const amount = await sumarPrecio(productsWithStock);

        const ticketData = {
            code : code,
            purchaser : user.email,
            amount : amount,
            products: productsWithStock,
            productsWithOutStock: productsWithOutStock,
        };
        
        const ticket = await TicketModel.create(ticketData);
        return ticket;
    };

    getTicket = async (id) => {
        const ticket = await TicketModel.findOne({_id: id}).populate('products.product').populate('productsWithOutStock.product').lean();
        if (ticket) {
            return ticket;
        }else{
            return null;
        }
    }
}

    