import { connectionNP } from "../../db/connection";

export default class BulkLoadDB {
  static getAllInformation() {
    const query = `CALL GetAllInformation();`;
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