import {
  MRDBConnection,
  connectionMIS,
  connectionAccessPermissions,
} from "../../db/connection";

export default class MRDB {
  //OTHERS

  static getUserSignByEmployeeID(id) {
    const query = `SELECT * FROM MIS.digital_sign as sign WHERE sign.UserID =${id} LIMIT 1`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          if (rows) {
            resolve(rows[0]);
          } else resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getUserSign(user) {
    const query = `SELECT * FROM MIS.digital_sign as sign WHERE sign.user ='${user}' LIMIT 1`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection MIS DB: ${err}`);
            reject(err);
          }
          if (rows) {
            resolve(rows[0]);
          } else resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getOffices() {
    const query = `SELECT * FROM offices`;
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Medical Records DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getOffice(id) {
    const query = `SELECT * FROM offices WHERE id = ${id} LIMIT 1`;
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Medical Records DB: ${err}`);
            reject(err);
          }
          if (rows) {
            resolve(rows[0]);
          } else resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  //MR
  static createRecord(SignID, OfficeID, address, bornDate, bloodType) {
    const query = `INSERT INTO medical_records(SignID, OfficeID, address, bornDate, bloodType) VALUES (${SignID}, ${OfficeID}, '${address}', '${bornDate}', '${bloodType}')`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve({
            id: rows.insertId,
            SignID,
            OfficeID,
            address,
            bornDate,
            bloodType,
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateRecord(id, OfficeID, address, bornDate, bloodType) {
    const query = `UPDATE medical_records SET OfficeID=${OfficeID}, address='${address}', bornDate='${bornDate}', bloodType='${bloodType}' WHERE id=${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve({ id, OfficeID, address, bornDate, bloodType });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getUserRecord(SignID) {
    const query = `SELECT id, SignID, OfficeID, address, DATE_FORMAT(bornDate, "%d/%m/%Y") AS bornDate, bloodType, createdAt, updatedAt FROM medical_records WHERE SignID = ${SignID} LIMIT 1`;
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          if (rows[0]) {
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

  static getRecord(id) {
    const query = `SELECT id, SignID, OfficeID, address, bornDate, bloodType, createdAt, updatedAt FROM medical_records WHERE id = ${id} LIMIT 1`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          if (rows[0]) {
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

  static getCountryRecords(teams) {
    const query = `SELECT mr.id, mr.SignID, mr.OfficeID, mr.address, mr.bornDate, mr.bloodType, mr.createdAt, mr.updatedAt, o.name AS officeName, o.subDivision, SIGN.user, SIGN.name, SIGN.UserID, SIGN.department, SIGN.manager, SIGN.country, SIGN.email, SIGN.position FROM medical_records AS mr LEFT JOIN MIS.digital_sign AS SIGN ON SIGN.id = mr.SignID INNER JOIN offices o ON mr.OfficeID = o.id WHERE FIND_IN_SET(o.name, '${teams}') ORDER BY mr.id;`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static hideNotifications(SignID) {
    const query = `INSERT INTO user_logs(SignID, type, value) VALUES (${SignID}, 'notifications', 1)`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static checkNotification(SignID) {
    const query = `SELECT * FROM user_logs WHERE SignID = ${SignID} AND type = 'notifications' LIMIT 1`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          if (rows.length > 0) {
            resolve(rows[0].value === "0" ? false : true);
          } else resolve(false);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // MEDICATIONS
  static createMedication(
    medication,
    startedDate,
    currently,
    dosis,
    sideEffects
  ) {
    const query = `INSERT INTO user_medications( medication, startedDate, currently, dosis, sideEffects) VALUES ('${medication}', '${startedDate}', ${currently}, '${dosis}', '${sideEffects}')`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve({
            id: rows.insertId,
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateMedication(
    id,
    medication,
    startedDate,
    currently,
    dosis,
    sideEffects
  ) {
    const query = `UPDATE user_medications SET medication='${medication}', startedDate='${startedDate}' ,currently=${currently}, dosis='${dosis}', sideEffects='${sideEffects}' WHERE id=${id}`;
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve({
            id,
            medication,
            startedDate,
            currently,
            dosis,
            sideEffects,
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getMedication(id) {
    const query = `SELECT * FROM user_medications WHERE id=${id} LIMIT 1`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          if (rows[0]) {
            resolve(rows[0]);
          } else resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static DeleteMedication(id) {
    const query = `DELETE FROM user_medications WHERE id = ${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  // CONTACTS
  static createContact(RecordID, name, phone, address, relation) {
    const query = `INSERT INTO user_contacts(RecordID, name, phone, address, relation) VALUES (${RecordID},'${name}','${phone}','${address}','${relation}')`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve({
            id: rows.insertId,
            RecordID,
            name,
            phone,
            address,
            relation,
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateContact(id, name, phone, address, relation) {
    const query = `UPDATE user_contacts SET name='${name}',phone='${phone}',address='${address}',relation='${relation}' WHERE id=${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve({ id, name, phone, address, relation });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getRecordContacts(RecordID) {
    const query = `SELECT * FROM user_contacts WHERE RecordID=${RecordID}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static getContact(id) {
    const query = `SELECT * FROM user_contacts WHERE id=${id} LIMIT 1`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          if (rows[0]) {
            resolve(rows[0]);
          } else resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static removeContact(id) {
    const query = `DELETE FROM user_contacts WHERE id=${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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
  // ALLERGIES
  static createAllergy(
    RecordID,
    name,
    startedDate,
    stillHappening,
    medicated,
    simptoms
  ) {
    const query = `INSERT INTO user_allergies(RecordID, name, startedDate, stillHappening, medicated, simptoms) VALUES (${RecordID}, '${name}','${startedDate}',${stillHappening},${medicated}, '${simptoms}')`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve({
            id: rows.insertId,
            RecordID,
            name,
            startedDate,
            stillHappening,
            medicated,
            simptoms,
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateAllergy(
    id,
    name,
    startedDate,
    stillHappening,
    medicated,
    simptoms
  ) {
    const query = `UPDATE user_allergies SET name='${name}', startedDate='${startedDate}', stillHappening=${stillHappening}, medicated=${medicated}, simptoms='${simptoms}' WHERE id=${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve({
            id,
            name,
            startedDate,
            stillHappening,
            medicated,
            simptoms,
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getRecordAllergies(RecordID) {
    const query = `SELECT id, RecordID, name, DATE_FORMAT(startedDate, "%d/%m/%Y") AS startedDate, stillHappening, medicated, simptoms, archived, createdAt, updatedAt FROM user_allergies WHERE RecordID=${RecordID} AND archived = 0`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static getAllergy(id) {
    const query = `SELECT * FROM user_allergies WHERE id=${id} LIMIT 1`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          if (rows[0]) {
            resolve(rows[0]);
          } else resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static removeAllergy(id) {
    const query = `UPDATE user_allergies SET archived=1 WHERE id=${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  // DISEASES
  static createDisease(
    RecordID,
    disease,
    startedDate,
    stillHappening,
    medicated,
    reason
  ) {
    const query = `INSERT INTO user_disease(RecordID, disease, startedDate, stillHappening, medicated, reason) VALUES (${RecordID},'${disease}','${startedDate}',${stillHappening},${medicated},'${reason}')`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve({
            id: rows.insertId,
            RecordID,
            disease,
            startedDate,
            stillHappening,
            medicated,
            reason,
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateDisease(
    id,
    RecordID,
    disease,
    startedDate,
    stillHappening,
    medicated,
    reason
  ) {
    const query = `UPDATE user_disease SET disease='${disease}', startedDate='${startedDate}', stillHappening=${stillHappening}, medicated=${medicated}, reason='${reason}' WHERE id=${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve({
            id,
            RecordID,
            disease,
            startedDate,
            stillHappening,
            reason,
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getRecordDiseases(RecordID) {
    const query = `SELECT id, RecordID, disease, DATE_FORMAT(startedDate, "%d/%m/%Y") AS startedDate, stillHappening, medicated, reason, archived, createdAt, updatedAt FROM user_disease WHERE RecordID=${RecordID} AND archived = 0 `;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static getDisease(id) {
    const query = `SELECT * FROM user_disease WHERE id=${id} LIMIT 1`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          if (rows[0]) {
            resolve(rows[0]);
          } else resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static removeDisease(id) {
    const query = `UPDATE user_disease SET archived=1 WHERE id=${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  // INTERVENTIONS

  static createIntervention(RecordID, reason, date, medicated, notes) {
    const query = `INSERT INTO user_interventions(RecordID, reason, date, medicated, notes) VALUES (${RecordID}, '${reason}','${date}',${medicated},'${notes}')`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve({
            id: rows.insertId,
            RecordID,
            reason,
            date,
            medicated,
            notes,
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateIntervention(id, RecordID, reason, date, medicated, notes) {
    const query = `UPDATE user_interventions SET reason='${reason}' ,date='${date}' ,medicated=${medicated}, notes='${notes}' WHERE id=${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve({
            id,
            RecordID,
            reason,
            date,
            medicated,
            notes,
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getRecordInterventions(RecordID) {
    const query = `SELECT id, RecordID, reason, DATE_FORMAT(date, "%d/%m/%Y") AS date, medicated, notes, archived, createdAt, updatedAt FROM user_interventions WHERE RecordID=${RecordID} AND archived = 0`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static getIntervention(id) {
    const query = `SELECT * FROM user_interventions WHERE id=${id} LIMIT 1`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          if (rows[0]) {
            resolve(rows[0]);
          } else resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static removeIntervention(id) {
    const query = `UPDATE user_interventions SET archived=1 WHERE id=${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  // OTHERS

  static createOther(RecordID, name, description, TypeID, date) {
    const query = `INSERT INTO user_medical_references(RecordID, name, description, TypeID, date) VALUES (${RecordID}, '${name}','${description}',${TypeID},'${date}')`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve({
            id: rows.insertId,
            RecordID,
            name,
            description,
            TypeID,
            date,
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateOther(id, name, description, TypeID, date) {
    const query = `UPDATE user_medical_references SET name='${name}' ,description='${description}', TypeID=${TypeID}, date='${date}' WHERE id=${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve({
            id,
            name,
            description,
            TypeID,
            date,
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getRecordOthers(RecordID) {
    const query = `SELECT ref.id, ref.RecordID, ref.name, ref.description, ref.TypeID, DATE_FORMAT(ref.date, "%d/%m/%Y") AS date, ref.aditionalInfo, type.name as typeName, type.description as typeDescription FROM user_medical_references as ref
    LEFT JOIN MR.user_medical_references_types AS type ON type.id = ref.TypeID
    WHERE ref.RecordID=${RecordID} AND ref.archived = 0`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static getOther(id) {
    const query = `SELECT * FROM user_medical_references WHERE id=${id} LIMIT 1`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          if (rows[0]) {
            resolve(rows[0]);
          } else resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static removeOther(id) {
    const query = `UPDATE user_medical_references SET archived=1 WHERE id=${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static getOtherTypes() {
    const query = `SELECT * FROM user_medical_references_types `;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  //ASIGN ALLERGY MEDICATION
  static AsignAllergyMedication(AllergyID, MedicationID) {
    const query = `INSERT INTO user_allergies_medications(AllergyID, MedicationID) VALUES (${AllergyID},${MedicationID})`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve({
            id: rows.insertId,
            AllergyID,
            MedicationID,
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static AsignedAllergyMedication(AllergyID) {
    const query = `SELECT * FROM user_allergies_medications WHERE AllergyID = ${AllergyID}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static DeleteAsignedAllergyMedication(AllergyID) {
    const query = `DELETE FROM user_allergies_medications WHERE AllergyID = ${AllergyID}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static DeleteAsignedAllergyMedicationID(id) {
    const query = `DELETE FROM user_allergies_medications WHERE MedicationID = ${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  //ASIGN DISEASE MEDICATION
  static AsignDiseaseMedication(DiseaseID, MedicationID) {
    const query = `INSERT INTO user_disease_medications(DiseaseID, MedicationID) VALUES (${DiseaseID},${MedicationID})`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve({
            id: rows.insertId,
            DiseaseID,
            MedicationID,
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static AsignedDiseaseMedication(DiseaseID) {
    const query = `SELECT * FROM user_disease_medications WHERE DiseaseID = ${DiseaseID}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static DeleteAsignedDiseaseMedication(DiseaseID) {
    const query = `DELETE FROM user_disease_medications WHERE DiseaseID = ${DiseaseID}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static DeleteAsignedDiseaseMedicationID(id) {
    const query = `DELETE FROM user_disease_medications WHERE  MedicationID = ${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  //ASIGN INTERVENTION MEDICATION
  static AsignInterventionMedication(InterventionID, MedicationID) {
    const query = `INSERT INTO user_interventions_medications(InterventionID, MedicationID) VALUES (${InterventionID},${MedicationID})`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve({
            id: rows.insertId,
            InterventionID,
            MedicationID,
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static AsignedInterventionMedication(InterventionID) {
    const query = `SELECT * FROM user_interventions_medications WHERE InterventionID = ${InterventionID}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static DeleteAsignedInterventionMedication(InterventionID) {
    const query = `DELETE FROM user_interventions_medications WHERE InterventionID = ${InterventionID}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static DeleteAsignedInterventionMedicationID(id) {
    const query = `DELETE FROM user_interventions_medications WHERE MedicationID = ${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static findAllYearsMedicalRecords(teams) {
    const query = `SELECT
        DISTINCT YEAR(mr.createdAt) as year
    FROM
        medical_records mr
    INNER JOIN
        offices o
    ON
        mr.OfficeID = o.id
    WHERE
        FIND_IN_SET(o.name, '${teams}');`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static findAllDataTransactions(teams) {
    const query = `CALL GETALLINFORMATIONCREATEDDASHBOARD('${teams}');`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static findAllDataGraphYear(year, teams) {
    const query = `CALL GETGRAPHDASHBOARD(${year}, '${teams}');`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static findAllPercentDataGraphYear(year, teams) {
    const query = `CALL GETPERCENTGRAPHDASHBOARD(${year}, '${teams}');`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static findAllVaccineDataGraphYear(year, teams) {
    const query = `CALL GETVACCINEGRAPHDASHBOARD(${year}, '${teams}');`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static findAllVaccineDataYear(year, teams) {
    const query = `SELECT
      DS.name AS 'Colaborador',
        DS.position AS 'Posición',
        DS.department AS 'Departamento',
      MR.bornDate AS 'Fecha Nacimiento',
        MR.bloodType AS 'Tipo Sangre',
        O.name AS 'Localidad',
        T.name AS 'Tipo Vacuna',
        UMR.name AS 'Nombre'
    FROM
      offices O
    LEFT JOIN
      medical_records MR ON
      O.id = MR.OfficeID
    INNER JOIN MIS.digital_sign DS ON
      MR.SignID = DS.id
    INNER JOIN user_medical_references UMR ON
        MR.id = UMR.RecordID AND UMR.archived = 0
    INNER JOIN user_medical_references_types T ON
      UMR.TypeID = T.id
    WHERE
      YEAR(MR.createdAt) = ${year}
    AND
      FIND_IN_SET(O.name, '${teams}');`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static findUserWithAccessRecords() {
    const query = `SELECT
        UA.id,
        DS.user,
        DS.name,
        DS.position,
        CASE WHEN SUBSTRING_INDEX(P.name, " ", -1) = 'REG' THEN 'Regional' ELSE SUBSTRING(P.name, 16, 50) END AS "location"
    FROM
        UserAccess UA
    INNER JOIN MIS.digital_sign DS
    ON
        UA.fk_SignID = DS.id
    INNER JOIN Permissions P ON
        UA.fk_Permissions = P.id
    WHERE
        P.name LIKE '%Medical Record%' AND P.name != 'Medical Record Admin'
    ORDER BY DS.user;`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionAccessPermissions.query(query, (err, rows) => {
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

  static findSignIDByUsername(username) {
    const query = `SELECT * FROM digital_sign WHERE user LIKE '${username}'`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
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

  static findLocationIDByLocationName(location) {
    const query = `SELECT * FROM Permissions WHERE name = 'Medical Record ${location}'`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionAccessPermissions.query(query, (err, rows) => {
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

  static createUserAccessRecord(userID, location, createdBy) {
    const query = `INSERT INTO UserAccess (fk_SignID, fk_Permissions, createdBy) VALUES (${userID}, ${location}, '${createdBy}');`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionAccessPermissions.query(query, (err, rows) => {
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

  static deleteUserAccess(id) {
    const query = `DELETE FROM UserAccess WHERE id = ${id};`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionAccessPermissions.query(query, (err, rows) => {
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

  //ATTACHMENTS
  static uploadAttachment(SignID, name, path, extension) {
    const query = `INSERT INTO medical_records_attachments(RecordID, filename, path, extension) VALUES (${SignID}, '${name}', '${path}', '${extension}')`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          resolve({
            id: rows.insertId,
          });
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAttachment(id) {
    const query = `SELECT * FROM medical_records_attachments WHERE id = ${id} LIMIT 1`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          if (rows) {
            resolve(rows[0]);
          } else resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getRecordAttachments(RecordID) {
    const query = `SELECT * FROM medical_records_attachments WHERE RecordID = ${RecordID}`;
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static getAttachmentOwner(id) {
    const query = `SELECT RecordID FROM medical_records_attachments WHERE id = ${id} LIMIT 1`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
          if (err) {
            reject(err);
          }
          if (rows) {
            resolve(rows[0]);
          } else resolve(null);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllRecordsDownloadAdmin(teams) {
    const query = `SELECT
        mr.id AS 'ID',
        mr.address AS 'Direccion',
        mr.bornDate AS 'Fecha Nacimiento',
        mr.bloodType AS 'Tipo de Sangre',
        mr.createdAt AS 'Fecha Creación',
        o.name AS 'Localidad',
        SIGN.user AS 'Usuario',
        SIGN.name AS 'Nombre',
        SIGN.UserID AS 'ID Colaborador',
        SIGN.department AS 'Departamento',
        SIGN.manager AS 'Manager',
        SIGN.country AS 'País',
        SIGN.email AS 'Correo',
        SIGN.position AS 'Posición',
        UA.name AS 'Alergia',
        UA.startedDate AS 'Fecha Inicio Alergia',
        CASE WHEN UA.stillHappening = 1 THEN 'Sí' ELSE 'No' END AS 'Sigue Pasando',
        CASE WHEN UA.medicated = 1 THEN 'Sí' ELSE 'No' END AS 'Medicado',
        UA.simptoms AS 'Sintoma',
        UD.disease AS 'Enfermedad',
        UD.startedDate AS 'Fecha Inicio Enfermedad',
        CASE WHEN UD.stillHappening = 1 THEN 'Sí' ELSE 'No' END AS 'Sigue Pasando',
        CASE WHEN UD.medicated = 1 THEN 'Sí' ELSE 'No' END AS 'Medicado',
        UD.reason AS 'Razón',
        UI.reason AS 'Intervensión Quirurgica',
        UI.date AS 'Fecha Intervensión',
        CASE WHEN UI.medicated = 1 THEN 'Sí' ELSE 'No' END AS 'Medicado',
        UI.notes AS 'Notas',
        umrt.name AS 'Tipo Vacuna',
        umr.name AS 'Casa Farmacéutica',
        umr.description AS 'Descripción',
        umr.date AS 'Fecha Vacuna'
      FROM
        medical_records AS mr
      LEFT JOIN
        MIS.digital_sign AS SIGN
      ON
        SIGN.id = mr.SignID
      INNER JOIN
        offices o
      ON
        mr.OfficeID = o.id
      LEFT JOIN
        user_allergies UA
      ON
        UA.RecordID = mr.id AND UA.archived = 0
      LEFT JOIN
        user_disease UD
      ON
        UD.RecordID = mr.id AND UD.archived = 0
      LEFT JOIN
        user_interventions UI
      ON
        UI.RecordID = mr.id AND UI.archived = 0
      LEFT JOIN
        user_medical_references umr
      ON
        umr.RecordID = mr.id AND umr.archived = 0
      LEFT JOIN
        user_medical_references_types umrt
      ON
        umr.TypeID = umrt.id
    WHERE
        FIND_IN_SET(o.name, '${teams}')
    ORDER BY
        mr.id;`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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

  static getAllAttachmentsDownloadAdmin(teams) {
    const query = `SELECT
        a.filename,
        a.path,
        SIGN.user
      FROM
        medical_records AS mr
      LEFT JOIN
        MIS.digital_sign AS SIGN
      ON
        SIGN.id = mr.SignID
      INNER JOIN
        medical_records_attachments a
      ON
        mr.id = a.RecordID
      INNER JOIN
        offices o
      ON
        mr.OfficeID = o.id
    WHERE
        FIND_IN_SET(o.name, '${teams}')
    ORDER BY
        mr.id;`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        MRDBConnection.query(query, (err, rows) => {
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
