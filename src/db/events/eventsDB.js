import { connectionMIS } from "../../db/connection";

export default class EventsDB {
  static getDigitalSignByUser(UserID) {
    const query = `SELECT * FROM digital_sign WHERE UserID = ${UserID};`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Events DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createDigitalSign(decoded, user) {
    const {
      DEPARTAMENTO,
      EMAIL,
      IDCOLABC,
      INGRESO,
      NOMBRE,
      PAIS,
      POSICION,
      SALIDA,
      SUPERVISOR,
    } = user;
    const query = `INSERT INTO digital_sign
      (user, name, UserID, department, manager, country, subDivision, email, position, startDate, endDate, token)
    VALUES
      ('${decoded}','${NOMBRE}','${IDCOLABC}','${DEPARTAMENTO}','${SUPERVISOR}','${PAIS}', '${SUB_DIVISION}', '${EMAIL}','${POSICION}','${INGRESO}','${SALIDA}', null);`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Events DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getEvents() {
    const query = `CALL VEREVENTOSACTIVOS();`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Events DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getEventsById(id) {
    const query = `SELECT * FROM events WHERE CURDATE() < DATE(dueDate) AND id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Event DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getUserCurrency(country) {
    const query = `SELECT * FROM currencies WHERE country = '${country}' LIMIT 1`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Events DB: ${err}`);
            reject(err);
          }
          if (rows[0]) resolve(rows[0]);
          else resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getUserEventLogs(user, event) {
    const query = `SELECT events.id, events.EventID, events.complete, events.hide, events.createdAt, sign.name FROM events_logs as events
    LEFT JOIN MIS.digital_sign as sign ON events.SignID = sign.id
    WHERE sign.user = '${user}' AND events.EventID = ${event} LIMIT 1`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          if (rows[0]) resolve(rows[0]);
          else resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getUserSign(user) {
    const query = `SELECT * FROM MIS.digital_sign as sign WHERE sign.user ='${user}' LIMIT 1`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Events DB: ${err}`);
            reject(err);
          }
          if (rows[0]) {
            resolve(rows[0]);
          } else resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static hideEvent(user, event) {
    const query = `INSERT INTO events_logs (EventID, SignID, hide) VALUES (${event}, ${user}, '1');`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          if (rows[0]) resolve(rows[0]);
          else resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static completeEvent(user, event) {
    const query = `INSERT INTO events_logs (EventID, SignID, complete) VALUES (${event}, ${user}, '1');`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          if (rows[0]) resolve(rows[0]);
          else resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHumanCapitalsCountries() {
    const query = `SELECT
        HC.country,
        HC.email,
        HC.type
    FROM
        rrhh_locations HC
    WHERE
        HC.active = 1
    GROUP BY
        HC.country,
        HC.email,
        HC.type
    ORDER BY
        HC.country ASC;`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Events DB: ${err}`);
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
