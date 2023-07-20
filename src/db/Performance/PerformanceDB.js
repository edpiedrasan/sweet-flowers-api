import { connectionMis } from "../connection";

export default class PerformanceDB {

  static getAllDataDashboard() {
    const query = `CALL getAllDataDashboardPerformance ();`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS SS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllSignInsDashboard(year, month) {
    const query = `CALL getAllLoginInformationDashboard (${year}, ${month});`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS SS DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllTransaccionsDashboard(year, month) {
    const query = `CALL getAllTransaccionsDashboard (${year}, ${month});`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionMis.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS SS DB: ${err}`);
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