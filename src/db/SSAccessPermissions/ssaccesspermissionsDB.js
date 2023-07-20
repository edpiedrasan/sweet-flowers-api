import { connectionAccessPermissions, connectionMIS } from "../connection";

export default class SSAccessPermissionsDB {

  constructor() { }

  static getUsersWithAccessByModule(rol) {
    const query = `SELECT
        u.id,
        ds.UserID,
        ds.user,
        ds.name,
        p.name AS country
    FROM
        UserAccess u
    INNER JOIN Permissions p ON
        u.fk_Permissions = p.id AND p.name LIKE '%${rol}%'
    INNER JOIN MIS.digital_sign ds
    ON
        u.fk_SignID = ds.id
    WHERE
        u.active = 1
    ORDER BY
        ds.name, p.name;`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionAccessPermissions.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static deactivatedUsersWithAccess(id) {
    const query = `UPDATE UserAccess SET active = 0 WHERE id = ${id};`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionAccessPermissions.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static selectIdUserByIdColab(id) {
    const query = `SELECT id AS idC from digital_sign where UserID = ${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static selectAccesByDigitalSignature(country) {
    const query = `SELECT id AS idP from Permissions where name = 'Digital Signature ${country}'`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionAccessPermissions.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static selectAccesByExtraHours(country) {
    let query = '';
    if (country === 'Manager') {
      query = `SELECT id AS idP from Permissions where name = 'Extra Hours'`;
    } else {
      query = `SELECT id AS idP from Permissions where name = 'Extra Hours ${country}'`;
    }
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionAccessPermissions.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createUsersWithAccess(idU, idP, createdBy) {
    const query = `INSERT INTO UserAccess (fk_SignID, fk_Permissions, createdBy) VALUES (${idU}, ${idP}, '${createdBy}')`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionAccessPermissions.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
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