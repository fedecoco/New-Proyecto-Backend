import express from 'express';
import {
    createProduct,
    getProducts,
    getProdById,
    updateProdById,
    deleteProdById
} from '../../controllers/product.controller.js';

const router = express.Router();

// Crear un producto
router.post('/create', createProduct);

// Obtener todos los productos con filtros
router.get('/', getProducts);

// Obtener un producto por su ID
router.get('/findOne/:pid', getProdById);

// Actualizar un producto por su ID
router.put('/updateOne/:pid', updateProdById);

// Eliminar un producto por su ID
router.delete('/deleteOne/:pid', deleteProdById);

export default router;
