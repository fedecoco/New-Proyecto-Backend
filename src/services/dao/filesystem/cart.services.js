import fs from 'fs/promises';
import ProductService from './product.services.js';
import { __dirname } from '../../../utils.js';

const prodService = new ProductService();

export default class CartService {
    #carts;
    #cartDirPath;
    #cartFilePath;
    #fileSystem;

    constructor() {
        this.#carts = [];
        this.#cartDirPath = __dirname + "/data";
        this.#cartFilePath = this.#cartDirPath + "/carts.json";
        this.#fileSystem = fs;
    }

    isCodeDuplicated(id) {
        return this.#carts.some(cart => cart.id === id);
    }

    #prepareBaseDirectory = async () => {
        try {
            // Creamos el directorio si no existe
            await this.#fileSystem.mkdir(this.#cartDirPath, { recursive: true });
            
            // Verificamos si el archivo existe
            if (!await this.#fileSystem.access(this.#cartFilePath).then(() => true).catch(() => false)) {
                await this.#fileSystem.writeFile(this.#cartFilePath, '[]');
            }
        } catch (error) {
            console.error('Error al preparar el directorio base:', error);
            throw new Error('Error al preparar el directorio base');
        }
    }

    createCart = async (data) => {
        try {
            await this.#prepareBaseDirectory();
            let cartsFile = await this.#fileSystem.readFile(this.#cartFilePath, 'utf-8');
            this.#carts = JSON.parse(cartsFile);

            let id = this.#carts.length + 1;
            let cart = {
                products: data.products,
                id: id
            };

            // Verificamos si el código del carrito ya existe
            if (this.isCodeDuplicated(cart.id)) {
                console.log("El carrito ya existe");
                return;
            }

            // Agregamos el nuevo carrito al array
            this.#carts.push(cart);

            // Guardamos el array de carritos actualizado en el archivo
            await this.#fileSystem.writeFile(this.#cartFilePath, JSON.stringify(this.#carts, null, 2));

            if (cart) {
                return cart;
            }
        } catch (error) {
            console.error(`Error al crear el carrito nuevo: ${JSON.stringify(cart)}, detalle del error: ${error}`);
            throw Error(`Error al crear el carrito nuevo: ${JSON.stringify(cart)}, detalle del error: ${error}`);
        }
    };

    getCartById = async (data) => {
        const cid = parseInt(data._id);
        
        try {
            await this.#prepareBaseDirectory();
            let cartsFile = await this.#fileSystem.readFile(this.#cartFilePath, 'utf-8');
            this.#carts = JSON.parse(cartsFile);

            let cart = this.#carts.find(cart => cart.id === cid);
            
            if (cart) {
                return cart;
            }
        } catch (error) {
            console.error(`Error al obtener el carrito con id: ${cid}, detalle del error: ${error}`);
            throw error;
        }
    };

    prodInCart = async (cid, pid) => {
        const idc = parseInt(cid._id);
        const idp = parseInt(pid._id);
        
        try {
            await this.#prepareBaseDirectory();
            let cartsFile = await this.#fileSystem.readFile(this.#cartFilePath, 'utf-8');
            this.#carts = JSON.parse(cartsFile);

            let cart = this.#carts.find(cart => cart.id === idc);
            const product = await prodService.getById({ _id: idp });
            const productToAdd = {
                product,
                quantity: 1
            };

            if (cart) {
                // Buscamos si el productId ya existe en el carrito
                const existingProduct = cart.products.find(item => item.product.id === productToAdd.product.id);

                if (existingProduct) {
                    // Si el productId ya existe, incrementamos la cantidad en 1
                    existingProduct.quantity += 1;
                } else {
                    // Si el productId no existe, agregamos el nuevo producto al carrito
                    cart.products.push(productToAdd);
                }

                await this.#fileSystem.writeFile(this.#cartFilePath, JSON.stringify(this.#carts, null, 2));
                return cart;
            }
        } catch (error) {
            console.error(`Error al agregar el producto al carrito: ${idc}, detalle del error: ${error}`);
            throw new Error(`Error al agregar el producto al carrito: ${idc}, detalle del error: ${error}`);
        }
    };

    deleteProdInCart = async (cid, pid) => {
        const idc = parseInt(cid._id);
        const idp = parseInt(pid._id);
        
        try {
            await this.#prepareBaseDirectory();
            let cartsFile = await this.#fileSystem.readFile(this.#cartFilePath, 'utf-8');
            this.#carts = JSON.parse(cartsFile);

            let cart = this.#carts.find(cart => cart.id === idc);
            const product = await prodService.getById({ _id: idp });
            const productToDel = {
                product,
                quantity: 1
            };

            console.log(productToDel);

            if (cart) {
                // Buscamos si el productId ya existe en el carrito
                const existingProduct = cart.products.find(item => item.product.id === productToDel.product.id);

                // Si el productId ya existe, restamos uno o lo eliminamos
                if (existingProduct) {
                    existingProduct.quantity > 1 ?
                        existingProduct.quantity -= 1 :
                        cart.products.splice(cart.products.indexOf(existingProduct), 1);
                }

                await this.#fileSystem.writeFile(this.#cartFilePath, JSON.stringify(this.#carts, null, 2));
                return cart;
            }
        } catch (error) {
            console.error(`Error al eliminar el producto del carrito: ${idc}, detalle del error: ${error}`);
            throw new Error(`Error al eliminar el producto del carrito: ${idc}, detalle del error: ${error}`);
        }
    };

    deleteAll = async (data) => {
        const cid = parseInt(data._id);
        
        try {
            await this.#prepareBaseDirectory();
            let cartsFile = await this.#fileSystem.readFile(this.#cartFilePath, 'utf-8');
            this.#carts = JSON.parse(cartsFile);

            let cart = this.#carts.find(cart => cart.id === cid);

            if (cart) {
                // Vaciamos el array de productos en el carrito
                cart.products.splice(0, cart.products.length);
                
                await this.#fileSystem.writeFile(this.#cartFilePath, JSON.stringify(this.#carts, null, 2));
                return cart;
            }
        } catch (error) {
            console.error(`Error al vaciar el carrito: ${cid}, detalle del error: ${error}`);
            throw new Error(`Error al vaciar el carrito: ${cid}, detalle del error: ${error}`);
        }
    };
}
