import PanamaBidsDB from "../../db/PanamaBids/panamaBidsDB";
import fetch from "node-fetch";
import fs from "fs";
import json2xls from "json2xls";
const zip = require("express-zip");

export default class hcmHiringController {
  async getOptions(req, res) {
    try {
      let masterData = await PanamaBidsDB.getMasterData();

      masterData = masterData[0][0];
      const keysForm = Object.keys(masterData);
      for (const item of keysForm) {
        const jvalue = JSON.parse(masterData[item]);
        masterData[item] = jvalue;
      }
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
  async getDataEntities(req, res) {
    try {
      let masterData = await PanamaBidsDB.getMasterData();

      masterData = masterData[0][0];
      const keysForm = Object.keys(masterData);
      for (const item of keysForm) {
        const jvalue = JSON.parse(masterData[item]);
        masterData[item] = jvalue;
      }
      masterData["customers"] = await PanamaBidsDB.getCustomersFO();
      masterData["employee"] = await PanamaBidsDB.getEmployeeFO();

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
  async getEntities(req, res) {
    try {
      const data = await PanamaBidsDB.getAllEntities();
      for (const item of data) {
        if (item.sector === "BF") {
          item.sector = "Banca & Finanzas";
        } else {
          item.sector = "Public Sector";
        }
      }
      console.log(data);

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
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  async insertEntity(req, res) {
    let bdy = req.body.newInfo;
    const { decoded } = req;
    if (bdy) {
      try {
        const data = await PanamaBidsDB.insertNewEntity(bdy, decoded);
        console.log(data.length);
        if (data.affectedRows <= 0) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "No se pudo insertar",
            },
          });
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            data,
            message: "Se inserto correctamente",
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
  async updateEntity(req, res) {
    let bdy = req.body.info;
    console.log(bdy);
    if (bdy.salesRep["id"]) {
      bdy.salesRep = bdy.salesRep["user"];
    }
    if (bdy.salesRepCoti["id"]) {
      bdy.salesRepCoti = bdy.salesRepCoti["user"];
    }
    if (bdy.customer["id"]) {
      let customerTemp = bdy.customer;
      console.log(customerTemp);
      bdy.customer = customerTemp["name"];
      bdy.customerId = customerTemp["id"];
    }
    if (bdy.sector === "Banca & Finanzas") {
      bdy.sector = "BF";
    } else {
      bdy.sector = "PS";
    }

    console.log(bdy);
    try {
      const data = await PanamaBidsDB.updateEntity(bdy);
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
  async deleteEntity(req, res) {
    let id = req.params.id;
    console.log(id);
    try {
      const data = await PanamaBidsDB.deleteEntity(id);
      if (data.affectedRows <= 0) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se pudo eliminar",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Se elimino correctamente",
        },
      });
    } catch (error) {
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
    console.log(bdy.info);
    if (bdy.info) {
      if (bdy.type === "1") {
        idCustomer = `00${bdy.info.id}`;
      } else {
        idCustomer = `00${bdy.info}`;
      }
    }
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

              console.log(response.sort(getSortContacts("FIRST_NAME")));
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
  async getProducts(req, res) {
    try {
      const data = await PanamaBidsDB.getAllProducts();
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
          message: "Productos cargados exitosamente",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  async getPurchaseOrderMacro(req, res) {
    let bdy = req.body;
    try {
      const data = await PanamaBidsDB.getPurchaseOrderMacro(bdy);
      if (!data.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontro registros",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Compras cargadas exitosamente",
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
  async getPurchaseOrderProduct(req, res) {
    let id = req.params.id;
    try {
      const data = await PanamaBidsDB.getAllPurchaseOrderProduct(id);
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
          message: "Compras cargadas exitosamente",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  async getColumsPurchaseOrderMacro(req, res) {
    try {
      const data = await PanamaBidsDB.getColumsPurchaseOrderMacro();
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
          message: "Columnas traidas correctamente",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  async updatePurchaseOrderMacro(req, res) {
    let bdy = req.body.info;
    let productsInfo = req.body.products;
    if (bdy.orderStatusNum) {
      bdy.orderStatus = parseInt(bdy.orderStatusNum);
    } else {
      bdy.orderStatus = bdy.ORM;
    }
    if (bdy.performanceBondNum) {
      bdy.performanceBond = parseInt(bdy.performanceBondNum);
    } else {
      bdy.performanceBond = bdy.POM;
    }
    if (bdy.gbmStatusNum) {
      bdy.gbmStatus = parseInt(bdy.gbmStatusNum);
    } else {
      bdy.gbmStatus = bdy.GS;
    }
    if (bdy.forecastTypeNum) {
      bdy.forecastType = parseInt(bdy.forecastTypeNum);
    } else {
      bdy.forecastType = bdy.FT;
    }
    console.log(productsInfo);
    if (productsInfo) {
      const products = Object.keys(req.body.products);
      for (const item of products) {
        await PanamaBidsDB.updateProductsOrderMacro(item, productsInfo[item]);
      }
    }
    try {
      console.log(bdy);
      const data = await PanamaBidsDB.updatePurchaseOrderMacro(bdy);

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
  async getPurchaseOrderCompetition(req, res) {
    let bdy = req.body;
    try {
      const data = await PanamaBidsDB.getAllCompetition(bdy);
      if (!data.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontro registros",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Coompetencias cargadas exitosamente",
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
  async getAllDeliveryMethod(req, res) {
    try {
      const data = await PanamaBidsDB.getAllDeliveryMethod();
      if (!data.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontro registros",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Coompetencias cargadas exitosamente",
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
  async getCompetitionProducts(req, res) {
    let id = req.params.id;

    try {
      const data = await PanamaBidsDB.getAllCompetitionProducts(id);
      if (!data.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontro registros",
            message: "Ocurrio un error de conexión",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Coompetencias cargadas exitosamente",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  async getColumsCompetition(req, res) {
    try {
      const data = await PanamaBidsDB.getColumsCompetition();
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
          message: "Columnas traidas correctamente",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  async getAllFastCotyzationReport(req, res) {
    let bdy = req.body;
    try {
      const data = await PanamaBidsDB.getAllFastCotyzationReport(bdy);
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
          message: "Columnas traidas correctamente",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  async getAllProductsFastCotyzation(req, res) {
    try {
      let id = req.params.id;
      const data = await PanamaBidsDB.getAllProductsFastCotyzation(id);
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
          message: "Columnas traidas correctamente",
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
  async getColumsFastCotyzationReport(req, res) {
    try {
      const data = await PanamaBidsDB.getColumsFastCotyzationReport();
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
          message: "Columnas traidas correctamente",
        },
      });
    } catch (error) {
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  async updateFastCotyzationReport(req, res) {
    let bdy = req.body.info;
    try {
      const data = await PanamaBidsDB.updateFastCotyzationReport(bdy);

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
  async updateFastCotyzationGBMStatus(req, res) {
    let bdy = req.body;
    console.log(bdy);
    try {
      const data = await PanamaBidsDB.updateGBMStatusQuickQuote(bdy);
      console.log(data.affectedRows);
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
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString(),
        },
      });
    }
  }
  //Funcion para descargar todos los archivos de una solicitud
  async downloadAllAttachment(req, res) {
    try {
      const { documentId, type } = req.params;
      if (documentId) {
        let allFiles = "";
        const documentIdDecode = Buffer.from(documentId, "base64").toString();
        if (type === "agreement") {
          allFiles = await PanamaBidsDB.getAllFilesByDocumentId(
            documentIdDecode,
            "agreement"
          );
        } else {
          allFiles = await PanamaBidsDB.getAllFilesByDocumentId(
            documentIdDecode,
            "quickQuotes"
          );
        }
        console.log(allFiles);
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
              console.log(fil.path, fil.name);
              files.push(fil);
            }
          });
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
  //funcion para descargar 1 archivo de una solicitud
  async downloadAttachmentByPath(req, res) {
    try {
      const { documentId, fileName, type } = req.params;
      if (documentId && fileName) {
        const fileNameDecode = Buffer.from(fileName, "base64").toString();
        const documentIdDecode = Buffer.from(documentId, "base64").toString();
        let path = "";
        if (type === "agreement") {
          path = `${
            "src/assets/files/PanamaBids/Agreement/Request #" +
            documentIdDecode +
            "/" +
            fileNameDecode
          }`;
        } else {
          path = `${
            "src/assets/files/PanamaBids/QuickQuotes/Request #" +
            documentIdDecode +
            "/" +
            fileNameDecode
          }`;
        }
        console.log(path);
        if (fs.existsSync(path)) {
          console.log("entre");
          res.download(`${path}`, `${fileNameDecode}`, (err) => {
            if (err) {
              console.log(`Error descargando el archivo adjuntado`);
              console.log(err);
            } else {
              console.log("Se descargo la plantilla");
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
  async getFilesByID(req, res) {
    const { Id } = req.params;
    try {
      const rows = await PanamaBidsDB.getFilesByID(Id);
      console.log(rows);
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
  async getDataReportExcel(req, res) {
    let bdy = req.body;
    try {
      const data = await PanamaBidsDB.getDataReportExcel(bdy);
      if (!data.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontro registros",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Compras cargadas exitosamente",
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
  async getDataReportCompetitionExcel(req, res) {
    let bdy = req.body;
    try {
      const data = await PanamaBidsDB.getDataReportCompetitionExcel(bdy);
      if (!data.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: "No se encontro registros",
          },
        });
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data,
          message: "Compras cargadas exitosamente",
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
