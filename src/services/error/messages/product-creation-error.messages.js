export const generateProductErrorInfo = (product) =>{
    console.log(product);
    return `Uno o mas de las propiedades fueron enviadas incompletas o no son validas.
        Las propiedades requeridas son:
        - title: type String, recibido: ${product.title}
        - description: type String, recibido: ${product.description}
        - price: type Number, recibido: ${product.price}
        - thumbnail: type String, recibido: ${product.thumbnail}
        - code: type String, recibido: ${product.code}
        - stock: type Number, recibido: ${product.stock}
        - available: type Boolean, recibido: ${product.available}`;
}