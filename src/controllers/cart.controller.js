import cart from "../services/dao/filesystem/models/cartModel.js";
import {cartService} from "../services/factory.js";


//controller create cart
export const creatNewCart = async (req, res)=>{
    const userId = req.body.userId;
    try {
        const body = {
            userId,
            products: [],
        };
        const result = await cartService.createCart(body);
    

    if (cart) {
        res.send({ status: "200", message: "Carrito creado con exito con ID: " + result.id , payload: result})
    }
    
    }catch (error) {
        req.logger.error('Error al crear el carrito en el usuario: '+ userId);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message }); 
    } 
};

//controller get cart by id
export const searchCart = async (req, res)=>{
    const cid = req.params.cid;
    try {
        const cart = await cartService.getCartById({ _id : cid})

        if (cart) {
            res.send({ status: 'Success', payload: cart });
        } else {
            res.send({ status: '404', message: 'Carrito no encontrado' }); 
        }
    }catch (error) {
        req.logger.error('Error al buscar el carrito:' + cid);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message }); 
    } 
};

//Controller add product to cart
export const putProductToCart = async (req, res) => {
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const cart = await cartService.prodInCart({_id:cid},{_id:pid})
        if (cart) {
            res.status(200).send({ status: 'Success', payload: cart });
        } else {
            res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
    } catch (error) {
        req.logger.error('Error al buscar el carrito: ' + cid + "o el producto: " + pid);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    } 
};

//controller delete product from cart
export const deleteProductFromCart = async (req, res) =>{
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const cart = await cartService.deleteProdInCart({ _id: cid }, { _id: pid });
        if (cart) {
            res.status(200).send({ status: 'Success', payload: cart });
        } else {
            res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
    } catch (error) {
        req.logger.error('Error al buscar el carrito: ' + cid + "o el producto: " + pid);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
};

//controller down quantity of product in cart
export const downQuantity = async (req, res) =>{
    const cid = req.params.cid;
    const pid = req.params.pid;
    try {
        const cart = await cartService.reduceProdQuantity({ _id: cid }, { _id: pid });
        if (cart) {
            res.send({ status: 'Success', payload: cart });
        } else {
            res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
    } catch (error) {
        req.logger.error('Error al buscar el carrito: ' + cid + "o el producto: " + pid);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
};

//controller clean cart
export const cleanCart = async (req, res) => {
    const cid = req.params.cid;
    try {
        const cart = await cartService.deleteAll({ _id: cid });     
        if (cart) {
            res.send({ status: 'Success', payload: cart });
        } else {
            res.status(404).json({ error: 'Carrito o producto no encontrado' });
        }
    } catch (error) {
        req.logger.error('Error al buscar el carrito:'+ cid);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }
};

//controller render cart
export const renderCart = async (req, res) => {
    let cid = req.params.cid;
    let page = parseInt(req.query.page);
    if (!page) page = 1;

    try {
        const cartProducts = await cartService.cartRender({_id : cid}, page);
        if (cartProducts) {
            let prevLink = cartProducts.hasPrevPage ? `http://localhost:${PORT}/carts?page=${cartProducts.prevPage}` : '';
            let nextLink = cartProducts.hasNextPage ? `http://localhost:${PORT}/carts?page=${cartProducts.nextPage}` : '';
            let isValid = !(cartProducts.page <= 0 || cartProducts.page > cartProducts.totalPages)
            res.render('carts', { cartProducts, prevLink, nextLink, isValid })
            }
        else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    }catch (error) {
        req.logger.error('Error al buscar el carrito y renderrizarlo:  ', error);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
        
    }
};

//Eliminar cart
export const deleteCart = async (req, res) => {
    let cid = req.params.cid;
    try {
        const cart = await cartService.cartDelete({ _id: cid });
        if (cart) {
            res.status(200).send({ status: 'Success', payload: cart });
        } else {
            res.status(404).json({ error: 'Carrito no encontrado' });
        }
    } catch (error) {
        req.logger.error('Error al buscar el carrito: ' + cid);
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    }

};

