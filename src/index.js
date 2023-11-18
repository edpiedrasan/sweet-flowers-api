// /* eslint-disable no-console */
import { url } from "inspector";
import app from "./app";
import config from "./config/config";
const https = require("https");

const { PORT } = config;





//#region Ngrok 
const express = require('express');
const http = require('http');
const appNgrok = express();

const ngrokAuthToken = 'TU_TOKEN_DE_AUTENTICACION_NGROK'; // Reemplaza con tu propio token de autenticación de ngrok
const apiUrl = 'http://127.0.0.1:4040/api/tunnels'; // URL de la API de ngrok para obtener información sobre los túneles
const path = require('path');

const filePathNgrok = '../sweet-flowers-front/src/api/config.json';//path.join(__dirname, 'config.json');
const fs = require('fs');

const { exec } = require('child_process');

//Función para levantar la url de ngrok
const openNgrok = () => {


  const ngrokProcess = exec(`../ngrok start --all`);


  ngrokProcess.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    // Aquí puedes emitir los datos a tu aplicación React utilizando WebSocket, Socket.io, o un servidor HTTP para que la interfaz de React los consuma.
  });

  ngrokProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    // Manejo de errores si hay algún problema con ngrok
  });

  ngrokProcess.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
  });

  console.log("Servicio de Ngrok levantado.");
}

// Función para obtener información sobre los túneles de ngrok
const getNgrokTunnels = () => {
  const options = {
    headers: {
      'Authorization': `Bearer ${ngrokAuthToken}`
    }
  };

  // Realizar la solicitud HTTP a la API de ngrok
  const request = http.get(apiUrl, options, (response) => {
    let rawData = '';
    response.on('data', (chunk) => {
      rawData += chunk;
    });
    response.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        // console.log('Información de los túneles:', parsedData); // Mostrar información de los túneles en la consola

        let apiRoute = parsedData.tunnels.filter(tunnel => tunnel.name == "api")[0].public_url
        let frontRoute = parsedData.tunnels.filter(tunnel => tunnel.name == "front")[0].public_url
        console.log("FRONT", frontRoute);

        sendWhatsAppMessage("60149039", 'Fuera de la casa: ' + frontRoute);
        sendWhatsAppMessage("60149039", 'En de la casa: ' );
        sendWhatsAppMessage("60149039",  getIpAddress()+":3000");


        // console.log("Ruta del API: " + apiRoute);
        modifyJson(apiRoute)


      } catch (error) {
        console.error('Error al procesar la información de los túneles:', error);
      }
    });
  }); 

  request.on('error', (error) => {
    console.error('Error al obtener información de los túneles:', error);
  });
};

let shouldModifyJson = true; // Bandera para controlar si se debe modificar el JSON


// Función para modificar el archivo JSON
const modifyJson = (route) => {

  if (shouldModifyJson) {
    // Leer el archivo JSON
    fs.readFile(filePathNgrok, 'utf8', (err, data) => {
      if (err) {
        console.error('Error al leer el archivo:', err);
        return;
      }

      // Parsear el contenido a un objeto JavaScript
      const jsonData = JSON.parse(data);

      // Modificar el objeto según sea necesario
      jsonData.urlBase = route;

      // Convertir el objeto modificado de vuelta a JSON
      const updatedJson = JSON.stringify(jsonData, null, 2); // El parámetro 'null, 2' es para dar formato con 2 espacios de indentación

      // Escribir en el archivo JSON
      fs.writeFile(filePathNgrok, updatedJson, 'utf8', (err) => {
        if (err) {
          console.error('Error al escribir en el archivo:', err);
          return;
        }
        console.log('URL base del front-end modificado con el siguiente: ' + route);
        console.log(route)
      });

      // Después de modificar el JSON, cambiar la bandera a false para evitar futuras modificaciones
      shouldModifyJson = false;
    });
  }
};


//Función para realizar todo el proceso Ngrok.
const setNgrok = () => {
  // Matar proceso de ngrok si está activo
  exec('pkill ngrok', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al detener ngrok: ${stderr}`);
    }

    //Levantar el servicio de ngrok tunels.
    openNgrok();


    console.log("Esperando 10 segundos para obtener información de los Ngrok tunnels...");
    setTimeout(() => {
      console.log('Estableciendo los Ngrok Tunnels.');
      getNgrokTunnels();
    }, 10000); 

  });

}


//Función para enviar mensajes de WhatsApp através de Twillio.
const sendWhatsAppMessage =(number, message) => {
  const accountSid = 'AC15d6adba7e5e22907b1dc6baa02512cf';
  const authToken = '07e5a0f4e53731ff66c4460c3899748c';
  const client = require('twilio')(accountSid, authToken);

let ms='our appointment is coming up on July 21 at 3PM';

console.log(message)
client.messages
.create({
  body: '' + message,
  from: 'whatsapp:+14155238886',
  to: 'whatsapp:+50660149039'
})
  .then(message => console.log(message.sid))
  .catch(err => console.error(err));
}

const getIpAddress = () => {

  const os = require('os');

// Obtiene todas las interfaces de red
const interfaces = os.networkInterfaces();

// Itera sobre cada interfaz para encontrar la dirección IP no interna (no 127.0.0.1)
let ipAddress = '';
Object.keys(interfaces).forEach((iface) => {
    interfaces[iface].forEach((ifaceDetail) => {
        if (ifaceDetail.family === 'IPv4' && !ifaceDetail.internal) {
            ipAddress = ifaceDetail.address;
        }
    });
});

console.log("ipAddress", ipAddress);

return ipAddress;
}

//#endregion

app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }

    setNgrok();

  console.log(`Application Running on: ${PORT}`);
});



