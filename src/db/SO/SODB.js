import { connectionMIS } from "../../db/connection";

export default class SODB {
  static getSO() {
    const query = `SELECT so.id, so.SignID, sign.user, sign.name, so.status, so.active, so.ticket, so.os, so.item, so.createdAt, so.updatedAt FROM MIS.service_orders as so
    LEFT JOIN MIS.digital_sign as sign ON so.SignID = sign.id`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Service Orders DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static getSOByCountry(country) {
    const query = `SELECT so.id, so.SignID, sign.user, sign.name, so.status, so.active, so.ticket, so.os, so.item, so.createdAt, so.updatedAt FROM MIS.service_orders as so
    LEFT JOIN MIS.digital_sign as sign ON so.SignID = sign.id
    WHERE sign.country = '${country}'`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Service Orders DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static getSOByUser(user) {
    const query = `SELECT so.id, so.SignID, sign.user, sign.name, so.status, so.active, so.ticket, so.os, so.item, so.createdAt, so.updatedAt FROM MIS.service_orders as so
    LEFT JOIN MIS.digital_sign as sign ON so.SignID = sign.id
    WHERE sign.user = '${user}'`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Service Orders DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static getSOByID(id) {
    const query = `SELECT so.id, so.SignID, sign.user, sign.name, so.status, so.active, so.ticket, so.os, so.item, so.ihr, so.cs, so.csCheck, so.createdAt, so.travelTime, so.travelDistance, so.serviceArea, so.serviceType, so.serviceTypeCategory, so.deviceStatus, so.warrantyStatus, so.activities, so.comments, so.updatedAt FROM MIS.service_orders as so
    LEFT JOIN MIS.digital_sign as sign ON so.SignID = sign.id
    WHERE so.id = ${id} LIMIT 1`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Service Orders DB: ${err}`);
            reject(err);
          }

          if (rows) {
            resolve(rows[0]);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static getUserSignByID(id) {
    const query = `SELECT * FROM MIS.digital_sign as sign WHERE sign.id =${id} LIMIT 1`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Service Orders DB: ${err}`);
            reject(err);
          }
          if (rows) {
            resolve(rows[0]);
          }
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
            console.log(`Error Conection Service Orders DB: ${err}`);
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

  static getServiceOrderDevices(id) {
    const query = `SELECT * FROM MIS.service_orders_devices WHERE OrderID = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Service Orders DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getServiceOrderReplacements(order, id) {
    const query = `SELECT * FROM MIS.service_orders_replacements WHERE OrderID= ${order} AND DeviceID = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Service Orders DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getReplacementsByOrder(order) {
    const query = `SELECT * FROM MIS.service_orders_replacements WHERE OrderID= ${order}`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Service Orders DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getIHRContact(order) {
    const query = `SELECT * FROM MIS.service_orders_contact WHERE OrderID= ${order} LIMIT 1`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Service Orders DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getTimelineStepsByOrder(order) {
    const query = `SELECT * FROM MIS.service_orders_timeline WHERE OrderID = ${order}`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Service Orders DB: ${err}`);
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
