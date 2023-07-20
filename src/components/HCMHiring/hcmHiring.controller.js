import hcmHiringDB from "../../db/HCMHiring/hcmHiringDB";
import fetch from "node-fetch";
import fs from "fs";
import SendMail from "../../helpers/sendEmail";
import { renderCandidateEmail } from "../../helpers/renderContent";
const zip = require("express-zip");

export default class hcmHiringController {
  //funcion para extraer las solicitudes de SD con base a los filtros de CardFilters
  async getRows(req, res) {
    try {
      const { decoded } = req;
      const rows = await hcmHiringDB.getData(
        req.teams,
        req.user.PAIS,
        decoded
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
      let masterData = await hcmHiringDB.getMasterData();
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
  //Funcion para insertar una nueva solicitud
  async newRequest(req, res) {
    let form = req.body.newInfo;
    const user = req.user.EMAIL.split("@")[0];
    form["user"] = user;
    console.log(form);
    try {

      const insert = await hcmHiringDB.insertNewRequest(form);

      console.log(insert);


      if (insert.affectedRows === 0) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          message: "No se pudo insertar.",
        });
      } else {
        //extraer id de gestion 
        const idGestion = await hcmHiringDB.getIdByEmail(form.emailCandidate);
        console.log(idGestion[0].id);
        //enviar email al candidato
        const x = new hcmHiringController();
        const sdMail = x.sendCandidateMail(idGestion[0].id, form.user, form.emailCandidate, form.jobTitle)
        console.log(sdMail);
      }

      return res.status(200).send({
        status: 200,
        sucess: true,
        payload: {
          message: `Se creo una nueva solicitud`,
          insert,
        },
      });


    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        message: error.sqlMessage,
      });
    }

  }
  //funcion para actualizar una solicitud
  async updateRequest(req, res) {
    let updateInfo = req.body.updateInfo;
    const { decoded, user } = req;
    let { id } = updateInfo;
    console.log(updateInfo);

    try {

      const update = await hcmHiringDB.updateCandidate(updateInfo, decoded);
      console.log(update);
      if (update !== "ok") {
        return res.status(404).send({
          status: 404,
          sucess: false,
          message: "No se actualizó.",
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
      const { id } = req.params;
      const { decoded, user } = req;
      const {
        file: { name, data, encoding, mimetype },
      } = req.files;
      const nameNormalize = name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const file = Buffer.from(data, encoding);
      // let path = `src/assets/files/HcmHiring/${id}`;
      const path = `/home/tss/projects/recruitment-form/src/files/${id}`;
      // console.log(id);
      // console.log(path);
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
      const reference = await hcmHiringDB.newFile(
        {
          nameNormalize,
          encoding,
          mimetype,
          path: `${path}/${nameNormalize}`,
          decoded,
        },
        id,
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
      console.log(err);
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
      const { id, fileName } = req.params;

      if (id && fileName) {
        // const fileNameDecode = Buffer.from(fileName, "base64").toString();
        var atob = require('atob');
        const fileNameDecode = atob( fileName );
        const idDecode = Buffer.from(id, "base64").toString();
        console.log(fileNameDecode);
        // const path = `${"src/assets/files/HcmHiring/" + idDecode + "/" + fileNameDecode}`;
        const path = `${"/home/tss/projects/recruitment-form/src/files/" + idDecode + "/" + fileNameDecode}`;
        console.log(path);
        if (fs.existsSync(path)) {
          res.download(`${path}`, `${fileNameDecode}`, (err) => {
            if (err) {
              /*
               * Handle error, but keep in mind the response may be partially-sent
               * so check res.headersSent
               */
              //console.log(`Error descargando el archivo adjuntado`);
              console.log(err);
            } else {
              // decrement a download credit, etc.
              console.log('Se descargo la plantilla');
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
      console.log(err);
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
      const { id } = req.params;
      if (id) {
        const idDecode = Buffer.from(id, "base64").toString();
        // console.log(idDecode);
        const allFiles = await hcmHiringDB.getCandidateFiles(
          idDecode
        );
        // console.log(allFiles);
        if (!allFiles.length) {
          return res.status(404).send({
            status: 404,
            sucess: false,
            message: "No hay archivos asociados",
          });
        } else {
          let files = [];
          allFiles.forEach((file) => {
            // console.log(file);
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
          res.zip(files, `Documentacion_${idDecode}.zip`);
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
  //funcion para eliminar un archivo de la DB cuando se elimina en el basurero
  async deleteFile(req, res) {
    try {
      const bdy = req.body;
      console.log(bdy);
      await hcmHiringDB.removeFile(bdy);
      // let path = `src/assets/files/HcmHiring/${bdy.id}/${bdy.name}`;
      let path = `/home/tss/projects/recruitment-form/src/files/${bdy.id}/${bdy.name}`;
      fs.unlinkSync;
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
      //eliminar la carpeta si no tiene archivos
      if (
        fs.readdirSync(`/home/tss/projects/recruitment-form/src/files/${bdy.id}`)
          .length === 0
      ) {
        fs.rmdirSync(`/home/tss/projects/recruitment-form/src/files/${bdy.id}`, {
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
      await hcmHiringDB.removeAllFiles(bdy);

      // let path = `src/assets/files/HcmHiring/${bdy.id}`;
      let path = `/home/tss/projects/recruitment-form/src/files/${bdy.id}`;
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
  //funcion para enviar email al candidato
  async sendCandidateMail(id, hcUser, userRequest, jobTitle) {

    var btoa = require('btoa');
    //https://reclutamiento.gbm.net
    const content = renderCandidateEmail(btoa(id));
    const subject = `Solicitud de Contratación en GBM - ${jobTitle}`;
    const emailResponse = await SendMail.sendMailHtml(
      content,
      subject,
      null,
      userRequest,
      hcUser + "@gbm.net"
    );
    console.log(emailResponse);
    return emailResponse;
  }
  //funcion para extraer la informacion de un candidato en detalle
  async getCandidateInfoById(req, res) {
    const { id } = req.params;
    try {
      const candidatePersonalData = await hcmHiringDB.getCandidatePersonalInfo(id);
      const candidateEducation = await hcmHiringDB.getCandidateEducationInfo(id);
      const candidateExperience = await hcmHiringDB.getCandidateExperienceInfo(id);
      const filesData = await hcmHiringDB.getCandidateFiles(id);
      if (!candidatePersonalData.length && !candidateEducation.length) {

        return res.status(404).send({
          status: 404,
          sucess: false,
          payload: {
            message: "No hay informacion.",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        sucess: true,
        candidatePersonalData,
        candidateEducation,
        candidateExperience,
        filesData,
        payload: {
          message: "se cargo exitosamente.",
        },
      });
    } catch (error) {
      return res.status(500).send({
        status: 500,
        sucess: false,
        payload: {
          message: error.sqlMessage,
        },
      });
    }
  }
  //funcion para extraer la información de SAP de una posicion
  async getPositionInfo(req, res) {
    const { position } = req.params;
    console.log(position);
    try {
      let Info;
      await fetch("https://databot.gbm.net:8085/sap/consume", {
        method: "post",
        body: JSON.stringify({
          system: 300,
          props: {
            program: "ZHR_GET_INFO_POSITION",
            parameters: {
              ID_POSICION: position,
            },
          },
        }),
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((json) => {
          Info = json;
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
                message: json.payload.response.RESPONSE,
              });
              break;
          }
        });
      console.log(Info);
      let response = "";
      try {
        response = Info.payload.response.RESPONSE
      } catch (error) { }
      if (response === "NA") {

        return res.status(404).send({
          status: 404,
          sucess: false,
          message: "La posición no existe en SAP.",
        });
      }
      else {

        let positionInfo = {};
        const ptype = get_tp(Info.payload.response.EMPLOYEE_GROUP);
        const country = Info.payload.response.COMP_CODE.substring(2);
        positionInfo["jobTitle"] = Info.payload.response.POSITION_NAME;
        positionInfo["plazaType"] = ptype;
        positionInfo["country"] = country;
        positionInfo["personalArea"] = Info.payload.response.PERS_AREA;
        positionInfo["subArea"] = Info.payload.response.SUB_AREA;

        let masterData = await hcmHiringDB.getMasterData();
        masterData = masterData[0][0];
        const keysForm = Object.keys(masterData);
        for (const item of keysForm) {
          const jvalue = JSON.parse(masterData[item]);
          masterData[item] = jvalue;
        }

        const xxPArea = Info.payload.response.PERS_AREA.toString().replace(country, "XX");
        positionInfo["eGroupName"] = (typeof masterData["EmployeeGroup"].find(el => el.value === ptype) !== "undefined") ? masterData["EmployeeGroup"].find(el => el.value === ptype).label : "na"
        positionInfo["countryName"] = (typeof masterData["CountryApplication"].find(el => el.value === country) !== "undefined") ? masterData["CountryApplication"].find(el => el.value === country).label : "na"
        positionInfo["personalAreaName"] = (typeof masterData["PersonalArea"].find(el => el.value === xxPArea) !== "undefined") ? masterData["PersonalArea"].find(el => el.value === xxPArea).label : "na"
        positionInfo["subAreaName"] = (typeof masterData["SubArea"].find(el => el.value === Info.payload.response.SUB_AREA && el.countryCode === country) !== "undefined") ? masterData["SubArea"].find(el => el.value === Info.payload.response.SUB_AREA && el.countryCode === country).label : "na"
        positionInfo["xxPArea"] = xxPArea;
        return res.status(200).send({
          status: 200,
          sucess: true,
          positionInfo,
          payload: {
            message: "exito.",
          },
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        sucess: false,
        message: error.sqlMessage,
        msj: "error"
      });
    }
  }
  async changeStatusBot(req, res) {
    let idRequest = req.body.idRequest;
    const { decoded, user } = req;
    try {
      const updateStatus = await hcmHiringDB.updateStatus(idRequest, decoded);
      if (updateStatus.affectedRows === 0) {
        return res.status(404).send({
          status: 404,
          sucess: false,
          message: "No se actualizó.",
        });
      }
      else {
        return res.status(200).send({
          status: 200,
          sucess: true,
          message: `Se actualizó la solicitud`,
        });
      }
    }
    catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        message: error.sqlMessage,
      });
    }
  }
}

function get_tp(egroup) {
  switch (egroup) {
    case "A":
      return 1;
      break;
    case "B":
      return 2;
      break;
    case "C":
      return 4;
      break;
    case "E":
      return 4;
      break;
    case "O":
      return 4;
      break;
    case "P":
      return 1;
      break;
    case "R":
      return 4;
      break;
    case "T":
      return 3;
      break;
    default:
      return 4
      break;
  }
}
