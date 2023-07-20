import CostaRicaBids from "../../db/CostaRicaBids/costaRicaBids";
import fetch from "node-fetch";
import fs from "fs";
const zip = require("express-zip");
import moment from "moment";

export default class hcmHiringController {
  async getOptions(req, res) {
    try {
      let masterData = await CostaRicaBids.getMasterData();
      masterData = masterData[0][0];
      const keysForm = Object.keys(masterData);
      for (const item of keysForm) {
        const jvalue = JSON.parse(masterData[item]);
        masterData[item] = jvalue;
      }
      masterData["customers"] = await CostaRicaBids.getCustomersFO();
      masterData["employee"] = await CostaRicaBids.getEmployeeFO();
      if (!masterData) {
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
          masterData,
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
  async getPurchaseOrder(req, res) {
    const role = req.body.role;
    const user = req.user.EMAIL.split("@")[0];
    try {
      const data = await CostaRicaBids.getPurchaseOrder(role, user);
      if (!data.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Ocurrio un error de conexión",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Entidades cargadas exitosamente",
        },
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
  async deleteSalesTeam(req, res) {
    const id = req.body.id;
    console.log(id);
    try {
      const data = await CostaRicaBids.deleteSalesTeam(id);
      if (data.affectedRows <= 0) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Ocurrio un error de conexión",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Entidades cargadas exitosamente",
        },
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
  async insertSalesTeam(req, res) {
    const bdy = req.body.info;
    const user = req.user.EMAIL.split("@")[0];
    try {
      const data = await CostaRicaBids.insertSalesTeam(
        bdy.id,
        bdy.SalesTeam,
        user
      );
      if (data.affectedRows <= 0) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Ocurrio un error de conexión",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Entidades cargadas exitosamente",
        },
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
  async getProductsPurchaseOrder(req, res) {
    let id = req.body.info;
    try {
      const products = await CostaRicaBids.getProducts(id);
      const salesTeam = await CostaRicaBids.getSalesTeam(id);
      const evaluations = await CostaRicaBids.getEvaluations(id);
      if (!products.length && !salesTeam.length && !evaluations.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Ocurrio un error de conexión",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          products,
          salesTeam,
          evaluations,
          message: "Entidades cargadas exitosamente",
        },
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
  async updatePurchaseOrder(req, res) {
    let bdy = req.body.info;
    let type = req.body.type;
    const salesTeam = req.body.salesTeam;
    const user = req.user.EMAIL.split("@")[0];

    if (type === "2" || type === "3") {
      delete bdy.newOportunity;
      bdy["participateUser"] = user;
      bdy["changeDate"] = moment().format("YYYY-MM-DD H:mm:ss");
    }

    try {
      const data = await CostaRicaBids.updatePurchaseOrder(bdy);
      console.log(salesTeam);
      if (type === "2") {
        for (const item of salesTeam) {
          CostaRicaBids.insertSalesTeam(bdy.id, item, user);
        }
      }
      if (data.affectedRows <= 0) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se pudo actualizar",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Se actualizo correctamente",
        },
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
  //funcion para subir los archivos
  async uploadFile(req, res) {
    try {
      const { bidNumber } = req.params;
      const { decoded, user } = req;
      const {
        file: { name, data, encoding, mimetype },
      } = req.files;
      const nameNormalize = name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const file = Buffer.from(data, encoding);
      let path = `src/assets/files/CrBids/${bidNumber}`;
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
      });
      //insert en la DB table
      const reference = await CostaRicaBids.newFile(
        {
          nameNormalize,
          encoding,
          mimetype,
          path: `${path}/${nameNormalize}`,
          decoded,
        },
        bidNumber,
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
  //Funcion para borrar un archivo ya cargado
  async deleteFile(req, res) {
    try {
      const bdy = req.body;
      console.log(bdy);
      await CostaRicaBids.removeFile(bdy);
      let path = `src/assets/files/CrBids/${bdy.id}/${bdy.name}`;
      fs.unlinkSync;
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
      //eliminar la carpeta si no tiene archivos
      if (fs.readdirSync(`src/assets/files/CrBids/${bdy.id}`).length === 0) {
        fs.rmdirSync(`src/assets/files/CrBids/${bdy.id}`, {
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
  //Funcion para borrar todos los archivo ya cargados
  async deleteAllFiles(req, res) {
    try {
      const bdy = req.body;
      await CostaRicaBids.removeAllFiles(bdy);

      let path = `src/assets/files/CrBids/${bdy.id}`;
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
  //funcion para descargar 1 archivo de una solicitud
  async downloadAttachmentByPath(req, res) {
    try {
      const { documentId, fileName } = req.params;

      if (documentId && fileName) {
        const fileNameDecode = Buffer.from(fileName, "base64").toString();
        const documentIdDecode = Buffer.from(documentId, "base64").toString();
        const path = `${
          "src/assets/files/CrBids/" + documentIdDecode + "/" + fileNameDecode
        }`;
        if (fs.existsSync(path)) {
          res.download(`${path}`, `${fileNameDecode}`, (err) => {
            if (err) {
              console.log(`Error descargando el archivo adjuntado`);
              console.log(err);
            } else {
              console.log("Se descargo el archivo");
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
  //Funcion para traer los documentos de la licitacion
  async getFilesByPurchaseOrder(req, res) {
    const { documentId } = req.params;
    try {
      const rows = await CostaRicaBids.getFilesByPurchaseOrder(documentId);
      let data = rows[0].files;
      data = data.split(",");
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
        data,
        payload: {
          message: "se cargo exitosamente.",
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        status: 500,
        sucess: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  async getExcelReport(req, res) {
    const role = req.body.role;
    const user = req.user.EMAIL.split("@")[0];
    console.log(role);
    try {
      const data = await CostaRicaBids.getExcelReport(role, user);
      if (!data.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "Ocurrio un error de conexión",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Entidades cargadas exitosamente",
        },
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
}
const getSortContacts = (prop) => {
  return function (a, b) {
    if (a[prop] > b[prop]) {
      return 1;
    } else if (a[prop] < b[prop]) {
      return -1;
    }
    return 0;
  };
};
