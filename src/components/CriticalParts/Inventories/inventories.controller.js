/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
/* eslint-disable no-await-in-loop */
/* eslint-disable max-depth */
/* eslint-disable no-sync */
/* eslint-disable prefer-destructuring */
import fs from "fs";
import json2xls from "json2xls";
import moment from "moment";
// import DB2 from "../../../db/db2";
import InventoriesDB from "../../../db/Sales/InventoriesDB";
import DigitalRequestDB from "../../../db/Sales/DigitalRequestDB";
export default class InventoriesComponent {
  async findRequestsInQuotes(req, res) {
    try {
      // const requests = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARREQUERIMIENTOSENCOTIZACION" ();`);
      const requests = await InventoriesDB.getAllDigitalRequestInQuotation();
      if (!requests.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: `Al día de hoy, no hay oportunidades en estado de cotización`,
          },
        });
      } else {
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: `Las oportunidades en estado de cotización fueron cargadas exitosamente.`,
            requests: requests.map((row) => {
              row.createdBy = row.createdBy.split("@")[0];
              row.createdAt = moment(row.createdAt)
                .utc()
                .utcOffset(-300)
                .locale("es")
                .format();
              row.updatedAt = moment(row.updatedAt)
                .utc()
                .utcOffset(-300)
                .locale("es")
                .format();
              return row;
            }),
          },
        });
      }
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`,
        },
      });
    }
  }

  async findInfoRequestInQuote(req, res) {
    try {
      const { idRequest } = req.params;
      if (idRequest) {
        const info = await DigitalRequestDB.getDigitalRequestByID(idRequest);
        if (!info.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message:
                "El requerimiento de la oportunidad seleccionada no se encontro en la base de datos",
            },
          });
        } else {
          const [{ idBusinessModel }] = info;
          // const request = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARINFOREQUERIMIENTOENCONTIZACION" (${idRequest});`);
          const request = await InventoriesDB.getInfoDigitalRequestInQuotation(
            idBusinessModel,
            idRequest
          );
          if (!request.length) {
            res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: `No se logro cargar la información de la oportunidad seleccionada`,
              },
            });
          } else {
            res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: `La información de la oportunidad seleccionada fue cargada exitosamente.`,
                request: request.map((row) => {
                  row.createdAt = moment(row.createdAt)
                    .utc()
                    .utcOffset(-300)
                    .locale("es")
                    .format();
                  row.updatedAt = moment(row.updatedAt)
                    .utc()
                    .utcOffset(-300)
                    .locale("es")
                    .format();
                  return row;
                }),
              },
            });
          }
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`,
        },
      });
    }
  }

  async findCommentsRequestInQuote(req, res) {
    try {
      const { idList } = req.params;
      if (idList) {
        // const request = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARINFOREQUERIMIENTOENCONTIZACION" (${idRequest});`);
        const comments =
          await InventoriesDB.getCommentaryByDigitalRequestInQuotation(idList);
        if (!comments.length) {
          res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Al día de hoy, no se cuentan con comentarios!`,
            },
          });
        } else {
          res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `La información de la oportunidad seleccionada fue cargada exitosamente.`,
              comments: comments.map((row) => {
                row.createdAt = moment(row.createdAt)
                  .utc()
                  .utcOffset(-300)
                  .locale("es")
                  .format();
                return row;
              }),
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`,
        },
      });
    }
  }

  async findFilesRequestInQuote(req, res) {
    try {
      const { idList } = req.params;
      if (idList) {
        // const request = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARINFOREQUERIMIENTOENCONTIZACION" (${idRequest});`);
        const files = await InventoriesDB.getFilesByDigitalRequestInQuotation(
          idList
        );
        if (!files.length) {
          res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Al día de hoy, no se cuentan con comentarios!`,
            },
          });
        } else {
          res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `La información de la oportunidad seleccionada fue cargada exitosamente.`,
              files: files.map((row) => {
                row.createdAt = moment(row.createdAt)
                  .utc()
                  .utcOffset(-300)
                  .locale("es")
                  .format();
                return row;
              }),
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`,
        },
      });
    }
  }

  downloadPartsByModelInQuote(req, res) {
    try {
      const { parts, name } = req.body;
      if (parts && name) {
        if (!parts.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `No se logro descargar la información del modelo seleccionado`,
            },
          });
        } else {
          const xls = json2xls(parts);
          try {
            const path = `src/assets/files/Inventories/${moment().format(
              "DD-MM-YYYY_H-mm-ss"
            )}`;
            if (!fs.existsSync(path)) {
              fs.mkdirSync(path);
            }
            fs.writeFileSync(`${path}/${name}.xlsx`, xls, "binary");
            res.download(`${path}/${name}.xlsx`, `${name}.xlsx`, (err) => {
              if (err) {
                /*
                 * Handle error, but keep in mind the response may be partially-sent
                 * so check res.headersSent
                 */
                console.log(`Error descargando el archivo adjuntado ${name}`);
              } else {
                // decrement a download credit, etc.
                console.log("Se descargo la plantilla");
              }
            });
          } catch (error) {
            console.log(error.stack);
            return res.status(500).send({
              status: 500,
              success: false,
              payload: {
                message: `No se logro descargar la información del modelo seleccionado`,
              },
            });
          }
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`,
        },
      });
    }
  }

  async updateSustituteCostParts(req, res) {
    try {
      const { decoded } = req;
      const { parts, commentary, idList } = req.body;
      console.log(req.body);
      if (parts.length && decoded) {
        if (commentary) {
          // await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARCOMENTARIOSINVENTARIO" ('${commentary}', ${idList}, '${decoded}');`);
          await InventoriesDB.createCommentaryByDigitalRequestInQuotation(
            commentary,
            idList,
            decoded
          );
        }
        for (const element of parts) {
          const { id, substitute1, substitute2, substitute3, cost } = element;
          // await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARSUSTITUTOSYCOSTOSPARTES" (${id}, '${substitute1}', '${substitute2}', '${substitute3}', ${cost ? cost : 0}, '${decoded}');`);
          await InventoriesDB.updateSustitutesAndCostByPartsEquipments(
            cost ? cost : 0,
            substitute1,
            substitute2,
            substitute3,
            decoded,
            id
          );
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: `Se actualizaron los sustitutos y costos exitosamente de las partes para el modelo seleccionado`,
          },
        });
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`,
        },
      });
    }
  }

  async uploadReferencesSustitutesCost(req, res) {
    try {
      const { idList } = req.params;
      const { decoded } = req;
      const {
        reference: { name, data, encoding, mimetype },
      } = req.files;
      const nameNormalize = name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const file = Buffer.from(data, encoding);
      let path = `src/assets/files/Inventories/References/Cotizacion #${idList}`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      path = `${path}/Ajust`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      path = `${path}/${moment().format("YYYY-MM-DD_H-mm-ss")}`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      fs.writeFileSync(`${path}/${nameNormalize}`, file, (err) => {
        if (err) {
          console.log(
            "No se logro almacenar en el servidor de datos el archivo"
          );
          res.status(409).send({
            status: 409,
            success: false,
            payload: {
              message: `No se logro almacenar en el servidor de datos el archivo`,
            },
          });
        }
        console.log(`Archivo ${nameNormalize} guardado con exito`);
      });
      // const reference = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARREFERENCIAINVENTARIO" ('${nameNormalize}', '${encoding}', '${mimetype}', '${path}/${nameNormalize}', ${idList}, '${decoded}');`);
      const reference =
        await InventoriesDB.createReferencesByDigitalRequestInQuotation(
          nameNormalize,
          encoding,
          mimetype,
          `${path}/${nameNormalize}`,
          idList,
          decoded
        );
      if (!reference.length) {
        res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: `No se logro guardar en la base de datos el archivo`,
          },
        });
      } else {
        const [{ id_ReferenciaInventario }] = reference;
        res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: "Archivo almacenado exitosamente",
            path,
            idReference: id_ReferenciaInventario,
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

  async deactivateReferences(req, res) {
    try {
      const { referencesIds } = req.body;
      if (referencesIds) {
        for (const element of referencesIds) {
          // await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."DESACTIVARREFERENCIAINVENTARIOPORID" (${element});`);
          await InventoriesDB.deactivateReferenceByDigitalRequestInQuotation(
            element
          );
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: "Referencias desactivadas exitosamente",
          },
        });
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

  downloadAttachmentByPath(req, res) {
    try {
      const { path, name } = req.params;
      if (path && name) {
        const pathDecode = Buffer.from(path, "base64").toString();
        const nameDecode = Buffer.from(name, "base64").toString();
        res.download(`${pathDecode}`, `${nameDecode}`, (err) => {
          if (err) {
            /*
             * Handle error, but keep in mind the response may be partially-sent
             * so check res.headersSent
             */
            console.log(
              `Error descargando el archivo adjuntado ${nameDecode} en la direccion ${pathDecode}`
            );
          } else {
            // decrement a download credit, etc.
            console.log("Se descargo la plantilla");
          }
        });
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
}
