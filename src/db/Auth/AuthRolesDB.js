/* eslint-disable max-params */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
import { connectionAuth, connectionAccessPermissions } from "../../db/connection";

export default class AuthRolesDB {
  static getTeams(teams) {
    let query = `select * from roles_bpm.teams where enabled = 1 and name in (${teams.map(
      team => {
        return "'" + team + "'";
      }
    )})`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionAuth.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection DB: ${err}`);
            reject(err);
          }

          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getModulesByTeams(ids) {
    const query = `select * from roles_bpm.modules where enabled = 1 and fk_idTeams in (${ids});`;
    console.log(query)
    return new Promise((resolve, reject) => {
      try {
        connectionAuth.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getModulesByTeam(id) {
    let query = `select * from roles_bpm.modules where enabled = 1 and FK_idTeams = ${id} ORDER BY name ASC`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionAuth.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static verifyAccessPermissions(UserID) {
    const query = `SELECT
        P.name AS 'permission'
    FROM
        UserAccess UA
    INNER JOIN Permissions P ON
        UA.fk_Permissions = P.id
    INNER JOIN MIS.digital_sign DS
    ON
        UA.fk_SignID = DS.id AND DS.UserID = ${UserID}
    WHERE
        UA.active = 1;`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionAccessPermissions.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static verifyAccessByPermissions(UserID, rol) {
    const query = `SELECT
        P.name AS 'permission'
    FROM
        UserAccess UA
    INNER JOIN Permissions P ON
        UA.fk_Permissions = P.id
    INNER JOIN MIS.digital_sign DS
    ON
        UA.fk_SignID = DS.id AND DS.UserID = ${UserID}
    WHERE
        UA.active = 1 AND P.name = '${rol}';`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionAccessPermissions.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection DB: ${err}`);
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