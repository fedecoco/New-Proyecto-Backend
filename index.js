/*import ProductManager from "./src/managers/ProductManager.js";

let productManager = new ProductManager("./files/Products.json");
console.log(productManager);

let persistirProduct = async () => {
  let product = await productManager.addProduct(
    "Botines de futbol",
    "Para pasto",
    30.0,
    "Imagen",
    "CODE1",
    100
  );

  let products = await productManager.getProducts();
  console.log(`Productos encontrados en Product Manager: ${products.length}`);
  console.log(products);

  // Obtener un producto por su ID
  let productById = await productManager.getProductById(product.id);
  if (productById) {
    console.log(`Producto encontrado por ID: ${productById.title}`);
  } else {
    console.log(`No se encontró ningún producto con el ID ${product.id}`);
  }

  // Actualizar un producto
  let updatedFields = {
    title: "Botines de futbol Nike",
    description: "Para pasto",
    price: 40.0,
  };
  await productManager.updateProduct(product.id, updatedFields);

  // Eliminar un producto
  await productManager.deleteProduct(product.id);
};
persistirProduct(); */