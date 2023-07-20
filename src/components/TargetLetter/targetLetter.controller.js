/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable guard-for-in */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-shadow */
/* eslint-disable no-sync */
/* eslint-disable max-depth */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-ternary */
/* eslint-disable multiline-ternary */
/* eslint-disable complexity */
import fs from 'fs';
import pdf from 'html-pdf';
import moment from "moment";
import "moment/locale/es";
import TargetLetterDB from "../../db/TargetLetter/targetLetter";
import { renderEmailApproved, renderEmailApprovedHCRegional, renderEmailCreateTargetLetter, renderEmailRejectTargetLetter, renderTargetLetterContent, renderTargetLetterPDF, renderEmailApprovedManagementServicesDirector } from "../../helpers/renderContent";
import SendMail from '../../helpers/sendEmail';
import WebService from "../../helpers/webService";
import CONFIG from "../../config/config";

moment.locale("es");

const options = { format: 'Letter' };

const createTargetLetterFile = (html, path) => new Promise((resolve, reject) => {
  pdf.create(html, options).toFile(`${path}`, (err, response) => {
    if (err) {
      console.log(`Error creando archivo de la carta: ${err}`);
      reject([]);
    } else {
      console.log(`Archivo creado en la ruta ${JSON.stringify(response)}`);
      resolve([
        {
          filename: `Carta de Objetivos.pdf`,
          path: `${path}`,
          contentType: 'application/pdf'
        }
      ]);
    }
  });
});

const updateStatesFlowLetter = async (id, action, desicion, comments, decoded, type) => {
  const updateLetter = await TargetLetterDB.updateTargetLetter(id, action, desicion, type);
  const createState = await TargetLetterDB.createStateTargetLetter(
    id,
    `${action === "1" ? 'Aprobación' : 'Rechazo'} de la carta de objetivo por ${desicion === "HC" ? "HC Manager" : desicion === "BOSS" ? "Jefatura" : desicion === "HCRM" ? "HC Regional Manager" : desicion === "G_MANAGERS" ? "Gerente General" : desicion === "M_SERVICES" ? "Management Services Director" : "Colaborador"}`,
    action,
    desicion,
    comments,
    decoded,
  );
  return {
    updateLetter: updateLetter.changedRows === 1,
    createState: createState.affectedRows === 1,
  };
};

const getTimeZone = (country) => {
  let timezone = 0;
  switch (country) {
    case "GBPA":
      timezone = -300;
      break;
    case "GBCR":
      timezone = -360;
      break;
    case "GBGT":
      timezone = -360;
      break;
    case "GBNI":
      timezone = -360;
      break;
    case "GBSV":
      timezone = -360;
      break;
    case "GBUS":
      timezone = -300;
      break;
    case "GBMD":
      timezone = -300;
      break;
    case "GBHN":
      timezone = -360;
      break;
    case "GBDR":
      timezone = -240;
      break;
    default:
      timezone = -300;
  }
  return timezone;
};

export default class TargetLetterController {

  async findTargetsLetterHC(req, res) {
    try {
      const { user } = req;
      if (user) {
        const isHumanCapital = await TargetLetterDB.findHumanCapitalManagerById(user.IDCOLABC);
        if (isHumanCapital.length) {
          // const [{ persArea, country }] = isHumanCapital;
          const persArea = isHumanCapital.map((row) => row.persArea);
          const country = isHumanCapital.map((row) => row.country);
          const targetsLetter = await TargetLetterDB.findTargetLettersPendingHCM(persArea, country);
          if (!targetsLetter.length) {
            res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: `No se logro recuperar las cartas de objetivos.`
              }
            });
          } else {
            const ids = [];
            targetsLetter.forEach((element) => {
              ids.push(element.id);
            });
            const targets = await TargetLetterDB.findTargetsTargetLetter(ids);
            const states = await TargetLetterDB.findStatesTargetLetter(ids);
            res.status(200).send({
              status: 200,
              success: true,
              payload: {
                targetsLetter: targetsLetter.map((row) => {
                  row.states = states.filter((element) => row.id === element.fk_idTargetLetter);
                  row.targets = targets.filter((element) => row.id === element.fk_idTargetLetter);
                  return row;
                }),
                message: `Se cargaron las cartas de objetivos efectivamente.`
              }
            });
          }
        } else {
          res.status(403).send({
            status: 403,
            success: false,
            payload: {
              message: `Usted no es un Human Capital con acceso a ver las cartas de objetivos.`
            }
          });
        }
      } else {
        res.status(403).send({
          status: 403,
          success: false,
          payload: {
            message: `No se encuentra autorizado para realizar la solicitud respectiva.`
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

  async findTargetLetterByUser(req, res) {
    try {
      const { user } = req;
      if (user) {
        let targetsLetterUser = await TargetLetterDB.findTargetLettersPendingCollaborator(user.IDCOLABC);
        if (!targetsLetterUser.length) {
          res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `No se logro recuperar tu carta de objetivos.`
            }
          });
        } else {
          [targetsLetterUser] = targetsLetterUser;
          targetsLetterUser.targets = await TargetLetterDB.findTargetsTargetLetterById(targetsLetterUser.id);
          targetsLetterUser.states = await TargetLetterDB.findStatesTargetLetterById(targetsLetterUser.id);
          res.status(200).send({
            status: 200,
            success: true,
            payload: {
              targetsLetterUser,
              message: `La carta del usuario fue cargada exitosamente.`
            }
          });
        }
      } else {
        res.status(403).send({
          status: 403,
          success: false,
          payload: {
            message: `No se encuentra autorizado para realizar la solicitud respectiva.`
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

  async findTargetLetterByHeadShip(req, res) {
    try {
      const { user } = req;
      if (user) {
        const targetsLetter = await TargetLetterDB.findTargetLettersPendingHeadShip(user.IDCOLABC);
        if (!targetsLetter.length) {
          res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `No se logro obtener las cartas de objetivos pendientes de revisión.`
            }
          });
        } else {
          const ids = [];
          targetsLetter.forEach((element) => {
            ids.push(element.id);
          });
          const targets = await TargetLetterDB.findTargetsTargetLetter(ids);
          const states = await TargetLetterDB.findStatesTargetLetter(ids);
          res.status(200).send({
            status: 200,
            success: true,
            payload: {
              targetsLetter: targetsLetter.map((row) => {
                row.states = states.filter((element) => row.id === element.fk_idTargetLetter);
                row.targets = targets.filter((element) => row.id === element.fk_idTargetLetter);
                return row;
              }),
              message: `Se cargaron las cartas de objetivos efectivamente.`
            }
          });
        }
      } else {
        res.status(403).send({
          status: 403,
          success: false,
          payload: {
            message: `Usted no es un Human Capital con acceso a ver las cartas de objetivos.`
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

  async findTargetLetterByGeneralManager(req, res) {
    try {
      const { user } = req;
      if (user) {
        const isGeneralManager = await TargetLetterDB.findGeneralManagerById(user.IDCOLABC);
        if (isGeneralManager.length) {
          // const [{ persArea, country }] = isHumanCapital;
          const persArea = isGeneralManager.map((row) => row.persArea);
          const country = isGeneralManager.map((row) => row.country);
          const targetsLetter = await TargetLetterDB.findTargetLettersPendingGeneralManager(persArea, country);
          if (!targetsLetter.length) {
            res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: `No se logro recuperar las cartas de objetivos.`
              }
            });
          } else {
            const ids = [];
            targetsLetter.forEach((element) => {
              ids.push(element.id);
            });
            const targets = await TargetLetterDB.findTargetsTargetLetter(ids);
            const states = await TargetLetterDB.findStatesTargetLetter(ids);
            res.status(200).send({
              status: 200,
              success: true,
              payload: {
                targetsLetter: targetsLetter.map((row) => {
                  row.states = states.filter((element) => row.id === element.fk_idTargetLetter);
                  row.targets = targets.filter((element) => row.id === element.fk_idTargetLetter);
                  return row;
                }),
                message: `Se cargaron las cartas de objetivos efectivamente.`
              }
            });
          }
        } else {
          res.status(403).send({
            status: 403,
            success: false,
            payload: {
              message: `Usted no es un Human Capital con acceso a ver las cartas de objetivos.`
            }
          });
        }
      } else {
        res.status(403).send({
          status: 403,
          success: false,
          payload: {
            message: `No se encuentra autorizado para realizar la solicitud respectiva.`
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

  async findTargetLetterByManagementServicesDirector(req, res) {
    try {
      const { user } = req;
      if (user) {
        const isManagementServicesDirector = await TargetLetterDB.findManagementServicesDirectorById(user.IDCOLABC);
        if (isManagementServicesDirector.length) {
          // const [{ persArea, country }] = isHumanCapital;
          const persArea = isManagementServicesDirector.map((row) => row.persArea);
          const country = isManagementServicesDirector.map((row) => row.country);
          const targetsLetter = await TargetLetterDB.findTargetLettersPendingManagementServicesDirector(persArea, country);
          if (!targetsLetter.length) {
            res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: `No se logro recuperar las cartas de objetivos.`
              }
            });
          } else {
            const ids = [];
            targetsLetter.forEach((element) => {
              ids.push(element.id);
            });
            const targets = await TargetLetterDB.findTargetsTargetLetter(ids);
            const states = await TargetLetterDB.findStatesTargetLetter(ids);
            res.status(200).send({
              status: 200,
              success: true,
              payload: {
                targetsLetter: targetsLetter.map((row) => {
                  row.states = states.filter((element) => row.id === element.fk_idTargetLetter);
                  row.targets = targets.filter((element) => row.id === element.fk_idTargetLetter);
                  return row;
                }),
                message: `Se cargaron las cartas de objetivos efectivamente.`
              }
            });
          }
        } else {
          res.status(403).send({
            status: 403,
            success: false,
            payload: {
              message: `Usted no es un Human Capital con acceso a ver las cartas de objetivos.`
            }
          });
        }
      } else {
        res.status(403).send({
          status: 403,
          success: false,
          payload: {
            message: `No se encuentra autorizado para realizar la solicitud respectiva.`
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

  async findTargetLetterByHCRegional(req, res) {
    try {
      const { user } = req;
      if (user) {
        const isHumanCapitalRegional = await TargetLetterDB.findHumanCapitalRegionalManagerById(user.IDCOLABC);
        if (isHumanCapitalRegional.length) {
          const [{
            persArea,
            country
          }] = isHumanCapitalRegional;
          const targetsLetter = await TargetLetterDB.findTargetLettersPendingHCRM(persArea, country);
          if (!targetsLetter.length) {
            res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: `No se logro obtener las cartas de objetivos pendientes de revisión.`
              }
            });
          } else {
            const ids = [];
            targetsLetter.forEach((element) => {
              ids.push(element.id);
            });
            const targets = await TargetLetterDB.findTargetsTargetLetter(ids);
            const states = await TargetLetterDB.findStatesTargetLetter(ids);
            res.status(200).send({
              status: 200,
              success: true,
              payload: {
                targetsLetter: targetsLetter.map((row) => {
                  row.states = states.filter((element) => row.id === element.fk_idTargetLetter);
                  row.targets = targets.filter((element) => row.id === element.fk_idTargetLetter);
                  return row;
                }),
                message: `Se cargaron las cartas de objetivos efectivamente.`
              }
            });
          }
        } else {
          res.status(403).send({
            status: 403,
            success: false,
            payload: {
              message: `No se encuentra autorizado para realizar la solicitud respectiva.`
            }
          });
        }
      } else {
        res.status(403).send({
          status: 403,
          success: false,
          payload: {
            message: `Usted no es un Human Capital con acceso a ver las cartas de objetivos.`
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

  async findMyTargetsLetters(req, res) {
    try {
      const { user: { IDCOLABC } } = req;
      if (IDCOLABC) {
        const myLetters = await TargetLetterDB.findAllTargetsLettersByCollaborator(IDCOLABC);
        if (!myLetters.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "No se encontraron cartas de objetivos relacionadas a tí"
            }
          });
        } else {
          for (const row in myLetters) {
            myLetters[row].targets = await TargetLetterDB.findTargetsTargetLetterById(myLetters[row].id);
            myLetters[row].states = await TargetLetterDB.findStatesTargetLetterById(myLetters[row].id);
          }
          res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: 'Tus cartas de objetivos cargadas exitosamente',
              myLetters,
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

  async findTargetsLetters(req, res) {
    try {
      const { user: { IDCOLABC } } = req;
      const { startDate, endDate } = req.body;
      if (startDate && endDate) {
        const isHumanCapital = [
          ...await TargetLetterDB.findHumanCapitalPayrrolById(IDCOLABC),
          ...await TargetLetterDB.findHumanCapitalManagerById(IDCOLABC),
          ...await TargetLetterDB.findHumanCapitalRegionalManagerById(IDCOLABC)
        ];
        if (!isHumanCapital.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "No tienes acceso para ver la información"
            }
          });
        } else {
          const targetsLetters = await TargetLetterDB.findAllTargetsLetters(moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'), isHumanCapital);
          if (!targetsLetters.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "No se encontraron cartas de objetivos"
              }
            });
          } else {
            for (const row in targetsLetters) {
              targetsLetters[row].targets = await TargetLetterDB.findTargetsTargetLetterById(targetsLetters[row].id);
              targetsLetters[row].states = await TargetLetterDB.findStatesTargetLetterById(targetsLetters[row].id);
            }
            res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: 'Cartas de objetivos cargadas exitosamente',
                targetsLetters,
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

  async findAllDataDashboard(req, res) {
    try {
      const { user: { IDCOLABC } } = req;
      const { country, year } = req.body;
      if (country && year) {
        const isHumanCapital = [
          ...await TargetLetterDB.findHumanCapitalPayrrolById(IDCOLABC),
          ...await TargetLetterDB.findHumanCapitalManagerById(IDCOLABC)
        ];
        if (!isHumanCapital.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "No tienes acceso para ver la información"
            }
          });
        } else {
          const personalAreas = isHumanCapital.map((row) => row.persArea);
          const countries = isHumanCapital.map((row) => row.country);
          const allData = await TargetLetterDB.findAllDataDashboardTargetLetters(year, personalAreas, country === "Todos" ? countries : country);
          const graphStatus = await TargetLetterDB.findGraphStatesDashboardTargetLetters(year, personalAreas, country === "Todos" ? countries : country);
          const graphFlows = await TargetLetterDB.findGraphFlowDashboardTargetLetters(year, personalAreas, country === "Todos" ? countries : country);
          res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: 'Dashboard cartas de objetivos cargado exitosamente',
              allData,
              graphStatus,
              graphFlows,
              years: await TargetLetterDB.findAllYearsTargetLetters(personalAreas, countries),
              countries: await TargetLetterDB.findAllCountriesTargetLetters(personalAreas, countries),
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

  async createTargetLetter(req, res) {
    try {
      const [targetLetter] = req.body;
      const
        {
          REQUESTNUMBER,
          REQUESTDATE,
          REQUESTTIME,
          CREATEDBY,
          COLLABORATOR,
          POSITION,
          STARTDATEPOSITION,
          REQUESTTYPE,
          STARTLETTER,
          ENDLETTER,
          ORGANIZATIONALUNIT,
          FUNTION,
          MANAGER,
          DEPARTAMENT,
          EPMCOMPENSATION,
          PERSSUBAREA,
          STARTDATE,
          COMMENTS,
          TARGETS
        } = targetLetter;
      console.log(JSON.stringify(req.body));

      /*
       * targetLetter.USMANAGER2 = 'FVILLALOBOS';
       * targetLetter.IDMANAGER2 = '60000815';
       */
      if (REQUESTNUMBER && REQUESTDATE && REQUESTTIME && CREATEDBY && COLLABORATOR && POSITION && STARTDATEPOSITION && REQUESTTYPE && STARTLETTER && ENDLETTER && ORGANIZATIONALUNIT && FUNTION && MANAGER && DEPARTAMENT && (EPMCOMPENSATION === 0 || EPMCOMPENSATION === 1) && PERSSUBAREA && STARTDATE && COMMENTS && TARGETS) {
        const targetLetterCreated = await TargetLetterDB.createTargetLetter(targetLetter);
        if (!targetLetterCreated.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `No se logro insertar la carta de objetivo en la base de datos`
            }
          });
        }
        const [letter] = targetLetterCreated;
        if (!letter.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `No se logro obtener el id de la carta de objetivos`
            }
          });
        }
        const [{ idCreated }] = letter;
        TARGETS.forEach(async (element) => {
          await TargetLetterDB.createTargetOfLetter(element, idCreated);
        });
        if (REQUESTTYPE === "04") {
          const generalManagers = await TargetLetterDB.findHumanCapitalByPersSubArea(PERSSUBAREA, ORGANIZATIONALUNIT.split("-")[0], 'g_manager');
          const emails = generalManagers.map((row) => row.email);
          const content = renderEmailCreateTargetLetter(REQUESTNUMBER, REQUESTTYPE, CREATEDBY, COLLABORATOR, POSITION, STARTLETTER, ENDLETTER);
          const emailResponse = await SendMail.sendMailTargetLetterHC(content, 'Nueva carta de objetivos pendiente de revisar', emails, '', []);
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              id: idCreated,
              message: `La carta de objetivos fue creada exitosamente, ${emailResponse ? 'se logro enviar' : 'no se logro enviar'} el correo electronico al Gerente General.`
            }
          });
        } else {
          const humanCapitals = await TargetLetterDB.findHumanCapitalByPersSubArea(PERSSUBAREA, ORGANIZATIONALUNIT.split("-")[0], 'manager');
          if (!humanCapitals.length) {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                id: idCreated,
                message: `La carta de objetivos fue creada exitosamente, sin embargo no existen Human Capitals para en la area personal respectiva.`
              }
            });
          }
          const emails = humanCapitals.map((row) => row.email);
          const content = renderEmailCreateTargetLetter(REQUESTNUMBER, REQUESTTYPE, CREATEDBY, COLLABORATOR, POSITION, STARTLETTER, ENDLETTER);
          const emailResponse = await SendMail.sendMailTargetLetterHC(content, 'Nueva carta de objetivos pendiente de revisar', emails, '', []);
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              id: idCreated,
              message: `La carta de objetivos fue creada exitosamente, ${emailResponse ? 'se logro enviar' : 'no se logro enviar'} el correo electronico al HC Manager.`
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

  async updateWorkFlowLetter(req, res) {
    try {
      const { decoded } = req;
      const { id } = req.params;
      const {
        desicion,
        action,
        comments
      } = req.body;
      if (id && desicion && (action === "1" || action === "2") && comments) {
        const targetLetter = await TargetLetterDB.findTargetLetterById(id);
        if (!targetLetter.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `La carta que intentas continuar en el flujo no existe.`
            }
          });
        } else {
          if (desicion === 'HC') {
            if (action === "2") {
              const [{ requestNumber, createdBy, requestType, collaborator, organizationalUnit }] = targetLetter;
              const response = await WebService.updateTargetLetterState(CONFIG.APP, "R", requestNumber);
              const { E_MSG_RETURN: { TYPE, MESSAGE } } = response;
              if (TYPE === "E") {
                return res.status(404).send({
                  status: 404,
                  success: false,
                  payload: {
                    message: `Ocurrío un error, intentando actualizar el estado de la carta, mensaje de SAP: ${MESSAGE}.`
                  }
                });
              }
              const { updateLetter, createState } = await updateStatesFlowLetter(id, action, desicion, comments, decoded, requestType);
              if (updateLetter && createState) {
                const content = renderEmailRejectTargetLetter(requestNumber, comments, desicion, collaborator, organizationalUnit);
                const emailSended = await SendMail.sendMailTargetLetterHC(content, `La Carta de objetivos número ${requestNumber}, del colaborador ${collaborator} fue rechazada por Human Capital`, `${createdBy}@GBM.NET`, '', []);
                return res.status(200).send({
                  status: 200,
                  success: true,
                  payload: {
                    id,
                    message: `La carta fue ${action === "1" ? 'aprobada' : 'rechazada'} exitosamente, ${emailSended ? 'se notifico' : 'no se logro notificar'} al gerente que creo la carta`
                  }
                });
              } else {
                return res.status(404).send({
                  status: 404,
                  success: false,
                  payload: {
                    message: `Ocurrío un error, intentando actualizar el estado y flujo de la carta. Intentelo nuevamente`
                  }
                });
              }
            } else if (action === "1") {
              const [{ requestNumber, collaborator, position, createdBy, startLetter, endLetter, requestType, persSubArea, organizationalUnit }] = targetLetter;
              const { updateLetter, createState } = await updateStatesFlowLetter(id, action, desicion, comments, decoded, requestType);
              if (updateLetter && createState) {
                if (requestType === "04") {
                  const managementServices = await TargetLetterDB.findHumanCapitalRegByPersSubArea(persSubArea, organizationalUnit.split("-")[0], 'm_services');
                  const emails = managementServices.map((row) => row.email);
                  const content = renderEmailApprovedManagementServicesDirector(requestNumber, requestType, comments, desicion, collaborator);
                  const emailSended = await SendMail.sendMailTargetLetterHC(content, `Carta de objetivos número ${requestNumber} pendiente de revisar`, [
                    ...emails,
                    // `${createdBy}@gbm.net`
                  ], '', []);
                  return res.status(200).send({
                    status: 200,
                    success: true,
                    payload: {
                      id,
                      message: `La carta fue aprobada exitosamente, ${emailSended ? 'se notifico' : 'no se logro notificar'} al Management Services Director.`
                    }
                  });
                } else if (requestType === "02" || requestType === "06") {
                  const humanCapitals = await TargetLetterDB.findHumanCapitalRegByPersSubArea(persSubArea, organizationalUnit.split("-")[0], 'regional');
                  const emails = humanCapitals.map((row) => row.email);
                  const content = renderEmailApprovedHCRegional(requestNumber, requestType, comments, desicion, collaborator);
                  const emailSended = await SendMail.sendMailTargetLetterHC(content, `Carta de objetivos número ${requestNumber} pendiente de revisar`, [
                    ...emails,
                    // `${createdBy}@gbm.net`
                  ], '', []);
                  return res.status(200).send({
                    status: 200,
                    success: true,
                    payload: {
                      id,
                      message: `La carta fue aprobada exitosamente, ${emailSended ? 'se notifico' : 'no se logro notificar'} al HC Regional Manager.`
                    }
                  });
                } else {
                  // const content = renderEmailApproved(requestNumber, collaborator, comments, desicion);
                  // await SendMail.sendMailTargetLetterHC(content, `La Carta de objetivos número ${requestNumber} fue aprobada por Human Capital`, `${createdBy}@GBM.NET`, '', []);
                  const idPosition = position.split("-")[0];
                  const { RUsername } = await WebService.getInfoByPosition("PRD", idPosition);
                  const content2 = renderEmailCreateTargetLetter(requestNumber, requestType, createdBy, collaborator, position, startLetter, endLetter);
                  const emailSended = await SendMail.sendMailTargetLetterHC(content2, 'Nueva carta de objetivos pendiente de revisar', `${RUsername}@GBM.NET`, '', []);
                  return res.status(200).send({
                    status: 200,
                    success: true,
                    payload: {
                      id,
                      message: `La carta fue ${action === "1" ? 'aprobada' : 'rechazada'} exitosamente, ${emailSended ? 'se notifico' : 'no se logro notificar'} al colaborador propietario de la carta`
                    }
                  });
                }
              } else {
                return res.status(404).send({
                  status: 404,
                  success: false,
                  payload: {
                    message: `Ocurrío un error, intentando actualizar el estado y flujo de la carta. Intentelo nuevamente`
                  }
                });
              }
            }
          } else if (desicion === 'USER') {
            let content = null;
            let subject = '';
            const [{ collaborator, requestNumber, createdBy, startLetter, endLetter, createdAt, position, organizationalUnit, funtion, manager, departament, startDate, startDatePosition, persSubArea, requestType }] = targetLetter;
            if (action === "2") {
              const response = await WebService.updateTargetLetterState(CONFIG.APP, "R", requestNumber);
              console.log(response);
              const { E_MSG_RETURN: { TYPE, MESSAGE } } = response;
              if (TYPE === "E") {
                return res.status(404).send({
                  status: 404,
                  success: false,
                  payload: {
                    message: `Ocurrío un error, intentando actualizar el estado de la carta, mensaje de SAP: ${MESSAGE}.`
                  }
                });
              } else {
                const { updateLetter, createState } = await updateStatesFlowLetter(id, action, desicion, comments, decoded, requestType);
                if (updateLetter && createState) {
                  content = renderEmailRejectTargetLetter(requestNumber, comments, desicion, collaborator, organizationalUnit);
                  subject = `La Carta de objetivos número ${requestNumber}, del colaborador ${collaborator} fue rechazada por el colaborador ${collaborator}`;
                  const humanCapitals = await TargetLetterDB.findHumanCapitalByPersSubArea(persSubArea, organizationalUnit.split("-")[0], 'manager');
                  const emails = humanCapitals.map((row) => row.email);
                  const emailSended = await SendMail.sendMailTargetLetterHC(content, subject, [
                    ...emails,
                    `${createdBy}@gbm.net`
                  ], '', []);
                  return res.status(200).send({
                    status: 200,
                    success: true,
                    payload: {
                      id,
                      message: `La carta fue ${action === "1" ? 'aprobada' : 'rechazada'} exitosamente, ${emailSended ? 'se notifico' : 'no se logro notificar'} a Human Capital y su Gerente`
                    }
                  });
                } else {
                  return res.status(404).send({
                    status: 404,
                    success: false,
                    payload: {
                      message: `Ocurrío un error, intentando actualizar el estado y flujo de la carta. Intentelo nuevamente`
                    }
                  });
                }
              }
            } else if (action === "1") {
              const { updateLetter, createState } = await updateStatesFlowLetter(id, action, desicion, comments, decoded, requestType);
              if (updateLetter && createState) {
                const type = requestType === "01" ? `${requestType}-Carta de Objetivos de acuerdo al plan de compensación`
                  : requestType === "02" ? `${requestType}-Cambios en objetivos antes del 30 de setiembre`
                    : requestType === "03" ? `${requestType}`
                      : requestType === "04" ? `${requestType}-Cambios en objetivos después 30 Setiembre o de cuotas + 25%`
                        : requestType === "05" ? `${requestType}-Entrega de Resultados`
                          : requestType === "06" ? `${requestType}-Carta de Objetivos diferente al plan de compensación`
                            : requestType === "07" ? `${requestType}-Carta de Objetivos no indicados en el Plan`
                              : `${requestType}-Cambios de cuotas de EPM`;
                content = renderEmailApproved(requestNumber, requestType, collaborator, comments, desicion);
                subject = `La Carta de objetivos número ${requestNumber} fue aprobada por el colaborador ${collaborator}`;
                const contentLetter = renderTargetLetterContent(collaborator);
                const idPosition = position.split("-")[0];
                const { RUsername, IdUser } = await WebService.getInfoByPosition("PRD", idPosition);
                let targets = await TargetLetterDB.findTargetsTargetLetterById(id);
                targets = targets.map((element) => {
                  element.type = element.type === "01" ? `${element.type}-Facturación`
                    : element.type === "02" ? `${element.type}-Compras`
                      : element.type === "03" ? `${element.type}-Bolsa`
                        : element.type === "04" ? `${element.type}-Certificación`
                          : element.type === "05" ? `${element.type}-Otros (YTD)`
                            : element.type === "06" ? `${element.type}-Otros (Mensual)`
                              : element.type === "07" ? `${element.type}-E.P.M`
                                : element.type === "08" ? `${element.type}-New Signing`
                                  : `${element.type}-Expand`;
                  return element;
                });
                const timezone = getTimeZone(organizationalUnit.split("-")[0]);
                const htmlToPdf = renderTargetLetterPDF(collaborator, requestNumber, createdBy, startLetter, endLetter, createdAt, position, organizationalUnit, type, manager, departament, startDate, startDatePosition, targets, timezone);
                const path = `src/assets/files/CartaObjetivos/${IdUser}`;

                /*
                 * const response = await WebService.updateTargetLetterState("QA", "A", requestNumber);
                 * console.log(response);
                 * const { E_MSG_RETURN: { TYPE, MESSAGE } } = response;
                 * if (TYPE === "E") {
                 *   return res.status(404).send({
                 *     status: 404,
                 *     success: false,
                 *     payload: {
                 *       message: `Ocurrío un error, intentando actualizar el estado de la carta, mensaje de SAP: ${MESSAGE}.`
                 *     }
                 *   });
                 * } else {
                 */
                if (!fs.existsSync(path)) {
                  fs.mkdirSync(path);
                }
                const pathDate = `${path}/${moment().format("YYYY-MM-DD_h-mm-ss")}`;
                if (!fs.existsSync(pathDate)) {
                  fs.mkdirSync(pathDate);
                }
                const attachments = await createTargetLetterFile(htmlToPdf.html, `${pathDate}/targetLetter.pdf`);
                if (!attachments.length) {
                  return res.status(404).send({
                    status: 404,
                    success: false,
                    payload: {
                      message: "Ocurrío un error interno intentando crear la carta de objetivos en PDF"
                    }
                  });
                }
                await SendMail.sendMailTargetLetterHC(contentLetter, `Aprobación de la carta de objetivos número ${requestNumber}`, `${RUsername}@GBM.NET`, '', attachments);
                const humanCapitals = await TargetLetterDB.findHumanCapitalByPersSubArea(persSubArea, organizationalUnit.split("-")[0], 'payrrol');
                const emails = humanCapitals.map((row) => row.email);
                const emailSended = await SendMail.sendMailTargetLetterHC(content, subject, [
                  ...emails,
                  // `${createdBy}@gbm.net`
                ], '', []);
                return res.status(200).send({
                  status: 200,
                  success: true,
                  payload: {
                    id,
                    message: `La carta fue ${action === "1" ? 'aprobada' : 'rechazada'} exitosamente, ${emailSended ? 'se notifico' : 'no se logro notificar'} a Human Capital y su Gerente`
                  }
                });
                // }
              } else {
                return res.status(404).send({
                  status: 404,
                  success: false,
                  payload: {
                    message: `Ocurrío un error, intentando actualizar el estado y flujo de la carta. Intentelo nuevamente`
                  }
                });
              }

              /*
               * pdf.create(htmlToPdf.html, options).toFile(, async (err, res) => {
               *   if (err) {
               *     return console.log(err);
               *   } else {
               *     console.log(`Archivo creado en la ruta ${JSON.stringify(res)}`);
               *     attachments.push({
               *       filename: `Carta de Objetivos.pdf`,
               *       path: `${pathDate}/targetLetter.pdf`,
               *       contentType: 'application/pdf'
               *     });
               *     await SendMail.sendMailTargetLetterHC(contentLetter, `Aprobación de la carta de objetivos número ${requestNumber}`, `${RUsername}@GBM.NET`, '', attachments);
               *   }
               * });
               */
            }

            /*
             * const humanCapitals = await TargetLetterDB.findHumanCapitalByPersSubArea(persSubArea);
             * const emails = humanCapitals.map((row) => row.email);
             * const emailSended = await SendMail.sendMailTargetLetterHC(content, subject, [
             *   ...emails,
             *   `${createdBy}@gbm.net`
             * ], '', []);
             */
          } else if (desicion === 'BOSS') {
            const [{ collaborator, requestNumber, createdBy, startLetter, endLetter, position, organizationalUnit, persSubArea, requestType }] = targetLetter;
            if (action === "2") {
              const [{ requestNumber, createdBy }] = targetLetter;
              const response = await WebService.updateTargetLetterState(CONFIG.APP, "R", requestNumber);
              const { E_MSG_RETURN: { TYPE, MESSAGE } } = response;
              if (TYPE === "E") {
                return res.status(404).send({
                  status: 404,
                  success: false,
                  payload: {
                    message: `Ocurrío un error, intentando actualizar el estado de la carta, mensaje de SAP: ${MESSAGE}.`
                  }
                });
              } else {
                const { updateLetter, createState } = await updateStatesFlowLetter(id, action, desicion, comments, decoded, requestType);
                if (updateLetter && createState) {
                  const humanCapitals = await TargetLetterDB.findHumanCapitalByPersSubArea(persSubArea, organizationalUnit.split("-")[0], 'manager');
                  const emails = humanCapitals.map((row) => row.email);
                  const content = renderEmailRejectTargetLetter(requestNumber, comments, desicion, collaborator, organizationalUnit);
                  const emailSended = await SendMail.sendMailTargetLetterHC(content, `La Carta de objetivos número ${requestNumber}, del colaborador ${collaborator} fue rechazada por la Jefatura`, [
                    ...emails,
                    `${createdBy}@gbm.net`
                  ], '', []);
                  return res.status(200).send({
                    status: 200,
                    success: true,
                    payload: {
                      id,
                      message: `La carta fue rechazada exitosamente, ${emailSended ? 'se notifico' : 'no se logro notificar'} al HC Manager y jefe inmediato`
                    }
                  });
                } else {
                  return res.status(404).send({
                    status: 404,
                    success: false,
                    payload: {
                      message: `Ocurrío un error, intentando actualizar el estado y flujo de la carta. Intentelo nuevamente`
                    }
                  });
                }
              }
            } else if (action === "1") {
              const { updateLetter, createState } = await updateStatesFlowLetter(id, action, desicion, comments, decoded, requestType);
              if (updateLetter && createState) {
                const humanCapitals = await TargetLetterDB.findHumanCapitalByPersSubArea(persSubArea, organizationalUnit.split("-")[0], 'manager');
                const emails = humanCapitals.map((row) => row.email);
                const content = renderEmailCreateTargetLetter(requestNumber, requestType, createdBy, collaborator, position, startLetter, endLetter);
                const emailResponse = await SendMail.sendMailTargetLetterHC(content, 'Nueva carta de objetivos pendiente de revisar', emails, '', []);
                return res.status(200).send({
                  status: 200,
                  success: true,
                  payload: {
                    id,
                    message: `La carta de objetivos fue aprobada exitosamente, ${emailResponse ? 'se notifico' : 'no se logro notificar'} vía correo electronico al HC Manager.`
                  }
                });
              } else {
                return res.status(404).send({
                  status: 404,
                  success: false,
                  payload: {
                    message: `Ocurrío un error, intentando actualizar el estado y flujo de la carta. Intentelo nuevamente`
                  }
                });
              }
            }
          } else if (desicion === 'HCRM') {
            const [{ collaborator, requestNumber, createdBy, startLetter, endLetter, position, organizationalUnit, persSubArea, requestType }] = targetLetter;
            if (action === "2") {
              // const [{ requestNumber, createdBy, requestType }] = targetLetter;
              const response = await WebService.updateTargetLetterState(CONFIG.APP, "R", requestNumber);
              const { E_MSG_RETURN: { TYPE, MESSAGE } } = response;
              if (TYPE === "E") {
                return res.status(404).send({
                  status: 404,
                  success: false,
                  payload: {
                    message: `Ocurrío un error, intentando actualizar el estado de la carta, mensaje de SAP: ${MESSAGE}.`
                  }
                });
              }
              const { updateLetter, createState } = await updateStatesFlowLetter(id, action, desicion, comments, decoded, requestType);
              if (updateLetter && createState) {
                const humanCapitals = await TargetLetterDB.findHumanCapitalByPersSubArea(persSubArea, organizationalUnit.split("-")[0], 'manager');
                const emails = humanCapitals.map((row) => row.email);
                const content = renderEmailRejectTargetLetter(requestNumber, comments, desicion, collaborator, organizationalUnit);
                const emailSended = await SendMail.sendMailTargetLetterHC(content, `La Carta de objetivos número ${requestNumber}, del colaborador ${collaborator} fue rechazada por el Human Capital Regional Manager`, [
                  ...emails,
                  `${createdBy}@gbm.net`
                ], '', []);
                return res.status(200).send({
                  status: 200,
                  success: true,
                  payload: {
                    id,
                    message: `La carta fue rechazada exitosamente, ${emailSended ? 'se notifico' : 'no se logro notificar'} al HC Manager y jefe inmediato`
                  }
                });
              } else {
                return res.status(404).send({
                  status: 404,
                  success: false,
                  payload: {
                    message: `Ocurrío un error, intentando actualizar el estado y flujo de la carta. Intentelo nuevamente`
                  }
                });
              }
            } else if (action === "1") {
              const { updateLetter, createState } = await updateStatesFlowLetter(id, action, desicion, comments, decoded, requestType);
              if (updateLetter && createState) {
                // const content = renderEmailApproved(requestNumber, collaborator, comments, desicion);
                // await SendMail.sendMailTargetLetterHC(content, `La Carta de objetivos número ${requestNumber} fue aprobada por Human Capital Regional Manager`, `${createdBy}@GBM.NET`, '', []);
                const idPosition = position.split("-")[0];
                const { RUsername } = await WebService.getInfoByPosition("PRD", idPosition);
                const content2 = renderEmailCreateTargetLetter(requestNumber, requestType, createdBy, collaborator, position, startLetter, endLetter);
                const emailSended = await SendMail.sendMailTargetLetterHC(content2, 'Nueva carta de objetivos pendiente de revisar', `${RUsername}@GBM.NET`, '', []);
                return res.status(200).send({
                  status: 200,
                  success: true,
                  payload: {
                    id,
                    message: `La carta fue aprobada exitosamente, ${emailSended ? 'se notifico' : 'no se logro notificar'} al colaborador propietario de la carta`
                  }
                });
              } else {
                return res.status(404).send({
                  status: 404,
                  success: false,
                  payload: {
                    message: `Ocurrío un error, intentando actualizar el estado y flujo de la carta. Intentelo nuevamente`
                  }
                });
              }
            }
          } else if (desicion === 'G_MANAGERS') {
            const [{ collaborator, requestNumber, createdBy, startLetter, endLetter, position, organizationalUnit, persSubArea, requestType }] = targetLetter;
            if (action === "2") {
              const [{ requestNumber, createdBy }] = targetLetter;
              const response = await WebService.updateTargetLetterState(CONFIG.APP, "R", requestNumber);
              const { E_MSG_RETURN: { TYPE, MESSAGE } } = response;
              if (TYPE === "E") {
                return res.status(404).send({
                  status: 404,
                  success: false,
                  payload: {
                    message: `Ocurrío un error, intentando actualizar el estado de la carta, mensaje de SAP: ${MESSAGE}.`
                  }
                });
              } else {
                const { updateLetter, createState } = await updateStatesFlowLetter(id, action, desicion, comments, decoded, requestType);
                if (updateLetter && createState) {
                  const humanCapitals = await TargetLetterDB.findHumanCapitalByPersSubArea(persSubArea, organizationalUnit.split("-")[0], 'manager');
                  const emails = humanCapitals.map((row) => row.email);
                  const content = renderEmailRejectTargetLetter(requestNumber, comments, desicion, collaborator, organizationalUnit);
                  const emailSended = await SendMail.sendMailTargetLetterHC(content, `La Carta de objetivos número ${requestNumber}, del colaborador ${collaborator} fue rechazada por el Gerente General`, [
                    ...emails,
                    `${createdBy}@gbm.net`
                  ], '', []);
                  return res.status(200).send({
                    status: 200,
                    success: true,
                    payload: {
                      id,
                      message: `La carta fue rechazada exitosamente, ${emailSended ? 'se notifico' : 'no se logro notificar'} al HC Manager y jefe inmediato`
                    }
                  });
                } else {
                  return res.status(404).send({
                    status: 404,
                    success: false,
                    payload: {
                      message: `Ocurrío un error, intentando actualizar el estado y flujo de la carta. Intentelo nuevamente`
                    }
                  });
                }
              }
            } else if (action === "1") {
              const { updateLetter, createState } = await updateStatesFlowLetter(id, action, desicion, comments, decoded, requestType);
              if (updateLetter && createState) {
                const humanCapitals = await TargetLetterDB.findHumanCapitalByPersSubArea(persSubArea, organizationalUnit.split("-")[0], 'manager');
                const emails = humanCapitals.map((row) => row.email);
                const content = renderEmailCreateTargetLetter(requestNumber, requestType, createdBy, collaborator, position, startLetter, endLetter);
                const emailResponse = await SendMail.sendMailTargetLetterHC(content, 'Nueva carta de objetivos pendiente de revisar', emails, '', []);
                return res.status(200).send({
                  status: 200,
                  success: true,
                  payload: {
                    id,
                    message: `La carta de objetivos fue aprobada exitosamente, ${emailResponse ? 'se notifico' : 'no se logro notificar'} vía correo electronico al HC Manager.`
                  }
                });
              } else {
                return res.status(404).send({
                  status: 404,
                  success: false,
                  payload: {
                    message: `Ocurrío un error, intentando actualizar el estado y flujo de la carta. Intentelo nuevamente`
                  }
                });
              }
            }
          } else if (desicion === 'M_SERVICES') {
            const [{ collaborator, requestNumber, createdBy, startLetter, endLetter, position, organizationalUnit, persSubArea, requestType }] = targetLetter;
            if (action === "2") {
              const [{ requestNumber, createdBy }] = targetLetter;
              const response = await WebService.updateTargetLetterState(CONFIG.APP, "R", requestNumber);
              const { E_MSG_RETURN: { TYPE, MESSAGE } } = response;
              if (TYPE === "E") {
                return res.status(404).send({
                  status: 404,
                  success: false,
                  payload: {
                    message: `Ocurrío un error, intentando actualizar el estado de la carta, mensaje de SAP: ${MESSAGE}.`
                  }
                });
              } else {
                const { updateLetter, createState } = await updateStatesFlowLetter(id, action, desicion, comments, decoded, requestType);
                if (updateLetter && createState) {
                  const humanCapitals = await TargetLetterDB.findHumanCapitalByPersSubArea(persSubArea, organizationalUnit.split("-")[0], 'manager');
                  const emails = humanCapitals.map((row) => row.email);
                  const content = renderEmailRejectTargetLetter(requestNumber, comments, desicion, collaborator, organizationalUnit);
                  const emailSended = await SendMail.sendMailTargetLetterHC(content, `La Carta de objetivos número ${requestNumber}, del colaborador ${collaborator} fue rechazada por el Management Services Director`, [
                    ...emails,
                    `${createdBy}@gbm.net`
                  ], '', []);
                  return res.status(200).send({
                    status: 200,
                    success: true,
                    payload: {
                      id,
                      message: `La carta fue rechazada exitosamente, ${emailSended ? 'se notifico' : 'no se logro notificar'} al HC Manager y jefe inmediato`
                    }
                  });
                } else {
                  return res.status(404).send({
                    status: 404,
                    success: false,
                    payload: {
                      message: `Ocurrío un error, intentando actualizar el estado y flujo de la carta. Intentelo nuevamente`
                    }
                  });
                }
              }
            } else if (action === "1") {
              const { updateLetter, createState } = await updateStatesFlowLetter(id, action, desicion, comments, decoded, requestType);
              if (updateLetter && createState) {
                const idPosition = position.split("-")[0];
                const { RUsername } = await WebService.getInfoByPosition("PRD", idPosition);
                const content2 = renderEmailCreateTargetLetter(requestNumber, requestType, createdBy, collaborator, position, startLetter, endLetter);
                const emailSended = await SendMail.sendMailTargetLetterHC(content2, 'Nueva carta de objetivos pendiente de revisar', `${RUsername}@GBM.NET`, '', []);
                return res.status(200).send({
                  status: 200,
                  success: true,
                  payload: {
                    id,
                    message: `La carta fue aprobada exitosamente, ${emailSended ? 'se notifico' : 'no se logro notificar'} al colaborador propietario de la carta`
                  }
                });
              } else {
                return res.status(404).send({
                  status: 404,
                  success: false,
                  payload: {
                    message: `Ocurrío un error, intentando actualizar el estado y flujo de la carta. Intentelo nuevamente`
                  }
                });
              }
            }
          } else {
            res.status(403).send({
              status: 403,
              success: false,
              payload: {
                message: `Hemos detectado inconsistencias en su petición.`
              }
            });
          }

          /*
           * await TargetLetterDB.updateTargetLetter(id, action, desicion);
           * await TargetLetterDB.createStateTargetLetter(
           *   id,
           *   `${action === "1" ? 'Aprobación' : 'Rechazo'} de la carta de objetivo por ${desicion === "HC" ? "HC" : "Colaborador"}`,
           *   action,
           *   desicion,
           *   comments,
           *   decoded,
           * );
           */
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

  async deleteTargetLetter(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const targetLetter = await TargetLetterDB.findTargetLetterById(id);
        if (!targetLetter.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `La carta que intentas desactivar de las notificaciones no existe.`
            }
          });
        } else {
          await TargetLetterDB.deactivateTargetLetter(id);
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              id,
              message: `La notificación de la carta fue eliminada exitosamente.`
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
    } catch (error) {
      console.log(error);
      res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: error.toString()
        }
      });
    }
  }

  async applyMeasureTargeLetter(req, res) {
    try {
      const { decoded } = req;
      const { ids } = req.body;
      if (ids) {
        const errors = [];
        const idsApplied = [];
        for (const id of ids) {
          const targetLetter = await TargetLetterDB.findTargetLetterById(id);
          const [{ requestNumber, requestType }] = targetLetter;
          console.log(`Tipo de solicitud: ${requestType}`)
          if (requestType !== "02" && requestType !== "04") {
            const response = await WebService.updateTargetLetterState(CONFIG.APP, "A", requestNumber);
            console.log(response);
            const { E_MSG_RETURN: { TYPE, MESSAGE } } = response;
            if (TYPE === "E") {
              errors.push({
                id,
                requestNumber,
                error: MESSAGE
              });
            } else {
              await TargetLetterDB.createStateTargetLetter(id, 'Aprobación', 3, 'Payrrol', 'Medida aplicada a la carta', decoded);
              idsApplied.push(id);
            }
          } else {
            await TargetLetterDB.createStateTargetLetter(id, 'Aprobación', 3, 'Payrrol', 'Medida aplicada a la carta', decoded);
            idsApplied.push(id);
          }
        }
        if (!idsApplied.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Ocurrío un error intentando actualizar el estado de la carta, intentelo nuevamente.`,
              errors
            }
          });
        } else {
          const letterApply = await TargetLetterDB.applyMeasureTargeLetter(idsApplied);
          const { changedRows } = letterApply;
          res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `${changedRows !== idsApplied.length ? 'No se logro aplicar medida a todas las cartas de objetivos' : 'Cartas de objetivos fueron actualizadas exitosamente'}`,
              errors,
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

  async rejectTargeLetterById(req, res) {
    try {
      const { decoded } = req;
      const { id } = req.params;
      const { comments, requestNumber } = req.body;
      if (id && decoded && comments && requestNumber) {
        const targetLetter = await TargetLetterDB.findTargetLetterById(id);
        if (!targetLetter.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `La carta que intentas continuar en el flujo no existe.`
            }
          });
        } else {
          const [{ collaborator, organizationalUnit }] = targetLetter;
          const response = await WebService.updateTargetLetterState(CONFIG.APP, "R", requestNumber);
          // console.log(response);
          const { E_MSG_RETURN: { TYPE, MESSAGE } } = response;
          if (TYPE === "E") {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: `Ocurrío un error, intentando actualizar el estado de la carta, mensaje de SAP: ${MESSAGE}.`
              }
            });
          } else {
            const letterRejected = await TargetLetterDB.rejectTargeLetterById(id);
            const { changedRows } = letterRejected;
            if (changedRows !== 1) {
              res.status(404).send({
                status: 404,
                success: false,
                payload: {
                  message: 'No se logro rechazar la carta de objetivos',
                }
              });
            } else {
              const desicion = 'Rechazo de la carta de objetivos por el Payrrol';
              await TargetLetterDB.createStateTargetLetter(id, desicion, 2, 'Payrrol', comments, decoded);
              const [letter] = await TargetLetterDB.findTargetLetterById(id);
              const { createdBy, organizationalUnit, persSubArea, position } = letter;
              const content = renderEmailRejectTargetLetter(requestNumber, comments, 'Payrrol', collaborator, organizationalUnit);
              const humanCapitals = await TargetLetterDB.findHumanCapitalByPersSubArea(persSubArea, organizationalUnit.split("-")[0], 'manager');
              const emails = humanCapitals.map((row) => row.email);
              const idPosition = position.split("-")[0];
              // const { RUsername } = await WebService.getInfoByPosition("PRD", idPosition);
              const emailSended = await SendMail.sendMailTargetLetterHC(content, `La Carta de objetivos número ${requestNumber}, del colaborador ${collaborator} fue rechazada por Human Capital Payrrol`, [
                `${createdBy}@GBM.NET`,
                // `${RUsername}@GBM.NET`
              ], emails, []);
              res.status(200).send({
                status: 200,
                success: true,
                payload: {
                  message: `Cartas de objetivos fueron actualizadas exitosamente, ${emailSended ? 'Se notifico' : 'No se logro notificar'} al colaborador y gerentes respectivos`,
                  letterRejected: letter,
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
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }
}