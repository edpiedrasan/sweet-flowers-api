/* eslint-disable max-params */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
import { runQuery } from "../posgreSQL";

export default class POSTGRESQL {
  constructor() {}

  static getDigitalRequestInQuotationStatus() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        R."id_Requerimiento" AS "id",
        CASE
          WHEN R."estado" = 0 THEN 'Levantamiento Iniciado'
          WHEN R."estado" = 1 THEN 'Equipos Agregados'
          WHEN R."estado" = 2 THEN 'Pendiente de asignación de Equipos'
          WHEN R."estado" = 3 THEN 'Pendiente de asignación de Equipos y Partes'
          WHEN R."estado" = 4 THEN 'Pendiente de asignación de Partes'
          WHEN R."estado" = 5 THEN 'En Espera de la Configuración'
          WHEN R."estado" = 6 THEN 'En Validación de Partes'
          WHEN R."estado" = 7 THEN 'En Cotización de Partes'
          WHEN R."estado" = 8 THEN 'Cotización Completada'
          WHEN R."estado" = 9 THEN 'Pendiente de validar por JTR'
          WHEN R."estado" = 10 THEN 'Ajuste de Oferta Pendiente'
          WHEN R."estado" = 11 THEN 'Ajuste de Oferta Rechazado'
          WHEN R."estado" = 12 THEN 'Ajuste de Oferta Completado'
          WHEN R."estado" = 13 THEN 'Oferta no Considerada'
          WHEN R."estado" = 14 THEN 'Oferta Ganada'
          WHEN R."estado" = 15 THEN 'Validación de Partes Rechazado'
        END AS "status",
        R."estado" AS "state",
        CASE
          WHEN R."estado" = 0 OR R."estado" = 5 OR R."estado" = 9 THEN 'bg-warning'
          WHEN R."estado" = 1 OR R."estado" = 3 OR R."estado" = 4 THEN 'bg-info'
          WHEN R."estado" = 2 OR R."estado" = 7 OR R."estado" = 8 OR R."estado" = 12 OR R."estado" = 14 OR R."estado" = 15 THEN 'bg-success'
          WHEN R."estado" = 6 OR R."estado" = 10 OR R."estado" = 11 OR R."estado" = 13 THEN 'bg-danger'
        END AS "color",
        CAST(R."numeroVersion" AS CHAR(10)) AS "version",
        R."numeroOportunidad" AS "opportunityNumber",
        R."nombreCliente" AS "customer",
        R."nombreRepresentanteVentas" AS "salesRep",
        R."nombreEjecutivoSolicitud" AS "requestedExecutive",
        R."cantidadEquipos" AS "amountOfEquipment",
        R."notasSolicitud" AS "applicationNotes",
        CASE WHEN (R."equiposDentroRadio" IS NULL) THEN 0 ELSE R."equiposDentroRadio" END AS "amountOfEquipmentIn",
        CASE WHEN (R."equiposFueraRadio" IS NULL) THEN 0 ELSE R."equiposFueraRadio" END AS "amountOfEquipmentOut",
        R."notasUbicacion" AS "localtionNotes",
        TS."nombre" AS "typeSupport",
        CASE WHEN (TSO."nombre" IS NULL) THEN 'N/A' ELSE TSO."nombre" END AS "operatingSystemType",
        HA."nombre" AS "officeHours",
        TR."nombre" AS "responseTime",
        TCP."nombre" AS "timeChangePart",
        VS."nombre" AS "validityService",
        CASE WHEN TCP."id_TiempoCambioParte" != 4 THEN 'SÍ' ELSE 'NO' END AS "criticalParts",
        PS."nombre" AS "wayPay",
        TU."nombre" AS "locationType",
        CASE WHEN (CSD."nombre" IS NULL) THEN 'N/A' ELSE CSD."nombre" END AS "distanceInside",
        CASE WHEN (CSF."nombre" IS NULL) THEN 'N/A' ELSE CSF."nombre" END AS "distanceOutside",
        CM."nombre" AS "amountMaintenance",
        HM."nombre" AS "scheduleMaintenance",
        R."createdBy",
        R."createdAt",
        R."updatedAt"
      FROM
        critical_parts_db.Requerimientos R
      LEFT JOIN
        critical_parts_db.TipoSoporte TS
      ON
        R."fk_id_TipoSoporte" = TS."id_TipoSoporte"
      LEFT JOIN
        critical_parts_db.TipoSistemaOperativo TSO
      ON
        R."fk_id_SistemaOperativo" = TSO."id_SistemaOperativo"
      LEFT JOIN
        critical_parts_db.HorarioAtencion HA
      ON
        R."fk_id_HorarioAtencion" = HA."id_HorarioAtencion"
      LEFT JOIN
        critical_parts_db.TiempoRespuesta TR
      ON
        R."fk_id_TiempoRespuesta" = TR."id_TiempoRespuesta"
      LEFT JOIN
        critical_parts_db.TiempoCambioParte TCP
      ON
        R."fk_id_TiempoCambioParte" = TCP."id_TiempoCambioParte"
      LEFT JOIN
        critical_parts_db.VigenciaServicio VS
      ON
        R."fk_id_VigenciaServicio" = VS."id_VigenciaServicio"
      LEFT JOIN
        critical_parts_db.FormaPagoServicio PS
      ON
        R."fk_id_FormaPagoServicio" = PS."id_FormaPagoServicio"
      LEFT JOIN
        critical_parts_db.TipoUbicacion TU
      ON
        R."fk_id_TipoUbicacion" = TU."id_TipoUbicacion"
      LEFT JOIN
        critical_parts_db.DistanciaCentroServicio CSD
      ON
        R."fk_id_DistanciaDentro" = CSD."id_Distancia"
      LEFT JOIN
        critical_parts_db.DistanciaCentroServicio CSF
      ON
        R."fk_id_DistanciaFuera" = CSF."id_Distancia"
      LEFT JOIN
        critical_parts_db.CantidadMantenimiento CM
      ON
        R."fk_id_CantidadMantenimiento" = CM."id_CantidadMantenimiento"
      LEFT JOIN
        critical_parts_db.HorarioMantenimiento HM
      ON
        R."fk_id_HorarioMantenimiento" = HM."id_HorarioMantenimiento"
      WHERE
        R."activo" = 1 AND R."estado" = 7
      ORDER BY
        R."updatedAt" DESC;`;
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

  static getAllDigitalRequestInQuotation() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        R."id_Requerimiento" AS "id",
        L."id_Lista" AS "idList",
        CASE
          WHEN L."estado" = 0 THEN 'En Cotización de Partes'
          WHEN L."estado" = 1 THEN 'Cotización Completada'
        END AS "status",
        L."estado" AS "state",
        CASE
          WHEN L."estado" = 0 THEN 'bg-warning'
          WHEN L."estado" = 1 THEN 'bg-success'
        END AS "color",
        CAST(R."numeroVersion" AS CHAR(10)) AS "version",
        R."numeroOportunidad" AS "opportunityNumber",
        R."nombreCliente" AS "customer",
        R."createdBy",
        R."createdAt",
        R."updatedAt"
      FROM
        critical_parts_db.Requerimientos R
      INNER JOIN
        critical_parts_db.ListaInventarios L
      ON
        R."id_Requerimiento" = L."fk_id_Requerimiento"
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

  static getInfoDigitalRequestInQuotation(idBusinessModel, idRequest) {
    return new Promise((resolve, reject) => {
      const query =
        idBusinessModel === 1
          ? `SELECT
        *
      FROM (
        SELECT
          ROW_NUMBER() OVER(ORDER BY PC."id_PartesCriticas" ASC) as "rowNumber",
          T.rows AS "counts",
          P."id_PartesEquipoIBM" AS "id",
          P."fk_idParteCritica" AS "idCriticalPart",
          P."fk_idEquipo" AS "idEquipment",
          E."tipoModelo" AS "typeModel",
          E."cantidadEquipos" AS "amountEquipments",
          PC."plataforma" AS "platform",
          PC."categoria" AS "category",
          PC."descripcion" AS "description",
          P."frus" AS "fru",
          P."cantidad" AS "amount",
          CASE WHEN P."sustituto1" = 'null' THEN 'N/A' ELSE P."sustituto1" END AS "substitute1",
          CASE WHEN P."sustituto2" = 'null' THEN 'N/A' ELSE P."sustituto2" END AS "substitute2",
          CASE WHEN P."sustituto3" = 'null' THEN 'N/A' ELSE P."sustituto3" END AS "substitute3",
          P."costo" AS "cost",
          P."fk_id_Requerimiento" AS "idRequest",
          P."activo" AS "active",
          P."createdBy",
          P."updatedBy",
          P."createdAt",
          P."updatedAt"
        FROM
          critical_parts_db.PartesEquipoIBM P
        JOIN
          (SELECT COUNT(*) as rows, "fk_idEquipo" as id, "fk_id_Requerimiento" as idRequest FROM critical_parts_db.PartesEquipoIBM WHERE "activo" = 1 GROUP BY "fk_idEquipo", "fk_id_Requerimiento") AS T
        ON
          T.id = P."fk_idEquipo" AND T.idRequest = P."fk_id_Requerimiento"
        INNER JOIN
          critical_parts_db.CantidadEquiposIBM E
        ON
          P."fk_idEquipo" = E."id_CantidadEquipos"
        INNER JOIN
          critical_parts_db.PartesCriticas PC
        ON
          P."fk_idParteCritica" = PC."id_PartesCriticas"
        INNER JOIN
          critical_parts_db.Requerimientos R
        ON
          E."fk_id_Requerimiento" = R."id_Requerimiento"
        WHERE
          R."id_Requerimiento" = ${idRequest} AND P."fk_id_Requerimiento" = ${idRequest} AND R."activo" = 1 AND P."activo" = 1
        ORDER BY
          P."fk_idEquipo" ASC, E."tipoModelo" ASC
      ) AS T;`
          : `SELECT
        *
      FROM (
        SELECT
          ROW_NUMBER() OVER(ORDER BY PC."id_PartesCriticas" ASC) as "rowNumber",
          T.rows AS "counts",
          P."id_PartesEquipoIBM" AS "id",
          P."fk_idParteCritica" AS "idCriticalPart",
          P."fk_idEquipo" AS "idEquipment",
          E."tipoModelo" AS "typeModel",
          E."cantidadEquipos" AS "amountEquipments",
          PC."plataforma" AS "platform",
          PC."categoria" AS "category",
          PC."descripcion" AS "description",
          P."frus" AS "fru",
          P."cantidad" AS "amount",
          P."sustituto1" AS "substitute1",
          P."sustituto2" AS "substitute2",
          P."sustituto3" AS "substitute3",
          P."costo" AS "cost",
          P."activo" AS "active",
          P."createdBy",
          P."updatedBy",
          P."createdAt",
          P."updatedAt"
        FROM
          critical_parts_db.PartesEquipoIBM P
        JOIN
          (SELECT COUNT(*) as rows, "fk_idEquipo" as id, "fk_id_Requerimiento" as idRequest FROM critical_parts_db.PartesEquipoIBM WHERE "activo" = 1 GROUP BY "fk_idEquipo", "fk_id_Requerimiento") AS T
        ON
          T.id = P."fk_idEquipo" AND T.idRequest = P."fk_id_Requerimiento"
        INNER JOIN
          critical_parts_db.EquiposIBM E
        ON
          P."fk_idEquipo" = E."id_Equipo"
        INNER JOIN
          critical_parts_db.PartesCriticas PC
        ON
          P."fk_idParteCritica" = PC."id_PartesCriticas"
        INNER JOIN
          critical_parts_db.Requerimientos R
        ON
          E."fk_id_Requerimiento" = R."id_Requerimiento"
        WHERE
          R."id_Requerimiento" = ${idRequest} AND P."fk_id_Requerimiento" = ${idRequest} AND R."activo" = 1 AND P."activo" = 1
        ORDER BY
          P."fk_idEquipo" ASC, E."tipoModelo" ASC
      ) AS T;`;
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

  static getFilesByDigitalRequestInQuotation(idList) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          *
      FROM
          critical_parts_db.referenciainventario r
      WHERE
          r."fk_id_Lista" = ${idList};`;
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

  static getCommentaryByDigitalRequestInQuotation(idList) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          *
      FROM
          critical_parts_db.ComentariosInventario C
      WHERE
          C."fk_id_Lista" = ${idList};`;
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

  static createCommentaryByDigitalRequestInQuotation(
    commentary,
    idList,
    createdBy
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.ComentariosInventario (
          "comentario", "fk_id_Lista", "createdBy"
        )
      VALUES (
        '${commentary}', ${idList}, '${createdBy}'
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

  static updateSustitutesAndCostByPartsEquipments(
    cost,
    sustitute1,
    sustitute2,
    sustitute3,
    updatedBy,
    idPart
  ) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.PartesEquipoIBM
      SET
        "sustituto1" = '${sustitute1}',
        "sustituto2" = '${sustitute2}',
        "sustituto3" = '${sustitute3}',
        "costo" = ${cost},
        "updatedBy" = '${updatedBy}',
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_PartesEquipoIBM" = ${idPart} AND "activo" = 1 returning *;`;
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

  static createReferencesByDigitalRequestInQuotation(
    name,
    encoding,
    mimetype,
    path,
    idList,
    createdBy
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.ReferenciaInventario (
          "nombre", "codificacion", "tipo", "ruta", "fk_id_Lista", "createdBy"
        )
      VALUES (
        '${name}', '${encoding}', '${mimetype}', '${path}', ${idList}, '${createdBy}'
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

  static deactivateReferenceByDigitalRequestInQuotation(idReference) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.ReferenciaInventario
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_ReferenciaInventario" = ${idReference} returning *;`;
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

  static getDigitalRequestInQuotationEscalation() {
    return new Promise((resolve, reject) => {
      const query = `select
        *
      from
      critical_parts_db.listainventarios L
      where
        L.estado = 0 and L."activo" = 1 and
        (L."createdAt" + '1 day') < NOW();`;
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
