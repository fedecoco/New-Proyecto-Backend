import mongoose from "mongoose";
import config from "./config.js";



export default class MongoSingleton {
    static #instance;

    constructor() {
        this.#connectMongoDB();
    } 

    static getInstance() {
        if (this.#instance) {
            console.log("La conexión a la base de datos ya existe");
        } else {
            this.#instance = new MongoSingleton();
        }
        return this.#instance;
    }

   #connectMongoDB = async () => {  
        try {
            await mongoose.connect(process.env.MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                w: 1,
            });
            console.log("Conectado con éxito a MongoDB usando Mongoose.");
        } catch (error) {
            console.error("No se pudo conectar a la BD usando Mongoose: " + error);
            process.exit();   
        }
    }
}
