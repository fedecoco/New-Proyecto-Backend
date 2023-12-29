// controllers/email.controller.js

import nodemailer from 'nodemailer';
import { mailSettings } from '../config/nodemailer.config.js';
import { useLogger } from "../config/logger.config.js";

const transport = nodemailer.createTransport(mailSettings);

const postSendEmail = async (req, res) => {
  try {
    // Validar y limpiar datos de entrada si es necesario

    const result = await transport.sendMail({
      from: `Backend Veron <${mailSettings.auth.user}>`,
      to: req.body.to,
      subject: req.body.subject,
      html: req.body.html,
      attachments: []
    });

    // Devolver una respuesta al cliente
    res.status(200).send({
      status: 'Success',
      message: 'Correo electrónico enviado con éxito',
      result: result
    });

  } catch (error) {
    // Registrar el error usando el logger
    const log = useLogger();
    log.error(`${new Date().toLocaleString()}: Error al enviar el correo: ${error}`);

    // Devolver una respuesta de error al cliente
    res.status(500).send({
      status: 'Error',
      message: 'Error al enviar el correo electrónico',
      error: error.message
    });
  }
};

export { postSendEmail };
