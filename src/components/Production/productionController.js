import masterDataDB from "../../db/Production/productionDB.js";
import fetch from "node-fetch";
import fs from "fs";

import SendMail from "../../helpers/sendEmail.js";
import sendWhatsAppMessage from "../../helpers/sendWhatsAppMessage.js";
// import telegram from "../../helpers/telegram.js";

import index from "../../index.js";

import config from "../../config/config.js";

import { renderCandidateEmail } from "../../helpers/renderContent.js";

const zip = require("express-zip");

// Importar la instancia de telegramBot desde index.js
const { telegramBot } = require('../../index');

export default class productionController {


  //funcion insertar nuevo dato maestro
  async registerProductionProducts(req, res) {
    const { newInfo, user, land } = req.body

    //Función para ordenar productos por letra.
    const orderProductsByLetter = (data) => {

      let result = data.sort((a, b) => {
        // Extraer la letra antes del '/' de los labels
        const getLabelType = label => {
          const match = label.match(/([A-Z])\//);
          return match ? match[1] : '';
        };

        // Asignar un valor numérico a cada tipo (A, M, P)
        const getTypeValue = type => {
          switch (type) {
            case 'A': return 1;
            case 'M': return 2;
            case 'P': return 3;
            default: return 4; // Manejar otros casos si es necesario
          }
        };

        const typeA = getTypeValue(getLabelType(a.nameProduct));
        const typeB = getTypeValue(getLabelType(b.nameProduct));

        // Comparar los valores asignados y ordenar en consecuencia
        return typeA - typeB;
      });

      return result;
    }
    // console.log(req.body)

    console.log("EL REQ", req);

    try {
      //console.log(req);
      const day = await masterDataDB.dayProductionRegisterDB(newInfo, user, land);

      console.log(day)

      const production = await masterDataDB.registerProductionProductsDB(newInfo, user, day.insertId);

      // console.log("TEMPNEWINFO ANTES", newInfo)
      //#region Notificar por WhatsApp la Producción
      let tempNewInfo = { ...newInfo };

      delete tempNewInfo.modalItems
      delete tempNewInfo.productionDate

      // console.log("TEMPNEWINFODESPUES", tempNewInfo)

      let message = `
      **Reporte de Producción**

Variedad       `;


      let keys = Object.keys(tempNewInfo)

      let quantity = 0;

      keys.map(key => {
        if (newInfo[key]) {
          message += `
            ${key}:    ${newInfo[key]}  `
        }


        if (!isNaN(parseInt(newInfo[key]))) {
          quantity += parseInt(newInfo[key]);
        }
      })

      message += `

Total: ${quantity} paquetes.          

------------------------------

**Reporte de Inventario**

Variedad       `;
      const stock = await masterDataDB.getStock();
      //Función para ordenar productos por letra.
      console.log("STOCK", stock)
      quantity = 0
      orderProductsByLetter(stock).map(product => {
        if (product.stock!=0) {
          message += `
            ${product.nameProduct}:    ${product.stock}  `
        }

        quantity += parseInt(product.stock);

      })

      message += `

Total: ${quantity} paquetes. 


Creado por: ${user}`

      // const cellphones = await masterDataDB.getCellphonesNumber();
      // cellphones.map(phone => {

      //   sendWhatsAppMessage.sendMessage(message, phone.cellphone)
      //   console.log(phone.cellphone)
      // })

      // console.log("MESSAGE", message)

      global.telegramBot.sendMessage(config.productionIdTelegram, message)

      // sendWhatsAppMessage.sendMessage(message, '85465958')


      //#endregion

      // if (!rows.length) {
      //   return res.status(404).send({
      //     status: 404,
      //     sucess: false,
      //     message: "No hay solicitudes.",
      //   });
      // }

      return res.status(200).send({
        status: 200,
        sucess: true,
        message: "Exito",
        payload: {
          message: "Producción registrada con éxito",
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        sucess: false,
        message: error.sqlMessage,
      });
    }
  }

  //funcion insertar nuevo dato maestro
  async newMasterData(req, res) {
    const { type, newInfo, form, user } = req.body
    console.log(req.body)

    try {
      //console.log(req);

      const rows = await masterDataDB.newMasterDataDB(type, newInfo, form, user);

      if (rows.affectedRows > 0) {
        if (form === 'clients') {
          const contact = await masterDataDB.newContactOfMasterDataDB(type, rows.insertId, newInfo, form, user);

        }

      }

      console.log(rows)

      // if (!rows.length) {
      //   return res.status(404).send({
      //     status: 404,
      //     sucess: false,
      //     message: "No hay solicitudes.",
      //   });
      // }

      return res.status(200).send({
        status: 200,
        sucess: true,
        message: "Dato maestro creado con éxito",
        payload: {
          message: "Dato maestro creado con éxito",
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        sucess: false,
        message: error.sqlMessage,
      });
    }
  }










  //funcion para extraer los dropdowns de todos los forms ee masterData
  async getOptions(req, res) {
    try {
      let masterData = await masterDataDB.getMasterData();
      masterData = masterData[0][0];
      const keysForm = Object.keys(masterData);
      for (const item of keysForm) {
        const jvalue = JSON.parse(masterData[item]);
        masterData[item] = jvalue;
      }
      console.log(masterData);
      if (
        !masterData
      ) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          payload: {
            message: "No hay Opciones asignadas.",
          },
        });
      }

      //console.log(masterData)

      return res.status(200).send({
        status: 200,
        sucess: true,
        payload: {
          message: "se cargo exitosamente.",
          masterData
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        sucess: false,
        payload: {
          message: error.sqlMessage,
        },
      });
    }
  }
  //funcion para extraer todas las gestiones de DM en S&S
  async getRowsRequestsTable(req, res) {
    console.log(req.body)

    try {
      console.log(req);
      const { decoded } = req;
      const rows = await masterDataDB.getDataRequestTable(
        req.body.teams,
        req.body.user
      );

      //console.log(rows)

      if (!rows.length) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          message: "No hay solicitudes.",
        });
      }

      return res.status(200).send({
        status: 200,
        sucess: true,
        message: "se cargo exitosamente.",
        payload: {
          message: "se cargo exitosamente.",
          rows,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        sucess: false,
        message: error.sqlMessage,
      });
    }
  }

  async getLinealAndMasiveRequest(req, res) {
    try {
      const { dataType, requestId, typeOfManagementId } = req.body;


      const dataTypeDecoded = Buffer.from(dataType, "base64").toString();
      const requestIdDecoded = Buffer.from(requestId, "base64").toString();
      const typeOfManagementIdDecoded = Buffer.from(typeOfManagementId, "base64").toString();

      // console.log(dataTypeDecoded)      
      // console.log(requestIdDecoded)
      // console.log(typeOfManagementIdDecoded)


      let rows = ""
      try {
        rows = await masterDataDB.getLinealRequestDB(dataTypeDecoded, requestIdDecoded, typeOfManagementIdDecoded);
      } catch (e) { console.log(e) }

      const documentsNames = await masterDataDB.getNamesDocumentsRequestsDB(requestIdDecoded);


      console.log(rows)
      console.log(documentsNames)


      return res.status(200).send({
        status: 200,
        sucess: true,
        message: "se cargo exitosamente.",
        payload: {
          message: "se cargo exitosamente.",
          rows,
          documentsNames
        },
      });

    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrió un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`,
        },
      });
    }
  }




  //funcion para descargar el Documento de una solicitud por nombre
  async downloadDocumentByName(req, res) {
    try {
      const { idGestion, nameFile } = req.params;

      if (idGestion && nameFile) {
        const idGestionDecoded = Buffer.from(idGestion, "base64").toString();
        const nameFileDecoded = Buffer.from(nameFile, "base64").toString();
        console.log(idGestionDecoded + nameFileDecoded)


        const path = `src/assets/files/MasterData/${idGestionDecoded}/${nameFileDecoded}`;

        console.log(path);
        if (fs.existsSync(path)) {
          res.download(`${path}`, `${nameFileDecoded}`, (err) => {
            if (err) {

            } else {
            }
          });
        } else {
          return res.status(422).send({
            status: 422,
            success: false,
            payload: {
              message: "El archivo no existe en el servidor",
            },
          });
        }
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!",
          },
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`,
        },
      });
    }
  }



  //funcion para extraer todas las gestiones de DM en S&S
  async getRowsApprovalsRequestsTable(req, res) {
    //console.log(req.body)



    try {
      //sendWebexMsg("dmeza@gbm.net")
      console.log(req);
      const { decoded } = req;
      const rows = await masterDataDB.getDataApprovalsTable(
        req.body.teams,
        req.body.user
      );

      //console.log(rows)

      if (!rows.length) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          message: "No hay solicitudes.",
        });
      }

      return res.status(200).send({
        status: 200,
        sucess: true,
        message: "se cargo exitosamente.",
        payload: {
          message: "se cargo exitosamente.",
          rows,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        sucess: false,
        message: error.sqlMessage,
      });
    }









  }




  //función para aprobar o rechazar solicitud además de actualizar su información de ser necesario
  async approvalRejectRequest(req, res) {

    //#region Funciones de ApprovalRejectRequest
    const setStateApproval = (reqGeneralInfo, newInfo) => {

      //debugger;
      let stateApproval = ""
      let { Formulario, Estado, statusId, countryClient, valueTeamKey, subjectVatCode, channelCode } = reqGeneralInfo;

      let { sendingCountry, valueTeam, subjectVat, channel } = newInfo.info;

      console.log(Formulario)
      console.log(statusId)

      if (Formulario === "Clientes") {



        sendingCountry = sendingCountry.label.split(" -")[0]; //001 - GBMCR
        valueTeam = valueTeam.label.split(" -")[0];
        subjectVat = subjectVat.label.split(" -")[0];
        channel = channel.label.split(" -")[0];

        console.log(sendingCountry);
        console.log(valueTeam);
        console.log(subjectVat);
        console.log(channel);



        if (/*Estado*/statusId === 8/*"APROBACION FACTURACION"*/) {

          if (sendingCountry.includes("LC") || /*salesGroup*/valueTeam !== "002") { //Pais incluye LatCapital o es diferente 002- GBM Direct
            stateApproval = 13/*"APROBACION GERENTE VENTAS"*/
          }
          else if (subjectVat === "S" && channel !== "04") {
            stateApproval = 2 /*"EN PROCESO"*/
          }
          else if (subjectVat === "N") {
            stateApproval = 9/*"APROBACION CONTROLLER"*/
          }
          else if (channel === "04") {
            stateApproval = 10/*"APROBACION PRICE LIST"*/
          }
          else {
            stateApproval = 2/*"EN PROCESO"*/
          }

        } else {

          //Estado de Gerente de ventas
          if (/*Estado*/statusId === 13/* "APROBACION GERENTE VENTAS"*/ && subjectVat == "S") {
            stateApproval = 2/*"EN PROCESO"*/;
          } else if (/*Estado*/statusId === 13/*"APROBACION GERENTE VENTAS"*/ && subjectVat === "N") {
            stateApproval = 9/*"APROBACION CONTROLLER"*/;
          }
          else {
            stateApproval = 2/*"EN PROCESO"*/;
          }

          //Estado de controller
          if (/*Estado*/statusId === 9/*"APROBACION CONTROLLER"*/ && channel != "04") {
            stateApproval = 2/*"EN PROCESO"*/;
          } else if (/*Estado*/statusId === 9/*"APROBACION CONTROLLER"*/ && channel === "04") {
            stateApproval = 10/*"APROBACION PRICE LIST"*/;
          }

          //Estado de Price List
          if (/*Estado*/statusId === 10/*"APROBACION PRICE LIST"*/) {
            stateApproval = 2 /*"EN PROCESO"*/;
          }

        }
      } else {
        stateApproval = 2/*"EN PROCESO"*/; //materiales, repuestos, servicios, materiales de servicios
      }

      if (Formulario == 'Proveedores') {

        if (/*Estado*/statusId === 7/*"APROBACION GESTORES"*/) {
          stateApproval = 2/*"EN PROCESO"*/;
        }

        if (/*Estado*/statusId === 6/*"APROBACION CONTADORES"*/) {
          stateApproval = 7/*"APROBACION GESTORES"*/;
        }

      }

      if (Formulario == 'Garantías' || Formulario == 'Equipos') {
        if (/*Estado*/statusId === 11/*"APROBACION SALES ADMIN"*/) {
          stateApproval = 2/*"EN PROCESO"*/;
        }

      }

      return stateApproval;



    }

    const setStateApproval3 = (reqGeneralInfo) => {

      //debugger;
      let stateApproval = ""
      let { Formulario, Estado, statusId, countryClient, valueTeamKey, subjectVatCode, channelCode } = reqGeneralInfo;

      if (Formulario === "Clientes") {
        if (/*Estado*/statusId === 8/*"APROBACION FACTURACION"*/) {

          if (countryClient.includes("LC") ||  /*(salesGroup)*/ valueTeamKey !== "002") { //Pais incluye LatCapital y es diferente 002- GBM Direct
            stateApproval = 13/*"APROBACION GERENTE VENTAS"*/
          }
          else if (subjectVatCode === "S" && channelCode !== "04") {
            stateApproval = 2 /*"EN PROCESO"*/
          }
          else if (subjectVatCode === "N") {
            stateApproval = 9/*"APROBACION CONTROLLER"*/
          }
          else if (channelCode === "04") {
            stateApproval = 10/*"APROBACION PRICE LIST"*/
          }
          else {
            stateApproval = 2/*"EN PROCESO"*/
          }

        } else {

          //Estado de Gerente de ventas
          if (/*Estado*/statusId === 13/* "APROBACION GERENTE VENTAS"*/ && subjectVatCode == "S") {
            stateApproval = 2/*"EN PROCESO"*/;
          } else if (/*Estado*/statusId === 13/*"APROBACION GERENTE VENTAS"*/ && subjectVatCode === "N") {
            stateApproval = 9/*"APROBACION CONTROLLER"*/;
          }
          else {
            stateApproval = 2/*"EN PROCESO"*/;
          }

          //Estado de controller
          if (/*Estado*/statusId === 9/*"APROBACION CONTROLLER"*/ && channelCode != "04") {
            stateApproval = 2/*"EN PROCESO"*/;
          } else if (/*Estado*/statusId === 9/*"APROBACION CONTROLLER"*/ && channelCode === "04") {
            stateApproval = 10/*"APROBACION PRICE LIST"*/;
          }
          else {
            //stateApproval = "EN PROCESO";
          }

          //Estado de Price List
          if (/*Estado*/statusId === 10/*"APROBACION PRICE LIST"*/) {
            stateApproval = 2 /*"EN PROCESO"*/;
          }
          else {
            //stateApproval = "EN PROCESO";
          }

        }
      } else {
        stateApproval = 2/*"EN PROCESO"*/; //materiales, repuestos, servicios, materiales de servicios
      }

      if (Formulario == 'Proveedores') {

        if (/*Estado*/statusId === 7/*"APROBACION GESTORES"*/) {
          stateApproval = 2/*"EN PROCESO"*/;
        }

        if (/*Estado*/statusId === 6/*"APROBACION CONTADORES"*/) {
          stateApproval = 7/*"APROBACION GESTORES"*/;
        }

      }

      if (Formulario == 'Garantías' || Formulario == 'Equipos') {
        if (/*Estado*/statusId === 11/*"APROBACION SALES ADMIN"*/) {
          stateApproval = 2/*"EN PROCESO"*/;
        }

      }

      return stateApproval;



    }

    const setStateApproval2 = (reqGeneralInfo) => {

      //debugger;
      let stateApproval = ""
      let { Formulario, Estado, countryClient, valueTeamKey, subjectVatCode, channelCode } = reqGeneralInfo;

      if (Formulario === "Clientes") {
        if (Estado === "APROBACION FACTURACION") {

          if (countryClient.includes("LC") ||  /*(salesGroup)*/ valueTeamKey !== "002") { //Pais incluye LatCapital y es diferente 002- GBM Direct
            stateApproval = "APROBACION GERENTE VENTAS"
          }
          else if (subjectVatCode === "S" && channelCode !== "04") {
            stateApproval = "EN PROCESO"
          }
          else if (subjectVatCode === "N") {
            stateApproval = "APROBACION CONTROLLER"
          }
          else if (channelCode === "04") {
            stateApproval = "APROBACION PRICE LIST"
          }
          else {
            stateApproval = "EN PROCESO"
          }

        } else {

          //Estado de Gerente de ventas
          if (Estado === "APROBACION GERENTE VENTAS" && subjectVatCode == "S") {
            stateApproval = "EN PROCESO";
          } else if (Estado === "APROBACION GERENTE VENTAS" && subjectVatCode === "N") {
            stateApproval = "APROBACION CONTROLLER";
          }
          else {
            stateApproval = "EN PROCESO";
          }

          //Estado de controller
          if (Estado === "APROBACION CONTROLLER" && channelCode != "04") {
            stateApproval = "EN PROCESO";
          } else if (Estado === "APROBACION CONTROLLER" && channelCode === "04") {
            stateApproval = "APROBACION PRICE LIST";
          }
          else {
            //stateApproval = "EN PROCESO";
          }

          //Estado de Price List
          if (Estado === "APROBACION PRICE LIST") {
            stateApproval = "EN PROCESO";
          }
          else {
            //stateApproval = "EN PROCESO";
          }

        }
      } else {
        stateApproval = "EN PROCESO"; //materiales, repuestos, servicios, materiales de servicios
      }

      if (Formulario == 'Proveedores') {

        if (Estado === "APROBACION GESTORES") {
          stateApproval = "EN PROCESO";
        }

        if (Estado === "APROBACION CONTADORES") {
          stateApproval = "APROBACION GESTORES";
        }

      }

      if (Formulario == 'Garantías' || Formulario == 'Equipos') {
        if (Estado === "APROBACION SALES ADMIN") {
          stateApproval = "EN PROCESO";
        }

      }

      return stateApproval;



    }

    //Enviar mensaje por Webex.
    function sendWebexMsg(reqGeneralInfo, sender, msg) {

      let d = new Date();

      let dateNowFormat = [d.getMonth() + 1, d.getDate(), d.getFullYear()].join('/') + ' ' + [d.getHours(), d.getMinutes(), d.getSeconds()].join(':');


      //#region Plantillas JSON


      let jsonCardStyle = [
        {
          "contentType": "application/vnd.microsoft.card.adaptive",
          "content": {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.0",
            "body": [
              {
                "type": "ColumnSet",
                "columns": [
                  {
                    "type": "Column",
                    "items": [
                      {
                        "type": "Image",
                        "style": "Person",
                        "url": "https://scontent.fsjo7-1.fna.fbcdn.net/v/t1.0-9/99109328_10207263323777217_132984462500691968_n.jpg?_nc_cat=100&_nc_sid=0debeb&_nc_ohc=1kv2Cv5_hP4AX9BqyHo&_nc_ht=scontent.fsjo7-1.fna&oh=66bdebc1745b91f9c0e9c445f034c475&oe=5EEDED63",
                        "size": "Medium",
                        "height": "50px"
                      }
                    ],
                    "width": "auto"
                  },
                  {
                    "type": "Column",
                    "items": [
                      {
                        "type": "TextBlock",
                        "text": "Application Management",
                        "weight": "Lighter",
                        "color": "Accent"
                      },
                      {
                        "type": "TextBlock",
                        "weight": "Bolder",
                        "text": `Notificacion de gestión ${reqGeneralInfo.Gestion}`,
                        "horizontalAlignment": "Left",
                        "wrap": true,
                        "color": "Light",
                        "size": "Large",
                        "spacing": "Small"
                      }
                    ],
                    "width": "stretch"
                  }
                ]
              },
              {
                "type": "ColumnSet",
                "columns": [
                  {
                    "type": "Column",
                    "width": 35,
                    "items": [
                      {
                        "type": "TextBlock",
                        "text": "Fecha: ",
                        "color": "Light"
                      },
                      {
                        "type": "TextBlock",
                        "text": `Dato maestro: `,
                        "weight": "Lighter",
                        "color": "Light",
                        "spacing": "Medium"
                      },
                      {
                        "type": "TextBlock",
                        "text": "Tipo gestión: ",
                        "weight": "Lighter",
                        "color": "Light",
                        "spacing": "Medium"
                      },
                      {
                        "type": "TextBlock",
                        "text": "Grupo de artículo: ", //FACTOR
                        "weight": "Lighter",
                        "color": "Light",
                        "spacing": "Medium"
                      }
                    ]
                  },
                  {
                    "type": "Column",
                    "width": 65,
                    "items": [
                      {
                        "type": "TextBlock",
                        "text": `${dateNowFormat}`,
                        "color": "Light"
                      },
                      {
                        "type": "TextBlock",
                        "text": `${reqGeneralInfo.Formulario}`,
                        "color": "Light",
                        "weight": "Lighter",
                        "spacing": "Medium"
                      },
                      {
                        "type": "TextBlock",
                        "text": `${reqGeneralInfo.typeOfManagementSingle}`,
                        "weight": "Lighter",
                        "color": "Light",
                        "spacing": "Medium"
                      },
                      {
                        "type": "TextBlock",
                        "text": `${reqGeneralInfo.Factor}`,
                        "weight": "Lighter",
                        "color": "Light",
                        "spacing": "Medium"
                      }
                    ]
                  }
                ],
                "spacing": "Padding",
                "horizontalAlignment": "Center"
              },
              {
                "type": "TextBlock",
                "text": msg,
                "wrap": true
              },

              {
                "type": "TextBlock",
                "text": sender + "gbm.net",
                "wrap": true
              },
            ],
            "actions": [
              {
                "type": "Action.OpenUrl",
                "title": "Ir a mis gestiones",
                "url": "https://smartsimple.gbm.net/",

              }
            ],
            "horizontalAlignment": "Left",
            "spacing": "None"
          }
        }
      ];
      //#endregion



      try {
        fetch("https://webexapis.com/v1/messages", {
          method: "POST",
          //https://developer.webex.com/docs/api/v1/messages/create-a-message
          body: JSON.stringify({
            // "roomId" : "Y2lzY29zcGFyazovL3VzL1JPT00vNDk4MjM4NzAtMzFiMy0xMWViLTk3ZjAtYzVjODdmZTg4ZjE3",
            "toPersonEmail": "dmeza@gbm.net",//info.toPersonEmail.toString().toLowerCase(), 
            "text": "Solicitud Pendiente",
            "markdown": "",
            "attachments": jsonCardStyle


          }),
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer NzZhNDE5MzQtMTNkMS00M2Q4LThjNWMtNzg5MTBjOTU1YTM1NjU4OTNmOWQtOGE0_PF84_a91d9855-d761-4b0a-a9e5-7d2345410a6d"
          },
        })
          .then((res) => {
            res.json()
            console.log(res)
          }
          )
      } catch (error) {
        console.log(error);
      }

    };

    //#endregion



    try {

      let newInfo = req.body.newInfo
      let itemsLinealToDelete = req.body.itemsLinealToDelete
      let reqGeneralInfo = req.body.reqGeneralInfo
      let filesListDocumentation = req.body.filesListDocumentation
      let filesListCorrections = req.body.filesListCorrections
      let user = req.body.user
      let commentApproval = req.body.commentApproval//[]
      let commentApprovalSingle = req.body.commentApprovalSingle


      let stateApproval = ""
      //req.body.action === "APROBAR" ? (stateApproval = setStateApproval(reqGeneralInfo)) : stateApproval = "RECHAZADO"
      req.body.action === "APROBAR" ? (stateApproval = setStateApproval(reqGeneralInfo, newInfo)) : stateApproval = 5 /*"RECHAZADO"*/

      if (stateApproval === 2 /*"EN PROCESO"*/) { //Notificación al usuario creador de aprobación.
        let msg = `Estimado(a) se le informa que la gestión ha sido aprobada por: ${user}, se encuentra en cola de proceso y pronto será atendida.`
        sendWebexMsg(reqGeneralInfo, reqGeneralInfo.createdBy, msg)
      }

      else if (stateApproval === 5 /*"RECHAZADO"*/) { //Notificación al usuario creador de rechazo.
        let msg = `Estimado(a) se le informa que la gestión ha sido rechazada por: ${user}, el motivo de rechazo es: ${commentApprovalSingle}.`
        sendWebexMsg(reqGeneralInfo, reqGeneralInfo.createdBy, msg)
      }
      //Notificación a los usuarios con acceso al siguiente estado y factor de que se está a la espera de su aprobación
      // else if (/*stateApproval.includes("APROBACION")*/
      //   stateApproval === 1 || stateApproval === 6 ||
      //   stateApproval === 7 || stateApproval === 8 ||
      //   stateApproval === 9 || stateApproval === 10||
      //   stateApproval === 11|| stateApproval === 13) 
      else {
        const nextUsers = await masterDataDB.getUsersAccessNextState(stateApproval, reqGeneralInfo.factorId);
        let msg = `Estimado(a) se le informa que la gestión se encuentra en espera de su aprobación.`

        nextUsers.map(userApproval => {
          sendWebexMsg(reqGeneralInfo, userApproval.user, msg)
        })

        console.log(nextUsers)

      }



      console.log(newInfo)
      // console.log(itemsLinealToDelete)
      console.log(reqGeneralInfo)
      // console.log(filesListDocumentation)
      //console.log(filesListCorrections)
      console.log("Estado: " + stateApproval)

      const updateMasterData = await masterDataDB.updateMasterDataRequest(newInfo, reqGeneralInfo, commentApproval, stateApproval, user);

      if (newInfo.updateInfo === true) {
        console.log("Se actualiza información")
        const updateGenData = await masterDataDB.updateGeneralDataRequest(newInfo, reqGeneralInfo);
      }

      if (itemsLinealToDelete.length > 0) {
        console.log("Se eliminan líneas")
        const deleteLinealItems = await masterDataDB.deleteLinealItems(reqGeneralInfo, itemsLinealToDelete);
      }

      if (filesListDocumentation.fileList.length > 0) {
        console.log("Se sube documentación de aprobaciones: filesListDocumentation")
        const updateNamesDocumentsUploads = await masterDataDB.updateNamesDocumentsUploads(2, filesListDocumentation, reqGeneralInfo, user);
      }

      if (filesListCorrections.fileList.length > 0) {
        console.log("Se sube documentación de correcciones: filesListCorrections")
        const updateNamesDocumentsUploads = await masterDataDB.updateNamesDocumentsUploads(3, filesListCorrections, reqGeneralInfo, user);
      }

      const nameStateById = await masterDataDB.getNameStateById(stateApproval);




      return res.status(200).send({
        status: 200,
        sucess: true,
        payload: {
          message: `Gestión realizada con éxito`,
          state: nameStateById
        },
      });



    } catch (error) {

      console.log(error);

      res.status(500).send({
        status: 500,
        success: false,
        message: "Ocurrió un error: " + error.sqlMessage.toString() + " . SQL=" + error.sql.toString(),

      });


    }
  }





  //funcion para subir los archivos
  async uploadFile(req, res) {
    try {

      const { gestion } = req.params;
      console.log(gestion)

      const {
        file: { name, data, encoding, mimetype },
      } = req.files;

      const nameNormalize = name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const file = Buffer.from(data, encoding);
      console.log(file)

      let path = `src/assets/files/MasterData/${gestion}`;
      console.log(path);

      //Si la carpeta no existe
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }

      fs.writeFileSync(`${path}/${nameNormalize}`, file, (err) => {
        if (err) {
          res.status(409).send({
            status: 409,
            success: false,
            payload: {
              message: `No se logro almacenar en el servidor de datos el archivo`,
            },
          });
        }
        //console.log(`Archivo ${nameNormalize} guardado con exito`);
      });



      res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "Archivo almacenado exitosamente",
        },
      });

    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`,
        },
      });

    }

  }

  //funcion para eliminar un archivo de la DB cuando se elimina en el basurero
  async deleteFile(req, res) {
    try {
      const body = req.body;
      console.log(body);


      let path = `src/assets/files/MasterData/${body.gestion}/${body.name}`;
      console.log(path)

      fs.unlinkSync;
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }


      //eliminar la carpeta si no tiene archivos
      if (
        fs.readdirSync(`src/assets/files/MasterData/${body.gestion}`)
          .length === 0
      ) {
        fs.rmdirSync(`src/assets/files/MasterData/${body.gestion}`, {
          recursive: true,
          force: true,
        });
      }

      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "Archivo eliminado.",
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.sqlMessage.toString(),
        },
      });
    }
  }


}