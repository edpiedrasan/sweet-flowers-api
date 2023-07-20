/* eslint-disable max-params */
import { runQuery } from "../posgreSQL";

export default class POSTGRESQL {

  constructor() { }

  static getAllInformationDigitalRequests(countries) {
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
        R."pais" AS "country",
        CASE WHEN (R."equiposDentroRadio" IS NULL) THEN 0 ELSE R."equiposDentroRadio" END AS "amountOfEquipmentIn",
        CASE WHEN (R."equiposFueraRadio" IS NULL) THEN 0 ELSE R."equiposFueraRadio" END AS "amountOfEquipmentOut",
        R."notasUbicacion" AS "localtionNotes",
        TS."nombre" AS "typeSupport",
        MN."nombre" AS "businessModel",
        R."fk_id_ModeloDeNegocio" AS "idBusinessModel",
        --CASE WHEN (TSC."nombre" IS NULL) THEN 'N/A' ELSE TSC."nombre" END AS "typeSupportCisco",
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
        critical_parts_db.ModeloDeNegocio MN
      ON
        R."fk_id_ModeloDeNegocio" = MN."id_ModeloDeNegocio"
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
        R."activo" = 1 AND R."pais" IN (${countries.map((country) => `'${country}'`)})
      ORDER BY
        R."id_Requerimiento" DESC;`;
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

  static getYearsDigitalRequests() {
    return new Promise((resolve, reject) => {
      const query = `select distinct TO_CHAR(r."createdAt", 'yyyy') as year from critical_parts_db.requerimientos r where r."activo" = 1;`;
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

  static getCountriesDigitalRequests() {
    return new Promise((resolve, reject) => {
      const query = `select distinct
          r."pais" as "countryCode",
          CASE
            WHEN r."pais" = 'CR' THEN 'Costa Rica'
            WHEN r."pais" = 'SV' THEN 'El Salvador'
            WHEN r."pais" = 'GT' THEN 'Guatemala'
            WHEN r."pais" = 'HN' THEN 'Honduras'
            WHEN r."pais" = 'MD' THEN 'Miami'
            WHEN r."pais" = 'NI' THEN 'Nicaragua'
            WHEN r."pais" = 'PA' THEN 'Panamá'
            WHEN r."pais" = 'DO' OR r."pais" = 'DR' THEN 'República Dominicana'
          END AS "countryName"
      from
          critical_parts_db.requerimientos r
      where
          r."activo" = 1;`;
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

  static getAmountDigitalRequestCreated(year, countries) {
    return new Promise((resolve, reject) => {
      const query = `select
        count(*) as total
      from
        critical_parts_db.requerimientos r
      where
        r."activo" = 1 and
        TO_CHAR(r."createdAt", 'yyyy') = '${year}' and
        r."pais" in(${countries.map((row) => `'${row}'`)});`;
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

  static getAmountDigitalRequestCreatedMonth(year, countries) {
    return new Promise((resolve, reject) => {
      const query = `select
        count(*) as total
      from
        critical_parts_db.requerimientos r
      where
        r."activo" = 1 and
        TO_CHAR(r."createdAt", 'yyyy') = '${year}' and
        date_part('month', r."createdAt") = date_part('month', current_date) and
        r."pais" in(${countries.map((row) => `'${row}'`)});`;
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

  static getAmountDigitalRequestWon(year, countries) {
    return new Promise((resolve, reject) => {
      const query = `select count(*) as total from critical_parts_db.requerimientos r where r."activo" = 1 and r.estado = 14 and TO_CHAR(r."updatedAt", 'yyyy') = '${year}' and r."pais" in(${countries.map((row) => `'${row}'`)});`;
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

  static getAmountDigitalRequestWonMonth(year, countries) {
    return new Promise((resolve, reject) => {
      const query = `select
        count(*) as total
      from
        critical_parts_db.requerimientos r
      where
        r."activo" = 1 and
        r.estado = 14 and
        TO_CHAR(r."updatedAt", 'yyyy') = '${year}' and
        date_part('month', r."updatedAt") = date_part('month', current_date) and
        r."pais" in(${countries.map((row) => `'${row}'`)});`;
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

  static getAmountDigitalRequestReject(year, countries) {
    return new Promise((resolve, reject) => {
      const query = `select count(*) as total from critical_parts_db.requerimientos r where r."activo" = 1 and r.estado = 13 and TO_CHAR(r."updatedAt", 'yyyy') = '${year}' and r."pais" in(${countries.map((row) => `'${row}'`)});`;
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

  static getAmountDigitalRequestRejectMonth(year, countries) {
    return new Promise((resolve, reject) => {
      const query = `select
        count(*) as total
      from
        critical_parts_db.requerimientos r
      where
        r."activo" = 1 and
        r.estado = 13 and
        TO_CHAR(r."updatedAt", 'yyyy') = '${year}' and
        date_part('month', r."updatedAt") = date_part('month', current_date) and
        r."pais" in(${countries.map((row) => `'${row}'`)});`;
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

  static getAllDigitalRequestByMonth(year, countries) {
    return new Promise((resolve, reject) => {
      const query = `select
        date_part('month', r."createdAt") as "month",
        count(*) as "total"
      from
      critical_parts_db.requerimientos r
      where
        r.activo = 1 and
        TO_CHAR(r."createdAt", 'yyyy') = '${year}' and
        r."pais" in(${countries.map((row) => `'${row}'`)})
      group by
        date_part('month', r."createdAt")
      order by
        date_part('month', r."createdAt") asc;`;
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

  static getAllDigitalRequestWonByMonth(year, countries) {
    return new Promise((resolve, reject) => {
      const query = `select
        date_part('month', r."updatedAt") as "month",
        count(*) as "total"
      from
      critical_parts_db.requerimientos r
      where
        r.activo = 1 and
        r.estado = 14 and
        TO_CHAR(r."updatedAt", 'yyyy') = '${year}' and
        r."pais" in(${countries.map((row) => `'${row}'`)})
      group by
        date_part('month', r."updatedAt")
      order by
        date_part('month', r."updatedAt") asc;`;
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

  static getAllDigitalRequestRejectByMonth(year, countries) {
    return new Promise((resolve, reject) => {
      const query = `select
        date_part('month', r."updatedAt") as "month",
        count(*) as "total"
      from
      critical_parts_db.requerimientos r
      where
        r.activo = 1 and
        r.estado = 13 and
        TO_CHAR(r."updatedAt", 'yyyy') = '${year}' and
        r."pais" in(${countries.map((row) => `'${row}'`)})
      group by
        date_part('month', r."updatedAt")
      order by
        date_part('month', r."updatedAt") asc;`;
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