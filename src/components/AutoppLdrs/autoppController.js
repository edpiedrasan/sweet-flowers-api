import autoppLdrsDB from "../../db/AutoppLdrs/autoppLdrsDB.js";
import fetch from "node-fetch";
import fs from "fs";

import SendMail from "../../helpers/sendEmail";
import { renderCandidateEmail } from "../../helpers/renderContent";

const zip = require("express-zip");

export default class autoppController {

  //funcion para extraer los dropdowns de todos los forms excepto LDRs
  async getOptions(req, res) {
    try {
      let masterData = await autoppLdrsDB.getMasterData();
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
      // masterData["employees"] = await autoppLdrsDB.getEmployeeMIS();
      masterData["salesOrganizations"] = await autoppLdrsDB.getSalesOrganizations();
      masterData["servicesOrganizations"] = await autoppLdrsDB.getServicesOrganizations();
      //masterData["costumers"] = await autoppLdrsDB.getCostumers();

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
  } //Collaboration, Networking SDN, Storage and Tapes, Toshiba, Servidores Lenovo, Servidores Power / SW Subscription

  //funcion para extraer la data de LDRs
  async getLDRDropdowns(req, res) {
    try {
      let LDRData = await autoppLdrsDB.getLDRFormsData();
      LDRData = LDRData[0][0];
      const keysForm = Object.keys(LDRData);
      for (const item of keysForm) {
        const jvalue = JSON.parse(LDRData[item]);
        LDRData[item] = jvalue;
      }
      //console.log(masterData);
      if (
        !LDRData
      ) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          payload: {
            message: "No hay Data para LDRS asignadas.",
          },
        });
      }

      //console.log(LDRData)

      return res.status(200).send({
        status: 200,
        sucess: true,
        payload: {
          message: "se cargo exitosamente.",
          LDRData
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

  //funcion para extraer los costumers
  async getCostumers(req, res) {
    ///console.log('aqui')
    try {
      let costumers = await autoppLdrsDB.getCostumers();
      if (
        !costumers
      ) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          payload: {
            message: "No hay Opciones asignadas.",
          },
        });
      }

      //console.log(costumers)

      return res.status(200).send({
        status: 200,
        sucess: true,
        payload: {
          message: "se cargo exitosamente.",
          costumers
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

  //funcion para extraer los employees de GBM
  async getEmployees(req, res) {
    try {
      let employees = await autoppLdrsDB.getEmployeeMIS();
      if (
        !employees
      ) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          payload: {
            message: "No hay Opciones asignadas.",
          },
        });
      }

      //console.log(employees)

      return res.status(200).send({
        status: 200,
        sucess: true,
        payload: {
          message: "se cargo exitosamente.",
          employees
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

  //función para extraer contacts del client de sap
  async getContacts(req, res) {
    let bdy = req.body;
    let idCustomer = "";
    if (Number.isInteger(bdy.info)) {
      idCustomer = `00${bdy.info}`;
    } else if (bdy.info[0] != 0) {
      idCustomer = `00${bdy.info}`;
    } else {
      idCustomer = `${bdy.info}`;
    }

    console.log(idCustomer);
    try {
      fetch("https://databot.gbm.net:8085/sap/consume", {
        method: "post",
        crossDomain: true,
        body: JSON.stringify({
          system: 500,
          props: {
            program: "ZDM_GET_CONTACTS",
            parameters: {
              IDCUSTOMER: idCustomer,
            },
          },
        }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((json) => {
          let response = null;
          switch (json.status) {
            case 200:
              response = json.payload.response.CONTACTS;
              return res.status(200).send({
                status: 200,
                success: true,
                payload: {
                  response,
                  message: "Contactos extraidos correctamente",
                },
              });

            case 404:
              return res.status(404).send({
                status: 404,
                success: false,
                payload: {
                  message: "No hay contactos asignados a este cliente.",
                },
              });
            case 500:
              res.status(500).send({
                status: 500,
                success: false,
                payload: {
                  message: json.payload.message,
                },
              });
              break;
          }
        });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }



  //función para insertar nueva oportunidad
  async newRequest(req, res) {
    let id = "";

    try {

      let form = req.body.info
      let fileListBOM = req.body.fileListBOM
      let temporalFolderFilesId = req.body.temporalFolderFilesId

      console.log(form)
      console.log(fileListBOM.fileList.length)

      const insertGeneral = await autoppLdrsDB.insertGeneralInfo(form);
      console.log(insertGeneral)

      id = insertGeneral.insertId;
      console.log(id)

      const insertClient = await autoppLdrsDB.insertClient(id, form);
      console.log(insertClient)

      const insertSalesT = await autoppLdrsDB.insertSalesTeam(id, form);
      console.log(insertSalesT)

      if (JSON.stringify(form.LDRS) !== "{}") {
        const insertLDRS = await autoppLdrsDB.insertLDRSRequests(id, form);
        console.log(insertLDRS)
      }

      const insertBawR = await autoppLdrsDB.insertBawRequirements(id, form);
      console.log(insertBawR)

      if (fileListBOM.fileList.length > 0) {
        //Insertar los registros de los nuevos archivos en uploadFiles
        const insertBOMFiles = await autoppLdrsDB.insertBOMFiles(id, fileListBOM, form);
        console.log(insertBOMFiles);

        let currPath = `src/assets/files/Autopp/temporalFolderFilesId ${temporalFolderFilesId}`;
        let newPath = `src/assets/files/Autopp/${id}`;

        //Renombrar la carpeta, del nombre temporalFolderFilesId de la petición al id de opprequest. 
        fs.renameSync(currPath, newPath)

      }


      if (insertGeneral.affectedRows === 0 ||
        insertClient.affectedRows === 0 ||
        insertSalesT.affectedRows === 0 ||
        insertBawR.affectedRows === 0
      ) {

        await autoppLdrsDB.deleteRequest(id);

        return res.status(404).send({
          status: 404,
          sucess: false,
          message: "No se pudo insertar la oportunidad",
        });
      } else {
        /*
        Envio de notificación de éxito 
        si fuera el caso
        */
      }

      //Si todo salió bien que actualice el status a 1 para que lo corra el robot
      await autoppLdrsDB.updateStatusRequest(id);

      return res.status(200).send({
        status: 200,
        sucess: true,
        payload: {
          message: `Se creo la oportunidad`,
          id: id
        },
      });



    } catch (error) {

      console.log(error);

      (id !== "") && await autoppLdrsDB.deleteRequest(id);

      res.status(500).send({
        status: 500,
        success: false,
        message: error.sqlMessage,
      });


    }
  }

  //función para actualizar un case number de BAW, esto se realiza porque el especialista devolvió la soicitud, entonces se actualizan los 
  //datos para que le lleguen los datos al especialista con los nuevos datos.
  async newBawDevolutionReq(req, res) {
    console.log("llegue");
    let id = "";

    try {
      let newInfo = req.body.newInfo
      let requirementInfoDevolution = req.body.requirementInfoDevolution

      console.log(newInfo);
      console.log(requirementInfoDevolution);

      const updateRequirementBawInfoDevolutionR = await autoppLdrsDB.updateRequirementBawInfoDevolution(newInfo, requirementInfoDevolution);
      console.log(updateRequirementBawInfoDevolutionR);
      //const updateStatusOppInProcessR = await autoppLdrsDB.updateStatusOppInProcess(requirementInfoDevolution);
      //console.log(updateStatusOppInProcessR);


      if (updateRequirementBawInfoDevolutionR.affectedRows === 0 /*||
        updateStatusOppInProcessR.affectedRows===0*/) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          message: "No se pudo actualizar el requerimiento",
        });

      } else {
        // Envio de notificación de éxito 
        // si fuera el caso
      }




      return res.status(200).send({
        status: 200,
        sucess: true,
        payload: {
          message: `Se actualizó el requerimiento satisfactoriamente.`,
          caseNumber: requirementInfoDevolution.caseNumber
        },
      });



    } catch (error) {

      console.log(error);

      res.status(500).send({
        status: 500,
        success: false,
        message: error.sqlMessage,
        caseNumber: requirementInfoDevolution.caseNumber
      });


    }
  }

  //funcion para extraer el status de todas las solicitudes enviadas para 
  //desplegarlas en la tabla de solicutdes de Autopp - S&S y además las estadisticas que se utilizan para los cards de requests.
  async getRowsRequestsTable(req, res) {
    //console.log(req.body)

    try {
      //console.log(req);
      const { decoded } = req;
      const rows = await autoppLdrsDB.getDataRequestTable(
        req.body.teams,
        req.body.user
      );

      const statsBaw = await autoppLdrsDB.getStatsBAW();

      if (!rows.length) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          message: "No hay solicitudes.",
        });
      }

      if (!statsBaw.length) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          message: "No hay estadisticas Baw.",
        });
      }

      return res.status(200).send({
        status: 200,
        sucess: true,
        message: "se cargo exitosamente.",
        payload: {
          message: "se cargo exitosamente.",
          rows,
          statsBaw,
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

  //funcion para extraer el status de requerimientos de BAW por cada solicitud enviada, 
  // y así desplegarlas  en el modal de BAW de cada solicitud Autopp - S&S
  async getRowsBAW(req, res) {
    console.log(req.body)

    try {
      //console.log(req);
      const { decoded } = req;
      const rows = await autoppLdrsDB.getDataRequestBaw(
        req.body.oppId
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

  //función para descargar los documentos de una solicitud por opp id
  async downloadDocumentFiles(req, res) {
    try {
      const { idNumber, company } = req.params;
      const idNumberDecoded = Buffer.from(idNumber, "base64").toString()
      //const oppDecoded = Buffer.from(opp, "base64").toString()
      const companyDecoded = Buffer.from(company, "base64").toString()


      console.log(idNumberDecoded)


      const documentFiles = await autoppLdrsDB.getDocumentFiles(idNumberDecoded);
      let files = [];

      documentFiles.map((value) => {
        //let tempPath= value.path.replace('/home/gbmadmin/projects/Autopp/gbm-hub-api/', '');
        let tempPath= value.path.substring(value.path.indexOf("src"), value.path.length)

        console.log(tempPath)
        const document = {
          path: tempPath,
          name: value.name,
        };
        files.push(document);
      })


      //Si es un solo archivo, descarguelo
      if (files.length === 1) {
        //let tempPath= files[0].path.replace('/home/gbmadmin/projects/Autopp/gbm-hub-api/', '');
        let tempPath= files[0].path.substring(files[0].path.indexOf("src"), files[0].path.length)

        console.log(tempPath)
        res.download(`${tempPath}`, `${files[0].name}`, (err) => {
          if (err) {
            console.log(err);
          } 
        });

        //Son varios archivos comprimalo, y descarguelo 
      } else if (files.length > 1) {
        console.log(files);
        //console.log(files.length)


        res.zip(files, `Documentos - ${companyDecoded} - ${idNumberDecoded}.zip`);

        //No hay archivos
      } else {
        console.log("El(los) archivo(s) no existe en el servidor");

        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "El(los) archivo(s) no existe en el servidor",
          },
        });
      }


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

  //funcion para descargar el LDR de una solicitud por opp number
  async downloadLDRByOpp(req, res) {
    try {
      const { oppNumber, idNumber } = req.params;
      console.log(oppNumber + idNumber)

      if (oppNumber && idNumber) {
        const oppNumberDecoded = Buffer.from(oppNumber, "base64").toString();
        const idNumberDecoded = Buffer.from(idNumber, "base64").toString();

        const fileName = `LDR - ${oppNumberDecoded} - ${idNumberDecoded}.xlsx`;

        const path = `src/assets/files/Autopp/${idNumberDecoded}/${fileName}`;

        console.log(path);
        if (fs.existsSync(path)) {
          res.download(`${path}`, `${fileName}`, (err) => {
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

  //funcion para subir los archivos
  async uploadFile(req, res) {
    try {

      const { temporalFolderFilesId } = req.params;
      console.log(temporalFolderFilesId)

      const {
        file: { name, data, encoding, mimetype },
      } = req.files;

      const nameNormalize = name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const file = Buffer.from(data, encoding);
      console.log(file)

      let path = `src/assets/files/Autopp/temporalFolderFilesId ${temporalFolderFilesId}`;
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


      let path = `src/assets/files/Autopp/temporalFolderFilesId ${body.temporalFolderFilesId}/${body.name}`;
      console.log(path)

      fs.unlinkSync;
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }


      //eliminar la carpeta si no tiene archivos
      if (
        fs.readdirSync(`src/assets/files/Autopp/temporalFolderFilesId ${body.temporalFolderFilesId}`)
          .length === 0
      ) {
        fs.rmdirSync(`src/assets/files/Autopp/temporalFolderFilesId ${body.temporalFolderFilesId}`, {
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

  //funcion para eliminar una carpeta del Temporal Id de BOM files.
  async deleteFolderBOM(req, res) {
    try {
      const body = req.body;
      //console.log(body);
      console.log("Borrando carpeta BOM: temporalFolderFilesId " + `${body.temporalFolderFilesId}`)

      fs.rmdirSync(`src/assets/files/Autopp/temporalFolderFilesId ${body.temporalFolderFilesId}`, {
        recursive: true,
        force: true,
      });


      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: "Carpeta eliminada.",
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