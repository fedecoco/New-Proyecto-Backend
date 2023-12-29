import fs from 'fs/promises';
import Product from './models/productModel.js';
import { __dirname } from '../../../../utils.js';

export default class ProductServices {
    #products;
    #productDirPath;
    #productFilePath;
    #fileSystem;

    constructor() {
        this.#products = [];
        this.#productDirPath = __dirname + "/data";
        this.#productFilePath = this.#productDirPath + "/products.json";
        this.#fileSystem = fs;
    }

    isCodeDuplicated(code) {
        return this.#products.some(product => product.code === code);
    }

    generateId() {
        return (new Date()).getTime();
    }

    #prepareBaseDirectory = async () => {
        try {
            await this.#fileSystem.mkdir(this.#productDirPath, { recursive: true });

            // Verificamos si el archivo existe
            if (!await this.#fileSystem.access(this.#productFilePath).then(() => true).catch(() => false)) {
                await this.#fileSystem.writeFile(this.#productFilePath, '[]');
            }
        } catch (error) {
            console.error('Error al preparar el directorio base:', error);
            throw error;
        }
    };

    createProduct = async (body) => {
        let newProduct = new Product(body.title, body.description, body.price, body.status, body.thumbnail, body.code, body.stock, body.available);

        try {
            await this.#prepareBaseDirectory();
            let productsFile = await this.#fileSystem.readFile(this.#productFilePath, 'utf-8');
            this.#products = JSON.parse(productsFile);

            if (this.isCodeDuplicated(newProduct.code)) {
                return { error: 'El código del producto ya existe' };
            }

            let response = { ...newProduct, id: this.generateId() };
            this.#products.push(response);

            await this.#fileSystem.writeFile(this.#productFilePath, JSON.stringify(this.#products, null, 2));
            return response;
        } catch (error) {
            console.error(`Error al crear el producto nuevo: ${JSON.stringify(newProduct)}, detalle del error: ${error}`);
            throw Error(`Error al crear el producto nuevo: ${JSON.stringify(newProduct)}, detalle del error: ${error}`);
        }
    };

    getAllProducts = async () => {
        try {
            await this.#prepareBaseDirectory();
            let productsFile = await this.#fileSystem.readFile(this.#productFilePath, 'utf-8');
            this.#products = JSON.parse(productsFile);
            return this.#products;
        } catch (error) {
            console.error(`Error al obtener los productos: ${error}`);
            throw Error(`Error al obtener los productos: ${error}`);
        }
    };

    getById = async (data) => {
        let pid = parseInt(data._id);

        try {
            await this.#prepareBaseDirectory();
            let productsFile = await this.#fileSystem.readFile(this.#productFilePath, 'utf-8');
            this.#products = JSON.parse(productsFile);
            let response = this.#products.find(product => product.id === pid);

            if (response) {
                console.log(response);
                return response;
            }
        } catch (error) {
            console.error(`Error al obtener el producto con id: ${pid}, detalle del error: ${error}`);
            throw error;
        }
    };

    update = async (data, product /* clave, valor */) => {
        let id = parseInt(data._id);
        console.log(product);

        try {
            await this.#prepareBaseDirectory();
            let productsFile = await this.#fileSystem.readFile(this.#productFilePath, 'utf-8');
            this.#products = JSON.parse(productsFile);
            let productToUpdate = this.#products.find(product => product.id === id);

            Object.assign(productToUpdate, product);
            await this.#fileSystem.writeFile(this.#productFilePath, JSON.stringify(this.#products, null, 2));
            return productToUpdate;
        } catch (error) {
            console.error(`Error al actualizar el producto con id: ${id}, detalle del error: ${error}`);
            throw error;
        }
    };

    delete = async (data) => {
        let id = parseInt(data._id);

        try {
            await this.#prepareBaseDirectory();
            let productsFile = await this.#fileSystem.readFile(this.#productFilePath, 'utf-8');
            this.#products = JSON.parse(productsFile);
            let productToDelete = this.#products.find(product => product.id === id);

            if (productToDelete) {
                this.#products = this.#products.filter(product => product.id !== id);
                await this.#fileSystem.writeFile(this.#productFilePath, JSON.stringify(this.#products, null, 2));
                console.log(`Producto eliminado:`);
                console.log(productToDelete);
                console.log(this.#products);
            }
        } catch (error) {
            console.error(`Error al eliminar el producto con id: ${id}, detalle del error: ${error}`);
            throw error;
        }
    };
}
