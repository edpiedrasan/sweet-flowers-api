import { reject } from "lodash";
import { EIConnection, connectionMIS, BSConnection } from "../connection";
import moment from "moment";

export default class exitInterviewDB {
  static getMasterData() {
    return new Promise((resolve, reject) => {
      try {
        EIConnection.query(
          `CALL exitInterview.getMasterData();`,
          (err, rows) => {
            if (err) {
              console.log(err);
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
  static getAllInterviews(bdy) {
    return new Promise((resolve, reject) => {
      let query = `
     SELECT  idInterview AS id, CONCAT('ES', idInterview) AS idInterview, exitType.exitType, interview.exitType as exitTypeId, CONCAT('', idCollaborator) AS idCollaborator,
     doNotValueGBM,collaboratorName,immediateBoss,department,timeWorked,IF(ISNULL(specify)=1, 'N/A', specify) AS 'specify',
      goBackGBM,countries.country as countriesData, interview.country as country, DATE_FORMAT(date,'%Y/%m/%d') as date,comment,interviewer,rehirable,benefitsJob, 
      commentHC, companyType.company as companyType, interview.companyType as companyTypeId, (SELECT JSON_ARRAYAGG(JSON_OBJECT(
      'value', exitReasonInterview.exitReason,
      'label', exitReason.exitReason)) as 'exitReasonInterview'
    FROM exitReasonInterview
    INNER JOIN exitReason ON exitReasonInterview.exitReason = exitReason.id 
    WHERE interview = idInterview) AS "exitReason"
     FROM interview 
     LEFT JOIN countries ON countries.id = interview.country
     LEFT JOIN exitType ON exitType.id = interview.exitType
     LEFT JOIN companyType ON companyType.id = interview.companyType
      `;

      if (bdy.DateStart && bdy.DateEnd) {
        query += `\n WHERE date BETWEEN '${bdy.DateStart}' AND '${bdy.DateEnd}'`;
      }
      query += "\n ORDER BY id  DESC";
      console.log(query);
      try {
        EIConnection.query(query, (err, rows) => {
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
  static getAllInterviewsExcel(bdy) {
    return new Promise((resolve, reject) => {
      let query = `SELECT   idInterview AS id,CONCAT('ES', idInterview) AS idInterview, exitType.exitType, CONCAT('', idCollaborator) AS idCollaborator,
      collaboratorName,immediateBoss,department,timeWorked,IF(ISNULL(specify)=1, 'N/A', specify) AS 'specify',
      goBackGBM,countries.country as countriesData, DATE_FORMAT(date,'%Y/%m/%d') as date,comment,interviewer,rehirable, (SELECT 
         GROUP_CONCAT(CONCAT(exitReason.exitReason) SEPARATOR ', ') as "a"
         FROM exitReasonInterview
         INNER JOIN exitReason ON exitReasonInterview.exitReason = exitReason.id 
         WHERE interview = idInterview) as "exitReason"
      FROM interview 
      LEFT JOIN countries ON countries.id = interview.country
      LEFT JOIN exitType ON exitType.id = interview.exitType
      LEFT JOIN companyType ON companyType.id = interview.companyType
       `;

      if (bdy.DateStart && bdy.DateEnd) {
        query += `\n WHERE date BETWEEN '${bdy.DateStart}' AND '${bdy.DateEnd}'`;
      }
      query += "\n ORDER BY id  DESC";
      console.log(query);
      try {
        EIConnection.query(query, (err, rows) => {
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
  static getAllDraftInterviewsStatus(id) {
    return new Promise((resolve, reject) => {
      let query = `SELECT idInterview,exitType.exitType,interviewStatus.interviewStatus,
       draftInterview.exitType as exitTypeId, draftInterview.interviewStatus as interviewStatusId, idCollaborator,collaboratorName,immediateBoss,
       department,timeWorked,IF(ISNULL(specify)=1, 'N/A', specify) AS 'specify',goBackGBM,countries.country,draftInterview.country as countriesData,
       benefitsJob, commentHC, companyType.company, draftInterview.companyType as companyTypeId,date,comment,interviewer,rehirable,
       (SELECT JSON_ARRAYAGG(JSON_OBJECT(
        'value', exitReasonDraftInterview.exitReason,
        'label', exitReason.exitReason)) as 'exitReasonDraftInterview'
      FROM exitReasonDraftInterview
      INNER JOIN exitReason ON exitReasonDraftInterview.exitReason = exitReason.id 
      WHERE draftInterview = idInterview) AS "exitReason"
        FROM draftInterview 
       LEFT JOIN countries ON countries.id = draftInterview.country
       LEFT JOIN exitType ON exitType.id = draftInterview.exitType 
       LEFT JOIN interviewStatus ON interviewStatus.id = draftInterview.interviewStatus 
       LEFT JOIN companyType ON companyType.id = draftInterview.companyType
       WHERE interviewStatus.id = "1" AND idCollaborator ="${id}"`;
      try {
        EIConnection.query(query, (err, rows) => {
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
  static getAllDraftInterviewsCompleteByUser(interviewer) {
    return new Promise((resolve, reject) => {
      let query = `SELECT idInterview
        FROM draftInterview 
       WHERE interviewStatus = "2" AND interviewer ="${interviewer}"`;
      try {
        EIConnection.query(query, (err, rows) => {
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
  static getAllDraftInterviews() {
    return new Promise((resolve, reject) => {
      let query = `SELECT idInterview,exitType.exitType,user, draftInterview.exitType as exitTypeId,idCollaborator,  draftInterview.interviewStatus as interviewStatusId,   
       doNotValueGBM,collaboratorName,immediateBoss,interviewStatus.interviewStatus,department,timeWorked,IF(ISNULL(specify)=1, 'N/A', specify) AS 'specify',
      goBackGBM,countries.country,draftInterview.country as countriesData,date,comment,interviewer,rehirable,benefitsJob, 
      commentHC, companyType.company as companyType, draftInterview.companyType as companyTypeId, (SELECT JSON_ARRAYAGG(JSON_OBJECT(
      'value', exitReasonDraftInterview.exitReason,
      'label', exitReason.exitReason)) as 'exitReasonDraftInterview'
    FROM exitReasonDraftInterview
    INNER JOIN exitReason ON exitReasonDraftInterview.exitReason = exitReason.id 
    WHERE draftInterview = idInterview) AS "exitReason"
     FROM draftInterview 
     LEFT JOIN countries ON countries.id = draftInterview.country
     LEFT JOIN exitType ON exitType.id = draftInterview.exitType
     LEFT JOIN interviewStatus ON interviewStatus.id = draftInterview.interviewStatus
     LEFT JOIN companyType ON companyType.id = draftInterview.companyType
     ORDER BY draftInterview.idInterview DESC`;
      try {
        EIConnection.query(query, (err, rows) => {
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
  static insertInterview(body, user) {
    console.log(body);
    const query = `INSERT INTO interview(user,exitType,country,idCollaborator,collaboratorName,immediateBoss,department,timeWorked,specify,
      goBackGBM,date,comment,doNotValueGBM,interviewer,rehirable,commentHC,companyType,benefitsJob)
     VALUES("${body.user}","${body.exitTypeId}",${body.countriesData},"${
      body.idCollaborator
    }","${body.collaboratorName}", "${body.immediateBoss}", "${
      body.department
    }", "${body.timeWorked}","${body.specify}","${body.goBackGBM}"
     ,"${moment.utc(body.date).format("YYYY-MM-DD")}","${body.comment}","${
      body.doNotValueGBM
    }","${user}","${body.rehirable}","${body.commentHC}",${
      body.companyTypeId
    }, "${body.benefitsJob}")`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        EIConnection.query(query, (err, rows) => {
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
  static insertDraftInterview(body, user) {
    const keysEdit = Object.keys(body);
    let query = `INSERT INTO draftInterview(`;
    for (const item of keysEdit) {
      query += `${item},`;
    }
    query += `interviewer)VALUES(`;
    for (const item of keysEdit) {
      query += `"${body[item]}",`;
    }
    query += `"${user}")`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        EIConnection.query(query, (err, rows) => {
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
  static changeStatusExitType(status, id) {
    const query = `UPDATE exitType SET active=${status} WHERE id ="${id}"`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        EIConnection.query(query, (err, rows) => {
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
  static changeStatusExitReason(status, id) {
    const query = `UPDATE exitReason SET active=${status} WHERE id =${id}`;
    return new Promise((resolve, reject) => {
      try {
        EIConnection.query(query, (err, rows) => {
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
  static insertExitType(reason, user) {
    const query = `INSERT INTO exitType(exitType,active,createdBy) VALUES ("${reason}",1,"${user}")`;
    return new Promise((resolve, reject) => {
      try {
        EIConnection.query(query, (err, rows) => {
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
  static insertExitReason(reason, user) {
    const query = `INSERT INTO exitReason(exitReason,active,createdBy) VALUES ("${reason}",1,"${user}")`;
    return new Promise((resolve, reject) => {
      try {
        EIConnection.query(query, (err, rows) => {
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
  static getDataChartCountry(year) {
    const query = `SELECT  countries.country, COUNT(idInterview) as amount 
    FROM interview 
    INNER JOIN countries ON countries.id = interview.country  
    WHERE date LIKE "%${year}%"
    GROUP BY country
    ORDER BY COUNT(idInterview) DESC`;
    return new Promise((resolve, reject) => {
      try {
        EIConnection.query(query, (err, rows) => {
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
  static getDataChartExitType(year) {
    return new Promise((resolve, reject) => {
      try {
        EIConnection.query(
          `CALL exitInterview.getDataChartExitType(${year});`,
          (err, rows) => {
            if (err) {
              console.log(err);
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
  static getDataChatExitReasons(year) {
    return new Promise((resolve, reject) => {
      try {
        EIConnection.query(
          `CALL exitInterview.getDataChartExitReasons(${year});`,
          (err, rows) => {
            if (err) {
              console.log(err);
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
  static getDataChartWords() {
    const query = `
    SELECT  GROUP_CONCAT(CONCAT(REPLACE(REPLACE(comment,".",""),",","" )) SEPARATOR ' ') as
    text FROM interview`;
    return new Promise((resolve, reject) => {
      try {
        EIConnection.query(query, (err, rows) => {
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
  static deleteDraftInterview(id) {
    const query = `DELETE FROM draftInterview WHERE idInterview = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        EIConnection.query(query, (err, rows) => {
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
  static updateDraftInterview(bdy) {
    const query = `UPDATE draftInterview SET exitType=${bdy.exitTypeId},commentHC ="${bdy.commentHC}", companyType = ${bdy.companyTypeId},
    country=${bdy.countriesData},collaboratorName="${bdy.collaboratorName}",immediateBoss="${bdy.immediateBoss}",department="${bdy.department}",interviewStatus="${bdy.interviewStatusId}",
    timeWorked="${bdy.timeWorked}",specify="${bdy.specify}",goBackGBM="${bdy.goBackGBM}",comment="${bdy.comment}", benefitsJob="${bdy.benefitsJob}"
    ,doNotValueGBM="${bdy.doNotValueGBM}",interviewer="${bdy.interviewer}",rehirable="${bdy.rehirable}" WHERE idInterview = "${bdy.idInterview}"`;
    console.log(query);

    return new Promise((resolve, reject) => {
      try {
        EIConnection.query(query, (err, rows) => {
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
  static updateInterview(bdy) {
    const query = `UPDATE interview SET exitType=${bdy.exitTypeId},commentHC ="${bdy.commentHC}", companyType =${bdy.companyTypeId},
    country=${bdy.country},collaboratorName="${bdy.collaboratorName}",immediateBoss="${bdy.immediateBoss}",department="${bdy.department}",
    timeWorked="${bdy.timeWorked}",specify="${bdy.specify}",goBackGBM="${bdy.goBackGBM}",comment="${bdy.comment}", benefitsJob="${bdy.benefitsJob}"
    ,doNotValueGBM="${bdy.doNotValueGBM}",interviewer="${bdy.interviewer}",rehirable="${bdy.rehirable}" WHERE idInterview = "${bdy.id}"`;
    console.log(query);

    return new Promise((resolve, reject) => {
      try {
        EIConnection.query(query, (err, rows) => {
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
  static getInfoByUser(user) {
    const query = `SELECT name as collaboratorName,department,manager as immediateBoss,UserID as idCollaborator,startDate, endDate FROM digital_sign WHERE user = "${user}"`;
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
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
  //tipo de salida draft interview
  static getExitReasonByUserDraft(id) {
    const query = `
    SELECT *
    FROM exitReasonDraftInterview
    WHERE draftInterview = "${id}"`;
    return new Promise((resolve, reject) => {
      try {
        EIConnection.query(query, (err, rows) => {
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
  static insertExitReasonByUserDraft(idInterview, exitReason) {
    const query = `INSERT INTO exitReasonDraftInterview( draftInterview,exitReason) VALUES ("${idInterview}","${exitReason}")`;
    return new Promise((resolve, reject) => {
      try {
        EIConnection.query(query, (err, rows) => {
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
  static deleteExitReasonByUserDraft(id) {
    const query = `DELETE FROM exitReasonDraftInterview WHERE draftInterview = "${id}"`;
    return new Promise((resolve, reject) => {
      try {
        EIConnection.query(query, (err, rows) => {
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
  //tipo de salida interview
  static getExitReasonByUserInterview(id) {
    const query = `
    SELECT *
    FROM exitReasonInterview
    WHERE interview = "${id}"`;
    return new Promise((resolve, reject) => {
      try {
        EIConnection.query(query, (err, rows) => {
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
  static insertExitReasonByUserInterview(user, exitReason) {
    const query = `INSERT INTO exitReasonInterview( interview,exitReason) VALUES ("${user}","${exitReason}")`;
    return new Promise((resolve, reject) => {
      try {
        EIConnection.query(query, (err, rows) => {
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
  static deleteExitReasonByUserInterview(id) {
    const query = `DELETE FROM exitReasonInterview WHERE interview = "${id}"`;
    return new Promise((resolve, reject) => {
      try {
        EIConnection.query(query, (err, rows) => {
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
  static interviewIsRepeat(id) {
    const query = `
    SELECT *
    FROM interview
    WHERE idCollaborator = "${id}"`;
    return new Promise((resolve, reject) => {
      try {
        EIConnection.query(query, (err, rows) => {
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
  static draftInterviewIsRepeat(id) {
    const query = `
    SELECT *
    FROM draftInterview
    WHERE idCollaborator = "${id}"`;
    return new Promise((resolve, reject) => {
      try {
        EIConnection.query(query, (err, rows) => {
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
