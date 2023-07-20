/* eslint-disable handle-callback-err */
/* eslint-disable max-params */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable no-useless-constructor */
/* eslint-disable no-empty-function */
//
/* */
import ibmdb from "ibm_db";
import config from "../config/config";

export default class DB2 {

  constructor() { }

  static conectionDb2(query) {
    return new Promise((resolve, reject) => {
      ibmdb.open(
        `DATABASE=${config.DB2_NAME};HOSTNAME=${config.DB2_HOST};UID=${
        config.DB2_USER
        };PWD=${config.DB2_PASSWORD};PORT=${config.DB2_PORT};PROTOCOL=${
        config.DB2_PROTOCOL
        }`,
        function (err, conn) {
          if (err) {
            reject(err);
          }
          console.log(query);
          conn.query(query, function (errr, data) {
            if (errr) {
              reject(errr);
            }
            conn.close(function () {
              resolve(data);
            });
          });
        }
      );
    });
  }

  static conectionCognosDb2(query) {
    return new Promise((resolve, reject) => {
      ibmdb.open(
        `DATABASE=${config.CG_NAME};HOSTNAME=${config.CG_HOST};UID=${
        config.CG_USER
        };PWD=${config.CG_PASSWORD};PORT=${config.CG_PORT};PROTOCOL=${
        config.DB2_PROTOCOL
        }`,
        function (err, conn) {
          if (err) {
            reject(err);
          }
          console.log(query);
          conn.query(query, function (errr, data) {
            if (errr) {
              reject(errr);
            }
            conn.close(function () {
              resolve(data);
            });
          });
        }
      );
    });
  }

  static createDocumentSign(
    DocumentID,
    userID,
    username,
    name,
    email,
    country,
    department,
    position,
    exception,
    auth_token,
    type
  ) {
    return new Promise((resolve, reject) => {
      const query = `CALL "DBFIRMAS"."FIRMARDOCUMENTO" (?,?,?,?,?,?,?,?,?,?,?,?)`;
      const response = {
        ParamType: "OUTPUT",
        DataType: 1,
        Data: 0
      };
      ibmdb.open(`DATABASE=${config.DB2_NAME};HOSTNAME=${config.DB2_HOST};UID=${
        config.DB2_USER
        };PWD=${config.DB2_PASSWORD};PORT=${config.DB2_PORT};PROTOCOL=${
        config.DB2_PROTOCOL
        }`, function (err, connection) {
          if (err) {
            console.log(err);
            return;
          }
          connection.queryResult(
            query,
            [
              DocumentID,
              userID,
              username,
              name,
              email,
              country,
              department,
              position,
              exception,
              auth_token,
              type,
              response
            ],
            function (err, result, params) {
              if (err) {
                reject(err);
              }
              console.log(result, params)
              if (params) {
                resolve(params[0]);
              } else {
                reject(false);
              }
            }
          );
        });
    });
  }
}