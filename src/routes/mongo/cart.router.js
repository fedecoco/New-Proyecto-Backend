// Importa express y el router
import express from 'express';
const router = express.Router();

// Importa tus controladores
import {
    creatNewCart,
    searchCart,
    putProductToCart,
    deleteProductFromCart,
    cleanCart,
    downQuantity,
    renderCart
} from '../../controllers/cart.controller.js';

// Define las rutas
router.post('/', creatNewCart);

// Ruta para buscar el carrito de compra específico (API)
router.get('/search/:cid', searchCart);

// Ruta para agregar un producto específico al carrito (API)
router.put('/:cid/products/add/:pid', putProductToCart);

// Ruta para reducir la cantidad de un producto específico en el carrito o eliminarlo si queda uno (API)
router.delete('/:cid/products/reduce/:pid', downQuantity);

// Ruta para eliminar un producto del carrito (API)
router.delete('/:cid/products/delete/:pid', deleteProductFromCart);


// Ruta para limpiar el carrito de compras (API)
router.put('/:cid/clean', cleanCart);

// Ruta para renderizar el carrito de compras (Vista)
router.get('/carts/:cid', renderCart);

// Exporta el router
export default router;
