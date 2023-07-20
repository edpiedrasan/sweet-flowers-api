import { UCConnection, FOConnection } from "../connection";
// import redis from "redis"
// import env from "../../config/config"

// const client = redis.createClient({
//     host: env.REDIS_HOST,
//     port: env.REDIS_PORT,
// });
// client.on('error', function (err) {
//     console.error('Redis error:', err);
// });

export default class gbmContactasDB {
  static getData(sql) {
    return new Promise((resolve, reject) => {
      try {
        let array = [];
        UCConnection.query(sql, (err, listas) => {
          if (err) {
            reject(err);
          }
          array.push(listas);
          resolve(listas);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static getDataBot(sql) {
    console.log(sql);
    return new Promise((resolve, reject) => {
      try {
        // client.get('gbm:gbmcontact:customers', (err, result) => {
        // if (err || result === null) {
        FOConnection.query(sql, (err, customers) => {
          if (err) {
            console.log(err);
            reject(err);
          }

          // client.set('gbm:gbmcontact:customers', JSON.stringify(clientes))
          resolve(customers);
        });
        // } else {
        // resolve(JSON.parse(result));
        // }
        // });
      } catch (error) {
        reject(error);
      }
    });
  }
  static getUpdateHistory() {
    return new Promise((resolve, reject) => {
      try {
        UCConnection.query(
          "SELECT `Id_Contact`,MAX(`Update_Date`) AS Update_Date,`Update_By` FROM `HistoryContacts` GROUP BY `Id_Contact`, `Update_By` ORDER BY `Id_Contact`,  `Update_Date` DESC",
          (err, listas) => {
            if (err) {
              reject(err);
            }
            resolve(listas);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  static insertHistory(
    Id_Contact,
    Id_Customer,
    Create_By,
    Update_By,
    Change_Values,
    Type_Data
  ) {
    return new Promise((resolve, reject) => {
      try {
        UCConnection.query(
          "INSERT INTO `HistoryContacts`" +
            ` (Id_Contact,Id_Customer,Create_By,Update_By,Change_Values,Type_Data) VALUE('${Id_Contact}','${Id_Customer}','${Create_By}','${Update_By}','${Change_Values}','${Type_Data}')`,
          (err, rows) => {
            if (err) {
              reject(err);
            }
            resolve(rows);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  static insertLogicBlock(
    Id_Contact_Lock,
    Id_Customer,
    Id_Contact_Sustitute,
    User_Name
  ) {
    return new Promise((resolve, reject) => {
      try {
        UCConnection.query(
          "INSERT INTO `LogicLock`" +
            `(idCustomer,idContactLock,idContactSubstitute,userName) VALUE('${Id_Customer}','${Id_Contact_Lock}','${Id_Contact_Sustitute}','${User_Name}')`,
          (err, rows) => {
            if (err) {
              reject(err);
            }
            resolve(rows);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  static insertReportHistory(userName, userRol) {
    return new Promise((resolve, reject) => {
      try {
        UCConnection.query(
          "INSERT INTO `ReportHistory`" +
            `(userName,userRol) VALUE('${userName}','${userRol}')`,
          (err, rows) => {
            if (err) {
              reject(err);
            }
            resolve(rows);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  static comfirmContact(Id_Contact, Id_Customer, Create_By) {
    return new Promise((resolve, reject) => {
      try {
        UCConnection.query(
          "INSERT INTO `ConfirmContacts`" +
            `(idContact,idCustomer,CreateBy) VALUE('${Id_Contact}','${Id_Customer}','${Create_By}')`,
          (err, rows) => {
            if (err) {
              reject(err);
            }
            resolve(rows);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  static removeConfirmContactQuery(idCustomer, idContact) {
    return new Promise((resolve, reject) => {
      try {
        UCConnection.query(
          "DELETE FROM `ConfirmContacts` WHERE `idCustomer`='" + idCustomer + "' AND `idContact` ='" + idContact + "'",
          (err, rows) => {
            if (err) {
              reject(err);
            }
            resolve(rows);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  static createContactsUpdatedRequest(values, idCustomer, user) {
    const { nameNormalize, encoding, mimetype, path, decoded } = values;
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO `ContactsUpdateRequest`" +
        `(nombre,idCustomer,user,codificacion,tipo,ruta,createdBy)
          VALUES ('${nameNormalize}','${idCustomer}','${user}', '${encoding}', '${mimetype}', '${path}', '${decoded}')`;
      console.log(query);
      UCConnection.query(query, (error, results) => {
        console.log(results);
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results);
        }
      });
    });
  }
  static getFileUpdateContact(id) {
    return new Promise((resolve, reject) => {
      let array = [];
      try {
        UCConnection.query(
          "SELECT * FROM `ContactsUpdateRequest` where id =" + id,
          (err, listas) => {
            if (err) {
              reject(err);
            }
            array.push(listas);
            resolve(listas);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  static getRoleData(user, dtype, terr) {
    return new Promise((resolve, reject) => {
      try {
        if (dtype === "GBM Contact Sales Manager") {
          //Sales manager
          FOConnection.query(
            `SELECT * FROM clientes WHERE GERENTE = '${user}'`,
            (errs, results) => {
              if (errs) {
                console.log(`Error Conection Contacts DB: ${errs}`);
                reject(errs);
              }
              resolve(results);
            }
          );
        } else if (dtype === "GBM Contact Territory Manager") {
          //Territory manager
          FOConnection.query(
            `SELECT * FROM clientes WHERE TERRITORIO = '${terr}'`,
            (errs, results) => {
              if (errs) {
                console.log(`Error Conection Contacts DB: ${errs}`);
                reject(errs);
              }
              resolve(results);
            }
          );
        } else {
          //Admin
          FOConnection.query(`SELECT * FROM clientes`, (errs, results) => {
            if (errs) {
              console.log(`Error Conection Contacts DB: ${errs}`);
              reject(errs);
            }
            resolve(results);
          });
        }
      } catch (error) {
        reject(error);
      }
    });
  }
  static getConfirmContacs(user) {
    return new Promise((resolve, reject) => {
      try {
        UCConnection.query(
          `SELECT DISTINCT COUNT('idConfirm') AS Confirmados FROM ConfirmContacts WHERE CreateBy = '${user}'`,
          (errs, results) => {
            if (errs) {
              console.log(`Error Conection Contacts DB: ${errs}`);
              reject(errs);
            }
            resolve(results);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  static getCustomerConfirmContacs(user, customerId) {
    return new Promise((resolve, reject) => {
      try {
        UCConnection.query(
          `SELECT DISTINCT COUNT('idConfirm') AS Confirmados FROM ConfirmContacts WHERE CreateBy = '${user}' AND idCustomer = '${customerId}'`,
          (errs, results) => {
            if (errs) {
              console.log(`Error Conection Contacts DB: ${errs}`);
              reject(errs);
            }
            resolve(results);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  static getCustomerConfirmContacsAll() {
    return new Promise((resolve, reject) => {
      try {
        UCConnection.query(
          `SELECT idCustomer, COUNT(DISTINCT 'idConfirm') as Confirmados FROM ConfirmContacts GROUP BY idCustomer`,
          (errs, results) => {
            if (errs) {
              console.log(`Error Conection Contacts DB: ${errs}`);
              reject(errs);
            }
            resolve(results);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  static getOtherStats(user) {
    return new Promise((resolve, reject) => {
      try {
        UCConnection.query(
          `SELECT * FROM HistoryContacts WHERE Create_By = '${user}'`,
          (errs, results) => {
            if (errs) {
              console.log(`Error Conection Contacts DB: ${errs}`);
              reject(errs);
            }
            resolve(results);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  static getLogicLock(user, month, year, lastMonthDay) {
    return new Promise((resolve, reject) => {
      try {
        UCConnection.query(
          `SELECT COUNT('Id') AS Bloqueados FROM LogicLock WHERE userName = '${user}' AND active = '1' AND createdAt >= '${year}-${month}-01 00:00:00' AND createdAt <= '${year}-${month}-${lastMonthDay} 23:59:59'`,
          (errs, results) => {
            if (errs) {
              console.log(`Error Conection Contacts DB: ${errs}`);
              reject(errs);
            }
            resolve(results);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
}
