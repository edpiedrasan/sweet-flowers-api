/* eslint-disable no-await-in-loop */
/* eslint-disable no-sync */
/* eslint-disable max-depth */
import fs from 'fs';
// import json2xls from 'json2xls';
import xlsx from 'node-xlsx';
import moment from "moment";
// import DB2 from "../../../db/db2";
import DigitalRequestDB from "../../../db/Sales/DigitalRequestDB";
import PricingDB from "../../../db/Sales/PricingDB";

export default class PricingComponent {

  async findVariablesMasterData(req, res) {
    try {
      // const variables = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARVARIABLESMASTERDATA" ();`);
      const variables = await PricingDB.getAllMasterDataVariables();
      if (!variables.length) {
        res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: `Al día de hoy, no hay variables cargadas en la tabla master`
          }
        });
      } else {
        res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: `Las variables de la tabla master fueron cargadas exitosamente.`,
            variables,
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findLogsMasterDataById(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        // const logs = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARLOGSMASTERDATA" (${id});`);
        const logs = await PricingDB.getLogsMasterDataByVariable(id);
        if (!logs.length) {
          res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Al día de hoy, no hay registros de cambios para la variable maestra`
            }
          });
        } else {
          res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `Los registros de actividad fueron cargadas exitosamente.`,
              logs,
            }
          });
        }
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!"
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findOffersRequestById(req, res) {
    try {
      const { id } = req.params;
      if (id) {

        /*
         * const [
         *   equipments,
         *   servicesTss,
         *   spareParts
         * ] = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONAROFERTASPORREQUERIMIENTO" (${id});`);
         */
        const equipments = await PricingDB.getEquipmentsBaseByDigitalRequest(id);
        const servicesTss = await PricingDB.getServicesTssByDigitalRequest(id);
        const spareParts = await PricingDB.getSparePartsByDigitalRequest(id);
        if (!equipments.length) {
          res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Al día de hoy, no hay registros de ofertas para el requerimiento`
            }
          });
        } else {
          // const [request] = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARREQUERIMIENTOPORID" (${id});`);
          const [request] = await DigitalRequestDB.getDigitalRequestByID(id);
          // const [ajust] = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARAJUSTEOFERTAPORREQUERIMIENTO" (${id});`);
          const [ajust] = await PricingDB.getOfferAjustDetailByDigitalRequest(id);
          // const references = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARREFERENCIASAJUSTEPORREQUERIMIENTO" (${id});`);
          const references = await PricingDB.getReferencesOfferAjustByDigitalRequest(id);
          res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `Los registros de actividad fueron cargadas exitosamente.`,
              resume: [
                equipments,
                servicesTss,
                spareParts
              ],
              ajustOffer: {
                ajust,
                references,
              },
              request,
            }
          });
        }
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!"
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findRequestOffersInAjustment(req, res) {
    try {
      // const requests = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARREQUERIMIENTOSENAJUSTEOFERTA" ();`);
      const requests = await PricingDB.getAllDigitalRequestInPricing();
      if (!requests.length) {
        res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: `Al día de hoy, no hay oportunidades en el flujo de pricing`
          }
        });
      } else {
        res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: `Las oportunidades en el flujo de pricing fueron cargadas exitosamente.`,
            requests,
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findAjustOfferWithLogById(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        // const logs = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARBITACORAOFERTAAJUSTADA" (${id});`);
        const logs = await PricingDB.getLogsOfferAjustByDigitalRequest(id);
        if (!logs.length) {
          res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Al día de hoy, no hay oportunidades en el flujo de pricing`
            }
          });
        } else {
          res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `Se cargaron las bitacoras de la oferta exitosamente.`,
              logs,
            }
          });
        }
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!"
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async updateOfferCalcRequestByPricer(req, res) {
    try {
      const { id, idList } = req.params;
      const { decoded } = req;
      const { values, description } = req.body;
      if (Object.keys(values).length && description && decoded && id) {
        // const log = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARBITACORAAJUSTECALCULO" ('${description}',${idList}, '${decoded}');`);
        const log = await PricingDB.createLogOfferAjustByDigitalRequest(description, decoded, idList);
        if (!log.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "Ocurrío un error interno intentando actualizar las ofertas, por favor intentelo nuevamente"
            }
          });
        } else {
          const [{ id_Bitacora }] = log;
          const { equipmentsLoad, servicesLoad, sparePartsLoad } = values;
          for (const element of equipmentsLoad) {

            /*
             * const { byServices, byServicesRemaining, shippingPercent, upliftPercent, finPercent, provision } = element;
             * const idOffer = element.id;
             * const [
             *   updated,
             *   logAjust
             * ] = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARAJUSTECALCULOEQUIPOSBASE" (${byServices}, ${byServicesRemaining}, ${shippingPercent}, ${upliftPercent}, ${finPercent}, ${provision}, ${idOffer}, ${id_Bitacora});`);
             */
            const logAjust = await PricingDB.createLogEquipmentBaseOfferAjust(element, id_Bitacora);
            const updated = await PricingDB.updateEquipmentsBaseAjustByID(element);
            if (!updated.length || !logAjust.length) {
              return res.status(404).send({
                status: 404,
                success: false,
                payload: {
                  message: "Ocurrío un error interno intentando actualizar las ofertas, por favor intentelo nuevamente"
                }
              });
            }
          }
          for (const element of servicesLoad) {

            /*
             * const { upliftPercent, finPercent, viatic, provision } = element;
             * const idOffer = element.id;
             * const [
             *   updated,
             *   logAjust
             * ] = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARAJUSTECALCULOSERVICIOSTSS" (${upliftPercent}, ${finPercent}, ${viatic}, ${provision}, ${idOffer}, ${id_Bitacora});`);
             */
            const logAjust = await PricingDB.createLogServicesTssOfferAjust(element, id_Bitacora);
            const updated = await PricingDB.updateServicesTssAjustByID(element);
            if (!updated.length || !logAjust.length) {
              return res.status(404).send({
                status: 404,
                success: false,
                payload: {
                  message: "Ocurrío un error interno intentando actualizar las ofertas, por favor intentelo nuevamente"
                }
              });
            }
          }
          for (const element of sparePartsLoad) {

            /*
             * const { id_CalculoSparePartes, shippingPercent, upliftPercent, finPercent, provision, interest } = element;
             * const [
             *   updated,
             *   logAjust
             * ] = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARAJUSTECALCULOSPAREPARTES" (${shippingPercent}, ${upliftPercent}, ${finPercent}, ${provision}, ${interest}, ${id_CalculoSparePartes}, ${id_Bitacora});`);
             */
            const logAjust = await PricingDB.createLogSparePartsOfferAjust(element, id_Bitacora);
            const updated = await PricingDB.updateSparePartsAjustByID(element);
            if (!updated.length || !logAjust.length) {
              return res.status(404).send({
                status: 404,
                success: false,
                payload: {
                  message: "Ocurrío un error interno intentando actualizar las ofertas, por favor intentelo nuevamente"
                }
              });
            }
          }
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Calculos de la oferta actualizadas exitosamente"
            }
          });
        }
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!"
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async updateManualOfferCalcRequestByPricer(req, res) {
    try {
      const { id, idList } = req.params;
      const { decoded } = req;
      const { values, description, type } = req.body;
      if (Object.keys(values).length && description && decoded && id && type) {
        // const log = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARBITACORAAJUSTECALCULO" ('${description}',${idList}, '${decoded}');`);
        const log = await PricingDB.createLogOfferAjustByDigitalRequest(description, decoded, idList);
        if (!log.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "Ocurrío un error interno intentando actualizar las ofertas, por favor intentelo nuevamente"
            }
          });
        } else {
          let ajustUpdated = {};
          const [{ id_Bitacora }] = log;
          if (type === 'equipments') {

            /*
             * const { byServices, byServicesRemaining, shippingPercent, upliftPercent, finPercent, provision } = values;
             * const idOffer = values.id;
             * const [
             *   updated,
             *   logAjust
             * ] = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARAJUSTECALCULOEQUIPOSBASE" (${byServices}, ${byServicesRemaining}, ${shippingPercent}, ${upliftPercent}, ${finPercent}, ${provision}, ${idOffer}, ${idLog});`);
             */
            const logAjust = await PricingDB.createLogEquipmentBaseOfferAjust(values, id_Bitacora);
            const updated = await PricingDB.updateEquipmentsBaseAjustByID(values);
            if (!updated.length || !logAjust.length) {
              return res.status(404).send({
                status: 404,
                success: false,
                payload: {
                  message: "Ocurrío un error interno intentando actualizar las ofertas, por favor intentelo nuevamente"
                }
              });
            } else {
              const [{ id_CalculoEquiposBase }] = updated;
              [ajustUpdated] = await PricingDB.getEquipmentsBaseByID(id_CalculoEquiposBase);
            }
          } else if (type === 'services') {

            /*
             * const { upliftPercent, finPercent, viatic, provision } = values;
             * const idOffer = values.id;
             * const [
             *   updated,
             *   logAjust
             * ] = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARAJUSTECALCULOSERVICIOSTSS" (${upliftPercent}, ${finPercent}, ${viatic}, ${provision}, ${idOffer}, ${id_Bitacora});`);
             */
            const logAjust = await PricingDB.createLogServicesTssOfferAjust(values, id_Bitacora);
            const updated = await PricingDB.updateServicesTssAjustByID(values);
            if (!updated.length || !logAjust.length) {
              return res.status(404).send({
                status: 404,
                success: false,
                payload: {
                  message: "Ocurrío un error interno intentando actualizar las ofertas, por favor intentelo nuevamente"
                }
              });
            } else {
              const [{ id_CalculoServicios }] = updated;
              [ajustUpdated] = await PricingDB.getServicesTssByID(id_CalculoServicios);
              console.log(ajustUpdated);
            }
          } else if (type === 'spareParts') {

            /*
             * const { id_CalculoSparePartes, shippingPercent, upliftPercent, finPercent, provision, interest } = values;
             * const [
             *   updated,
             *   logAjust
             * ] = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARAJUSTECALCULOSPAREPARTES" (${shippingPercent}, ${upliftPercent}, ${finPercent}, ${provision}, ${interest}, ${id_CalculoSparePartes}, ${id_Bitacora});`);
             */
            const logAjust = await PricingDB.createLogSparePartsOfferAjust(values, id_Bitacora);
            const updated = await PricingDB.updateSparePartsAjustByID(values);
            if (!updated.length || !logAjust.length) {
              return res.status(404).send({
                status: 404,
                success: false,
                payload: {
                  message: "Ocurrío un error interno intentando actualizar las ofertas, por favor intentelo nuevamente"
                }
              });
            } else {
              const [{ id_CalculoSparePartes }] = updated;
              [ajustUpdated] = await PricingDB.getSparePartsByID(id_CalculoSparePartes);
              console.log(ajustUpdated);
            }
          }
          // for (const element of servicesLoad) {
          //   const { upliftPercent, finPercent, viatic, provision } = element;
          //   const idOffer = element.id;
          //   const [
          //     updated,
          //     logAjust
          //   ] = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARAJUSTECALCULOSERVICIOSTSS" (${upliftPercent}, ${finPercent}, ${viatic}, ${provision}, ${idOffer}, ${idLog});`);
          //   if (!updated.length || !logAjust.length) {
          //     return res.status(404).send({
          //       status: 404,
          //       success: false,
          //       payload: {
          //         message: "Ocurrío un error interno intentando actualizar las ofertas, por favor intentelo nuevamente"
          //       }
          //     });
          //   }
          // }
          // for (const element of sparePartsLoad) {
          //   const { id_CalculoSparePartes, shippingPercent, upliftPercent, finPercent, provision, interest } = element;
          //   const [
          //     updated,
          //     logAjust
          //   ] = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARAJUSTECALCULOSPAREPARTES" (${shippingPercent}, ${upliftPercent}, ${finPercent}, ${provision}, ${interest}, ${id_CalculoSparePartes}, ${idLog});`);
          //   if (!updated.length || !logAjust.length) {
          //     return res.status(404).send({
          //       status: 404,
          //       success: false,
          //       payload: {
          //         message: "Ocurrío un error interno intentando actualizar las ofertas, por favor intentelo nuevamente"
          //       }
          //     });
          //   }
          // }
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Calculos de la oferta actualizadas exitosamente",
              ajustUpdated,
              type
            }
          });
        }
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!"
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async updateVariableMasterDataById(req, res) {
    try {
      const { user: { IDCOLABC, NOMBRE }, decoded } = req;
      const { id } = req.params;
      const { value } = req.body;
      if (id && value && IDCOLABC && NOMBRE && decoded) {
        // const updated = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARVARIABLEMASTERDATA" (${id}, ${value}, ${IDCOLABC}, '${decoded}', '${NOMBRE}');`);
        await PricingDB.createLogMasterDataVariable('Actualización del valor de la variable', IDCOLABC, decoded, NOMBRE, value, id);
        const updated = await PricingDB.updateMasterDataVariableByID(value, id);
        if (!updated.length) {
          res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Ocurrío un error interno, al intentar actualizar el valor de la variable`
            }
          });
        } else {
          const [row] = await PricingDB.getAllMasterDataVariableByID(id);
          row.createdAt = moment(row.createdAt).
            utc().
            utcOffset(-300).
            locale("es").
            format();
          row.updatedAt = moment(row.updatedAt).
            utc().
            utcOffset(-300).
            locale("es").
            format();
          res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `El valor de la variable fue actualizado exitosamente`,
              updated: row,
              id,
            }
          });
        }
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!"
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async updateStatePricerListById(req, res) {
    try {
      const { decoded } = req;
      const { id, state } = req.params;
      const { comment, description } = req.body;
      console.log(req.body);
      if (id && state && description) {
        // const updated = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARREQUERIMIENTOENPRICING" (${id}, ${state}, '${description}', '${comment}', '${decoded}');`);
        const updated = await PricingDB.updateStatusPricingListByID(state, id);
        await PricingDB.createLogWithCommentOfferAjustByDigitalRequest(description, comment, decoded, id);
        if (!updated.length) {
          res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Ocurrío un error interno, al intentar actualizar la oportunidad en pricing`
            }
          });
        } else {
          res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `El estado fue actualizado exitosamente`,
            }
          });
        }
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!"
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  downloadCalsOfferByType(req, res) {
    try {
      // const { dataOffer, name } = req.body;
      const { equipmentsCalc, servicesCalc, sparePartsCalc, name } = req.body;
      if (equipmentsCalc && servicesCalc && sparePartsCalc && name) {
        if (!equipmentsCalc.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `No se logro descargar la información del modelo seleccionado`
            }
          });
        } else {
          // const xls = json2xls(dataOffer);
          const xls = xlsx.build([
            {
              name: "Equipos Base",
              data: equipmentsCalc
            },
            {
              name: "Servicios Tss",
              data: servicesCalc
            },
            {
              name: "Spare y Partes",
              data: sparePartsCalc
            },
          ]);
          try {
            const path = `src/assets/files/Pricing/OffersExported`;
            if (!fs.existsSync(path)) {
              fs.mkdirSync(path);
            }
            const path2 = `${path}/${moment().format('DD-MM-YYYY_H-mm-ss')}`;
            if (!fs.existsSync(path2)) {
              fs.mkdirSync(path2);
            }
            fs.writeFileSync(`${path2}/${name}.xlsx`, xls, 'binary');
            res.download(
              `${path2}/${name}.xlsx`,
              `${name}.xlsx`,
              (err) => {
                if (err) {

                  /*
                   * Handle error, but keep in mind the response may be partially-sent
                   * so check res.headersSent
                   */
                  console.log(`Error descargando el archivo adjuntado ${name}`);

                } else {
                  // decrement a download credit, etc.
                  console.log('Se descargo la plantilla');
                }
              });
          } catch (error) {
            console.log(error.stack);
            return res.status(500).send({
              status: 500,
              success: false,
              payload: {
                message: `No se logro descargar la información del modelo seleccionado`
              }
            });
          }
        }
      } else {
        return res.status(422).send({
          status: 422,
          success: false,
          payload: {
            message: "¡Faltan argumentos, no pueden ser nulos o indefinidos!"
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }
}