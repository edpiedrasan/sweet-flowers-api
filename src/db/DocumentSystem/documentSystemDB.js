import { BSConnection, FOConnection } from "../connection";
import moment from "moment";

export default class documentSystemDB {
  //funcion para extraer las solicitudes de SD con base a los filtros de CardFilters
  static getData(filters, roles, userCountry) {
    let { status, country, iDateSelected, fDateSelected } = filters;

    console.log(country);

    filters["status"] =
      status.value.value === "TO" || status.value.value === "Todos"
        ? ""
        : status.value.value;

    filters["country"] =
      country.value === "TO" || country.value === "Todos" ? "" : country.value;

    //eliminar para no ser tomadas en cuenta en el siguiente foreach
    delete filters["iDateSelected"];
    delete filters["fDateSelected"];

    if (country.value !== null) {
      if (!country || country.value === "" || country.value.length === 0) {
        delete filters["country"];
      }
    } else {
      delete filters["country"];
    }
    // //console.log(roles)
    return new Promise((resolve, reject) => {
      try {
        let sqlString = `SELECT document_system.*,
                DATE_FORMAT(document_system.createdAt, '%d/%m/%Y %T') as Cdate,
                DATE_FORMAT(document_system.updatedAt, '%d/%m/%Y %T') as Udate,
                DATE_FORMAT(document_system.submittedToIBM, '%Y-%m-%dT%T') as SubIBM,
                document_type.typeText,
                document_status.statusName,
                document_country.countryName,
                GROUP_CONCAT(document_vendors.fk_vendor) as documentVendor,

                (SELECT GROUP_CONCAT(document_sv.documentSV) FROM document_sv
                WHERE document_sv.documentId = document_system.documentId ) as documentSv,

                (SELECT GROUP_CONCAT(document_trading.poTrading) FROM document_trading
                WHERE document_trading.documentId = document_system.documentId ) as documentTrading
                
                from document_system 
                LEFT JOIN document_vendors on document_system.documentId = document_vendors.fk_documentId
                INNER JOIN document_type on document_system.documentType = document_type.typeCode
                INNER JOIN document_status on document_system.status = document_status.statusCode
                INNER JOIN document_country on document_system.country = document_country.countryCode`; //"SELECT * FROM document_system";

        console.log(filters);
        let cont = false;

        //por status y por country
        Object.keys(filters).forEach(function (key) {
          let llave = key;

          if (llave === "country") {
            for (const item in country.value) {
              let valor = country.value[item].value;
              if (item === "0") {
                if (cont) {
                  sqlString += ` AND (${llave} = '${valor}'`;
                } else {
                  sqlString += ` WHERE (${llave} = '${valor}'`;
                  cont = true;
                }
              } else {
                sqlString += ` OR ${llave} = '${valor}')`;
              }
            }
            if (sqlString.substring(sqlString.length - 1) !== ")") {
              sqlString += ")";
            }
          } else {
            let valor = filters[key];
            if (valor !== "") {
              if (cont) {
                sqlString += ` AND ${llave} = '${valor}'`;
              } else {
                sqlString += ` WHERE ${llave} = '${valor}'`;
                cont = true;
              }
            }
          }
        });

        if (iDateSelected.value !== "" && fDateSelected.value !== "" && cont) {
          sqlString += ` AND document_system.createdAt BETWEEN '${iDateSelected.value} 00:00:00' AND '${fDateSelected.value} 23:59:59'`;
        } else if (iDateSelected.value !== "" && fDateSelected.value !== "") {
          sqlString += ` WHERE document_system.createdAt BETWEEN '${iDateSelected.value} 00:00:00' AND '${fDateSelected.value} 23:59:59'`;
          cont = true;
        }

        if (roles.some((row) => row.indexOf("Document System User") !== -1)) {
          userCountry =
            userCountry === "SV"
              ? "ES"
              : userCountry === "GT"
              ? "GU"
              : userCountry === "HN"
              ? "HO"
              : userCountry === "US"
              ? "MD"
              : userCountry === "DR"
              ? "DO"
              : userCountry;
          sqlString += cont
            ? ` AND document_system.country = '${userCountry}'`
            : ` WHERE document_system.country = '${userCountry}'`;
        }

        sqlString +=
          " GROUP BY document_system.id ORDER BY document_system.id DESC LIMIT 2000";

        console.log(sqlString);

        BSConnection.query(sqlString, (err, rows) => {
          if (err) {
            //console.log(`Error Conection Document System DB: ${err}`);
            reject(err);
          }
          resolve(rows);
          // resolve(JSON.stringify(rows));
        });
      } catch (error) {
        console.log(error);
        reject(error.sqlMessage);
      }
    });
  }
  static getFilesByCustomer(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT GROUP_CONCAT(name) AS files FROM upload_files WHERE documentId = ${id}`;
      console.log(query);
      try {
        BSConnection.query(query, (err, rows) => {
          if (err) {
            //console.log(`Error Conection Document System DB: ${err}`);
            reject(err);
          }
          // const arr = JSON.parse(rows);
          // rows.forEach((obj) => renameKey(obj, "vendorId", "vendorName"));
          // //console.log(rows);
          resolve(rows);
          // resolve(JSON.stringify(rows));
        });
      } catch (error) {
        reject(error);
      }
    });
    // (SELECT GROUP_CONCAT(upload_files.name) FROM upload_files
    // WHERE upload_files.documentId = document_system.documentId ) as documentFiles,
  }
  static getVendors() {
    return new Promise((resolve, reject) => {
      try {
        BSConnection.query(
          "SELECT vendorId as value, vendorName as label FROM vendors",
          (err, rows) => {
            if (err) {
              //console.log(`Error Conection Document System DB: ${err}`);
              reject(err);
            }
            // const arr = JSON.parse(rows);
            // rows.forEach((obj) => renameKey(obj, "vendorId", "vendorName"));
            // //console.log(rows);
            resolve(rows);
            // resolve(JSON.stringify(rows));
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  static getTypes() {
    return new Promise((resolve, reject) => {
      try {
        BSConnection.query(
          "SELECT typeCode as value, typeText as label FROM `document_type`",
          (err, rows) => {
            if (err) {
              //console.log(`Error Conection Document System DB: ${err}`);
              reject(err);
            }
            // const arr = JSON.parse(rows);
            // rows.forEach((obj) => renameKey(obj, "typeCode", "typeText"));
            // //console.log(rows);
            resolve(rows);
            // resolve(JSON.stringify(rows));
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  static getCountries() {
    return new Promise((resolve, reject) => {
      try {
        BSConnection.query(
          "SELECT countryCode as value, countryName as label FROM document_country",
          (err, rows) => {
            if (err) {
              //console.log(`Error Conection Document System DB: ${err}`);
              reject(err);
            }
            // const arr = JSON.parse(rows);
            // rows.forEach((obj) => renameKey(obj, "countryCode", "countryName"));
            // //console.log(rows);
            resolve(rows);
            // resolve(JSON.stringify(rows));
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  static getStatus() {
    return new Promise((resolve, reject) => {
      try {
        BSConnection.query(
          "SELECT statusCode as value, statusName as label, statusType FROM document_status",
          (err, rows) => {
            if (err) {
              //console.log(`Error Conection Document System DB: ${err}`);
              reject(err);
            }
            // const arr = JSON.parse(rows);
            // rows.forEach((obj) => renameKey(obj, "statusCode", "statusName"));
            // rows["Todos"] = "Todos";
            // //console.log(rows);
            resolve(rows);
            // resolve(JSON.stringify(rows));
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  static getDocumentId(documentId) {
    return new Promise((resolve, reject) => {
      try {
        BSConnection.query(
          `SELECT id FROM document_system WHERE documentId=${documentId}`,
          (err, rows) => {
            if (err) {
              //console.log(`Error Conection Document System DB: ${err}`);
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
  static insertNewRequest(bdy) {
    const query =
      "INSERT INTO `document_system`(`documentType`, `documentId`, `customerName`, `comment`, `country`, `status`, `salesOrderOn`, `salesOrderTrad`, `purchReq`, `opp`, `quote`, `cancelledReason`, `bsResponse`, `submittedToIBM`, `createdAt`, `createdBy`, `updatedBy`, `updatedAt`, `statusRobot`) " +
      `VALUES ('${bdy.newInfo.documentType}', ${bdy.newInfo.documentId}, '${
        bdy.customerName
      }', '${bdy.newInfo.comment ? bdy.newInfo.comment : ""}', '${
        bdy.country
      }', 'NW', '${bdy.salesOrderOn}', '${bdy.salesOrderTrad}', '${
        bdy.purchReq
      }', '${bdy.opp}', '${bdy.quote}', '', '', NULL, '${moment().format(
        "YYYY-MM-DD_H-mm-ss"
      )}', '${bdy.createdBy}', '', NULL, 1)`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        BSConnection.query(query, (error, results) => {
          if (error) {
            //console.log(error);
            reject(error);
          } else {
            resolve(results);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static insertDocumentSv(documentId, documentSv, user) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO `document_sv`(`documentId`, `documentSV`, `createdBy`) " +
        `VALUES ('${documentId}', '${documentSv}', '${user}')`;
      //console.log(query);
      BSConnection.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
  static insertDocumentVendor(bdy, item, user) {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO `document_vendors`(`fk_documentId`, `fk_vendor`, `createdBy`) " +
        `VALUES  ('${bdy.newInfo.documentId}', '${item}', '${user}')`;
      console.log(query);
      BSConnection.query(query, (error, results) => {
        if (error) {
          //console.log(error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
  static updateDocument(info, updatedBy) {
    return new Promise((resolve, reject) => {
      let query = "UPDATE `document_system` SET";
      let { documentId, prevStatus } = info;

      //eliminar para no ser tomadas en cuenta en el siguiente foreach
      delete info["documentId"];
      delete info["prevStatus"];

      //se agrega para el siguiente foreach
      info["updatedBy"] = updatedBy;
      info["updatedAt"] = `${moment().format("YYYY-MM-DD_H-mm-ss")}`;
      // (key === "updatedAt" ? "" :
      Object.keys(info).forEach(function (key) {
        if (query == "UPDATE `document_system` SET") {
          query = query + " `" + key + "` = '" + info[key].toString() + "'";
        } else {
          query = query + ", `" + key + "` = '" + info[key].toString() + "'";
        }
      });

      query = query + ` WHERE documentId = ${documentId}`;

      console.log(query);
      let vall = true;
      try {
        if (prevStatus !== info.status && typeof info.status !== "undefined") {
          let logInsert = `INSERT INTO document_log (fk_documentId, fk_status, createdBy) VALUES (${documentId},'${info.status}','${updatedBy}')`;
          BSConnection.query(logInsert, (error, results) => {
            if (error) {
              ////console.log(error);
              vall = false;
            }
          });
        }
      } catch (error) {}

      BSConnection.query(query, (error, results) => {
        if (error || !vall) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }
  static newFile(values, documentId, user) {
    const { nameNormalize, encoding, mimetype, path, decoded } = values;
    const query =
      "INSERT INTO `upload_files` (name,documentId,user,codification,type,path,active,createdBy,createdAt) VALUES " +
      `('${nameNormalize}','${documentId}','${user}', '${encoding}', '${mimetype}', '${path}','${1}','${decoded}','${moment().format(
        "YYYY-MM-DD_H-mm-ss"
      )}')`;
    //console.log(query);
    return new Promise((resolve, reject) => {
      try {
        BSConnection.query(
          `SELECT * FROM upload_files WHERE documentId = '${documentId}' AND name = '${nameNormalize}'`,
          (error, results) => {
            if (error) {
              //console.log(error);
              reject(error);
            } else {
              if (results.length <= 0) {
                BSConnection.query(query, (error, results) => {
                  if (error) {
                    //console.log(error);
                    reject(error);
                  } else {
                    resolve(results);
                  }
                });
              } else {
                resolve(results);
              }
            }
          }
        );
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
  static getLog(documentId, roles) {
    return new Promise((resolve, reject) => {
      try {
        BSConnection.query(
          `SELECT document_log.*, DATE_FORMAT(document_log.createdAt, '%d/%m/%Y %T') as Cdate, document_status.statusName FROM document_log INNER JOIN document_status on document_log.fk_status = document_status.statusCode WHERE fk_documentId = '${documentId}'`,
          (err, rows) => {
            if (err) {
              //console.log(`Error Conection Document System DB: ${err}`);
              reject(err);
            }

            resolve(rows);
            // resolve(JSON.stringify(rows));
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  static getCustomers() {
    const query =
      "SELECT ID AS value, NOMBRE AS label, PAIS AS Pais FROM clientes";

    console.log(query);

    return new Promise((resolve, reject) => {
      try {
        FOConnection.query(query, (err, customers) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);

            reject(err);
          }

          resolve(customers);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static deleteDocumentTrading(documentId) {
    const query = `DELETE FROM document_trading WHERE documentId = ${documentId};`;
    return new Promise((resolve, reject) => {
      try {
        BSConnection.query(query, (err, rows) => {
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
  static insertDocumentTrading(documentId, poTrading, user) {
    const query =
      "INSERT INTO `document_trading`(`documentId`, `poTrading`, `createdAt`, `createdBy`) " +
      `VALUES  ('${documentId}', '${poTrading}', '${moment().format(
        "YYYY-MM-DD_H-mm-ss"
      )}', '${user}')`;
    return new Promise((resolve, reject) => {
      try {
        //console.log(query);
        BSConnection.query(query, (error, results) => {
          if (error) {
            //console.log(error);
            reject(error);
          } else {
            resolve(results);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static getAllFilesByDocumentId(documentId) {
    return new Promise((resolve, reject) => {
      try {
        BSConnection.query(
          `SELECT name, path FROM upload_files WHERE documentId = '${documentId}'`,
          (err, rows) => {
            if (err) {
              //console.log(`Error Conection Document System DB: ${err}`);
              reject(err);
            }

            resolve(rows);
            // resolve(JSON.stringify(rows));
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  static removeFile(bdy) {
    const query = `DELETE FROM upload_files WHERE documentId = '${bdy.id}' AND name = '${bdy.name}'`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        BSConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static removeAllFiles(bdy) {
    const query = `DELETE FROM upload_files WHERE documentId = '${bdy.id}'`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        BSConnection.query(query, (err, rows) => {
          if (err) {
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
