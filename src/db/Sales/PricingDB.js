/* eslint-disable max-params */
import { runQuery } from "../posgreSQL";

export default class POSTGRESQL {

  constructor() { }

  static getAllMasterDataVariables() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        M."id_MasterData" AS "id",
        M."descripcion" AS "description",
        M."variable" AS "variable",
        M."valor" AS "value",
        M."tipo" AS "type",
        M."activo" AS "active",
        M."createdAt",
        M."updatedAt"
      FROM
        critical_parts_db.MasterData M
      WHERE
        M."activo" = 1;`;
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

  static getLogsMasterDataByVariable(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        L."id_MasterDataLogs" AS "id",
        L."accion" AS "description",
        CASE
          WHEN L."valorAnterior" IS NULL THEN 'N/A'
          WHEN M."tipo" = 'porcentaje' THEN CONCAT(CAST(L."valorAnterior" AS CHAR(10)), '%')
          WHEN M."tipo" = 'entero' THEN CAST(L."valorAnterior" AS CHAR(10))
        END AS "valueAnt",
        CASE
          WHEN L."valorNuevo" IS NULL THEN 'N/A'
          WHEN M."tipo" = 'porcentaje' THEN CONCAT(CAST(L."valorNuevo" AS CHAR(10)), '%')
          WHEN M."tipo" = 'entero' THEN CAST(L."valorNuevo" AS CHAR(10))
        END AS "valueNew",
        L."idColaborador" AS "idUser",
        L."nombreUsuario" AS "username",
        L."colaborador" AS "user",
        L."fk_idMasterData" AS "idMasterData",
        L."activo" AS "active",
        L."createdAt",
        L."updatedAt"
      FROM
        critical_parts_db.MasterDataLogs L
      INNER JOIN
        critical_parts_db.MasterData M
      ON
        L."fk_idMasterData" = M."id_MasterData"
      WHERE
        L."fk_idMasterData" = ${id} AND L."activo" = 1
      ORDER BY
        L."createdAt" DESC;`;
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

  static getEquipmentsBaseByDigitalRequest(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        E."id_CalculoEquiposBase" AS "id",
        E."typeModel",
        E."quantity",
        E."unitCost",
        E."quantityYears",
        E."quantityYearsWarranty",
        E."byServices",
        E."byServicesRemaining",
        E."shippingPercent",
        E."upliftPercent",
        E."finPercent",
        E."provision",
        E."tipo" AS "type",
        E."activo" AS "active",
        E."fk_id_EquipoIBM" AS "idEquipment",
        E."createdAt",
        E."updatedAt"
      FROM
        critical_parts_db.CalculoEquiposBase E
      WHERE
        E."fk_id_Requerimiento" = ${idRequest} AND E."activo" = 1;`;
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

  static getEquipmentsBaseByID(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        E."id_CalculoEquiposBase" AS "id",
        E."typeModel",
        E."quantity",
        E."unitCost",
        E."quantityYears",
        E."quantityYearsWarranty",
        E."byServices",
        E."byServicesRemaining",
        E."shippingPercent",
        E."upliftPercent",
        E."finPercent",
        E."provision",
        E."tipo" AS "type",
        E."activo" AS "active",
        E."createdAt",
        E."updatedAt"
      FROM
        critical_parts_db.CalculoEquiposBase E
      WHERE
        E."id_CalculoEquiposBase" = ${id} AND E."activo" = 1;`;
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

  static getServicesTssByDigitalRequest(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        S."id_CalculoServicios" AS "id",
        P."practica" AS "service",
        S."quantityHours",
        S."unitCost",
        S."quantityYears",
        S."upliftPercent",
        S."finPercent",
        S."viatic",
        S."provision",
        S."fk_id_Practica" AS "idService",
        S."fk_id_Requerimiento" AS "idRequest",
        S."activo" AS "active",
        S."createdAt",
        S."updatedAt"
      FROM
        critical_parts_db.CalculoServicios S
      INNER JOIN
        critical_parts_db.Practica P
      ON
        S."fk_id_Practica" = P."id_Practica"
      WHERE
        S."fk_id_Requerimiento" = ${idRequest} AND S."activo" = 1;`;
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

  static getServicesTssByID(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        S."id_CalculoServicios" AS "id",
        --P."plataforma" AS "service",
        S."quantityHours",
        S."unitCost",
        S."quantityYears",
        S."upliftPercent",
        S."finPercent",
        S."viatic",
        S."provision",
        S."fk_id_Practica" AS "idService",
        S."fk_id_Requerimiento" AS "idRequest",
        S."activo" AS "active",
        S."createdAt",
        S."updatedAt"
      FROM
        critical_parts_db.CalculoServicios S
      WHERE
        S."id_CalculoServicios" = ${id} AND S."activo" = 1;`;
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

  static getSparePartsByDigitalRequest(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        *
      FROM
        critical_parts_db.CalculoSparePartes
      WHERE
        "fk_id_Requerimiento" = ${idRequest} AND "activo" = 1;`;
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

  static getSparePartsByID(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        C.*
      FROM
        critical_parts_db.CalculoSparePartes C
      WHERE
        C."id_CalculoSparePartes" = ${id} AND C."activo" = 1;`;
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

  static getOfferAjustDetailByDigitalRequest(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        "id_Ajuste" AS "idAjust",
        "provision" AS "provision",
        "justificacion" AS "justification",
        CASE
          WHEN "tipo" = 1 THEN 'Provisión'
          WHEN "tipo" = 2 THEN 'Precio'
          WHEN "tipo" = 3 THEN 'Provisión y Precio'
        END AS "type",
        "fk_id_Requerimiento" AS "idRequest",
        "activo" AS "active",
        "createdAt",
        "updatedAt"
      FROM
        critical_parts_db.AjustesOfertas
      WHERE
        "fk_id_Requerimiento" = ${idRequest} AND "activo" = 1;`;
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

  static getReferencesOfferAjustByDigitalRequest(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        R."id_ReferenciaAjuste" AS "idReference",
        R."nombre" AS "name",
        R."codificacion" AS "encoding",
        R."tipo" AS "type",
        R."ruta" AS "path",
        R."fk_id_Requerimiento" AS "idRequest",
        R."activo" AS "active",
        R."createdBy",
        R."createdAt",
        R."updatedAt"
      FROM
        critical_parts_db.ReferenciaAjuste R
      INNER JOIN
        critical_parts_db.AjustesOfertas A
      ON
        R."fk_id_Ajuste" = A."id_Ajuste"
      WHERE
        R."fk_id_Requerimiento" = ${idRequest} AND A."fk_id_Requerimiento" = ${idRequest} AND R."activo" = 1 AND A."activo" = 1;`;
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

  static getAllDigitalRequestInPricing() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        L."id_Lista" AS "idListPricing",
        R."id_Requerimiento" AS "id",
        CASE
          WHEN L."estado" = 0 THEN 'Ajuste Posible'
          WHEN L."estado" = 1 THEN 'Ajuste Aprobado'
          WHEN L."estado" = 2 THEN 'Ajuste Rechazado'
        END AS "status",
        L."estado" AS "state",
        CASE
          WHEN L."estado" = 0 THEN 'bg-warning'
          WHEN L."estado" = 1 THEN 'bg-success'
          WHEN L."estado" = 2 THEN 'bg-danger'
        END AS "color",
        CAST(R."numeroVersion" AS CHAR(10)) AS "version",
        R."numeroOportunidad" AS "opportunityNumber",
        R."nombreCliente" AS "customer",
        R."pais" AS "country",
        R."fk_id_ModeloDeNegocio" AS "idBusinessModel",
        MN."nombre" AS "businessModel",
        PS."nombre" AS "wayPay",
        R."createdBy",
        R."createdAt",
        R."updatedAt"
      FROM
        critical_parts_db.Requerimientos R
      INNER JOIN
        critical_parts_db.ListaPricing L
      ON
        R."id_Requerimiento" = L."fk_id_Requerimiento"
      LEFT JOIN
        critical_parts_db.FormaPagoServicio PS
      ON
        R."fk_id_FormaPagoServicio" = PS."id_FormaPagoServicio"
      LEFT JOIN
        critical_parts_db.ModeloDeNegocio MN
      ON
        R."fk_id_ModeloDeNegocio" = MN."id_ModeloDeNegocio"
      WHERE
        R."activo" = 1 AND L."activo" = 1
      ORDER BY
        L."id_Lista" DESC;`;
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

  static getLogsOfferAjustByDigitalRequest(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        E."id_Ajuste" AS "ajustE",
        S."id_Ajuste" AS "ajustS",
        P."id_Ajuste" AS "ajustP"
      FROM
        critical_parts_db.BitacoraAjusteCalculo B
      LEFT JOIN
        critical_parts_db.AjusteCalculoEquiposBase E
      ON
        B."id_Bitacora" = E."fk_id_Bitacora"
      LEFT JOIN
        critical_parts_db.AjusteCalculoServiciosTss S
      ON
        B."id_Bitacora" = S."fk_id_Bitacora"
      LEFT JOIN
        critical_parts_db.AjusteCalculoSparePartes P
      ON
        B."id_Bitacora" = P."fk_id_Bitacora"
      WHERE
        B."fk_id_Lista" = ${id};`;
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

  static createLogOfferAjustByDigitalRequest(description, createdBy, id) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.BitacoraAjusteCalculo (
          "descripcion", "fk_id_Lista", "createdBy"
        )
      VALUES (
        '${description}', ${id}, '${createdBy}'
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

  static createLogWithCommentOfferAjustByDigitalRequest(description, comment, createdBy, id) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.BitacoraAjusteCalculo (
          "descripcion", "comentario", "fk_id_Lista", "createdBy"
        )
      VALUES (
        '${description}', '${comment}', ${id}, '${createdBy}'
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

  static createLogEquipmentBaseOfferAjust(values, idLog) {
    const {
      id,
      byServices,
      byServicesRemaining,
      shippingPercent,
      upliftPercent,
      finPercent,
      provision
    } = values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.AjusteCalculoEquiposBase (
          "byServicesOld", "byServicesNew", "byServicesRemainingOld", "byServicesRemainingNew", "shippingPercentOld", "shippingPercentNew", "upliftPercentOld", "upliftPercentNew", "finPercentOld", "finPercentNew", "provisionOld", "provisionNew", "fk_id_Bitacora"
        )
      SELECT
        "byServices", ${byServices}, "byServicesRemaining", ${byServicesRemaining}, "shippingPercent", ${shippingPercent}, "upliftPercent", ${upliftPercent}, "finPercent", ${finPercent}, "provision", ${provision}, ${idLog}
      FROM
        critical_parts_db.CalculoEquiposBase
      WHERE
        "id_CalculoEquiposBase" = ${id} AND "activo" = 1 returning *;`;
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

  static createLogServicesTssOfferAjust(values, idLog) {
    const {
      id,
      viatic,
      upliftPercent,
      finPercent,
      provision
    } = values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.AjusteCalculoServiciosTss (
          "upliftPercentOld", "upliftPercentNew", "finPercentOld", "finPercentNew", "viaticOld", "viaticNew", "provisionOld", "provisionNew", "fk_id_Bitacora"
        )
      SELECT
        "upliftPercent", ${upliftPercent}, "finPercent", ${finPercent}, "viatic", ${viatic}, "provision", ${provision}, ${idLog}
      FROM
        critical_parts_db.CalculoServicios
      WHERE
        "id_CalculoServicios" = ${id} AND "activo" = 1 returning *;`;
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

  static createLogSparePartsOfferAjust(values, idLog) {
    const {
      id_CalculoSparePartes,
      shippingPercent,
      upliftPercent,
      finPercent,
      provision,
      interest
    } = values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.AjusteCalculoSparePartes (
          "shippingPercentOld", "shippingPercentNew", "upliftPercentOld", "upliftPercentNew", "finPercentOld", "finPercentNew", "provisionOld", "provisionNew", "interestOld", "interestNew", "fk_id_Bitacora"
        )
      SELECT
        "shippingPercent", ${shippingPercent}, "upliftPercent", ${upliftPercent}, "finPercent", ${finPercent}, "provision", ${provision}, "interest", ${interest}, ${idLog}
      FROM
        critical_parts_db.CalculoSparePartes
      WHERE
        "id_CalculoSparePartes" = ${id_CalculoSparePartes} AND "activo" = 1 returning *;`;
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

  static updateEquipmentsBaseAjustByID(values) {
    const {
      id,
      byServices,
      byServicesRemaining,
      shippingPercent,
      upliftPercent,
      finPercent,
      provision
    } = values;
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.CalculoEquiposBase
      SET
        "byServices" = ${byServices},
        "byServicesRemaining" = ${byServicesRemaining},
        "shippingPercent" = ${shippingPercent},
        "upliftPercent" = ${upliftPercent},
        "finPercent" = ${finPercent},
        "provision" = ${provision},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_CalculoEquiposBase" = ${id} AND "activo" = 1 returning *;`;
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

  static updateServicesTssAjustByID(values) {
    const {
      id,
      viatic,
      upliftPercent,
      finPercent,
      provision
    } = values;
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.CalculoServicios
      SET
        "upliftPercent" = ${upliftPercent},
        "finPercent" = ${finPercent},
        "viatic" = ${viatic},
        "provision" = ${provision},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_CalculoServicios" = ${id} AND "activo" = 1 returning *;`;
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

  static updateSparePartsAjustByID(values) {
    const {
      id_CalculoSparePartes,
      shippingPercent,
      upliftPercent,
      finPercent,
      provision,
      interest
    } = values;
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.CalculoSparePartes
      SET
        "shippingPercent" = ${shippingPercent},
        "upliftPercent" = ${upliftPercent},
        "finPercent" = ${finPercent},
        "provision" = ${provision},
        "interest" = ${interest},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_CalculoSparePartes" = ${id_CalculoSparePartes} AND "activo" = 1 returning *;`;
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

  static updateStatusPricingListByID(status, id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.ListaPricing
      SET
        "estado" = ${status},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Lista" = ${id} returning *;`;
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

  static getAllMasterDataVariableByID(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        M."id_MasterData" AS "id",
        M."descripcion" AS "description",
        M."variable" AS "variable",
        M."valor" AS "value",
        M."tipo" AS "type",
        M."activo" AS "active",
        M."createdAt",
        M."updatedAt"
      FROM
        critical_parts_db.MasterData M
      WHERE
        M."id_MasterData" = ${id} AND M."activo" = 1;`;
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

  static createLogMasterDataVariable(description, userID, username, name, value, id) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.MasterDataLogs (
          "accion", "valorAnterior", "valorNuevo", "idColaborador", "nombreUsuario", "colaborador", "fk_idMasterData"
        )
      SELECT
        '${description}', "valor", ${value}, ${userID}, '${username}', '${name}', ${id}
      FROM
        critical_parts_db.MasterData
      WHERE
        "id_MasterData" = ${id} AND "activo" = 1 returning *;`;
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

  static updateMasterDataVariableByID(value, id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.MasterData
      SET
        "valor" = ${value},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_MasterData" = ${id} returning *;`;
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