import { connectionPB } from "../../db/connection";

export default class PlanningMRSDB {
  static getNodes(query) {
    return new Promise((resolve, reject) => {
      try {
        connectionPB.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Planning MRS: ${err}`);
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
