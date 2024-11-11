/** WHATSAPP **/
//npm i whatsapp-web.js qrcode-terminal cors express

import express from "express"; 
import qrcode from "qrcode-terminal"; 
import cors from "cors";
const app = express();
import { Client } from "whatsapp-web.js";
const PUERTO = 8080; 

//Middleware
app.use(express.json()); 
app.use(express.urlencoded({extended: true})); 
app.use(cors()); 

//Inicializamos el Cliente de WhatsApp: 

const client = new Client({
    //Configuracion de Puppeteer para controlar el navegador sin una interfaz grafica. 
    puppeteer: {
        headless: true, //Ejecuta el navegador en modo "sin cabeza", es decir, sin mostrar interfaz gráfica. 
    }
})


//Almacenamos la sesión de WhatsApp (solo para autenticación)

let estaAutenticado = false; 

//Generamos el qr de autenticacion y escuchamos eventos. 
//Escuchamos el evento "qr", que se dispara cuando se necesita que el usuario escanee un codigo qr. 

client.on("qr", qr => {
    //Usamos "qrcode-terminal" para generar y mostrar el código QR en la terminal. 
    qrcode.generate(qr, {small: true}); 
})

//Vamos a confirmar que el cliente esta listo para enviar mensajes. 

client.on("ready", () => {
    console.log("Cliente de WhatsApp listo!"); 
    estaAutenticado = true; 
})

//Manejo de errores de autenticacion

client.on("auth_failure", msg => {
    console.log("Error de autenticación: ", msg); 
})

//Inicializamos el cliente: 
client.initialize(); 

//Ruta para enviar un mensaje: 

app.post("/send-message", (req, res) => {
    //Paso 1: Verificamos la autenticación. 
    if(!estaAutenticado) {
        return res.status(401).send({error: "Cliente no autenticado. Por favor, escanea el qr primero"}); 
    }

    //Paso 2: Obtener los datos del cuerpo de la solicitud
    const { numeroDestino, mensajeDestino } = req.body; 

    //Paso 3: Formatear el ID del Chat
    //WhatsApp Web usa un formato especial para los ID del Chat. El numero de telefono debe tener un sufico "@c.us". 
    //Asi que formateamos el numerito recibido para crear el ID del chat. 
    const chatId = `${numeroDestino}@c.us`; //Aca nos quedaria el formato correcto. 

    //Paso 4: Enviar el mensaje a traves de WhatsApp Web
    //Usamos el método "sendMenssage" de la libreria para enviar el mensaje al numero: 
    client.sendMessage(chatId, mensajeDestino)
        .then(response => {
            res.json({success: true, response})
        })
        .catch(error => {
            console.log("Tenemos un error al enviar el mensaje: ", error); 
            res.status(500).json({error: "No se pudo enviar el mensaje. "})
        })
})



app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto: ${PUERTO}`);
})