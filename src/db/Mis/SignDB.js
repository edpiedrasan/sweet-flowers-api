import { connectionMIS } from "../connection";

export default class SignDB {

  static getAllDigitalSignUsers() {
    const query = `SELECT
        id,
        user,
        name,
        UserID,
        department,
        manager,
        country,
        email,
        position,
        DATE_FORMAT(startDate, "%Y-%m-%d") AS "startDate",
        endDate,
        token,
        active,
        createdAt,
        updatedAt
    FROM
        digital_sign
    WHERE
        active = 1`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static deactivedUserByID(SignID) {
    const query = `UPDATE digital_sign DS SET DS.active = 0 WHERE DS.id = ${SignID};`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateUserInformationByID(SignID, values) {
    const { user, name, department, manager, country, subDivision, email, position, startDate } = values;
    const query = `UPDATE
        digital_sign DS
    SET
        DS.user = '${user}',
        DS.name = '${name}',
        DS.department = '${department}',
        DS.manager = '${manager}',
        DS.country = '${country}',
        DS.subDivision = '${subDivision}',
        DS.email = '${email}',
        DS.position = '${position}',
        DS.startDate = '${startDate}',
        DS.token = null
    WHERE
        DS.id = ${SignID};`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionMIS.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Extra Hours DB: ${err}`);
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