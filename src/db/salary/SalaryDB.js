import { SalaryDBConnection, connectionMIS } from "../../db/connection";

export default class SalaryDB {
  static createRequest(type, user, note, country, date) {
    let query = null;
    if (date) {
      query = `INSERT INTO salary_request(type, RequesterID, note, BU, date) VALUES ('${type}' ,${user}, '${note}', '${country}', '${date}')`;
    } else {
      query = `INSERT INTO salary_request(type, RequesterID, note, BU, date) VALUES ('${type}' ,${user}, '${note}', '${country}', NULL)`;
    }
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
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

  static updateRequest(status, id) {
    const query = `UPDATE salary_request SET status=${status} WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
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

  static cancelRequest(id) {
    const query = `UPDATE salary_request SET cancelled=true WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
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

  static updateRequestPayroll(status, id) {
    const query = `UPDATE salary_request SET payroll=${status} WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
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

  static getRequestByID(id) {
    const query = `SELECT salary.id, salary.RequesterID, salary.date, sign.name as requester, sign.user as username, salary.status, salary.cancelled, salary.payroll, salary.note, salary.createdAt, salary.updatedAt, salary.type, salary.BU as country FROM salary_request as salary 
    LEFT JOIN MIS.digital_sign as sign ON sign.id = salary.RequesterID 
    WHERE salary.id = ${id} LIMIT 1`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows[0]);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getPendingRequestsByCountry(bu) {
    const query = `SELECT salary.id, salary.RequesterID, sign.name as requester, salary.status, salary.cancelled, salary.note, salary.createdAt, salary.updatedAt FROM salary_request as salary 
    LEFT JOIN MIS.digital_sign as sign ON sign.id = salary.RequesterID 
    WHERE salary.BU = '${bu}' AND salary.status IS NULL AND salary.cancelled IS NOT true`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
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

  static getPendingRequests() {
    const query = `SELECT salary.id, salary.RequesterID, sign.name as requester, salary.status, salary.cancelled, salary.note, salary.createdAt, salary.updatedAt FROM salary_request as salary 
    LEFT JOIN MIS.digital_sign as sign ON sign.id = salary.RequesterID 
    WHERE salary.status IS NULL AND salary.cancelled IS NOT true`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
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

  static getCompleteRequests() {
    const query = `SELECT salary.id, salary.RequesterID, sign.name as requester, salary.status, salary.cancelled, salary.note, salary.createdAt, salary.updatedAt FROM salary_request as salary 
    LEFT JOIN MIS.digital_sign as sign ON sign.id = salary.RequesterID 
    WHERE salary.status = 1`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
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

  static getCompleteRequestsByCountry(country) {
    const query = `SELECT salary.id, salary.RequesterID, sign.name as requester, salary.status, salary.cancelled, salary.note, salary.createdAt, salary.updatedAt FROM salary_request as salary 
    LEFT JOIN MIS.digital_sign as sign ON sign.id = salary.RequesterID 
    WHERE salary.BU = '${country}' AND salary.status = 1`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
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

  static getCancelledRequests() {
    const query = `SELECT salary.id, salary.RequesterID, sign.name as requester, salary.status, salary.cancelled, salary.note, salary.createdAt, salary.updatedAt FROM salary_request as salary 
    LEFT JOIN MIS.digital_sign as sign ON sign.id = salary.RequesterID 
    WHERE salary.cancelled = 1 OR salary.status = 0`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
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

  static getCancelledRequestsByCountry(country) {
    const query = `SELECT salary.id, salary.RequesterID, sign.name as requester, salary.status, salary.cancelled, salary.note, salary.createdAt, salary.updatedAt FROM salary_request as salary 
    LEFT JOIN MIS.digital_sign as sign ON sign.id = salary.RequesterID 
    WHERE salary.BU = '${country}' AND (salary.cancelled = 1 OR salary.status = 0)`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
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

  //APPROVERS
  static assignApproverRequest(id, approver) {
    const query = `INSERT INTO approvers(RequestID, SignID) VALUES (${id}, ${approver})`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
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

  static assignApproverRequestPayroll(id, approver) {
    const query = `INSERT INTO approvers(RequestID, SignID, payroll) VALUES (${id}, ${approver}, 1)`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
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

  static approversAction(id, note, status) {
    const query = `UPDATE approvers SET status=${status}, note='${note}' WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
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

  static approversActionFilepath(id, path, name, extension, uploadedBy) {
    const query = `INSERT INTO approvers_bypass(ApprovalID,path, filename, extension, uploadedBy) VALUES (${id}, '${path}','${name}','${extension}',${uploadedBy})`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
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

  static getCompleteApproverFilepath(id) {
    const query = `SELECT id, ApprovalID, path, filename, extension, uploadedBy, createdAt FROM approvers_bypass WHERE ApprovalID =  ${id} `;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
          if (err) {
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

  //APPROVERS

  static getApprobationInfo(id) {
    const query = `SELECT approver.id as id, approver.RequestID, approver.SignID, sign.name as requester, sign.email as email, approver.status, approver.payroll, approver.note, approver.filepath, approver.createdAt, approver.updatedAt FROM approvers as approver 
    LEFT JOIN MIS.digital_sign as sign ON sign.id = approver.SignID 
   WHERE approver.id = ${id} LIMIT 1 `;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          if (rows[0]) resolve(rows[0]);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getRequestApprovers(id) {
    const query = `SELECT approver.id as id, approver.RequestID, approver.SignID, sign.name as requester, sign.user as username, sign.email as email, approver.status, approver.payroll, approver.note, approver.filepath, approver.createdAt, approver.updatedAt FROM approvers as approver 
    LEFT JOIN MIS.digital_sign as sign ON sign.id = approver.SignID 
   WHERE approver.RequestID = ${id} `;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
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

  static getApprovalInfo(id) {
    const query = `SELECT approver.id as id, approver.RequestID, approver.SignID, sign.name as requester, approver.status, approver.payroll, approver.note, approver.filepath, approver.createdAt, approver.updatedAt, request.filepath as document FROM approvers as approver 
    LEFT JOIN MIS.digital_sign as sign ON sign.id = approver.SignID 
    LEFT JOIN salary_request as request ON request.id = approver.RequestID
   WHERE approver.id = ${id} LIMIT 1`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve(rows[0]);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //TIMELINE

  static createTimelineActivity(request, user, activity, status) {
    const query = `INSERT INTO timeline(RequestID, SignID, activity, status) VALUES (${request}, ${user}, '${activity}',${status} )`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
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

  static getRequestTimeline(id) {
    const query = `SELECT tl.id, tl.RequestID, tl.SignID, sign.name as user, tl.activity, tl.status, tl.createdAt FROM timeline as tl 
    LEFT JOIN MIS.digital_sign as sign ON sign.id = tl.SignID 
    WHERE tl.RequestID = ${id} `;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
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

  //SESSION
  static checkUserSession(user) {
    const query = `SELECT session.id, session.confirmation, session.token, session.SignID, sign.name as user, session.createdAt FROM session as session 
    LEFT JOIN MIS.digital_sign as sign ON sign.id = session.SignID 
    WHERE session.SignID = '${user}' `;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          rows.length ? resolve(rows[0]) : resolve(false);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createUserSession(user, confirmation) {
    const query = `INSERT INTO session(SignID, confirmation) VALUES (${user}, ${confirmation})`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
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

  static verifyUserSession(token, id) {
    const query = `UPDATE session SET token='${token}' WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
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

  static deleteSession(id) {
    const query = `DELETE FROM session WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
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
  // NOTIFICATIONS

  static getUserSalaryApprovals(user) {
    const query = `SELECT approver.id as ApprobationID, approver.note, approver.filepath, salary.id as id, salary.RequesterID, 
    requesterSign.name as requester, salary.status, salary.cancelled, salary.note, salary.createdAt, 
     salary.updatedAt  FROM approvers as approver
    LEFT JOIN MIS.digital_sign as sign ON sign.id = approver.SignID
    LEFT JOIN rrhh_as.salary_request as salary ON salary.id = approver.RequestID
    LEFT JOIN MIS.digital_sign as requesterSign ON requesterSign.id = salary.RequesterID
   WHERE approver.status IS NULL AND salary.cancelled IS NOT true AND sign.user =  '${user}'`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
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

  static findUserSign(user) {
    const query = `SELECT * FROM MIS.digital_sign as sign WHERE sign.user ='${user}' LIMIT 1`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Service Orders DB: ${err}`);
            reject(err);
          }
          if (rows) {
            resolve(rows[0]);
          } else {
            resolve(null);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createSign(user) {
    let query = `INSERT INTO digital_sign(user, UserID, department, manager, country, email, position, name, startDate, endDate) VALUES ('${user.user}', '${user.UserID}', '${user.department}', '${user.manager}', '${user.country}', '${user.email}', '${user.position}', '${user.name}', '${user.startDate}', '${user.endDate}')`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Service Orders DB: ${err}`);
            reject(err);
          }
          if (rows) {
            resolve(rows.insertId);
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

  //MEJORAS
  static uploadRequestFile(id, SignID, path, name, extension) {
    const query = `INSERT INTO salary_request_files(RequestID, SignID, path, filename, extension) VALUES (${id}, ${SignID}, '${path}','${name}','${extension}')`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
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

  static getRequestFiles(id) {
    const query = `SELECT files.id, files.RequestID, files.SignID, files.path, files.filename, files.extension, files.createdAt, sign.name as username FROM salary_request_files as files LEFT JOIN MIS.digital_sign as sign ON sign.id = files.SignID WHERE files.RequestID = ${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          if (rows) {
            console.log(rows);
            resolve(rows);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getRequestFile(file) {
    const query = `SELECT files.id, files.RequestID, files.SignID, files.path, files.filename, files.extension, files.createdAt, sign.name as username FROM salary_request_files as files LEFT JOIN MIS.digital_sign as sign ON sign.id = files.SignID WHERE files.id = ${file} LIMIT 1`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
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

  static deleteFile(file) {
    const query = `DELETE FROM salary_request_files WHERE id = ${file}`;
    return new Promise((resolve, reject) => {
      try {
        SalaryDBConnection.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }
}
