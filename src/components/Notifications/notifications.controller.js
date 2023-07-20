/* eslint-disable max-lines */
/* eslint-disable no-await-in-loop */
/* eslint-disable complexity */
/* eslint-disable no-confusing-arrow */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
import moment from "moment";
import utf8 from "utf8";
import DB2 from "../../db/db2";
import ExtraHoursDB from "../../db/ExtraHours/extraHoursDB";
import NewPositionDB from "../../db/NewPosition/newPositionDB";
import TargetLetterDB from "../../db/TargetLetter/targetLetter";
import EventsDB from "../../db/events/eventsDB";
import AuthRolesDB from "../../db/Auth/AuthRolesDB";
import Calculadora from "../../helpers/calc.js";
import EngineersDB from "../../db/Sales/EngineersDB";
import InventoriesDB from "../../db/Sales/InventoriesDB";
import PlannersDB from "../../db/Sales/PlannersDB";
import SalaryDB from "../../db/salary/SalaryDB";
import MRDB from "../../db/MedicalRecords/MRDB";
import FFDB from "../../db/FinancialFlows/FFDB";
import EIDB from "../../db/ExitInterview/exitInterviewDB";
import _ from "lodash";

const verifyUtf8 = (text) => {
  try {
    return utf8.decode(text);
  } catch (error) {
    return text;
  }
};

const filterTeams = (teams) => {
  const arrayAllTeams = teams.filter((e) => e.includes("Extra Hours"));
  const arrayCountryRols = arrayAllTeams.map((e) =>
    e.split(" ")[2] === undefined ? "REG" : e.split(" ")[2]
  );
  if (arrayCountryRols.some((e) => e === "REG")) {
    return ["CR", "DO", "GT", "HN", "NI", "PA", "SV"];
  } else {
    return arrayCountryRols;
  }
};

export default class NotificationsComponent {
  async findNotificationsUser(req, res) {
    try {
      const { user, teams, decoded } = req;
      // array all notifications
      let notifications = [];

      // const cuota = Calculadora(2960.69, 24, 18, "mensual");
      // console.log(cuota);

      const userSign = await EventsDB.getDigitalSignByUser(user.IDCOLABC);
      if (!userSign.length) {
        await EventsDB.createDigitalSign(decoded, user);
      }

      /*
       * notifications digital signatures
       * find documents that signatures pending by user
       */

      // const documents = [];
      let documents = [
        ...(await DB2.conectionDb2(
          `CALL "DBFIRMAS"."SELECCIONARDOCUMENTOSPENDIENTESUSUARIO" (${user.IDCOLABC});`
        )),
        ...(await DB2.conectionDb2(
          `CALL "DBFIRMAS"."SELECCIONARDOCUMENTOSPENDIENTESUSUARIOPAIS" (${user.IDCOLABC}, '${user.PAIS}');`
        )),
      ];
      if (documents.length) {
        documents = documents.map((element) => {
          element.Descripcion = verifyUtf8(element.Descripcion);
          element.Texto_Documento = JSON.parse(element.Texto_Documento);
          return element;
        });

        notifications = [
          ...notifications,
          {
            type: "signature",
            title: "Firma de políticas",
            description: "Tienes políticas de GBM pendientes por firmar.",
            createdAt: documents[0].Year,
          },
        ];
      }

      /*
       * notifications digital signatures
       * find documents that signatures pending approval by supervisor flow
       */
      const signaturesPending = await DB2.conectionDb2(
        `CALL "DBFIRMAS"."SELECCIONARFIRMASPENDIENTESDEREVISION" ('${decoded}');`
      );
      if (signaturesPending.length) {
        notifications = [
          ...notifications,
          {
            type: "signature-supervisor-flow",
            title: "Políticas en Flujo de Aprobación",
            description:
              "Tienes políticas pendientes de revisión de recursos que te reportan.",
            createdAt: signaturesPending[0].Year,
          },
        ];
      }

      /*
       * notifications digital signatures
       * find documents that signatures pending correction by collaborator
       */
      const signaturesInCorrection = await DB2.conectionDb2(
        `CALL "DBFIRMAS"."SELECCIONARFIRMASACTIVASENFLUJO" (${user.IDCOLABC});`
      );
      if (signaturesInCorrection.length) {
        notifications = [
          ...notifications,
          {
            type: "signature-collaborator-flow",
            title: "Políticas en Flujo de Corrección",
            description:
              "Tienes políticas pendientes de la correción indicada por tu jefatura.",
            createdAt: signaturesInCorrection[0].Year,
          },
        ];
      }

      /*
       * notifications New Position
       * get vacant positions pending approval
       */
      const unapprovedVacantPositions =
        await NewPositionDB.getUnapprovedVacantPositions();
      if (
        unapprovedVacantPositions.length &&
        teams.includes("New Position Admin")
      ) {
        notifications = [
          ...notifications,
          {
            type: "vacant-position",
            title: "Posición vacante",
            description:
              "Tienes posiciones vacantes pendientes de aprobar o rechazar",
            createdAt: unapprovedVacantPositions[0].createdAt,
          },
        ];
      }

      /*
       * notifications Extra Hours
       * check if there are overtime pending to be approved
       */
      const teamsExtraHours = filterTeams(teams);
      if (teamsExtraHours.length) {
        const extrasToSend = await ExtraHoursDB.getExtrasSend(teamsExtraHours);
        if (extrasToSend.length) {
          notifications = [
            ...notifications,
            {
              type: "extra-hours",
              title: "Horas Extras",
              description:
                "Tienes horas extras pendientes de aprobar o rechazar.",
              createdAt: extrasToSend[0].createdAt,
            },
          ];
        }
      }

      /*
       * notifications Objective Letter
       * look for the letters of objectives pending approval
       */
      /*
       * verify if signed user is HC
       */
      const isHumanCapital = await TargetLetterDB.findHumanCapitalManagerById(
        user.IDCOLABC
      );
      if (isHumanCapital.length) {
        // const [ persArea, country ] = isHumanCapital;
        const persArea = isHumanCapital.map((row) => row.persArea);
        const country = isHumanCapital.map((row) => row.country);

        /*
         * verify if HC have lleter pending for reviewed
         */
        const targetLetter = await TargetLetterDB.findTargetLettersPendingHCM(
          persArea,
          country
        );
        if (targetLetter.length) {
          /*
           * [targetLetter] = targetLetter;
           * const targets = await TargetLetterDB.findTargetsById(targetLetter.id);
           * console.log(targets);
           */
          notifications = [
            ...notifications,
            {
              type: "target-letter-hc",
              title: "Carta de objetivos",
              description:
                "Tienes cartas de objetivos pendientes de aprobar o rechazar.",
              createdAt: targetLetter[0].createdAt,
            },
          ];
        }
      }

      /*
       * verify if signed user have target letter pending for reviewed
       */
      const targetsLetterUser =
        await TargetLetterDB.findTargetLettersPendingCollaborator(
          user.IDCOLABC
        );
      if (targetsLetterUser.length) {
        notifications = [
          ...notifications,
          {
            type: "target-letter-user",
            title: "Carta de objetivos",
            description: `Estimado colaborador, ya esta disponible tu carta de objetivos para el periodo ${moment(
              targetsLetterUser[0].createdAt
            ).year()}.`,
            createdAt: targetsLetterUser[0].createdAt,
          },
        ];
      }

      /*
       * verify if signed user is HeadShip
       */
      const targetsLetterHeadShip =
        await TargetLetterDB.findTargetLettersPendingHeadShip(user.IDCOLABC);
      if (targetsLetterHeadShip.length) {
        notifications = [
          ...notifications,
          {
            type: "target-letter-headship",
            title: "Carta de objetivos",
            description: `Tienes cartas de objetivos por aprobar o rechazar en su codición de jefatura.`,
            createdAt: targetsLetterHeadShip[0].createdAt,
          },
        ];
      }

      const isHumanCapitalRegional =
        await TargetLetterDB.findHumanCapitalRegionalManagerById(user.IDCOLABC);
      if (isHumanCapitalRegional.length) {
        /*
         * const persArea = isHumanCapitalRegional.map((row) => row.persArea);
         * const country = isHumanCapitalRegional.map((row) => row.country);
         */
        const [{ persArea, country }] = isHumanCapitalRegional;

        /*
         * verify if HC have lleter pending for reviewed
         */
        const targetLetter = await TargetLetterDB.findTargetLettersPendingHCRM(
          persArea,
          country
        );
        if (targetLetter.length) {
          /*
           * [targetLetter] = targetLetter;
           * const targets = await TargetLetterDB.findTargetsById(targetLetter.id);
           * console.log(targets);
           */
          notifications = [
            ...notifications,
            {
              type: "target-letter-hc-regional",
              title: "Carta de objetivos",
              description:
                "Tienes cartas de objetivos pendientes de aprobar o rechazar.",
              createdAt: targetLetter[0].createdAt,
            },
          ];
        }
      }

      /*
       * verify if signed user is General Manager
       */
      const isGeneralManager = await TargetLetterDB.findGeneralManagerById(
        user.IDCOLABC
      );
      if (isGeneralManager.length) {
        // const [ persArea, country ] = isHumanCapital;
        const persArea = isGeneralManager.map((row) => row.persArea);
        const country = isGeneralManager.map((row) => row.country);

        /*
         * verify if General Manager have lleter pending for reviewed
         */
        const targetLetter =
          await TargetLetterDB.findTargetLettersPendingGeneralManager(
            persArea,
            country
          );
        if (targetLetter.length) {
          notifications = [
            ...notifications,
            {
              type: "target-letter-g-manager",
              title: "Carta de objetivos",
              description:
                "Tienes cartas de objetivos pendientes de aprobar o rechazar en su codición de Gerente General.",
              createdAt: targetLetter[0].createdAt,
            },
          ];
        }
      }

      /*
       * verify if signed user is Management Services Director
       */
      const isManagementServicesDirector =
        await TargetLetterDB.findManagementServicesDirectorById(user.IDCOLABC);
      if (isManagementServicesDirector.length) {
        // const [ persArea, country ] = isHumanCapital;
        const persArea = isManagementServicesDirector.map(
          (row) => row.persArea
        );
        const country = isManagementServicesDirector.map((row) => row.country);

        /*
         * verify if General Manager have lleter pending for reviewed
         */
        const targetLetter =
          await TargetLetterDB.findTargetLettersPendingManagementServicesDirector(
            persArea,
            country
          );
        if (targetLetter.length) {
          notifications = [
            ...notifications,
            {
              type: "target-letter-m-services",
              title: "Carta de objetivos",
              description:
                "Tienes cartas de objetivos pendientes de aprobar o rechazar en su codición de Management Services Director.",
              createdAt: targetLetter[0].createdAt,
            },
          ];
        }
      }

      /*
       * notifications Planners Digital Request
       * look for the digital request pending assigned
       */
      const isPlanners = await AuthRolesDB.verifyAccessByPermissions(
        user.IDCOLABC,
        "Planners Admin"
      );
      if (isPlanners.length) {
        // const requests = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARREQUERIMIENTOSPORASIGNAR" ();`);
        const requests =
          await await PlannersDB.getAllDigitalRequestByAssignment();
        if (requests.length) {
          notifications = [
            ...notifications,
            {
              type: "planners-flow",
              title: "Asignación de Oportunidades",
              description: `Tienes oportunidades pendientes por asignar un recurso para obtener una configuración o validación de partes.`,
              createdAt: requests[0].createdAt,
            },
          ];
        }
      }

      /*
       * verify if signed user have digital requirement assignment
       */
      // const digitalRequests = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARREQUERIMIENTOSASIGNADOSPORUSUARIO" (${user.IDCOLABC});`);
      const digitalRequests =
        await EngineersDB.getDigitalRequestAssigningByUser(user.IDCOLABC);
      if (digitalRequests.length) {
        notifications = [
          ...notifications,
          {
            type: "request_assignment",
            title: "Oportunidades Asignadas",
            description: `Tienes oportunidades asignadas por un planner, para obtener una configuración o validación de partes.`,
            createdAt: digitalRequests[0].createdAt,
          },
        ];
      }
      /*
       * notifications Exit Interview to Collaborator
       */
      const requestEI = await EIDB.getAllDraftInterviewsStatus(user.IDCOLABC);

      if (requestEI.length) {
        notifications = [
          ...notifications,
          {
            type: "exit-interview",
            title: "Entrevista de Salida",
            description: `Tienes una entrevista de salida asignada por Human Capital.`,
            createdAt: requestEI[0].createdAt,
          },
        ];
      }
      /*
       * notifications Exit Interview to HCM
       */
      const requestEIHCM = await EIDB.getAllDraftInterviewsCompleteByUser(
        user.EMAIL.split("@")[0]
      );

      if (requestEIHCM.length) {
        notifications = [
          ...notifications,
          {
            type: "exit-interview-hcm",
            title: "Entrevista de Salida Completas",
            description: `Tiene entrevistas de salida  que ya han sido completadas por el colaborador.`,
            createdAt: requestEIHCM[0].createdAt,
          },
        ];
      }
      /*
       * notifications FF aprobaciones pendientes
       */
      //#region
      let requests = await FFDB.getRequests();
      const userFF = user.EMAIL.split("@")[0];
      let approvePending = [];
      for (let index = 0; index < requests.length; index++) {
        if (
          requests[index].StateID === 0 ||
          requests[index].StateID === 1 ||
          requests[index].StateID === 2
        ) {
          const requerstApprovers = await FFDB.getRequestApprovers(
            requests[index].id
          );
          let requester = await FFDB.getSignID(requests[index].requester);
          requests[index].requester = requester.name;
          requests[index].launched = true;
          if (requerstApprovers.length > 0) {
            for (
              let approver = 0;
              approver < requerstApprovers.length;
              approver++
            ) {
              if (requerstApprovers[approver].secondary !== null)
                requerstApprovers[approver].secondary = await FFDB.getSignID(
                  requerstApprovers[approver].secondary
                );
            }

            const nextAprroverInfo = _.find(
              requerstApprovers,
              function (approver) {
                return approver.status === null;
              }
            );
            if (nextAprroverInfo) {
              if (nextAprroverInfo.secondary) {
                if (
                  nextAprroverInfo.username === userFF ||
                  nextAprroverInfo.secondary.user === userFF
                )
                  approvePending.push(requests[index]);
              } else {
                if (nextAprroverInfo.username === userFF)
                  approvePending.push(requests[index]);
              }
            }
          } else if (requerstApprovers.length === 0) {
            if (userFF === requester.user) {
              requests[index].launched = false;
              approvePending.push(requests[index]);
            }
          }
        }
      }
      //#endregion

      if (approvePending.length) {
        notifications = [
          ...notifications,
          {
            type: "finance-flows-notificactions",
            title: "Aprobaciones pendientes de finanzas",
            description: `Tiene una solicitud pendiente de aprobar, favor proceder mediante el siguiente link.`,
            createdAt: approvePending[0].createdAt,
          },
        ];
      }

      /*
       * notifications Inventories Digital Request
       * look for the digital request pending quotation
       */
      // const isInventories = await AuthRolesDB.verifyAccessByPermissions(user.IDCOLABC, 'Inventories Admin');
      if (teams.includes("Inventories Admin")) {
        // const requests = await DB2.conectionDb2(`CALL "DBPARTESCRITICAS"."SELECCIONARREQUERIMIENTOSPORESTADO" (7);`);
        const requests =
          await InventoriesDB.getDigitalRequestInQuotationStatus();
        if (requests.length) {
          notifications = [
            ...notifications,
            {
              type: "inventory-price",
              title: "Cotización de Oportunidades",
              description: `Tienes oportunidades para cotización de FRUs y obtención de los costos unitarios para la generación de una oferta final.`,
              createdAt: requests[0].createdAt,
            },
          ];
        }
      }

      // Events data
      const events = [];
      const [eventsData] = await EventsDB.getEvents();
      if (eventsData.length) {
        for (let x = 0; x < eventsData.length; x++) {
          const eventLog = await EventsDB.getUserEventLogs(
            decoded,
            eventsData[x].id
          );
          console.log(eventLog);
          if (
            eventsData[x].type == "monetary" ||
            eventsData[x].type == "both"
          ) {
            const currency = await EventsDB.getUserCurrency(user.PAIS);
            if (currency) {
              eventsData[x].currency = currency;
            } else {
              eventsData[x].currency = [];
            } // SI EL USUARIO TIENE UN PAIS EXTERNO A LAS MONEDAS QUE MANEJAMOS, SE LE MOSTRARA EN DOLARES
          }

          if (!eventLog) {
            events.push(eventsData[x]);
          }
        }
      }

      const salaryRequest = await SalaryDB.getUserSalaryApprovals(decoded);

      if (salaryRequest.length > 0) {
        for (let index = 0; index < salaryRequest.length; index++) {
          if (salaryRequest[index].status === null) {
            const requerstApprovers = await SalaryDB.getRequestApprovers(
              salaryRequest[index].id
            );
            const nextAprroverInfo = _.find(
              requerstApprovers,
              (approver) => approver.status === null
            );
            if (nextAprroverInfo) {
              if (nextAprroverInfo.username === decoded) {
                notifications.push({
                  type: "salary-approvals",
                  title: "Flujos de aprobaciónes Salariales",
                  description: "Se requiere su atención en un Flujo Activo.",
                  createdAt: salaryRequest[index].createdAt,
                  RequestID: salaryRequest[index].id,
                });
              }
            }
          }
        }
      }

      const medical = {
        record: null,
        hidden: false,
      };

      if (userSign.length) {
        const SignID = userSign[0].id;
        const medicalRecord = await MRDB.getUserRecord(SignID);
        if (!medicalRecord) {
          medical.record = null;
          medical.hidden = await MRDB.checkNotification(SignID);
        } else {
          medical.record = medicalRecord;
          medical.hidden = await MRDB.checkNotification(SignID);
        }
      }
      const FFRequests = await FFDB.getRequestsByUser(decoded);
      if (FFRequests.length > 0) {
        for (let index = 0; index < FFRequests.length; index++) {
          const requerstApprovers = await FFDB.getRequestApprovers(
            FFRequests[index].id
          );
          if (requerstApprovers.length === 0) {
            notifications.push({
              type: "financial-flows",
              title: `Flujos pendiente de lanzamiento #${FFRequests[index].id}`,
              description:
                "Se creó la solicitud pero no termino de ser modificada y lanzada.",
              createdAt: FFRequests[index].createdAt,
              RequestID: FFRequests[index].id,
            });
          }
        }
      }

      res.status(200).send({
        status: 200,
        success: false,
        payload: {
          documents,
          notifications,
          events,
          medical,
          message: `Las notificaciones se cargaron exitosamente.`,
        },
      });
    } catch (error) {
      console.log(`Error: ${error.toString()}`);
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
