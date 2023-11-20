import {ticketService} from "../services/factory.js";



export const createTicket = async(req, res)=>{
    const data = req.body.cartId;
    try {
        const response = await ticketService.create(data);
        if (response === null) {
            // Envía una respuesta de error si el array de productos está vacío
            res.status(400).json({ error: 'No hay productos con stock suficiente para crear el ticket.' });
        } else {
            // Envía una respuesta exitosa con el ticket creado
            res.send({ status: "200", message: "Ticket creado con exito con ID: " + response.id , payload: response}) 
        }
        
        }catch (error) {
            console.error('Error al crear el ticket:', error);
            res.status(500).json({ error: 'Error interno del servidor', details: error.message }); 
        }
    }; 

export const renderTicket = async(req, res)=>{
    const tid = req.params.tid;
    try {
        const ticket =  await ticketService.getTicket(tid);
        if(ticket){
            console.log(ticket);
            res.render('ticket', {ticket:ticket})
/*             res.send({status: "200", message: "Ticket encontrado con exito", payload: {ticket}}) */

        } else {
            res.status(404).json({ error: 'Ticket no encontrado' });
        }
    }catch (error) {
        res.status(500).json({ error: 'Error interno del servidor', details: error.message });
    
    }
}