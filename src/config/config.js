import dotenv from 'dotenv';
import program from '../process.js';
import { Command } from "commander";

const program = new Command();

program
    .option ('-d', "variable de debug", false)
    .option ('-p <PORT>', "variable de puerto", 8080)
    .option ('--mode <mode>', "Modo de trabajo", "dev")
    .option ('-u <user>', 'Usuario que va a utilizar la app', 'No se declaro ningun usuario')
    .option ('--persist <mode>', 'persistencia de datos', 'mongo')
    program.parse();

// TODO: REVISAR -- todo ok

const enviroment = program.opts().mode;
console.log("Modo Opt: ", program.opts().mode);

// const enviroment = 'dev'


// dotenv.config()
dotenv.config({
    path: enviroment === "production" ? "./src/config/.env.production" : "./src/config/.env.development"
})



export default {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URL,
    persistence : program.opts().persist,
    gitHubClientId: process.env.GITHUB_CLIENT_ID,
    gitHubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    gitHubCallbackUrl: process.env.GITHUB_CALLBACK_URL,
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
};