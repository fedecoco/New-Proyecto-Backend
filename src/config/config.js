import dotenv from 'dotenv';
import { Command } from "commander";

// Configurar el comando
const program = new Command();

program
    .option('-d', "Variable de debug", false)
    .option('-p, --port <PORT>', "Variable de puerto", 9090)
    .option('--mode <mode>', "Modo de trabajo", "dev")
    .option('-u, <user>', 'Usuario que va a utilizar la app', 'No se declaró ningún usuario')
    .option('--persist <mode>', 'Persistencia de datos', 'mongo')
    program.parse();

// Obtener el modo del programa
const environment = program.opts().mode;
console.log("Modo Opt: ", program.opts().mode);
console.log("Persistencia Opt: ", program.opts().persist);
// Cargar variables de entorno
dotenv.config();



// Exportar la configuración
export  default {
    environment: environment,
    port: process.env.PORT,
    mongo_Url: process.env.MONGO_URL,
    persistence: program.opts().persist,
    gitHubClientId: process.env.GITHUB_CLIENT_ID,
    gitHubClientSecret: process.env.GITHUB_CLIENT_SECRET,
    gitHubCallbackUrl: process.env.GITHUB_CALLBACK_URL,
    jwtPrivateKey: process.env.JWT_PRIVATE_KEY,
    gmailUser: process.env.EMAIL_USER,
    gmailPass: process.env.EMAIL_PASSWORD,
};
