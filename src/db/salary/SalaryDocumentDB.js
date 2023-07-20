import { SalaryDBConnection } from "../../db/connection";

export default class SalaryDocumentDB {
  static addRequestDocument(document, cypher, request) {
    const query = `UPDATE salary_request SET filepath='${document}', cypher='${cypher}'  WHERE id = ${request}`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Salary DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getRequestDocument(request) {
    const query = `SELECT filepath, cypher from salary_request WHERE id = ${request} LIMIT 1`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Salary DOCUMENT DB: ${err}`);
            reject(err);
          }
          resolve(rows[0]);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
