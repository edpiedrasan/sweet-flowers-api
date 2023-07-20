import { connectionDonations } from "../../db/connection";

export default class EventsDB {
  static monetaryEventDonation(event, sign, message, amount, months, currency) {
    const query = `INSERT INTO monetary_donations(EventID, SignID, Message, amount, monthsQuantity, CurrencyID) VALUES (${event},${sign}, '${message}', ${amount}, ${months}, ${currency}) `;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionDonations.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Service Orders DB: ${err}`);
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static daysEventDonation(event, sign, message, amount) {
    const query = `INSERT INTO day_donations(EventID, SignID, Message, amount) VALUES (${event},${sign}, '${message}', ${amount}) `;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionDonations.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Service Orders DB: ${err}`);
            reject(err);
          }
          resolve(rows.insertId);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getMonetaryEventDonationByID(id) {
    const query = `SELECT
        id,
        EventID,
        SignID,
        Message,
        amount,
        monthsQuantity,
        CurrencyID,
        DATE_FORMAT(createdAt, "%Y-%m-%d %T") AS "createdAt"
    FROM
        monetary_donations
    WHERE
        id = ${id};`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionDonations.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Service Orders DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getDaysEventDonationByID(id) {
    const query = `SELECT
        id,
        EventID,
        SignID,
        Message,
        amount,
        DATE_FORMAT(createdAt, "%Y-%m-%d %T") AS "createdAt"
    FROM
        day_donations
    WHERE
        id = ${id};`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionDonations.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Service Orders DB: ${err}`);
            reject(err);
          }
          if (rows[0]) resolve(rows[0]);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllCountriesMonetaryDonations(id) {
    const query = `SELECT
        DS.UserID,
        DS.name,
        C.country,
        DS.email,
        DS.manager,
        E.title,
        E.name AS "event",
        D.amount,
        D.monthsQuantity,
        D.Message,
        C.currency,
        C.usdChange,
        C.unicode_icon,
        D.createdAt
    FROM
        monetary_donations D
    INNER JOIN MIS.digital_sign DS
    ON
        D.SignID = DS.id
    INNER JOIN MIS.events E
    ON
        D.EventID = E.id
    INNER JOIN MIS.currencies C
    ON
        D.CurrencyID = C.id
    WHERE
      D.EventID = ${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionDonations.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Service Orders DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllCountriesVacationsDonations(id) {
    const query = `SELECT
        DS.UserID,
        DS.name,
        DS.country,
        DS.email,
        DS.manager,
        E.title,
        E.name AS "event",
        D.amount,
        D.Message,
        D.createdAt
    FROM
        day_donations D
    INNER JOIN MIS.digital_sign DS
    ON
        D.SignID = DS.id
    INNER JOIN MIS.events E
    ON
        D.EventID = E.id
    WHERE
        D.EventID = ${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionDonations.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Service Orders DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllNotCountriesMonetaryDonations(id) {
    const query = `SELECT
        DS.UserID,
        DS.name,
        DS.email,
        DS.manager,
        CASE WHEN D.CurrencyID IS NULL THEN 'NA' END AS 'country',
        E.title,
        E.name AS "event",
        D.amount,
        D.monthsQuantity,
        D.Message,
        D.createdAt
    FROM
        monetary_donations D
    INNER JOIN MIS.digital_sign DS
    ON
        D.SignID = DS.id
    INNER JOIN MIS.events E
    ON
        D.EventID = E.id
    WHERE
        D.CurrencyID IS NULL AND D.EventID = ${id}`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionDonations.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection Service Orders DB: ${err}`);
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