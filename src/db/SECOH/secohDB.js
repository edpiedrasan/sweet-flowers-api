/* eslint-disable no-nested-ternary */
/* eslint-disable max-lines */
/* eslint-disable max-params */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
import { runQuery } from "../posgreSQL";

export default class POSTGRESQL {
  constructor() {}

  static findContractsOnHold() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          C."id_Contract" AS "id",
          C."fk_idState" AS "status",
          *
      FROM
          secoh.contracts C
      WHERE
          C."active" = 1 AND
          C."currentStatus" = 'On Hold'
      ORDER BY
          C."id_Contract" ASC;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findAllDataMasterByStatus(status) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          *
      FROM
          secoh.data_master
      WHERE
          "status" = ${status}
      ORDER BY
          "id_DataMaster" ASC;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findDataMasterByID(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          *
      FROM
          secoh.data_master
      WHERE
          "id_DataMaster" = ${id}`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findDataMasterByMaterialGroups(materialGroups) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          "id_DataMaster" as id
      FROM
          secoh.data_master
      WHERE
          "code" in (${materialGroups.map((row) => `'${row}'`)});`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findAllContractsOnHold(teams) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          C."id_Contract" AS "id",
          C."fk_idState" AS "status",
          *
      FROM
          secoh.contracts C
      WHERE
          C."active" = 1 AND
          C."currentStatus" = 'On Hold' AND
          C."country" IN (${teams.map((team) => `'${team}'`)})
      ORDER BY
          C."id_Contract" ASC;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findAllContractsOnHoldInProgress(teams) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          C."id_Contract" AS "id",
          C."fk_idState" AS "status",
          *
      FROM
          secoh.contracts C
      WHERE
          C."active" = 1 AND
          C."currentStatus" = 'In Progress' AND
          C."country" IN (${teams.map((team) => `'${team}'`)})
      ORDER BY
          C."id_Contract" ASC;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findContractOnHoldByID(idContract) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          C.*
      FROM
          secoh.contracts C
      WHERE
          C."active" = 1 AND C."id_Contract" = '${idContract}';`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findActivityLogsByContractOnHold(idContract) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          A."commentary",
          A."createdAt",
          S."name" AS "status",
          A."createdBy",
          CASE
              WHEN S."name" = 'Contrato Sincronizado' OR S."name" = 'Aprobacion Cambio Objetivo Fecha Inicio' THEN 'success'
              WHEN S."name" = 'Retraso Cliente' OR S."name" = 'Solicitud Cambio Objetivo Fecha Inicio' THEN 'warning'
              WHEN S."name" = 'Mala Estimación' OR S."name" = 'Rechazo Cambio Objetivo Fecha Inicio' THEN 'danger'
              ELSE 'warning'
          END AS color,
          CASE
              WHEN S."name" = 'Contrato Sincronizado' THEN 'fas fa-bell'
              WHEN S."name" = 'Retraso Cliente' THEN 'fas fa-business-time'
              WHEN S."name" = 'Mala Estimación' THEN 'fas fa-user-times'
              WHEN S."name" = 'Solicitud Cambio Objetivo Fecha Inicio' THEN 'fas fa-info-circle'
              WHEN S."name" = 'Aprobacion Cambio Objetivo Fecha Inicio' THEN 'fas fa-check-double'
              WHEN S."name" = 'Rechazo Cambio Objetivo Fecha Inicio' THEN 'fas fa-times-circle'
              ELSE 'fas fa-bell'
          END AS icon
      FROM
          secoh.activity_logs A
      INNER JOIN
          secoh.states S
      ON
          A."fk_idState" = S."id_State"
      WHERE
          A."active" = 1 AND A."fk_idContract" = '${idContract}'
      ORDER BY
          A."id_ActivityLog" DESC;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findLastActivityLogByContractOnHold(idContract) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          A."commentary",
          A."createdAt",
          S."name" AS "status",
          A."createdBy",
          CASE
              WHEN S."name" = 'Contrato Sincronizado' THEN 'success'
              WHEN S."name" = 'Retraso Cliente' THEN 'warning'
              WHEN S."name" = 'Mala Estimación' THEN 'danger'
              ELSE 'warning'
          END AS color,
          CASE
              WHEN S."name" = 'Contrato Sincronizado' THEN 'fas fa-bell'
              WHEN S."name" = 'Retraso Cliente' THEN 'fas fa-business-time'
              WHEN S."name" = 'Mala Estimación' THEN 'fas fa-user-times'
              ELSE 'fas fa-bell'
          END AS icon
      FROM
          secoh.activity_logs A
      INNER JOIN
          secoh.states S
      ON
          A."fk_idState" = S."id_State"
      WHERE
          A."active" = 1 AND A."fk_idContract" = '${idContract}'
      ORDER BY
          A."id_ActivityLog" DESC
      FETCH
          FIRST 1 ROWS ONLY;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findContractOnHoldByContractID(contractID) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          C.*
      FROM
          secoh.contracts C
      WHERE
          C."active" = 1 AND C."contractNumber" = '${contractID}';`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findAllStatusContractsOnHold() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          S."id_State" AS "id",
          *
      FROM
          secoh.states S
      WHERE
          S."active" = 1;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findStatusContractsOnHoldByID(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          S."id_State" AS "id",
          *
      FROM
          secoh.states S
      WHERE
          S."active" = 1 AND S."id_State" = ${id};`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findAllStatusContractsOnHoldManagement() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          S."id_State" AS "id",
          *
      FROM
          secoh.states S
      WHERE
          S."active" = 1 AND
          S."name" != 'Solicitud Cambio Objetivo Fecha Inicio' AND
          S."name" != 'Aprobacion Cambio Objetivo Fecha Inicio' AND
          S."name" != 'Rechazo Cambio Objetivo Fecha Inicio'
      ORDER BY
          S."id_State" ASC;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findContractTargetOnHoldByContractID(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          *
      FROM
          secoh.contracts C
      INNER JOIN
          secoh.target_change_request T
      ON
          C."id_Contract" = T."fk_idContract"
      WHERE
          C."active" = 1 AND T."id_TargetChangeRequest" = ${idRequest};`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findUsersNotificationsMatrix() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          N."id_NotificationMatrix" AS "id",
          N."idUser",
          N."fullname",
          N."email",
          N."createdAt",
          N."updatedAt"
      FROM
          secoh.notification_matrix N
      WHERE
          N."active" = 1
      ORDER BY
          N."createdAt" DESC;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findUsersEscalationsMatrix() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          N."id_EscalationMatrix" AS "id",
          N."idUser",
          N."fullname",
          N."email",
          N."type",
          N."createdAt",
          N."updatedAt"
      FROM
          secoh.escalation_matrix N
      WHERE
          N."active" = 1
      ORDER BY
          N."createdAt" ASC;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findUsersNotificationsMatrixByID(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          N."id_NotificationMatrix" AS "id",
          N."idUser",
          N."fullname",
          N."email",
          N."createdAt",
          N."updatedAt"
      FROM
          secoh.notification_matrix N
      WHERE
          N."active" = 1 AND
          N."id_NotificationMatrix" = ${id}
      ORDER BY
          N."createdAt" DESC;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findUsersEscalationsMatrixByID(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          N."id_EscalationMatrix" AS "id",
          N."idUser",
          N."fullname",
          N."email",
          N."createdAt",
          N."updatedAt"
      FROM
          secoh.escalation_matrix N
      WHERE
          N."active" = 1 AND
          N."id_EscalationMatrix" = ${id}
      ORDER BY
          N."createdAt" DESC;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findAllServicesContractsOnHold() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          S."id_Service" AS "id",
          S."name" AS "text",
          *
      FROM
          secoh.services S
      WHERE
          S."active" = 1;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findUserMatrixServicesByID(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          S."id_Service" AS "id",
          S."name" AS "text",
          *
      FROM
          secoh.services S
      INNER JOIN
          secoh.matrix_service MS
      ON
          S."id_Service" = MS."fk_idService" AND MS."fk_idNotificationMatrix" = ${id}
      WHERE
          S."active" = 1 AND MS."active" = 1;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findUserEscalationMatrixServicesByID(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          S."id_Service" AS "id",
          S."name" AS "text",
          *
      FROM
          secoh.services S
      INNER JOIN
          secoh.escalation_service MS
      ON
          S."id_Service" = MS."fk_idService" AND MS."fk_idEscalationMatrix" = ${id}
      WHERE
          S."active" = 1 AND MS."active" = 1;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findAllCountriesContractsOnHold() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          C."id_Country" AS "id",
          C."name" AS "text",
          *
      FROM
          secoh.countries C
      WHERE
          C."active" = 1;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findUserMatrixCountriesByID(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          C."id_Country" AS "id",
          C."name" AS "text",
          *
      FROM
          secoh.countries C
      INNER JOIN
          secoh.matrix_country MC
      ON
          C."id_Country" = MC."fk_idCountry" AND MC."fk_idNotificationMatrix" = ${id}
      WHERE
          C."active" = 1 AND MC."active" = 1;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findUserEscalationMatrixCountriesByID(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          C."id_Country" AS "id",
          C."name" AS "text",
          *
      FROM
          secoh.countries C
      INNER JOIN
          secoh.escalation_country MC
      ON
          C."id_Country" = MC."fk_idCountry" AND MC."fk_idEscalationMatrix" = ${id}
      WHERE
          C."active" = 1 AND MC."active" = 1;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findContractsOnHoldDaysTargetStartDate(days) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          C."id_Contract" AS "id",
          C."fk_idState" AS "status",
          *
      FROM
          secoh.contracts C
      WHERE
          C."active" = 1 AND
          DATE_PART('day', "targetStartDate" - now()) = ${days}
      ORDER BY
          C."id_Contract" ASC;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findContractsOnHoldTodayTargetStartDate() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          C."id_Contract" AS "id",
          C."fk_idState" AS "status",
          *
      FROM
          secoh.contracts C
      WHERE
          C."active" = 1 AND
          "targetStartDate" = now()
      ORDER BY
          C."id_Contract" ASC;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findUsersNotificationByServiceCountry(service, country) {
    return new Promise((resolve, reject) => {
      const query = `SELECT distinct
          N."fullname",
          N."idUser",
          N."email"
      FROM
          secoh.notification_matrix N
      INNER join
          secoh.matrix_service MS
      ON
          N."id_NotificationMatrix" = MS."fk_idNotificationMatrix"
      INNER JOIN
          secoh.matrix_country MC
      ON
          N."id_NotificationMatrix" = MC."fk_idNotificationMatrix"
      INNER JOIN
          secoh.services S
      ON
          MS."fk_idService" = S."id_Service"
      INNER JOIN
          secoh.countries C
      ON
          MC."fk_idCountry" = C."id_Country"
      WHERE
          N."active" = 1 AND
          upper(S."name") = upper('${service}') AND
          upper(C."key") = upper('${country}');`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findUsersEscalationByServiceCountry(service, country, type) {
    return new Promise((resolve, reject) => {
      const query = `SELECT distinct
          N."fullname",
          N."idUser",
          N."email"
      FROM
          secoh.escalation_matrix N
      INNER join
          secoh.escalation_service MS
      ON
          N."id_EscalationMatrix" = MS."fk_idEscalationMatrix"
      INNER JOIN
          secoh.escalation_country MC
      ON
          N."id_EscalationMatrix" = MC."fk_idEscalationMatrix"
      INNER JOIN
          secoh.services S
      ON
          MS."fk_idService" = S."id_Service"
      INNER JOIN
          secoh.countries C
      ON
          MC."fk_idCountry" = C."id_Country"
      WHERE
          N."active" = 1 AND
          N."type" = ${type} AND
          upper(S."name") = upper('${service}') AND
          upper(C."key") = upper('${country}');`;
      // console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findAllItemsContractsOnHoldByID(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT DISTINCT
          I.name
      FROM
          secoh.items I
      WHERE
          I."active" = 1 AND
          I."fk_idContract" = ${id};`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findAllServicesContractsOnHoldByID(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT DISTINCT
          DM."serviceGroup"
      FROM
          secoh.data_master DM
      INNER JOIN
          secoh.data_master_contract DMC
      ON
          DMC."fk_idDataMaster"  = DM."id_DataMaster"
      WHERE
          DMC."active" = 1 AND
          DMC."fk_idContract" = ${id};`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findTargetStartDateRequestByApply() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          T."id_TargetChangeRequest" AS "id",
          C."id_Contract",
          C."contractNumber",
          to_char(T."newTargetDate", 'YYYY-MM-DD') AS "newTargetDate"
      FROM
          secoh.target_change_request T
      INNER JOIN
          secoh.contracts C
      ON
          T."fk_idContract" = C."id_Contract"
      WHERE
          T."status" = 1 AND
          T."applied" = 0;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findDashboardDataContractsOnHoldByType(type, filters, teams) {
    return new Promise((resolve, reject) => {
      console.log("TIPO: ", type);
      console.log(filters);
      const { country, service, status } = filters;
      let query = "";
      if (type === "false") {
        query = `SELECT
            count(*) AS "total",
            C."country" AS "label"
        FROM
            secoh.contracts C
        left join
            secoh.data_master_contract d
        on
          C."id_Contract" = d."fk_idContract"
        left join
          secoh.data_master dm
        on
          d."fk_idDataMaster" = dm."id_DataMaster"
        INNER JOIN
            secoh.states S
        ON
            C."fk_idState" = S."id_State"
        WHERE
            C."active" = 1 AND
            C."currentStatus" = 'On Hold' AND
            C."country" IN (${teams.map((team) => `'${team}'`)})
            ${
              country && country.length
                ? ` AND c."country" IN (${country.map(
                    (row) => `'${row.label}'`
                  )})`
                : ""
            }
            ${
              service && service.length
                ? ` AND dm."serviceGroup" IN (${service.map(
                    (row) => `'${row.label}'`
                  )})`
                : ""
            }
            ${
              status && status.length
                ? ` AND S."name" IN (${status.map((row) => `'${row.label}'`)})`
                : ""
            }
        GROUP BY
                C."country";`;
      } else {
        query = `SELECT
            count(*) AS "total",
            CASE WHEN dm."serviceGroup" IS NULL THEN 'N/A' ELSE dm."serviceGroup" END AS "label"
        FROM
            secoh.contracts C
        left join
            secoh.data_master_contract d
        on
          C."id_Contract" = d."fk_idContract"
        left join
          secoh.data_master dm
        on
          d."fk_idDataMaster" = dm."id_DataMaster"
        INNER JOIN
            secoh.states S
        ON
            C."fk_idState" = S."id_State"
        WHERE
            C."active" = 1 AND
            C."currentStatus" = 'On Hold'
            ${
              country && country.length
                ? ` AND c."country" IN (${country.map(
                    (row) => `'${row.label}'`
                  )})`
                : ""
            }
            ${
              service && service.length
                ? ` AND dm."serviceGroup" IN (${service.map(
                    (row) => `'${row.label}'`
                  )})`
                : ""
            }
            ${
              status && status.length
                ? ` AND S."name" IN (${status.map((row) => `'${row.label}'`)})`
                : ""
            }
        GROUP BY
          dm."serviceGroup";`;
      }
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findDashboardDataDaysContractsOnHoldByType(type, filters, teams) {
    const { country, service, status } = filters;
    return new Promise((resolve, reject) => {
      let query = "";
      if (type === "false") {
        query = `SELECT
            C."country" AS "label",
            C."onHoldDate"
        FROM
            secoh.contracts C
        left join
            secoh.data_master_contract d
        on
          C."id_Contract" = d."fk_idContract"
        left join
          secoh.data_master dm
        on
          d."fk_idDataMaster" = dm."id_DataMaster"
        INNER JOIN
            secoh.states S
        ON
            C."fk_idState" = S."id_State"
        WHERE
            C."active" = 1 AND
            C."currentStatus" = 'On Hold' AND
            C."country" IN (${teams.map((team) => `'${team}'`)})
            ${
              country && country.length
                ? ` AND c."country" IN (${country.map(
                    (row) => `'${row.label}'`
                  )})`
                : ""
            }
            ${
              service && service.length
                ? ` AND dm."serviceGroup" IN (${service.map(
                    (row) => `'${row.label}'`
                  )})`
                : ""
            }
            ${
              status && status.length
                ? ` AND S."name" IN (${status.map((row) => `'${row.label}'`)})`
                : ""
            }
        GROUP BY
              C."country",
              C."onHoldDate"
        ORDER BY
            C."country" ASC;`;
      } else {
        query = `SELECT
            CASE WHEN dm."serviceGroup" IS NULL THEN 'N/A' ELSE dm."serviceGroup" END AS "label",
            C."onHoldDate"
        FROM
            secoh.contracts C
        left join
          secoh.data_master_contract d
        on
          C."id_Contract" = d."fk_idContract"
        left join
          secoh.data_master dm
        on
          d."fk_idDataMaster" = dm."id_DataMaster"
        INNER JOIN
            secoh.states S
        ON
            C."fk_idState" = S."id_State"
        WHERE
            C."active" = 1 AND
            C."currentStatus" = 'On Hold'
            ${
              country && country.length
                ? ` AND c."country" IN (${country.map(
                    (row) => `'${row.label}'`
                  )})`
                : ""
            }
            ${
              service && service.length
                ? ` AND dm."serviceGroup" IN (${service.map(
                    (row) => `'${row.label}'`
                  )})`
                : ""
            }
            ${
              status && status.length
                ? ` AND S."name" IN (${status.map((row) => `'${row.label}'`)})`
                : ""
            }
        GROUP BY
            dm."serviceGroup",
            C."onHoldDate"
        ORDER BY
            dm."serviceGroup";`;
      }
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findDashboardDataTrendContractsOnHold(filters, teams) {
    const { country, service, status } = filters;
    return new Promise((resolve, reject) => {
      const query = `select
          count(*) AS "total",
          date_part('month', c."startDate") AS "month"
      FROM
          secoh.contracts C
      left join
          secoh.data_master_contract d
      on
          C."id_Contract" = d."fk_idContract"
      left join
          secoh.data_master dm
      on
          d."fk_idDataMaster" = dm."id_DataMaster"
      INNER JOIN
          secoh.states S
      ON
          C."fk_idState" = S."id_State"
      WHERE
          C."active" = 1 AND
          C."currentStatus" = 'On Hold' AND
          C."country" IN (${teams.map((team) => `'${team}'`)})
          ${
            country && country.length
              ? ` AND c."country" IN (${country.map(
                  (row) => `'${row.label}'`
                )})`
              : ""
          }
          ${
            service && service.length
              ? ` AND dm."serviceGroup" IN (${service.map(
                  (row) => `'${row.label}'`
                )})`
              : ""
          }
          ${
            status && status.length
              ? ` AND S."name" IN (${status.map((row) => `'${row.label}'`)})`
              : ""
          }
      group by
          date_part('month', c."startDate")
      order by
          date_part('month', c."startDate") asc;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findAllCountriesAvailable(teams) {
    return new Promise((resolve, reject) => {
      const query = `select distinct
          country
      from
          secoh.contracts c
      where
          c."active" = 1 AND
          c."country" IN (${teams.map((team) => `'${team}'`)})
      order by
          country asc;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findAllServicesAvailable() {
    return new Promise((resolve, reject) => {
      const query = `select distinct
          CASE WHEN dm."serviceGroup" IS NULL THEN 'N/A' ELSE dm."serviceGroup" END as "service"
      from
          secoh.contracts c
      left join
          secoh.data_master_contract d
      on
          c."id_Contract" = d."fk_idContract"
      left join
          secoh.data_master dm
      on
          d."fk_idDataMaster" = dm."id_DataMaster"
      where
          c."active" = 1
      order by
          service;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findAllStatusAvailable() {
    return new Promise((resolve, reject) => {
      const query = `select
          S."name"
      from
          secoh.states S
      where
          S."active" = 1 AND
          S."name" != 'Solicitud Cambio Objetivo Fecha Inicio' AND
          S."name" != 'Aprobacion Cambio Objetivo Fecha Inicio' AND
          S."name" != 'Rechazo Cambio Objetivo Fecha Inicio'
      order by
          S."name" asc;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findUsersEmailsChangeTargetRequest() {
    return new Promise((resolve, reject) => {
      const query = `select
          T."email"
      from
          secoh.target_change_users T
      where
          T."active" = 1;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findContractsGraphInfo(filters, teams) {
    const { country, service, status } = filters;
    return new Promise((resolve, reject) => {
      const query = `select
            c.country,
            to_char(c."startDate", 'Month') as month,
            SUM(c."netValue")
        from
            secoh.contracts c
        left join
            secoh.data_master_contract d
        on
            C."id_Contract" = d."fk_idContract"
        left join
            secoh.data_master dm
        on
            d."fk_idDataMaster" = dm."id_DataMaster"
        INNER JOIN
            secoh.states S
        ON
            C."fk_idState" = S."id_State"
        WHERE
            c."active" = 1 AND
            c."currentStatus" = 'On Hold' AND
            c."country" IN (${teams.map((team) => `'${team}'`)})
            ${
              country && country.length
                ? ` AND c."country" IN (${country.map(
                    (row) => `'${row.label}'`
                  )})`
                : ""
            }
            ${
              service && service.length
                ? ` AND dm."serviceGroup" IN (${service.map(
                    (row) => `'${row.label}'`
                  )})`
                : ""
            }
            ${
              status && status.length
                ? ` AND S."name" IN (${status.map((row) => `'${row.label}'`)})`
                : ""
            }
        group by
            c.country,
            to_char(c."startDate", 'Month')
        order by
            country;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findContractsGraphInfoByCountry(countryKey, filters) {
    const { country, service, status } = filters;
    return new Promise((resolve, reject) => {
      const query = `select
            CONCAT(c."contractNumber", ' / ', c."customerName") AS "customerName",
            to_char(c."startDate", 'Month') as month,
            SUM(c."netValue")
        from
            secoh.contracts c
        INNER JOIN
            secoh.states S
        ON
            C."fk_idState" = S."id_State"
        where
            c.country = '${countryKey}' AND
            c."active" = 1 AND
            c."currentStatus" = 'On Hold'
            ${
              country && country.length
                ? ` AND c."country" IN (${country.map(
                    (row) => `'${row.label}'`
                  )})`
                : ""
            }
            ${
              service && service.length
                ? ` AND c."service" IN (${service.map(
                    (row) => `'${row.label}'`
                  )})`
                : ""
            }
            ${
              status && status.length
                ? ` AND S."name" IN (${status.map((row) => `'${row.label}'`)})`
                : ""
            }
        group by
            c."customerName",
            c."contractNumber",
            to_char(c."startDate", 'Month')
        order by
            c."customerName";`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findContractsOnHoldMonthsTargetStartDate(month) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          C."id_Contract" AS "id",
          C."fk_idState" AS "status",
          *
      FROM
          secoh.contracts C
      WHERE
          C."active" = 1 AND
          DATE_PART('month', "startDate") = ${month}
      ORDER BY
          C."id_Contract" ASC;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findInfoContractsOnHoldByContractsNumber(contractsNumbers) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          C."country" as "Country",
          C."contractNumber" as "Transaction Number",
          C."customerName" as "Customer Name",
          C."service" as "Service",
          C."startDate" as "Start Date",
          C."targetStartDate" as "Target Start Date",
          C."netValue" as "Net Value",
          DATE_PART('day', now() - C."startDate") as "Delayed"
      FROM
          secoh.contracts C
      WHERE
          C."active" = 1 AND
          C."contractNumber" IN (${contractsNumbers.map((row) => `'${row}'`)})
      ORDER BY
          C."id_Contract" ASC;`;
      // console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static createContractOnHold(values) {
    const {
      ID_CONTRACT,
      DESC_CONTRACT,
      CTY_CONTRACT,
      ID_CUSTOMER,
      DESC_CUSTOMER,
      EXTERNAL_REF,
      START_DATE,
      GROSS_VALUE,
      NET_VALUE,
      TAX_VALUE,
      SHIPMENT_VALUE,
      POSTING_DATE,
      END_DATE,
      ONHOLD_DATE,
      ONHOLD_USER,
      CURRENT_STATUS,
      SERVICE,
      OUTSOURCING,
      RENEWAL_TYPE,
      VARIABLE_CONTRACT,
      SALES_ORG,
      SERVICE_ORG,
      EMPLOYEE,
      EMPLOYEE_ID,
    } = values;
    return new Promise((resolve, reject) => {
      const query =
        POSTING_DATE === "0000-00-00"
          ? `INSERT INTO secoh.contracts (
          "contractNumber", "description", "country", "customerID", "customerName", "externalReference", "startDate", "endDate", "service", "grossValue", "netValue", "taxValue", "shipmentValue", "onHoldDate", "onHoldUser", "currentStatus", "outsourcing", "renewalType", "variableContract", "salesOrganization", "servicesOrganization", "employeeID", "employeeName", "fk_idState"
      ) values (
          ${ID_CONTRACT}, '${DESC_CONTRACT}', '${CTY_CONTRACT}', ${ID_CUSTOMER}, '${DESC_CUSTOMER}', '${EXTERNAL_REF}', '${START_DATE}', '${END_DATE}', '${SERVICE}', ${GROSS_VALUE}, ${NET_VALUE}, ${TAX_VALUE}, ${SHIPMENT_VALUE}, '${ONHOLD_DATE}', '${ONHOLD_USER}', '${CURRENT_STATUS}', ${
              OUTSOURCING === "false" ? 0 : 1
            }, '${RENEWAL_TYPE}', ${
              VARIABLE_CONTRACT === "false" ? 0 : 1
            }, '${SALES_ORG}', '${SERVICE_ORG}', '${EMPLOYEE_ID}', '${EMPLOYEE}', 1
      ) returning *;`
          : `INSERT INTO secoh.contracts (
          "contractNumber", "description", "country", "customerID", "customerName", "externalReference", "startDate", "endDate", "service", "grossValue", "netValue", "taxValue", "shipmentValue", "postingDate", "targetStartDate", "onHoldDate", "onHoldUser", "currentStatus", "outsourcing", "renewalType", "variableContract", "salesOrganization", "servicesOrganization", "employeeID", "employeeName", "fk_idState"
      ) values (
          ${ID_CONTRACT}, '${DESC_CONTRACT}', '${CTY_CONTRACT}', ${ID_CUSTOMER}, '${DESC_CUSTOMER}', '${EXTERNAL_REF}', '${START_DATE}', '${END_DATE}', '${SERVICE}', ${GROSS_VALUE}, ${NET_VALUE}, ${TAX_VALUE}, ${SHIPMENT_VALUE}, '${POSTING_DATE}', '${POSTING_DATE}', '${ONHOLD_DATE}', '${ONHOLD_USER}', '${CURRENT_STATUS}', ${
              OUTSOURCING === "false" ? 0 : 1
            }, '${RENEWAL_TYPE}', ${
              VARIABLE_CONTRACT === "false" ? 0 : 1
            }, '${SALES_ORG}', '${SERVICE_ORG}', '${EMPLOYEE_ID}', '${EMPLOYEE}', 1
      ) returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static createItemsByContractOnHoldID(values, idContract) {
    const { SERVICE_NAME, SERVICE_MG, SERVICE_PRODUCT, SERVICE_QTY } = values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO secoh.items (
          "name", "product", "materialGroup", "quantity", "fk_idContract"
      ) values (
          '${SERVICE_NAME}', '${SERVICE_PRODUCT}', '${SERVICE_MG}', ${SERVICE_QTY}, ${idContract}
      ) returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static createActivityLogByContractOnHoldID(
    commentary,
    createdBy,
    idContract,
    idState
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO secoh.activity_logs (
          "commentary", "fk_idContract", "fk_idState", "createdBy"
      ) values (
          '${commentary}', ${idContract}, ${idState}, '${createdBy}'
      ) returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static createUserNotification(values) {
    const { idUser, fullname, email } = values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO secoh.notification_matrix (
          "idUser", "fullname", "email"
      ) values (
          ${idUser}, '${fullname}', '${email}'
      ) returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static createUserEscalation(values) {
    const { idUser, fullname, email, type } = values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO secoh.escalation_matrix (
          "idUser", "fullname", "email", "type"
      ) values (
          ${idUser}, '${fullname}', '${email}', ${type}
      ) returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static createTargetStartDateRequestByContractOnHold(idContract, values) {
    const { oldTargetStartDate, newTargetStartDate, reason, createdBy } =
      values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO secoh.target_change_request (
          "currentTargetDate", "newTargetDate", "reason", "fk_idContract", "createdBy"
      ) values (
          '${oldTargetStartDate}', '${newTargetStartDate}',' ${reason}', ${idContract}, '${createdBy}'
      ) returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static createReferenceRequestTargetStartDate(values) {
    const { nameNormalize, encoding, mimetype, path, createdBy } = values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO secoh.references_target_request (
          "name", "coding", "type", "route", "createdBy"
      ) values (
          '${nameNormalize}', '${encoding}',' ${mimetype}', '${path}', '${createdBy}'
      ) returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static createUserMatrixService(id, idService) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO secoh.matrix_service (
          "fk_idNotificationMatrix", "fk_idService"
      ) values (
          ${id}, ${idService}
      ) returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static createUserEscalationMatrixService(id, idService) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO secoh.escalation_service (
          "fk_idEscalationMatrix", "fk_idService"
      ) values (
          ${id}, ${idService}
      ) returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static createUserMatrixCountry(id, idCountry) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO secoh.matrix_country (
          "fk_idNotificationMatrix", "fk_idCountry"
      ) values (
          ${id}, ${idCountry}
      ) returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static createUserEscalationMatrixCountry(id, idCountry) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO secoh.escalation_country (
          "fk_idEscalationMatrix", "fk_idCountry"
      ) values (
          ${id}, ${idCountry}
      ) returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static createStatusContractOnHold(name, createdBy) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO secoh.states (
          "name", "description", "createdBy"
      ) values (
          '${name}', 'N/A', '${createdBy}'
      ) returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static createDataMaster(values) {
    const {
      code,
      description,
      serviceGroup,
      category,
      subcategory,
      grp1,
      grp2,
      grp3,
      grp4,
      grp5,
      grp6,
      grp7,
      grp8,
      grp9,
      grp10,
      grp11,
      grp12,
      grp13,
      grp14,
      grp15,
      grp16,
      status,
    } = values;
    console.log(values);
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO secoh.data_master (
          "code", "description", "serviceGroup", "category", "subcategory", "grp1", "grp2", "grp3", "grp4", "grp5", "grp6", "grp7", "grp8", "grp9", "grp10", "grp11", "grp12", "grp13", "grp14", "grp15", "grp16", "status"
      ) values (
        '${code}', '${description}', '${serviceGroup}', '${category}', '${subcategory}', '${grp1}', '${grp2}', '${grp3}', '${grp4}', '${grp5}', '${grp6}', '${grp7}', '${grp8}', '${grp9}', '${grp10}', '${grp11}', '${grp12}', '${grp13}', '${grp14}', '${grp15}', '${grp16}', ${status}
      ) returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static createDataMasterByContractOnHoldID(values, idContract) {
    const { id } = values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO secoh.data_master_contract (
          "fk_idDataMaster", "fk_idContract"
      ) values (
          ${id}, ${idContract}
      ) returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static updateStatusContractOnHoldByID(idContract, idState) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        secoh.contracts
      SET
        "fk_idState" = ${idState},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Contract" = ${idContract} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static updateStatusByID(id, name, updatedBy) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        secoh.states
      SET
        "name" = '${name}',
        "updatedBy" = '${updatedBy}',
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_State" = ${id} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static updateDetailContractOnHoldByID(idContract, values) {
    const {
      DESC_CONTRACT,
      CTY_CONTRACT,
      ID_CUSTOMER,
      DESC_CUSTOMER,
      EXTERNAL_REF,
      START_DATE,
      GROSS_VALUE,
      NET_VALUE,
      TAX_VALUE,
      SHIPMENT_VALUE,
      POSTING_DATE,
      END_DATE,
      ONHOLD_DATE,
      ONHOLD_USER,
      CURRENT_STATUS,
      SERVICE,
      OUTSOURCING,
      RENEWAL_TYPE,
      VARIABLE_CONTRACT,
      SALES_ORG,
      SERVICE_ORG,
      EMPLOYEE,
      EMPLOYEE_ID,
    } = values;
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        secoh.contracts
      SET
        "description" = '${DESC_CONTRACT}',
        "country" = '${CTY_CONTRACT}',
        "customerID" = ${ID_CUSTOMER},
        "customerName" = '${DESC_CUSTOMER}',
        "externalReference" = '${EXTERNAL_REF}',
        "startDate" = '${START_DATE}',
        "endDate" = '${END_DATE}',
        "service" = '${SERVICE}',
        "grossValue" = ${GROSS_VALUE},
        "netValue" = ${NET_VALUE},
        "taxValue" = ${TAX_VALUE},
        "shipmentValue" = ${SHIPMENT_VALUE},
        "postingDate" = '${POSTING_DATE}',
        "onHoldDate" = '${ONHOLD_DATE}',
        "onHoldUser" = '${ONHOLD_USER}',
        "currentStatus" = '${CURRENT_STATUS}',
        "outsourcing" = ${OUTSOURCING === "false" ? 0 : 1},
        "renewalType" = '${RENEWAL_TYPE}',
        "variableContract" = ${VARIABLE_CONTRACT === "false" ? 0 : 1},
        "salesOrganization" = '${SALES_ORG}',
        "servicesOrganization" = '${SERVICE_ORG}',
        "employeeID" = '${EMPLOYEE_ID}',
        "employeeName" = '${EMPLOYEE}',
        "targetStartDate" = '${POSTING_DATE}',
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Contract" = ${idContract} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static updateStatusTargetStartDateContractOnHoldByID(idContract, status) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        secoh.target_change_request
      SET
        "status" = ${status},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "fk_idContract" = ${idContract} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static updateTargetStartDateContractOnHoldByID(
    idContract,
    newTargetStartDate
  ) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        secoh.contracts
      SET
        "targetStartDate" = '${newTargetStartDate}',
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Contract" = ${idContract} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static updatedReferenceTargetStartDateID(idReference, idTarget) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        secoh.references_target_request
      SET
        "fk_id_TargetChangeRequest" = ${idTarget},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Reference" = ${idReference} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static updateTargetStartDateRequestApply(contractsIDs) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        secoh.target_change_request
      SET
        "applied" = 1,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "fk_idContract" IN (${contractsIDs}) returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static deactivatedReferenceTargetStartDate(idReference) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        secoh.references_target_request
      SET
        "active" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Reference" = ${idReference} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static deativatedItemsContractOnHold(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        secoh.items
      SET
        "active" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "fk_idContract" = ${id} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static deactivatedStatusByID(id, updatedBy) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        secoh.states
      SET
        "active" = 0,
        "updatedBy" = '${updatedBy}',
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_State" = ${id} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static updateUserEscalationNotification(id, values) {
    const { idUser, fullname, email } = values;
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        secoh.notification_matrix
      SET
        "idUser" = ${idUser},
        "fullname" = '${fullname}',
        "email" = '${email}',
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_NotificationMatrix" = ${id} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static updateUserEscalationByID(id, values) {
    const { idUser, fullname, email, type } = values;
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        secoh.escalation_matrix
      SET
        "idUser" = ${idUser},
        "fullname" = '${fullname}',
        "email" = '${email}',
        "type" = ${type},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_EscalationMatrix" = ${id} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static deactivateUserEscalationNotification(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        secoh.notification_matrix
      SET
        "active" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_NotificationMatrix" = ${id} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static deactivateUserEscalationByID(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        secoh.escalation_matrix
      SET
        "active" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_EscalationMatrix" = ${id} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static deactivateServicesMatrixByID(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        secoh.matrix_service
      SET
        "active" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "fk_idNotificationMatrix" = ${id} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static deactivateServicesEscalationsMatrixByID(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        secoh.escalation_service
      SET
        "active" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "fk_idEscalationMatrix" = ${id} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static deactivateCountriesMatrixByID(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        secoh.matrix_country
      SET
        "active" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "fk_idNotificationMatrix" = ${id} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static deactivateCountriesEscalationsMatrixByID(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        secoh.escalation_country
      SET
        "active" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "fk_idEscalationMatrix" = ${id} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static updateDataMasterById(id, values) {
    const {
      code,
      description,
      serviceGroup,
      category,
      subcategory,
      grp1,
      grp2,
      grp3,
      grp4,
      grp5,
      grp6,
      grp7,
      grp8,
      grp9,
      grp10,
      grp11,
      grp12,
      grp13,
      grp14,
      grp15,
      grp16,
    } = values;
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        secoh.data_master
      SET
        "code" = ${code},
        "description" =  '${description}',
        "serviceGroup" = '${serviceGroup}',
        "category" =  '${category}',
        "subcategory" = '${subcategory}',
        "grp1" = '${grp1}',
        "grp2" = '${grp2}',
        "grp3" = '${grp3}',
        "grp4" = '${grp4}',
        "grp5" = '${grp5}',
        "grp6" = '${grp6}',
        "grp7" = '${grp7}',
        "grp8" = '${grp8}',
        "grp9" = '${grp9}',
        "grp10" = '${grp10}',
        "grp11" = '${grp11}',
        "grp12" = '${grp12}',
        "grp13" = '${grp13}',
        "grp14" = '${grp14}',
        "grp15" = '${grp15}',
        "grp16" = '${grp16}',
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_DataMaster" = ${id} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static updateStatusDataMasterById(id, status) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        secoh.data_master
      SET
        "status" = ${status},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_DataMaster" = ${id} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }
}
