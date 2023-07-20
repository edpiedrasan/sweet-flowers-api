/* eslint-disable complexity */
/* eslint-disable no-loop-func */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
/* eslint-disable no-sync */
/* eslint-disable max-depth */
/* eslint-disable no-await-in-loop */
import fs from "fs";
import json2xls from "json2xls";
import moment from "moment";
import "moment/locale/es";
import cron from "node-cron";
import config from "../config/config";
import DB2 from "../db/db2";
import DonationsDB from "../db/events/donationDB";
import EventsDB from "../db/events/eventsDB";
import SignDB from "../db/Mis/SignDB";
import CriticalPartsDB from "../db/Sales/CriticalPartsDB";
import EngineerDB from "../db/Sales/EngineersDB";
import PlannersDB from "../db/Sales/PlannersDB";
import InventoriesDB from "../db/Sales/InventoriesDB";
import SupportDB from "../db/Sales/SupportDB";
import {
  renderContectIMateriaReport,
  renderContentDonationReport,
  renderEmailNotifyUserNotificationMatrix,
  renderEmailNotifyUserEscalationMatrix,
  renderEmailEscaltionEngineer,
} from "./renderContent";
import SendMail from "./sendEmail";
import WebService from "./webService";
import POSTGRESQL from "./../db/SECOH/secohDB";

const getTimeZone = (country) => {
  let timezone = 0;
  switch (country) {
    case "PA":
      timezone = -300;
      break;
    case "CR":
      timezone = -360;
      break;
    case "HQ":
      timezone = -360;
      break;
    case "GT":
      timezone = -360;
      break;
    case "NI":
      timezone = -360;
      break;
    case "SV":
      timezone = -360;
      break;
    case "US":
      timezone = -300;
      break;
    case "HN":
      timezone = -360;
      break;
    case "DO":
      timezone = -240;
      break;
    case "BV01":
      timezone = -240;
      break;
    default:
      timezone = -300;
  }
  return timezone;
};

const convertUnicode = (input) =>
  input.replace(/\\u(\w{4,4})/g, (a, b) =>
    String.fromCharCode(parseInt(b, 16))
  );

const renderHumanCapitalGroupCountry = async () => {
  const data = [
    {
      country: "Regional",
      to: ["msalas@gbm.net", "mtcastro@gbm.net", "gvillalobos@gbm.net"],
      monetaryReport: [],
      vacationsReport: [],
    },
    {
      country: "NA",
      to: ["jcorrales@gbm.net"],
      monetaryReport: [],
      vacationsReport: [],
    },
  ];
  const humanCapitals = await EventsDB.getAllHumanCapitalsCountries();
  humanCapitals.forEach((element) => {
    const { country, email } = element;
    const index = data.findIndex((row) => row.country === element.country);
    if (index === -1) {
      // if (element.country !== 'CR' && element.country !== 'HQ') {
      data.push({
        country,
        to: [email],
        monetaryReport: [],
        vacationsReport: [],
      });
      // }
    } else {
      // if (element.country !== 'CR' && element.country !== 'HQ') {
      data[index].to.push(email);
      // }
    }
  });
  return data;
};

const compareJSON = (obj1, obj2) => {
  const ret = {};
  for (const i in obj2) {
    if (!obj1.hasOwnProperty(i) || obj2[i] !== obj1[i]) {
      ret[i] = obj2[i];
    }
  }
  return ret;
};

export const updateSignInformation = cron.schedule("00 23 * * 5", async () => {
  console.log("Actualización de Información de Usuarios - Tarea programada");
  const users = await SignDB.getAllDigitalSignUsers();
  let usersChanged = 0;
  let inactiveUsers = 0;
  for (const element of users) {
    if (element.user) {
      const {
        id,
        user,
        name,
        UserID,
        department,
        manager,
        subDivision,
        country,
        email,
        position,
        startDate,
        endDate,
        token,
        active,
        createdAt,
        updatedAt,
      } = element;
      const userInfo = await WebService.getUser(config.APP, user.toUpperCase());
      const {
        DEPARTAMENTO,
        EMAIL,
        ESTADO,
        INGRESO,
        NOMBRE,
        PAIS,
        SUB_DIVISION,
        POSICION,
        SUPERVISOR,
      } = userInfo;
      if (ESTADO === "I") {
        const inactiveUser = await SignDB.deactivedUserByID(id);
        if (inactiveUser.changedRows === 1) {
          console.log(`El usuario ${user} se desactivo`);
          inactiveUsers += 1;
        } else {
          console.log(`El Usuario ${user} no se desactivo`);
        }
      } else {
        console.log(`El usuario ${user} sigue activo en el sistema`);
        const values = {
          id,
          user: EMAIL.split("@")[0],
          name: NOMBRE,
          UserID,
          department: DEPARTAMENTO,
          manager: SUPERVISOR,
          country: PAIS,
          subDivision: SUB_DIVISION,
          email: EMAIL,
          position: POSICION,
          startDate: INGRESO,
          endDate,
          token,
          active,
          createdAt,
          updatedAt,
        };
        const verify = compareJSON(element, values);
        if (Object.keys(verify).length) {
          console.log(verify);
          if (name !== NOMBRE) {
            values.name = NOMBRE;
          }
          if (department !== DEPARTAMENTO) {
            values.department = DEPARTAMENTO;
          }
          if (manager !== SUPERVISOR) {
            values.manager = SUPERVISOR;
          }
          if (country !== PAIS) {
            values.country = PAIS;
          }
          if (subDivision !== SUB_DIVISION) {
            values.subDivision = SUB_DIVISION;
          }
          if (email !== EMAIL) {
            values.email = EMAIL;
          }
          if (position !== POSICION) {
            values.position = POSICION;
          }
          if (startDate !== INGRESO) {
            values.startDate = INGRESO;
          }
          const updatedUser = await SignDB.updateUserInformationByID(
            id,
            values
          );
          if (updatedUser.changedRows === 0) {
            console.log(`No se actualizo la información del usuario ${user}`);
          } else {
            console.log(`Se actualizo la información del usuario ${user}`);
            usersChanged += 1;
          }
        } else {
          console.log(
            `El usuario ${user} no tiene ningun campo que necesite ser actualizado`
          );
        }
      }
    }
  }
  console.log(`Cantidad de Usuarios: ${users.length}`);
  console.log(`Cantidad de Usuarios Inactivos: ${inactiveUsers}`);
  console.log(`Cantidad de Usuarios Actualizados: ${usersChanged}`);
});

export const generateDonationReport = cron.schedule(
  "00 13 * * 1-5",
  async () => {
    console.log("Generación del reporte de Donaciones - Tarea programada");
    const [eventsActives] = await EventsDB.getEvents();
    if (eventsActives.length) {
      for (const eventActive of eventsActives) {
        const monetaryDonations = [
          ...(await DonationsDB.getAllCountriesMonetaryDonations(
            eventActive.id
          )),
          ...(await DonationsDB.getAllNotCountriesMonetaryDonations(
            eventActive.id
          )),
        ];
        const humanCapitals = await renderHumanCapitalGroupCountry();
        monetaryDonations.forEach((element) => {
          const {
            UserID,
            name,
            country,
            email,
            title,
            event,
            amount,
            monthsQuantity,
            Message,
            currency,
            usdChange,
            unicode_icon,
            createdAt,
          } = element;
          const index = humanCapitals.findIndex(
            (row) => row.country === element.country
          );
          if (index > -1) {
            const timezone = getTimeZone(country);
            humanCapitals[index].monetaryReport.push({
              "ID Colaborador": UserID,
              Nombre: name,
              País: country === "HQ" ? "CR" : country,
              "Correo Electrónico": email,
              // "Supervisor": manager,
              Problematica: title,
              Evento: event,
              "Tipo Donación": "Monetaria",
              Moneda: currency ? currency : "N/A",
              Simbolo: unicode_icon ? convertUnicode(unicode_icon) : "N/A",
              Donacion: amount,
              Meses: monthsQuantity,
              "Tipo de Cambio": usdChange,
              "Donación $": (amount * monthsQuantity) / usdChange,
              Mensaje: Message,
              Fecha: moment(createdAt)
                .utc()
                .utcOffset(parseInt(timezone, 10))
                .locale("es")
                .format("LLL"),
            });
          }
          const indexReg = humanCapitals.findIndex(
            (row) => row.country === "Regional"
          );
          if (indexReg > -1) {
            const timezone = getTimeZone(country);
            humanCapitals[indexReg].monetaryReport.push({
              "ID Colaborador": UserID,
              Nombre: name,
              País: country === "HQ" ? "CR" : country,
              "Correo Electrónico": email,
              // "Supervisor": manager,
              Problematica: title,
              Evento: event,
              "Tipo Donación": "Monetaria",
              Moneda: currency ? currency : "N/A",
              Simbolo: unicode_icon ? convertUnicode(unicode_icon) : "N/A",
              Donacion: amount,
              Meses: monthsQuantity,
              "Tipo de Cambio": usdChange,
              "Donación $": (amount * monthsQuantity) / usdChange,
              Mensaje: Message,
              Fecha: moment(createdAt)
                .utc()
                .utcOffset(parseInt(timezone, 10))
                .locale("es")
                .format("LLL"),
            });
          }
        });
        const vacationsDonations =
          await DonationsDB.getAllCountriesVacationsDonations(eventActive.id);
        vacationsDonations.forEach((element) => {
          const {
            UserID,
            name,
            country,
            email,
            title,
            event,
            amount,
            Message,
            createdAt,
          } = element;
          const index = humanCapitals.findIndex(
            (row) => row.country === element.country
          );
          if (index > -1) {
            const timezone = getTimeZone(country);
            humanCapitals[index].vacationsReport.push({
              "ID Colaborador": UserID,
              Nombre: name,
              País: country === "HQ" ? "CR" : country,
              "Correo Electrónico": email,
              // "Supervisor": manager,
              Problematica: title,
              Evento: event,
              "Tipo Donación": "Vaciones",
              Donacion: amount,
              Mensaje: Message,
              Fecha: moment(createdAt)
                .utc()
                .utcOffset(parseInt(timezone, 10))
                .locale("es")
                .format("LLL"),
            });
          }
          const indexReg = humanCapitals.findIndex(
            (row) => row.country === "Regional"
          );
          if (indexReg > -1) {
            const timezone = getTimeZone(country);
            humanCapitals[indexReg].vacationsReport.push({
              "ID Colaborador": UserID,
              Nombre: name,
              País: country, // country === 'HQ' ? 'CR' : country,
              "Correo Electrónico": email,
              // "Supervisor": manager,
              Problematica: title,
              Evento: event,
              "Tipo Donación": "Vaciones",
              Donacion: amount,
              Mensaje: Message,
              Fecha: moment(createdAt)
                .utc()
                .utcOffset(parseInt(timezone, 10))
                .locale("es")
                .format("LLL"),
            });
          }
        });
        console.log(humanCapitals);
        for (const element of humanCapitals) {
          const { country, to, monetaryReport, vacationsReport } = element;
          const content = renderContentDonationReport(
            eventActive,
            country,
            monetaryReport
          );
          const subject = `Reporte diario de las donaciones de colaboradores en ${country}`;
          if (monetaryReport.length || vacationsReport.length) {
            try {
              const xlsMonetary = json2xls(monetaryReport);
              const xlsVacations = json2xls(vacationsReport);
              const pathCountry = `src/assets/files/Events/Huracanes/${country}`;
              if (!fs.existsSync(pathCountry)) {
                fs.mkdirSync(pathCountry);
              }
              const path = `${pathCountry}/${moment().format(
                "DD-MM-YYYY_H-mm-ss"
              )}`;
              if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
              }
              const attach = [];
              if (monetaryReport.length) {
                fs.writeFileSync(
                  `${path}/Donaciones - Monetarias.xlsx`,
                  xlsMonetary,
                  "binary"
                );
                attach.push({
                  filename: `Donaciones Monetarias al ${moment().format(
                    "LL"
                  )}.xlsx`,
                  path: `${path}/Donaciones - Monetarias.xlsx`,
                });
              }
              if (vacationsReport.length) {
                fs.writeFileSync(
                  `${path}/Donaciones - Vacaciones.xlsx`,
                  xlsVacations,
                  "binary"
                );
                attach.push({
                  filename: `Donaciones de Vacaciones al ${moment().format(
                    "LL"
                  )}.xlsx`,
                  path: `${path}/Donaciones - Vacaciones.xlsx`,
                });
              }
              const email = await SendMail.sendMailEventDonations(
                content,
                subject,
                to,
                "jcorrales@gbm.net",
                attach
              );
              console.log(`Status del email con adjunto enviado ${email}`);
            } catch (error) {
              console.log(`Error: ${error.toString()}`);
            }
          } else {
            const email = await SendMail.sendMailEventDonations(
              content,
              subject,
              to,
              "jcorrales@gbm.net",
              []
            );
            console.log(`Status del email sin adjunto enviado ${email}`);
          }
        }
      }
    }
  }
);

export const generateMaterialIBaseReport = cron.schedule(
  "00 08 1 * *",
  async () => {
    console.log("Reporte de Materiales Base Instalada - Tarea Programada");
    const endDate = moment().format("YYYY-MM-DD H:mm:ss");
    const startDate = moment()
      .subtract(2, "months")
      .format("YYYY-MM-DD H:mm:ss");
    const materialIBase = await DB2.conectionCognosDb2(
      `CALL "DWHPROD"."SP_AM_MATERIAL_IBASE" ('${startDate}', '${endDate}');`
    );
    console.log(`Nuevos Materiales ${materialIBase.length}`);
    const debuggedMaterial = await CriticalPartsDB.getAllFilterModels();
    console.log(`Modelos Depurados ${debuggedMaterial.length}`);
    const criticalParts = await CriticalPartsDB.getAllCriticalParts();
    console.log(`Partes Criticas ${criticalParts.length}`);
    const filtered = materialIBase.filter(
      (row) =>
        !debuggedMaterial.some((element) => element.name == row.MATERIAL_NUMBER)
    );
    console.log(`Materiales filtrados por modelos ${filtered.length}`);
    const newFiltered = filtered.filter(
      (row) =>
        !criticalParts.some(
          (element) => element.modelType == row.MATERIAL_NUMBER
        )
    );
    console.log(`Materiales filtrados por partes ${newFiltered.length}`);
    const content = renderContectIMateriaReport(
      materialIBase.length,
      filtered.length,
      newFiltered.length
    );
    const subject = `Reporte Base Instalada - Nuevas Partes Críticas`;
    const xls = json2xls(newFiltered);
    const xls2 = json2xls(materialIBase);
    const path = `src/assets/files/Material_IBase/${moment().format(
      "DD-MM-YYYY_H-mm-ss"
    )}`;
    if (!fs.existsSync(path)) {
      fs.mkdirSync(path);
    }
    fs.writeFileSync(`${path}/Reporte.xlsx`, xls, "binary");
    fs.writeFileSync(`${path}/Partes.xlsx`, xls2, "binary");
    await SendMail.sendMailEventDonations(
      content,
      subject,
      ["ealas@gbm.net", "lmaguilar@gbm.net", "anmurillo@gbm.net"],
      "fvillalobos@gbm.net",
      [
        {
          filename: `Reporte Base Instalada.xlsx`,
          path: `${path}/Reporte.xlsx`,
        },
        {
          filename: `Partes Nuevas.xlsx`,
          path: `${path}/Partes.xlsx`,
        },
      ]
    );
  }
);

export const notificationUserContractOnHold = cron.schedule(
  "30 * * * * *",
  async () => {
    console.log("Notificaciones Usuarios Contratos On Hold - Tarea Programada");
    const contractsToDay =
      await POSTGRESQL.findContractsOnHoldDaysTargetStartDate(0);
    const contracts15Days =
      await POSTGRESQL.findContractsOnHoldDaysTargetStartDate(14);
    const infoToday = {};
    const info15Days = {};
    for (const element of contractsToDay) {
      infoToday[`${element.service}_${element.country}`] = [];
    }
    for (const element of contracts15Days) {
      info15Days[`${element.service}_${element.country}`] = [];
    }
    for (const element of contractsToDay) {
      infoToday[`${element.service}_${element.country}`] = [
        ...infoToday[`${element.service}_${element.country}`],
        element.contractNumber,
      ];
    }
    for (const element of contracts15Days) {
      info15Days[`${element.service}_${element.country}`] = [
        ...info15Days[`${element.service}_${element.country}`],
        element.contractNumber,
      ];
    }
    let services = Object.keys(infoToday);
    services = [...services, ...Object.keys(info15Days)];
    services = [...new Set(services)];
    for (const element of services) {
      const [service, country] = element.split("_");
      const users = await POSTGRESQL.findUsersNotificationByServiceCountry(
        service,
        country
      );
      const emails = users.map((row) => row.email);
      if (emails.length) {
        if (infoToday[`${service}_${country}`] && emails.length) {
          const contracts =
            await POSTGRESQL.findInfoContractsOnHoldByContractsNumber(
              infoToday[`${service}_${country}`]
            );
          const content = renderEmailNotifyUserNotificationMatrix(
            "Solicitud Apoyo Contrato On Hold",
            "Los siguientes Contratos en estado On Hold se encuentran en su fecha de cumplimiento"
          );
          const xls = json2xls(contracts);
          let path = `src/assets/files/OnHold`;
          if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
          }
          path = `${path}/Notifications`;
          if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
          }
          path = `${path}/${moment().format("YYYY-MM-DD_H-mm-ss")}`;
          if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
          }
          fs.writeFileSync(`${path}/Contratos On Hold.xlsx`, xls, "binary");
          await SendMail.sendMailEventDonations(
            content,
            "Solicitud Apoyo Contrato On Hold",
            emails,
            "",
            [
              {
                filename: `Contratos On Hold.xlsx`,
                path: `${path}/Contratos On Hold.xlsx`,
              },
            ]
          );
        }
        if (info15Days[`${service}_${country}`] && emails.length) {
          const contracts =
            await POSTGRESQL.findInfoContractsOnHoldByContractsNumber(
              info15Days[`${service}_${country}`]
            );
          const content = renderEmailNotifyUserNotificationMatrix(
            "Solicitud Apoyo Contrato On Hold",
            "Los siguientes Contratos en estado On Hold se encuentran a 2 semanas de su fecha de cumplimiento"
          );
          const xls = json2xls(contracts);
          let path = `src/assets/files/OnHold`;
          if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
          }
          path = `${path}/Notifications`;
          if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
          }
          path = `${path}/${moment().format("YYYY-MM-DD_H-mm-ss")}`;
          if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
          }
          fs.writeFileSync(`${path}/Contratos On Hold.xlsx`, xls, "binary");
          await SendMail.sendMailEventDonations(
            content,
            "Solicitud Apoyo Contrato On Hold",
            emails,
            "",
            [
              {
                filename: `Contratos On Hold.xlsx`,
                path: `${path}/Contratos On Hold.xlsx`,
              },
            ]
          );
        }
      }
    }
  }
);

export const escalationUserContractOnHold = cron.schedule(
  "30 * * * * *",
  async () => {
    console.log(
      "Notificación Escalaciones Usuarios Contratos On Hold - Tarea Programada"
    );
    const constractsEscalation1 =
      await POSTGRESQL.findContractsOnHoldMonthsTargetStartDate(
        moment().month() + 1
      );
    const constractsEscalation2 =
      await POSTGRESQL.findContractsOnHoldMonthsTargetStartDate(
        moment().month()
      );
    const constractsEscalation3 =
      await POSTGRESQL.findContractsOnHoldMonthsTargetStartDate(
        moment().month() - 1
      );
    const infoEscalation1 = {};
    const infoEscalation2 = {};
    const infoEscalation3 = {};
    for (const element of constractsEscalation1) {
      infoEscalation1[`${element.service}_${element.country}`] = [];
    }
    for (const element of constractsEscalation2) {
      infoEscalation2[`${element.service}_${element.country}`] = [];
    }
    for (const element of constractsEscalation3) {
      infoEscalation3[`${element.service}_${element.country}`] = [];
    }
    for (const element of constractsEscalation1) {
      infoEscalation1[`${element.service}_${element.country}`] = [
        ...infoEscalation1[`${element.service}_${element.country}`],
        element.contractNumber,
      ];
    }
    for (const element of constractsEscalation2) {
      infoEscalation2[`${element.service}_${element.country}`] = [
        ...infoEscalation2[`${element.service}_${element.country}`],
        element.contractNumber,
      ];
    }
    for (const element of constractsEscalation3) {
      infoEscalation3[`${element.service}_${element.country}`] = [
        ...infoEscalation3[`${element.service}_${element.country}`],
        element.contractNumber,
      ];
    }
    let services = Object.keys(infoEscalation1);
    services = [
      ...services,
      ...Object.keys(infoEscalation2),
      ...Object.keys(infoEscalation3),
    ];
    services = [...new Set(services)];
    for (const element of services) {
      const [service, country] = element.split("_");
      const users1 = await POSTGRESQL.findUsersEscalationByServiceCountry(
        service,
        country,
        1
      );
      const users2 = await POSTGRESQL.findUsersEscalationByServiceCountry(
        service,
        country,
        2
      );
      const users3 = await POSTGRESQL.findUsersEscalationByServiceCountry(
        service,
        country,
        3
      );
      let contracts = [];
      if (infoEscalation1[`${service}_${country}`] && users1.length) {
        contracts = [
          ...contracts,
          ...(await POSTGRESQL.findInfoContractsOnHoldByContractsNumber(
            infoEscalation1[`${service}_${country}`]
          )),
        ];
        const xls = json2xls(contracts);
        let path = `src/assets/files/OnHold`;
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
        path = `${path}/Escalations`;
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
        path = `${path}/${moment().format("YYYY-MM-DD_H-mm-ss")}`;
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
        fs.writeFileSync(`${path}/Contratos On Hold.xlsx`, xls, "binary");
        const content = renderEmailNotifyUserEscalationMatrix(
          "Solicitud Apoyo #1 Contratos On Hold",
          "A continuación se adjuntan los Contratos en estado On Hold que se encuentran con la fecha de inicio del contrato vencida. Por favor su apoyo para obtener las actas de inicio lo antes posible En dado caso, el start date en CRM se encuentre vencido, por favor ingresar un internal task solicitando la actualizacion a la nueva fecha estimada de inicio"
        );
        await SendMail.sendMailEventDonations(
          content,
          "Solicitud Apoyo #1 Contratos On Hold",
          users1.map((row) => row.email),
          "",
          [
            {
              filename: `Contratos On Hold.xlsx`,
              path: `${path}/Contratos On Hold.xlsx`,
            },
          ]
        );
      }
      if (infoEscalation2[`${service}_${country}`] && users2.length) {
        contracts = [
          ...contracts,
          ...(await POSTGRESQL.findInfoContractsOnHoldByContractsNumber(
            infoEscalation2[`${service}_${country}`]
          )),
        ];
        const xls = json2xls(contracts);
        let path = `src/assets/files/OnHold`;
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
        path = `${path}/Escalations`;
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
        path = `${path}/${moment().format("YYYY-MM-DD_H-mm-ss")}`;
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
        fs.writeFileSync(`${path}/Contratos On Hold.xlsx`, xls, "binary");
        const content = renderEmailNotifyUserEscalationMatrix(
          "Solicitud Apoyo #2 Contratos On Hold",
          "A continuación se adjuntan los Contratos en estado On Hold que se encuentran con la fecha de inicio del contrato vencida. Por favor su apoyo para obtener las actas de inicio lo antes posible En dado caso, el start date en CRM se encuentre vencido, por favor ingresar un internal task solicitando la actualizacion a la nueva fecha estimada de inicio"
        );
        await SendMail.sendMailEventDonations(
          content,
          "Solicitud Apoyo #2 Contratos On Hold",
          users2.map((row) => row.email),
          "",
          [
            {
              filename: `Contratos On Hold.xlsx`,
              path: `${path}/Contratos On Hold.xlsx`,
            },
          ]
        );
      }
      if (infoEscalation3[`${service}_${country}`] && users3.length) {
        contracts = [
          ...contracts,
          ...(await POSTGRESQL.findInfoContractsOnHoldByContractsNumber(
            infoEscalation3[`${service}_${country}`]
          )),
        ];
        const xls = json2xls(contracts);
        let path = `src/assets/files/OnHold`;
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
        path = `${path}/Escalations`;
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
        path = `${path}/${moment().format("YYYY-MM-DD_H-mm-ss")}`;
        if (!fs.existsSync(path)) {
          fs.mkdirSync(path);
        }
        fs.writeFileSync(`${path}/Contratos On Hold.xlsx`, xls, "binary");
        const content = renderEmailNotifyUserEscalationMatrix(
          "Solicitud Apoyo #3 Contratos On Hold",
          "A continuación se adjuntan los Contratos en estado On Hold que se encuentran con la fecha de inicio del contrato vencida. Por favor su apoyo para obtener las actas de inicio lo antes posible En dado caso, el start date en CRM se encuentre vencido, por favor ingresar un internal task solicitando la actualizacion a la nueva fecha estimada de inicio"
        );
        await SendMail.sendMailEventDonations(
          content,
          "Solicitud Apoyo #3 Contratos On Hold",
          users3.map((row) => row.email),
          "",
          [
            {
              filename: `Contratos On Hold.xlsx`,
              path: `${path}/Contratos On Hold.xlsx`,
            },
          ]
        );
      }
    }
  }
);

export const FFgenerateRR = cron.schedule("00 08 26 * *", async () => {
  let fullDate = moment();
  let endDate = fullDate.format("YYYY-MM-DD HH:mm:ss");
  let startDate = fullDate
    .subtract(1, "months")
    .endOf("day")
    .format("YYYY-MM-DD HH:mm:ss");

  let requests = await FFDB.getPendingRequestRR(startDate, endDate);
  if (requests.length > 0) {
    for (let index = 0; index < requests.length; index++) {
      let request = requests[index];
      const requester = await FFDB.getSignID(request.requester);
      if (request.status == null) {
        request.formatedStatus = "Pendiente";
      } else {
        request.formatedStatus = request.status ? "Aprobado" : "Rechazado";
      }
      var tempApprovers = await FFDB.getRequestApprovers(request.id);
      await FFDB.addTimelineActivity(
        request.id,
        requester.id,
        "request",
        "Solicitud de Revenue Recognition Generada",
        3,
        false
      );
      await FFDB.updateRRLaunch(request.id);
      request.createdAtFormat = moment(request.createdAt)
        .utc()
        .utcOffset(moment().utcOffset())
        .format("DD-MM-YYYY hh:mm a");

      const emailData = {
        createdAtFormat: moment(request.createdAt)
          .utc()
          .utcOffset(moment().utcOffset())
          .format("DD-MM-YYYY hh:mm a"),
        approverQuantity: tempApprovers.length,
        id: request.id,
        requester: requester.name,
        bu: await FFDB.getBusinessUnitByID(request.BussinessUnitID),
        description: request.description,
        document: await FFDB.getDocument(request.DocumentID),
      };

      const content = RemindFFApprover(emailData);
      console.log(content);
      await SendMail.SalaryEmails(
        content,
        "Solicitud de Aprobación (Revenue Recognition) - Financial Flows",
        requester.email,
        "",
        []
      );
    }
  }
});

export const FFgenerateRRReminders = cron.schedule(
  "00 08 * * 1-5",
  async () => {
    let today = moment().date();
    let fullDate = moment();
    console.log("actual date today", fullDate.format("YYYY-MM-DD"));
    if (today !== 26) {
      if (today > 26 && today <= 31) {
        let lastReport = moment(
          fullDate.year() + "-" + (fullDate.month() + 1) + "-" + 26,
          "YYYY-MM-DD"
        ).startOf("day");
        let daysFrom = moment.duration(fullDate.diff(lastReport)).asDays();
        if (daysFrom < 6 && daysFrom > 0) {
          let endDate = lastReport.endOf("day").format("YYYY-MM-DD HH:mm:ss");
          let startDate = lastReport
            .subtract(1, "months")
            .startOf("day")
            .format("YYYY-MM-DD HH:mm:ss");
          let requests = await FFDB.getPendingRequestRR(startDate, endDate);
          if (requests.length > 0) {
            for (let index = 0; index < requests.length; index++) {
              let request = requests[index];
              const requester = await FFDB.getSignID(request.requester);
              if (request.status == null) {
                request.formatedStatus = "Pendiente";
              } else {
                request.formatedStatus = request.status
                  ? "Aprobado"
                  : "Rechazado";
              }

              var tempApprovers = await FFDB.getRequestApprovers(request.id);

              request.createdAtFormat = moment(request.createdAt)
                .utc()
                .utcOffset(moment().utcOffset())
                .format("DD-MM-YYYY hh:mm a");

              const emailData = {
                createdAtFormat: moment(request.createdAt)
                  .utc()
                  .utcOffset(moment().utcOffset())
                  .format("DD-MM-YYYY hh:mm a"),
                approverQuantity: tempApprovers.length,
                id: request.id,
                requester: requester.name,
                bu: await FFDB.getBusinessUnitByID(request.BussinessUnitID),
                description: request.description,
                document: await FFDB.getDocument(request.DocumentID),
              };

              const content = RemindFFApproverRR(emailData);
              console.log(content);
              await SendMail.SalaryEmails(
                content,
                "Recordatorio de Aprobación (Revenue Recognition) - Financial Flows",
                requester.email,
                "",
                []
              );
            }
          }
        }
      }

      if (today > 0 && today < 5) {
        let prevMonth = fullDate;
        let lastReport = moment(
          prevMonth.year() + "-" + prevMonth.month() + "-" + 26,
          "YYYY-MM-DD"
        );

        let daysFrom = moment
          .duration(fullDate.startOf("day").diff(lastReport.startOf("day")))
          .asDays();
        if (daysFrom > 0 && daysFrom < 7) {
          let endDate = lastReport.endOf("day").format("YYYY-MM-DD HH:mm:ss");
          let startDate = lastReport
            .subtract(1, "months")
            .startOf("day")
            .format("YYYY-MM-DD HH:mm:ss");

          let requests = await FFDB.getPendingRequestRR(startDate, endDate);
          if (requests.length > 0) {
            for (let index = 0; index < requests.length; index++) {
              let request = requests[index];
              const requester = await FFDB.getSignID(request.requester);
              if (request.status == null) {
                request.formatedStatus = "Pendiente";
              } else {
                request.formatedStatus = request.status
                  ? "Aprobado"
                  : "Rechazado";
              }

              var tempApprovers = await FFDB.getRequestApprovers(request.id);

              request.createdAtFormat = moment(request.createdAt)
                .utc()
                .utcOffset(moment().utcOffset())
                .format("DD-MM-YYYY hh:mm a");

              const emailData = {
                createdAtFormat: moment(request.createdAt)
                  .utc()
                  .utcOffset(moment().utcOffset())
                  .format("DD-MM-YYYY hh:mm a"),
                approverQuantity: tempApprovers.length,
                id: request.id,
                requester: requester.name,
                bu: await FFDB.getBusinessUnitByID(request.BussinessUnitID),
                description: request.description,
                document: await FFDB.getDocument(request.DocumentID),
              };

              const content = RemindFFApproverRR(emailData);
              await SendMail.SalaryEmails(
                content,
                "Recordatorio de Aprobación (Revenue Recognition) - Financial Flows",
                requester.email,
                "",
                []
              );
            }
          }
        }
      }
    }
  }
);

export const generateEngineerUserEscaltion = cron.schedule(
  "* * * * *",
  async () => {
    console.log("Escalación Ingenieros - Contratos de Mantenimiento");
    const assignments = await EngineerDB.getAllAssignmentEscalation();
    for (const element of assignments) {
      const { id, engineer, opp, salesRep } = element;
      const subject = "Escalación - Identificación de Partes para Opp";
      const content = `Por favor, han pasado 24 horas de la asignación para identificar las partes que corresponden al número de OPP <strong>${opp}</strong>, creado por  el usuario <strong>${
        salesRep.split("@")[0]
      }</strong>. Agradecemos su colaboración ingresando a Smart & Simple`;
      const html = renderEmailEscaltionEngineer(subject, content);
      const emailSended = await SendMail.sendMailMaintenance(
        html,
        subject,
        [], // attachments
        `${engineer}@GBM.NET`,
        [salesRep] // cc
      );
      await EngineerDB.createdEscalationAssignment(id);
    }
  }
);

export const generateInventoriesEscaltionNotification = cron.schedule(
  "0 10,15 * * *",
  async () => {
    console.log("Escalación Inventarios - Contratos de Mantenimiento");
    const requestPendings =
      await InventoriesDB.getDigitalRequestInQuotationEscalation();
    if (requestPendings.length) {
      const subject = "Escalación Inventarios - Requerimientos Pendientes";
      const content = `Por favor, tienes oportunidades pendientes en espera de cotización por gestionar. Agradecemos su colaboración ingresando a Smart & Simple`;
      const html = renderEmailEscaltionEngineer(subject, content);
      const emailSended = await SendMail.sendMailMaintenance(
        html,
        subject,
        [], // attachments
        `adm_inventarios@gbm.net`,
        [] // cc
      );
    }
  }
);

export const generatePlannersEscaltionNotification = cron.schedule(
  "0 10,15 * * *",
  async () => {
    console.log("Escalación Planificación - Contratos de Mantenimiento");
    let requestPendings = await PlannersDB.findAllEquipmentsAssigned();
    console.log(requestPendings);
    requestPendings = requestPendings.filter(
      (row) => row.equipments !== row.equipAssigned
    );
    console.log(requestPendings);
    if (requestPendings.length) {
      const subject = "Escalación Planificación - Requerimientos Pendientes";
      const content = `Por favor, tienes oportunidades pendientes de asignación en espera por gestionar. Agradecemos su colaboración ingresando a Smart & Simple`;
      const html = renderEmailEscaltionEngineer(subject, content);
      const emailSended = await SendMail.sendMailMaintenance(
        html,
        subject,
        [], // attachments
        `oficina_de_planificacion@gbm.net`,
        [] // cc
      );
    }
  }
);

export const generateTSSEscaltionNotification = cron.schedule(
  "0 10,15 * * *",
  async () => {
    console.log("Escalación Field Managers TSS - Contratos de Mantenimiento");
    const assignments = await EngineerDB.getAllAssignmentTSSEscalation();
    for (const element of assignments) {
      const { id, engineer, opp, salesRep } = element;
      const userProtected = await WebService.getUser(
        config.APP,
        engineer.toUpperCase()
      );
      const { PAIS } = userProtected;
      let fieldManagers = await SupportDB.getAllUserEscalationTSSByCountry(
        PAIS
      );
      fieldManagers = fieldManagers.map((row) => row.email);
      const subject =
        "Escalación Field Manager - Identificación de Partes para Opp";
      const content = `Por favor, han pasado más de 48 horas desde la asignación del ingeniero ${engineer}, para identificar las partes que corresponden al número de OPP <strong>${opp}</strong>, creado por  el usuario <strong>${
        salesRep.split("@")[0]
      }</strong>. Agradecemos su colaboración dando seguimiento al caso.`;
      const html = renderEmailEscaltionEngineer(subject, content);
      const emailSended = await SendMail.sendMailMaintenance(
        html,
        subject,
        [], // attachments
        fieldManagers,
        [`${engineer}@GBM.NET`] // cc
      );
    }
  }
);
