import { HHConnection } from "../connection";
import moment from "moment";

export default class hcmHiringDB {
  //funcion para extraer las solicitudes 
  static getData(roles, userCountry, user) {

    return new Promise((resolve, reject) => {
      try {
        let sqlString = `SELECT PB10Requests.*,
                DATE_FORMAT(PB10Requests.createdAt, '%d/%m/%Y %T') as cDate,
                DATE_FORMAT(PB10Requests.candidateAt, '%d/%m/%Y %T') as canDate,
                DATE_FORMAT(PB10Requests.finishAt, '%d/%m/%Y %T') as fDate,

                VacancyType.vacancyName,
                EmployeeGroup.eGroupName,
                EmployeeSubGroup.eSubGroupName,
                CountryApplication.countryName,
                StatusApplication.statusName,

                ( SELECT pAreaName FROM PersonalArea
                WHERE RIGHT(PersonalArea.pAreaCode,2) = RIGHT(PB10Requests.personalArea,2) ) as personalAreaName,

                ( SELECT subAreaName FROM SubArea
                  WHERE SubArea.subAreaCode = PB10Requests.subArea AND SubArea.countryCode = PB10Requests.country) as subAreaName

                from PB10Requests 
                INNER JOIN VacancyType on PB10Requests.vacancyType = VacancyType.vacancyCode
                INNER JOIN EmployeeGroup on PB10Requests.plazaType = EmployeeGroup.eGroupCode
                INNER JOIN EmployeeSubGroup on PB10Requests.positionType = EmployeeSubGroup.eSubGroupCode
                INNER JOIN CountryApplication on PB10Requests.country = CountryApplication.countryCode
                INNER JOIN StatusApplication on PB10Requests.status = StatusApplication.statusCode`;

        if (roles.some((row) => row.indexOf("HCM Hiring User") !== -1)) {
          sqlString += ` WHERE PB10Requests.createdBy = '${user}'`;
        }
        else if (roles.some((row) => row.indexOf("HCM Hiring Manager") !== -1)) {
          sqlString += ` WHERE PB10Requests.country = '${userCountry}'`;
        }

        sqlString +=
          " GROUP BY PB10Requests.id ORDER BY PB10Requests.id DESC LIMIT 2000";


        HHConnection.query(sqlString, (err, rows) => {
          if (err) {
            //console.log(`Error Conection HCM Hiring DB: ${err}`);
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
  static getCandidatePersonalInfo(id) {
    return new Promise((resolve, reject) => {
      const query =
        `SELECT
      CandidatePersonalData.*,
      DATE_FORMAT(CandidatePersonalData.birthDate, '%Y-%m-%d') as bDate,
      CivilStatus.civilStatusName,
      Gender.genderName,
      Nationality.nationalityName,
      (CASE 
        WHEN CandidatePersonalData.dispTravel = 1 THEN 'Sí'
        WHEN CandidatePersonalData.dispTravel = 2 THEN 'No'
      END) as 'dispTravelName',
      (CASE 
        WHEN CandidatePersonalData.dispRelocation = 1 THEN 'Sí'
        WHEN CandidatePersonalData.dispRelocation = 2 THEN 'No'
      END) as 'dispRelocationName',
      EntryAvailability.availabilityName,
      WageAspiration.aspirationName
      FROM CandidatePersonalData
      INNER JOIN CivilStatus on CandidatePersonalData.civilStatus = CivilStatus.civilStatusCode
      INNER JOIN Gender on CandidatePersonalData.gender = Gender.genderCode
      INNER JOIN Nationality on CandidatePersonalData.nationality = Nationality.nationalityCode
      INNER JOIN EntryAvailability on CandidatePersonalData.dispEntry = EntryAvailability.availabilityCode
      INNER JOIN WageAspiration on CandidatePersonalData.wageAspiration = WageAspiration.aspirationCode      
      WHERE CandidatePersonalData.id = ${id}
      GROUP BY CandidatePersonalData.id ORDER BY CandidatePersonalData.id`;
      console.log(query);
      try {
        HHConnection.query(query, (err, rows) => {
          if (err) {
            //console.log(`Error Conection HCM Hiring DB: ${err}`);
            reject(err);
          }
          resolve(rows);
          // resolve(JSON.stringify(rows));
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static getCandidateEducationInfo(id) {
    return new Promise((resolve, reject) => {
      //AcademicDegree.academicDegreeName,
      //INNER JOIN AcademicDegree on CandidateEducation.academicDegree = AcademicDegree.id
      const query = `SELECT
      CandidateEducation.*,
      DATE_FORMAT(CandidateEducation.graduationDate, '%Y-%m-%d') as gDate,
      AcademicTraining.academicName,
      EducationalInstitution.eduInstiName,
      (SELECT GROUP_CONCAT(AcademicDegree.academicDegreeName) FROM AcademicDegree
      WHERE AcademicDegree.id = CandidateEducation.academicDegree AND AcademicDegree.eduInstiCode = CandidateEducation.educationalInstitution) as academicDegreeName,
      NativeLanguage.natLangName,
      SecondLanguage.secLangName,
      DomainLevel.domainName
      FROM CandidateEducation
      INNER JOIN AcademicTraining on CandidateEducation.academicTraining = AcademicTraining.academicCode
      INNER JOIN EducationalInstitution on CandidateEducation.educationalInstitution = EducationalInstitution.eduInstiCode
  
      INNER JOIN NativeLanguage on CandidateEducation.nativeLang = NativeLanguage.natLangCode
      INNER JOIN SecondLanguage on CandidateEducation.secondLang = SecondLanguage.secLangCode
      INNER JOIN DomainLevel on CandidateEducation.domainLevel = DomainLevel.domainCode
      WHERE CandidateEducation.id = ${id}
      GROUP BY CandidateEducation.id ORDER BY CandidateEducation.id`;
      console.log(query);
      try {
        HHConnection.query(query, (err, rows) => {
          if (err) {
            //console.log(`Error Conection HCM Hiring DB: ${err}`);
            reject(err);
          }
          resolve(rows);
          // resolve(JSON.stringify(rows));
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static getCandidateExperienceInfo(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT 
      CandidateExperience.*,
      DATE_FORMAT(CandidateExperience.experienceStartDate, '%Y-%m-%d') as sDate,
      DATE_FORMAT(CandidateExperience.experienceFinDate, '%Y-%m-%d') as fDate,
      CountryCompany.countryName,
      LastEmployeePosition.positionName
      FROM CandidateExperience 
      INNER JOIN CountryCompany on CandidateExperience.companyCountry = CountryCompany.countryCode
      INNER JOIN LastEmployeePosition on CandidateExperience.companyJob = LastEmployeePosition.positionCode
      WHERE CandidateExperience.id = ${id}
      GROUP BY CandidateExperience.id ORDER BY CandidateExperience.id`;
      console.log(query);
      try {
        HHConnection.query(query, (err, rows) => {
          if (err) {
            //console.log(`Error Conection HCM Hiring DB: ${err}`);
            reject(err);
          }
          resolve(rows);
          // resolve(JSON.stringify(rows));
        });
      } catch (error) {
        reject(error);
      }
    });
  }
  static getMasterData() {
    return new Promise((resolve, reject) => {
      try {
        HHConnection.query(
          `CALL hcm_hiring_db.getMasterDatav2();`,
          (err, rows) => {
            if (err) {
              //console.log(`Error Conection HCM Hiring DB: ${err}`);
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
  static insertNewRequest(info) {
    const query =
      "INSERT INTO `PB10Requests`(`emailCandidate`, `position`, `jobTitle`, `vacancyType`, `plazaType`, `positionType`, `country`, `personalArea`, `subArea`, `status`, `createdBy`, `createdAt`) " +
      `VALUES ('${info.emailCandidate}', ${info.position}, '${info.jobTitle}', '${info.vacancyType}', '${info.plazaType}', '${info.positionType}', '${info.country}', '${info.personalArea}', '${info.subArea}', 'PC', '${info.user}', '${moment().format("YYYY-MM-DD_H-mm-ss")}');`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        HHConnection.query(query, (error, results) => {
          if (error) {
            //console.log(error);
            reject(error);
          } else {
            resolve(results);
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
  static updateCandidate(info, updatedBy) {
    return new Promise((resolve, reject) => {
      let vall = true;
      let err = "";
      let { id } = info;
      //eliminar para no ser tomadas en cuenta en el siguiente foreach
      delete info["id"];


      Object.keys(info).forEach(function (key) {
        const table = key;
        const values = info[key];
        console.log(table)
        console.log(values)
        //se agrega para el siguiente foreach
        values["updatedBy"] = updatedBy;
        values["updatedAt"] = `${moment().format("YYYY-MM-DD_H-mm-ss")}`;
        let query = `UPDATE ${table} SET`;

        Object.keys(values).forEach(function (key2) {
          if (query == `UPDATE ${table} SET`) {
            query = query + " `" + key2 + "` = '" + values[key2].toString() + "'";
          } else {
            query = query + ", `" + key2 + "` = '" + values[key2].toString() + "'";
          }
        });

        query = query + ` WHERE id = ${id}`;

        console.log(query);


        HHConnection.query(query, (error, results) => {
          if (error) {
            vall = false;
            err = err + error;
          }
        });
      });

      if (!vall) {
        reject(err);
      } else {
        resolve("ok");
      }

    });
  }
  static newFile(values, id, user) {
    const { nameNormalize, encoding, mimetype, path, decoded } = values;
    const query =
      "INSERT INTO `UploadFiles` (name,candidateId,user,codification,type,path,active,createdBy,createdAt) VALUES " +
      `('${nameNormalize}','${id}','${user}', '${encoding}', '${mimetype}', '${path}','${1}','${decoded}','${moment().format(
        "YYYY-MM-DD_H-mm-ss"
      )}')`;
    //console.log(query);
    return new Promise((resolve, reject) => {
      try {
        HHConnection.query(
          `SELECT * FROM UploadFiles WHERE candidateId = '${id}' AND name = '${nameNormalize}'`,
          (error, results) => {
            if (error) {
              //console.log(error);
              reject(error);
            } else {
              if (results.length <= 0) {
                HHConnection.query(query, (error, results) => {
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
    const query = `DELETE FROM UploadFiles WHERE candidateId = '${bdy.id}' AND name = '${bdy.name}'`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        HHConnection.query(query, (err, rows) => {
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
    const query = `DELETE FROM UploadFiles WHERE candidateId = '${bdy.id}'`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        HHConnection.query(query, (err, rows) => {
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
  static getIdByEmail(emailCandidate) {
    return new Promise((resolve, reject) => {
      try {
        HHConnection.query(
          `SELECT id FROM PB10Requests WHERE emailCandidate = '${emailCandidate}' order by id DESC`,
          (err, rows) => {
            if (err) {
              //console.log(`Error Conection HCM Hiring DB: ${err}`);
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
  static getCandidateFiles(id) {
    return new Promise((resolve, reject) => {
      try {
        HHConnection.query(
          `SELECT name, path FROM UploadFiles WHERE candidateId = '${id}' order by id ASC`,
          (err, rows) => {
            if (err) {
              //console.log(`Error Conection HCM Hiring DB: ${err}`);
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
  static updateStatus(id, user) {
    const query = `UPDATE PB10Requests SET status= 'EP', updatedBy='${user}', updatedAt='${moment().format("YYYY-MM-DD_H-mm-ss")}' WHERE id = '${id}'`;

    return new Promise((resolve, reject) => {
      try {
        HHConnection.query(query, (err, rows) => {
          if (err) {
            //console.log(`Error Conection HCM Hiring DB: ${err}`);
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
}
