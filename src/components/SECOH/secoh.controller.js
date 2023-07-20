/* eslint-disable max-lines */
/* eslint-disable no-empty */
/* eslint-disable max-depth */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
/* eslint-disable no-await-in-loop */
/* eslint-disable complexity */
// nodejs library to format dates
import fs from 'fs';
import moment from "moment";
import "moment/locale/es";
import path from 'path';
import config from "../../config/config";
import WebService from "../../helpers/webService";
import { renderEmailRequestComptrollerOfServices, renderEmailRequestContractOnHold } from "../../helpers/renderContent";
import SendMail from '../../helpers/sendEmail';
import POSTGRESQL from './../../db/SECOH/secohDB';
import fetch from 'node-fetch';

const notifyComptrollerOfServices = async (contracID, idRequest, user, emails, values) => {
  const subject = `Solicitud ajuste de fecha contrato On hold ${contracID}`;
  const content = `Se solicita el cambio de fecha Target Start Date, para el contrato <strong>${contracID}</strong>, en estado On Hold,  solicitud emitida por <strong>${user}</strong>. Agradecemos su colaboración realizando la acción respectiva`;
  const html = renderEmailRequestComptrollerOfServices(subject, content, values, idRequest);
  const emailSended = await SendMail.sendMailMaintenance(
    html,
    subject,
    values.attachments, // attachments
    emails, //'fvillalobos@gbm.net',
    '' // cc
  );
  return emailSended;
};

const notifyUserRequestTargetStartDate = async (contracID, user, status) => {
  const subject = `Solicitud ajuste de fecha contrato On hold ${contracID}`;
  const content = `Se ha ${status === 1 ? 'aprobado' : 'rechazado'} la solicitud realizada para el cambio de la fecha Target Start Date, para el contrato <strong>${contracID}</strong>, en estado On Hold. ${status === 1 ? 'Agradecemos su colaboración ingresando a Smart & Simple para ver los detalles del contrato' : 'Agradecemos su colaboración, dirigiendose a la contraloría de servicios para más detalles'}`;
  const html = renderEmailRequestContractOnHold(subject, content);
  const emailSended = await SendMail.sendMailMaintenance(
    html,
    subject,
    [], // attachments
    `${user.toLowerCase()
    }@gbm.net`,
    '' // cc
  );
  return emailSended;
};

const filterTeams = (teams) => {
  const arrayAllTeams = teams.filter((e) => e.includes("SECOH USER"));
  const arrayAllTeamsAdmin = teams.filter((e) => e.includes("SECOH MANAGER ADMIN"));
  if (arrayAllTeamsAdmin.some((row) => row === 'SECOH MANAGER ADMIN')) {
    return [
      "CR",
      "CO",
      "DO",
      "DR",
      "GT",
      "HN",
      "NI",
      "PA",
      "SV"
    ];
  } else {
    const arrayCountryRols = arrayAllTeams.map((e) => e.split(" ")[2]);
    if (arrayCountryRols.some((e) => e === "REG")) {
      return [
        "CR",
        "CO",
        "DO",
        "DR",
        "GT",
        "HN",
        "NI",
        "PA",
        "SV"
      ];
    } else {
      return arrayCountryRols;
    }
  }
};

export default class SecohController {

  async findContractsOnHold(req, res) {
    try {
      const contracts = await POSTGRESQL.findContractsOnHold();
      if (!contracts.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: `Al día de hoy, no existen contratos en estado de On Hold`
          }
        });
      } else {
        for (const element of contracts) {
          const { id } = element;
          element.items = await POSTGRESQL.findAllItemsContractsOnHoldByID(id);
          const [activity] = await POSTGRESQL.findLastActivityLogByContractOnHold(id);
          element.activityLog = activity.commentary;
          const months = parseInt(moment(element.endDate).diff(moment(element.startDate), 'months', true), 10);
          element.months = months;
          element.monthlyValue = element.netValue / months;
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: `Se cargaron los contratos en estado de On Hold exitosamente`,
            contracts
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findAllDataMasterByStatus(req, res) {
    try {
      const { status } = req.params;
      if (status) {
        const dataMaster = await POSTGRESQL.findAllDataMasterByStatus(status);
        if (!dataMaster.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Al día de hoy, no existen variables maestras para el estado seleccionado`
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `Se cargaron las variables maestras exitosamente`,
              dataMaster
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findAllContractsOnHold(req, res) {
    try {
      const { type } = req.params;
      const teams = filterTeams(req.teams);
      let contracts = [];
      if (type === 'false') {
        contracts = await POSTGRESQL.findAllContractsOnHold(teams);
      } else {
        contracts = await POSTGRESQL.findAllContractsOnHoldInProgress(teams);
      }
      if (!contracts.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: `Al día de hoy, no existen contratos en estado de On Hold`
          }
        });
      } else {
        for (const element of contracts) {
          const { id } = element;
          element.items = await POSTGRESQL.findAllItemsContractsOnHoldByID(id);
          element.services = await POSTGRESQL.findAllServicesContractsOnHoldByID(id);
          const [activity] = await POSTGRESQL.findLastActivityLogByContractOnHold(id);
          element.activityLog = activity ? activity.commentary : 'N/A';
          const months = parseInt(moment(element.endDate).diff(moment(element.startDate), 'months', true), 10);
          element.months = months;
          element.monthlyValue = element.netValue / months;
        }
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: `Se cargaron los contratos en estado de On Hold exitosamente`,
            contracts
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findContractOnHoldByID(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const contractDetail = await POSTGRESQL.findContractOnHoldByContractID(id);
        if (!contractDetail.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Al día de hoy, no existe un contrato en estado de On Hold con el número ${id} `
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `Se cargo exitosamente la información de contrato en estado de On Hold`,
              contractDetail
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findActivityLogsByContractOnHold(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const activityLogs = await POSTGRESQL.findActivityLogsByContractOnHold(id);
        if (!activityLogs.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Al día de hoy, no existe flujo de actividades para el contrato On Hold`
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `Se cargo exitosamente el flujo de actividades de contrato On Hold`,
              activityLogs
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findAllStatusAvailable(req, res) {
    try {
      const status = await POSTGRESQL.findAllStatusContractsOnHold();
      const statusManagement = await POSTGRESQL.findAllStatusContractsOnHoldManagement();
      if (!status.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: `Al día de hoy, no existen estados habilidatos para contratos en estado de On Hold`
          }
        });
      } else {
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: `Se cargaron exitosamente, los estados disponibles para los contratos en estado de On Hold`,
            status,
            statusManagement
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findActivityLogsByContractID(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const activityLogs = await POSTGRESQL.findActivityLogsByContractOnHold(id);
        if (!activityLogs.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Al día de hoy, no existe flujo de actividades para el contrato seleccionado`
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: `Se cargao exitosamente, el flujo de actividades para el contrato seleccionado`,
              activityLogs
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findUsersNotificationMatrix(req, res) {
    try {
      const users = await POSTGRESQL.findUsersNotificationsMatrix();
      const services = await POSTGRESQL.findAllServicesContractsOnHold();
      const countries = await POSTGRESQL.findAllCountriesContractsOnHold();
      for (const element of users) {
        element.services = await POSTGRESQL.findUserMatrixServicesByID(element.id);
        element.countries = await POSTGRESQL.findUserMatrixCountriesByID(element.id);
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: `Se ha cargado exitosamente, la información requerida`,
          users,
          services,
          countries
        }
      });
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findUsersEscalationMatrix(req, res) {
    try {
      const users = await POSTGRESQL.findUsersEscalationsMatrix();
      const services = await POSTGRESQL.findAllServicesContractsOnHold();
      const countries = await POSTGRESQL.findAllCountriesContractsOnHold();
      for (const element of users) {
        element.services = await POSTGRESQL.findUserEscalationMatrixServicesByID(element.id);
        element.countries = await POSTGRESQL.findUserEscalationMatrixCountriesByID(element.id);
      }
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: `Se ha cargado exitosamente, la información requerida`,
          users,
          services,
          countries
        }
      });
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findAllTargetStartDateRequestByApply(req, res) {
    try {
      const requests = await POSTGRESQL.findTargetStartDateRequestByApply();
      if (!requests.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: `Al día de hoy, no existen solicitudes de Target Start Date por aplicar`
          }
        });
      } else {
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: `Se han cargado exitosamente, las solicitudes para actualizar el target start date`,
            requests,
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findDashboardContractsOnHoldByType(req, res) {
    try {
      const { type } = req.params;
      const { filters } = req.body;
      const teams = filterTeams(req.teams);
      if (type && filters) {
        const data = await POSTGRESQL.findDashboardDataContractsOnHoldByType(type, filters, teams);
        const dataDays = await POSTGRESQL.findDashboardDataDaysContractsOnHoldByType(type, filters, teams);
        const dataTrend = await POSTGRESQL.findDashboardDataTrendContractsOnHold(filters, teams);
        const getFilters = {
          countries: await POSTGRESQL.findAllCountriesAvailable(teams),
          services: await POSTGRESQL.findAllServicesAvailable(),
          status: await POSTGRESQL.findAllStatusAvailable(),
        };
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: `Se ha cargado exitosamente la información de contratos`,
            data,
            dataDays,
            dataTrend,
            filters: getFilters
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findContractGraphDetail(req, res) {
    try {
      const { filters } = req.body;
      const teams = filterTeams(req.teams);
      const data = await POSTGRESQL.findContractsGraphInfo(filters, teams);
      return res.status(200).send({
        status: 200,
        success: true,
        payload: {
          message: `Se ha cargado exitosamente la información de contratos`,
          data,
        }
      });
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async findContractGraphDetailByCountry(req, res) {
    try {
      const { country } = req.params;
      const { filters } = req.body;
      if (country && filters) {
        const data = await POSTGRESQL.findContractsGraphInfoByCountry(country, filters);
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: `Se ha cargado exitosamente la información del país`,
            data,
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async createContractOnHold(req, res) {
    try {
      const {
        ID_CONTRACT,
        DESC_CONTRACT,
        CTY_CONTRACT,
        ID_CUSTOMER,
        DESC_CUSTOMER,
        START_DATE,
        ITEMS_TB,
        POSTING_DATE,
        END_DATE,
        ONHOLD_DATE,
        ONHOLD_USER,
        CURRENT_STATUS,
        SERVICE,
        SALES_ORG,
        SERVICE_ORG,
        EMPLOYEE,
        EMPLOYEE_ID,
      } = req.body;
      if (ID_CONTRACT && DESC_CONTRACT && CTY_CONTRACT && ID_CUSTOMER && DESC_CUSTOMER && START_DATE && ITEMS_TB && POSTING_DATE && END_DATE && ONHOLD_DATE && ONHOLD_USER && CURRENT_STATUS && SERVICE && SALES_ORG && SERVICE_ORG && EMPLOYEE && EMPLOYEE_ID) {
        const contractByID = await POSTGRESQL.findContractOnHoldByContractID(ID_CONTRACT);
        if (contractByID.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `El contrato ${ID_CONTRACT} que intentas crear ya existe en la base de datos`
            }
          });
        } else {
          const contractCreated = await POSTGRESQL.createContractOnHold(req.body);
          if (!contractCreated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrío un error interno intentando crear el contrato, por favor intentelo nuevamente"
              }
            });
          } else {
            const [{ id_Contract }] = contractCreated;
            for (const element of ITEMS_TB) {
              await POSTGRESQL.createItemsByContractOnHoldID(element, id_Contract);
            }
            let materilGroups = ITEMS_TB.map(e => e.SERVICE_MG).
              // store the keys of the unique objects
              map((e, i, final) => final.indexOf(e) === i && i).
              // eliminate the dead keys & store unique objects
              filter(e => ITEMS_TB[e]).
              map(e => ITEMS_TB[e]);
            materilGroups = materilGroups.map((row) => row.SERVICE_MG);
            const dataMasterID = await POSTGRESQL.findDataMasterByMaterialGroups(materilGroups);
            for (const element of dataMasterID) {
              await POSTGRESQL.createDataMasterByContractOnHoldID(element, id_Contract);
            }
            await POSTGRESQL.createActivityLogByContractOnHoldID('Sincronización del Contrato en estado On Hold', 'BOT', id_Contract, 1);
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "Se ha creado exitosamente el contrato on hold"
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

  async createActivityLogByContractOnHoldID(req, res) {
    try {
      const { decoded } = req;
      const { id } = req.params;
      const { idStatus, commentary } = req.body;
      if (id && idStatus && commentary && decoded) {
        const contract = await POSTGRESQL.findContractOnHoldByID(id);
        if (!contract.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El contrato al que intentas crear la actividad no es un contrato válido"
            }
          });
        } else {
          const activity = await POSTGRESQL.createActivityLogByContractOnHoldID(commentary, decoded, id, idStatus);
          if (!activity.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrío un error intentando crear la actividad, por favor intentelo nuevamente"
              }
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "Se ha creado exitosamente la actividad al contrato on hold",
                activityLog: activity
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async createUserNotification(req, res) {
    try {
      const { idUser, fullname, email, service, country } = req.body;
      if (idUser && fullname && email && service && country) {
        const user = await POSTGRESQL.createUserNotification(req.body);
        if (!user.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El contrato al que intentas crear la actividad no es un contrato válido"
            }
          });
        } else {
          const [{ id_NotificationMatrix }] = user;
          for (const element of service) {
            await POSTGRESQL.createUserMatrixService(id_NotificationMatrix, element);
          }
          for (const element of country) {
            await POSTGRESQL.createUserMatrixCountry(id_NotificationMatrix, element);
          }
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Se ha creado exitosamente la actividad al contrato on hold",
              user,
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async createUserEscalation(req, res) {
    try {
      const { idUser, fullname, email, type, service, country } = req.body;
      if (idUser && fullname && email && type && service && country) {
        const user = await POSTGRESQL.createUserEscalation(req.body);
        if (!user.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El contrato al que intentas crear la actividad no es un contrato válido"
            }
          });
        } else {
          const [{ id_EscalationMatrix }] = user;
          for (const element of service) {
            await POSTGRESQL.createUserEscalationMatrixService(id_EscalationMatrix, element);
          }
          for (const element of country) {
            await POSTGRESQL.createUserEscalationMatrixCountry(id_EscalationMatrix, element);
          }
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Se ha creado exitosamente la actividad al contrato on hold",
              user,
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async createStatusContractOnHold(req, res) {
    try {
      const { decoded } = req;
      const { name } = req.body;
      if (name) {
        const status = await POSTGRESQL.createStatusContractOnHold(name, decoded);
        if (!status.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "No se logro crear el estado en el sistema"
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Se ha creado exitosamente el estado en el sistema",
              status,
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async createDataMaster(req, res) {
    try {
      const { data } = req.body;
      if (data.length) {
        let dataMaster = [];
        for (const element of data) {
          dataMaster = [...await POSTGRESQL.createDataMaster(element)];
        }
        if (!dataMaster.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El nuevo grupo de servicio no fue creado"
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Se ha creado exitosamente el nuevo grupo de servicio",
              dataMaster,
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async updateContractOnHoldByID(req, res) {
    try {
      const { id } = req.params;
      const {
        DESC_CONTRACT,
        CTY_CONTRACT,
        ID_CUSTOMER,
        DESC_CUSTOMER,
        START_DATE,
        ITEMS_TB,
        POSTING_DATE,
        END_DATE,
        ONHOLD_DATE,
        ONHOLD_USER,
        CURRENT_STATUS,
        SERVICE,
        SALES_ORG,
        SERVICE_ORG,
        EMPLOYEE,
        EMPLOYEE_ID
      } = req.body;
      if (id && DESC_CONTRACT && CTY_CONTRACT && ID_CUSTOMER && DESC_CUSTOMER && START_DATE && ITEMS_TB && POSTING_DATE && END_DATE && ONHOLD_DATE && ONHOLD_USER && CURRENT_STATUS && SERVICE && SALES_ORG && SERVICE_ORG && EMPLOYEE && EMPLOYEE_ID) {
        const contractDetail = await POSTGRESQL.findContractOnHoldByContractID(id);
        if (!contractDetail.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: `Al día de hoy, no existe un contrato en estado de On Hold con el número ${id} `
            }
          });
        } else {
          const [{ id_Contract }] = contractDetail;
          const contractUpdated = await POSTGRESQL.updateDetailContractOnHoldByID(id_Contract, req.body);
          await POSTGRESQL.deativatedItemsContractOnHold(id_Contract);
          for (const element of ITEMS_TB) {
            await POSTGRESQL.createItemsByContractOnHoldID(element, id_Contract);
          }
          console.log('Contract: ', contractUpdated);
          if (!contractUpdated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: `Ocurrío un error intentando actualizar la información del contrato, por favor intentelo nuevamente`
              }
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "Se ha actualizado exitosamente la información del contrato on hold",
                contract: contractUpdated
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async updateStatusContractOnHoldByID(req, res) {
    try {
      const { decoded } = req;
      const { id, idState } = req.params;
      const { commentary } = req.body;
      if (id && idState && commentary) {
        const contract = await POSTGRESQL.findContractOnHoldByID(id);
        if (!contract.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El contrato al que intentas actualizar el estado no es un contrato válido"
            }
          });
        } else {
          const contractUpdated = await POSTGRESQL.updateStatusContractOnHoldByID(id, idState);
          if (!contractUpdated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrío un error intentando actualizar el estado del requerimiento, por favor intentelo nuevamente"
              }
            });
          } else {
            await POSTGRESQL.createActivityLogByContractOnHoldID(commentary, decoded, id, idState);
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "Se ha actualizado exitosamente el estado del contrato on hold",
                contract: contractUpdated
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async updateTargetStartDateContractOnHoldByID(req, res) {
    try {
      const { decoded } = req;
      const { id } = req.params;
      const { targetStartDate, reason, status, attachments, referencesRemoved } = req.body;
      if (id && targetStartDate && reason && status && attachments) {
        const contract = await POSTGRESQL.findContractOnHoldByID(id);
        if (!contract.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El contrato al que intentas actualizar el objetivo de fecha de inicio no es un contrato válido"
            }
          });
        } else {
          const [contractInfo] = contract;
          const contractUpdated = await POSTGRESQL.createTargetStartDateRequestByContractOnHold(id, {
            oldTargetStartDate: contractInfo.targetStartDate ? moment(contractInfo.targetStartDate).format('YYYY-MM-DD') : targetStartDate,
            newTargetStartDate: targetStartDate,
            reason,
            createdBy: decoded
          });
          if (!contractUpdated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrío un error intentando actualizar el estado del requerimiento, por favor intentelo nuevamente"
              }
            });
          } else {
            const [targetInfo] = contractUpdated;
            for (const element of referencesRemoved) {
              await POSTGRESQL.deactivatedReferenceTargetStartDate(element);
            }
            for (const element of attachments) {
              const { idReference } = element;
              await POSTGRESQL.updatedReferenceTargetStartDateID(idReference, targetInfo.id_TargetChangeRequest);
            }
            await POSTGRESQL.createActivityLogByContractOnHoldID('Solicitud de cambio del Objetivo de Fecha de Inicio', decoded, id, status);
            const emails = await POSTGRESQL.findUsersEmailsChangeTargetRequest();
            console.log(emails);
            const emailss = emails.length ? emails.map((row) => row.email) : [];
            const notify = await notifyComptrollerOfServices(contractInfo.contractNumber, targetInfo.id_TargetChangeRequest, decoded, emailss, {
              oldTargetStartDate: moment(contractInfo.targetStartDate).format('YYYY-MM-DD'),
              newTargetStartDate: targetStartDate,
              reason,
              contracID: contractInfo.contractNumber,
              attachments: attachments.map((row) => ({
                filename: row.name,
                path: `${row.path}/${row.name}`,
                contentType: 'application/pdf'
              }))
            });
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: `Se ha actualizado exitosamente el estado del contrato on hold, ${notify === true ? 'se notifico' : 'pero no se logro notificar'} a la contraloria de servicios`,
                contract: contractUpdated
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async updateRequestTargetStartDateContractOnHoldByID(req, res) {
    try {
      const { contractID, idRequest, status } = req;
      if (contractID && idRequest && status) {
        const contract = await POSTGRESQL.findContractTargetOnHoldByContractID(idRequest);
        if (!contract.length) {
          return res.status(404).sendFile(path.join(`${__dirname}/../../pages/SECOH/notFound.html`));
        } else {
          const [contractInfo] = contract;
          const updateTargetStartDate = await POSTGRESQL.updateStatusTargetStartDateContractOnHoldByID(contractInfo.id_Contract, status);
          if (!updateTargetStartDate.length) {
            return res.status(404).sendFile(path.join(`${__dirname}/../../pages/SECOH/notFound.html`));
          } else {
            const input = {
              ID: `${contractInfo.contractNumber}`,
              DATE: `${moment(contractInfo.newTargetDate).format("YYYYMMDD")}`,
              TYPE_REL: `CONTSIGNON`
            };
            console.log(input);
            fetch('https://databot.gbm.net:8085/sap/consume', {
              method: 'post',
              body: JSON.stringify({
                system: 500,
                props: {
                  program: "ZPUT_UPDATE_DATES",
                  parameters: input
                }
              }),
              headers: { 'Content-Type': 'application/json' },
            }).
              then((resp) => resp.json()).
              then(async (response) => {
                console.log(response);
                if (response.status !== 200) {
                  return res.status(404).sendFile(path.join(`${__dirname}/../../pages/SECOH/notFound.html`));
                } else {
                  await POSTGRESQL.updateTargetStartDateContractOnHoldByID(contractInfo.id_Contract, moment(contractInfo.newTargetDate).format("YYYY-MM-DD"));
                  await POSTGRESQL.createActivityLogByContractOnHoldID(`${status === 1 ? 'Aprobación' : 'Rechazo'} de la solicitud del cambio del objetivo de fecha inicio`, 'Contraloria Servicios', contractInfo.id_Contract, status === 1 ? 5 : 6);
                  await notifyUserRequestTargetStartDate(contractInfo.contractNumber, contractInfo.createdBy, status);
                  return res.status(200).sendFile(path.join(`${__dirname} /../../pages/SECOH/answered.html`));
                }
              });

          }
        }
      } else {
        return res.status(404).sendFile(path.join(`${__dirname} /../../pages/SECOH/notFound.html`));
      }
    } catch (err) {
      console.log(err.stack);
      return res.status(500).sendFile(path.join(`${__dirname} /../../pages/SECOH/internalError.html`));
    }
  }

  async updateUserEscalationNotificationByID(req, res) {
    try {
      const { id } = req.params;
      const { idUser, fullname, email, service, country } = req.body;
      if (idUser && fullname && email && service && country) {
        const user = await POSTGRESQL.findUsersNotificationsMatrixByID(id);
        if (!user.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El usuario al que intentas actualizar no es un usuario válido"
            }
          });
        } else {
          const userUpdated = await POSTGRESQL.updateUserEscalationNotification(id, req.body);
          if (!userUpdated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrío un error intentando actualizar el usuario, por favor intentelo nuevamente"
              }
            });
          } else {
            console.log(userUpdated);
            const [{ id_NotificationMatrix }] = userUpdated;
            await POSTGRESQL.deactivateServicesMatrixByID(id_NotificationMatrix);
            await POSTGRESQL.deactivateCountriesMatrixByID(id_NotificationMatrix);
            for (const element of service) {
              await POSTGRESQL.createUserMatrixService(id_NotificationMatrix, element);
            }
            for (const element of country) {
              await POSTGRESQL.createUserMatrixCountry(id_NotificationMatrix, element);
            }
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "Se ha actualizado exitosamente el estado del contrato on hold",
                user: userUpdated
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async updateUserEscalationByID(req, res) {
    try {
      const { id } = req.params;
      const { idUser, fullname, email, type, service, country } = req.body;
      if (idUser && fullname && email && type && service && country) {
        const user = await POSTGRESQL.findUsersEscalationsMatrixByID(id);
        if (!user.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El usuario al que intentas actualizar no es un usuario válido"
            }
          });
        } else {
          const userUpdated = await POSTGRESQL.updateUserEscalationByID(id, req.body);
          if (!userUpdated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrío un error intentando actualizar el usuario, por favor intentelo nuevamente"
              }
            });
          } else {
            console.log(userUpdated);
            const [{ id_EscalationMatrix }] = userUpdated;
            await POSTGRESQL.deactivateServicesEscalationsMatrixByID(id_EscalationMatrix);
            await POSTGRESQL.deactivateCountriesEscalationsMatrixByID(id_EscalationMatrix);
            for (const element of service) {
              await POSTGRESQL.createUserEscalationMatrixService(id_EscalationMatrix, element);
            }
            for (const element of country) {
              await POSTGRESQL.createUserEscalationMatrixCountry(id_EscalationMatrix, element);
            }
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "Se ha actualizado exitosamente el estado del contrato on hold",
                user: userUpdated
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async updateStatusByID(req, res) {
    try {
      const { decoded } = req;
      const { id } = req.params;
      const { name } = req.body;
      if (id && name) {
        const status = await POSTGRESQL.findStatusContractsOnHoldByID(id);
        if (!status.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El estado que intentas actualizar no es un estado válido"
            }
          });
        } else {
          const statusUpdated = await POSTGRESQL.updateStatusByID(id, name, decoded);
          if (!statusUpdated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrío un error intentando actualizar el usuario, por favor intentelo nuevamente"
              }
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "Se ha actualizado exitosamente el estado del contrato on hold",
                status: statusUpdated
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async updateTargetStartDateRequestApplied(req, res) {
    try {
      const { contractsIDs } = req.body;
      if (contractsIDs && contractsIDs.length) {
        const requestsApplied = await POSTGRESQL.updateTargetStartDateRequestApply(contractsIDs);
        console.log(requestsApplied);
        if (!requestsApplied.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "Ocurrío un error intentado aplicar las solicitudes de target start date"
            }
          });
        } else {
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "Se ha actualizado exitosamente el estado del contrato on hold",
              requestsApplied
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async deactivateStatusByID(req, res) {
    try {
      const { decoded } = req;
      const { id } = req.params;
      if (id) {
        const status = await POSTGRESQL.findStatusContractsOnHoldByID(id);
        if (!status.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El estado que intentas eliminar no es un estado válido"
            }
          });
        } else {
          const statusUpdated = await POSTGRESQL.deactivatedStatusByID(id, decoded);
          if (!statusUpdated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrío un error intentando eliminar el estado, por favor intentelo nuevamente"
              }
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "Se ha eliminado exitosamente el estado del contrato on hold",
                status: statusUpdated
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async deactivateUserEscalationNotificationByID(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const user = await POSTGRESQL.findUsersNotificationsMatrixByID(id);
        if (!user.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El usuario al que intentas eliminar no es un usuario válido"
            }
          });
        } else {
          const userUpdated = await POSTGRESQL.deactivateUserEscalationNotification(id);
          if (!userUpdated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrío un error intentando actualizar el usuario, por favor intentelo nuevamente"
              }
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "Se ha actualizado exitosamente el estado del contrato on hold",
                user: userUpdated
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async deactivateUserEscalationByID(req, res) {
    try {
      const { id } = req.params;
      if (id) {
        const user = await POSTGRESQL.findUsersEscalationsMatrixByID(id);
        if (!user.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El usuario al que intentas eliminar no es un usuario válido"
            }
          });
        } else {
          const userUpdated = await POSTGRESQL.deactivateUserEscalationByID(id);
          if (!userUpdated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrío un error intentando actualizar el usuario, por favor intentelo nuevamente"
              }
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "Se ha actualizado exitosamente el estado del contrato on hold",
                user: userUpdated
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async updateDataMasterById(req, res) {
    try {
      const { id } = req.params;
      const { values } = req.body;
      if (id) {
        const dataMaster = await POSTGRESQL.findDataMasterByID(id);
        if (!dataMaster.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El grupo de servicio que intentas actualizar no es válido"
            }
          });
        } else {
          const dataMasterUpdated = await POSTGRESQL.updateDataMasterById(id, values);
          if (!dataMasterUpdated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrío un error intentando eliminar el estado, por favor intentelo nuevamente"
              }
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "Se ha actualizado exitosamente el grupo de servicio",
                dataMaster: dataMasterUpdated
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async updateStatusDataMasterById(req, res) {
    try {
      const { id, status } = req.params;
      if (id) {
        const dataMaster = await POSTGRESQL.findDataMasterByID(id);
        if (!dataMaster.length) {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El grupo de servicio que intentas actualizar no es válido"
            }
          });
        } else {
          const dataMasterUpdated = await POSTGRESQL.updateStatusDataMasterById(id, status);
          if (!dataMasterUpdated.length) {
            return res.status(404).send({
              status: 404,
              success: false,
              payload: {
                message: "Ocurrío un error intentando eliminar el estado, por favor intentelo nuevamente"
              }
            });
          } else {
            return res.status(200).send({
              status: 200,
              success: true,
              payload: {
                message: "Se ha actualizado exitosamente el grupo de servicio",
                dataMaster: dataMasterUpdated
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
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Managment`
        }
      });
    }
  }

  async uploadReferenceRequestTargetStartDate(req, res) {
    try {
      const { decoded } = req;
      const { reference: { name, data, encoding, mimetype } } = req.files;
      const nameNormalize = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const file = Buffer.from(data, encoding);
      let path = `src/assets/files/OnHold`;
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }
      path = `${path}/References`;
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
          return res.status(409).send({
            status: 409,
            success: false,
            payload: {
              message: `No se logro almacenar en el servidor de datos el archivo`
            }
          });
        }
        console.log(`Archivo ${nameNormalize} guardado con exito`);
      });
      const reference = await POSTGRESQL.createReferenceRequestTargetStartDate({
        nameNormalize,
        encoding,
        mimetype,
        path: `${path}/${nameNormalize}`,
        createdBy: decoded
      });
      if (!reference.length) {
        return res.status(404).send({
          status: 404,
          success: false,
          payload: {
            message: `No se logro guardar en la base de datos el archivo`
          }
        });
      } else {
        const [{ id_Reference }] = reference;
        return res.status(200).send({
          status: 200,
          success: true,
          payload: {
            message: 'Archivo almacenado exitosamente',
            path,
            name: nameNormalize,
            idReference: id_Reference
          }
        });
      }
    } catch (err) {
      console.log(err.stack);
      return res.status(500).send({
        status: 500,
        success: false,
        payload: {
          message: `Ocurrío un error interno, por favor intentelo nuevamente, sí el error persiste comuníquese con App Management`
        }
      });
    }
  }

  async validateGbmCollaborator(req, res) {
    try {
      const { username } = req.body;
      if (username) {
        const response = await WebService.getUser(config.APP, username.toUpperCase());
        const { ESTADO } = response;
        if (ESTADO === "I") {
          return res.status(404).send({
            status: 404,
            success: false,
            payload: {
              message: "El usuario ingresado no es válido en la compañía",
            }
          });
        } else {
          response.USERNAME = username;
          return res.status(200).send({
            status: 200,
            success: true,
            payload: {
              message: "El usuario ingresado en válido en la compañía.",
              response
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
}