import documentSystemDB from "../../db/DocumentSystem/documentSystemDB";
import fetch from "node-fetch";
import fs from "fs";
import SendMail from "../../helpers/sendEmail";
import { renderCancellEmail } from "../../helpers/renderContent";
const zip = require("express-zip");

export default class documentSystemController {
  //funcion para extraer las solicitudes de SD con base a los filtros de CardFilters
  async getRows(req, res) {
    try {
      let filters = req.body.filtros;

      // filters["statusSelected"] = filters.statusSelected.value;
      // const {statusSelected, countrySelected} = bdy;
      const rows = await documentSystemDB.getData(
        filters,
        req.teams,
        req.user.PAIS
      );
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
  //funcion para extraer las opciones de los dropdowns
  async getOptions(req, res) {
    try {
      const vendors = await documentSystemDB.getVendors();
      const countries = await documentSystemDB.getCountries();
      const status = await documentSystemDB.getStatus();
      const types = await documentSystemDB.getTypes();

      if (
        !vendors.length &&
        !countries.length &&
        !status.length &&
        !types.length
      ) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          payload: {
            message: "No hay Opciones asignadas.",
          },
        });
      }

      return res.status(200).send({
        status: 200,
        sucess: true,
        payload: {
          message: "se cargo exitosamente.",
          vendors,
          countries,
          status,
          types,
        },
      });
    } catch (error) {
      return res.status(500).send({
        status: 500,
        sucess: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  //Funcion para insertar una nueva solicitud de pedido
  async newRequest(req, res) {
    let form = req.body;
    // //console.log(form.newInfo);
    const user = req.user.EMAIL.split("@")[0];
    const customerName = form.newInfo.customerName
      ? form.newInfo.customerName[0].label
      : "";
    console.log(customerName);
    const documentId = form.newInfo.documentId;
    //validar que la PO no exista en document_system
    const val = await documentSystemDB.getDocumentId(form.newInfo.documentId);
    if (val.length) {
      return res.status(409).send({
        status: 409,
        sucess: false,
        message: "El documento ya se encuentra registrado.",
      });
    } else {
      let jjson;
      try {
        await fetch("https://databot.gbm.net:8085/sap/consume", {
          method: "post",
          body: JSON.stringify({
            system: 300,
            props: {
              program: "ZFI_READ_PO",
              parameters: {
                TIPO_DOC: form.newInfo.documentType,
                ID_DOC: form.newInfo.documentId,
              },
            },
          }),
          headers: { "Content-Type": "application/json" },
        })
          .then((res) => res.json())
          .then((json) => {
            jjson = json;
            switch (json.status) {
              case 200:
                break;
              case 404:
                return res.status(404).send({
                  status: 404,
                  success: false,
                  message: "No se encontró el documento en SAP",
                });
                break;
              case 500:
                res.status(500).send({
                  status: 500,
                  success: false,
                  message: json.payload.response.RETURN,
                });
                break;
            }
          });

        console.log(jjson);
        let response = jjson.payload.response.RESPUESTA;
        //console.log(response);
        if (response == "NA") {
          return res.status(404).send({
            status: 404,
            sucess: false,
            message:
              "La PO no existe en SAP, por favor verifique el ID correcto.",
          });
        } else if (
          response == "error" &&
          form.newInfo.documentType != "PO_PS"
        ) {
          res.status(500).send({
            status: 500,
            success: false,
            message: "No se encontró la SO de la PO.",
            payload: {
              response,
            },
          });
        } else if (
          jjson.payload.response.CUSTOMER_NAME.toString().trim() == "" &&
          form.newInfo.documentType != "PO_PS"
        ) {
          res.status(500).send({
            status: 500,
            success: false,
            message:
              "La PO no tiene cliente asignado, por favor asignarlo en SAP.",
            payload: {
              response,
            },
          });
        } else {
          form["salesOrderOn"] = jjson.payload.response.SO_PAIS;
          form["salesOrderTrad"] = jjson.payload.response.SO_TRADING;
          form["purchReq"] = jjson.payload.response.PURCH_REQ;

          if (form.newInfo.documentType === "PO") {
            form["country"] = jjson.payload.response.COCODE_PAIS;
          } else {
            //SO Offshore
            const userCountry =
              req.user.PAIS === "SV"
                ? "ES"
                : req.user.PAIS === "GT"
                ? "GU"
                : req.user.PAIS === "HN"
                ? "HO"
                : req.user.PAIS === "US"
                ? "MD"
                : req.user.PAIS === "DR"
                ? "DO"
                : req.user.PAIS;
            form["country"] = userCountry;
          }

          form["opp"] = jjson.payload.response.OPP;
          form["quote"] = jjson.payload.response.QUOTE;
          form["customerName"] =
            customerName === ""
              ? jjson.payload.response.CUSTOMER_NAME
              : customerName;

          form["createdBy"] = user;

          console.log(form);
          // const x = new documentSystemController();

          // const insert = x.insertRequest(form);
          const insert = await documentSystemDB.insertNewRequest(form);

          // console.log(insert);

          try {
            if (insert.affectedRows === 0) {
              return res.status(404).send({
                status: 404,
                sucess: false,
                message: "No se pudo insertar.",
              });
            } else {
              if (form.newInfo.vendor) {
                for (const item of form.newInfo.vendor) {
                  await documentSystemDB.insertDocumentVendor(form, item, user);
                  // x.inserDocumentVendor(form, item, user);
                }
              }
              const keysForm = Object.keys(form.newInfo);

              for (const item of keysForm) {
                //console.log(item);
                if (
                  item === "documentId0" ||
                  item === "documentId1" ||
                  item === "documentId2"
                ) {
                  // x.insertDocumentSv(form, form.newInfo[item], user);
                  await documentSystemDB.insertDocumentSv(
                    documentId,
                    form.newInfo[item],
                    user
                  );
                  //console.log("Se inserto: " + form.newInfo[item]);
                }
              }
            }
            return res.status(200).send({
              status: 200,
              sucess: true,
              payload: {
                message: `Se creo una nueva solicitud`,
                insert,
              },
            });
          } catch (err) {
            //console.log("EL error es este", err);
            res.status(500).send({
              status: 500,
              success: false,
              message: err.toString(),
            });
          }
        }
      } catch (error) {
        res.status(500).send({
          status: 500,
          success: false,
          message: error.sqlMessage,
        });
      }
    }
  }
  async insertRequest(bdy) {
    const insert = await documentSystemDB.insertNewRequest(bdy);
    return insert;
  }
  async insertDocumentSv(bdy, item, user) {
    const insert = await documentSystemDB.insertDocumentSv(bdy, item, user);
    return insert;
  }
  async insertDocumentVendor(bdy, item, user) {
    const insert = await documentSystemDB.inserDocumentVendor(bdy, item, user);
    return insert;
  }
  //funcion para actualizar una solicitud de pedido
  async updateRequest(req, res) {
    let updateInfo = req.body.updateInfo;
    const { decoded, user } = req;
    let { documentId } = updateInfo;
    console.log(updateInfo);

    try {
      let { documentTrading, userRequest, cancelledReason, newStatus } =
        updateInfo; //newStatus = el label del status, //userRequest: el solicitante
      delete updateInfo["documentTrading"];
      delete updateInfo["userRequest"];
      delete updateInfo["newStatus"];

      const update = await documentSystemDB.updateDocument(updateInfo, decoded);
      //console.log(update);
      if (update.affectedRows === 0) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          message: "No se actualizó.",
        });
      }

      if (updateInfo["status"] === "RJ" || updateInfo["status"] === "CA") {
        const x = new documentSystemController();
        const sdMail = x.sendCancellMail(
          documentId,
          newStatus,
          userRequest,
          cancelledReason
        );
        console.log(sdMail);
        valTrad = sdMail;
      }

      //valida que haya cambiado
      let valTrad = true;
      if (documentTrading) {
        await documentSystemDB.deleteDocumentTrading(documentId);
        for (const poTrad of documentTrading) {
          const insert = await documentSystemDB.insertDocumentTrading(
            documentId,
            poTrad,
            decoded
          );
          if (insert.affectedRows === 0) {
            valTrad = false;
          }
        }
      }

      if (!valTrad) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          message: "No se actualizó las PO trading.",
        });
      } else {
        return res.status(200).send({
          status: 200,
          sucess: true,
          message: `Se actualizó la solicitud`,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        message: error.sqlMessage,
      });
    }
  }
  //funcion para subir los archivos
  async uploadFile(req, res) {
    try {
      const { documentId } = req.params;
      const { decoded, user } = req;
      const {
        file: { name, data, encoding, mimetype },
      } = req.files;
      const nameNormalize = name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const file = Buffer.from(data, encoding);
      let path = `src/assets/files/DocumentSystem/Request #${documentId}`;
      console.log(documentId);
      console.log(path);
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

      //insert en la DB table
      const reference = await documentSystemDB.newFile(
        {
          nameNormalize,
          encoding,
          mimetype,
          path: `${path}/${nameNormalize}`,
          decoded,
        },
        documentId,
        user.NOMBRE
      );
      //console.log(reference);

      if (reference.affectedRows !== 1) {
        res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: `No se logro guardar en la base de datos el archivo`,
          },
        });
      } else {
        //console.log(reference.insertId);
        res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: "Archivo almacenado exitosamente",
            path,
            idFile: reference.insertId,
          },
        });
      }
    } catch (err) {
      //console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`,
        },
      });
    }
  }
  //funcion para descargar 1 archivo de una solicitud
  async downloadAttachmentByPath(req, res) {
    try {
      const { documentId, fileName } = req.params;

      if (documentId && fileName) {
        const fileNameDecode = Buffer.from(fileName, "base64").toString();
        const documentIdDecode = Buffer.from(documentId, "base64").toString();
        const path = `${
          "src/assets/files/DocumentSystem/Request #" +
          documentIdDecode +
          "/" +
          fileNameDecode
        }`;
        console.log(path);
        if (fs.existsSync(path)) {
          res.download(`${path}`, `${fileNameDecode}`, (err) => {
            if (err) {
              /*
               * Handle error, but keep in mind the response may be partially-sent
               * so check res.headersSent
               */
              //console.log(`Error descargando el archivo adjuntado`);
              //console.log(err);
            } else {
              // decrement a download credit, etc.
              //console.log('Se descargo la plantilla');
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
      //console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`,
        },
      });
    }
  }
  //descargar todos los archivos de una solicitud
  async downloadAllAttachment(req, res) {
    try {
      const { documentId } = req.params;
      if (documentId) {
        const documentIdDecode = Buffer.from(documentId, "base64").toString();

        const allFiles = await documentSystemDB.getAllFilesByDocumentId(
          documentIdDecode
        );

        if (!allFiles.length) {
          return res.status(404).send({
            status: 404,
            sucess: false,
            message: "No hay archivos asociados",
          });
        } else {
          let files = [];
          allFiles.forEach((file) => {
            if (fs.existsSync(file.path)) {
              const fil = {
                path: file.path,
                name: file.name,
              };
              files.push(fil);
            }
          });

          // console.log(files)
          //descargar en .zip
          res.zip(files, `Documentacion_${documentIdDecode}.zip`);
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
      console.log(err);
      res.status(500).send({
        status: 500,
        success: false,
        message: err.sqlMessage,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`,
        },
      });
    }
  }
  //funcion para extraer log de un documento
  async getLog(req, res) {
    try {
      let documentId = req.body.documentId;
      //console.log(documentId);
      const logInfo = await documentSystemDB.getLog(documentId, req.teams);
      if (!logInfo.length) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          payload: {
            message: "No hay Log de Cambios.",
          },
        });
      }

      return res.status(200).send({
        status: 200,
        sucess: true,
        payload: {
          message: "se cargo exitosamente.",
          logInfo,
        },
      });
    } catch (error) {
      return res.status(500).send({
        status: 500,
        sucess: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  //Funcion para extraer los clientes de la base de datos de fabrica de ofertas
  async getCustomers(req, res) {
    try {
      const rows = await documentSystemDB.getCustomers();
      if (!rows.length) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          payload: {
            message: "No hay solicitudes.",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        sucess: true,
        payload: {
          message: "se cargo exitosamente.",
          rows,
        },
      });
    } catch (error) {
      return res.status(500).send({
        status: 500,
        sucess: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  //funcion para eliminar un archivo de la DB cuando se elimina en el basurero
  async deleteFile(req, res) {
    try {
      const bdy = req.body;
      console.log(bdy);
      await documentSystemDB.removeFile(bdy);
      let path = `src/assets/files/DocumentSystem/Request #${bdy.id}/${bdy.name}`;
      fs.unlinkSync;
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
      //eliminar la carpeta si no tiene archivos
      if (
        fs.readdirSync(`src/assets/files/DocumentSystem/Request #${bdy.id}`)
          .length === 0
      ) {
        fs.rmdirSync(`src/assets/files/DocumentSystem/Request #${bdy.id}`, {
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
  //funcion para eliminar toda la carpeta de archivos de una solicitud
  async deleteAllFiles(req, res) {
    try {
      const bdy = req.body;
      await documentSystemDB.removeAllFiles(bdy);

      let path = `src/assets/files/DocumentSystem/Request #${bdy.id}`;
      fs.unlinkSync;
      if (fs.existsSync(path)) {
        fs.rmdirSync(path, { recursive: true, force: true });
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
  //funcion para enviar notificacion cuando se rechaza/cancela una solicitud
  async sendCancellMail(documentId, statusName, userRequest, bsCancell) {
    const estado = statusName === "Cancelled" ? "Cancelación" : "Rechazado";
    const content = renderCancellEmail(
      documentId,
      statusName,
      bsCancell,
      estado
    );
    const subject = `Notificacion de Rechazado - Sistema de Documentos - Doc. Num: ${documentId}`;
    const emailResponse = await SendMail.sendMailHtml(
      content,
      subject,
      null,
      userRequest + "@gbm.net",
      ""
    );
    //taraya@gbm.net
    console.log(emailResponse);
    return emailResponse;
  }
  async getFilesByCustomer(req, res) {
    const { documentId } = req.params;
    try {
      const rows = await documentSystemDB.getFilesByCustomer(documentId);
      if (!rows.length) {
        
        return res.status(404).send({
          status: 404,
          sucess: false,
          payload: {
            message: "No hay solicitudes.",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        sucess: true,
        rows,
        payload: {
          message: "se cargo exitosamente.",
        },
      });
    } catch (error) {
      return res.status(500).send({
        status: 500,
        sucess: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
}
