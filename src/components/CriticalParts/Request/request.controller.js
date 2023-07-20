/* eslint-disable max-lines */
/* eslint-disable guard-for-in */
/* eslint-disable no-unmodified-loop-condition */
/* eslint-disable operator-linebreak */
/* eslint-disable complexity */
/* eslint-disable operator-assignment */
/* eslint-disable prefer-destructuring */
/* eslint-disable max-params */
/* eslint-disable no-sync */
/* eslint-disable max-depth */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-nested-ternary */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
import fs from 'fs';
import json2xls from 'json2xls';
import pdf from 'html-pdf';
import moment from "moment";
import "moment/locale/es";
import DB2 from "../../../db/db2";
import { renderEmailRequestSalesRep, renderEmailRequestPlanner, renderEmailRequestPlannerJTR, renderEmailRejectedPricing, renderResumeListPdf, renderFrusPartsPdf, renderSparePdf } from "../../../helpers/renderContent";
import SendMail from '../../../helpers/sendEmail';
import WebService from './../../../helpers/webService';
import DigitalRequestDB from '../../../db/Sales/DigitalRequestDB';
import EngineersDB from "../../../db/Sales/EngineersDB";
import CONFIG from '../../../config/config';

const options = {
  format: 'Letter',
  orientation: 'landscape',
  type: "pdf",
};

const keys = [
  "country",
  "typeModel",
  "amountMaintenance",
  "validWarranty",
  "idOfficeHours",
  "idTimeChangePart",
  "idValidityService",
  "idAutomaticRenewal",
  "idEquipmentParts"
];

const notifyPlanner = async (opp, state, idRequest, createdBy, parts, customer, comment) => {
  const subject = 'Solicitud de recurso para Opp de ventas';
  let content = ``;
  if (state === 5) {
    let serviceOrder = 'Sin Orden de Servicio';
    const servicesOrder = await DigitalRequestDB.getServiceOrderByDigitalRequest(idRequest);
    if (servicesOrder.length) {
      [{ serviceOrder }] = servicesOrder;
    }
    content = `Por favor asignar un recurso para obtener la configuración de los equipos que corresponden al número de OPP <strong>${opp}</strong>, para el cliente <strong>${customer}</strong>, creado por  el usuario <strong>${createdBy}</strong> y número de orden de servicio <strong>${serviceOrder}</strong>. Agradecemos su colaboración ingresando a Smart & Simple`;
  } else if (state === 6) {
    content = `Por favor asignar un recurso para identificar las Partes críticas y los FRUs que corresponden al número de OPP <strong>${opp}</strong>, para el cliente <strong>${customer}</strong>, creado por  el usuario <strong>${createdBy}</strong>. Agradecemos su colaboración ingresando a Smart & Simple`;
  }
  const html = renderEmailRequestPlanner(subject, content, parts, state === 5 ? comment : null);
  const emailSended = await SendMail.sendMailMaintenance(
    html,
    subject,
    [], // attachments
    'oficina_de_planificacion@gbm.net', // to oficina_de_planificacion@gbm.net
    createdBy // cc
  );
  return emailSended;
};

const notifyPlannersJTR = async (id, opp, createdBy, infoParts, engineer) => {
  const [comment] = await EngineersDB.getCommentEngineerByDigitalRequest(id, 1);
  const html = renderEmailRequestPlannerJTR(opp, createdBy.split("@")[0], infoParts, engineer, comment ? comment.comment : 'N/A');
  const emailSended = await SendMail.sendMailMaintenance(
    html,
    'Requerido validación de JTR para Opp de ventas',
    [], // attachments
    'oficina_de_planificacion@gbm.net', // to oficina_de_planificacion@gbm.net
    createdBy // cc
  );
  return emailSended;
};

const notifyInventories = async (opp, createdBy) => {
  const subject = `Cotización de partes Criticas Opp ${opp}`;
  const content = `Por favor proceder a cotizar las partes críticas que corresponden al número de OPP <strong>${opp}</strong>, creado por  el usuario <strong>${createdBy ? createdBy.split("@")[0] : 'N/A'}</strong>. Agradecemos su colaboración ingresando a Smart & Simple`;
  const html = renderEmailRequestSalesRep(subject, content);
  const emailSended = await SendMail.sendMailMaintenance(
    html,
    subject,
    [], // attachments
    'adm_inventarios@gbm.net', // to adm_inventarios@gbm.net
    '' // cc
  );
  return emailSended;
};

const notifySalesRep = async (opp, createdBy) => {
  const to = createdBy ? createdBy.toLowerCase() : '';
  const subject = `Cotización Finalizada Opp ${opp}`;
  const content = `Estimado usuario <strong>${createdBy ? createdBy.split("@")[0] : 'N/A'}</strong>, se ha finalizado la cotización correspondiente a la OPP <strong>${opp}</strong>. Agradecemos su colaboración ingresando a Smart & Simple`;
  const html = renderEmailRequestSalesRep(subject, content);
  const emailSended = await SendMail.sendMailMaintenance(
    html,
    subject,
    [], // attachments
    to, // to oficina_de_adm_inventarios@gbm.net
    '' // cc
  );
  return emailSended;
};

const notifySalesRepByEngineer = async (opp, createdBy, engineer, comment) => {
  const to = createdBy ? createdBy.toLowerCase() : '';
  const subject = `Validación de Partes Rechazado ${opp}`;
  const content = `Estimado usuario <strong>${createdBy ? createdBy.split("@")[0] : 'N/A'}</strong>, se ha rechazado la validación de partes correspondiente a la OPP <strong>${opp}</strong>, por el ingeniero <strong>${engineer}</strong>, Comentario: <strong>${comment ? comment.comment : 'N/A'}</strong>. Agradecemos su colaboración ingresando a Smart & Simple`;
  const html = renderEmailRequestSalesRep(subject, content);
  const emailSended = await SendMail.sendMailMaintenance(
    html,
    subject,
    [], // attachments
    to,
    '' // cc
  );
  return emailSended;
};

const notifySalesRepByPrincing = async (opp, createdBy, state, log) => {
  const to = createdBy ? createdBy.toLowerCase() : '';
  const subject = `Ajuste de oferta ${state === 11 ? 'Rechazado' : 'Finalizado'} para Opp ${opp}`;
  const content = `Estimado usuario <strong>${createdBy ? createdBy.split("@")[0] : 'N/A'}</strong>. El ajuste para la oferta fue ${state === 11 ? 'Rechazado' : 'Finalizado'} por pricing, correspondiente al número de OPP <strong>${opp}</strong>. Agradecemos su colaboración ingresando a Smart & Simple, para ejecutar las acciones respectivas`;
  const html = renderEmailRejectedPricing(subject, content, log);
  const emailSended = await SendMail.sendMailMaintenance(
    html,
    subject,
    [], // attachments
    to, // to oficina_de_adm_inventarios@gbm.net
    '' // cc
  );
  return emailSended;
};

const notifyPricing = async (country, opp, createdBy) => {
  const subject = `${country} Solicitud de ajuste Opp ${opp}`;
  const content = `Tiene una solicitud pendiente de aprobación, correspondiente al número de OPP <strong>${opp}</strong>, creado por  el usuario <strong>${createdBy ? createdBy.split("@")[0] : 'N/A'}</strong>. Agradecemos su colaboración ingresando a Smart & Simple`;
  const html = renderEmailRequestSalesRep(subject, content);
  const emailSended = await SendMail.sendMailMaintenance(
    html,
    subject,
    [], // attachments
    'oficina_de_pricing@gbm.net', // to oficina_de_pricing@gbm.net
    '' // cc
  );
  return emailSended;
};

const createResumeFile = (html, path, opp) => new Promise((resolve, reject) => {
  const {
    opportunityNumber,
    version,
    date
  } = opp;
  pdf.create(html, options).toFile(`${path}/Resumen_Opp_${opportunityNumber}_Version_${version.trim()}.pdf`, (err, response) => {
    if (err) {
      console.log(`Error creando resumen: ${err}`);
      reject([]);
    } else {
      console.log(`Resumen creado en la ruta ${JSON.stringify(response)}`);
      resolve([
        {
          filename: `Resumen_Opp_${opportunityNumber}_Version_${version.trim()}.pdf`,
          path: `${path}/Resumen_Opp_${opportunityNumber}_Version_${version.trim()}.pdf`,
          contentType: 'application/pdf'
        }
      ]);
    }
  });
});

const createListFrusPartNumbersPDF = (html, path, opp, type) => new Promise((resolve, reject) => {
  const {
    opportunityNumber,
    version,
    date
  } = opp;
  const name = `${type === 'frus' ? `FRUs_Opp_${opportunityNumber}_Version_${version.trim()}` : `PartNumber_Opp_${opportunityNumber}_Version_${version.trim()}`}`;
  pdf.create(html, options).toFile(`${path}/${name}.pdf`, (err, response) => {
    if (err) {
      console.log(`Error creando resumen: ${err}`);
      reject([]);
    } else {
      console.log(`Lista de partes creado en la ruta ${JSON.stringify(response)}`);
      resolve([
        {
          filename: `${name}.pdf`,
          path: `${path}/${name}.pdf`,
          contentType: 'application/pdf'
        }
      ]);
    }
  });
});

const createListFrusPartNumbers = (frus, partNumbers, path, opp) => new Promise((resolve, reject) => {
  const attach = [];
  const {
    opportunityNumber,
    version,
    date
  } = opp;
  try {
    if (partNumbers.length) {
      const xlsParts = json2xls(partNumbers);
      fs.writeFileSync(`${path}/PartNumber_Opp_${opportunityNumber}_Version_${version.trim()}.xlsx`, xlsParts, 'binary');
      attach.push({
        filename: `PartNumber_Opp_${opportunityNumber}_Version_${version.trim()}.xlsx`,
        path: `${path}/PartNumber_Opp_${opportunityNumber}_Version_${version.trim()}.xlsx`
      });
    }
    if (frus.length) {
      const xlsFrus = json2xls(frus);
      fs.writeFileSync(`${path}/FRUs_Opp_${opportunityNumber}_Version_${version.trim()}.xlsx`, xlsFrus, 'binary');
      attach.push({
        filename: `FRUs_Opp_${opportunityNumber}_Version_${version.trim()}.xlsx`,
        path: `${path}/FRUs_Opp_${opportunityNumber}_Version_${version.trim()}.xlsx`
      });
    }
    resolve(attach);
  } catch (err) {
    reject(attach);
  }
});

const consolidateAmountEquipments = (equipments) => {
  const consolidate = [];
  console.log(equipments);
  for (const equipment of equipments) {
    const index = consolidate.findIndex((row) => row.country === equipment.country && row.typeModel === equipment.typeModel && row.amountMaintenance === equipment.amountMaintenance && row.validWarranty === equipment.validWarranty && row.idOfficeHours === equipment.idOfficeHours && row.idTimeChangePart === equipment.idTimeChangePart && row.idValidityService === equipment.idValidityService && row.idAutomaticRenewal === equipment.idAutomaticRenewal && row.idEquipmentParts === equipment.idEquipmentParts && row.serial === equipment.serial);
    console.log(index);
    if (index < 0) {
      equipment.amount = 1;
      consolidate.push(equipment);
    } else {
      consolidate[index].amount = consolidate[index].amount + 1;
    }
  }
  console.log(consolidate);
  return consolidate;
};

export default class DigitalRequestComponent {

  async findFormValuesRequestOpportunity(req, res) {
    try {
      const {
        idOpportunity
      } = req.params;
      if (idOpportunity) {
        const request = await DigitalRequestDB.getRequestByOpportunityNumber(idOpportunity);
        if (request.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El número de oportunidad ingresado ya fue asociado a un requerimiento"
            }
          });
        } else {
          const typeSupport = await DigitalRequestDB.getTypeSupportsAvailble();
          const businessModel = await DigitalRequestDB.getBusinessModelsAvailble();
          const operatingSystemType = await DigitalRequestDB.getOperatingSystemTypeAvailble();
          const officeHours = await DigitalRequestDB.getOfficeHoursAvailble();
          const responseTime = await DigitalRequestDB.getResponseTimeAvailble();
          const timeChangePart = await DigitalRequestDB.getTimeChangePartAvailble();
          const validityService = await DigitalRequestDB.getValidityServiceAvailble();
          const wayPay = await DigitalRequestDB.getWayPayAvailble();
          const physicalLocation = await DigitalRequestDB.getPhysicalLocationAvailble();
          const equipmentServiceCenter = await DigitalRequestDB.getEquipmentServiceCenterAvailble();
          const amountMaintenance = await DigitalRequestDB.getAmountMaintenanceAvailble();
          const scheduleMaintenance = await DigitalRequestDB.getScheduleMaintenanceAvailble();
          const oppDetail = await WebService.getOpportunityDetail(CONFIG.APP, idOpportunity);
          console.log(oppDetail);
          const {
            Dates: { Start },
            Detail: { Prospect },
            OrgData: { SalesOrgU },
            SalesTeams: { SRepresentative, EResponsible },
            SalesCicle: { Status }
          } = oppDetail;
          if (Start === "0000-00-00") {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "El número de oportunidad ingresado no es válido"
              }
            });
          } else if (!Status || Status !== "Open") {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "La oportunidad no se encuentra abierta"
              }
            });
          } else {
            const countries = [
              "CR",
              "DO",
              "DR",
              "GT",
              "HN",
              "NI",
              "PA",
              "SV"
            ];
            const country = SalesOrgU.split("_")[1] ? SalesOrgU.split("_")[1] : SalesOrgU.substr(-2, 2);
            if (!countries.some((row) => row === country)) {
              return res.status(404).send({
                status: 404,
                success: false,
                payload: {
                  message: `El país ${country} asociado a la Opp ingresada, no es un país válido!`
                }
              });
            } else {
              return res.status(200).send({
                status: 200,
                success: true,
                payload: {
                  data: {
                    values: {
                      amountMaintenance,
                      equipmentServiceCenter,
                      officeHours,
                      operatingSystemType,
                      physicalLocation,
                      responseTime,
                      scheduleMaintenance,
                      timeChangePart,
                      typeSupport,
                      validityService,
                      wayPay,
                      businessModel,
                    },
                    initialValues: {
                      opportunityNumber: idOpportunity,
                      customer: Prospect,
                      salesRep: SRepresentative,
                      requestedExecutive: EResponsible,
                      amountOfEquipment: 0,
                      applicationNotes: '',
                      amountOfEquipmentIn: 0,
                      amountOfEquipmentOut: 0,
                      localtionNotes: '',
                      typeSupport: '0',
                      typeSupportCisco: '0',
                      operatingSystemType: '0',
                      officeHours: '0',
                      responseTime: '0',
                      timeChangePart: '0',
                      validityService: '0',
                      wayPay: '0',
                      physicalLocation: '0',
                      equipmentServiceCenterOut: '0',
                      equipmentServiceCenterIn: '0',
                      amountMaintenance: '0',
                      scheduleMaintenance: '0',
                      businessModel: '0',
                      country: country === 'DO' ? 'DR' : country,
                    }
                  },
                  message: `La información fue cargada exitosamente.`
                }
              });
            }
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async findFormValuesEquipmentsRequest(req, res) {
    try {
      const officeHours = await DigitalRequestDB.getOfficeHoursAvailble();
      const timeChangePart = await DigitalRequestDB.getTimeChangePartAvailble();
      const validityService = await DigitalRequestDB.getValidityServiceAvailble();
      const automaticRenewal = await DigitalRequestDB.getAutomaticRenewalAvailble();
      const practices = await DigitalRequestDB.getPracticesAvailble();
      const platforms = await DigitalRequestDB.getPlatformsAvailble();
      const includesParts = await DigitalRequestDB.getIncludesPartsAvailble();
      const coverageLevel = await DigitalRequestDB.getCoverageLevelAvailble();
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          data: {
            coverageLevel,
            officeHours,
            automaticRenewal,
            timeChangePart,
            validityService,
            practices,
            platforms,
            includesParts,
          },
          message: `La información fue cargada exitosamente.`
        }
      });
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async findRequestsByUser(req, res) {
    try {
      const { user: { EMAIL } } = req;
      if (EMAIL) {
        const requests = await DigitalRequestDB.getDigitalRequestByUser(EMAIL);
        if (!requests.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "Al día de hoy, no tienes ningún requerimiento creado"
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Los requerimientos fueron cargados exitosamente.",
              requests: requests.map((row) => {
                row.createdBy = row.createdBy.split("@")[0];

                /*
                 * row.createdAt = moment(row.createdAt).
                 *   utc().
                 *   utcOffset(-300).
                 *   locale("es").
                 *   format();
                 * row.updatedAt = row.updatedAt ? moment(row.updatedAt).
                 *   utc().
                 *   utcOffset(-300).
                 *   locale("es").
                 *   format() : null;
                 */
                return row;
              })
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async findActivityFlowRequest(req, res) {
    try {
      const {
        id
      } = req.params;
      if (id) {
        const activityFlow = await DigitalRequestDB.getActivitiesFlowByDigitalRequest(id);
        if (!activityFlow.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `El requerimiento seleccionado, no cuenta con un flujo de actividades`
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `Se cargo exitosamente el flujo de actividades del requerimiento seleccionado`,
              activityFlow: activityFlow.map((row) => {
                row.createdAt = moment(row.createdAt).
                  utc().
                  utcOffset(-300).
                  locale("es").
                  format();
                return row;
              })
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async findEquipmentsByRequest(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const ibmEquipments = await DigitalRequestDB.getEquipmentsIBMByDigitalRequest(id);
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: "Lista de equipos cargadas del requerimiento",
            ibmEquipments,
            ciscoEquipments: []
          }
        });
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async findEquipmentsCreatedByRequest(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const equipments = await DigitalRequestDB.getEquipmentsIBMCretedByDigitalRequest(id);
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: "Lista de equipos cargadas del requerimiento",
            equipments,
          }
        });
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async findEquipmentsSpareByRequest(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const equipments = await DigitalRequestDB.getEquipmentsSpareByDigitalRequest(id);
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: "Lista de equipos cargadas del requerimiento",
            equipments,
          }
        });
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async findReferencesByRequest(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const references = await DigitalRequestDB.getReferencesByDigitalRequest(id);
        if (!references.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El requerimiento seleccionado, aun no cuenta con referencias",
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Se cargaron exitosamente las referencias agregadas al requerimiento seleccionado",
              references: references.map((row) => {
                row.createdAt = moment(row.createdAt).
                  utc().
                  utcOffset(-300).
                  locale("es").
                  format();
                return row;
              })
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async findReferencesSpareByRequest(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const references = await DigitalRequestDB.getReferencesSpareByDigitalRequest(id);
        if (!references.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El requerimiento seleccionado, aun no cuenta con referencias",
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Se cargaron exitosamente las referencias agregadas a los equipos spare",
              references: references.map((row) => {
                row.createdAt = moment(row.createdAt).
                  utc().
                  utcOffset(-300).
                  locale("es").
                  format();
                return row;
              })
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async findJustificationsByRequest(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const justifications = await DigitalRequestDB.getJustificationsByDigitalRequest(id);
        if (!justifications.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El requerimiento seleccionado, aun no cuenta con justificaciones",
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Se cargaron exitosamente las justificaciones agregadas al requerimiento seleccionado",
              justifications: justifications.map((row) => {
                row.createdAt = moment(row.createdAt).
                  utc().
                  utcOffset(-300).
                  locale("es").
                  format();
                return row;
              })
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async findConfigurationsByRequest(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const configurations = await DigitalRequestDB.getConfigurationsByDigitalRequest(id);
        if (!configurations.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El requerimiento seleccionado, aun no cuenta con configuraciones adjuntadas",
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Se cargaron exitosamente las configuraciones agregadas al requerimiento seleccionado",
              comments: await DigitalRequestDB.getCommentsConfigurationByDigitalRequest(id),
              configurations: configurations.map((row) => {
                row.createdAt = moment(row.createdAt).
                  utc().
                  utcOffset(-300).
                  locale("es").
                  format();
                return row;
              })
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async findResumeOffersRequestById(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const [request] = await DigitalRequestDB.getDigitalRequestByID(id);
        const equipments = await DigitalRequestDB.getEquipmentsBaseOfferByDigitalRequest(id);
        const servicesTss = await DigitalRequestDB.getServicesTssOfferByDigitalRequest(id);
        const spareParts = await DigitalRequestDB.getSparePartsOfferByDigitalRequest(id);
        const partByEquipment = await DigitalRequestDB.getPartsEquipmentsIBMByDigitalRequest(id);
        const equipmentsDetail = await DigitalRequestDB.getEquipmentsDetailOfferByDigitalRequest(id, request.idBusinessModel);
        if (!equipments.length) {
          res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Al día de hoy, no hay registros de ofertas para el requerimiento`
            }
          });
        } else {
          res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `Los registros de actividad fueron cargadas exitosamente.`,
              resume: [
                equipments,
                servicesTss,
                spareParts,
                equipmentsDetail,
                partByEquipment
              ],
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async findLastVersionByRequest(req, res) {
    try {
      const { opp } = req.params;
      if (opp) {
        const version = await DigitalRequestDB.getLastVersionByDigitalRequest(opp);
        if (!version.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Ocurrío un error interno, intentando encontrar el ultimo número de versión relacionado a la opp ${opp}`
            }
          });
        } else {
          const [{ lastVersion }] = version;
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `Se encontro la última versión de la opp ${opp} exitosamente`,
              lastVersion,
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async findOptionsRequestToVersion(req, res) {
    try {
      const officeHours = await DigitalRequestDB.getOfficeHoursAvailble();
      const validityService = await DigitalRequestDB.getValidityServiceAvailble();
      const wayPay = await DigitalRequestDB.getWayPayAvailble();
      const physicalLocation = await DigitalRequestDB.getPhysicalLocationAvailble();
      const equipmentServiceCenter = await DigitalRequestDB.getEquipmentServiceCenterAvailble();
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: `Se cargaron las opciones para el versionamiento`,
          options: {
            wayPay,
            officeHours,
            validityService,
            physicalLocation,
            equipmentServiceCenter,
          },
        }
      });
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async createRequirements(req, res) {
    try {
      const { values } = req.body;
      const { user: { EMAIL } } = req;
      if (Object.keys(values).length) {
        const request = await DigitalRequestDB.createNewDigitalRequest(values, EMAIL);
        if (request.length) {
          const [{ id_Requerimiento }] = request;
          await DigitalRequestDB.createActivitieFlow('Creación del requerimiento', 'Iniciado', EMAIL, id_Requerimiento);
          const requestCreated = await DigitalRequestDB.getDigitalRequestCreatedByID(id_Requerimiento);
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              requestCreated: requestCreated.map((row) => {
                row.createdAt = moment(row.createdAt).
                  utc().
                  utcOffset(-300).
                  locale("es").
                  format("DD/MM/YYYY HH:mm:ss");
                return row;
              }),
              message: `La información fue cargada exitosamente.`
            }
          });
        } else {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "¡Ocurrio un error creando el requerimiento en la base de datos!"
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async createOneEquipment(req, res) {
    try {
      const {
        id
      } = req.params;
      const {
        type,
        values
      } = req.body;
      if (id && type && Object.keys(values).length) {
        if (type === "IBM") {
          const kitCriticalParts = await DigitalRequestDB.getCriticalPartsKitDigitalRequest(values.typeModel);
          if (!kitCriticalParts.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: `El modelo ingresado no es válido en la matriz de partes críticas actual.`
              }
            });
          } else {
            const equipmentCreated = await DigitalRequestDB.createEquipmentIBM(values, id);
            if (!equipmentCreated.length) {
              return res.status(404).send({
                status: 404,
                success: false,
                payload: {
                  message: `Lamentablemente el equipo no fue creado exitosamente.`
                }
              });
            } else {
              const [{ id_Equipo }] = equipmentCreated;
              return res.status(200).send({
                status: 200,
                success: true,
                payload: {
                  message: `El equipo ha sido creado exitosamente.`,
                  equipment: await DigitalRequestDB.getEquipmentIBMByID(id_Equipo),
                  type,
                  initialValues: {
                    country: null,
                    typeModel: null,
                    serie: null,
                    platform: null,
                    practice: null,
                    officeHours: "0",
                    timeChangePart: "0",
                    validityService: "0",
                    automaticRenewal: "0",
                    criticalParts: "0",
                    price: null,
                    test: null
                  }
                }
              });
            }
          }
        } else if (type === "CISCO") {
          const { serial, productNumber, description, officeHours, validityService, coverageLevel, price } = values;
          const equipmentCreated = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTAREQUIPOCISCO" ('${serial}', '${productNumber}', '${description}', ${price ? price : 0}, ${officeHours}, ${coverageLevel}, ${validityService}, ${id});`);
          console.log(equipmentCreated);
          if (!equipmentCreated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: `Lamentablemente el equipo no fue creado exitosamente.`
              }
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: `El equipo ha sido creado exitosamente.`,
                equipment: equipmentCreated,
                type,
                initialValues: {
                  country: null,
                  productNumber: null,
                  description: null,
                  serial: null,
                  typeModel: null,
                  serie: null,
                  platform: null,
                  officeHours: "0",
                  timeChangePart: "0",
                  validityService: "0",
                  automaticRenewal: "0",
                  criticalParts: "0",
                  coverageLevel: "0",
                  price: null,
                  test: null
                }
              }
            });
          }
        } else {
          return res.status(409).send({
            status: 409,
            success: false,
            payload: {
              message: "El tipo de equipo que intentas crear, no es válido."
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async createManyEquipment(req, res) {
    try {
      const {
        id
      } = req.params;
      const {
        equipments,
        type
      } = req.body;
      if (id && equipments.length && type) {
        const created = [];
        const errors = [];
        for (const element of equipments) {
          if (type === 'IBM') {
            const {
              TipoModelo,
            } = element;
            const kitCriticalParts = await DigitalRequestDB.getCriticalPartsKitDigitalRequest(TipoModelo);
            if (!kitCriticalParts.length) {
              element.msg = 'El modelo ingresado no es válido en la matriz de partes críticas actual.';
              errors.push(element);
            }
          }
        }
        if (errors.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Se deben corregir los equipos que se encuentran invalidos para poder crearlos`,
              created,
              errors,
              type
            }
          });
        } else {
          for (const element of equipments) {
            if (type === 'IBM') {
              const {
                CantidadEquipos,
                CantidadMantenimientos,
                // Descripcion,
                HorarioAtencion,
                IncluyePartesEquipos,
                Pais,
                Plataforma,
                Precio,
                Practica,
                RenovacionAutomatica,
                Serie,
                TiempoCambioParte,
                TipoModelo,
                Viaticos,
                GarantiaVigente,
                AñosServicio,
              } = element;
              const practice = await DigitalRequestDB.getIDPracticeByName(Practica);
              const platform = await DigitalRequestDB.getIDPlatformByName(Plataforma);
              const officeHour = await DigitalRequestDB.getIDOfficeHoursByName(HorarioAtencion);
              const timeChangePart = await DigitalRequestDB.getIDTimeChangePartByName(TiempoCambioParte);
              const validityService = await DigitalRequestDB.getIDValidityServiceByName(AñosServicio);
              const automaticRenewal = await DigitalRequestDB.getIDAutomaticRenewalByName(RenovacionAutomatica);
              const equipmentParts = await DigitalRequestDB.getIDEquipmentPartsByName(IncluyePartesEquipos);
              if (practice.length && platform.length && officeHour.length && timeChangePart.length && validityService.length && automaticRenewal.length && equipmentParts.length) {
                const [{ idPractice }] = practice;
                const [{ idPlatform }] = platform;
                const [{ idOfficeHour }] = officeHour;
                const [{ idTimeChangePart }] = timeChangePart;
                const [{ idValidityService }] = validityService;
                const [{ idAutomaticRenewal }] = automaticRenewal;
                const [{ idEquipmentPart }] = equipmentParts;
                const equipment = await DigitalRequestDB.createEquipmentIBM({
                  amountEquipments: CantidadEquipos,
                  amountMaintenance: CantidadMantenimientos,
                  automaticRenewal: idAutomaticRenewal,
                  country: Pais,
                  equipmentParts: idEquipmentPart,
                  officeHours: idOfficeHour,
                  platform: idPlatform,
                  price: Precio,
                  practice: idPractice,
                  serial: Serie,
                  timeChangePart: idTimeChangePart,
                  typeModel: TipoModelo,
                  validityService: idValidityService,
                  validWarranty: GarantiaVigente,
                  viatic: Viaticos
                }, id);
                // const equipment = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARMASIVOEQUIPOSIBM" ('${Pais}', '${TipoModelo}', '${Serie ? Serie : null}', ${CantidadMantenimientos ? CantidadMantenimientos : null}, ${CantidadEquipos ? CantidadEquipos : null}, ${GarantiaVigente}, ${Viaticos}, ${Precio ? Precio : 0}, '${Practica}', '${Plataforma}', '${HorarioAtencion}', '${TiempoCambioParte}', '${AñosServicio}', '${RenovacionAutomatica}', '${IncluyePartesEquipos}', ${id});`);
                if (equipment.length) {
                  created.push(element);
                } else {
                  element.msg = 'Ocurrio un error intentando crear el equipos';
                  errors.push(element);
                }
              } else {
                element.msg = 'Una de las variables ya no se encuentra válida actualmente';
                errors.push(element);
              }
            } else if (type === 'CISCO') {
              const { Serial, NumeroProducto, Descripcion, HorarioAtencion, Vigencia, NivelCobertura, Precio } = element;
              const equipment = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARMASIVOEQUIPOSCISCO" ('${Serial}', '${NumeroProducto}', '${Descripcion}', ${Precio ? Precio : 0}, '${HorarioAtencion}', '${NivelCobertura}', '${Vigencia}', ${id});`);
              console.log(equipment);
              if (equipment.length) {
                created.push(element);
              } else {
                errors.push(element);
              }
            }
          }
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `Se crearon exitosamente ${created.length} de ${equipments.length} equipos`,
              created,
              errors,
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async createEquipmentSpare(req, res) {
    try {
      const {
        id
      } = req.params;
      const {
        partNumber, description, amountEquipments, cost
      } = req.body;
      if (id && partNumber && description && amountEquipments && cost) {
        const equipment = await DigitalRequestDB.createEquipmentSpare(req.body, id);
        if (!equipment.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El equipo spare no pudo ser creado con éxito!"
            }
          });
        } else {
          const [{ id_EquipoSpare }] = equipment;
          const equipmentCreated = await DigitalRequestDB.getEquipmentsSpareByID(id_EquipoSpare);
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "El equipo spare fue creado exitosamente!",
              equipment: equipmentCreated,
              idCreated: id_EquipoSpare
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async createJustifyByRequest(req, res) {
    try {
      const { decoded } = req;
      const { id } = req.params;
      const { justify } = req.body;
      if (id && justify) {
        const createdJustify = await DigitalRequestDB.createJustifyPrices(justify, id, decoded);
        if (!createdJustify.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "No se logro guardar la justificacion con exito"
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Se registro la justificación exitosamente"
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async createCommentaryByRequest(req, res) {
    try {
      const { decoded } = req;
      const { id } = req.params;
      const { commentary, hasConfiguration } = req.body;
      if (id && commentary && (parseInt(hasConfiguration, 10) === 0 || parseInt(hasConfiguration, 10) === 1)) {
        const commentCreated = await DigitalRequestDB.createCommentaryConfig(commentary, hasConfiguration, id, decoded);
        if (!commentCreated.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "No se logro guardar el comentario con exito"
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Se registro el comentario exitosamente"
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async createServiceOrderRequest(req, res) {
    try {
      const { id } = req.params;
      const { serviceOrder } = req.body;
      if (id && serviceOrder) {
        const serviceOrderCreated = await DigitalRequestDB.createServiceOrder(serviceOrder, id);
        if (!serviceOrderCreated.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "No se logro guardar la orden de servicio"
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "La orden de servicio se registro exitosamente"
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async createAjustOfferRequest(req, res) {
    try {
      const { id } = req.params;
      const { provision, justification, type, referencesIds } = req.body;
      if (id && justification && type && referencesIds) {
        const ajust = await DigitalRequestDB.createOfferAjustByDigitalRequest(provision ? provision : null, justification, type, id);
        if (!ajust.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "No se logro realizar el ajuste solicitado al requerimiento"
            }
          });
        } else {
          const [{ id_Ajuste }] = ajust;
          for (const element of referencesIds) {
            const { response: { payload: { idReference } } } = element;
            await DigitalRequestDB.updateReferencesOfferAjust(id_Ajuste, idReference);
          }
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "La solicitud del ajuste a la oferta fue realizado exitosamente"
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async createNewVersionByRequest(req, res) {
    try {
      const { user: { EMAIL } } = req;
      const { id } = req.params;
      const { type, values, newVersion, equipmentsIds, equipmentsAdded } = req.body;
      if (id && type && values && newVersion && EMAIL) {
        const request = await DigitalRequestDB.getDigitalRequestByID(id);
        if (!request.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El requerimiento que está intentando versionar no es válido"
            }
          });
        } else {
          const [
            { state, opportunityNumber, customer, salesRep, requestedExecutive, amountOfEquipment, applicationNotes,
              amountOfEquipmentIn, amountOfEquipmentOut, localtionNotes, country, idTypeSupport, idOperatingSystemType,
              idBusinessModel, idOfficeHours, idResponseTime, idTimeChangePart, idValidityService, idWayPay, idLocationType,
              idDistanceInside, idDistanceOutside, idAmountMaintenance, idScheduleMaintenance }
          ] = request;
          if (parseInt(state, 10) !== 8) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "El requerimiento que está intentando versionar no tiene permitido ser versionado"
              }
            });
          } else {
            const { officeHours, validityService, wayPay } = values;
            if (type === 'addEquipments') {
              // const newVersionCreated = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."CREARNUEVAVERSIONDEREQUERIMIENTOAGREGAREQUIPOS" (${newVersion}, 1, ${opportunityNumber}, '${customer}', '${salesRep}', '${requestedExecutive}', ${amountOfEquipment + values.amountOfEquipment}, '${applicationNotes}', ${amountOfEquipmentIn + parseInt(values.amountOfEquipmentIn, 10)}, ${amountOfEquipmentOut + parseInt(values.amountOfEquipmentOut, 10)}, '${localtionNotes}', '${country}', ${idTypeSupport}, ${idOperatingSystemType}, ${idBusinessModel}, ${type === 'coverage' ? officeHours : idOfficeHours}, ${idResponseTime}, ${idTimeChangePart}, ${type === 'termOfService' ? validityService : idValidityService}, ${type === 'wayPay' ? wayPay : idWayPay}, ${idLocationType}, ${idDistanceInside}, ${idDistanceOutside}, ${idAmountMaintenance}, ${idScheduleMaintenance}, '${EMAIL}', ${id});`);
              const newVersionCreated = await DigitalRequestDB.createNewVersionByDigitalRequest({
                newVersion,
                state: 1,
                opportunityNumber,
                customer,
                salesRep,
                requestedExecutive,
                amountOfEquipment: amountOfEquipment + values.amountOfEquipment,
                applicationNotes,
                amountOfEquipmentIn: amountOfEquipmentIn + parseInt(values.amountOfEquipmentIn, 10),
                amountOfEquipmentOut: amountOfEquipmentOut + parseInt(values.amountOfEquipmentOut, 10),
                localtionNotes,
                country,
                typeSupport: idTypeSupport,
                operatingSystemType: idOperatingSystemType,
                businessModel: idBusinessModel,
                officeHours: type === 'coverage' ? officeHours : idOfficeHours,
                responseTime: idResponseTime,
                timeChangePart: idTimeChangePart,
                validityService: type === 'termOfService' ? validityService : idValidityService,
                wayPay: type === 'wayPay' ? wayPay : idWayPay,
                physicalLocation: idLocationType,
                equipmentServiceCenterIn: idDistanceInside,
                equipmentServiceCenterOut: idDistanceOutside,
                amountMaintenance: idAmountMaintenance,
                scheduleMaintenance: idScheduleMaintenance
              }, EMAIL);
              if (!newVersionCreated.length) {
                return res.status(404).send({
                  status: 404,
                  success: false,
                  payload: {
                    message: "Ocurrío un error interno intentando versionar el requerimiento"
                  }
                });
              } else {
                const [{ newIdRequest }] = newVersionCreated;
                await DigitalRequestDB.createActivitieFlow('Creación del requerimiento', 'Iniciado', EMAIL, newIdRequest);
                await DigitalRequestDB.createCopyEquipmentIBMByDigitalRequestVersioned(newIdRequest, id);
                for (const element of equipmentsAdded) {
                  element.officeHours = element.officeHour;
                  console.log(element);
                  await DigitalRequestDB.createEquipmentIBM(element, newIdRequest);
                }
                const equipments = await DigitalRequestDB.getEquipmentsIBMCretedByDigitalRequest(newIdRequest);
                if (idBusinessModel === 1) {
                  const consolidates = consolidateAmountEquipments(equipments);
                  for (const element of consolidates) {
                    // const { typeModel, amountMaintenance, validWarranty, amount, idAutomaticRenewal, idEquipmentParts } = element;
                    await DigitalRequestDB.createConsolidateEquipmentsIBM(element, newIdRequest);
                  }
                }
                // Asociar partes y frus agregados a los equipos anteriores
                const equipmentsByPart = await EngineersDB.getEquipmentsConsolidatesByDigitalRequest(idBusinessModel, newIdRequest);
                for (const element of equipmentsByPart) {
                  console.log(element);
                  const [equipment] = await EngineersDB.findEquipmentIdByModelAndRequest(element.typeModel, idBusinessModel, id);
                  console.log(equipment);
                  if (equipment) {
                    await DigitalRequestDB.createCopyPartsEquipmentIBMByDigitalRequest(newIdRequest, equipment.idE, element.id);
                  }
                }
                await DigitalRequestDB.createActivitiesFlowByDigitalRequest('Carga de la lista de Equipos al requerimiento', 'Equipos Cargados', EMAIL, newIdRequest);
                return res.status(200).send({
                  status: 200,
                  success: true,
                  payload: {
                    message: "El requerimiento se versiono exitosamente",
                    newIdRequest,
                  }
                });
              }
            } else if (type === 'updateEquipments') {
              const newVersionCreated = await DigitalRequestDB.createNewVersionByDigitalRequest({
                newVersion,
                state: 0,
                opportunityNumber,
                customer,
                salesRep,
                requestedExecutive,
                amountOfEquipment,
                applicationNotes,
                amountOfEquipmentIn,
                amountOfEquipmentOut,
                localtionNotes,
                country,
                typeSupport: idTypeSupport,
                operatingSystemType: idOperatingSystemType,
                businessModel: idBusinessModel,
                officeHours: type === 'coverage' ? officeHours : idOfficeHours,
                responseTime: idResponseTime,
                timeChangePart: idTimeChangePart,
                validityService: type === 'termOfService' ? validityService : idValidityService,
                wayPay: type === 'wayPay' ? wayPay : idWayPay,
                physicalLocation: idLocationType,
                equipmentServiceCenterIn: idDistanceInside,
                equipmentServiceCenterOut: idDistanceOutside,
                amountMaintenance: idAmountMaintenance,
                scheduleMaintenance: idScheduleMaintenance
              }, EMAIL);
              if (!newVersionCreated.length) {
                return res.status(404).send({
                  status: 404,
                  success: false,
                  payload: {
                    message: "Ocurrío un error interno intentando versionar el requerimiento"
                  }
                });
              } else {
                const [{ newIdRequest }] = newVersionCreated;
                await DigitalRequestDB.createActivitieFlow('Creación del requerimiento', 'Iniciado', EMAIL, newIdRequest);
                await DigitalRequestDB.createCopyEquipmentIBMByDigitalRequestVersioned(newIdRequest, id);
                const equipments = await DigitalRequestDB.getEquipmentsIBMCretedByDigitalRequest(newIdRequest);
                // if (idBusinessModel === 1) {
                //   const consolidates = consolidateAmountEquipments(equipments);
                //   for (const element of consolidates) {
                //     // const { typeModel, amountMaintenance, validWarranty, amount, idAutomaticRenewal, idEquipmentParts } = element;
                //     await DigitalRequestDB.createConsolidateEquipmentsIBM(element, newIdRequest);
                //   }
                // }
                await DigitalRequestDB.createActivitiesFlowByDigitalRequest('Carga de la lista de Equipos al requerimiento', 'Equipos Cargados', EMAIL, newIdRequest);
                return res.status(200).send({
                  status: 200,
                  success: true,
                  payload: {
                    message: "El requerimiento se versiono exitosamente",
                    newIdRequest,
                  }
                });
              }
            } else {
              const oldEquipments = await DigitalRequestDB.getEquipmentsIBMCretedByDigitalRequest(id);
              const equipmentsDeleted = oldEquipments.filter((row) => equipmentsIds.some((ele) => parseInt(ele, 10) === parseInt(row.id, 10)));
              let amountEquipmentsDeleted = 0;
              for (const ele of equipmentsDeleted) {
                if (idBusinessModel === 1) {
                  amountEquipmentsDeleted = amountEquipmentsDeleted + 1;
                } else {
                  amountEquipmentsDeleted = amountEquipmentsDeleted + ele.amountEquipments;
                }
              }
              console.log("Equipos Menos: ", amountEquipmentsDeleted);

              /*
               * const newVersionCreated = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."CREARNUEVAVERSIONDEREQUERIMIENTO"
               * (${newVersion}, ${state}, ${opportunityNumber}, '${customer}', '${salesRep}',
               * '${requestedExecutive}', ${type === 'deleteEquipment' ? amountOfEquipment - amountEquipmentsDeleted : amountOfEquipment},
               * '${applicationNotes}', ${amountOfEquipmentIn}, ${amountOfEquipmentOut}, '${localtionNotes}',
               * '${country}', ${idTypeSupport}, ${idOperatingSystemType}, ${idBusinessModel},
               * ${type === 'coverage' ? officeHours : idOfficeHours}, ${idResponseTime},
               *  ${idTimeChangePart}, ${type === 'termOfService' ? validityService : idValidityService},
               *  ${type === 'wayPay' ? wayPay : idWayPay}, ${idLocationType}, ${idDistanceInside},
               * ${idDistanceOutside}, ${idAmountMaintenance}, ${idScheduleMaintenance},
               * '${EMAIL}', ${id}, ${type === 'coverage' ? 1 : type === 'deleteEquipment' ? 2 : 3});`);
               */
              const newVersionCreated = await DigitalRequestDB.createNewVersionByDigitalRequest({
                newVersion,
                state,
                opportunityNumber,
                customer,
                salesRep,
                requestedExecutive,
                amountOfEquipment: type === 'deleteEquipment' ? amountOfEquipment - amountEquipmentsDeleted : amountOfEquipment,
                applicationNotes,
                amountOfEquipmentIn,
                amountOfEquipmentOut,
                localtionNotes,
                country,
                typeSupport: idTypeSupport,
                operatingSystemType: idOperatingSystemType,
                businessModel: idBusinessModel,
                officeHours: type === 'coverage' ? officeHours : idOfficeHours,
                responseTime: idResponseTime,
                timeChangePart: idTimeChangePart,
                validityService: type === 'termOfService' ? validityService : idValidityService,
                wayPay: type === 'wayPay' ? wayPay : idWayPay,
                physicalLocation: idLocationType,
                equipmentServiceCenterIn: idDistanceInside,
                equipmentServiceCenterOut: idDistanceOutside,
                amountMaintenance: idAmountMaintenance,
                scheduleMaintenance: idScheduleMaintenance
              }, EMAIL);
              if (!newVersionCreated.length) {
                return res.status(404).send({
                  status: 404,
                  success: false,
                  payload: {
                    message: "El requerimiento que está intentando versionar no es válido"
                  }
                });
              } else {
                const [{ newIdRequest }] = newVersionCreated;
                await DigitalRequestDB.createCopyActivitiesFlowByDigitalRequestVersioned(newIdRequest, id);
                await DigitalRequestDB.createCopyServicesOrdersByDigitalRequestVersioned(newIdRequest, id);
                await DigitalRequestDB.createCopyAsignedUsersByDigitalRequestVersioned(newIdRequest, id);
                await DigitalRequestDB.createCopyEquipmentSpareByDigitalRequestVersioned(newIdRequest, id);
                await DigitalRequestDB.createCopyReferencesByDigitalRequestVersioned(newIdRequest, id);
                await DigitalRequestDB.createCopyJustifyByDigitalRequestVersioned(newIdRequest, id);
                await DigitalRequestDB.createCopyConfigurationsByDigitalRequestVersioned(newIdRequest, id);
                await DigitalRequestDB.createCopyCommentaryConfigurationsByDigitalRequestVersioned(newIdRequest, id);
                await DigitalRequestDB.createCopyReferencesSpareByDigitalRequestVersioned(newIdRequest, id);
                await DigitalRequestDB.createDigitalRequestInPricing(newIdRequest);
                if (type === 'coverage') {
                  await DigitalRequestDB.createCopyEquipmentIBMCustomByDigitalRequestVersioned(newIdRequest, id, officeHours);
                } else if (type === 'termOfService') {
                  await DigitalRequestDB.createCopyEquipmentIBMTermsOfServiceByDigitalRequestVersioned(newIdRequest, id, validityService);
                } else if (type === 'wayPay') {
                  await DigitalRequestDB.createCopyEquipmentIBMByDigitalRequestVersioned(newIdRequest, id);
                }
                if (type === 'deleteEquipment') {
                  const equipmentsFiltered = oldEquipments.filter((row) => !equipmentsIds.some((ele) => parseInt(ele, 10) === parseInt(row.id, 10)));
                  for (const element of equipmentsFiltered) {
                    await DigitalRequestDB.createEquipmentIBM({
                      amountEquipments: element.amountEquipments,
                      amountMaintenance: element.amountMaintenance,
                      automaticRenewal: element.idAutomaticRenewal,
                      country: element.country,
                      equipmentParts: element.idEquipmentParts,
                      officeHours: element.idOfficeHours,
                      platform: element.idPlatform,
                      price: element.price,
                      practice: element.idPractice,
                      serial: element.serial,
                      timeChangePart: element.idTimeChangePart,
                      typeModel: element.typeModel,
                      validityService: element.idValidityService,
                      validWarranty: element.validWarranty,
                      viatic: element.viatic,
                    }, newIdRequest);
                  }
                }
                let equipments = await DigitalRequestDB.getEquipmentsIBMCretedByDigitalRequest(newIdRequest);
                if (idBusinessModel === 1) {
                  const consolidates = consolidateAmountEquipments(equipments);
                  for (const element of consolidates) {
                    console.log(element);
                    // const { typeModel, amountMaintenance, validWarranty, amount, idAutomaticRenewal, idEquipmentParts } = element;
                    await DigitalRequestDB.createConsolidateEquipmentsIBM(element, newIdRequest);
                  }
                }

                /*
                 * const [
                 * logs,
                 * assignments
                 * ] = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARBITACORAASIGNACIONESREQUERIMIENTO" (${id}, ${newIdRequest});`);
                 */
                const logs = await DigitalRequestDB.getLogsAssignmentsByDigitalRequest(id);
                const assignments = await DigitalRequestDB.getIdsAssignmentsByDigitalRequest(newIdRequest);
                for (const element in logs) {
                  const { description, createdBy } = logs[element];
                  const { idAssignment } = assignments[element];
                  // await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARBITACORAASIGNACION" ('${description}', ${idAssignment}, '${createdBy}');`);
                  await DigitalRequestDB.createLogAssignmentsByID(description, createdBy, idAssignment);
                }

                /*
                 * let [
                 * partsToVer,
                 * idsEquipments
                 * ] = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARPARTESEQUIPOSPORREQUERIMIENTOPARAVERSIONAR" (${id}, ${newIdRequest}, ${idBusinessModel});`);
                 */
                let idsEquipments = await DigitalRequestDB.getIdsEquipmentsPartsByDigitalRequest(idBusinessModel, newIdRequest, id);
                const partsToVer = await DigitalRequestDB.getEquipmentsPartsToVersionByDigitalRequest(id);
                if (type === 'deleteEquipment') {
                  if (idBusinessModel === 1) {
                    idsEquipments = idsEquipments.filter((row) => !equipmentsIds.some((ele) => parseInt(ele, 10) === parseInt(row.lasIDE, 10)));
                  } else if (idBusinessModel === 2) {
                    idsEquipments = idsEquipments.filter((row) => !equipmentsIds.some((ele) => parseInt(ele, 10) === parseInt(row.lasID, 10)));
                  }
                }
                for (const element of partsToVer) {
                  const { idEquipment } = element;
                  const findEquipment = idsEquipments.find((row) => row.lasID === idEquipment);
                  if (findEquipment) {
                    // await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARCOPIAPARTESEQUIPOSPORREQUERIMIENTO" ('${fru}', ${amount}, '${sustitute1}', '${sustitute2}', '${sustitute3}', ${cost}, ${idCriticalPart}, ${findEquipment.newID}, ${newIdRequest}, '${createdBy}', '${updatedBy}');`);
                    await DigitalRequestDB.createCopyEquipmentsPartsBy(element, findEquipment.newID, newIdRequest);
                  } else {
                    console.log('No se encontro el nuevo ID del equipos Versionado');
                  }
                }
                // const [requestVersioned] = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARREQUERIMIENTOPORID" (${newIdRequest});`);
                const [requestVersioned] = await DigitalRequestDB.getDigitalRequestByID(newIdRequest);
                const dataMaster = await DigitalRequestDB.getVariablesDataMaster();
                // equipments = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONAREQUIPOSBASEREQUERIMIENTO" (${newIdRequest});`);
                equipments = await DigitalRequestDB.getEquipmentsBaseByDigitalRequest(idBusinessModel, newIdRequest);
                for (const element of equipments) {
                  const { typeModel, amountEquipments, validWarranty, price } = element;
                  const byServcs = idBusinessModel === 1
                    ? element.idOfficeHours === 1
                      ? dataMaster.find((row) => row.variable === "Nuevo 8x5")
                      : dataMaster.find((row) => row.variable === "Nuevo 24x7")
                    : dataMaster.find((row) => row.variable === "De 8x5 a 24x7");
                  const byServcsRemaining = dataMaster.find((row) => row.variable === "Nuevo 24x7");
                  const shipping = dataMaster.find((row) => row.variable === "Shipping");
                  const uplift = dataMaster.find((row) => row.variable === "Uplift HW");
                  const finance = dataMaster.find((row) => row.variable === "FI");
                  const months = dataMaster.find((row) => row.variable === "Meses");
                  // await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARCALCULOEQUIPOSBASE" ('${typeModel}', ${amountEquipments}, ${price}, ${element.idValidityService <= 2 ? 1 : element.idValidityService - 1}, ${idBusinessModel === 1 ? null : validWarranty}, ${byServcs.value}, ${idBusinessModel === 1 ? null : byServcsRemaining.value}, ${idBusinessModel === 1 ? null : shipping.value}, ${idBusinessModel === 1 ? null : uplift.value}, ${idBusinessModel === 1 ? null : (finance.value / 12) * months.value}, ${element.id}, ${newIdRequest});`);
                  await DigitalRequestDB.createEquipmentsBaseCalculate({
                    typeModel,
                    amountEquipments,
                    price,
                    quantityYears: element.idValidityService <= 2 ? 1 : element.idValidityService - 1,
                    validWarranty: idBusinessModel === 1 ? null : validWarranty,
                    byServcs: byServcs.value,
                    byServcsRemaining: idBusinessModel === 1 ? null : byServcsRemaining.value,
                    shipping: idBusinessModel === 1 ? null : shipping.value,
                    uplift: idBusinessModel === 1 ? null : uplift.value,
                    finance: idBusinessModel === 1 ? null : (finance.value / 12) * months.value,
                    id: element.id,
                    idBusinessModel,
                  }, newIdRequest);
                }
                const servicesTss = await DigitalRequestDB.getServicesTSSByDigitalRequest(idBusinessModel, newIdRequest);
                for (const element of servicesTss) {
                  let cont = 0;
                  const { idService, hours, quantity, viatic, preventiveE } = element;
                  const quantityYears = requestVersioned.idValidityService <= 2 ? 1 : requestVersioned.idValidityService - 1;
                  const costCountry = await DigitalRequestDB.getCostServicesTssByCountry(country === 'DO' ? 'DR' : country, idService);
                  const [{ cost }] = costCountry;
                  const uplift = dataMaster.find((row) => row.variable === "Uplift Servicios");
                  const finance = dataMaster.find((row) => row.variable === "FI");
                  const months = dataMaster.find((row) => row.variable === "Meses");
                  while (cont < quantity) {
                    await DigitalRequestDB.createServicesTSSCalculate({
                      hours: parseInt(hours, 10) * parseInt(preventiveE, 10),
                      cost,
                      quantityYears,
                      uplift: uplift.value,
                      finance: (finance.value / 12) * months.value,
                      viatic,
                      id: idService,
                    }, newIdRequest);
                    cont += 1;
                  }
                }
                const parts = await DigitalRequestDB.getEquipmentsPartsByDigitalRequest(idBusinessModel, newIdRequest);
                const spare = await DigitalRequestDB.getEquipmentsSpareByDigitalRequest(newIdRequest);
                const wayPayInterest = type === 'wayPay' ? wayPay : idWayPay;
                for (const element of spare) {
                  const { idSpare, partNumber, amountEquipments, cost } = element;
                  const quantityYears = requestVersioned.idValidityService <= 2 ? 1 : requestVersioned.idValidityService - 1;
                  const shipping = dataMaster.find((row) => row.variable === "Shipping");
                  const uplift = dataMaster.find((row) => row.variable === "Uplift Partes");
                  const finance = dataMaster.find((row) => row.variable === "FI");
                  const months = dataMaster.find((row) => row.variable === "Meses");
                  const interest = dataMaster.find((row) => row.variable === "Tasa");
                  await DigitalRequestDB.createSpareAndPartsCalculate({
                    partNumber,
                    amountEquipments,
                    cost,
                    quantityYears,
                    shipping: shipping.value,
                    uplift: uplift.value,
                    finance: (finance.value / 12) * months.value,
                    interest: wayPayInterest === 7 ? 0 : interest.value,
                    type: 1,
                    id: idSpare
                  }, newIdRequest);
                }
                for (const element of parts) {
                  const { idPart, partNumber, quantity, cost } = element;
                  const quantityYears = requestVersioned.idValidityService <= 2 ? 1 : requestVersioned.idValidityService - 1;
                  const shipping = dataMaster.find((row) => row.variable === "Shipping");
                  const uplift = dataMaster.find((row) => row.variable === "Uplift Partes");
                  const finance = dataMaster.find((row) => row.variable === "FI");
                  const months = dataMaster.find((row) => row.variable === "Meses");
                  const interest = dataMaster.find((row) => row.variable === "Tasa");
                  await DigitalRequestDB.createSpareAndPartsCalculate({
                    partNumber,
                    amountEquipments: quantity,
                    cost,
                    quantityYears,
                    shipping: shipping.value,
                    uplift: uplift.value,
                    finance: (finance.value / 12) * months.value,
                    interest: wayPayInterest === 7 ? 0 : interest.value,
                    type: 2,
                    id: idPart
                  }, newIdRequest);
                }
                return res.status(200).send({
                  status: 200,
                  success: true,
                  payload: {
                    message: "El requerimiento se versiono exitosamente"
                  }
                });
              }
            }
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async updateEquipmentById(req, res) {
    try {
      const { id } = req.params;
      const { values, type } = req.body;
      if (id && Object.keys(values).length && type) {
        if (type === 'ibm') {
          // const equipmentUpdated = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZAREQUIPOIBM" ('${country}', '${typeModel}', '${serial ? serial : null}', ${amountMaintenance}, ${amountEquipments ? amountEquipments : null}, ${validWarranty}, ${viatic}, ${price ? price : 0}, ${practice}, ${platform}, ${idOfficeHours}, ${idTimeChangePart}, ${idValidityService}, ${idAutomaticRenewal}, ${idEquipmentParts}, ${id});`);
          const equipmentUpdated = await DigitalRequestDB.updateEquipmentByID(values, id);
          if (!equipmentUpdated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "No se logro actualizar el equipo"
              }
            });
          } else {
            const [equipment] = await DigitalRequestDB.getEquipmentIBMByID(id);
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "El equipo fue actualizado exitosamente",
                equipment,
                type,
                id
              }
            });
          }
        } else if (type === 'cisco') {
          const {
            serial, productNumber, description, idOfficeHours, idCoverageLevel, idValidityService, price
          } = values;
          const equipmentUpdated = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZAREQUIPOCISCO" ('${serial}', '${productNumber}', '${description}', ${price ? price : 0}, ${idOfficeHours}, ${idCoverageLevel}, ${idValidityService}, ${id});`);
          if (!equipmentUpdated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "No se logro actualizar el equipo CISCO"
              }
            });
          } else {
            const [equipment] = equipmentUpdated;
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "El equipo fue actualizado exitosamente",
                equipment,
                type,
                id
              }
            });
          }
        } else {
          return res.status(409).send({
            status: 409,
            success: false,
            payload: {
              message: "El tipo de equipo que intentas actualizar, no es válido"
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async updateActivityFlow(req, res) {
    try {
      const { id } = req.params;
      const { description, state, type } = req.body;
      const { user: { EMAIL } } = req;
      if (id && description && state && type && EMAIL) {
        const activityFlow = await DigitalRequestDB.createActivitiesFlowByDigitalRequest(description, state, EMAIL, id);
        if (!activityFlow.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "Ocurrio un error intentando actualizar el flujo de actividades"
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Se actualizo el flujo de actividades de la tarea exitosamente",
              activityFlow,
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async updateStateRequest(req, res) {
    try {
      const { id, state } = req.params;
      const { decoded } = req;
      if (id && state && decoded) {
        // const [request] = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARREQUERIMIENTOPORID" (${id});`);
        const [request] = await DigitalRequestDB.getDigitalRequestByID(id);
        // const { idBusinessModel, country, opportunityNumber, version } = request;
        const { idBusinessModel, country, opportunityNumber, wayPay, customer } = request;
        // const idValidityServiceR = request.idValidityService; Vigencia del requerimiento
        if (parseInt(state, 10) === 1) {
          if (idBusinessModel === 1) {
            const equipments = await DigitalRequestDB.getEquipmentsIBMCretedByDigitalRequest(id);
            if (equipments.length) {
              const consolidates = consolidateAmountEquipments(equipments);
              for (const element of consolidates) {
                // const { typeModel, amountMaintenance, validWarranty, amount, idOfficeHours, idTimeChangePart, idValidityService, idAutomaticRenewal, idEquipmentParts } = element;
                await DigitalRequestDB.createConsolidateEquipmentsIBM(element, id);
              }
            }
          }
        } else if (parseInt(state, 10) === 8) { // parseInt(state, 10) === 10 || parseInt(state, 10) === 8) {
          // const dataMaster = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARVARIABLESMASTERDATA" ();`);
          const dataMaster = await DigitalRequestDB.getVariablesDataMaster();
          // const equipments = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONAREQUIPOSBASEREQUERIMIENTO" (${id});`);
          const equipments = await DigitalRequestDB.getEquipmentsBaseByDigitalRequest(idBusinessModel, id);
          for (const element of equipments) {
            const { typeModel, amountEquipments, validWarranty, idValidityService, idOfficeHours, price } = element;
            const byServcs = idBusinessModel === 1
              ? idOfficeHours === 1
                ? dataMaster.find((row) => row.variable === "Nuevo 8x5")
                : dataMaster.find((row) => row.variable === "Nuevo 24x7")
              : dataMaster.find((row) => row.variable === "De 8x5 a 24x7");
            const byServcsRemaining = dataMaster.find((row) => row.variable === "Nuevo 24x7");
            const shipping = dataMaster.find((row) => row.variable === "Shipping");
            const uplift = dataMaster.find((row) => row.variable === "Uplift HW");
            const finance = dataMaster.find((row) => row.variable === "FI");
            const months = dataMaster.find((row) => row.variable === "Meses");
            // await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARCALCULOEQUIPOSBASE" ('${typeModel}', ${amountEquipments}, ${price}, ${idValidityService <= 2 ? 1 : idValidityService - 1}, ${idBusinessModel === 1 ? null : validWarranty}, ${byServcs.value}, ${idBusinessModel === 1 ? null : byServcsRemaining.value}, ${idBusinessModel === 1 ? null : shipping.value}, ${idBusinessModel === 1 ? null : uplift.value}, ${idBusinessModel === 1 ? null : (finance.value / 12) * months.value}, ${element.id}, ${id});`);
            await DigitalRequestDB.createEquipmentsBaseCalculate({
              typeModel,
              amountEquipments,
              price,
              quantityYears: idValidityService <= 2 ? 1 : idValidityService - 1,
              validWarranty: idBusinessModel === 1 ? null : validWarranty,
              byServcs: byServcs.value,
              byServcsRemaining: idBusinessModel === 1 ? null : byServcsRemaining.value,
              shipping: idBusinessModel === 1 ? null : shipping.value,
              uplift: idBusinessModel === 1 ? null : uplift.value,
              finance: idBusinessModel === 1 ? null : (finance.value / 12) * months.value,
              id: element.id,
              idBusinessModel,
            }, id);
          }
          // const servicesTss = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARSERVICIOSTSSREQUERIMIENTO"(${id}); `);
          const servicesTss = await DigitalRequestDB.getServicesTSSByDigitalRequest(idBusinessModel, id);
          for (const element of servicesTss) {
            let cont = 0;
            const { idService, hours, quantity, viatic, preventiveE } = element;
            const quantityYears = request.idValidityService <= 2 ? 1 : request.idValidityService - 1;
            // const costCountry = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECIONARCOSTOSERVICIOTSSPAIS"('${country === 'DO' ? 'DR' : country}', ${idService}); `); // 500;
            const costCountry = await DigitalRequestDB.getCostServicesTssByCountry(country === 'DO' ? 'DR' : country, idService); // 500;
            const [{ cost }] = costCountry;
            const uplift = dataMaster.find((row) => row.variable === "Uplift Servicios");
            const finance = dataMaster.find((row) => row.variable === "FI");
            const months = dataMaster.find((row) => row.variable === "Meses");
            while (cont < quantity) {
              // await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARCALCULOSERVICIOSTSS"(${hours}, ${cost}, ${quantityYears}, ${uplift.value}, ${(finance.value / 12) * months.value}, ${viatic}, ${idService}, ${id}); `);
              await DigitalRequestDB.createServicesTSSCalculate({
                hours: parseInt(hours, 10) * parseInt(preventiveE, 10),
                cost,
                quantityYears,
                uplift: uplift.value,
                finance: (finance.value / 12) * months.value,
                viatic,
                id: idService,
              }, id);
              cont += 1;
            }
          }
          // const [ spare, parts ] = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARPARTESYSPAREPORREQUERIMIENTO"(${id}); `);
          const parts = await DigitalRequestDB.getEquipmentsPartsByDigitalRequest(idBusinessModel, id);
          const spare = await DigitalRequestDB.getEquipmentsSpareByDigitalRequest(id);
          for (const element of spare) {
            const { idSpare, partNumber, amountEquipments, cost } = element;
            const quantityYears = request.idValidityService <= 2 ? 1 : request.idValidityService - 1;
            const shipping = dataMaster.find((row) => row.variable === "Shipping");
            const uplift = dataMaster.find((row) => row.variable === "Uplift Partes");
            const finance = dataMaster.find((row) => row.variable === "FI");
            const months = dataMaster.find((row) => row.variable === "Meses");
            const interest = dataMaster.find((row) => row.variable === "Tasa");
            // await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARCALCULOSPAREYPARTES"('${partNumber}', ${amountEquipments}, ${cost}, ${quantityYears}, ${shipping.value}, ${uplift.value}, ${(finance.value / 12) * months.value}, ${interest.value}, ${1}, ${idSpare}, ${id}); `);
            await DigitalRequestDB.createSpareAndPartsCalculate({
              partNumber,
              amountEquipments,
              cost,
              quantityYears,
              shipping: shipping.value,
              uplift: uplift.value,
              finance: (finance.value / 12) * months.value,
              interest: wayPay === 'Un solo pago' ? 0 : interest.value,
              type: 1,
              id: idSpare
            }, id);
          }
          for (const element of parts) {
            const { idPart, partNumber, quantity, cost } = element;
            const quantityYears = request.idValidityService <= 2 ? 1 : request.idValidityService - 1;
            const shipping = dataMaster.find((row) => row.variable === "Shipping");
            const uplift = dataMaster.find((row) => row.variable === "Uplift Partes");
            const finance = dataMaster.find((row) => row.variable === "FI");
            const months = dataMaster.find((row) => row.variable === "Meses");
            const interest = dataMaster.find((row) => row.variable === "Tasa");
            // await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARCALCULOSPAREYPARTES"('${partNumber}', ${quantity}, ${cost}, ${quantityYears}, ${shipping.value}, ${uplift.value}, ${(finance.value / 12) * months.value}, ${interest.value}, ${2}, ${idPart}, ${id}); `);
            await DigitalRequestDB.createSpareAndPartsCalculate({
              partNumber,
              amountEquipments: quantity,
              cost,
              quantityYears,
              shipping: shipping.value,
              uplift: uplift.value,
              finance: (finance.value / 12) * months.value,
              interest: wayPay === 'Un solo pago' ? 0 : interest.value,
              type: 2,
              id: idPart
            }, id);
          }
        }
        // const update = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARESTADOREQUERIMIENTO"(${id}, ${state}); `);
        const update = await DigitalRequestDB.updateStatusDigitalRequestByID(state, id);
        if (!update.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "Ocurrio un error, al intentar completar el proceso del requerimiento"
            }
          });
        } else {
          const [{ createdBy }] = update;
          let flag = null;
          if (parseInt(state, 10) === 5 || parseInt(state, 10) === 6) {
            // Se debe notificar al Planner en ambos casos
            const infoParts = await DigitalRequestDB.getEquipmentsIBMByDigitalRequest(id);
            const [comment] = await DigitalRequestDB.getCommentConfigurationByDigitalRequest(id);
            const notify = await notifyPlanner(opportunityNumber, parseInt(state, 10), id, createdBy.split("@")[0], infoParts, customer, comment);
            flag = `${notify === true ? ', se notifico a la oficina de Planificación' : ', pero no se logro notificar a la oficina de planificación'} `;
          } else if (parseInt(state, 10) === 7) {
            await DigitalRequestDB.createDigitalRequestInInventories(id);
            const notify = await notifyInventories(opportunityNumber, createdBy.split("@")[0]);
            flag = `${notify === true ? ', se notifico a la oficina de Inventarios' : ', pero no se logro notificar a la oficina de Inventarios'} `;
          } else if (parseInt(state, 10) === 8) {
            await DigitalRequestDB.createDigitalRequestInPricing(id);
            await DigitalRequestDB.updateDigitalRequestInInventories(id);
            const notify = await notifySalesRep(opportunityNumber, createdBy);
            flag = `${notify === true ? ', se notifico al representante de ventas' : ', pero no se logro notificar al representante de ventas'} `;
          } else if (parseInt(state, 10) === 9) {
            const infoParts = await DigitalRequestDB.getEquipmentsPendingsPartsByDigitalRequest(idBusinessModel, id);
            const notify = await notifyPlannersJTR(id, opportunityNumber, createdBy, infoParts, decoded);
            flag = `${notify === true ? ', se notifico a la oficina de Planificación' : ', pero no se logro notificar a la oficina de planificación'} `;
          } else if (parseInt(state, 10) === 10) {
            await DigitalRequestDB.createDigitalRequestInPricing(id);
            const notify = await notifyPricing(country, opportunityNumber, createdBy);
            flag = `${notify === true ? ', se notifico a la oficina de Pricing' : ', pero no se logro notificar a la oficina de Pricing'} `;
          } else if (parseInt(state, 10) === 11 || parseInt(state, 10) === 12) {
            const log = await DigitalRequestDB.getInfoAjustRejectedByDigitalRequest(id);
            const notify = await notifySalesRepByPrincing(opportunityNumber, createdBy, parseInt(state, 10), log);
            flag = `${notify === true ? ', se notifico al representante de ventas' : ', pero no se logro notificar al representante de ventas'} `;
          } else if (parseInt(state, 10) === 14) {
            await DigitalRequestDB.updateDigitalRequestNotConsidered(opportunityNumber, id);
            // const notify = await notifyOfferWonSalesRep(version, opportunityNumber, createdBy);
          } else if (parseInt(state, 10) === 15) {
            const [comment] = await EngineersDB.getCommentEngineerByDigitalRequest(id, 2);
            const notify = await notifySalesRepByEngineer(opportunityNumber, createdBy, decoded, comment);
            flag = `${notify === true ? ', se notifico al representante de ventas' : ', pero no se logro notificar al representante de ventas'} `;
          }
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `Se actualizo exitosamente el flujo de la solicitud${flag} `,
              request: await DigitalRequestDB.getDigitalRequestByID(id)
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async updateEquipmentSpareById(req, res) {
    try {
      const { id } = req.params;
      const { partNumber, description, amountEquipments, cost } = req.body;
      if (id && partNumber && description && amountEquipments && cost) {
        const equipment = await DigitalRequestDB.updateEquipmentSpareByID({
          partNumber,
          description,
          amountEquipments,
          cost
        }, id);
        if (!equipment.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "Ocurrío un error al intentar actualizar la linea de equipo spare!"
            }
          });
        } else {
          const [spare] = await DigitalRequestDB.getEquipmentsSpareByID(id);
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "La linea de equipo spare fue actualizada exitosamente!",
              equipment: spare,
              id
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async deactivateEquipmentById(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const equipment = await DigitalRequestDB.deactivateIBMEquipmentByID(id);
        if (!equipment.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "Ocurrío un error al intentar eliminar la linea de equipo!"
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "La linea de equipo fue eliminada exitosamente!",
              id
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async deactivateReferences(req, res) {
    try {
      const { referencesIds } = req.body;
      if (referencesIds) {
        for (const element of referencesIds) {
          await DigitalRequestDB.deactivateReferencesRequestByID(element);
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: "Referencias desactivadas exitosamente"
          }
        });
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async deactivateConfigurations(req, res) {
    try {
      const { configurationsIds } = req.body;
      if (configurationsIds) {
        for (const element of configurationsIds) {
          await DigitalRequestDB.deactivateConfigurationsRequestByID(element);
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: "Configuraciones desactivadas exitosamente"
          }
        });
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async deactivateReferencesSpare(req, res) {
    try {
      const { referencesIds } = req.body;
      if (referencesIds) {
        for (const element of referencesIds) {
          await DigitalRequestDB.deactivateReferencesSpareByID(element);
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: "Referencias desactivadas exitosamente"
          }
        });
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async deactivateReferencesAjustOffers(req, res) {
    try {
      const { referencesIds } = req.body;
      if (referencesIds) {
        for (const element of referencesIds) {
          await DigitalRequestDB.deactivateReferencesAjustOfferByID(element);
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: "Referencias desactivadas exitosamente"
          }
        });
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async deactivateEquipmentSpareById(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const equipment = await DigitalRequestDB.deactivateEquipmentSpareByID(id);
        if (!equipment.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "Ocurrío un error al intentar eliminar la linea de equipo spare!"
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "La linea de equipo spare fue eliminada exitosamente!",
              id
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async uploadReferencesFiles(req, res) {
    try {
      const { idRequest } = req.params;
      const { decoded } = req;
      const { reference: { name, data, encoding, mimetype } } = req.files;
      const nameNormalize = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const file = Buffer.from(data, encoding);
      let path = `src/assets/files/DigitalRequest/References/Requerimiento #${idRequest}`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      path = `${path}/${moment().format('YYYY-MM-DD_H-mm-ss')}`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      fs.writeFileSync(`${path}/${nameNormalize}`, file, (err) => {
        if (err) {
          console.log('No se logro almacenar en el servidor de datos el archivo');
          res.status(409).send({
            status: 409,
            success: false,
            payload: {
              message: `No se logro almacenar en el servidor de datos el archivo`
            }
          });
        }
        console.log(`Archivo ${nameNormalize} guardado con exito`);
      });
      const reference = await DigitalRequestDB.createReferencePriceByDigitalRequest({
        nameNormalize,
        encoding,
        mimetype,
        path: `${path}/${nameNormalize}`,
        decoded
      }, idRequest);
      if (!reference.length) {
        res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: `No se logro guardar en la base de datos el archivo`
          }
        });
      } else {
        const [{ id_Referencia }] = reference;
        res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: 'Archivo almacenado exitosamente',
            path,
            idRerence: id_Referencia
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async uploadConfigurationFiles(req, res) {
    try {
      const { idRequest } = req.params;
      const { decoded } = req;
      const { configuration: { name, data, encoding, mimetype } } = req.files;
      const nameNormalize = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const file = Buffer.from(data, encoding);
      let path = `src/assets/files/DigitalRequest/Configurations/Requerimiento #${idRequest}`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      path = `${path}/${moment().format('YYYY-MM-DD_H-mm-ss')}`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      fs.writeFileSync(`${path}/${nameNormalize}`, file, (err) => {
        if (err) {
          console.log('No se logro almacenar en el servidor de datos el archivo');
          res.status(409).send({
            status: 409,
            success: false,
            payload: {
              message: `No se logro almacenar en el servidor de datos el archivo`
            }
          });
        }
        console.log(`Archivo ${nameNormalize} guardado con exito`);
      });
      const configuration = await DigitalRequestDB.createConfigurationByDigitalRequest({
        nameNormalize,
        encoding,
        mimetype,
        path: `${path}/${nameNormalize}`,
        decoded
      }, idRequest);
      if (!configuration.length) {
        res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: `No se logro guardar en la base de datos el archivo`
          }
        });
      } else {
        const [{ id_Configuracion }] = configuration;
        res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: 'Archivo almacenado exitosamente',
            path,
            idConfiguration: id_Configuracion
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async uploadReferenceSpare(req, res) {
    try {
      const { idRequest } = req.params;
      const { decoded } = req;
      const { reference: { name, data, encoding, mimetype } } = req.files;
      const nameNormalize = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const file = Buffer.from(data, encoding);
      let path = `src/assets/files/DigitalRequest/References/Requerimiento #${idRequest}`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      path = `${path}/Spare`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      path = `${path}/${moment().format('YYYY-MM-DD_H-mm-ss')}`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      fs.writeFileSync(`${path}/${nameNormalize}`, file, (err) => {
        if (err) {
          console.log('No se logro almacenar en el servidor de datos el archivo');
          res.status(409).send({
            status: 409,
            success: false,
            payload: {
              message: `No se logro almacenar en el servidor de datos el archivo`
            }
          });
        }
        console.log(`Archivo ${nameNormalize} guardado con exito`);
      });
      const reference = await DigitalRequestDB.createReferencesBySpare({
        nameNormalize,
        encoding,
        mimetype,
        path: `${path}/${nameNormalize}`,
        decoded
      }, idRequest);
      if (!reference.length) {
        res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: `No se logro guardar en la base de datos el archivo`
          }
        });
      } else {
        const [{ id_Referencia }] = reference;
        res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: 'Archivo almacenado exitosamente',
            path,
            idReference: id_Referencia
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async uploadReferenceAjustOffer(req, res) {
    try {
      const { idRequest } = req.params;
      const { decoded } = req;
      const { reference: { name, data, encoding, mimetype } } = req.files;
      const nameNormalize = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const file = Buffer.from(data, encoding);
      let path = `src/assets/files/DigitalRequest/References/Requerimiento #${idRequest}`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      path = `${path}/Ajust`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      path = `${path}/${moment().format('YYYY-MM-DD_H-mm-ss')}`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      fs.writeFileSync(`${path}/${nameNormalize}`, file, (err) => {
        if (err) {
          console.log('No se logro almacenar en el servidor de datos el archivo');
          res.status(409).send({
            status: 409,
            success: false,
            payload: {
              message: `No se logro almacenar en el servidor de datos el archivo`
            }
          });
        }
        console.log(`Archivo ${nameNormalize} guardado con exito`);
      });
      const reference = await DigitalRequestDB.createReferencesAjustOffer({
        nameNormalize,
        encoding,
        mimetype,
        path: `${path}/${nameNormalize}`,
        decoded
      }, idRequest);
      if (!reference.length) {
        res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: `No se logro guardar en la base de datos el archivo`
          }
        });
      } else {
        const [{ id_ReferenciaAjuste }] = reference;
        res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: 'Archivo almacenado exitosamente',
            path,
            idReference: id_ReferenciaAjuste
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async downloadEquipmentsTemplates(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const request = await DigitalRequestDB.getDigitalRequestByID(id);
        if (!request.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El requerimiento seleccionado no es válido"
            }
          });
        } else {
          const [{ idBusinessModel }] = request;
          if (idBusinessModel === 1) {
            res.download(
              'src/assets/files/DigitalRequest/Templates/Lista de Equipos - CM.xlsx',
              'Machote Oficial Lista de Equipos - CM.xlsx',
              (err) => {
                if (err) {

                  /*
                   * Handle error, but keep in mind the response may be partially-sent
                   * so check res.headersSent
                   */
                  console.log('Error descargando la plantilla');
                } else {
                  // decrement a download credit, etc.
                  console.log('Se descargo la plantilla');
                }
              });
          } else if (idBusinessModel === 2) {
            res.download(
              'src/assets/files/DigitalRequest/Templates/Lista de Equipos - SC.xlsx',
              'Machote Oficial Lista de Equipos - SC.xlsx',
              (err) => {
                if (err) {

                  /*
                   * Handle error, but keep in mind the response may be partially-sent
                   * so check res.headersSent
                   */
                  console.log('Error descargando la plantilla');
                } else {
                  // decrement a download credit, etc.
                  console.log('Se descargo la plantilla');
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  downloadAttachmentByPath(req, res) {
    try {
      const { path, name } = req.params;
      if (path && name) {
        const pathDecode = Buffer.from(path, 'base64').toString();
        const nameDecode = Buffer.from(name, 'base64').toString();
        res.download(
          `${pathDecode}`,
          `${nameDecode}`,
          (err) => {
            if (err) {

              /*
               * Handle error, but keep in mind the response may be partially-sent
               * so check res.headersSent
               */
              console.log(`Error descargando el archivo adjuntado ${nameDecode} en la direccion ${pathDecode}`);
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async sendEmailOfferWonRequest(req, res) {
    try {
      const { id } = req.params;
      const { validityService, officeHours, totalEquipment, totalServices, totalSpareParts, equipments, oficial } = req.body;
      if (id && validityService && officeHours && totalEquipment && totalServices && totalSpareParts && equipments) {
        const request = await DigitalRequestDB.getDigitalRequestByID(id);
        if (!request.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El requerimiento seleccionado no es válido"
            }
          });
        } else {
          const [{ version, opportunityNumber, createdBy, wayPay, customer, businessModel, idBusinessModel }] = request;
          const activities = await DigitalRequestDB.getActivitiesPlatformsPracticeEquipmentsByDigitalRequest(id);
          const subject = `${oficial ? `Oferta Ganada Opp ${opportunityNumber} Version ${version}` : `Resumen Documentos Opp ${opportunityNumber} Version ${version}`}`;
          const content = `Estimado usuario <strong>${createdBy ? createdBy.split("@")[0] : 'N/A'}</strong>, ${oficial ? `se ha registrado la oferta ganada` : `se han generado los documentos`} para la OPP <strong>${opportunityNumber}</strong>, número de versión <strong>${version}</strong>. A continuación se adjuntan los archivos respectivos a la oferta. Para más información puede ingresar a Smart & Simple`;
          const resumePdf = renderResumeListPdf({
            wayPay,
            customer,
            businessModel,
            validityService,
            officeHours,
            totalEquipment,
            totalServices,
            totalSpareParts,
            opportunityNumber,
            version,
            date: moment().format('DD-MM-YYYY h:mm:ss a')
          }, equipments, activities, oficial);
          let path = `src/assets/files/DigitalRequest/OfferWon/Requerimiento #${id}`;
          if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
          }
          path = `${path}/${moment().format('YYYY-MM-DD_H-mm-ss')}`;
          if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
          }
          let attachments = await createResumeFile(resumePdf.html, path, {
            opportunityNumber,
            version,
            date: moment().format('DD-MM-YYYY h:mm:ss a')
          });
          if (!attachments.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrío un error interno intentando enviar los archivos de resumen, lista de FRUs y PartNumbers aprobados"
              }
            });
          }
          const frus = await DigitalRequestDB.getFrusPartsResumeByDigitalRequest(idBusinessModel, id);
          const spare = await DigitalRequestDB.getEquipmentsSpareResumeByDigitalRequest(id);
          const engineers = await DigitalRequestDB.getWorkedEngineersResumeByDigitalRequest(id);
          if (frus.length) {
            let totalAmount = 0;
            for (const element of frus) {
              totalAmount = totalAmount + element["Costo Total"];
            }
            const frusPartsPdf = renderFrusPartsPdf({
              opportunityNumber,
              customer,
              wayPay,
              version,
              businessModel,
              validityService,
              date: moment().format('DD-MM-YYYY h:mm:ss a')
            }, frus, engineers, totalAmount, oficial);
            attachments = [
              ...attachments,
              ...await createListFrusPartNumbersPDF(frusPartsPdf.html, path, {
                opportunityNumber,
                version,
                date: moment().format('DD-MM-YYYY h:mm:ss a')
              }, 'frus'),
            ];
          }
          if (spare.length) {
            let totalAmountSpare = 0;
            for (const element of spare) {
              totalAmountSpare = totalAmountSpare + element["Costo Total"];
            }
            const sparePdf = renderSparePdf({
              opportunityNumber,
              customer,
              wayPay,
              version,
              businessModel,
              validityService,
              date: moment().format('DD-MM-YYYY h:mm:ss a')
            }, spare, totalAmountSpare);
            attachments = [
              ...attachments,
              ...await createListFrusPartNumbersPDF(sparePdf.html, path, {
                opportunityNumber,
                version,
                date: moment().format('DD-MM-YYYY h:mm:ss a')
              }, 'spare'),
            ];
          }
          attachments = [
            ...attachments,
            ...await createListFrusPartNumbers(frus, spare, path, {
              opportunityNumber,
              version,
              date: moment().format('DD-MM-YYYY h:mm:ss a')
            }),
          ];
          const html = renderEmailRequestSalesRep(subject, content);
          const emailSended = await SendMail.sendMailMaintenance(
            html,
            subject,
            attachments, // attachments
            `${createdBy.toLowerCase()}`,
            '' // cc
          );
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `${emailSended ? 'Se ha enviado' : 'No se logro enviar'} a tu correo de GBM los archivos de resumen, lista de FRUs y PartNumbers aprobados`,
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async updateAmountEquipmentsByRequest(req, res) {
    try {
      const { id } = req.params;
      const { amount, amountOut, amountIn } = req.body;
      if (id && amount) {
        const update = await DigitalRequestDB.updateAmountEquipmentsLDR(id, amount, amountIn, amountOut);
        if (!update.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "Ocurrío un error intentando actualizar la información, por favor intentelo nuevamente"
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Información actualizada exitosamente"
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async createNewVersionByRejectRequest(req, res) {
    try {
      const { user: { EMAIL } } = req;
      const { id } = req.params;
      const { newVersion } = req.body;
      if (id && newVersion && EMAIL) {
        const request = await DigitalRequestDB.getDigitalRequestByID(id);
        if (!request.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El requerimiento que está intentando versionar no es válido"
            }
          });
        } else {
          const [
            { state, opportunityNumber, customer, salesRep, requestedExecutive, amountOfEquipment, applicationNotes,
              amountOfEquipmentIn, amountOfEquipmentOut, localtionNotes, country, idTypeSupport, idOperatingSystemType,
              idBusinessModel, idOfficeHours, idResponseTime, idTimeChangePart, idValidityService, idWayPay, idLocationType,
              idDistanceInside, idDistanceOutside, idAmountMaintenance, idScheduleMaintenance }
          ] = request;
          if (parseInt(state, 10) !== 15) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "El requerimiento que está intentando versionar no tiene permitido ser versionado"
              }
            });
          } else {
            const newVersionCreated = await DigitalRequestDB.createNewVersionByDigitalRequest({
              newVersion,
              state: 0,
              opportunityNumber,
              customer,
              salesRep,
              requestedExecutive,
              amountOfEquipment,
              applicationNotes,
              amountOfEquipmentIn,
              amountOfEquipmentOut,
              localtionNotes,
              country,
              typeSupport: idTypeSupport,
              operatingSystemType: idOperatingSystemType,
              businessModel: idBusinessModel,
              officeHours: idOfficeHours,
              responseTime: idResponseTime,
              timeChangePart: idTimeChangePart,
              validityService: idValidityService,
              wayPay: idWayPay,
              physicalLocation: idLocationType,
              equipmentServiceCenterIn: idDistanceInside,
              equipmentServiceCenterOut: idDistanceOutside,
              amountMaintenance: idAmountMaintenance,
              scheduleMaintenance: idScheduleMaintenance
            }, EMAIL);
            if (!newVersionCreated.length) {
              return res.status(404).send({
                status: 404,
                success: false,
                payload: {
                  message: "Ocurrío un error interno intentando versionar el requerimiento"
                }
              });
            } else {
              const [{ newIdRequest }] = newVersionCreated;
              await DigitalRequestDB.createActivitieFlow('Creación del requerimiento', 'Iniciado', EMAIL, newIdRequest);
              await DigitalRequestDB.createCopyEquipmentIBMByDigitalRequestVersioned(newIdRequest, id);
              // const equipments = await DigitalRequestDB.getEquipmentsIBMCretedByDigitalRequest(newIdRequest);
              // if (idBusinessModel === 1) {
              //   const consolidates = consolidateAmountEquipments(equipments);
              //   for (const element of consolidates) {
              //     // const { typeModel, amountMaintenance, validWarranty, amount, idAutomaticRenewal, idEquipmentParts } = element;
              //     await DigitalRequestDB.createConsolidateEquipmentsIBM(element, newIdRequest);
              //   }
              // }
              await DigitalRequestDB.createActivitiesFlowByDigitalRequest('Carga de la lista de Equipos al requerimiento', 'Equipos Cargados', EMAIL, newIdRequest);
              return res.status(200).send({
                status: 200,
                success: true,
                payload: {
                  message: "El requerimiento se versiono exitosamente",
                  newIdRequest,
                }
              });
            }
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

}