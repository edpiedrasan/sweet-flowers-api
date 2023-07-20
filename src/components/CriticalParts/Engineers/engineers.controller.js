/* eslint-disable no-ternary */
/* eslint-disable max-lines */
/* eslint-disable max-depth */
/* eslint-disable guard-for-in */
/* eslint-disable no-await-in-loop */
/* eslint-disable prefer-destructuring */
import moment from "moment";
import DigitalRequestDB from "../../../db/Sales/DigitalRequestDB";
// import DB2 from "../../../db/db2";
import EngineersDB from "../../../db/Sales/EngineersDB";
import { renderEmailRequestReturnPlanner } from "../../../helpers/renderContent";
import SendMail from "../../../helpers/sendEmail";

const notifyPlannersJTR = async (id, opp, createdBy, engineer) => {
  const [comment] = await EngineersDB.getCommentEngineerByDigitalRequest(id, 3);
  const html = renderEmailRequestReturnPlanner(
    opp,
    createdBy.split("@")[0],
    engineer,
    comment ? comment.comment : "N/A"
  );
  const emailSended = await SendMail.sendMailMaintenance(
    html,
    "Opp de ventas regresada por Ingeniero",
    [], // attachments
    "oficina_de_planificacion@gbm.net", // to oficina_de_planificacion@gbm.net
    `${engineer}@gbm.net` // cc
  );
  return emailSended;
};

export default class EngineersComponent {
  async findRequestsAssignationUser(req, res) {
    try {
      const { user } = req;
      if (Object.keys(user).length) {
        const { IDCOLABC } = user;
        // const requests = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARREQUERIMIENTOSASIGNADOSPORUSUARIO" (${IDCOLABC});`);
        const requests = await EngineersDB.getDigitalRequestAssigningByUser(
          IDCOLABC
        );
        if (!requests.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "Al día de hoy, no tienes oportunidades asignadas",
            },
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message:
                "Se cargaron exitosamente todas las oportunidades asignadas",
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
                row.assignmentCreation = moment(row.assignmentCreation)
                  .utc()
                  .utcOffset(-300)
                  .locale("es")
                  .format();
                row.assignmentUpdate = moment(row.assignmentUpdate)
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

  async findCriticalPartsKit(req, res) {
    try {
      const { typeModel } = req.params;
      if (typeModel) {
        // const kit = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARKITDEPARTESCRITICAS" ('${typeModel}');`);
        const kit = await EngineersDB.getCriticalPartsKitDigitalRequest(
          typeModel
        );
        if (!kit.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message:
                "Al día de hoy, no exite el kit de partes críticas para el modelo del equipo seleccionado.",
            },
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message:
                "Se cargo exitosamente el kit de partes críticas para el modelo del equipo seleccionado.",
              kit: kit.map((row) => {
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

  async findEquipmentsSelectedParts(req, res) {
    try {
      const { idRequest } = req.params;
      // const equipments = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONAREQUIPOSCONPARTESSELECCIONADAS" (${idRequest});`);
      const equipments =
        await EngineersDB.getEquipmentsWithPartsByDigitalRequest(idRequest);
      if (!equipments.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message:
              "Al día de hoy, no exiten equipos con partes críticas seleccionadas.",
          },
        });
      } else {
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message:
              "Se cargaron exitosamente los identificadores de los equipos con partes críticas seleccionadas.",
            equipments: equipments.map((row) => {
              row.parts = {
                created: [],
                errors: [],
              };
              return row;
            }),
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

  async findEquipmentsPendingParts(req, res) {
    try {
      const { idRequest } = req.params;
      // const equipments = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONAREQUIPOSCONPARTESPENDIENTES" (${idRequest});`);
      const equipments =
        await EngineersDB.getEquipmentsPartsPendingsByDigitalRequest(idRequest);
      if (!equipments.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message:
              "Al día de hoy, no exiten equipos con partes críticas seleccionadas.",
          },
        });
      } else {
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message:
              "Se cargaron exitosamente los identificadores de los equipos con partes críticas seleccionadas.",
            equipments,
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

  async findEquipmentsIBMRequest(req, res) {
    try {
      const {
        user: { IDCOLABC },
      } = req;
      const { idRequest } = req.params;
      if (idRequest) {
        const request = await DigitalRequestDB.getDigitalRequestByID(idRequest);
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
          const [{ idBusinessModel }] = request;
          const [{ idAssignment }] =
            await EngineersDB.getDigitalRequestAssigningByUserIDRequest(
              IDCOLABC,
              idRequest
            );
          const equipmentsAssigment =
            await EngineersDB.getEquipmentsAssignmentByAssignment(idAssignment);
          console.log(equipmentsAssigment);
          // const ibmEquipments = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONAREQUIPOSCONSOLIDADOPORREQUERIMIENTO" (${idRequest});`);
          let ibmEquipments = [];
          if (equipmentsAssigment.length) {
            ibmEquipments =
              await EngineersDB.getEquipmentsConsolidatesAssignmentByDigitalRequest(
                idBusinessModel,
                idRequest,
                idAssignment
              );
          } else {
            ibmEquipments =
              await EngineersDB.getEquipmentsConsolidatesByDigitalRequest(
                idBusinessModel,
                idRequest
              );
          }
          if (!ibmEquipments.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message:
                  "Al día de hoy, no exiten equipos para el requerimiento seleccionado.",
              },
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message:
                  "Se cargaron exitosamente los equipos del requerimiento seleccionado.",
                ibmEquipments,
                allEquipments:
                  await EngineersDB.getEquipmentsConsolidatesByDigitalRequest(
                    idBusinessModel,
                    idRequest
                  ),
                ibmEquipmentsComplete:
                  await EngineersDB.getAllEquipmentsCompleteByDigitalRequest(
                    idBusinessModel,
                    idRequest
                  ),
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

  async findPartsEquipmentsRequest(req, res) {
    try {
      const {
        user: { IDCOLABC },
      } = req;
      const { idRequest } = req.params;
      if (idRequest) {
        const request = await DigitalRequestDB.getDigitalRequestByID(idRequest);
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
          const [{ idBusinessModel }] = request;
          const [{ idAssignment }] =
            await EngineersDB.getDigitalRequestAssigningByUserIDRequest(
              IDCOLABC,
              idRequest
            );
          const equipmentsAssigment =
            await EngineersDB.getEquipmentsAssignmentByAssignment(idAssignment);
          // const parts = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARPARTESEQUIPOSPORREQUERIMIENTO" (${idRequest});`);
          let parts = [];
          if (equipmentsAssigment.length) {
            parts =
              await EngineersDB.getEquipmentsAssignmentPartsByDigitalRequest(
                idBusinessModel,
                idRequest,
                idAssignment
              );
          } else {
            parts = await EngineersDB.getEquipmentsPartsByDigitalRequest(
              idBusinessModel,
              idRequest
            );
          }
          if (!parts.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message:
                  "Al día de hoy, no exiten partes seleccionadas a equipos para el requerimiento seleccionado.",
              },
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message:
                  "Se cargaron exitosamente las partes críticas seleccionadas a los equipos del requerimiento seleccionado.",
                selectedParts: parts,
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

  async findHistoryPartsEquipmentsRequest(req, res) {
    try {
      const { idRequest } = req.params;
      if (idRequest) {
        const request = await DigitalRequestDB.getDigitalRequestByID(idRequest);
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
          const [{ idBusinessModel, opportunityNumber }] = request;
          // const parts = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARPARTESEQUIPOSPORREQUERIMIENTO" (${idRequest});`);
          const parts =
            await EngineersDB.getHistoryEquipmentsPartsByDigitalRequest(
              idBusinessModel,
              idRequest,
              opportunityNumber
            );
          if (!parts.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message:
                  "Al día de hoy, no exiten partes seleccionadas a equipos para el requerimiento seleccionado.",
              },
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message:
                  "Se cargaron exitosamente las partes críticas seleccionadas a los equipos del requerimiento seleccionado.",
                hisortyParts: parts,
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

  async findSelectedPartsByEquipment(req, res) {
    try {
      const { idEquipment } = req.params;
      if (idEquipment) {
        // const selectedParts = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARPARTESEQUIPOSIBM" (${idEquipment});`);
        const selectedParts = await EngineersDB.getPartSelectedByEquipmentIBM(
          idEquipment
        );
        if (!selectedParts.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message:
                "Al día de hoy, no exiten partes críticas seleccionadas para el modelo del equipo seleccionado.",
            },
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message:
                "Se cargaron exitosamente partes críticas seleccionadas para el equipo seleccionado.",
              selectedParts,
              idEquipment,
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

  async createSelectedPartsEquipment(req, res) {
    try {
      const { decoded } = req;
      const { idRequest, idEquipment } = req.params;
      const { partsIds, partsDeleted } = req.body;
      if (idEquipment && partsIds.length) {
        const created = [];
        const errors = [];
        for (const idPart of partsIds) {
          // const validPart = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."VERIFICARPARTESEQUIPOSIBMREQUERIMIENTO" (${idPart}, ${idRequest});`);
          const validPart =
            await EngineersDB.validCritialPartEquipmentByDigitalRequest(
              idPart,
              idRequest,
              idEquipment
            );
          if (!validPart.length) {
            // const createdPart = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARPARTESEQUIPOSIBM" (${idPart}, ${idEquipment}, ${idRequest}, '${decoded}')`);
            const createdPart =
              await EngineersDB.createPartsEquipmentByDigitalRequest(
                idPart,
                idEquipment,
                idRequest,
                decoded
              );
            if (createdPart.length) {
              created.push(idPart);
            } else {
              errors.push(idPart);
            }
          }
        }
        for (const idPart of partsDeleted) {
          // await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."DESACTIVARPARTESEQUIPOIBM" (${idEquipment}, ${idPart}, ${idRequest}, '${decoded}')`);
          await EngineersDB.deactivatePartEquipmentByDigitalRequest(
            idEquipment,
            idPart,
            idRequest,
            decoded
          );
        }
        for (const idPart of partsIds) {
          // const validPart = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."VERIFICARPARTESEQUIPOSIBMREQUERIMIENTO" (${idPart}, ${idRequest});`);
          const validPart =
            await EngineersDB.validCritialPartEquipmentByDigitalRequest(
              idPart,
              idRequest,
              idEquipment
            );
          if (!validPart.length) {
            // const createdPart = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTARPARTESEQUIPOSIBM" (${idPart}, ${idEquipment}, ${idRequest}, '${decoded}')`);
            const createdPart =
              await EngineersDB.createPartsEquipmentByDigitalRequest(
                idPart,
                idEquipment,
                idRequest,
                decoded
              );
            if (createdPart.length) {
              created.push(idPart);
            } else {
              errors.push(idPart);
            }
          }
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: `Se guardaron exitosamente ${created.length} de ${partsIds.length} partes seleccionadas`,
            data: {
              idEquipment: parseInt(idEquipment, 10),
              parts: {
                created,
                errors,
              },
            },
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

  async createPendingPartsEquipment(req, res) {
    try {
      const { decoded } = req;
      const { idRequest, idEquipment } = req.params;
      if (idEquipment && idRequest) {
        // const pendingPart = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."INSERTAREQUIPOSIBMCONPARTESPENDIENTES" (${idEquipment}, ${idRequest}, '${decoded}');`);
        const pendingPart =
          await EngineersDB.createPartsPendingsEquipmentByDigitalRequest(
            idEquipment,
            idRequest,
            decoded
          );
        if (!pendingPart.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `No se logro guardar el equipo como pendiente de JTR`,
            },
          });
        } else {
          // await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."DESACTIVARTODASPARTESEQUIPOIBM" (${idEquipment}, ${idRequest}, '${decoded}');`);
          await EngineersDB.deactivateAllPartsEquipmentsByDigitalRequest(
            idEquipment,
            idRequest,
            decoded
          );
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `Se guardo exitosamente el equipo como pendiente de JTR`,
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

  async createCommentaryToJTR(req, res) {
    try {
      const { decoded } = req;
      const { idRequest } = req.params;
      const { comment, type } = req.body;
      if (idRequest && comment && type) {
        const commentCreated =
          await EngineersDB.createCommentaryJTRByDigitalRequest(
            idRequest,
            comment,
            type,
            decoded
          );
        if (!commentCreated.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `No se logro guardar el comentario para la JTR`,
            },
          });
        } else {
          if (parseInt(type, 10) === 3) {
            const request = await DigitalRequestDB.getDigitalRequestByID(
              idRequest
            );
            if (!request.length) {
              return res.status(200).send({
                status: 200,
                success: true,
                payload: {
                  message: `No se logro notificar a la oficina de planificación`,
                },
              });
            } else {
              console.log("Enviar correo");
              const [{ opportunityNumber, createdBy }] = request;
              const notify = await notifyPlannersJTR(
                idRequest,
                opportunityNumber,
                createdBy,
                decoded
              );
            }
          }
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `Se guardo exitosamente el comentario para la JTR`,
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

  async updateStateAssignationUser(req, res) {
    try {
      const { id, state } = req.params;
      if (id && state) {
        // const assignmentUpdate = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARESTADODEASIGNACIONUSUARIO" (${state}, ${id});`);
        let assignmentUpdate = [];
        if (parseInt(state) === 3) {
          assignmentUpdate =
            await EngineersDB.updateStatusAllAssigningUserByidRequest(2, id);
        } else {
          assignmentUpdate = await EngineersDB.updateStatusAssigningUserByID(
            state,
            id
          );
        }
        if (!assignmentUpdate.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message:
                "Ocurrío un error interno al intentar actualizar el estado de la asignación.",
            },
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message:
                "El estado de la asignación fue actualizado exitosamente.",
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

  async updateJTRAssignationUser(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        // const assignmentUpdate = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARESTADODEASIGNACIONUSUARIO" (${state}, ${id});`);
        const assignmentUpdate = await EngineersDB.deactivateAssigningUserByID(
          id
        );
        if (!assignmentUpdate.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message:
                "Ocurrío un error interno al intentar actualizar el estado de la asignación.",
            },
          });
        } else {
          const assignmentEquipmentsUpdate =
            await EngineersDB.deactivateEquipmentsAssigningUserByID(id);
          if (!assignmentEquipmentsUpdate.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message:
                  "Ocurrío un error interno al intentar actualizar el estado de la asignación.",
              },
            });
          }
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message:
                "El estado de la asignación fue actualizado exitosamente.",
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

  async updateFrusAndAmountsSelectedParts(req, res) {
    try {
      const { decoded } = req;
      const { values } = req.body;
      console.log(req.body);
      if (decoded && values) {
        for (const element of values) {
          const { id, fru, amount } = element;
          // await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARFRUSYCANTIDADESPARTES" (${id}, '${fru}', ${amount}, '${decoded}');`);
          await EngineersDB.updateFrusAmountsPartsEquipmentsByID(
            fru,
            amount,
            decoded,
            id
          );
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: `Se actualizaron los FRUs y las cantidades exitosamente de las partes seleccionadas`,
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

  async updateAssignationUserReturnPlanning(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        // const assignmentUpdate = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."ACTUALIZARESTADODEASIGNACIONUSUARIO" (${state}, ${id});`);
        const assignmentUpdate =
          await EngineersDB.updateAssigningUserReturnPlanningByID(id);
        if (!assignmentUpdate.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message:
                "Ocurrío un error interno al intentar actualizar el flujo de la asignación.",
            },
          });
        } else {
          const assignmentEquipmentsUpdate =
            await EngineersDB.deactivateEquipmentsAssigningUserByID(id);
          if (!assignmentEquipmentsUpdate.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message:
                  "Ocurrío un error interno al intentar actualizar el estado de la asignación.",
              },
            });
          }
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message:
                "El flujo de la asignación fue regresado a la oficina de planificación.",
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
