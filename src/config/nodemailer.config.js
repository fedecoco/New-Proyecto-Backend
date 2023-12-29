import dotenv from 'dotenv';

dotenv.config();

export const mailSettings = {
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER, // Reemplaza con tu variable de entorno
        pass: process.env.EMAIL_PASSWORD // Reemplaza con tu variable de entorno
    }
};
