import { CRBConnection, FOConnection } from "../connection";
import moment from "moment";

export default class gpanamaBidsDB {
  static getMasterData() {
    return new Promise((resolve, reject) => {
      try {
        CRBConnection.query(
          `CALL costa_rica_bids_db.getMasterData();`,
          (err, rows) => {
            if (err) {
              reject(err);
            }
            resolve(rows);
          }
        );
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
  static getEmployeeFO() {
    return new Promise((resolve, reject) => {
      try {
        FOConnection.query(
          "SELECT id AS id,USUARIO AS user, NOMBRE AS name FROM `empleados` ",
          (err, rows) => {
            if (err) {
              reject(err);
            }
            resolve(rows);
          }
        );
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
  static getCustomersFO() {
    return new Promise((resolve, reject) => {
      try {
        FOConnection.query(
          "SELECT id AS id, NOMBRE AS name FROM `clientes",
          (err, rows) => {
            if (err) {
              reject(err);
            }
            resolve(rows);
          }
        );
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
  static updatePurchaseOrder(body) {
    const keysEdit = Object.keys(body);
    const last = Object.keys(body)[Object.keys(body).length - 1];
    console.log(last);
    let sql = `UPDATE purchaseOrder INNER JOIN purchaseOrderAdditionalData ON purchaseOrder.id = purchaseOrderAdditionalData.bidNumber SET`;
    for (const item of keysEdit) {
      if (item === last) {
        if (body[item] === "null") {
          sql += ` ${item}=" "`;
          break;
        } else {
          sql += ` ${item}="${body[item]}"`;
          break;
        }
      }
      if (Number.isInteger(item)) {
        sql += ` ${item}=${body[item]},`;
      } else {
        if (body[item] === "null" || body[item] === null) {
          sql += ` ${item}="",`;
        } else if (item !== "bidNumber" && item !== "id") {
          sql += ` ${item}="${body[item]}",`;
        }
      }
    }
    sql += ` WHERE purchaseOrder.bidNumber = "${body.bidNumber}"`;
    console.log(sql);
    return new Promise((resolve, reject) => {
      try {
        CRBConnection.query(sql, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
  static getPurchaseOrder(role, user) {
    return new Promise((resolve, reject) => {
      let query = `
      SELECT purchaseOrder.id,purchaseOrder.bidNumber,institution,processType.processType,description,timeAdjudge,budget,timeDelivery,offerValidity,statusRobot,
      expirationThird,openningDays,month,DATE_FORMAT(receptionClosing,'%Y/%m/%d') as receptionClosing,DATE_FORMAT(offerOpening,'%Y/%m/%d') as offerOpening,
      DATE_FORMAT(receptionClarification,'%Y/%m/%d') as receptionClarification,receptionExt,DATE_FORMAT(receptionObjections,'%Y/%m/%d') as receptionObjections,
      DATE_FORMAT(publicationDate,'%Y/%m/%d') as publicationDate,DATE_FORMAT(changeDate,'%Y/%m/%d') as changeDate,participateUser,
      valueTeam.valueTeam,oppType.oppType,salesType.salesType,noParticipationReason.noParticipationReason,gbmStatus.gbmStatus,accountManager,managerSector,participation,
      opp,quote,salesOrder,customerInstitute,contactId,customerName, contactName,improvePrices,participationWarranty,complianceAmount,workPoster,notParticipate,comment,complianceWarranty,
      participationAmount
      FROM purchaseOrder
      INNER JOIN purchaseOrderAdditionalData ON purchaseOrderAdditionalData.bidNumber = purchaseOrder.id
      LEFT JOIN processType ON processType.id = purchaseOrder.processType
      LEFT JOIN valueTeam ON valueTeam.id = purchaseOrderAdditionalData.valueTeam
      LEFT JOIN oppType ON oppType.id = purchaseOrderAdditionalData.oppType
      LEFT JOIN salesType ON salesType.id = purchaseOrderAdditionalData.salesType
      LEFT JOIN noParticipationReason ON noParticipationReason.id = purchaseOrderAdditionalData.noParticipationReason
      LEFT JOIN gbmStatus ON gbmStatus.id = purchaseOrderAdditionalData.gbmStatus`;
      if (role) {
        if (role === "CostaRicaBids AM") {
          query += ` WHERE accountManager = "${user}"`;
        } else if (role === "CostaRicaBids GBM Direct/Premium Account") {
          query += ` WHERE valueTeam.valueTeam = "GBM Direct" OR valueTeam.valueTeam = "Premium Account"`;
        } else {
          query += ` WHERE valueTeam.valueTeam = "${role}"`;
        }
      }
      query += " ORDER BY purchaseOrder.id DESC"
      console.log(query);
      try {
        CRBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
  static insertSalesTeam(id, item, user) {
    const query = `INSERT INTO salesTeam(bidNumber,salesTeam,salesTeamName,createdBy) VALUES( ${id},"${item.user}","${item.name}","${user}")`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        CRBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
  static deleteSalesTeam(id) {
    const query = `DELETE FROM salesTeam WHERE id = ${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        CRBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
  static newFile(values, bidNumber, user) {
    const { nameNormalize, encoding, mimetype, path, decoded } = values;
    const query =
      "INSERT INTO `uploadFiles` (name,bidNumber,user,codification,type,path,active,createdBy,createdAt) VALUES " +
      `('${nameNormalize}','${bidNumber}','${user}', '${encoding}', '${mimetype}', '${path}','${1}','${decoded}','${moment().format(
        "YYYY-MM-DD_H-mm-ss"
      )}')`;
    return new Promise((resolve, reject) => {
      try {
        CRBConnection.query(
          `SELECT * FROM uploadFiles WHERE bidNumber = '${bidNumber}' AND name = '${nameNormalize}'`,
          (error, results) => {
            if (error) {
              //console.log(error);
              reject(error);
            } else {
              if (results.length <= 0) {
                CRBConnection.query(query, (error, results) => {
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
  static removeFile(bdy) {
    const query = `DELETE FROM uploadFiles WHERE bidNumber = '${bdy.id}' AND name = '${bdy.name}'`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        CRBConnection.query(query, (err, rows) => {
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
    const query = `DELETE FROM uploadFiles WHERE bidNumber = '${bdy.id}'`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        CRBConnection.query(query, (err, rows) => {
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
  static getProducts(bdy) {
    const query = `SELECT code,name,amount,unit,unitPrice FROM products WHERE bidNumber = '${bdy}'`;
    return new Promise((resolve, reject) => {
      try {
        CRBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
  static getSalesTeam(bdy) {
    const query = `SELECT id, salesTeam as user,salesTeamName as name FROM salesTeam WHERE bidNumber = '${bdy}'`;
    return new Promise((resolve, reject) => {
      try {
        CRBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
  static getEvaluations(bdy) {
    const query = `SELECT * FROM evaluations WHERE bidNumber = '${bdy}'`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        CRBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
  static getFilesByPurchaseOrder(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT GROUP_CONCAT(name) AS files FROM uploadFiles WHERE bidNumber = "${id}"`;
      console.log(query);
      try {
        CRBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
    // (SELECT GROUP_CONCAT(upload_files.name) FROM upload_files
    // WHERE upload_files.documentId = document_system.documentId ) as documentFiles,
  }
  static getExcelReport(role, user) {
    return new Promise((resolve, reject) => {
      let query = `
    SELECT purchaseOrder.id,purchaseOrder.bidNumber,institution,processType.processType,description,timeAdjudge,budget,timeDelivery,offerValidity,statusRobot,
    expirationThird,openningDays,month,DATE_FORMAT(receptionClosing,'%Y/%m/%d') as receptionClosing,DATE_FORMAT(offerOpening,'%Y/%m/%d') as offerOpening,
    DATE_FORMAT(receptionClarification,'%Y/%m/%d') as receptionClarification,receptionExt,DATE_FORMAT(receptionObjections,'%Y/%m/%d') as receptionObjections,
    DATE_FORMAT(publicationDate,'%Y/%m/%d') as publicationDate,DATE_FORMAT(changeDate,'%Y/%m/%d') as changeDate,participateUser,
    valueTeam.valueTeam,oppType.oppType,salesType.salesType,noParticipationReason.noParticipationReason,gbmStatus.gbmStatus,accountManager,managerSector,participation,
    opp,quote,salesOrder,customerInstitute,contactId,improvePrices,participationWarranty,complianceAmount,workPoster,notParticipate,comment,complianceWarranty,
    participationAmount, products.code AS productCode, products.name AS productName, products.amount AS productAmount, products.unit AS productUnit,
     products.unitPrice AS productUnitPrice, products.detailDeparture AS detailDeparture, products.line AS productLine, products.detailLine AS productDetailLine
    FROM purchaseOrder
    INNER JOIN purchaseOrderAdditionalData ON purchaseOrderAdditionalData.bidNumber = purchaseOrder.id
    INNER JOIN products ON purchaseOrder.id = products.bidNumber
    LEFT JOIN processType ON processType.id = purchaseOrder.processType
    LEFT JOIN valueTeam ON valueTeam.id = purchaseOrderAdditionalData.valueTeam
    LEFT JOIN oppType ON oppType.id = purchaseOrderAdditionalData.oppType
    LEFT JOIN salesType ON salesType.id = purchaseOrderAdditionalData.salesType
    LEFT JOIN noParticipationReason ON noParticipationReason.id = purchaseOrderAdditionalData.noParticipationReason
    LEFT JOIN gbmStatus ON gbmStatus.id = purchaseOrderAdditionalData.gbmStatus`;
      if (role) {
        if (role === "CostaRicaBids AM") {
          query += ` WHERE accountManager = "${user}"`;
        } else if (role === "CostaRicaBids GBM Direct/Premium Account") {
          query += ` WHERE valueTeam.valueTeam = "GBM Direct" OR valueTeam.valueTeam = "Premium Account"`;
        } else {
          query += ` WHERE valueTeam.valueTeam = "${role}"`;
        }
      }
      try {
        CRBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
}
