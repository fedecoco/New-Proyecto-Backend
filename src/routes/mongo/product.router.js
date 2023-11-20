import express from 'express';
/* import { ProductModel } from '../../services/db/models/productModel.js'; */
import { createProduct, getProducts, getProdById, updateProdById, deleteProdById  } from '../../controllers/product.controller.js';

const router = express.Router();

//Create Product
router.post('/createOne', createProduct );

//Get all with filters
router.get('/', getProducts);

//Get product by id
router.get('/findOne/:pid', getProdById );

//Update product by id
router.put('/updateOne/:pid', updateProdById );

//Delete product by id
router.delete('/deleteOne/:pid', deleteProdById );


export default router;