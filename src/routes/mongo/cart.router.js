
import express from 'express';
import { creatNewCart, searchCart, putProductToCart, deleteProductFromCart, cleanCart, downQuantity, renderCart } from '../../controllers/cart.controller.js';
import { createTicket } from '../../controllers/ticket.controller.js';

const router = express.Router();

//Creamos un carrito
router.post('/', creatNewCart);

// Buscamos el carrito de compra especifico
router.get ('/search/:cid', searchCart);

//Agregamos un producto especifico al carrito
router.put('/:cid/products/add/:pid', putProductToCart);

//Bajamos la cantidad de un producto especifico al carrito o lo eliminamos en el caso de solo quedar uno
router.delete('/:cid/products/reduce/:pid', downQuantity);

//Eliminamos el producto del carrito
router.delete('/:cid/products/delete/:pid', deleteProductFromCart);

//limipamos el carrito de compras
router.put('/:cid/clean', cleanCart);

//renderizado de carrito de compras
router.get('/:cid', renderCart)

//finalizar compra
router.post('/:cid/purchase', createTicket);



export default router;