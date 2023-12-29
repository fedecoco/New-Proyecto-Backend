
// Resto de tus importaciones
import { productService } from "../services/factory.js";
import CustomError from "../services/error/customError.js";
import EErrors from "../services/error/errors.enum.js";
import { generateProductErrorInfo } from "../services/error/messages/product-creation-error.messages.js";

// Initialize services before using them



export const createProduct = async (req, res) => {
  try {
    const { title, description, price, thumbnail, code, stock, available } = req.body;
    if (!title || !description || !price || !thumbnail || !code || !stock || !available) {
      throw CustomError.createError({
        name: 'Missing Data',
        cause: generateProductErrorInfo({ title, description, price, thumbnail, code, stock, available }),
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
    };
    const response = await productService.createProduct(data);
    res.status(200).send({ status: 'Success', payload: response });

  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.code, message: error.message });
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
      req.logger.error("Error al obtener todos los productos");
      res.status(400).json(error.message);
  }
};


export const getProdById = async (req, res) => {
  const pid = req.params.pid;
  try {
    const response = await productService.getById({ _id: pid });
    res.send({ status: 'Success', payload: response });
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
};

export const updateProdById = async (req, res) => {
  const pid = req.params.pid;
  try {
    const { title, description, price, thumbnail, code, stock, available } = req.body;
    if (!title || !description || !price || !thumbnail || !code || !stock || !available) {
      throw CustomError.createError({
        name: 'Missing Data',
        cause: generateProductErrorInfo({ title, description, price, thumbnail, code, stock, available }),
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
    };
    const response = await productService.update({ _id: pid }, data);
    res.send({ status: 'Success', payload: response });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.code, message: error.message });
  }
};

export const deleteProdById = async (req, res) => {
  const pid = req.params.pid;
  try {
      const response = await productService.delete({ _id: pid });
      res.status(200).send({ status: 'Success', payload: response });
  } catch (error) {
      req.logger.error("Error al eliminar el producto con id: " + pid);
      res.status(400).json(error.message);
  }
};

export const deleteProductFromCart = async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  try {
      const cart = await productService.deleteProdInCart({ _id: cid }, { _id: pid });
      if (cart) {
          // Verificar si el producto pertenece a un usuario premium
          const isPremiumUser = req.user.role === 'premium';
          if (isPremiumUser) {
              // Enviar correo al usuario premium indicando que el producto fue eliminado
              // Implementa la función sendProductDeletedEmail
              await sendProductDeletedEmail(req.user.email, pid);
          }

          res.status(200).send({ status: 'Success', payload: cart });
      } else {
          res.status(404).json({ error: 'Carrito o producto no encontrado' });
      }
  } catch (error) {
      req.logger.error('Error al buscar el carrito: ' + cid + "o el producto: " + pid);
      res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
};
