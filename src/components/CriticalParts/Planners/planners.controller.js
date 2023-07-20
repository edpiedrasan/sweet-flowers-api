/* eslint-disable no-await-in-loop */
/* eslint-disable max-lines */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
/* eslint-disable max-depth */
/* eslint-disable prefer-destructuring */
import moment from "moment";
import config from "../../../config/config";
import AuthRolesDB from "../../../db/Auth/AuthRolesDB";
// import DB2 from "../../../db/db2";
import {
  renderEmailRequestEngineer,
  renderEmailEscaltionEngineer,
} from "../../../helpers/renderContent";
import SendMail from "../../../helpers/sendEmail";
import WebService from "../../../helpers/webService";
import PlannersDB from "../../../db/Sales/PlannersDB";
import DigitalRequestDB from "../../../db/Sales/DigitalRequestDB";

const notifyUserAssignment = async (request, to, startDate) => {
  let subject = "";
  let content = "";
  let note = "";
  const { id, state, opportunityNumber, createdBy } = request;
  if (state === 5) {
    let serviceOrder = "Sin Orden de Servicio";
    // const servicesOrder = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARORDENDESERVICIOPORREQUERIMIENTO" (${id});`);
    const servicesOrder = await PlannersDB.getServicesOrdersByDigitalRequest(
      id
    );
    if (servicesOrder.length) {
      [{ serviceOrder }] = servicesOrder;
    }
    subject = "Obtener Configuración para Opp";
    content = `Por favor obtener la configuración de los equipos que corresponden al número de OPP <strong>${opportunityNumber}</strong>, creado por  el usuario <strong>${
      createdBy.split("@")[0]
    }</strong> y número de orden de servicio <strong>${serviceOrder}</strong>. A partir de la siguiente fecha <strong>${moment(
      startDate
    ).format(
      "LLL"
    )}</strong>. Agradecemos su colaboración ingresando a Smart & Simple`;
  } else if (state === 6 || state === 9) {
    subject = "Identificar Partes para Opp";
    content = `Por favor identificar las partes que corresponden al número de OPP <strong>${opportunityNumber}</strong>, creado por  el usuario <strong>${
      createdBy.split("@")[0]
    }</strong>. A partir de la siguiente fecha <strong>${moment(
      startDate
    ).format(
      "LLL"
    )}</strong>. Agradecemos su colaboración ingresando a Smart & Simple`;
    note = `Asegúrese de validar si los equipos cuentan con el soporte del fabricante. Analice los temas comerciales para asegurarse que GBM puede cumplir con los SLAs acordados con el cliente. Ante dudas, consulte al ejecutivo de cuenta`;
  }
  const html = renderEmailRequestEngineer(subject, content, note);
  const emailSended = await SendMail.sendMailMaintenance(
    html,
    subject,
    [], // attachments
    to,
    "" // cc
  );
  return emailSended;
};

export default class PlannersComponent {
  async findRequestsPendingAssignation(req, res) {
    try {
      const {
        user: { IDCOLABC },
      } = req;
      const isPlanner = await AuthRolesDB.verifyAccessByPermissions(
        IDCOLABC,
        "Planners Admin"
      );
      if (isPlanner.length) {
        // const request = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARREQUERIMIENTOSPORASIGNAR" ();`);
        const request = await PlannersDB.getDigitalRequestByAssigning();
        if (!request.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message:
                "Al día de hoy, aun no hay oportunidades para la asignación de recursos",
            },
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message:
                "Se cargaron exitosamente todas las oportunidades pendientes de la asignación de un recurso",
              request: request.map((row) => {
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
      } else {
        return res.status(401).send({
          status: 401,
          success: false,
          payload: {
            message: "No te encuentras autorizado a ingresar a esta vista",
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

  async findAllRequestsAssignment(req, res) {
    try {
      const {
        user: { IDCOLABC },
      } = req;
      const isPlanner = await AuthRolesDB.verifyAccessByPermissions(
        IDCOLABC,
        "Planners Admin"
      );
      if (isPlanner.length) {
        // const request = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARREQUERIMIENTOSPORASIGNAR" ();`);
        const request = await PlannersDB.getAllDigitalRequestByAssignment();
        if (!request.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message:
                "Al día de hoy, aun no hay oportunidades para la asignación de recursos",
            },
          });
        } else {
          const dataAssigned = await PlannersDB.findAllEquipmentsAssigned();
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message:
                "Se cargaron exitosamente todas las oportunidades pendientes de la asignación de un recurso",
              request: request.map((row) => {
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
              dataAssigned,
            },
          });
        }
      } else {
        return res.status(401).send({
          status: 401,
          success: false,
          payload: {
            message: "No te encuentras autorizado a ingresar a esta vista",
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

  async findEquipmentsAssignmentByRequest(req, res) {
    try {
      const {
        user: { IDCOLABC },
      } = req;
      const { id } = req.params;
      const isPlanner = await AuthRolesDB.verifyAccessByPermissions(
        IDCOLABC,
        "Planners Admin"
      );
      if (isPlanner.length) {
        // const request = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARREQUERIMIENTOSPORASIGNAR" ();`);
        const request = await PlannersDB.getDigitalRequestAssignmentByID(id);
        if (!request.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message:
                "El requerimiento seleccionado no tiene equipos asociados",
            },
          });
        } else {
          console.log(request);
          const [{ idBusinessModel }] = request;
          const equipments = await PlannersDB.getEquipmentsByDigitalRequest(
            id,
            idBusinessModel
          );
          const equipmentsJTR = await PlannersDB.getAllEquipmentsJTRByRequest(
            id
          );
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message:
                "Se cargaron exitosamente todos los equipos del requerimiento",
              equipments,
              equipmentsJTR,
            },
          });
        }
      } else {
        return res.status(401).send({
          status: 401,
          success: false,
          payload: {
            message: "No te encuentras autorizado a ingresar a esta vista",
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

  async findUserAssignmentByRequest(req, res) {
    try {
      const {
        user: { IDCOLABC },
      } = req;
      const { id } = req.params;
      const isPlanner = await AuthRolesDB.verifyAccessByPermissions(
        IDCOLABC,
        "Planners Admin"
      );
      if (isPlanner.length) {
        // const request = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARREQUERIMIENTOSPORASIGNAR" ();`);
        const users = await PlannersDB.getUserAssignmentByDigitalRequest(id);
        if (!users.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message:
                "El requerimiento seleccionado no tiene equipos asociados",
            },
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message:
                "Se cargaron exitosamente todos los equipos del requerimiento",
              users,
            },
          });
        }
      } else {
        return res.status(401).send({
          status: 401,
          success: false,
          payload: {
            message: "No te encuentras autorizado a ingresar a esta vista",
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

  async findAllPartsEquipmentsByRequest(req, res) {
    try {
      const {
        user: { IDCOLABC },
      } = req;
      const { id } = req.params;
      const isPlanner = await AuthRolesDB.verifyAccessByPermissions(
        IDCOLABC,
        "Planners Admin"
      );
      if (isPlanner.length) {
        // const request = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARREQUERIMIENTOSPORASIGNAR" ();`);
        const parts = await PlannersDB.getPartsEquipmentsByDigitalRequest(id);
        if (!parts.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message:
                "El requerimiento seleccionado no tiene partes asociados",
            },
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message:
                "Se cargaron exitosamente todos los equipos del requerimiento",
              parts,
            },
          });
        }
      } else {
        return res.status(401).send({
          status: 401,
          success: false,
          payload: {
            message: "No te encuentras autorizado a ingresar a esta vista",
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

  async createUserAssignmentByPlanner(req, res) {
    try {
      const { decoded } = req;
      const { id } = req.params;
      const { user, startDate } = req.body;
      if (id && decoded && Object.keys(user).length) {
        // const request = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARREQUERIMIENTOPORID" (${id});`);
        const request = await DigitalRequestDB.getDigitalRequestByID(id);
        if (!request.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message:
                "El requerimiento de la oportunidad seleccionada no se encontro en la base de datos",
            },
          });
        } else {
          // const verifyAssignment = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."VERIFICARASIGNACIONREQUERIMIENTO" (${id});`);
          const verifyAssignment =
            await PlannersDB.getValidAssigningByDigitalRequest(id);
          if (verifyAssignment.length) {
            const [{ nombreUsuario }] = verifyAssignment;
            const subject = "Notificación de Reasignación";
            const content = `Se ha realizado la asignación de otro ingeniero para trabajar el número de OPP <strong>${request[0].opportunityNumber}</strong>, previamente asignada a su persona. Muchas gracias por su colaboración`;
            const html = renderEmailEscaltionEngineer(subject, content);
            const emailSended = await SendMail.sendMailMaintenance(
              html,
              subject,
              [], // attachments
              `${nombreUsuario}@GBM.NET`,
              "" // cc
            );
            await PlannersDB.deactivatedUserAssignmentByDigitalRequest(id);
            // return res.status(404).send({
            //   status: 404,
            //   success: false,
            //   payload: {
            //     message:
            //       "El requerimiento de la oportunidad que intentas asignar, se encuentra asignada en el sistema",
            //   },
            // });
          }
          const { USERNAME, IDCOLABC, EMAIL } = user;
          // const assignmentCreated = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARASIGNACIONDEUSUARIO" (${IDCOLABC}, '${USERNAME}', ${id});`);
          const assignmentCreated =
            await PlannersDB.createUserAssignmentByDigitalRequest(
              IDCOLABC,
              USERNAME,
              id,
              startDate
            );
          if (!assignmentCreated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message:
                  "Ocurrío un error interno intentando asignar al ingeniero",
              },
            });
          } else {
            const [{ id_Asignacion }] = assignmentCreated;
            const [{ state }] = request;
            if (parseInt(state, 10) === 9) {
              // await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARESTADOREQUERIMIENTO" (${id}, 6);`);
              await DigitalRequestDB.updateStatusDigitalRequestByID(6, id);
              // await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."DESACTIVARPARTESEQUIPOIBMPENDIENTES" (${id});`);
              await PlannersDB.deactivateEquipmentsPartsPendingByDigitalRequest(
                id
              );
            }
            // await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARBITACORAASIGNACION" ('${request.state === 5 ? 'Asignación de un recurso para obtener configuración' : 'Asignación de un recurso para validación de partes'}', ${id_Asignacion}, '${decoded}');`);
            await DigitalRequestDB.createLogAssignmentsByID(
              `${
                parseInt(request.state, 10) === 5
                  ? "Asignación de un recurso para obtener configuración"
                  : "Asignación de un recurso para validación de partes"
              }`,
              decoded,
              id_Asignacion
            );
            const flag = await notifyUserAssignment(
              request[0],
              EMAIL,
              startDate
            );
            // const pendings = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARREQUERIMIENTOSPORASIGNAR" ();`);
            const pendings = await PlannersDB.getDigitalRequestByAssigning();
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: `La asignación del recurso se realizo exitosamente, ${
                  flag
                    ? "se notifico efectivamente al usuario."
                    : "pero no se logro notificar correctamente al usuario."
                }`,
                id,
                length: pendings.length,
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

  async createUserAssignmentWithEquipmentsByPlanner(req, res) {
    try {
      const { decoded } = req;
      const { id } = req.params;
      console.log(req.body);
      const { user, equipments, startDate } = req.body;
      if (
        id &&
        decoded &&
        startDate &&
        Object.keys(user).length &&
        Object.keys(equipments).length
      ) {
        // const request = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARREQUERIMIENTOPORID" (${id});`);
        const request = await DigitalRequestDB.getDigitalRequestByID(id);
        if (!request.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message:
                "El requerimiento de la oportunidad seleccionada no se encontro en la base de datos",
            },
          });
        } else {
          const { USERNAME, IDCOLABC, EMAIL } = user;
          // const assignmentCreated = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARASIGNACIONDEUSUARIO" (${IDCOLABC}, '${USERNAME}', ${id});`);
          const assignmentCreated =
            await PlannersDB.createUserAssignmentByDigitalRequest(
              IDCOLABC,
              USERNAME,
              id,
              startDate
            );
          if (!assignmentCreated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message:
                  "Ocurrío un error interno intentando asignar al ingeniero",
              },
            });
          } else {
            const [{ id_Asignacion }] = assignmentCreated;
            for (const row of equipments) {
              const verifyAssignment = await PlannersDB.getValidAssigningByID(
                row.idAssign
              );
              if (verifyAssignment.length) {
                const [{ nombreUsuario }] = verifyAssignment;
                const subject = "Notificación de Reasignación";
                const content = `Se ha realizado la asignación de otro ingeniero para trabajar el número de OPP <strong>${request[0].opportunityNumber}</strong>, previamente asignada a su persona. Muchas gracias por su colaboración`;
                const html = renderEmailEscaltionEngineer(subject, content);
                const emailSended = await SendMail.sendMailMaintenance(
                  html,
                  subject,
                  [], // attachments
                  `${nombreUsuario}@GBM.NET`,
                  "" // cc
                );
              }
              await PlannersDB.deactivatedUserAssignmentByID(row.idAssign);
              await PlannersDB.deactivatedUserEquipmentsByIDAssignment(
                row.idAssign
              );
              await PlannersDB.createUserAssignmentWithEquipments(
                row.id,
                id_Asignacion
              );
            }
            const [{ state }] = request;
            if (parseInt(state, 10) === 9) {
              // await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARESTADOREQUERIMIENTO" (${id}, 6);`);
              await DigitalRequestDB.updateStatusDigitalRequestByID(6, id);
              // await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."DESACTIVARPARTESEQUIPOIBMPENDIENTES" (${id});`);
              for (const element of equipments) {
                await PlannersDB.deactivateEquipmentsPartsPendingByEquipmentID(
                  element.id
                );
              }
            }
            // await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARBITACORAASIGNACION" ('${request.state === 5 ? 'Asignación de un recurso para obtener configuración' : 'Asignación de un recurso para validación de partes'}', ${id_Asignacion}, '${decoded}');`);
            await DigitalRequestDB.createLogAssignmentsByID(
              `${
                parseInt(request.state, 10) === 5
                  ? "Asignación de un recurso para obtener configuración"
                  : "Asignación de un recurso para validación de partes"
              }`,
              decoded,
              id_Asignacion
            );
            const flag = await notifyUserAssignment(
              request[0],
              EMAIL,
              startDate
            );
            // const pendings = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARREQUERIMIENTOSPORASIGNAR" ();`);
            const pendings = await PlannersDB.getDigitalRequestByAssigning();
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: `La asignación del recurso se realizo exitosamente, ${
                  flag
                    ? "se notifico efectivamente al usuario."
                    : "pero no se logro notificar correctamente al usuario."
                }`,
                id,
                length: pendings.length,
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

  async validateGbmCollaborator(req, res) {
    try {
      const { username } = req.body;
      if (username) {
        const response = await WebService.getUser(config.APP, username);
        const { ESTADO } = response;
        if (ESTADO === "I") {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El usuario ingresado no es válido en la compañía",
            },
          });
        } else {
          response.USERNAME = username;
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "El usuario ingresado en válido en la compañía.",
              response,
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
}
