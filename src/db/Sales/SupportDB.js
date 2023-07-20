/* eslint-disable max-params */
import { runQuery } from "../posgreSQL";

export default class POSTGRESQL {
  constructor() {}

  static getAllMasterVariablesPracties() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        P."id_Practica" AS "id",
        P."descripcion" AS "description",
        P."practica" AS "practices",
        P."preventivos" AS "prevents",
        P."horas" AS "hours",
        P."activo" AS "active",
        P."createdAt",
        P."updatedAt"
      FROM
        critical_parts_db.Practica P
      WHERE
        P."activo" = 1`;
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

  static getAllMasterVariablesCostsByPractices() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        C."id_Costo" AS "id",
        P."practica" AS "practices",
        C."pais" AS "country",
        C."costo" AS "cost",
        C."fk_id_Practica" AS "fkID",
        C."activo" AS "active",
        C."createdAt",
        C."updatedAt"
      FROM
        critical_parts_db.CostoPractica C
      INNER JOIN
        critical_parts_db.Practica P
      ON
        C."fk_id_Practica" = P."id_Practica"
      WHERE
        C."activo" = 1`;
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

  static getAllMasterVariablesPlatformsByPractices() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        PP."id_Plataforma" AS "id",
        P."practica" AS "practices",
        PP."plataforma" AS "platforms",
        PP."preventivos" AS "prevents",
        PP."horas" AS "hours",
        PP."fk_id_Practica" AS "fkID",
        PP."activo" AS "active",
        PP."createdAt",
        PP."updatedAt"
      FROM
        critical_parts_db.PlataformaPractica PP
      INNER JOIN
        critical_parts_db.Practica P
      ON
        PP."fk_id_Practica" = P."id_Practica"
      WHERE
        PP."activo" = 1`;
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

  static getAllMasterVariablesActivitiesByPlatforms() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        A."id_Actividad" AS "id",
        PP."plataforma" AS "platforms",
        A."nombre" AS "name",
        A."fk_id_Plataforma" AS "fkID",
        A."activo" AS "active",
        A."createdAt",
        A."updatedAt"
      FROM
        critical_parts_db.ActividadesPlataforma A
      INNER JOIN
        critical_parts_db.PlataformaPractica PP
      ON
        A."fk_id_Plataforma" = PP."id_Plataforma"
      WHERE
        A."activo" = 1`;
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

  static getAllMasterVariablesOperatingSystems() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        SO."id_SistemaOperativo" AS "id",
        SO."nombre" AS "name",
        SO."activo" AS "active",
        SO."createdAt",
        SO."updatedAt"
      FROM
        critical_parts_db.TipoSistemaOperativo SO
      WHERE
        SO."activo" = 1`;
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

  static createMasterVariableOperatingSystems(name) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.TipoSistemaOperativo (
          "nombre"
        )
      VALUES (
        '${name}'
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

  static createMasterVariablePractice(description, name, prevents, hours) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.Practica (
          "descripcion", "practica", "preventivos", "horas"
        )
      VALUES (
        '${description}', '${name}', ${prevents}, ${hours}
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

  static createMasterVariableCostByPractice(country, cost, idPractice) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.CostoPractica (
          "pais", "costo", "fk_id_Practica"
        )
      VALUES (
        '${country}',  ${cost}, ${idPractice}
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

  static createMasterVariablePlatformByPractice(
    name,
    prevents,
    hours,
    idPractice
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.PlataformaPractica (
          "plataforma", "preventivos", "horas", "fk_id_Practica"
        )
      VALUES (
        '${name}',  ${prevents}, ${hours}, ${idPractice}
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

  static createMasterVariableActivitiesByPlatform(name, idPlatform) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.ActividadesPlataforma (
          "nombre", "fk_id_Plataforma"
        )
      VALUES (
        '${name}', ${idPlatform}
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

  static updateMasterVariableOperatingSystem(name, id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.TipoSistemaOperativo
      SET
        "nombre" = '${name}',
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_SistemaOperativo" = ${id} returning *;`;
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

  static updateMasterVariablePractice(description, name, prevents, hours, id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.Practica
      SET
        "descripcion" = '${description}',
        "practica" = '${name}',
        "preventivos" = ${prevents},
        "horas" = ${hours},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Practica" = ${id} returning *;`;
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

  static updateMasterVariableCostPractice(country, cost, id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.CostoPractica
      SET
        "pais" = '${country}',
        "costo" = ${cost},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Costo" = ${id} returning *;`;
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

  static updateMasterVariablePlatformPractice(name, prevents, hours, id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.PlataformaPractica
      SET
        "plataforma" = '${name}',
        "preventivos" = ${prevents},
        "horas" = ${hours},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Plataforma" = ${id} returning *;`;
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

  static updateMasterVariableActivityPlatform(name, id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.ActividadesPlataforma
      SET
        "nombre" = '${name}',
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Actividad" = ${id} returning *;`;
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

  static deactivateMasterVariableOperatingSystem(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.TipoSistemaOperativo
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_SistemaOperativo" = ${id} returning *;`;
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

  static deactivateMasterVariablePractice(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.Practica
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Practica" = ${id} returning *;`;
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

  static deactivateMasterVariableCost(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.CostoPractica
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Costo" = ${id} returning *;`;
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

  static deactivateAllMasterVariableCostByPractice(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.CostoPractica
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "fk_id_Practica" = ${id} returning *;`;
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

  static deactivateMasterVariablePlatform(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.PlataformaPractica
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Plataforma" = ${id} returning *;`;
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

  static deactivateAllMasterVariablePlatformByPractice(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.PlataformaPractica
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "fk_id_Practica" = ${id} returning *;`;
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

  static deactivateMasterVariableActivity(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.ActividadesPlataforma
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Actividad" = ${id} returning *;`;
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

  static deactivateAllMasterVariableActivitiesPlatformsByPractice(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.ActividadesPlataforma
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      FROM
        critical_parts_db.PlataformaPractica
      WHERE
        "fk_id_Plataforma" = "id_Plataforma"
      AND
        "fk_id_Practica" = ${id} returning *;`;
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

  static deactivateAllMasterVariableActivitiesPlatformsByPlatform(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.ActividadesPlataforma
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "fk_id_Plataforma" = ${id} returning *;`;
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

  static getAllUserEscalationTSS() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        E."id_EscalacionTSS" AS "id",
        E.*
      FROM
        critical_parts_db.EscalacionTSS E
      WHERE
        E."activo" = 1`;
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

  static getAllUserEscalationTSSByCountry(country) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        E."id_EscalacionTSS" AS "id",
        E.*
      FROM
        critical_parts_db.EscalacionTSS E
      WHERE
        E.pais = '${country}' AND
        E."activo" = 1`;
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

  static createUserEscalationTSS(values) {
    const { idUser, name, email, country } = values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.EscalacionTSS (
          "idColaborador", "nombre", "email", "pais"
        )
      VALUES (
        ${idUser}, '${name}', '${email}', '${country}'
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

  static deactivateUserEscalationTSS(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.EscalacionTSS
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_EscalacionTSS" = ${id} returning *;`;
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
