/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
import { connectionCriticalParts } from "../connection";

export default class CriticalPartsDB {

  static getAllInformation() {
    const query = `CALL GETALLINFORMATION()`;
    return new Promise((resolve, reject) => {
      try {
        connectionCriticalParts.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Critical Parts DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllRequerimentsByUser(email) {
    const query = `CALL GetAllRequirementsByUser('${email}')`;
    return new Promise((resolve, reject) => {
      try {
        connectionCriticalParts.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Critical Parts DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getIbmEquipmentsByRequirement(opportunityNumber) {
    const query = `CALL GetIbmEquipmentsByRequirement('${opportunityNumber}')`;
    return new Promise((resolve, reject) => {
      try {
        connectionCriticalParts.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Critical Parts DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCiscoEquipmentsByRequirement(opportunityNumber) {
    const query = `CALL GetCiscoEquipmentByRequirement('${opportunityNumber}')`;
    return new Promise((resolve, reject) => {
      try {
        connectionCriticalParts.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Critical Parts DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createRequirementList(values, email) {
    const {
      opportunityNumber,
      customer,
      salesRep,
      requestedExecutive,
      amountOfEquipment,
      applicationNotes,
      amountOfEquipmentIn,
      amountOfEquipmentOut,
      localtionNotes,
      // equipmentDescription,
      typeSupport,
      typeSupportCisco,
      operatingSystemType,
      officeHours,
      responseTime,
      timeChangePart,
      validityService,
      wayPay,
      physicalLocation,
      equipmentServiceCenterOut,
      equipmentServiceCenterIn,
      amountMaintenance,
      scheduleMaintenance
    } = values;
    const query = `CALL CREATEREQUIREMENTLIST('${opportunityNumber}', '${customer}', '${salesRep}', '${requestedExecutive}', ${amountOfEquipment}, '${applicationNotes ? applicationNotes : 'N/A'}', ${amountOfEquipmentIn ? amountOfEquipmentIn : null}, ${amountOfEquipmentOut ? amountOfEquipmentOut : null}, '${localtionNotes ? localtionNotes : 'N/A'}', '${email}', ${typeSupport}, ${typeSupportCisco === "0" ? null : typeSupportCisco},  ${operatingSystemType}, ${officeHours}, ${responseTime}, ${timeChangePart}, ${validityService}, ${wayPay}, ${physicalLocation}, ${equipmentServiceCenterOut ? equipmentServiceCenterOut : null}, ${equipmentServiceCenterIn ? equipmentServiceCenterIn : null}, ${amountMaintenance}, ${scheduleMaintenance}, @p1);`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionCriticalParts.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Critical Parts DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createIbmEquipment(values) {
    const {
      country,
      typeModel,
      serial,
      platform,
      criticalParts,
      fk_idOfficeHours,
      fk_idTimeChangePart,
      fk_idValidityService,
      fk_idAutomaticRenewal,
      fk_idRequirementList
    } = values;
    const query = `CALL CreateIbmEquipmentList('${country}', '${typeModel}', '${serial}', '${platform}', ${criticalParts}, ${fk_idOfficeHours}, ${fk_idTimeChangePart}, ${fk_idValidityService}, ${fk_idAutomaticRenewal}, ${fk_idRequirementList}, @p1)`;
    return new Promise((resolve, reject) => {
      try {
        connectionCriticalParts.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Critical Parts DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createCiscoEquipment(values) {
    const {
      serial,
      productNumber,
      description,
      fk_idOfficeHours,
      fk_idCoverageLevel,
      fk_idValidityService,
      fk_idRequirementList
    } = values;
    const query = `CALL CreateCiscoEquipmentList('${serial}', '${productNumber}', '${description}', ${fk_idOfficeHours}, ${fk_idCoverageLevel}, ${fk_idValidityService}, ${fk_idRequirementList}, @p1)`;
    return new Promise((resolve, reject) => {
      try {
        connectionCriticalParts.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Critical Parts DB: ${err}`);
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