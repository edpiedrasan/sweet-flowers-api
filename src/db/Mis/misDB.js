/* eslint-disable max-params */
import moment from "moment";
import { connectionMis } from "../../db/connection";

export default class misDB {

  static getInternalTeams() {
    const query = `SELECT * FROM InternalTeams IT WHERE IT.active = 1;`;
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getInactive() {
    const query = `Select * from mis_ss.inactivesys where visibility = 1`;
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateInactive(
    id,
    affectedSys,
    affectedSysDate,
    affectedSysTime,
    stateSys,
    color,
    affectedSites,
    comment,
    env,
    visibility
  ) {
    const query = `
      call mis_ss.updateInactiveInfo('${id}','${affectedSysDate +
      " " +
      affectedSysTime}','${affectedSys}','${env}','${affectedSites}','${stateSys}','${color}','${comment}','${visibility}')`;
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static addInactive(
    affectedSys,
    affectedSysDate,
    affectedSysTime,
    stateSys,
    color,
    affectedSites,
    comment,
    env
  ) {
    const query = `
      call mis_ss.insertInactive('${affectedSysDate +
      " " +
      affectedSysTime}','${affectedSys}','${env}','${affectedSites}','${stateSys}','${color}','${comment}')`;
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateMaintenance(
    id,
    target,
    affectedServices,
    affectedSites,
    startDate,
    startTime,
    endDate,
    endTime,
    status,
    color,
    otherCon,
    comment,
    env,
    visibility
  ) {
    const query = `
      call mis_ss.updateMaintenanceInfo('${id}','${target}','${affectedServices}','${env}','${affectedSites}','${startDate +
      " " +
      startTime} ','${endDate +
      " " +
      endTime}','${comment}','${status}','${otherCon}','${color}','${visibility}')`;
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static addMaintenance(
    target,
    affectedServices,
    affectedSites,
    startDate,
    startTime,
    endDate,
    endTime,
    status,
    color,
    otherCon,
    comment,
    env
  ) {
    const query = `call mis_ss.insertMaintenance('${target}','${affectedServices}','${env}','${affectedSites}','${startDate +
      " " +
      startTime}','${endDate +
      " " +
      endTime}','${comment}','${status}','${otherCon}','${color}','${1}')`;
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateProjects(
    id,
    dep,
    name,
    description,
    client,
    progress,
    releaseDate,
    initDate,
    comment,
    visibility
  ) {
    const query = `
      call mis_ss.updateProjectsInfo('${id}','${dep}','${name}','${description}','${client}','${progress}','${releaseDate}','${initDate}','${comment}','${visibility}')`;
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static addProjects(
    dep,
    name,
    description,
    client,
    progress,
    releaseDate,
    initDate,
    comment
  ) {
    const query = `call mis_ss.insertProjects('${dep}','${name}','${description}','${client}','${progress}','${releaseDate}','${initDate}','${comment}','${1}')`;
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getProjects(dep) {
    const query = `
          Select * from mis_ss.projectsys where dep = '${dep}' and visibility = 1`;
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getMaintenance() {
    const query = `
        Select * from mis_ss.maintenancesys where visibility = 1`;
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCountActiveProjects() {
    const query = `
    Select sum(dep = 'BI' ) as BI, sum( dep = 'AM') as AM, sum(dep = 'IF' ) as Inf, sum(dep = 'DM' ) as DM from mis_ss.projectsys WHERE (progress < 100 and visibility = 1)`;
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getLogonContencyById(id) {
    const query = `SELECT * FROM LogonContingency WHERE user_id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static insertLogonContencyUser(values) {
    const {
      IDCOLABC,
      EMAIL,
      NOMBRE,
    } = values;
    const [USERNAME] = EMAIL.split("@");
    const query = `INSERT INTO LogonContingency (user_id, username, name, email) VALUES (${IDCOLABC}, '${USERNAME}', '${NOMBRE}', '${EMAIL}')`;
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static insertLogonAccessUser(description, teams, token) {
    const query = `CALL inserLogonAccessUser ('${description}', '${JSON.stringify(teams)}', '${token}')`;
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static insertLogonContencyAccessUser(idLogonContency, idLogonAccess) {
    const query = `INSERT INTO LogonContingencyAccess (fk_idLogonContingency, fk_idLogonAccess) VALUES (${idLogonContency}, ${idLogonAccess})`;
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getTeamsContencyUser(userId) {
    const query = `SELECT * FROM LogonAccess la INNER JOIN LogonContingencyAccess lca ON la.id = lca.fk_idLogonAccess AND lca.fk_idLogonContingency = ${userId} ORDER BY la.createdAt DESC LIMIT 1;`;
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getLogonLogsUser(UserID) {
    const query = `SELECT * FROM LogonLogs WHERE fk_idLogonContingency = ${UserID} AND sign_out = 0;`;
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createLogonLog(idLogonContency) {
    const query = `INSERT INTO LogonLogs (fk_idLogonContingency) VALUES (${idLogonContency})`;
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateSignOutLogon(idLogonContency) {
    const query = `UPDATE LogonLogs SET sign_out = 1 WHERE fk_idLogonContingency = ${idLogonContency}`;
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getLogonContencyAccessByUserID(UserID) {
    const query = `SELECT * FROM LogonContingencyAccess T WHERE T.fk_idLogonContingency = ${UserID} ORDER BY T.id DESC LIMIT 1;`;
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createHttpAccess(module, path, method, platform) {
    const query = `INSERT INTO HttpAccess (module, path, method, platform) VALUES ('${module}', '${path}', '${method}', '${platform}')`;
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createHttpRequest(values, idLogon, idHttpAccess) {
    const { ip, city, country_name, country_code, continent_name, continent_code, latitude, longitude, time_zone: { name, offset, current_time }, threat: { is_tor, is_proxy, is_anonymous, is_known_attacker, is_known_abuser, is_threat, is_bogon } } = values;
    const query = `INSERT INTO HttpsRequests (ip, country_name, country_code, continent_name, continent_code, latitude, longitude, name, current_request, offset, city, is_tor, is_proxy, is_anonymous, is_known_attacker, is_known_abuser, is_threat, is_bogon, fk_idLogonContingencyAccess, fk_idHttpAccess) VALUES ('${ip}', '${country_name}', '${country_code}', '${continent_name}', '${continent_code}', '${latitude}', '${longitude}', '${name}', '${moment(current_time).format('YYYY-MM-DD H:mm:ss')}', '${offset}', '${city}', ${is_tor}, ${is_proxy}, ${is_anonymous}, ${is_known_attacker}, ${is_known_abuser}, ${is_threat}, ${is_bogon}, ${idLogon}, ${idHttpAccess})`;
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
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