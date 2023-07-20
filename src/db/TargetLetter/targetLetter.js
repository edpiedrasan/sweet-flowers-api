/* eslint-disable no-nested-ternary */
/* eslint-disable max-params */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
import { connectionTL } from "../../db/connection";

export default class TargetLetterDB {

  static findHumanCapitalByPersSubArea(persSubArea, country, role) {
    const query = `SELECT
        HC.persArea,
        HC.country,
        DS.email
    FROM
        HumanCapitalRoles HC
    INNER JOIN
        MIS.digital_sign DS
    ON
        HC.fk_SignID = DS.id
    WHERE
        HC.active = 1 AND FIND_IN_SET('${persSubArea}', HC.persArea) AND FIND_IN_SET('${country}', HC.country) AND HC.role = '${role}';`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findHumanCapitalRegByPersSubArea(persSubArea, country, role) {
    const query = `SELECT
        HC.persArea,
        HC.country,
        DS.email
    FROM
        HumanCapitalRoles HC
    INNER JOIN
        MIS.digital_sign DS
    ON
        HC.fk_SignID = DS.id
    WHERE
        HC.active = 1 AND FIND_IN_SET('${persSubArea}', HC.persArea) AND FIND_IN_SET('${country}', HC.country) AND HC.role = '${role}';`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findHumanCapitalManagerById(id) {
    const query = `SELECT
        HC.persArea,
        HC.country
    FROM
        HumanCapitalRoles HC
    INNER JOIN MIS.digital_sign DS
    ON
        HC.fk_SignID = DS.id AND DS.UserID = ${id}
    WHERE
        HC.active = 1 AND HC.role = 'manager';`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findHumanCapitalRegionalManagerById(id) {
    const query = `SELECT
        HC.persArea,
        HC.country
    FROM
        HumanCapitalRoles HC
    INNER JOIN MIS.digital_sign DS
    ON
        HC.fk_SignID = DS.id AND DS.UserID = ${id}
    WHERE
        HC.active = 1 AND HC.role = 'regional';`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findHumanCapitalPayrrolById(id) {
    const query = `SELECT
        HC.persArea,
        HC.country
    FROM
        HumanCapitalRoles HC
    INNER JOIN MIS.digital_sign DS
    ON
        HC.fk_SignID = DS.id AND DS.UserID = ${id}
    WHERE
        HC.active = 1 AND HC.role = 'payrrol';`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findGeneralManagerById(id) {
    const query = `SELECT
        HC.persArea,
        HC.country
    FROM
        HumanCapitalRoles HC
    INNER JOIN MIS.digital_sign DS
    ON
        HC.fk_SignID = DS.id AND DS.UserID = ${id}
    WHERE
        HC.active = 1 AND HC.role = 'g_manager';`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findManagementServicesDirectorById(id) {
    const query = `SELECT
        HC.persArea,
        HC.country
    FROM
        HumanCapitalRoles HC
    INNER JOIN MIS.digital_sign DS
    ON
        HC.fk_SignID = DS.id AND DS.UserID = ${id}
    WHERE
        HC.active = 1 AND HC.role = 'm_services';`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findAllTargetsLetters(startDate, endDate, roles) {
    let personalAreas = '';
    let countries = '';
    roles.map((rol, key) => {
      personalAreas = personalAreas.concat(`${rol.persArea}${key < roles.length - 1 ? ',' : ''}`);
      return rol;
    });
    roles.map((rol, key) => {
      countries = countries.concat(`${rol.country}${key < roles.length - 1 ? ',' : ''}`);
      return rol;
    });
    const query = `SELECT
        id,
        requestNumber,
        requestDate,
        requestTime,
        createdBy,
        collaborator,
        position,
        startDatePosition,
        requestType,
        DATE_FORMAT(startLetter, "%Y/%m/%d") AS "startLetter",
        DATE_FORMAT(endLetter, "%Y/%m/%d") AS "endLetter",
        organizationalUnit,
        funtion,
        manager,
        departament,
        CASE
            WHEN epmCompensation = 0 THEN 'No'
            WHEN epmCompensation = 1 THEN 'Sí'
        END AS epmCompensation,
        persSubArea,
        startDate,
        comments,
        CASE
            WHEN flow = 'BOSS' THEN 'Jefatura'
            WHEN flow = 'HC' THEN 'HC Manager'
            WHEN flow = 'G_MANAGERS' THEN 'Gerente General'
            WHEN flow = 'M_SERVICES' THEN 'Management Services Director'
            WHEN flow = 'HCRM' THEN 'HC Regional Manager'
            WHEN flow = 'USER' THEN 'Colaborador'
            WHEN flow = 'Payrrol' THEN 'Finalizada'
        END AS flow,
        CASE
            WHEN flowStatus = 0 THEN 'Pendiente'
            WHEN flowStatus = 1 THEN 'Aprobada'
            WHEN flowStatus = 2 THEN 'Rechazada'
            WHEN flowStatus = 3 THEN 'Aplicada'
        END AS flowStatus,
        visibility,
        createdAt,
        updatedAt
    FROM
        TargetLetter
    WHERE
        createdAt BETWEEN '${startDate}' AND '${endDate}' AND
        FIND_IN_SET(persSubArea, '${personalAreas}') AND
        FIND_IN_SET(SUBSTRING(organizationalUnit, 1, 4), '${countries}')
    ORDER BY
        createdAt DESC;`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findAllTargetsLettersByCollaborator(id) {
    const query = `SELECT
        id,
        requestNumber,
        requestDate,
        requestTime,
        createdBy,
        collaborator,
        position,
        startDatePosition,
        requestType,
        DATE_FORMAT(startLetter, "%Y/%m/%d") AS "startLetter",
        DATE_FORMAT(endLetter, "%Y/%m/%d") AS "endLetter",
        organizationalUnit,
        funtion,
        manager,
        departament,
        epmCompensation,
        persSubArea,
        startDate,
        comments,
        CASE
          WHEN flow = 'HC' THEN 'HC Manager'
            WHEN flow = 'USER' THEN 'Colaborador'
            WHEN flow = 'Payrrol' THEN 'Finalizada'
        END AS flow,
        CASE
          WHEN flowStatus = 0 THEN 'Pendiente'
            WHEN flowStatus = 1 THEN 'Aprobada'
            WHEN flowStatus = 2 THEN 'Rechazada'
            WHEN flowStatus = 3 THEN 'Aplicada'
        END AS flowStatus,
        visibility,
        createdAt,
        updatedAt
    FROM
        TargetLetter
    WHERE
        collaborator LIKE '%${id}%' AND flowStatus = 3
    ORDER BY
        createdAt DESC;`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findTargetLetterById(id) {
    const query = `SELECT
        id,
        requestNumber,
        requestDate,
        requestTime,
        createdBy,
        collaborator,
        position,
        startDatePosition,
        requestType,
        DATE_FORMAT(startLetter, "%Y/%m/%d") AS "startLetter",
        DATE_FORMAT(endLetter, "%Y/%m/%d") AS "endLetter",
        organizationalUnit,
        funtion,
        manager,
        idHeadship,
        headship,
        departament,
        epmCompensation,
        persSubArea,
        startDate,
        comments,
        CASE
          WHEN flow = 'HC' THEN 'HC Manager'
            WHEN flow = 'USER' THEN 'Colaborador'
            WHEN flow = 'Payrrol' THEN 'Finalizada'
        END AS flow,
        CASE
          WHEN flowStatus = 0 THEN 'Pendiente'
            WHEN flowStatus = 1 THEN 'Aprobada'
            WHEN flowStatus = 2 THEN 'Rechazada'
            WHEN flowStatus = 3 THEN 'Aplicada'
        END AS flowStatus,
        visibility,
        DATE_FORMAT(createdAt, "%Y-%m-%d %T") AS "createdAt",
        updatedAt
    FROM TargetLetter TL WHERE TL.id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findTargetLettersPendingHCM(persSubArea, country) {
    const query = `SELECT
        *
    FROM
        TargetLetter TL
    WHERE
        TL.flow = 'HC' AND
        FIND_IN_SET(TL.persSubArea, '${persSubArea}') AND
        FIND_IN_SET(SUBSTRING(TL.organizationalUnit, 1, 4), '${country}') AND
        TL.visibility = 1`;
    // (TL.flow = 'HC' || TL.flow = 'USER' AND TL.flowStatus != 0) AND TL.persSubArea = '${persSubArea}' AND TL.visibility = 1`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findTargetLettersPendingHCRM(persSubArea, country) {
    const query = `SELECT
        *
    FROM
        TargetLetter TL
    WHERE
        TL.flow = 'HCRM' AND
        FIND_IN_SET(TL.persSubArea, '${persSubArea}') AND
        FIND_IN_SET(SUBSTRING(TL.organizationalUnit, 1, 4), '${country}') AND
        TL.visibility = 1`;
    // (TL.flow = 'HC' || TL.flow = 'USER' AND TL.flowStatus != 0) AND TL.persSubArea = '${persSubArea}' AND TL.visibility = 1`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findTargetLettersPendingGeneralManager(persSubArea, country) {
    const query = `SELECT
        *
    FROM
        TargetLetter TL
    WHERE
        TL.flow = 'G_MANAGERS' AND
        FIND_IN_SET(TL.persSubArea, '${persSubArea}') AND
        FIND_IN_SET(SUBSTRING(TL.organizationalUnit, 1, 4), '${country}') AND
        TL.visibility = 1`;
    // (TL.flow = 'HC' || TL.flow = 'USER' AND TL.flowStatus != 0) AND TL.persSubArea = '${persSubArea}' AND TL.visibility = 1`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findTargetLettersPendingManagementServicesDirector(persSubArea, country) {
    const query = `SELECT
        *
    FROM
        TargetLetter TL
    WHERE
        TL.flow = 'M_SERVICES' AND
        FIND_IN_SET(TL.persSubArea, '${persSubArea}') AND
        FIND_IN_SET(SUBSTRING(TL.organizationalUnit, 1, 4), '${country}') AND
        TL.visibility = 1`;
    // (TL.flow = 'HC' || TL.flow = 'USER' AND TL.flowStatus != 0) AND TL.persSubArea = '${persSubArea}' AND TL.visibility = 1`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findTargetLettersPendingCollaborator(id) {
    const query = `SELECT
        *
    FROM
        TargetLetter TL
    WHERE
      TL.flow = 'USER' AND TL.collaborator LIKE '%${id}%' AND TL.flowStatus = 0`;
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findTargetLettersPendingHeadShip(id) {
    const query = `SELECT
        *
    FROM
        TargetLetter TL
    WHERE
      TL.flow = 'BOSS' AND TL.idHeadship = ${id} AND TL.flowStatus = 0`;
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findTargetsTargetLetterById(id) {
    const query = `SELECT
        *
    FROM
        Targets T
    WHERE
        T.fk_idTargetLetter = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findTargetsTargetLetter(ids) {
    const query = `SELECT
        *
    FROM
        Targets T
    WHERE
        T.fk_idTargetLetter IN (${ids})`;
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findStatesTargetLetterById(id) {
    const query = `SELECT
        *
    FROM
        States S
    WHERE
        S.fk_idTargetLetter = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findStatesTargetLetter(ids) {
    const query = `SELECT
        *
    FROM
        States S
    WHERE
        S.fk_idTargetLetter IN (${ids})`;
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findAllDataDashboardTargetLetters(year, persAreas, countries) {
    const query = `CALL GETALLDATADASHBOARD('${persAreas}', '${countries}', '${year}');`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findGraphStatesDashboardTargetLetters(year, persAreas, countries) {
    const query = `CALL GETGRAPHSTATESDATADASHBOARD('${year}', '${persAreas}', '${countries}');`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findGraphFlowDashboardTargetLetters(year, persAreas, countries) {
    const query = `CALL GETGRAPHFLOWDATADASHBOARD('${year}', '${persAreas}', '${countries}');`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findAllYearsTargetLetters(persAreas, countries) {
    const query = `SELECT DISTINCT
        YEAR(updatedAt) AS year
    FROM
        TargetLetter
    WHERE
        FIND_IN_SET(persSubArea, '${persAreas}')
    AND
        FIND_IN_SET(SUBSTRING(organizationalUnit, 1, 4), '${countries}')
    ORDER BY
        YEAR(updatedAt) DESC;`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findAllCountriesTargetLetters(persAreas, countries) {
    const query = `SELECT DISTINCT
        SUBSTRING(organizationalUnit, 1, 4) AS country
    FROM
        TargetLetter
    WHERE
        FIND_IN_SET(persSubArea, '${persAreas}')
    AND
        FIND_IN_SET(SUBSTRING(organizationalUnit, 1, 4), '${countries}')
    ORDER BY SUBSTRING(organizationalUnit, 1, 4) ASC;`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createTargetLetter(values) {
    const {
      REQUESTNUMBER,
      REQUESTDATE,
      REQUESTTIME,
      CREATEDBY,
      COLLABORATOR,
      POSITION,
      STARTDATEPOSITION,
      REQUESTTYPE,
      STARTLETTER,
      ENDLETTER,
      ORGANIZATIONALUNIT,
      FUNTION,
      MANAGER,
      IDMANAGER2,
      USMANAGER2,
      DEPARTAMENT,
      EPMCOMPENSATION,
      PERSSUBAREA,
      STARTDATE,
      COMMENTS
    } = values;
    const query = `CALL CREATETARGETLETTER  ('${REQUESTNUMBER}', '${REQUESTDATE}', '${REQUESTTIME}', '${CREATEDBY}', '${COLLABORATOR}', '${POSITION}', '${STARTDATEPOSITION}', '${REQUESTTYPE}', '${STARTLETTER}', '${ENDLETTER}', '${ORGANIZATIONALUNIT}', '${FUNTION}', '${MANAGER}', ${IDMANAGER2}, '${USMANAGER2}', '${DEPARTAMENT}', ${EPMCOMPENSATION}, '${PERSSUBAREA}', '${STARTDATE}', '${COMMENTS.replace("'", "`")}', @idCreated);`;
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createTargetOfLetter(values, id) {
    const {
      TYPE,
      WEIGHT,
      QUOTA,
      SKEW,
      DESCRIPTION,
    } = values;
    const query = `INSERT INTO Targets (type, weight, quota, skew, description, fk_idTargetLetter) VALUES ('${TYPE}', '${WEIGHT}', '${QUOTA}', ${SKEW}, '${DESCRIPTION.replace("'", "`")}', ${id})`;
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateTargetLetter(id, action, desicion, type) {
    const query = `UPDATE TargetLetter TL SET ${action === "2"
      ? "TL.flowStatus = 2, TL.visibility = 0"
      : action === "1" && desicion === 'USER'
        ? "TL.flowStatus = 1"
        : `TL.flow = '${desicion === 'HC' && action === "1" ? (type === "02" || type === "06") ? "HCRM" : type === "04" ? "M_SERVICES" : 'USER' : (desicion === "HCRM" || desicion === "M_SERVICES") ? "USER" : 'HC'}'`
      } WHERE TL.id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createStateTargetLetter(id, description, action, desicion, comments, reviewedBy) {
    const query = `INSERT INTO States(description, state, desicion, comments, reviewedBy, fk_idTargetLetter) VALUES ('${description}', ${action}, '${desicion}', '${comments}', '${reviewedBy}', ${id});`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static deactivateTargetLetter(id) {
    const query = `UPDATE TargetLetter TL SET TL.visibility = 0 WHERE TL.id = ${id};`;
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static applyMeasureTargeLetter(ids) {
    const query = `UPDATE
        TargetLetter TL
    SET
        TL.flow = 'Payrrol',
        TL.flowStatus = 3
    WHERE
        TL.id IN (${ids.map((id) => id)});`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err} `);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static rejectTargeLetterById(id) {
    const query = `UPDATE
        TargetLetter TL
    SET
        TL.flow = 'Payrrol',
        TL.flowStatus = 2
    WHERE
        TL.id = ${id};`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionTL.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Target Letter DB: ${err} `);
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