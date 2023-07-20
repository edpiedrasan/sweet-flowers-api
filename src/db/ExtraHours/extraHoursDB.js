/* eslint-disable max-params */
/* eslint-disable max-lines */
/* eslint-disable no-ternary */
import { connectionMIS } from "../../db/connection";

export default class ExtraHoursDB {
  static getExtras(teams, user, startDate, endDate) {
    const query =
      teams[0] !== "Managers"
        ? `
      Select er.*, es.*, CASE WHEN ds.subDivision IS NULL THEN 'N/A' ELSE ds.subDivision END AS subDivision, REPLACE (er.hours,
      ".",
      ",") as hoursComma  from extra_request er inner join extra_states es on er.idState = es.idState right join digital_sign ds on er.sapIdUser = ds.UserID WHERE (date BETWEEN '${startDate}' AND '${endDate}') AND er.country IN (${teams.map(
            (team) => `'${team}'`
          )})`
        : `
      Select er.*, es.*, CASE WHEN ds.subDivision IS NULL THEN 'N/A' ELSE ds.subDivision END AS subDivision, REPLACE (er.hours,
      ".",
      ",") as hoursComma  from extra_request er inner join extra_states es on er.idState = es.idState right join digital_sign ds on er.sapIdUser = ds.UserID WHERE (date BETWEEN '${startDate}' AND '${endDate}') AND er.ceo = '${user}' or er.preApprover = '${user}'`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getYears(teams, user) {
    const query =
      teams[0] !== "Managers"
        ? `
      Select DISTINCT YEAR(date) as years FROM extra_request WHERE COUNTRY IN (${teams.map(
        (team) => `'${team}'`
      )})`
        : `
      Select DISTINCT YEAR(date) as years FROM extra_request WHERE ceo = '${user}' or preApprover = '${user}'`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateExtraInfo(id) {
    const query = `
    UPDATE extra_states SET sapStatus = 'No enviar', decision = "HC" WHERE idState = '${id}'`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getExtraInfo(id) {
    const query = `
    Select * from extra_states WHERE idState = '${id}'`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getExtrasSend(teams, startDate, endDate) {
    const query =
      startDate === undefined && endDate === undefined
        ? `
      Select er.*, es.*, CASE WHEN ds.subDivision IS NULL THEN 'N/A' ELSE ds.subDivision END AS subDivision, REPLACE (er.hours,
        ".",
        ",") as hoursComma from extra_request er inner join extra_states es on er.idState = es.idState right join digital_sign ds on er.sapIdUser = ds.UserID WHERE es.sapStatus = 'Enviar' AND er.country IN (${teams.map(
          (team) => `'${team}'`
        )})`
        : `Select er.*, es.*, CASE WHEN ds.subDivision IS NULL THEN 'N/A' ELSE ds.subDivision END AS subDivision, REPLACE (er.hours,
          ".",
          ",") as hoursComma from extra_request er inner join extra_states es on er.idState = es.idState right join digital_sign ds on er.sapIdUser = ds.UserID WHERE (date BETWEEN '${startDate}' AND '${endDate}') AND es.sapStatus = 'Enviar' AND er.country IN (${teams.map(
            (team) => `'${team}'`
          )})`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateSendedExtra(id, Enviada, messageSap) {
    const query = `UPDATE extra_states SET sapStatus='${Enviada}',updatedSapStatus=NOW(),sapMessage='${messageSap}' WHERE idState = '${id}'`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getToSend(toSend) {
    const query = `Select id,userName,dayBefore,date,time,endTime,sapIdUser,user,env,country,ceo from extra_request er inner join extra_states es on er.id = es.idState where id IN (${toSend.map(
      (e) => `'${e}'`
    )})`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }
          resolve(JSON.parse(JSON.stringify(rows)));
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getSended(toSend) {
    const query = `Select id,sapStatus,sapMessage from extra_request er inner join extra_states es on er.id = es.idState where id IN (${toSend.map(
      (e) => `'${e}'`
    )})`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }
          resolve(JSON.parse(JSON.stringify(rows)));
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getExtrasByDate(startDate, endDate, teams, user) {
    const query =
      teams[0] !== "Managers"
        ? `
      Select *, REPLACE (hours,
        ".",
        ",") as hoursComma from extra_request er inner join extra_states es on er.idState = es.idState WHERE date BETWEEN '${startDate}' AND '${endDate}' AND COUNTRY IN (${teams.map(
            (team) => `'${team}'`
          )})`
        : `
    Select *, REPLACE (hours,
      ".",
      ",") as hoursComma from extra_request er inner join extra_states es on er.idState = es.idState WHERE date BETWEEN '${startDate}' AND '${endDate}' AND (preApprover = '${user}' OR ceo = '${user}')`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getExtrasCountryYear(country, year) {
    const query = `Select ROUND(SUM(case when es.sapStatus = 'Enviar' then hours END),2) as toSendSAP, ROUND(SUM(case when es.sapStatus = 'Enviada' then hours END),2) as sendedSAP, MONTH(date) as month, ROUND(SUM(case when es.status = 'Aprobada' then hours END),2) as approved,ROUND(SUM(case when es.status = 'Rechazada' then hours END),2) as denied, ROUND(SUM(case when es.status = 'En espera' then hours END),2) as wait from (extra_request er inner join extra_states es on er.idState = es.idState)  WHERE (country = '${country}' AND YEAR(Date) = '${year}') GROUP by date order by date ASC`;

    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getExtrasAllYear(year, teams, user) {
    const query =
      teams[0] !== "Managers"
        ? `Select ROUND(SUM(case when es.sapStatus = 'Enviar' then hours END),2) as toSendSAP, ROUND(SUM(case when es.sapStatus = 'Enviada' then hours END),2) as sendedSAP, MONTH(date) as month, ROUND(SUM(case when es.status = 'Aprobada' then hours END),2) as approved, ROUND(SUM(case when es.status = 'Rechazada' then hours END),2) as denied, ROUND(SUM(case when es.status = 'En espera' then hours END),2) as wait from (extra_request er inner join extra_states es on er.idState = es.idState)  WHERE (YEAR(date) = '${year}') GROUP by date order by date ASC`
        : `Select ROUND(SUM(case when es.sapStatus = 'Enviar' then hours END),2) as toSendSAP, ROUND(SUM(case when es.sapStatus = 'Enviada' then hours END),2) as sendedSAP, MONTH(date) as month, ROUND(SUM(case when es.status = 'Aprobada' then hours END),2) as approved, ROUND(SUM(case when es.status = 'Rechazada' then hours END),2) as denied, ROUND(SUM(case when es.status = 'En espera' then hours END),2) as wait from (extra_request er inner join extra_states es on er.idState = es.idState)  WHERE (YEAR(date) = '${year}' AND (preApprover = '${user}' OR ceo = '${user}')) GROUP by date order by date ASC`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getExtrasCountryYearWidget(country, year) {
    const query = `Select ROUND(SUM(case when es.sapStatus = 'Enviar' then hours END),2) as toSendSAP, ROUND(SUM(case when es.sapStatus = 'Enviada' then hours END),2) as sendedSAP, ROUND(SUM(case when es.status = 'Aprobada' then hours END),2) as approved, ROUND(SUM(case when es.status = 'Rechazada' then hours END),2) as denied, ROUND(SUM(case when es.status = 'En espera' then hours END),2) as wait from (extra_request er inner join extra_states es on er.idState = es.idState)  WHERE (YEAR(date) = '${year}' and country = '${country}')`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getExtrasAllYearWidget(year, teams, user) {
    const query =
      teams[0] !== "Managers"
        ? `
    Select ROUND(SUM(case when es.sapStatus = 'Enviar' then hours END),2) as toSendSAP, ROUND(SUM(case when es.sapStatus = 'Enviada' then hours END),2) as sendedSAP, ROUND(SUM(case when es.status = 'Aprobada' then hours END),2) as approved,ROUND(SUM(case when es.status = 'Rechazada' then hours END),2) as denied, ROUND(SUM(case when es.status = 'En espera' then hours END),2) as wait from (extra_request er inner join extra_states es on er.idState = es.idState) WHERE (YEAR(date) = '${year}')`
        : `
    Select ROUND(SUM(case when es.sapStatus = 'Enviar' then hours END),2) as toSendSAP, ROUND(SUM(case when es.sapStatus = 'Enviada' then hours END),2) as sendedSAP, ROUND(SUM(case when es.status = 'Aprobada' then hours END),2) as approved,ROUND(SUM(case when es.status = 'Rechazada' then hours END),2) as denied, ROUND(SUM(case when es.status = 'En espera' then hours END),2) as wait from (extra_request er inner join extra_states es on er.idState = es.idState) WHERE (YEAR(date) = '${year}') AND (preApprover = '${user}' OR ceo = '${user}')`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getExtrasUserYear(year, type, teams, user) {
    const query =
      teams[0] !== "Managers"
        ? `
      SELECT DISTINCT ${type} FROM extra_request WHERE YEAR(date) = '${year}' AND COUNTRY IN (${teams.map(
            (team) => `'${team}'`
          )})`
        : `SELECT DISTINCT ${type} FROM extra_request WHERE YEAR(date) = '${year}' AND (preApprover = '${user}' OR ceo = '${user}')`;

    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getExtrasHoursByUser(year, type, col) {
    let query;
    if (type == "userName") {
      query = `
    Select MONTH(date) as month,ROUND(SUM(case when es.status = 'En espera' then hours END),2) as wait, ROUND(SUM(case when es.status = 'Aprobada' then hours END),2) as approved,ROUND(SUM(case when es.status = 'Rechazada' then hours END),2) as denied from (extra_request er inner join extra_states es on er.idState = es.idState)  WHERE (${type} = '${col}' AND YEAR(Date) = '${year}') GROUP by date order by date ASC`;
    } else if (type == "ceoName") {
      query = `
    Select MONTH(date) as month, ROUND(SUM(case when es.status = 'En espera' AND ((es.decision = 'pre' AND es.preApproverStatus = 'Aprobada') OR (es.decision is NULL AND preApprover = 'N/A')) then hours END),2) as wait, ROUND(SUM(case when es.status = 'Aprobada' AND es.decision = 'bss' then hours END),2) as approved,ROUND(SUM(case when es.status = 'Rechazada' AND es.decision = 'bss' then hours END),2) as denied from (extra_request er inner join extra_states es on er.idState = es.idState)  WHERE (${type} = '${col}' AND YEAR(Date) = '${year}' ) GROUP by date order by date ASC`;
    } else if (type == "preApproverName") {
      query = `
    Select MONTH(date) as month,ROUND(SUM(case when es.preApproverStatus = 'En espera' AND es.decision is NULL then hours END),2) as wait, ROUND(SUM(case when es.preApproverStatus = 'Aprobada' AND (es.decision = 'bss' OR es.decision = 'pre' ) then hours END),2) as approved,ROUND(SUM(case when es.preApproverStatus = 'Rechazada' AND (es.decision = 'bss' OR es.decision = 'pre' ) then hours END),2) as denied from (extra_request er inner join extra_states es on er.idState = es.idState)  WHERE (${type} = '${col}' AND YEAR(Date) = '${year}' AND preApprover != 'N/A') GROUP by date order by date ASC`;
    }
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getExtrasHoursByMonth(year, month, user, teams) {
    const query =
      teams[0] !== "Managers"
        ? `
      Select ROUND(SUM(case when es.status = 'Aprobada' then hours END),2) as approved, ROUND(SUM(case when es.status = 'Rechazada' then hours END),2) as denied, ROUND(SUM(case when es.status = 'En espera' then hours END),2) as wait from (extra_request er inner join extra_states es on er.idState = es.idState)  WHERE (YEAR(date) = '${year}' and MONTH(date) = '${month}')`
        : `
      Select ROUND(SUM(case when es.status = 'Aprobada' then hours END),2) as approved, ROUND(SUM(case when es.status = 'Rechazada' then hours END),2) as denied, ROUND(SUM(case when es.status = 'En espera' then hours END),2) as wait from (extra_request er inner join extra_states es on er.idState = es.idState)  WHERE (YEAR(date) = '${year}' and MONTH(date) = '${month}' AND (preApprover = '${user}' OR ceo = '${user}'))`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getExtrasHoursByMonthCountry(year, month, country) {
    const query = `
    Select ROUND(SUM(case when es.status = 'Aprobada' then hours END),2) as approved, ROUND(SUM(case when es.status = 'Rechazada' then hours END),2) as denied, ROUND(SUM(case when es.status = 'En espera' then hours END),2) as wait from (extra_request er inner join extra_states es on er.idState = es.idState)  WHERE (YEAR(date) = '${year}' and MONTH(date) = '${month}' and country = '${country}')`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getUsersWithAccess(countries) {
    const query = `SELECT
      DS.UserID AS id,
      DS.user AS username,
      DS.name,
      DS.email,
      DS.manager,
      DS.country
    FROM
        digital_sign DS
    INNER JOIN user_roles UR ON
        DS.id = UR.SignID AND UR.role = 'extras' AND UR.enabled = 1
    WHERE
        DS.country IN(${countries.map((team) => `'${team}'`)})`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getUserWithAccessById(id) {
    const query = `SELECT
        DS.id AS signId
    FROM
        digital_sign DS
    INNER JOIN user_roles UR ON
        DS.id = UR.SignID AND UR.enabled = 1 AND UR.role = 'extras' AND DS.UserID = '${id}'`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static deactivateUserRol(signId, updatedBy) {
    const query = `UPDATE
        user_roles UR
    SET
        UR.enabled = 0,
        UR.updatedBy = '${updatedBy}'
    WHERE
        UR.SignID = ${signId} AND UR.role = 'extras'`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findUserWithAccessByUsername(username, countries) {
    const query = `SELECT
        *
    FROM
        digital_sign DS
    WHERE
        DS.user = '${username}' AND DS.country IN(${countries.map(
      (team) => `'${team}'`
    )})`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findUserRoleBySignID(signID) {
    const query = `SELECT * FROM user_roles WHERE SignID = ${signID} AND role = 'extras' AND enabled = 1;`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createUserRol(id, createdBy) {
    const query = `CALL CREATEUSERACCESSEXTRAS(${id}, '${createdBy}')`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createExtraStateLogs(idState, values) {
    const {
      MANDT,
      IDSTATE,
      PREAPPROVERSTATUS,
      STATUS,
      VISIBILITY,
      UPDATEDSAPSTATUS,
      UPDATEDSTATUS,
      UPDATEDPREAPPROVERSTATUS,
      DECISION,
    } = values;
    const query = `INSERT INTO
      extra_states_logs(env, idState, preapproverstatus, status, visibility, updatedSapStatus, updatedStatus, updatedPreapproverStatus, decision, fk_idState)
    VALUES ('${MANDT}', '${IDSTATE}', '${PREAPPROVERSTATUS}', '${STATUS}', '${VISIBILITY}', '${UPDATEDSAPSTATUS}', '${UPDATEDSTATUS}', '${UPDATEDPREAPPROVERSTATUS}', '${DECISION}', '${idState}')`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static verifyIsCeoEntraHours(username) {
    const query = `SELECT * FROM extra_request er WHERE er.ceo = '${username}';`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findExtraHoursByCeo(startDate, endDate, ceo) {
    const query = `SELECT
        er.id,
        er.country,
        er.USER,
        er.sapIdUser,
        er.userName,
        er.ceo,
        er.ceoName,
        er.preApprover,
        er.preApproverName,
        DATE_FORMAT(er.date, "%Y/%m/%d %H:%i") AS date,
        er.old,
        CASE WHEN er.dayBefore = 0 THEN 'NO' ELSE 'SÍ'
    END AS dayBefore,
    er.time,
    er.endTime,
    er.newEndTime,
    REPLACE
        (er.hours, ".", ",") AS hoursComma,
        er.hours AS hoursReported,
        er.jobDescription,
        er.justification,
        er.userReason,
        er.ceoReason,
        er.info,
        DATE_FORMAT(er.createdAt, "%Y/%m/%d %H:%i") AS createdAt,
        es.preApproverStatus,
        es.status,
        es.moreTimeDenied,
        CASE
          WHEN es.sapStatus = 'No enviar' THEN 'Cancelada'
          WHEN es.sapStatus = 'Enviar' THEN 'Pendiente'
          WHEN es.sapStatus = 'Enviada' THEN 'Aceptada'
        END AS sapStatus,
        es.visibility,
        es.cancel,
        DATE_FORMAT(es.updatedStatus, "%Y/%m/%d %H:%i") AS updatedStatus,
        DATE_FORMAT(es.updatedPreapproverStatus, "%Y/%m/%d %H:%i") AS updatedPreapproverStatus,
        DATE_FORMAT(es.updatedSapStatus, "%Y/%m/%d %H:%i") AS updatedSapStatus,
        es.sapMessage,
        es.decision
    FROM
      extra_request er INNER JOIN extra_states es ON er.idState = es.idState AND er.ceo = '${ceo}' WHERE er.date BETWEEN '${startDate}' AND '${endDate}';`;
    // console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
