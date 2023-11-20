import { productService } from "../services/factory.js";
import CustomError from "../services/error/customError.js";
import EErrors from "../services/errors/errors.enum.js";
import {generateProductErrorInfo} from "../services/errors/messages/product-creation-error.message.js";

/* const services = new productService(); */

export const createProduct = async (req, res) => {
    /* const { body } = req; */
    try {
        const {title, description, price, thumbnail, code, stock, available} = req.body;
        if (!title || !description || !price || !thumbnail || !code || !stock || !available) {
            CustomError.createError({
                name: 'Missing Data',
                cause: generateProductErrorInfo({title, description, price, thumbnail, code, stock, available}),
                message: 'Missing Data',
                code: EErrors.INVALID_TYPE_ERROR
                
            });
        }
        const data = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            available
        }
        const response = await productService.createProduct(data);
        res.send({ status: 'Success', payload: response })

    } catch (error) {
        console.error(error);
        res.status(500).send({error: error.code, message: error.message});
    }
};

export const getProducts = async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const sort = req.query.sort === 'desc' ? -1 : 1;
    const filter = req.query.filter === 'false' ? false : true;
    try {
        const response = await productService.getAllProducts(limit, page, sort, filter);
        res.send({ status: 'Success', payload: response });
    } catch (error) {
        res.status(400).json(error.message);
    }
};

export const getProdById = async (req, res) => {
    const pid = req.params.pid;
    try {
        const response = await productService.getById({ _id: pid });
        res.send({ status: 'Success', payload: response });
    } catch (error) {
        res.status(400).json(error.message);
    }
};

export const updateProdById = async (req, res) => {
    const pid = req.params.pid;
    try {
        const {title, description, price, thumbnail, code, stock, available} = req.body;
        if (!title || !description || !price || !thumbnail || !code || !stock || !available) {
            CustomError.createError({
                name: 'Missing Data',
                cause: generateProductErrorInfo({title, description, price, thumbnail, code, stock, available}),
                message: 'Missing Data',
                code: EErrors.INVALID_TYPE_ERROR
                
            });
        }
        const data = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            available
        }
        const response = await productService.update({ _id: pid }, data);
        res.send({ status: 'Success', payload: response });
    } catch (error) {
        console.error(error);
        res.status(500).send({error: error.code, message: error.message});
    }
};

export const deleteProdById = async (req, res) => {
    const pid = req.params.pid;
    try {
        const response = await productService.delete({ _id: pid });
        res.send({ status: 'Success', payload: response });
    } catch (error) {
        res.status(400).json(error.message);
    }
};