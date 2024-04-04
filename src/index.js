// /* eslint-disable no-console */
import { url } from "inspector";
import app from "./app";
import config from "./config/config";
// import telegramBot from "./helpers/telegram";
import { CLIENT_RENEG_LIMIT } from "tls";
const https = require("https");

/*Telegram*/
const { PORT, telegramBotToken, linkIdTelegram } = config;
const telegramInstance = require('node-telegram-bot-api');

// Create a bot that uses 'polling' to fetch new updates
const telegramBot = new telegramInstance(telegramBotToken, { polling: true });

global.telegramBot = telegramBot

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
const isWindows = process.platform === 'win32';

let msgLink = "";

//Función para levantar la url de ngrok
const openNgrok = () => {


  let ngrokProcess = null;
  if (isWindows) {

    const ngrokPath = path.resolve(__dirname, 'ngrok.exe'); // Ruta absoluta del ejecutable
    ngrokProcess = exec(`"${ngrokPath}" start --all`, { windowsHide: false });

  } else {
    ngrokProcess = exec(`../ngrok start --all`);
  }



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
        let frontLocal = getIpAddress() + ":3000";
        console.log("Front: ", frontRoute);
        console.log("Front local: ", frontRoute);
        console.log("Api: ", apiRoute);

        // send a message to the chat acknowledging receipt of their message
        telegramBot.sendMessage(linkIdTelegram, 'Exterior: ' + frontRoute + '. Interior: ' + frontLocal);

        msgLink = 'Exterior: ' + frontRoute + '. Interior: ' + frontLocal;

        shouldModifyJson = true;
        modifyJson(apiRoute);


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
  } else {
    console.log("NO SE MODIFICO", route)
  }
};


//Función para realizar todo el proceso Ngrok.
const setNgrok = () => {
  // Matar proceso de ngrok si está activo
  const ngrokStopCommand = isWindows ? 'taskkill /F /IM ngrok.exe' : 'pkill ngrok';

  exec(ngrokStopCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al detener ngrok: ${stderr}`);
    }

    //Levantar el servicio de ngrok tunels.
    openNgrok();


    console.log("Waiting 60 seconds...");
    setTimeout(() => {
      console.log('Estableciendo los Ngrok Tunnels.');
      getNgrokTunnels();
    }, 60000);

  });

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


app.listen(PORT, (err) => {
  if (err) {
    return console.log(err);
  }

  modifyJson(`http://${getIpAddress()}:43888`)
  shouldModifyJson = true;
  setNgrok();

  console.log(`Application Running on: ${PORT}`);
});

// app.use((req, res, next) => {
//   req.telegramBot = telegramBot;
//   next();
// });

module.exports.telegramBot = telegramBot;












//Escuchando el chat de telegram.
telegramBot.on('message', (msg) => {
  const chatId = msg.chat.id;
  console.log("msg", msg)

  if (msg.chat.type == "private") {
    if (msg.text == "Id") {
      // send a message to the chat acknowledging receipt of their message
      telegramBot.sendMessage(chatId, 'Su id es: ' + msg.chat.id);
    } else if (msg.text.includes("Hola")) {
      // send a message to the chat acknowledging receipt of their message
      telegramBot.sendMessage(chatId, 'Hola ' + msg.from.first_name + ", he recibido tu mensaje, en un futuro te responderé con lógica.");
    } else if (["Link", "Enlace", "Codigo", "Código"]) {
      telegramBot.sendMessage(chatId, 'Hola ' + msg.from.first_name + ", el link es: " + msgLink);
    }
  }
});






