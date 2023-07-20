import { connectionNP } from "../../db/connection";

export default class DigitalSignatureDB {
  static getAllCountrys(allowedCountries) {
    let query = "";
    if (allowedCountries[0] === "REG") {
      query = `SELECT name AS name, ${"`key`"} FROM Country WHERE active = 1 ORDER BY name ASC`;
    } else {
      query = `SELECT name AS name, ${"`key`"} FROM Country WHERE active = 1 AND ${"`key`"} IN (${allowedCountries.map(
        (country) => `'${country}'`
      )}) ORDER BY name ASC`;
    }
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
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

  static getAllOrganizationalUnits() {
    const query = `
      SELECT
        id,
        UPPER(NAME) AS name
      FROM
        OrganizationalUnit
      WHERE
        active = 1
      ORDER BY
        name ASC`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
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

  static getOrganizationalUnitById(id) {
    const query = `
      SELECT
        UPPER(NAME) as name
      FROM
        OrganizationalUnit
      WHERE
        id = ${id};`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
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
