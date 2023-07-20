/* eslint-disable max-params */
import { runQuery } from "../posgreSQL";

export default class POSTGRESQL {

  constructor() { }

  static getFilterModels(page, sizePerPage) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM (SELECT F."id_FiltroModelos" AS "id", F."tipoModelo" AS "name", F."createdBy", F."createdAt", ROW_NUMBER() OVER(ORDER BY "id_FiltroModelos" ASC) as "row_number" FROM critical_parts_db.FiltroModelos F WHERE "activo" = 1) AS T WHERE T."row_number" BETWEEN (${page} * ${sizePerPage}) + 1 AND (${page} + 1) * ${sizePerPage};`;
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

  static getLengthFilterModels() {
    return new Promise((resolve, reject) => {
      const query = `SELECT COUNT(*) AS "total" FROM critical_parts_db.FiltroModelos F WHERE F."activo" = 1;`;
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

  static getAllCriticalParts() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        PC."id_PartesCriticas" AS "id",
        PC."inginiero" AS "engineer",
        PC."tipoModelo" AS "modelType",
        PC."plataforma" AS "platform",
        PC."familia" AS "family",
        PC."categoria" AS "category",
        PC."descripcion" AS "description",
        CASE PC."tieneRedundancia" WHEN 0 THEN 'NO' ELSE 'SI' END AS "redundancy",
        PC."createdBy",
        PC."createdAt",
        ROW_NUMBER() OVER(ORDER BY PC."id_PartesCriticas" ASC) as "row_number"
      FROM
        critical_parts_db.PartesCriticas PC
      WHERE
        PC."activo" = 1;`;
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

  static getAllFilterModels() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        F."id_FiltroModelos" AS "id",
        F."tipoModelo" AS "name",
        F."createdBy",
        F."createdAt",
        ROW_NUMBER() OVER(ORDER BY F."id_FiltroModelos" ASC) as "row_number"
      FROM
        critical_parts_db.FiltroModelos F
      WHERE
        F."activo" = 1;`;
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

  static getCriticalParts(page, sizePerPage, plataforma, familia, categoria, modelo, fechaInicio, fechaFin) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        *
      FROM (
        SELECT
          PC."id_PartesCriticas" AS "id",
          PC."inginiero" AS "engineer",
          PC."tipoModelo" AS "modelType",
          PC."plataforma" AS "platform",
          PC."familia" AS "family",
          PC."categoria" AS "category",
          PC."descripcion" AS "description",
          CASE PC."tieneRedundancia" WHEN 0 THEN 'NO' ELSE 'SI' END AS "redundancy",
          PC."createdBy",
          PC."updatedBy",
          PC."createdAt",
          PC."updatedAt",
          ROW_NUMBER() OVER(ORDER BY PC."id_PartesCriticas" ASC) as "row_number"
        FROM
          critical_parts_db.PartesCriticas PC
        WHERE
          PC."activo" = 1 AND (
            ('${plataforma}' != '' AND PC."plataforma" = '${plataforma}')
              OR
            ('${plataforma}' = '' AND POSITION(PC."plataforma" IN '${plataforma}') = 0 )
          ) AND (
            ('${familia}' != '' AND PC."familia" = '${familia}')
              OR
            ('${familia}' = '' AND POSITION(PC."familia" IN '${familia}') = 0 )
          ) AND (
            ('${categoria}' != '' AND PC."categoria" = '${categoria}')
              OR
            ('${categoria}' = '' AND POSITION(PC."categoria" IN '${categoria}') = 0 )
          ) AND
            UPPER(PC."tipoModelo") LIKE '%${modelo}%'
          AND
            to_char(PC."createdAt", 'YYYY-MM-DD')
          BETWEEN
            '${fechaInicio}' AND '${fechaFin}'
      ) AS T
      WHERE
        T."row_number"
      BETWEEN
        (${page} * ${sizePerPage}) + 1
      AND
        (${page} + 1) * ${sizePerPage};`;
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

  static getLengthCriticalParts(plataforma, familia, categoria, modelo, fechaInicio, fechaFin) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        COUNT(*) AS "total"
      FROM
        critical_parts_db.PartesCriticas PC
      WHERE
        PC."activo" = 1 AND (
          ('${plataforma}' != '' AND PC."plataforma" = '${plataforma}')
            OR
          ('${plataforma}' = '' AND POSITION(PC."plataforma" IN '${plataforma}') = 0 )
        ) AND (
          ('${familia}' != '' AND PC."familia" = '${familia}')
            OR
          ('${familia}' = '' AND POSITION(PC."familia" IN '${familia}') = 0 )
        ) AND (
          ('${categoria}' != '' AND PC."categoria" = '${categoria}')
            OR
          ('${categoria}' = '' AND POSITION(PC."categoria" IN '${categoria}') = 0 )
        ) AND
          UPPER(PC."tipoModelo") LIKE '%${modelo}%'
        AND
          to_char(PC."createdAt", 'YYYY-MM-DD')
        BETWEEN
          '${fechaInicio}' AND '${fechaFin}';`;
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

  static getPlatformsAvaible(familia, categoria, modelo, fechaInicio, fechaFin) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        PC."plataforma" AS "label",
        ROW_NUMBER() OVER() AS "value"
      FROM
        critical_parts_db.PartesCriticas PC
      WHERE
        PC."activo" = 1 AND
        --POSITION(PC.familia IN '${familia}') = 0 AND
        --POSITION(PC.categoria IN '${categoria}') = 0 AND
        --POSITION(UPPER(PC.tipoModelo) IN '${modelo}') = 0
      --AND
        to_char(PC."createdAt", 'YYYY-MM-DD')
      BETWEEN
        '${fechaInicio}' AND '${fechaFin}'
      GROUP BY
        PC."plataforma"
      ORDER BY
        PC."plataforma" ASC;`;
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

  static getFamiliesAvaible(plataforma, categoria, modelo, fechaInicio, fechaFin) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        PC."familia" AS "label",
        ROW_NUMBER() OVER() AS "value"
      FROM
        critical_parts_db.PartesCriticas PC
      WHERE
        PC."activo" = 1 AND
        --POSITION(PC.plataforma IN '${plataforma}') = 0 AND
        --POSITION(PC.categoria IN '${categoria}') = 0 AND
        --POSITION(UPPER(PC.tipoModelo) IN '${modelo}') = 0
      --AND
        to_char(PC."createdAt", 'YYYY-MM-DD')
      BETWEEN
        '${fechaInicio}' AND '${fechaFin}'
      GROUP BY
        PC."familia"
      ORDER BY
        PC."familia" ASC;`;
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

  static getCategoriesAvaible(plataforma, familia, modelo, fechaInicio, fechaFin) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        PC."categoria" AS "label",
        ROW_NUMBER() OVER() AS "value"
      FROM
        critical_parts_db.PartesCriticas PC
      WHERE
        PC."activo" = 1 AND
        --POSITION(PC.plataforma IN '${plataforma}') = 0 AND
        --POSITION(PC.familia IN '${familia}') = 0 AND
        --POSITION(UPPER(PC.tipoModelo) IN '${modelo}') = 0
      --AND
        to_char(PC."createdAt", 'YYYY-MM-DD')
      BETWEEN
          '${fechaInicio}' AND '${fechaFin}'
      GROUP BY
        PC."categoria"
      ORDER BY
        PC."categoria" ASC;`;
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

  static getFilterModelByID(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        F."id_FiltroModelos" AS "id",
        F."tipoModelo" AS "name",
        F."createdBy",
        F."createdAt"
      FROM
        critical_parts_db.FiltroModelos F
      WHERE
        F."id_FiltroModelos" = ${id}
      AND
        F."activo" = 1;`;
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

  static getCriticalPartByID(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        PC."id_PartesCriticas" AS "id",
        PC."inginiero" AS "engineer",
        PC."tipoModelo" AS "modelType",
        PC."plataforma" AS "platform",
        PC."familia" AS "family",
        PC."categoria" AS "category",
        PC."descripcion" AS "description",
        CASE PC."tieneRedundancia" WHEN 0 THEN 'NO' ELSE 'SI' END AS "redundancy",
        PC."createdBy",
        PC."createdAt"
      FROM
        critical_parts_db.PartesCriticas PC
      WHERE
        PC."id_PartesCriticas" = ${id}
      AND
        PC."activo" = 1;`;
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

  static getFilterModelByModel(model) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        *
      FROM
        critical_parts_db.FiltroModelos
      WHERE
        "tipoModelo" = '${model}'
      AND
        "activo" = 1;`;
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

  static createFilterModels(model, createdBy) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.FiltroModelos (
          "tipoModelo", "createdBy"
        )
      VALUES (
        '${model}', '${createdBy}'
      ) returning "id_FiltroModelos" as "id", "tipoModelo" as "name", "createdBy", "createdAt";`;
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

  static createCriticalPart(element, createdBy) {
    const {
      engineer,
      modelType,
      platform,
      family,
      category,
      description,
      redundancy
    } = element;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.PartesCriticas (
          "inginiero", "tipoModelo", "plataforma", "familia", "categoria", "descripcion", "tieneRedundancia", "createdBy"
        )
      VALUES (
        '${engineer}', '${modelType}', '${platform}', '${family}', '${category}', '${description}', ${redundancy}, '${createdBy}'
      ) returning "id_PartesCriticas" as "id", "inginiero" as "engineer", "tipoModelo" as "modelType", "plataforma" as "platform", "familia" as "family", "categoria" as "category", "descripcion" as "description", case "tieneRedundancia" when 0 THEN 'NO' else 'SI' end as "redundancy", "createdBy", "updatedBy", "createdAt", "updatedAt";`;
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

  static updateCriticalPart(id, element, updatedBy) {
    const {
      engineer,
      modelType,
      platform,
      family,
      category,
      description,
      redundancy
    } = element;
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.PartesCriticas
      SET
        "inginiero" = '${engineer}',
        "tipoModelo" = '${modelType}',
        "plataforma" = '${platform}',
        "familia" = '${family}',
        "categoria" = '${category}',
        "descripcion" = '${description}',
        "tieneRedundancia" = ${redundancy},
        "updatedBy" = '${updatedBy}',
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_PartesCriticas" = ${id} returning "id_PartesCriticas" as "id", "inginiero" as "engineer", "tipoModelo" as "modelType", "plataforma" as "platform", "familia" as "family", "categoria" as "category", "descripcion" as "description", case "tieneRedundancia" when 0 THEN 'NO' else 'SI' end as "redundancy", "createdBy", "updatedBy", "createdAt", "updatedAt";`;
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

  static createEventLogMatrix(description, username, user, idCriticalPart, idFilterModel) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.BitacoraMatriz (
          "descripcion", "nombreUsuario", "usuario", "fk_idParteCritica", "fk_idModeloDepurado"
        )
      VALUES (
        '${description}', '${username}', '${user}', ${idCriticalPart}, ${idFilterModel}
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

  static deleteFilterModel(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.FiltroModelos
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_FiltroModelos" = ${id} returning "id_FiltroModelos" AS "id", "tipoModelo" AS "name", "createdBy", "createdAt";`;
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

  static deleteCriticalPart(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.PartesCriticas
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_PartesCriticas" = ${id} returning "id_PartesCriticas" as "id", "inginiero" as "engineer", "tipoModelo" as "modelType", "plataforma" as "platform", "familia" as "family", "categoria" as "category", "descripcion" as "description", case "tieneRedundancia" when 0 THEN 'NO' else 'SI' end as "redundancy", "createdBy", "updatedBy", "createdAt", "updatedAt";`;
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