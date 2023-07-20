/* eslint-disable max-lines */
/* eslint-disable max-params */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
import moment from "moment";
import {
  connectionNP,
  connectionAccessPermissions,
  connectionMIS,
} from "../../db/connection";

const zfill = (number, width) => {
  const numberOutput = Math.abs(number); /* Valor absoluto del número */
  const { length } = number.toString(); /* Largo del número */
  const zero = "0"; /* String de cero */

  if (width <= length) {
    if (number < 0) {
      return `-${numberOutput.toString()}`;
    } else {
      return numberOutput.toString();
    }
  } else {
    if (number < 0) {
      return `-${zero.repeat(width - length)}${numberOutput.toString()}`;
    } else {
      return zero.repeat(width - length) + numberOutput.toString();
    }
  }
};

export default class NewPositionDB {
  static getPositions() {
    const query = `
      SELECT
        new_position_db.Positions.id AS idPosition,
        new_position_db.Positions.name AS position,
        new_position_db.Positions.insNumber,
        new_position_db.Positions.protection,
        new_position_db.Positions.localRegionalType
      FROM
      new_position_db.Positions
          WHERE new_position_db.Positions.active = 1
            ORDER BY new_position_db.Positions.name ASC`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getPositionsById(id) {
    const query = `
      SELECT
        new_position_db.Positions.id AS idPosition,
        new_position_db.Positions.name AS position,
        new_position_db.Positions.insNumber,
        new_position_db.Positions.protection,
        new_position_db.Positions.localRegionalType
      FROM
      new_position_db.Positions
          WHERE new_position_db.Positions.active = 1 AND new_position_db.Positions.id = ${id}
            ORDER BY new_position_db.Positions.name ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getPositionType() {
    const query = `
    SELECT
      new_position_db.PositionType.name AS positionType,
      new_position_db.PositionType.id as idPositionType
    FROM
      new_position_db.PositionType
    WHERE new_position_db.PositionType.active = 1
      ORDER BY new_position_db.PositionType.name ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCareerLevel() {
    const query = `
    SELECT
      new_position_db.CareerLevel.name AS careerLevel,
      new_position_db.CareerLevel.id AS idCareerLevel,
      new_position_db.CareerLevel.key
    FROM
      new_position_db.CareerLevel
    WHERE new_position_db.CareerLevel.active = 1
      ORDER BY new_position_db.CareerLevel.id ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCountrys() {
    const query = `
    SELECT
      new_position_db.Country.name AS country,
      new_position_db.Country.id as idCountry
    FROM
      new_position_db.Country
    WHERE new_position_db.Country.active = 1
      ORDER BY new_position_db.Country.name ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getRequestType() {
    const query = `
    SELECT
      new_position_db.RequestType.name AS requestType,
      new_position_db.RequestType.id as idRequestType
    FROM
      new_position_db.RequestType
    WHERE new_position_db.RequestType.active = 1
      ORDER BY new_position_db.RequestType.name ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCountryById(id) {
    const query = `
      SELECT
        new_position_db.Country.key,
        new_position_db.Country.id as idCountry
      FROM
        new_position_db.Country
      WHERE new_position_db.Country.id = ${id};
    `;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getBudgetedResource() {
    const query = `
      SELECT
        new_position_db.BudgetedResource.name AS budgetedResource,
        new_position_db.BudgetedResource.id as idBudgetedResource
      FROM
        new_position_db.BudgetedResource
      WHERE new_position_db.BudgetedResource.active = 1
        ORDER BY new_position_db.BudgetedResource.name ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getEmployeeSubGroup() {
    const query = `
      SELECT
        new_position_db.EmployeeSubGroup.name AS employeeSubGroup,
        new_position_db.EmployeeSubGroup.id as idEmployeeSubGroup,
        new_position_db.EmployeeSubGroup.type
      FROM
        new_position_db.EmployeeSubGroup
      WHERE new_position_db.EmployeeSubGroup.active = 1
        ORDER BY new_position_db.EmployeeSubGroup.name ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllGeneralData() {
    const query = `CALL new_position_db.GetAllGeneralData();`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllGeneralDataByPosition(idPosition, keyCountryy) {
    const query = `CALL new_position_db.GetAllGeneralDataByPosition(${idPosition}, '${keyCountryy}');`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllGeneralDataUpdate(
    careerLevel,
    orgUnit,
    ceco,
    personalArea,
    position
  ) {
    const query = `CALL new_position_db.GetAllGeneralDataUpdate('${careerLevel}','${orgUnit}','${ceco}','${personalArea}', '${position}')`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createdUnplannedPosition(values) {
    const {
      insNumber,
      idPosition,
      idCountry,
      idPositionType,
      idRequestType,
      idCareerLevel,
      userManager,
      changeRequestDate,
      idOrganizacionalUnit,
      idCeco,
      idPersonalArea,
      localRegionalType,
      haveEPM,
      productivity,
      protection,
      idBussinessLine,
      idAccess,
      idDirection,
      idBudgetedResource,
      isManager,
      fixed,
      variable,
      // spendTypeCost,
      fixedPercent,
      idEmployeeSubGroup,
      idPersonalBranch,
      commentary,
      createdBy,
    } = values;
    const variablePercent = zfill("020" - fixedPercent, 3);
    const query = `CALL new_position_db.CreateUnplannedPosition(${userManager}, '${moment(
      changeRequestDate
    ).format(
      "YYYY-MM-DD"
    )}', ${localRegionalType}, ${haveEPM}, ${productivity}, ${protection}, ${isManager}, ${fixed}, ${variable}, ${fixed}, ${fixedPercent}, ${variablePercent}, ${insNumber}, '${
      commentary ? commentary : null
    }', ${idPosition}, ${idCountry}, ${idPositionType}, ${idRequestType}, ${idCareerLevel}, ${idOrganizacionalUnit}, ${idCeco}, ${idBussinessLine}, ${idPersonalArea}, ${idAccess}, ${idDirection}, ${idBudgetedResource}, ${idEmployeeSubGroup}, ${idPersonalBranch}, '${createdBy.toLowerCase()}', @idCreated);`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getKeysUnplannedPosition(values) {
    const {
      insNumber,
      idPosition,
      idCountry,
      idPositionType,
      idRequestType,
      idCareerLevel,
      idOrganizacionalUnit,
      idCeco,
      idPersonalArea,
      idBussinessLine,
      idAccess,
      idDirection,
      idBudgetedResource,
      idEmployeeSubGroup,
      idPersonalBranch,
    } = values;
    let query;
    if (insNumber !== 0) {
      query = `CALL new_position_db.GetKeysNotPlannedPositionWithINS(${insNumber}, ${idPosition}, ${idCountry}, ${idPositionType}, ${idRequestType}, ${idCareerLevel}, ${idOrganizacionalUnit} ,${idCeco}, ${idPersonalArea}, ${idBussinessLine}, ${idAccess}, ${idDirection}, ${idBudgetedResource}, ${idEmployeeSubGroup}, ${idPersonalBranch})`;
    } else {
      query = `CALL new_position_db.GetKeysNotPlannedPosition(${idPosition}, ${idCountry}, ${idPositionType}, ${idRequestType}, ${idCareerLevel}, ${idOrganizacionalUnit} ,${idCeco}, ${idPersonalArea}, ${idBussinessLine}, ${idAccess}, ${idDirection}, ${idBudgetedResource}, ${idEmployeeSubGroup}, ${idPersonalBranch})`;
    }
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static insertFileUnplanned(idPosition, name, file) {
    const query = `CALL new_position_db.CreatedFileByUnplanned(${idPosition}, '${name}', '${file}', @idFileUnplanned)`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createdStaffPosition(values) {
    const {
      idCeco,
      haveEPM,
      isManager,
      localRegionalType,
      idCareerLevel,
      idOrgUnit,
      fixedPercent,
      keyCountry,
      idPersonalArea,
      idPositionManager,
      idPositionName,
      idPositionUser,
      user,
      productivity,
      changeRequestDate,
      commentary,
      createdBy,
    } = values;
    const variablePercent = zfill("020" - fixedPercent, 3);
    const query = `CALL new_position_db.CreateStaffPosition(${idPositionUser},${user},'${moment(
      changeRequestDate
    ).format(
      "YYYY-MM-DD"
    )}',${idPositionManager},${haveEPM},${isManager},${productivity},${localRegionalType},${fixedPercent},${variablePercent},'${keyCountry}','${
      commentary ? commentary : null
    }',${idPositionName},${idCareerLevel},${idOrgUnit},${idCeco},${idPersonalArea}, '${createdBy.toLowerCase()}', @idCreated)`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getNamesUpdatePosition(values) {
    const {
      idPositionName,
      idCareerLevel,
      idOrgUnit,
      idCeco,
      idPersonalArea,
      fixedPercent,
    } = values;
    const variablePercent =
      fixedPercent === "020" ? "020" : zfill("020" - fixedPercent, 3);
    const query = `CALL new_position_db.GetKeysUpdatedPosition(${idPositionName}, ${idCareerLevel}, ${idOrgUnit}, ${idCeco}, ${idPersonalArea}, ${fixedPercent}, ${variablePercent});`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getKeysUpdatePosition(values) {
    const {
      idPositionName,
      idCareerLevel,
      idOrgUnit,
      idCeco,
      idPersonalArea,
      fixedPercent,
    } = values;
    const variablePercent =
      fixedPercent === "020" ? "000" : zfill("020" - fixedPercent, 3);
    const query = `CALL new_position_db.GetKeysUpdateVacantPosition(${idPositionName}, ${idCareerLevel}, ${idOrgUnit}, ${idCeco}, ${idPersonalArea}, ${fixedPercent}, ${variablePercent});`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getKeysUpdateVacantPosition(values) {
    const [
      {
        fk_idPosition,
        fk_idCareerLevel,
        fk_idOrganizationalUnit,
        fk_idCeco,
        fk_idPersonalArea,
        fixedPercent,
        variablePercent,
      },
    ] = values;
    const query = `CALL new_position_db.GetKeysUpdateVacantPosition(${fk_idPosition}, ${fk_idCareerLevel}, ${fk_idOrganizationalUnit}, ${fk_idCeco}, ${fk_idPersonalArea}, ${fixedPercent}, ${variablePercent});`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static insertFileStaff(idPosition, name, file) {
    const query = `CALL new_position_db.CreatedFileByStaff(${idPosition}, '${name}', '${file}', @idFileStaff)`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createdVacantPosition(values) {
    const {
      idCeco,
      haveEPM,
      isManager,
      localRegionalType,
      idCareerLevel,
      idOrgUnit,
      fixedPercent,
      keyCountry,
      reasonForChanges,
      idPersonalArea,
      idPositionManager,
      idPositionName,
      idPositionUser,
      productivity,
      changeRequestDate,
      createdBy,
    } = values;
    const variablePercent = zfill("020" - fixedPercent, 3);
    const query = `CALL new_position_db.CreateVacantPosition(${idPositionUser}, '${moment(
      changeRequestDate
    ).format(
      "YYYY-MM-DD"
    )}',${idPositionManager},${haveEPM},${isManager},${productivity},${localRegionalType},${fixedPercent},${variablePercent},'${keyCountry}', '${reasonForChanges}', ${idPositionName},${idCareerLevel},${idOrgUnit}, ${idCeco}, ${idPersonalArea}, '${createdBy.toLowerCase()}', @idCreated)`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static deleteOrgUnitPosition(idPosition, idOrgUnit) {
    const query = `DELETE FROM new_position_db.OrganizationalUnitPosition WHERE fk_idPosition = ${idPosition} AND fk_idOrganizationalUnit = ${idOrgUnit};`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static insertOrgUnitPosition(idPosition, idOrgUnit) {
    const query = `INSERT INTO new_position_db.OrganizationalUnitPosition (fk_idPosition, fk_idOrganizationalUnit) VALUES (${idPosition}, ${idOrgUnit});`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static deleteCecoPosition(idPosition, idCeco) {
    const query = `DELETE FROM new_position_db.CecoPosition WHERE fk_idPosition = ${idPosition} AND fk_idCeco = ${idCeco};`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static insertCecoPosition(idPosition, idCeco) {
    const query = `INSERT INTO new_position_db.CecoPosition (fk_idPosition, fk_idCeco) VALUES (${idPosition}, ${idCeco});`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static deletePersAreaPosition(idPosition, idPersonalArea) {
    const query = `DELETE FROM new_position_db.PersonalAreaPosition WHERE fk_idPosition = ${idPosition} AND fk_idPersonalArea = ${idPersonalArea};`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static insertPersAreaPosition(idPosition, idPersonalArea) {
    const query = `INSERT INTO new_position_db.PersonalAreaPosition (fk_idPosition, fk_idPersonalArea) VALUES (${idPosition}, ${idPersonalArea});`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static deleteDirectionPosition(idPosition, idDirection) {
    const query = `DELETE FROM new_position_db.DirectionPosition WHERE fk_idPosition = ${idPosition} AND fk_idDirection = ${idDirection};`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static insertDirectionPosition(idPosition, idDirection) {
    const query = `INSERT INTO new_position_db.DirectionPosition (fk_idPosition, fk_idDirection) VALUES (${idPosition}, ${idDirection});`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static deleteBussinessLinePosition(idPosition, idBussinessLine) {
    const query = `DELETE FROM new_position_db.BussinessLinePosition WHERE fk_idPosition = ${idPosition} AND fk_idBussinessLine = ${idBussinessLine};`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static insertBussinessLinePosition(idPosition, idBussinessLine) {
    const query = `INSERT INTO new_position_db.BussinessLinePosition (fk_idPosition, fk_idBussinessLine) VALUES (${idPosition}, ${idBussinessLine});`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static deleteAccessPosition(idPosition, idAccess) {
    const query = `DELETE FROM new_position_db.AccessPosition WHERE fk_idPosition = ${idPosition} AND fk_idAccess = ${idAccess};`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static insertAccessPosition(idPosition, idAccess) {
    const query = `INSERT INTO new_position_db.AccessPosition (fk_idPosition, fk_idAccess) VALUES (${idPosition}, ${idAccess});`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getTotalPositionsCreated(query) {
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getTotalYearNotPlannedCreated(date) {
    const query = `
      SELECT
        MONTH(np.createdAt) AS month,
        SUM(CASE WHEN np.active = 1 THEN 1 END) AS count
      FROM
        new_position_db.NotPlannedPosition np
      WHERE
        (YEAR(np.createdAt) = '${date}')
      GROUP BY
        MONTH(np.createdAt)
      ORDER BY
        MONTH(np.createdAt) ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getTotalYearStaffCreated(date) {
    const query = `
      SELECT
        MONTH(np.createdAt) AS month,
        SUM(CASE WHEN np.active = 1 THEN 1 END) AS count
      FROM
        new_position_db.StaffPosition np
      WHERE
        (YEAR(np.createdAt) = '${date}')
      GROUP BY
        MONTH(np.createdAt)
      ORDER BY
        MONTH(np.createdAt) ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getTotalYearVacantCreated(date) {
    const query = `
      SELECT
        MONTH(np.createdAt) AS month,
        SUM(CASE WHEN np.active = 1 THEN 1 END) AS count
      FROM
        new_position_db.VacantPosition np
      WHERE
        (YEAR(np.createdAt) = '${date}')
      GROUP BY
        MONTH(np.createdAt)
      ORDER BY
        MONTH(np.createdAt) ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getTotalYearNewCecoCreated(date) {
    const query = `
      SELECT
        MONTH(np.createdAt) AS month,
        SUM(CASE WHEN np.active = 1 THEN 1 END) AS count
      FROM
        new_position_db.NewCecoPosition np
      WHERE
        (YEAR(np.createdAt) = '${date}')
      GROUP BY
        MONTH(np.createdAt)
      ORDER BY
        MONTH(np.createdAt) ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getTotalYearNotPlannedCreatedByUser(date, user) {
    const query = `
      SELECT
        MONTH(np.createdAt) AS month,
        SUM(CASE WHEN np.active = 1 THEN 1 END) AS count
      FROM
        new_position_db.NotPlannedPosition np
      WHERE
        createdBy = '${user}'
      AND
        (YEAR(np.createdAt) = '${date}')
      GROUP BY
        MONTH(np.createdAt)
      ORDER BY
        MONTH(np.createdAt) ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getTotalYearStaffCreatedByUser(date, user) {
    const query = `
      SELECT
        MONTH(np.createdAt) AS month,
        SUM(CASE WHEN np.active = 1 THEN 1 END) AS count
      FROM
        new_position_db.StaffPosition np
      WHERE
        createdBy = '${user}'
      AND
        (YEAR(np.createdAt) = '${date}')
      GROUP BY
        MONTH(np.createdAt)
      ORDER BY
        MONTH(np.createdAt) ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getTotalYearVacantCreatedByUser(date, user) {
    const query = `
      SELECT
        MONTH(np.createdAt) AS month,
        SUM(CASE WHEN np.active = 1 THEN 1 END) AS count
      FROM
        new_position_db.VacantPosition np
      WHERE
        createdBy = '${user}'
      AND
        (YEAR(np.createdAt) = '${date}')
      GROUP BY
        MONTH(np.createdAt)
      ORDER BY
        MONTH(np.createdAt) ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getTotalYearNewCecoCreatedbyUser(date, user) {
    const query = `
      SELECT
        MONTH(np.createdAt) AS month,
        SUM(CASE WHEN np.active = 1 THEN 1 END) AS count
      FROM
        new_position_db.NewCecoPosition np
      WHERE
        createdBy = '${user}'
      AND
        (YEAR(np.createdAt) = '${date}')
      GROUP BY
        MONTH(np.createdAt)
      ORDER BY
        MONTH(np.createdAt) ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static deactivedNotPlannedPosition(id) {
    const query = `UPDATE new_position_db.NotPlannedPosition SET active = 0 WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static deactivedStaffPosition(id) {
    const query = `UPDATE new_position_db.StaffPosition SET active = 0 WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static deactivedVacantPosition(id) {
    const query = `UPDATE new_position_db.VacantPosition SET active = 0 WHERE id = ${id}`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getUnapprovedVacantPositions() {
    const query = `
    SELECT
      np.id,
      positionNumber,
      DATE_FORMAT(changeRequestDate, "%d-%m-%Y") as changeRequestDate,
      managerPositionNumber,
      haveEPM,
      isManager,
      productivity,
      keyCountry,
      np.localRegionalType,
      fp.name as fixedPercent,
      pv.name as variablePercent,
      p.name as position,
      cl.name as careerLevel,
      ou.name as uniOrg,
      cc.name as ceco,
      pa.name as personalArea,
      createdBy,
      reasonForChanges,
      np.createdAt
    FROM
      VacantPosition as np
    INNER JOIN
      Positions as p
    ON
      np.fk_idPosition = p.id
    INNER JOIN
      CareerLevel as cl
    ON
      np.fk_idCareerLevel = cl.id
    INNER JOIN
      OrganizationalUnit as ou
    ON
      np.fk_idOrganizationalUnit = ou.id
    INNER JOIN
      Ceco as cc
    ON
      np.fk_idCeco = cc.id
    INNER JOIN
      PersonalArea as pa
    ON
      np.fk_idPersonalArea = pa.id
    INNER JOIN
      FixedPercent as fp
    ON
      np.fixedPercent = fp.key
    INNER JOIN
      VariablePercent as pv
    ON
      np.variablePercent = pv.key
    WHERE
      np.active = 1
    AND
      np.approved = 0
    ORDER BY
      np.createdAt DESC;
    `;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getKeysUnapprovedVacantPositionById(id) {
    const query = `
    SELECT
      vc.id,
      positionNumber,
      DATE_FORMAT(changeRequestDate, "%d-%m-%Y") as changeRequestDate,
      managerPositionNumber,
      haveEPM,
      isManager,
      productivity,
      vc.localRegionalType,
      fp.name as fixedPercent,
      pv.name as variablePercent,
      p.name as position,
      cl.name as careerLevel,
      ou.name as uniOrg,
      cc.name as ceco,
      pa.name as personalArea,
      vc.keyCountry,
      reasonForChanges,
      createdBy
    FROM
      VacantPosition as vc
    INNER JOIN
      Positions as p
    ON
      vc.fk_idPosition = p.id
    INNER JOIN
      CareerLevel as cl
    ON
      vc.fk_idCareerLevel = cl.id
    INNER JOIN
      OrganizationalUnit as ou
    ON
      vc.fk_idOrganizationalUnit = ou.id
    INNER JOIN
      Ceco as cc
    ON
      vc.fk_idCeco = cc.id
    INNER JOIN
      PersonalArea as pa
    ON
      vc.fk_idPersonalArea = pa.id
    INNER JOIN
      FixedPercent as fp
    ON
      vc.fixedPercent = fp.id
    INNER JOIN
      VariablePercent as pv
    ON
      vc.variablePercent = pv.id
    WHERE
      vc.active = 1
    AND
      vc.approved = 0
    AND
      vc.id = ${id};
    `;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getUnapprovedVacantPositionById(id) {
    const query = `
    SELECT
      *
    FROM
      VacantPosition as np
    WHERE
      np.active = 1
    AND
      np.approved = 0
    AND
      np.id = ${id};
    `;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static approvedVacantPosition(id, user, commentary) {
    const query = `UPDATE  VacantPosition SET approved = 1, commentary = '${commentary}', reviewedBy = '${user}' WHERE id = ${id};`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static unapprovedVacantPosition(id, user, commentary) {
    const query = `UPDATE  VacantPosition SET approved = 2, commentary = '${commentary}', reviewedBy = '${user}' WHERE id = ${id};`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getTotalRequestByUsers() {
    const query = `
    SELECT
      SUM(ta.count) AS requests,
      ta.username AS username
    FROM
    (
      SELECT
        COUNT(createdBy) AS COUNT,
        createdBy as username
      FROM
        NotPlannedPosition
      WHERE
        NotPlannedPosition.active = 1
      GROUP BY
        createdBy
      UNION ALL
        SELECT
            COUNT(createdBy) AS COUNT,
            createdBy as username
        FROM
            StaffPosition
        WHERE
          StaffPosition.active = 1
        GROUP BY
          createdBy
        UNION ALL
        SELECT
            COUNT(createdBy) AS COUNT,
          createdBy as username
        FROM
            VacantPosition
        WHERE
          VacantPosition.active = 1
        GROUP BY
          createdBy
          UNION ALL
          SELECT
              COUNT(createdBy) AS COUNT,
            createdBy as username
          FROM
              NewCecoPosition
          WHERE
            NewCecoPosition.active = 1
          GROUP BY
            createdBy) ta
    GROUP BY
      username;`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getTotalRequestByCountrys() {
    const query = `
    SELECT
      SUM(ta.count) AS requests,
      ta.country AS country
    FROM
    (
      SELECT
        COUNT(createdBy) AS COUNT,
        Country.key as country
      FROM
        NotPlannedPosition
      INNER JOIN
        Country
      ON
        NotPlannedPosition.fk_idCountry = Country.id
      WHERE
        NotPlannedPosition.active = 1
      GROUP BY
        Country.key
      UNION ALL
        SELECT
          COUNT(createdBy) AS COUNT,
          keyCountry as country
        FROM
          StaffPosition
        WHERE
          StaffPosition.active = 1
        GROUP BY
          keyCountry
        UNION ALL
          SELECT
            COUNT(createdBy) AS COUNT,
            keyCountry as country
          FROM
            VacantPosition
          WHERE
            VacantPosition.active = 1
          GROUP BY
            keyCountry
    ) ta
    GROUP BY
      country
    ORDER BY
      requests DESC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllUnplannedRequestByUser(user) {
    const query = `
    SELECT
      np.id,
      DATE_FORMAT(changeRequestDate, "%d-%m-%Y") as changeRequestDate,
      managerNumberPosition,
      haveEPM,
      isManager,
      productivity,
      np.protection,
      np.localRegionalType,
      isManager,
      fixed,
      variable,
      np.insNumber,
      np.commentary,
      fp.name as fixedPercent,
      pv.name as variablePercent,
      p.name as position,
      c.name as country,
      c.key as keyCountry,
      pt.name as positionType,
      rt.name as requestType,
      cl.name as careerLevel,
      ou.name as uniOrg,
      cc.name as ceco,
      pa.name as personalArea,
      bl.name as bussinessLine,
      a.name as access,
      d.name as direction,
      bg.name as budgetedResource,
      es.name as employeeSubGroup,
      pb.name as personalBranch,
      createdBy
    FROM
      NotPlannedPosition as np
    INNER JOIN
      Positions as p
    ON
      np.fk_idPosition = p.id
    INNER JOIN
      Country as c
    ON
      np.fk_idCountry = c.id
    INNER JOIN
      PositionType as pt
    ON
      np.fk_idPositionType = pt.id
    INNER JOIN
      RequestType as rt
    ON
      np.fk_idRequestType = rt.id
    INNER JOIN
      CareerLevel as cl
    ON
      np.fk_idCareerLevel = cl.id
    INNER JOIN
      OrganizationalUnit as ou
    ON
      np.fk_idOrganizationalUnit = ou.id
    INNER JOIN
      Ceco as cc
    ON
      np.fk_idCeco = cc.id
    INNER JOIN
      PersonalArea as pa
    ON
      np.fk_idPersonalArea = pa.id
    INNER JOIN
      BussinessLine as bl
    ON
      np.fk_idBussinessLine = bl.id
    INNER JOIN
      Access as a
    ON
      np.fk_idAccess = a.id
    INNER JOIN
      Direction as d
    ON
      np.fk_idDirection = d.id
    INNER JOIN
      BudgetedResource as bg
    ON
      np.fk_idBudgetedResource = bg.id
    INNER JOIN
      EmployeeSubGroup as es
    ON
      np.fk_idEmployeeSubGroup = es.id
    INNER JOIN
      PersonalBranch as pb
    ON
      np.fk_idPersonalBranch = pb.id
    INNER JOIN
      FixedPercent as fp
    ON
      np.fixedPercent = fp.id
    INNER JOIN
      VariablePercent as pv
    ON
      np.variablePercent = pv.id
    WHERE
      np.active = 1
    AND
      np.createdBy = '${user}';`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllStaffRequestByUser(user) {
    const query = `
    SELECT
      st.id,
      positionNumber,
      DATE_FORMAT(changeRequestDate, "%d-%m-%Y") as changeRequestDate,
      managerPositionNumber,
      haveEPM,
      isManager,
      productivity,
      keyCountry,
      commentary,
      st.localRegionalType,
      fp.name as fixedPercent,
      pv.name as variablePercent,
      p.name as position,
      cl.name as careerLevel,
      ou.name as uniOrg,
      cc.name as ceco,
      pa.name as personalArea,
      st.keyCountry,
      createdBy
    FROM
      StaffPosition as st
    INNER JOIN
      Positions as p
    ON
      st.fk_idPosition = p.id
    INNER JOIN
      CareerLevel as cl
    ON
      st.fk_idCareerLevel = cl.id
    INNER JOIN
      OrganizationalUnit as ou
    ON
      st.fk_idOrganizationalUnit = ou.id
    INNER JOIN
      Ceco as cc
    ON
      st.fk_idCeco = cc.id
    INNER JOIN
      PersonalArea as pa
    ON
      st.fk_idPersonalArea = pa.id
    INNER JOIN
      FixedPercent as fp
    ON
      st.fixedPercent = fp.id
    INNER JOIN
      VariablePercent as pv
    ON
      st.variablePercent = pv.id
    WHERE
      st.active = 1
    AND
      st.createdBy = '${user}';`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllVacantRequestByUser(user) {
    const query = `
    SELECT
    vc.id,
    positionNumber,
    DATE_FORMAT(changeRequestDate, "%d-%m-%Y") as changeRequestDate,
    managerPositionNumber,
    haveEPM,
    isManager,
    productivity,
    vc.localRegionalType,
    fp.name as fixedPercent,
    pv.name as variablePercent,
    p.name as position,
    cl.name as careerLevel,
    ou.name as uniOrg,
    cc.name as ceco,
    pa.name as personalArea,
    vc.keyCountry,
    vc.approved,
    reasonForChanges,
    commentary,
    createdBy,
    reviewedBy
  FROM
    VacantPosition as vc
  INNER JOIN
    Positions as p
  ON
    vc.fk_idPosition = p.id
  INNER JOIN
    CareerLevel as cl
  ON
    vc.fk_idCareerLevel = cl.id
  INNER JOIN
    OrganizationalUnit as ou
  ON
    vc.fk_idOrganizationalUnit = ou.id
  INNER JOIN
    Ceco as cc
  ON
    vc.fk_idCeco = cc.id
  INNER JOIN
    PersonalArea as pa
  ON
    vc.fk_idPersonalArea = pa.id
  INNER JOIN
    FixedPercent as fp
  ON
    vc.fixedPercent = fp.id
  INNER JOIN
    VariablePercent as pv
  ON
    vc.variablePercent = pv.id
  WHERE
    vc.active = 1
  AND
    vc.createdBy = '${user}'`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllNewCecoPositionRequestByUser(user) {
    const query = `
    SELECT nc.id, managerNumberPosition, p.name as positionNumber, ou.name as OrganizationalUnit, pa.name as personalArea, cc.name as actualCeco, cecoN, DATE_FORMAT(changeRequestDate, "%d-%m-%Y") as changeRequestDate, comments, createdBy FROM NewCecoPosition as nc INNER JOIN Positions as p ON nc.positionNumber = p.id INNER JOIN OrganizationalUnit as ou ON nc.organizationalUnit = ou.id INNER JOIN Ceco as cc ON nc.actualCeco = cc.id INNER JOIN PersonalArea as pa ON nc.personalArea = pa.id WHERE nc.active = 1 AND nc.createdBy =  '${user}'`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getVacantPositionById(id) {
    const query = `
    SELECT
      id,
      positionNumber as idPositionUser,
      userPositionNumber as idPositionUser,
      DATE_FORMAT(changeRequestDate, "%Y/%m/%d") as changeRequestDate,
      managerPositionNumber as idPositionManager,
      haveEPM,
      isManager,
      productivity,
      localRegionalType,
      fixedPercent,
      keyCountry,
      reasonForChanges,
      fk_idPosition as idPositionName,
      fk_idCareerLevel as idCareerLevel,
      fk_idOrganizationalUnit as idOrgUnit,
      fk_idCeco as idCeco,
      fk_idPersonalArea as idPersonalArea
    FROM
      VacantPosition AS np
    WHERE
      np.active = 1 AND np.id = ${id};
    `;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getDataByUpdatePosition() {
    const query = "CALL GetDataByUpdatePosition();";
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateVacantPosition(values) {
    const {
      id,
      changeRequestDate,
      fixedPercent,
      haveEPM,
      idCareerLevel,
      idCeco,
      idOrgUnit,
      idPersonalArea,
      idPositionManager,
      idPositionName,
      idPositionUser,
      isManager,
      localRegionalType,
      productivity,
      reasonForChanges,
    } = values;
    const variablePercent = zfill("020" - fixedPercent, 3);
    const query = `
    UPDATE
      VacantPosition
    SET
      approved = 0,
      positionNumber = '${idPositionUser}',
      userPositionNumber = '${idPositionUser}',
      changeRequestDate = '${moment(changeRequestDate).format("YYYY-MM-DD")}',
      managerPositionNumber = ${idPositionManager},
      haveEPM = '${haveEPM}',
      isManager = '${isManager}',
      productivity = '${productivity}',
      localRegionalType = '${localRegionalType}',
      fixedPercent = '${fixedPercent}',
      variablePercent = '${variablePercent}',
      reasonForChanges = '${reasonForChanges}',
      fk_idPosition = '${idPositionName}',
      fk_idCareerLevel = '${idCareerLevel}',
      fk_idOrganizationalUnit = '${idOrgUnit}',
      fk_idCeco = '${idCeco}',
      fk_idPersonalArea = '${idPersonalArea}'
    WHERE
      id = ${id};
    `;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getPositionsScalaryScale() {
    const query = `SELECT fk_idPosition as position, localRegionalScaleSalary as localRegionalType FROM PositionsSalaryScale WHERE active = 1;`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getPersonalBranchSalaryScale() {
    const query = `
    SELECT
      localRegionalSalaryScale,
      fk_idPosition as position,
      fk_idPersonalBranch as personalBranch
    FROM
        PersonalBranchSalaryScale`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getUsersWithAccess() {
    const query = `SELECT
        ds.id,
        ds.UserID,
        ds.user,
        ds.name
    FROM
        UserAccess u
    INNER JOIN Permissions p ON
        u.fk_Permissions = p.id AND p.name = 'General New Position'
    INNER JOIN MIS.digital_sign ds
    ON
        u.fk_SignID = ds.id
    WHERE
        u.active = 1
    ORDER BY
        ds.UserID;`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionAccessPermissions.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static selectIdUserByIdColab(id) {
    const query = `SELECT id AS idC from digital_sign where UserID = ${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static selectAccesByNewPosition() {
    const query = `SELECT id AS idP from Permissions where name = 'General New Position'`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionAccessPermissions.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createUsersWithAccess(idU, idP, createdBy) {
    const query = `INSERT INTO UserAccess (fk_SignID, fk_Permissions, createdBy) VALUES (${idU}, ${idP}, '${createdBy}')`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionAccessPermissions.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static deactivatedUsersWithAccess(id) {
    const query = `UPDATE UserAccess u INNER JOIN Permissions p ON u.fk_Permissions = p.id AND p.name = 'General New Position' SET u.active = 0 WHERE u.fk_SignID = ${id};`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionAccessPermissions.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createNewCecoPosition(values) {
    const {
      changeRequestDate,
      idCeco,
      idCecoN,
      idOrgUnit,
      idPersonalArea,
      idPositionManager,
      idPositionName,
      idColaborador,
      reasonForChanges,
      createdBy,
    } = values;
    const query = `CALL new_position_db.CreateCecoPosition('${idColaborador}','${idPositionManager}','${idPositionName}','${idOrgUnit}','${idPersonalArea}','${idCeco}', '${idCecoN}','${reasonForChanges}','${moment(
      changeRequestDate
    ).format("YYYY-MM-DD")}','${createdBy}', @idCreateda)`;
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
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

  static insertFileCeco(idPosition, name, file) {
    const query = `CALL new_position_db.CreatedFileByCeco(${idPosition}, '${name}', '${file}', @idFileCeco)`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionNP.query(query, (err, rows) => {
          console.log(err);
          console.log(rows);
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
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
