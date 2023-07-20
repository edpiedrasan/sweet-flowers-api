import { reject } from "lodash";
import { PBConnection, FOConnection } from "../connection";
import moment from "moment";

export default class gpanamaBidsDB {
  static getMasterData() {
    return new Promise((resolve, reject) => {
      try {
        PBConnection.query(
          `CALL panama_bids_db.getMasterData();`,
          (err, rows) => {
            if (err) {
              //console.log(`Error Conection Panama Bids DB: ${err}`);
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
  static getEmployeeFO() {
    return new Promise((resolve, reject) => {
      try {
        FOConnection.query(
          "SELECT ID AS id,USUARIO AS user, NOMBRE AS name FROM `empleados` ",
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
  static getCustomersFO() {
    return new Promise((resolve, reject) => {
      try {
        FOConnection.query(
          "SELECT ID AS id, NOMBRE AS name FROM `clientes",
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
  static getAllEntities() {
    return new Promise((resolve, reject) => {
      try {
        PBConnection.query("SELECT * FROM entities ORDER BY id DESC", (err, rows) => {
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
  static insertNewEntity(body, user) {
    console.log(body);
    let sql =
      "INSERT INTO `entities`(`entities`, `sector`, `customer`, `customerId`, `contact`,`salesRep`, `salesRepCoti`,`createdBy`) " +
      `VALUES ('${body.entities}','${body.sector}','${body.customer.name}','00${body.customer.id}','${body.contact}','${body.salesRep.user}','${body.salesRepCoti.user}','${user}')`;
    console.log("hola");
    console.log(sql);
    return new Promise((resolve, reject) => {
      try {
        PBConnection.query(sql, (err, rows) => {
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
  static updateEntity(body) {
    let sql = `UPDATE entities SET entities="${body.entities}",sector="${body.sector}",customer="${body.customer}",customerId="00${body.customerId}",contact="${body.contact}",salesRep="${body.salesRep}",salesRepCoti="${body.salesRepCoti}" WHERE id = ${body.id}`;
    console.log(sql);
    return new Promise((resolve, reject) => {
      try {
        PBConnection.query(sql, (err, rows) => {
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
  static deleteEntity(id) {
    const query = `DELETE FROM entities WHERE id=${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        PBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static getAllProducts() {
    return new Promise((resolve, reject) => {
      try {
        PBConnection.query("SELECT* FROM `products`", (err, rows) => {
          if (err) {
            reject(err);
            console.log(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static getPurchaseOrderMacro(bdy) {
    console.log(bdy.displayBf);
    let query = `SELECT 
    singleOrderRecord,sector,agreement,entity,orderSubtotal,purchaseOrder,registrationDate,
        publicationDate,performanceBond.performanceBond,oportunity,quote,salesOrder,deliveryDay,maximumDeliveryDate,
        daysRemaining,forecast,forecastType.forecastType,gbmStatus.gbmStatus,orderStatus.orderStatus,state,deliveryLocation,deliveryContact,
        phone,email,orderConfirmation,actualDeliveryDate,fineAmount,requestingUnit,accountContact,emailAccount,vendorOrder,documentLink,comment,
        purchaseOrderMacro.gbmStatus AS GS, purchaseOrderMacro.performanceBond AS POM, purchaseOrderMacro.forecastType AS FT, purchaseOrderMacro.orderStatus AS ORM
        FROM purchaseOrderMacro 
        INNER JOIN gbmStatus ON purchaseOrderMacro.gbmStatus = gbmStatus.id
        INNER JOIN performanceBond ON purchaseOrderMacro.performanceBond = performanceBond.id
        INNER JOIN forecastType ON purchaseOrderMacro.forecastType = forecastType.id
        INNER JOIN orderStatus ON purchaseOrderMacro.orderStatus = orderStatus.id
        `;
    let cont = 0;
    let text = "";

    if (bdy.selects) {
      const filterSelects = Object.keys(bdy.selects);
      const filerData = Object.keys(bdy.data);
      const filerCondition = Object.keys(bdy.condition);

      console.log(filerData.length);
      if (filterSelects.length > 0 && filerData.length > 0) {
        for (const item of filterSelects) {
          if (item === "Select0") {
            if (
              bdy.selects[item] === "perfomanceBond" ||
              bdy.selects[item] === "forecastType" ||
              bdy.selects[item] === "gbmStatus" ||
              bdy.selects[item] === "orderStatus" ||
              bdy.selects[item] === "publicationDate"
            ) {
              text += `\nWHERE ${bdy.selects[item]}.${bdy.selects[item]
                }  LIKE "%${bdy.data[filerData[cont]]}%"`;
              cont++;
            } else {
              text += `\nWHERE ${bdy.selects[item]}  LIKE "%${bdy.data[filerData[cont]]
                }%"`;
              cont++;
            }
          } else {
            if (
              bdy.selects[item] === "perfomanceBond" ||
              bdy.selects[item] === "forecastType" ||
              bdy.selects[item] === "gbmStatus" ||
              bdy.selects[item] === "orderStatus"
            ) {
              text += ` ${bdy.condition[filerCondition[cont - 1]]} ${bdy.selects[item]
                }.${bdy.selects[item]} LIKE "%${bdy.data[filerData[cont]]}%"`;
              cont++;
            } else {
              text += ` ${bdy.condition[filerCondition[cont - 1]]} ${bdy.selects[item]
                } LIKE "%${bdy.data[filerData[cont]]}%"`;
              cont++;
            }
          }
        }
        if (bdy.dates["DateStart"] && bdy.dates["DateEnd"]) {
          text += `\n AND ${bdy.typeDate} BETWEEN '${bdy.dates["DateStart"]}' AND '${bdy.dates["DateEnd"]}'`;
        }
      } else {
        if (bdy.dates["DateStart"] && bdy.dates["DateEnd"]) {
          text += `\nWHERE ${bdy.typeDate} BETWEEN '${bdy.dates["DateStart"]}' AND '${bdy.dates["DateEnd"]}'`;
        }
      }
      if (bdy.displayBf === true) {
        query += ` AND sector = "BF"`;
      }
    } else {
      if (bdy.displayBf === true) {
        query += ` WHERE sector = "BF"`;
      }
    }

    query = `${query} ${text} ORDER BY registrationDate DESC`;
    //console.log(query);
    return new Promise((resolve, reject) => {
      try {
        PBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
            console.log(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static getDataReportExcel(bdy) {
    let query = `SELECT purchaseOrderMacro.singleOrderRecord,
    purchaseOrderMacro.sector,
    purchaseOrderMacro.agreement,
    purchaseOrderMacro.entity,
    purchaseOrderProduct.productCode,
    products.productDescription,
    brand.brand,
    purchaseOrderProduct.totalProduct / purchaseOrderProduct.quantity AS price,
    purchaseOrderProduct.quantity,
    orderType.orderType,
    purchaseOrderProduct.totalProduct AS Total,
    purchaseOrderMacro.orderSubtotal,
    purchaseOrderMacro.purchaseOrder,
    DATE_FORMAT(purchaseOrderMacro.registrationDate,'%d/%m/%Y') as registrationDate,
    DATE_FORMAT(purchaseOrderMacro.publicationDate,'%d/%m/%Y') as publicationDate,
    performanceBond.performanceBond,
    purchaseOrderMacro.oportunity,
    purchaseOrderMacro.quote,
    purchaseOrderMacro.salesOrder,
    purchaseOrderMacro.deliveryDay,
    DATE_FORMAT(purchaseOrderMacro.maximumDeliveryDate,'%d/%m/%Y') as maximumDeliveryDate,
    purchaseOrderMacro.daysRemaining,
    DATE_FORMAT(purchaseOrderMacro.forecast,'%d/%m/%Y') as forecastType,
    forecastType.forecastType,
    gbmStatus.gbmStatus,
    orderStatus.orderStatus,
    purchaseOrderMacro.state,
    purchaseOrderMacro.deliveryLocation,
    purchaseOrderMacro.deliveryContact,
    purchaseOrderMacro.phone,
    purchaseOrderMacro.email,
    purchaseOrderMacro.orderConfirmation,
    DATE_FORMAT(purchaseOrderMacro.actualDeliveryDate,'%d/%m/%Y') as actualDeliveryDate,
    purchaseOrderMacro.fineAmount,
    purchaseOrderMacro.requestingUnit,
    purchaseOrderMacro.accountContact,
    purchaseOrderMacro.emailAccount,
    purchaseOrderMacro.vendorOrder,
    purchaseOrderMacro.documentLink,
    purchaseOrderMacro.comment
FROM purchaseOrderMacro
    LEFT JOIN purchaseOrderProduct on purchaseOrderMacro.singleOrderRecord = purchaseOrderProduct.singleOrderRecord
    INNER JOIN gbmStatus ON purchaseOrderMacro.gbmStatus = gbmStatus.id
    INNER JOIN performanceBond ON purchaseOrderMacro.performanceBond = performanceBond.id
    INNER JOIN forecastType ON purchaseOrderMacro.forecastType = forecastType.id
    INNER JOIN orderStatus ON purchaseOrderMacro.orderStatus = orderStatus.id
    INNER JOIN products ON purchaseOrderProduct.productCode = products.productCode
    INNER JOIN orderType ON purchaseOrderProduct.orderType = orderType.id
    INNER JOIN brand ON products.brand = brand.id
        `;
    let cont = 0;
    let text = "";

    if (bdy.selects) {
      const filterSelects = Object.keys(bdy.selects);
      const filerData = Object.keys(bdy.data);
      const filerCondition = Object.keys(bdy.condition);

      console.log(filerData.length);
      if (filterSelects.length > 0 && filerData.length > 0) {
        for (const item of filterSelects) {
          if (item === "Select0") {
            if (
              bdy.selects[item] === "perfomanceBond" ||
              bdy.selects[item] === "forecastType" ||
              bdy.selects[item] === "gbmStatus" ||
              bdy.selects[item] === "orderStatus" ||
              bdy.selects[item] === "publicationDate"
            ) {
              text += `\nWHERE ${bdy.selects[item]}.${bdy.selects[item]
                }  LIKE "%${bdy.data[filerData[cont]]}%"`;
              cont++;
            } else {
              text += `\nWHERE ${bdy.selects[item]}  LIKE "%${bdy.data[filerData[cont]]
                }%"`;
              cont++;
            }
          } else {
            if (
              bdy.selects[item] === "perfomanceBond" ||
              bdy.selects[item] === "forecastType" ||
              bdy.selects[item] === "gbmStatus" ||
              bdy.selects[item] === "orderStatus"
            ) {
              text += ` ${bdy.condition[filerCondition[cont - 1]]} ${bdy.selects[item]
                }.${bdy.selects[item]} LIKE "%${bdy.data[filerData[cont]]}%"`;
              cont++;
            } else {
              text += ` ${bdy.condition[filerCondition[cont - 1]]} ${bdy.selects[item]
                } LIKE "%${bdy.data[filerData[cont]]}%"`;
              cont++;
            }
          }
        }
        if (bdy.dates["DateStart"] && bdy.dates["DateEnd"]) {
          text += `\n AND ${bdy.typeDate} BETWEEN '${bdy.dates["DateStart"]}' AND '${bdy.dates["DateEnd"]}'`;
        }
      } else {
        if (bdy.dates["DateStart"] && bdy.dates["DateEnd"]) {
          text += `\nWHERE ${bdy.typeDate} BETWEEN '${bdy.dates["DateStart"]}' AND '${bdy.dates["DateEnd"]}'`;
        }
      }
      if (bdy.displayBf === true) {
        query += ` AND sector = "BF"`;
      }
    } else {
      if (bdy.displayBf === true) {
        query += ` WHERE sector = "BF"`;
      }
    }

    query = `${query} ${text} ORDER BY purchaseOrderMacro.registrationDate ASC`;
    console.log(text);
    return new Promise((resolve, reject) => {
      try {
        PBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
            console.log(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static getColumsPurchaseOrderMacro() {
    const query = `show full columns from purchaseOrderMacro WHERE FIELD != "active" AND FIELD != "createdAt" AND FIELD != "createdBy"`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        PBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
            console.log(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static getAllPurchaseOrderProduct(id) {
    return new Promise((resolve, reject) => {
      try {
        PBConnection.query(
          `SELECT productId,
          products.productDescription,
          brand.brand,
          purchaseOrderProduct.totalProduct / purchaseOrderProduct.quantity AS price,
          purchaseOrderProduct.quantity,
          orderType.orderType,
          purchaseOrderProduct.totalProduct AS Total
          FROM purchaseOrderProduct 
          INNER JOIN products ON purchaseOrderProduct.productCode = products.productCode
          INNER JOIN orderType ON purchaseOrderProduct.orderType = orderType.id
          INNER JOIN brand ON products.brand = brand.id 
          WHERE singleOrderRecord = "${id}"`,
          (err, rows) => {
            if (err) {
              reject(err);
              console.log(err);
            }
            resolve(rows);
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  }
  static updatePurchaseOrderMacro(body) {
    const keysEdit = Object.keys(body);
    let sql = `UPDATE purchaseOrderMacro SET `;
    for (const item of keysEdit) {
      if (item !== "GS" && item !== "FT" && item !== "POM" && item !== "ORM") {
        if (item === "comment") {
          if (body[item] === "null") {
            sql += `${item}=" "`;
            break;
          } else {
            sql += `${item}="${body[item]}"`;
            break;
          }
        }
        if (
          item === "registrationDate" ||
          item === "deliveryDay" ||
          item === "maximumDeliveryDate" ||
          item === "forecast" ||
          item === "actualDeliveryDate" ||
          item === "publicationDate"
        ) {
          if (body[item] === "null" || body[item] === null) {
            console.log("entre");
            sql += `${item}= NULL,`;
          } else {
            sql += `${item}="${moment
              .utc(body[item])
              .format("YYYY-MM-DD HH:mm")}",`;
          }
        } else {
          if (body[item] === "null" || body[item] === null) {
            sql += `${item}=" ",`;
          } else {
            sql += `${item}="${body[item]}",`;
          }
        }
      }
    }
    sql += `WHERE singleOrderRecord = "${body.singleOrderRecord}"`;
    console.log(sql);
    return new Promise((resolve, reject) => {
      try {
        PBConnection.query(sql, (err, rows) => {
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
  static updateProductsOrderMacro(id, value) {
    let sql = `UPDATE purchaseOrderProduct SET orderType ="${value}" where productId ="${id}"`;

    console.log(sql);
    return new Promise((resolve, reject) => {
      try {
        PBConnection.query(sql, (err, rows) => {
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
  static getAllCompetition(bdy) {
    let sql = `SELECT * FROM purchaseOrderCompetition `;
    let cont = 0;
    let text = "";

    if (bdy.selects) {
      const filterSelects = Object.keys(bdy.selects);
      const filerData = Object.keys(bdy.data);
      const filerCondition = Object.keys(bdy.condition);
      console.log(bdy.selects["Select0"]);
      if (filterSelects.length > 0 && filerData.length > 0) {
        for (const item of filterSelects) {
          if (item === "Select0") {
            text += `\nWHERE ${bdy.selects[item].id}  LIKE "%${bdy.data[filerData[cont]]
              }%"`;
            cont++;
          } else {
            text += ` ${bdy.condition[filerCondition[cont - 1]]}  ${bdy.selects[item].id
              } LIKE "%${bdy.data[filerData[cont]]}%"`;
            cont++;
          }
        }
        if (bdy.dates["DateStart"] && bdy.dates["DateEnd"]) {
          text += `\n AND ${bdy.typeDate} BETWEEN '${bdy.dates["DateStart"]}' AND '${bdy.dates["DateEnd"]}'`;
        }
      } else {
        if (bdy.dates["DateStart"] && bdy.dates["DateEnd"]) {
          text += `\nWHERE ${bdy.typeDate} BETWEEN '${bdy.dates["DateStart"]}' AND '${bdy.dates["DateEnd"]}'`;
        }
      }
    }
    sql += `${text} ORDER BY registrationDate DESC`;
    console.log(sql);
    return new Promise((resolve, reject) => {
      try {
        PBConnection.query(sql, (err, rows) => {
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
  static getAllDeliveryMethod() {
    return new Promise((resolve, reject) => {
      try {
        PBConnection.query("SELECT* FROM `deliveryMethod`", (err, rows) => {
          if (err) {
            reject(err);
            console.log(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static getAllCompetitionProducts(id) {
    return new Promise((resolve, reject) => {
      try {
        PBConnection.query(
          `SELECT purchaseOrderCompetitionProducts.*,
          productsCompetition.productDescription,
          productsCompetition.productLine,
          productsCompetition.typeProduct,
          productsCompetition.gbmParticipate
          FROM purchaseOrderCompetitionProducts
          INNER JOIN productsCompetition ON purchaseOrderCompetitionProducts.product = productsCompetition.productCode
          WHERE singleOrderRecord = "${id}"`,
          (err, rows) => {
            if (err) {
              console.log(err);
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
  static getColumsCompetition() {
    const query = `show full columns from purchaseOrderCompetition WHERE FIELD != "active" AND FIELD != "createdAt" AND FIELD != "createdBy"`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        PBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
            console.log(err);
          }
          console.log(rows);
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static getAllFastCotyzationReport(bdy) {
    return new Promise((resolve, reject) => {
      let query =
        "SELECT * FROM `quickQuoteReport` INNER JOIN deliveryMethod ON quickQuoteReport.deliveryMethod = deliveryMethod.id";
      let cont = 0;
      let text = "";

      if (bdy.selects) {
        const filterSelects = Object.keys(bdy.selects);
        const filerData = Object.keys(bdy.data);
        const filerCondition = Object.keys(bdy.condition);
        console.log(filerData.length);
        if (filterSelects.length > 0 && filerData.length > 0) {
          for (const item of filterSelects) {
            if (item === "Select0") {
              text += `\nWHERE ${bdy.selects[item]}  LIKE "%${bdy.data[filerData[cont]]
                }%"`;
              cont++;
            } else {
              text += ` ${bdy.condition[filerCondition[cont - 1]]} ${bdy.selects[item]
                } LIKE "%${bdy.data[filerData[cont]]}%"`;
              cont++;
            }
          }
        }
      }
      query = `${query} ${text} ORDER BY quoteDate DESC`;
      console.log(query);
      try {
        PBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
            console.log(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static getAllProductsFastCotyzation(id) {
    const query = `SELECT * FROM productsQuickQuote WHERE singleOrderRecord = "${id}"`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        PBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
            console.log(err);
          }
          console.log(rows);
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static getColumsFastCotyzationReport() {
    const query = `show full columns from quickQuoteReport WHERE FIELD != "active" AND FIELD != "createdAt" AND FIELD != "createdBy"`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        PBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
            console.log(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static updateFastCotyzationReport(body) {
    const keysEdit = Object.keys(body);
    let sql = `UPDATE quickQuoteReport SET `;
    for (const item of keysEdit) {
      if (item === "comments") {
        if (body[item] === "null" || body[item] === null) {
          sql += `${item}=""`;
          break;
        } else {
          sql += `${item}="${body[item]}"`;
          break;
        }
      }
      if (item === "quoteDate") {
        if (body[item] === "null" || body[item] === null) {
          console.log("entre");
          sql += `${item}= NULL,`;
        } else {
          sql += `${item}="${moment
            .utc(body[item])
            .format("YYYY-MM-DD HH:mm")}",`;
        }
      } else {
        if (body[item] === "null" || body[item] === null) {
          sql += `${item}="",`;
        } else {
          sql += `${item}="${body[item]}",`;
        }
      }
    }
    sql += `WHERE numCotyzation = "${body.numCotyzation}"`;
    console.log(sql);
    return new Promise((resolve, reject) => {
      try {
        PBConnection.query(sql, (err, rows) => {
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
  static updateGBMStatusQuickQuote(body) {
    let sql = `UPDATE quickQuoteReport SET interestGBM="${body.status}" WHERE numCotyzation ="${body.info.numCotyzation}"`;
    console.log(sql);
    return new Promise((resolve, reject) => {
      try {
        PBConnection.query(sql, (err, rows) => {
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
  static getAllFilesByDocumentId(documentId, identifier) {
    return new Promise((resolve, reject) => {
      try {
        PBConnection.query(
          `SELECT name, path FROM uploadFiles WHERE 	singleOrderRecord = '${documentId}' AND 	identifier = "${identifier}"`,
          (err, rows) => {
            if (err) {
              console.log(`Error Conection Document System DB: ${err}`);
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
  static getFilesByID(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT GROUP_CONCAT(name) AS files FROM uploadFiles WHERE singleOrderRecord = "${id}"`;
      console.log(query);
      try {
        PBConnection.query(query, (err, rows) => {
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
  static getDataReportCompetitionExcel(bdy) {
    let sql = `SELECT 
    purchaseOrderCompetition.*,
    DATE_FORMAT(purchaseOrderCompetition.dateFrom,'%d/%m/%Y') as dFrom,
    DATE_FORMAT(purchaseOrderCompetition.dateTo,'%d/%m/%Y') as dTo,
    DATE_FORMAT(purchaseOrderCompetition.registrationDate,'%d/%m/%Y') as rDate,
    DATE_FORMAT(purchaseOrderCompetition.publicationDate,'%d/%m/%Y') as pDate,
    purchaseOrderCompetitionProducts.*,
    productsCompetition.productDescription,
    productsCompetition.productLine,
    productsCompetition.typeProduct,
    productsCompetition.gbmParticipate
    FROM purchaseOrderCompetition
    LEFT JOIN purchaseOrderCompetitionProducts ON purchaseOrderCompetition.singleOrderRecord = purchaseOrderCompetitionProducts.singleOrderRecord
    INNER JOIN productsCompetition ON purchaseOrderCompetitionProducts.product = productsCompetition.productCode `;
    let cont = 0;
    let text = "";
    if (bdy.selects) {
      const filterSelects = Object.keys(bdy.selects);
      const filerData = Object.keys(bdy.data);
      const filerCondition = Object.keys(bdy.condition);
      console.log(bdy.selects["Select0"]);
      if (filterSelects.length > 0 && filerData.length > 0) {
        for (const item of filterSelects) {
          if (item === "Select0") {
            text += `\nWHERE ${bdy.selects[item].id}  LIKE "%${bdy.data[filerData[cont]]
              }%"`;
            cont++;
          } else {
            text += ` ${bdy.condition[filerCondition[cont - 1]]}  ${bdy.selects[item].id
              } LIKE "%${bdy.data[filerData[cont]]}%"`;
            cont++;
          }
        }
        if (bdy.dates["DateStart"] && bdy.dates["DateEnd"]) {
          text += `\n AND ${bdy.typeDate} BETWEEN '${bdy.dates["DateStart"]}' AND '${bdy.dates["DateEnd"]}'`;
        }
      } else {
        if (bdy.dates["DateStart"] && bdy.dates["DateEnd"]) {
          text += `\nWHERE ${bdy.typeDate} BETWEEN '${bdy.dates["DateStart"]}' AND '${bdy.dates["DateEnd"]}'`;
        }
      }
    }
    sql += `${text} ORDER BY purchaseOrderCompetition.registrationDate ASC`;
    console.log(sql);
    return new Promise((resolve, reject) => {
      try {
        PBConnection.query(sql, (err, rows) => {
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
