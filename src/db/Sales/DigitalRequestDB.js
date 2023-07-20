/* eslint-disable max-lines */
/* eslint-disable no-dupe-class-members */
/* eslint-disable max-params */
/* eslint-disable no-nested-ternary */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
import { runQuery } from "../posgreSQL";

export default class POSTGRESQL {
  constructor() {}

  static getRequestByOpportunityNumber(opp) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        *
      FROM
        critical_parts_db.Requerimientos R
      WHERE
        R."numeroOportunidad" = ${opp} AND R."activo" = 1;`;
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

  static getTypeSupportsAvailble() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        TS."id_TipoSoporte" AS "id",
        TS."nombre" AS "name"
      FROM
        critical_parts_db.TipoSoporte TS
      WHERE
        TS."activo" = 1;`;
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

  static getBusinessModelsAvailble() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        MN."id_ModeloDeNegocio" AS "id",
        MN."nombre" AS "name"
      FROM
        critical_parts_db.ModeloDeNegocio MN
      WHERE
        MN."activo" = 1;`;
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

  static getOperatingSystemTypeAvailble() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        SO."id_SistemaOperativo" AS "id",
        SO."nombre" AS "name"
      FROM
        critical_parts_db.TipoSistemaOperativo SO
      WHERE
        SO."activo" = 1;`;
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

  static getOfficeHoursAvailble() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        HA."id_HorarioAtencion" AS "id",
        HA."nombre" AS "name"
      FROM
        critical_parts_db.HorarioAtencion HA
      WHERE
        HA."activo" = 1;`;
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

  static getResponseTimeAvailble() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        TR."id_TiempoRespuesta" AS "id",
        TR."nombre" AS "name"
      FROM
        critical_parts_db.TiempoRespuesta TR
      WHERE
        TR."activo" = 1;`;
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

  static getTimeChangePartAvailble() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        TCP."id_TiempoCambioParte" AS "id",
        TCP."nombre" AS "name"
      FROM
        critical_parts_db.TiempoCambioParte TCP
      WHERE
        TCP."activo" = 1;`;
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

  static getValidityServiceAvailble() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        VS."id_VigenciaServicio" AS "id",
        VS."nombre" AS "name"
      FROM
        critical_parts_db.VigenciaServicio VS
      WHERE
        VS."activo" = 1;`;
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

  static getWayPayAvailble() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        FPS."id_FormaPagoServicio" AS "id",
        FPS."nombre" AS "name"
      FROM
        critical_parts_db.FormaPagoServicio FPS
      WHERE
        FPS."activo" = 1;`;
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

  static getPhysicalLocationAvailble() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        TU."id_TipoUbicacion" AS "id",
        TU."nombre" AS "name"
      FROM
        critical_parts_db.TipoUbicacion TU
      WHERE
        TU."activo" = 1;`;
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

  static getEquipmentServiceCenterAvailble() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        DCS."id_Distancia" AS "id",
        DCS."nombre" AS "name",
        DCS."tipo" AS "type"
      FROM
        critical_parts_db.DistanciaCentroServicio DCS
      WHERE
        DCS."activo" = 1;`;
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

  static getAmountMaintenanceAvailble() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        CM."id_CantidadMantenimiento" AS "id",
        CM."nombre" AS "name"
      FROM
        critical_parts_db.CantidadMantenimiento CM
      WHERE
        CM."activo" = 1;`;
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

  static getScheduleMaintenanceAvailble() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        HM."id_HorarioMantenimiento" AS "id",
        HM."nombre" AS "name"
      FROM
        critical_parts_db.HorarioMantenimiento HM
      WHERE
        HM."activo" = 1;`;
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

  static getAutomaticRenewalAvailble() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        RA."id_RenovacionAutomatica" AS "id",
        RA."nombre" AS "name"
      FROM
        critical_parts_db.RenovacionAutomatica RA
      WHERE
        RA."activo" = 1;`;
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

  static getPracticesAvailble() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        P."id_Practica" AS "id",
        P."descripcion" AS "description",
        P."practica" AS "name",
        P."preventivos" AS "prevents"
      FROM
        critical_parts_db.Practica P
      WHERE
        P."activo" = 1;`;
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

  static getPlatformsAvailble() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        P."id_Plataforma" AS "id",
        P."plataforma" AS "name",
        P."fk_id_Practica" AS "fk_idPractice"
      FROM
        critical_parts_db.PlataformaPractica P
      WHERE
        P."activo" = 1;`;
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

  static getIncludesPartsAvailble() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        IP."id_IncluyePartesEquipos" AS "id",
        IP."nombre" AS "name"
      FROM
        critical_parts_db.IncluyePartesEquipos IP
      WHERE
        IP."activo" = 1;`;
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

  static getCoverageLevelAvailble() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        NC."id_NivelCobertura" AS "id",
        NC."nombre" AS "name"
      FROM
        critical_parts_db.NivelCobertura NC
      WHERE
        NC."activo" = 1;`;
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

  static getDigitalRequestByUser(createdBy) {
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
        R."activo" = 1 AND LOWER(R."createdBy") = LOWER('${createdBy}')
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

  static getDigitalRequestCreatedByID(id) {
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
          WHEN R."estado" = 10 THEN 'Pendiente de Ajuste Princing'
          WHEN R."estado" = 11 THEN 'Oferta no Considerada'
          WHEN R."estado" = 12 THEN 'Oferta Ganada'
        END AS "status",
        R."estado" AS "state",
        CASE
          WHEN R."estado" = 0 OR R."estado" = 5 OR R."estado" = 9 THEN 'bg-warning'
          WHEN R."estado" = 1 OR R."estado" = 3 OR R."estado" = 4 THEN 'bg-info'
          WHEN R."estado" = 2 OR R."estado" = 7 OR R."estado" = 8 OR R."estado" = 12 THEN 'bg-success'
          WHEN R."estado" = 6 OR R."estado" = 10 OR R."estado" = 11 THEN 'bg-danger'
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
        CASE WHEN R."fk_id_TiempoCambioParte" != 4 THEN 1 ELSE 0 END AS "criticalParts",
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
      WHERE R."id_Requerimiento" = ${id};`;
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

  static getActivitiesFlowByDigitalRequest(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        FA."id_FlujoActividades" AS "id",
        FA."descripcion" AS "description",
        FA."estado" AS "status",
        CASE
          WHEN FA."estado" = 'Iniciado' OR FA."estado" = 'Pendiente' THEN 'fas fa-info-circle'
          WHEN FA."estado" LIKE 'Equipos%' THEN 'fas fa-desktop'
          WHEN FA."estado" = 'Completado' THEN 'fas fa-check'
          WHEN FA."estado" = 'Asignación Pendiente' THEN 'fas fa-user-clock'
          WHEN FA."estado" = 'Asignación Completada' THEN 'fas fa-user-check'
          WHEN FA."estado" = 'Configuración Cargada' THEN 'fas fa-file-upload'
          WHEN FA."estado" = 'Validación Completada' THEN 'fas fa-tasks'
          WHEN FA."estado" = 'Cotización Completada' THEN 'fas fa-money-check-alt'
          WHEN FA."estado" = 'Ajuste en la oferta' THEN 'ni ni-settings'
          WHEN FA."estado" = 'Ajuste Finalizado' THEN 'fas fa-tasks'
          WHEN FA."estado" = 'Oferta Ganada' THEN 'ni ni-money-coins'
          WHEN FA."estado" = 'Ajuste Rechazado' THEN 'fas fa-times'
          WHEN FA."estado" = 'Devolución de Validación' THEN 'fas fa-times'
          WHEN FA."estado" = 'Validación Rechazada' THEN 'fas fa-times'
          WHEN FA."estado" = 'Nota Creada' THEN 'fas fa-file-signature'
        END AS "icon",
        CASE
          WHEN FA."estado" = 'Iniciado' OR FA."estado" = 'Pendiente' OR FA."estado" = 'Nota Creada' THEN 'warning'
          WHEN FA."estado" LIKE 'Equipos%' THEN 'primary'
          WHEN
            FA."estado" = 'Completado' OR
            FA."estado" = 'Asignación Completada' OR
            FA."estado" = 'Validación Completada' OR
            FA."estado" = 'Oferta Ganada' OR
            FA."estado" = 'Configuración Cargada' OR
            FA."estado" = 'Ajuste Finalizado' THEN 'success'
          WHEN
            FA."estado" = 'Asignación Pendiente' OR
            FA."estado" = 'Cotización Completada' OR
            FA."estado" = 'Ajuste en la oferta' OR
            FA."estado" = 'Validación Rechazada' OR
            FA."estado" = 'Devolución de Validación' OR
            FA."estado" = 'Ajuste Rechazado' THEN 'danger'
        END AS "color",
        FA."createdBy",
        FA."createdAt",
        FA."updatedAt"
      FROM
      critical_parts_db.FlujoActividades FA
      WHERE
        FA."fk_id_Requerimiento" = ${id}
      ORDER BY
        FA."id_FlujoActividades" DESC;`;
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

  static getEquipmentIBMByID(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        TS."id_Equipo" AS "id",
        CASE
          WHEN TS."pais" = 'CR' THEN 'Costa Rica'
          WHEN TS."pais" = 'SV' THEN 'El Salvador'
          WHEN TS."pais" = 'GT' THEN 'Guatemala'
          WHEN TS."pais" = 'HN' THEN 'Honduras'
          WHEN TS."pais" = 'MD' THEN 'Miami'
          WHEN TS."pais" = 'NI' THEN 'Nicaragua'
          WHEN TS."pais" = 'PA' THEN 'Panamá'
          WHEN TS."pais" = 'DO' THEN 'República Dominicana'
        END AS "country",
        TS."tipoModelo" AS "typeModel",
        TS."serial",
        TS."cantidadMantenimientos" AS "amountMaintenance",
        TS."cantidadEquipos" AS "amountEquipments",
        TS."garantiaVigente" AS "validWarranty",
        TS."viaticos" AS "viatic",
        TS."precio" AS "price",
        P."practica" AS "practice",
        TS."fk_id_Practica" AS "idPractice",
        PP."plataforma" AS "platform",
        TS."fk_id_Plataforma" AS "idPlatform",
        HA."nombre" AS "officeHour",
        TS."fk_id_HorarioAtencion" AS "idOfficeHours",
        TCP."nombre" AS "timeChangePart",
        TS."fk_id_TiempoCambioParte" AS "idTimeChangePart",
        VS."nombre" AS "validityService",
        TS."fk_id_VigenciaServicio" AS "idValidityService",
        RA."nombre" AS "automaticRenewal",
        TS."fk_id_RenovacionAutomatica" AS "idAutomaticRenewal",
        IPE."nombre" AS "equipmentParts",
        TS."fk_id_IncluyePartesEquipos" AS "idEquipmentParts",
        TS."fk_id_Requerimiento" AS "idRequest"
      FROM
        critical_parts_db.EquiposIBM TS
      INNER JOIN
        critical_parts_db.Practica P
      ON
        TS."fk_id_Practica" = P."id_Practica"
      INNER JOIN
        critical_parts_db.PlataformaPractica PP
      ON
        TS."fk_id_Plataforma" = PP."id_Plataforma"
      INNER JOIN
        critical_parts_db.HorarioAtencion HA
      ON
        TS."fk_id_HorarioAtencion" = HA."id_HorarioAtencion"
      INNER JOIN
        critical_parts_db.TiempoCambioParte TCP
      ON
        TS."fk_id_TiempoCambioParte" = TCP."id_TiempoCambioParte"
      INNER JOIN
        critical_parts_db.VigenciaServicio VS
      ON
        TS."fk_id_VigenciaServicio" = VS."id_VigenciaServicio"
      INNER JOIN
        critical_parts_db.RenovacionAutomatica RA
      ON
        TS."fk_id_RenovacionAutomatica" = RA."id_RenovacionAutomatica"
      INNER JOIN
        critical_parts_db.IncluyePartesEquipos IPE
      ON
        TS."fk_id_IncluyePartesEquipos" = IPE."id_IncluyePartesEquipos"
      WHERE
        TS."id_Equipo" = ${id};`;
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

  static getEquipmentsIBMByDigitalRequest(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        E."id_Equipo" AS "id",
        CASE
          WHEN E."pais" = 'CR' THEN 'Costa Rica'
          WHEN E."pais" = 'SV' THEN 'El Salvador'
          WHEN E."pais" = 'GT' THEN 'Guatemala'
          WHEN E."pais" = 'HN' THEN 'Honduras'
          WHEN E."pais" = 'MD' THEN 'Miami'
          WHEN E."pais" = 'NI' THEN 'Nicaragua'
          WHEN E."pais" = 'PA' THEN 'Panamá'
          WHEN E."pais" = 'DO' THEN 'República Dominicana'
        END AS "country",
        E."tipoModelo" AS "typeModel",
        E."serial" as "serial",
        E."cantidadMantenimientos" AS "amountMaintenance",
        E."cantidadEquipos" AS "amountEquipments",
        E."garantiaVigente" AS "validWarranty",
        E."viaticos" AS "viatic",
        E."precio" AS "price",
        P."practica" AS "practice",
        E."fk_id_Practica" AS "idPractice",
        PP."plataforma" AS "platform",
        E."fk_id_Plataforma" AS "idPlatform",
        --P."nombre" AS "productID",
        HA."nombre" AS "officeHour",
        E."fk_id_HorarioAtencion" AS "idOfficeHours",
        TCP."nombre" AS "timeChangePart",
        E."fk_id_TiempoCambioParte" AS "idTimeChangePart",
        VS."nombre" AS "validityService",
        E."fk_id_VigenciaServicio" AS "idValidityService",
        RA."nombre" AS "automaticRenewal",
        E."fk_id_RenovacionAutomatica" AS "idAutomaticRenewal",
        IPE."nombre" AS "equipmentParts",
        E."fk_id_IncluyePartesEquipos" AS "idEquipmentParts",
        RE."numeroOportunidad" AS "opportunityNumber"
      FROM
        critical_parts_db.EquiposIBM E
      LEFT JOIN
        critical_parts_db.Practica P
      ON
        E."fk_id_Practica" = P."id_Practica"
      LEFT JOIN
        critical_parts_db.PlataformaPractica PP
      ON
        E."fk_id_Plataforma" = PP."id_Plataforma"
      LEFT JOIN
        critical_parts_db.HorarioAtencion HA
      ON
        E."fk_id_HorarioAtencion" = HA."id_HorarioAtencion"
      LEFT JOIN
        critical_parts_db.TiempoCambioParte TCP
      ON
        E."fk_id_TiempoCambioParte" = TCP."id_TiempoCambioParte"
      LEFT JOIN
        critical_parts_db.VigenciaServicio VS
      ON
        E."fk_id_VigenciaServicio" = VS."id_VigenciaServicio"
      LEFT JOIN
        critical_parts_db.RenovacionAutomatica RA
      ON
        E."fk_id_RenovacionAutomatica" = RA."id_RenovacionAutomatica"
      LEFT JOIN
        critical_parts_db.IncluyePartesEquipos IPE
      ON
        E."fk_id_IncluyePartesEquipos" = IPE."id_IncluyePartesEquipos"
      LEFT JOIN
        critical_parts_db.Requerimientos RE
      ON
        E."fk_id_Requerimiento" = RE."id_Requerimiento"
      WHERE
        E."fk_id_Requerimiento" = ${id} AND E."activo" = 1;`;
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

  static getEquipmentsIBMCretedByDigitalRequest(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        EQ."id_Equipo" AS "id",
        CASE
          WHEN EQ."pais" = 'CR' THEN 'Costa Rica'
          WHEN EQ."pais" = 'SV' THEN 'El Salvador'
          WHEN EQ."pais" = 'GT' THEN 'Guatemala'
          WHEN EQ."pais" = 'HN' THEN 'Honduras'
          WHEN EQ."pais" = 'MD' THEN 'Miami'
          WHEN EQ."pais" = 'NI' THEN 'Nicaragua'
          WHEN EQ."pais" = 'PA' THEN 'Panamá'
          WHEN EQ."pais" = 'DO' THEN 'República Dominicana'
        END AS "country",
        EQ."tipoModelo" AS "typeModel",
        EQ."serial",
        --EQ."plataforma" AS "platform",
        EQ."cantidadMantenimientos" AS "amountMaintenance",
        EQ."cantidadEquipos" AS "amountEquipments",
        EQ."garantiaVigente" AS "validWarranty",
        EQ."viaticos" AS "viatic",
        EQ."precio" AS "price",
        -- P."plataforma" AS "productID",
        P."practica" AS "practice",
        EQ."fk_id_Practica" AS "idPractice",
        PP."plataforma" AS "platform",
        EQ."fk_id_Plataforma" AS "idPlatform",
        HA."nombre" AS "officeHour",
        EQ."fk_id_HorarioAtencion" AS "idOfficeHours",
        TCP."nombre" AS "timeChangePart",
        EQ."fk_id_TiempoCambioParte" AS "idTimeChangePart",
        VS."nombre" AS "validityService",
        EQ."fk_id_VigenciaServicio" AS "idValidityService",
        RA."nombre" AS "automaticRenewal",
        EQ."fk_id_RenovacionAutomatica" AS "idAutomaticRenewal",
        IPE."nombre" AS "equipmentParts",
        EQ."fk_id_IncluyePartesEquipos" AS "idEquipmentParts",
        RE."numeroOportunidad" AS "opportunityNumber"
      FROM
        critical_parts_db.EquiposIBM EQ
      LEFT JOIN
        critical_parts_db.Practica P
      ON
        EQ."fk_id_Practica" = P."id_Practica"
      LEFT JOIN
        critical_parts_db.PlataformaPractica PP
      ON
        EQ."fk_id_Plataforma" = PP."id_Plataforma"
      LEFT JOIN
        critical_parts_db.HorarioAtencion HA
      ON
        EQ."fk_id_HorarioAtencion" = HA."id_HorarioAtencion"
      LEFT JOIN
        critical_parts_db.TiempoCambioParte TCP
      ON
        EQ."fk_id_TiempoCambioParte" = TCP."id_TiempoCambioParte"
      LEFT JOIN
        critical_parts_db.VigenciaServicio VS
      ON
        EQ."fk_id_VigenciaServicio" = VS."id_VigenciaServicio"
      LEFT JOIN
        critical_parts_db.RenovacionAutomatica RA
      ON
        EQ."fk_id_RenovacionAutomatica" = RA."id_RenovacionAutomatica"
      LEFT JOIN
        critical_parts_db.IncluyePartesEquipos IPE
      ON
        EQ."fk_id_IncluyePartesEquipos" = IPE."id_IncluyePartesEquipos"
      LEFT JOIN
        critical_parts_db.Requerimientos RE
      ON
        EQ."fk_id_Requerimiento" = RE."id_Requerimiento"
      WHERE
        EQ."fk_id_Requerimiento" = ${id} AND EQ."activo" = 1;`;
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

  static getEquipmentsSpareByID(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        E."id_EquipoSpare" AS "id",
        E."partNumber",
        E."descripcion" AS "description",
        E."cantidadEquipos" AS "amountEquipments",
        E."costo" AS "cost",
        E."fk_id_Requerimiento" AS "idRequest",
        E."activo" AS "active",
        E."createdAt",
        E."updatedAt"
      FROM
      critical_parts_db.EquiposSpare E
      WHERE
        E."id_EquipoSpare" = ${id} AND E."activo" = 1;`;
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

  static getEquipmentsSpareByDigitalRequest(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        E."id_EquipoSpare" AS "id",
        E."partNumber",
        E."descripcion" AS "description",
        E."cantidadEquipos" AS "amountEquipments",
        E."costo" AS "cost",
        E."fk_id_Requerimiento" AS "idRequest",
        E."activo" AS "active",
        E."createdAt",
        E."updatedAt"
      FROM
      critical_parts_db.EquiposSpare E
      WHERE
        E."fk_id_Requerimiento" = ${id} AND E."activo" = 1;`;
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

  static getReferencesByDigitalRequest(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        R."id_Referencia" AS "idRerence",
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
        critical_parts_db.ReferenciasPrecios R
      WHERE
        R."fk_id_Requerimiento" = ${id}
      AND
        R."activo" = 1;`;
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

  static getReferencesSpareByDigitalRequest(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        R."id_Referencia" AS "id",
        R."nombre" AS "name",
        R."codificacion" AS "coding",
        R."tipo" AS "type",
        R."ruta" AS "path",
        R."fk_id_Requerimiento" AS "idRequest",
        R."activo" AS "active",
        R."createdBy",
        R."createdAt",
        R."updatedAt"
      FROM
        critical_parts_db.ReferenciasSpare R
      WHERE
        R."fk_id_Requerimiento" = ${id}
      AND
        R."activo" = 1;`;
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

  static getJustificationsByDigitalRequest(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        J."id_Justificacion" AS "idJustify",
        J."justificacion" AS "justify",
        J."fk_id_Requerimiento" AS "idRequest",
        J."activo" AS "active",
        J."createdBy",
        J."createdAt",
        J."updatedAt"
      FROM
        critical_parts_db.JustificacionPrecios J
      WHERE
        J."fk_id_Requerimiento" = ${id}
      AND
        J."activo" = 1;`;
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

  static getConfigurationsByDigitalRequest(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        C."id_Configuracion" AS "idConfiguration",
        C."nombre" AS "name",
        C."codificacion" AS "encoding",
        C."tipo" AS "type",
        C."ruta" AS "path",
        C."fk_id_Requerimiento" AS "idRequest",
        C."activo" AS "active",
        C."createdBy",
        C."createdAt",
        C."updatedAt"
      FROM
        critical_parts_db.Configuraciones C
      WHERE
        C."fk_id_Requerimiento" = ${id}
      AND
        C."activo" = 1;`;
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

  static getCommentsConfigurationByDigitalRequest(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        C."id_Comentario" AS "idComment",
        C."comentario" AS "comment",
        C."fk_id_Requerimiento" AS "idRequest",
        C."createdBy",
        C."createdAt",
        C."updatedAt"
      FROM
        critical_parts_db.ComentariosConfiguracion C
      WHERE
        C."fk_id_Requerimiento" = ${id}
      AND
        C."tieneConfiguracion" = 1
      AND
        C."activo" = 1;`;
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

  static getEquipmentsBaseOfferByDigitalRequest(id) {
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
        E."fk_id_Requerimiento" = ${id}
      AND
        E."activo" = 1;`;
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

  static getServicesTssOfferByDigitalRequest(id) {
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
        S."fk_id_Requerimiento" = ${id}
      AND
        S."activo" = 1;`;
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

  static getSparePartsOfferByDigitalRequest(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        *
      FROM
        critical_parts_db.CalculoSparePartes P
      WHERE
        P."fk_id_Requerimiento" = ${id}
      AND
        P."activo" = 1;`;
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

  static getDigitalRequestByID(id) {
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
        R."pais" AS "country",
        TS."nombre" AS "typeSupport",
        R."fk_id_TipoSoporte" AS "idTypeSupport",
        R."fk_id_SistemaOperativo" AS "idOperatingSystemType",
        R."fk_id_ModeloDeNegocio" AS "idBusinessModel",
        MN."nombre" AS "businessModel",
        CASE WHEN (TSO."nombre" IS NULL) THEN 'N/A' ELSE TSO."nombre" END AS "operatingSystemType",
        HA."nombre" AS "officeHours",
        R."fk_id_HorarioAtencion" AS "idOfficeHours",
        TR."nombre" AS "responseTime",
        R."fk_id_TiempoRespuesta" AS "idResponseTime",
        TCP."nombre" AS "timeChangePart",
        R."fk_id_TiempoCambioParte" AS "idTimeChangePart",
        VS."nombre" AS "validityService",
        R."fk_id_VigenciaServicio" AS "idValidityService",
        CASE WHEN TCP."id_TiempoCambioParte" != 4 THEN 'SÍ' ELSE 'NO' END AS "criticalParts",
        R."fk_id_FormaPagoServicio" AS "idWayPay",
        PS."nombre" AS "wayPay",
        R."fk_id_TipoUbicacion" AS "idLocationType",
        TU."nombre" AS "locationType",
        R."fk_id_DistanciaDentro" AS "idDistanceInside",
        CASE WHEN (CSD."nombre" IS NULL) THEN 'N/A' ELSE CSD."nombre" END AS "distanceInside",
        R."fk_id_DistanciaFuera" AS "idDistanceOutside",
        CASE WHEN (CSF."nombre" IS NULL) THEN 'N/A' ELSE CSF."nombre" END AS "distanceOutside",
        R."fk_id_CantidadMantenimiento" AS "idAmountMaintenance",
        CM."nombre" AS "amountMaintenance",
        R."fk_id_HorarioMantenimiento" AS "idScheduleMaintenance",
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
        critical_parts_db.ModeloDeNegocio MN
      ON
        R."fk_id_ModeloDeNegocio" = MN."id_ModeloDeNegocio"
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
        R."activo" = 1 AND R."id_Requerimiento" = ${id}
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

  static getEquipmentsDetailOfferByDigitalRequest(id, idBusinessModel) {
    return new Promise((resolve, reject) => {
      const query =
        idBusinessModel === 1
          ? `SELECT
        E."id_Equipo" AS "id",
        CE."id_CantidadEquipos" AS "idC",
        CASE
          WHEN E."pais" = 'CR' THEN 'Costa Rica'
          WHEN E."pais" = 'SV' THEN 'El Salvador'
          WHEN E."pais" = 'GT' THEN 'Guatemala'
          WHEN E."pais" = 'HN' THEN 'Honduras'
          WHEN E."pais" = 'MD' THEN 'Miami'
          WHEN E."pais" = 'NI' THEN 'Nicaragua'
          WHEN E."pais" = 'PA' THEN 'Panamá'
          WHEN E."pais" = 'DO' THEN 'República Dominicana'
        END AS "country",
        E."tipoModelo" AS "typeModel",
        CASE WHEN E."serial" = 'null' THEN 'N/A' ELSE E."serial" END as "serial",
        CE."cantidadEquipos" AS "amountEquipments",
        P."practica" AS "practice",
        E."fk_id_Practica" AS "idPractice",
        PP."plataforma" AS "platform",
        E."fk_id_Plataforma" AS "idPlatform",
        HA."nombre" AS "officeHour",
        TCP."nombre" AS "timeChangePart",
        VS."nombre" AS "validityService",
        RA."nombre" AS "automaticRenewal",
        IPE."nombre" AS "equipmentParts",
        RE."numeroOportunidad" AS "opportunityNumber"
      FROM
        critical_parts_db.EquiposIBM E
      INNER JOIN
        critical_parts_db.CantidadEquiposIBM CE
      ON
        E."id_Equipo" = CE."fk_id_EquipoIBM"
      LEFT JOIN
        critical_parts_db.Practica P
      ON
        E."fk_id_Practica" = P."id_Practica"
      LEFT JOIN
        critical_parts_db.PlataformaPractica PP
      ON
        E."fk_id_Plataforma" = PP."id_Plataforma"
      LEFT JOIN
        critical_parts_db.HorarioAtencion HA
      ON
        E."fk_id_HorarioAtencion" = HA."id_HorarioAtencion"
      LEFT JOIN
        critical_parts_db.TiempoCambioParte TCP
      ON
        E."fk_id_TiempoCambioParte" = TCP."id_TiempoCambioParte"
      LEFT JOIN
        critical_parts_db.VigenciaServicio VS
      ON
        E."fk_id_VigenciaServicio" = VS."id_VigenciaServicio"
      LEFT JOIN
        critical_parts_db.RenovacionAutomatica RA
      ON
        E."fk_id_RenovacionAutomatica" = RA."id_RenovacionAutomatica"
      LEFT JOIN
        critical_parts_db.IncluyePartesEquipos IPE
      ON
        E."fk_id_IncluyePartesEquipos" = IPE."id_IncluyePartesEquipos"
      LEFT JOIN
        critical_parts_db.Requerimientos RE
      ON
        E."fk_id_Requerimiento" = RE."id_Requerimiento"
      WHERE
        E."fk_id_Requerimiento" = ${id} AND E."activo" = 1 AND CE."activo" = 1;`
          : `SELECT
          E."id_Equipo" AS "id",
          CASE
            WHEN E."pais" = 'CR' THEN 'Costa Rica'
            WHEN E."pais" = 'SV' THEN 'El Salvador'
            WHEN E."pais" = 'GT' THEN 'Guatemala'
            WHEN E."pais" = 'HN' THEN 'Honduras'
            WHEN E."pais" = 'MD' THEN 'Miami'
            WHEN E."pais" = 'NI' THEN 'Nicaragua'
            WHEN E."pais" = 'PA' THEN 'Panamá'
            WHEN E."pais" = 'DO' THEN 'República Dominicana'
          END AS "country",
          E."tipoModelo" AS "typeModel",
          CASE WHEN E."serial" = 'null' THEN 'N/A' ELSE E."serial" END as "serial",
          E."cantidadEquipos" AS "amountEquipments",
          P."practica" AS "practice",
          E."fk_id_Practica" AS "idPractice",
          PP."plataforma" AS "platform",
          E."fk_id_Plataforma" AS "idPlatform",
          HA."nombre" AS "officeHour",
          TCP."nombre" AS "timeChangePart",
          VS."nombre" AS "validityService",
          RA."nombre" AS "automaticRenewal",
          IPE."nombre" AS "equipmentParts",
          RE."numeroOportunidad" AS "opportunityNumber"
        FROM
          critical_parts_db.EquiposIBM E
        LEFT JOIN
          critical_parts_db.Practica P
        ON
          E."fk_id_Practica" = P."id_Practica"
        LEFT JOIN
          critical_parts_db.PlataformaPractica PP
        ON
          E."fk_id_Plataforma" = PP."id_Plataforma"
        LEFT JOIN
          critical_parts_db.HorarioAtencion HA
        ON
          E."fk_id_HorarioAtencion" = HA."id_HorarioAtencion"
        LEFT JOIN
          critical_parts_db.TiempoCambioParte TCP
        ON
          E."fk_id_TiempoCambioParte" = TCP."id_TiempoCambioParte"
        LEFT JOIN
          critical_parts_db.VigenciaServicio VS
        ON
          E."fk_id_VigenciaServicio" = VS."id_VigenciaServicio"
        LEFT JOIN
          critical_parts_db.RenovacionAutomatica RA
        ON
          E."fk_id_RenovacionAutomatica" = RA."id_RenovacionAutomatica"
        LEFT JOIN
          critical_parts_db.IncluyePartesEquipos IPE
        ON
          E."fk_id_IncluyePartesEquipos" = IPE."id_IncluyePartesEquipos"
        LEFT JOIN
          critical_parts_db.Requerimientos RE
        ON
          E."fk_id_Requerimiento" = RE."id_Requerimiento"
        WHERE
          E."fk_id_Requerimiento" = ${id} AND E."activo" = 1;`;
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

  static getPartsEquipmentsIBMByDigitalRequest(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        P."id_PartesEquipoIBM" AS "idP",
        P."fk_idEquipo" AS "idE"
      FROM
        critical_parts_db.PartesEquipoIBM P
      WHERE
        P."fk_id_Requerimiento" = ${id}
      AND
        P."activo" = 1;`;
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

  static getLastVersionByDigitalRequest(opp) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        R."numeroVersion" "lastVersion"
      FROM
        critical_parts_db.Requerimientos R
      WHERE
        R."numeroOportunidad" = ${opp}
      AND
        R."activo" = 1
      ORDER BY
        R."numeroVersion" DESC
      FETCH FIRST 1 ROWS ONLY;`;
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

  static createNewDigitalRequest(values, createdBy) {
    const {
      opportunityNumber,
      customer,
      salesRep,
      requestedExecutive,
      amountOfEquipment,
      applicationNotes,
      amountOfEquipmentIn,
      amountOfEquipmentOut,
      localtionNotes,
      country,
      typeSupport,
      operatingSystemType,
      businessModel,
      officeHours,
      responseTime,
      timeChangePart,
      validityService,
      wayPay,
      physicalLocation,
      equipmentServiceCenterIn,
      equipmentServiceCenterOut,
      amountMaintenance,
      scheduleMaintenance,
    } = values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.Requerimientos (
          "numeroOportunidad", "nombreCliente", "nombreRepresentanteVentas", "nombreEjecutivoSolicitud", "cantidadEquipos", "notasSolicitud", "equiposDentroRadio", "equiposFueraRadio", "notasUbicacion", "pais", "fk_id_TipoSoporte", "fk_id_SistemaOperativo", "fk_id_ModeloDeNegocio", "fk_id_HorarioAtencion", "fk_id_TiempoRespuesta", "fk_id_TiempoCambioParte", "fk_id_VigenciaServicio", "fk_id_FormaPagoServicio", "fk_id_TipoUbicacion", "fk_id_DistanciaDentro", "fk_id_DistanciaFuera", "fk_id_CantidadMantenimiento", "fk_id_HorarioMantenimiento" , "createdBy"
        )
      VALUES (
        ${opportunityNumber}, '${customer}', '${salesRep}', '${requestedExecutive}', ${amountOfEquipment}, '${
        applicationNotes ? applicationNotes : "N/A"
      }', ${amountOfEquipmentIn}, ${amountOfEquipmentOut}, '${
        localtionNotes ? localtionNotes : "N/A"
      }', '${country}', ${typeSupport}, ${operatingSystemType}, ${businessModel}, ${officeHours}, ${responseTime}, ${timeChangePart}, ${validityService}, ${wayPay}, ${physicalLocation}, ${
        parseInt(equipmentServiceCenterIn, 10) === 0
          ? null
          : equipmentServiceCenterIn
      }, ${
        parseInt(equipmentServiceCenterOut, 10) === 0
          ? null
          : equipmentServiceCenterOut
      }, ${
        amountMaintenance === "0"
          ? officeHours === "2" && timeChangePart === "4"
            ? 1
            : 2
          : amountMaintenance
      }, ${scheduleMaintenance}, '${createdBy}'
      ) returning *`;
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

  static createActivitieFlow(description, status, createdBy, idRequest) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.FlujoActividades (
          "descripcion", "estado", "fk_id_Requerimiento", "createdBy"
        )
      VALUES (
        '${description}', '${status}', ${idRequest}, '${createdBy}'
      ) returning *`;
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

  static getCriticalPartsKitDigitalRequest(typeModel) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        P."id_PartesCriticas" AS "idCriticalPart",
        P."tipoModelo" AS "typeModel",
        P."plataforma" AS "platform",
        P."familia" AS "family",
        P."categoria" AS "category",
        P."descripcion" AS "description",
        CASE P."tieneRedundancia" WHEN 0 THEN 'NO' ELSE 'SI' END AS "redundancy",
        P."activo" AS "active",
        P."createdBy",
        P."updatedBy",
        P."createdAt",
        P."updatedAt"
      FROM
        critical_parts_db.PartesCriticas P
      WHERE
        P."tipoModelo" = '${typeModel}'
      AND
        P."activo" = 1;`;
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

  static createEquipmentIBM(values, idRequest) {
    const {
      amountEquipments,
      amountMaintenance,
      automaticRenewal,
      country,
      equipmentParts,
      officeHours,
      platform,
      price,
      practice,
      serial,
      timeChangePart,
      typeModel,
      validityService,
      validWarranty,
      viatic,
    } = values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.EquiposIBM (
          "pais", "tipoModelo", "serial", "cantidadMantenimientos", "cantidadEquipos", "garantiaVigente", "viaticos", "precio", "fk_id_Practica", "fk_id_Plataforma", "fk_id_HorarioAtencion", "fk_id_TiempoCambioParte", "fk_id_VigenciaServicio", "fk_id_RenovacionAutomatica", "fk_id_IncluyePartesEquipos", "fk_id_Requerimiento"
        )
      VALUES (
        '${country}', '${typeModel}', '${
        serial ? serial : null
      }', ${amountMaintenance}, ${
        amountEquipments ? amountEquipments : null
      }, ${validWarranty}, ${viatic}, ${
        price ? price : 0
      }, ${practice}, ${platform}, ${officeHours}, ${timeChangePart}, ${validityService}, ${automaticRenewal}, ${equipmentParts}, ${idRequest}
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

  static createEquipmentSpare(values, idRequest) {
    const { partNumber, description, amountEquipments, cost } = values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.EquiposSpare (
          "partNumber", "descripcion", "cantidadEquipos", "costo", "fk_id_Requerimiento"
        )
      VALUES (
        '${partNumber}', '${description}', ${amountEquipments}, ${cost}, ${idRequest}
      ) returning *`;
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

  static createJustifyPrices(justify, idRequest, createdBy) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.JustificacionPrecios (
          "justificacion", "fk_id_Requerimiento", "createdBy"
        )
      VALUES (
        '${justify}', ${idRequest}, '${createdBy}'
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

  static createCommentaryConfig(
    commentary,
    hasConfiguration,
    idRequest,
    createdBy
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.ComentariosConfiguracion (
          "comentario", "tieneConfiguracion", "fk_id_Requerimiento", "createdBy"
        )
      VALUES (
        '${commentary}', ${hasConfiguration}, ${idRequest}, '${createdBy}'
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

  static createServiceOrder(serviceOrder, idRequest) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.OrdenesServicio (
          "ordenServicio", "fk_id_Requerimiento"
        )
      VALUES (
        '${serviceOrder}', ${idRequest}
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

  static getIDPracticeByName(name) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        P."id_Practica" AS "idPractice"
      FROM
        critical_parts_db.Practica P
      WHERE
        P."practica" = '${name}' AND P."activo" = 1;`;
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

  static getIDPlatformByName(name) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        P."id_Plataforma" AS "idPlatform"
      FROM
        critical_parts_db.PlataformaPractica P
      WHERE
        P."plataforma" = '${name}' AND P."activo" = 1;`;
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

  static getIDOfficeHoursByName(name) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        HA."id_HorarioAtencion" AS "idOfficeHour"
      FROM
        critical_parts_db.HorarioAtencion HA
      WHERE
        HA."nombre" = '${name}' AND HA."activo" = 1;`;
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

  static getIDTimeChangePartByName(name) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        TCP."id_TiempoCambioParte" AS "idTimeChangePart"
      FROM
        critical_parts_db.TiempoCambioParte TCP
      WHERE
        TCP."nombre" = '${name}' AND TCP."activo" = 1;`;
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

  static getIDValidityServiceByName(name) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        VS."id_VigenciaServicio" AS "idValidityService"
      FROM
        critical_parts_db.VigenciaServicio VS
      WHERE
        VS."nombre" = '${name}' AND VS."activo" = 1;`;
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

  static getIDAutomaticRenewalByName(name) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        RA."id_RenovacionAutomatica" AS "idAutomaticRenewal"
      FROM
        critical_parts_db.RenovacionAutomatica RA
      WHERE
        RA."nombre" = '${name}' AND RA."activo" = 1;`;
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

  static getIDEquipmentPartsByName(name) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        IP."id_IncluyePartesEquipos" AS "idEquipmentPart"
      FROM
        critical_parts_db.IncluyePartesEquipos IP
      WHERE
        IP."nombre" = '${name}' AND IP."activo" = 1;`;
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

  static createOfferAjustByDigitalRequest(provision, justify, type, idRequest) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.AjustesOfertas (
          "provision", "justificacion", "tipo", "fk_id_Requerimiento"
        )
      VALUES (
        ${provision}, '${justify}', ${type}, ${idRequest}
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

  static updateReferencesOfferAjust(idAjust, idReference) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.ReferenciaAjuste
      SET
        "fk_id_Ajuste" = ${idAjust},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_ReferenciaAjuste" = ${idReference} returning *;`;
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

  static updateEquipmentByID(values, id) {
    const {
      validWarranty,
      amountMaintenance,
      country,
      amountEquipments,
      typeModel,
      serial,
      platform,
      practice,
      idOfficeHours,
      idTimeChangePart,
      idValidityService,
      idAutomaticRenewal,
      idEquipmentParts,
      viatic,
      price,
    } = values;
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.EquiposIBM
      SET
        "pais" = '${country}',
        "tipoModelo" = '${typeModel}',
        "serial" = '${serial}',
        "cantidadMantenimientos" = ${amountMaintenance},
        "cantidadEquipos" = ${amountEquipments},
        "garantiaVigente" = ${validWarranty},
        "viaticos" = ${viatic},
        "precio" = ${price},
        "fk_id_Practica" = ${practice},
        "fk_id_Plataforma" = ${platform},
        "fk_id_HorarioAtencion" = ${idOfficeHours},
        "fk_id_TiempoCambioParte" = ${idTimeChangePart},
        "fk_id_RenovacionAutomatica" = ${idAutomaticRenewal},
        "fk_id_VigenciaServicio" = ${idValidityService},
        "fk_id_IncluyePartesEquipos" = ${idEquipmentParts},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Equipo" = ${id} returning *;`;
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

  static createActivitiesFlowByDigitalRequest(
    description,
    status,
    createdBy,
    idRequest
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.FlujoActividades (
          "descripcion", "estado", "fk_id_Requerimiento", "createdBy"
        )
      VALUES (
        '${description}', '${status}', ${idRequest}, '${createdBy}'
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

  static createConsolidateEquipmentsIBM(values, idRequest) {
    const {
      id,
      amount,
      country,
      typeModel,
      validWarranty,
      idOfficeHours,
      idTimeChangePart,
      amountMaintenance,
      idValidityService,
      idAutomaticRenewal,
      idEquipmentParts,
    } = values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.CantidadEquiposIBM (
          "pais", "tipoModelo", "cantidadMantenimientos", "garantiaVigente", "cantidadEquipos", "fk_id_HorarioAtencion", "fk_id_TiempoCambioParte", "fk_id_VigenciaServicio", "fk_id_RenovacionAutomatica", "fk_id_IncluyePartesEquipos", "fk_id_EquipoIBM", "fk_id_Requerimiento"
        )
      VALUES (
        '${country}', '${typeModel}', ${amountMaintenance}, ${validWarranty}, ${amount}, ${idOfficeHours}, ${idTimeChangePart}, ${idValidityService}, ${idAutomaticRenewal}, ${idEquipmentParts}, ${id}, ${idRequest}
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

  static getVariablesDataMaster() {
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

  static getEquipmentsBaseByDigitalRequest(idBusinessModel, idRequest) {
    return new Promise((resolve, reject) => {
      const query =
        idBusinessModel === 1
          ? `SELECT
        E."id_Equipo" AS "id",
        E."tipoModelo" AS "typeModel",
        E."garantiaVigente" AS "validWarranty",
        CE."cantidadEquipos" AS "amountEquipments",
        E."fk_id_VigenciaServicio" AS "idValidityService",
        E."fk_id_HorarioAtencion" AS "idOfficeHours",
        E."precio" AS "price"
      FROM
        critical_parts_db.EquiposIBM E
      INNER JOIN
        critical_parts_db.CantidadEquiposIBM CE
      ON
        E."id_Equipo" = CE."fk_id_EquipoIBM"
      WHERE
        CE."fk_id_Requerimiento" = ${idRequest} AND CE."activo" = 1;`
          : `SELECT
        E."id_Equipo" AS "id",
        E."tipoModelo" AS "typeModel",
        E."cantidadEquipos" AS "amountEquipments",
        E."garantiaVigente" AS "validWarranty",
        E."fk_id_VigenciaServicio" AS "idValidityService",
        E."fk_id_HorarioAtencion" AS "idOfficeHours",
        E."precio" AS "price"
      FROM
        critical_parts_db.EquiposIBM E
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

  static createEquipmentsBaseCalculate(values, idRequest) {
    const {
      id,
      price,
      uplift,
      finance,
      byServcs,
      shipping,
      typeModel,
      quantityYears,
      validWarranty,
      idBusinessModel,
      amountEquipments,
      byServcsRemaining,
    } = values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.CalculoEquiposBase (
          "typeModel", "quantity", "unitCost", "quantityYears", "quantityYearsWarranty", "byServices", "byServicesRemaining", "shippingPercent", "upliftPercent", "finPercent", "tipo", "fk_id_EquipoIBM", "fk_id_Requerimiento"
        )
      VALUES (
        '${typeModel}', ${amountEquipments}, ${price}, ${quantityYears}, ${validWarranty}, ${byServcs}, ${byServcsRemaining}, ${shipping}, ${uplift}, ${finance}, ${idBusinessModel}, ${id}, ${idRequest}
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

  static getServicesTSSByDigitalRequest(idBusinessModel, idRequest) {
    return new Promise((resolve, reject) => {
      const query =
        idBusinessModel === 1
          ? `SELECT
        P."id_Practica" AS "idService",
        P."practica" AS "practice",
        -- P."plataforma" AS "platform",
        P."preventivos" AS "preventive",
        E."cantidadMantenimientos" AS "preventiveE",
        P."horas" AS "hours",
        CE."cantidadEquipos" AS "quantity",
        E."viaticos" AS "viatic",
        P."activo" AS "active",
        P."createdAt",
        P."updatedAt"
      FROM
        critical_parts_db.EquiposIBM E
      INNER JOIN
        critical_parts_db.CantidadEquiposIBM CE
      ON
        E."id_Equipo" = CE."fk_id_EquipoIBM"
      INNER JOIN
        critical_parts_db.Practica P
      ON
        E."fk_id_Practica" = P."id_Practica"
      WHERE
        E."fk_id_Requerimiento" = ${idRequest} AND E."activo" = 1 AND CE."activo" = 1;`
          : `SELECT
        P."id_Practica" AS "idService",
        P."practica" AS "practice",
        -- P."plataforma" AS "platform",
        P."preventivos" AS "preventive",
        E."cantidadMantenimientos" AS "preventiveE",
        P."horas" AS "hours",
        E."cantidadEquipos" AS "quantity",
        E."viaticos" AS "viatic",
        P."activo" AS "active",
        P."createdAt",
        P."updatedAt"
      FROM
        critical_parts_db.EquiposIBM E
      RIGHT JOIN
        critical_parts_db.Practica P
      ON
        E."fk_id_Practica" = P."id_Practica"
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

  static getCostServicesTssByCountry(country, idPractice) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        C."id_Costo" AS "idCost",
        C."pais" AS "country",
        C."costo" AS "cost",
        C."fk_id_Practica" AS "idPractice",
        C."activo" AS "active",
        C."createdAt",
        C."updatedAt"
      FROM
        critical_parts_db.CostoPractica C
      WHERE
        C."pais" = '${country}' AND
        C."fk_id_Practica" = ${idPractice} AND
        C."activo" = 1;`;
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

  static createServicesTSSCalculate(values, idRequest) {
    const { id, cost, hours, viatic, uplift, finance, quantityYears } = values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.CalculoServicios (
          "quantityHours", "unitCost", "quantityYears", "upliftPercent", "finPercent", "viatic", "fk_id_Practica", "fk_id_Requerimiento"
        )
      VALUES (
        ${hours}, ${cost}, ${quantityYears}, ${uplift}, ${finance}, ${viatic}, ${id}, ${idRequest}
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

  static getEquipmentsPartsByDigitalRequest(idBusinessModel, idRequest) {
    return new Promise((resolve, reject) => {
      const query =
        idBusinessModel === 1
          ? `SELECT
        P."id_PartesEquipoIBM" AS "idPart",
        P."frus" AS "partNumber",
        P."cantidad" AS "quantity",
        P."costo" AS "cost"
      FROM
        critical_parts_db.PartesEquipoIBM P
      INNER JOIN
        critical_parts_db.CantidadEquiposIBM C
      ON
        P."fk_idEquipo" = C."id_CantidadEquipos" AND
        P."fk_id_Requerimiento" = ${idRequest}
      WHERE
        P."activo" = 1 AND C."activo" = 1;`
          : `SELECT
        P."id_PartesEquipoIBM" AS "idPart",
        P."frus" AS "partNumber",
        P."cantidad" AS "quantity",
        P."costo" AS "cost"
      FROM
        critical_parts_db.PartesEquipoIBM P
      INNER JOIN
        critical_parts_db.EquiposIBM E
      ON
        P."fk_idEquipo" = E."id_Equipo" AND
        P."fk_id_Requerimiento" = ${idRequest}
      WHERE
        P."activo" = 1 AND E."activo" = 1;`;
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

  static getEquipmentsSpareByDigitalRequest(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        E."id_EquipoSpare" AS "idSpare",
        E."partNumber",
        E."descripcion" AS "description",
        E."cantidadEquipos" AS "amountEquipments",
        E."costo" AS "cost",
        E."fk_id_Requerimiento" AS "idRequest",
        E."activo" AS "active",
        E."createdAt",
        E."updatedAt"
      FROM
        critical_parts_db.EquiposSpare E
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

  static createSpareAndPartsCalculate(values, idRequest) {
    const {
      id,
      cost,
      type,
      uplift,
      finance,
      shipping,
      interest,
      partNumber,
      quantityYears,
      amountEquipments,
    } = values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.CalculoSparePartes (
          "partNumber", "quantity", "unitCost", "quantityYears", "shippingPercent", "upliftPercent", "finPercent", "interest", "tipo", "fk_id_SpareParte", "fk_id_Requerimiento"
        )
      VALUES (
        '${partNumber}', ${amountEquipments}, ${cost}, ${quantityYears}, ${shipping}, ${uplift}, ${finance}, ${interest}, ${type}, ${id}, ${idRequest}
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

  static updateStatusDigitalRequestByID(status, idRequest) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.Requerimientos
      SET
        "estado" = ${status},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Requerimiento" = ${idRequest} returning *;`;
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

  static getCommentConfigurationByDigitalRequest(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        C."comentario" AS "commentary"
      FROM
        critical_parts_db.ComentariosConfiguracion C
      WHERE
        C."fk_id_Requerimiento" = ${idRequest} AND
        C."tieneConfiguracion" = 0 AND
        C."activo" = 1;`;
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

  static createDigitalRequestInInventories(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.ListaInventarios (
          "fk_id_Requerimiento"
        )
      VALUES (
        ${idRequest}
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

  static updateDigitalRequestInInventories(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.ListaInventarios
      SET
        "estado" = 1,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "fk_id_Requerimiento" = ${idRequest} returning *;`;
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

  static getEquipmentsPendingsPartsByDigitalRequest(
    idBusinessModel,
    idRequest
  ) {
    return new Promise((resolve, reject) => {
      const query =
        idBusinessModel === 1
          ? `SELECT DISTINCT
        PC."tipoModelo" AS "typeModel",
        PC."plataforma" AS "platform",
        PC."familia" AS "family"
      FROM
        critical_parts_db.PendientePartesEquipoIBM P
      INNER JOIN
        critical_parts_db.CantidadEquiposIBM E
      ON
        P."fk_idEquipo" = E."id_CantidadEquipos"
      INNER JOIN
        critical_parts_db.PartesCriticas PC
      ON
        E."tipoModelo" = PC."tipoModelo"
      WHERE
        P."activo" = 1 AND P."fk_id_Requerimiento" = ${idRequest};`
          : `SELECT DISTINCT
        PC."tipoModelo" AS "typeModel",
        PC."plataforma" AS "platform",
        PC."familia" AS "family"
      FROM
        critical_parts_db.PendientePartesEquipoIBM P
      INNER JOIN
        critical_parts_db.EquiposIBM E
      ON
        P."fk_idEquipo" = E."id_Equipo"
      INNER JOIN
        critical_parts_db.PartesCriticas PC
      ON
        E."tipoModelo" = PC."tipoModelo"
      WHERE
        P."activo" = 1 AND P."fk_id_Requerimiento" = ${idRequest}`;
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

  static createDigitalRequestInPricing(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.ListaPricing (
          "fk_id_Requerimiento"
        )
      VALUES (
        ${idRequest}
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

  static getInfoAjustRejectedByDigitalRequest(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        B."descripcion" AS "description",
        CASE WHEN B."comentario" = '' THEN 'N/A' ELSE B."comentario" END AS "commentary",
        B."createdBy"
      FROM
        critical_parts_db.ListaPricing L
      INNER JOIN
        critical_parts_db.BitacoraAjusteCalculo B
      ON
        L."id_Lista" = B."fk_id_Lista" AND
        L."fk_id_Requerimiento" = ${idRequest} AND
        L."estado" = 2 AND
        L."activo" = 1
      ORDER BY
        L."id_Lista" DESC
      FETCH FIRST 1 ROWS ONLY;`;
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

  static updateDigitalRequestNotConsidered(opp, idRequest) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.Requerimientos
      SET
        "estado" = 13,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "numeroOportunidad" = ${opp} AND
        "activo" = 1 AND
        "id_Requerimiento" != ${idRequest} returning *;`;
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

  static getServiceOrderByDigitalRequest(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        OS."id_Orden" AS "idServiceOrder",
        OS."ordenServicio" AS "serviceOrder",
        OS."fk_id_Requerimiento" AS "idRequest",
        OS."activo" AS "active",
        OS."createdAt",
        OS."updatedAt"
      FROM
        critical_parts_db.OrdenesServicio OS
      WHERE
        OS."fk_id_Requerimiento" = ${idRequest}`;
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

  static updateEquipmentSpareByID(values, id) {
    const { partNumber, description, amountEquipments, cost } = values;
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.EquiposSpare
      SET
        "partNumber" = '${partNumber}',
        "descripcion" = '${description}',
        "cantidadEquipos" = ${amountEquipments},
        "costo" = ${cost},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_EquipoSpare" = ${id} AND "activo" = 1 returning *;`;
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

  static deactivateIBMEquipmentByID(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.EquiposIBM
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Equipo" = ${id} returning *;`;
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

  static deactivateReferencesRequestByID(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.ReferenciasPrecios
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Referencia" = ${id} returning *;`;
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

  static deactivateConfigurationsRequestByID(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.Configuraciones
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Configuracion" = ${id} returning *;`;
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

  static deactivateReferencesSpareByID(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.ReferenciasSpare
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Referencia" = ${id} returning *;`;
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

  static deactivateReferencesOfferAjustByID(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.ReferenciaAjuste
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_ReferenciaAjuste" = ${id} returning *;`;
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

  static deactivateEquipmentSpareByID(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.EquiposSpare
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_EquipoSpare" = ${id} returning *;`;
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

  static createReferencePriceByDigitalRequest(values, idRequest) {
    const { nameNormalize, encoding, mimetype, path, decoded } = values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.ReferenciasPrecios (
          "nombre", "codificacion", "tipo", "ruta", "fk_id_Requerimiento", "createdBy"
        )
      VALUES (
        '${nameNormalize}', '${encoding}', '${mimetype}', '${path}', ${idRequest}, '${decoded}'
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

  static createConfigurationByDigitalRequest(values, idRequest) {
    const { nameNormalize, encoding, mimetype, path, decoded } = values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.Configuraciones (
          "nombre", "codificacion", "tipo", "ruta", "fk_id_Requerimiento", "createdBy"
        )
      VALUES (
        '${nameNormalize}', '${encoding}', '${mimetype}', '${path}', ${idRequest}, '${decoded}'
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

  static createReferencesBySpare(values, idRequest) {
    const { nameNormalize, encoding, mimetype, path, decoded } = values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.ReferenciasSpare (
          "nombre", "codificacion", "tipo", "ruta", "fk_id_Requerimiento", "createdBy"
        )
      VALUES (
        '${nameNormalize}', '${encoding}', '${mimetype}', '${path}', ${idRequest}, '${decoded}'
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

  static createReferencesAjustOffer(values, idRequest) {
    const { nameNormalize, encoding, mimetype, path, decoded } = values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.ReferenciaAjuste (
          "nombre", "codificacion", "tipo", "ruta", "fk_id_Requerimiento", "createdBy"
        )
      VALUES (
        '${nameNormalize}', '${encoding}', '${mimetype}', '${path}', ${idRequest}, '${decoded}'
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

  static getFrusPartsResumeByDigitalRequest(idBusinessModel, idRequest) {
    return new Promise((resolve, reject) => {
      const query =
        idBusinessModel === 1
          ? `SELECT
        *
      FROM (
        SELECT
          --T.rows AS "Cantidad Equipos",
          E."tipoModelo" AS "Modelo",
          TCP."nombre" AS "sla",
          --PC."plataforma" AS "Plataforma",
          --PC."categoria" AS "Categoría",
          P."frus" AS "FRU",
          CASE WHEN P."sustituto1" IS NULL THEN 'N/A' ELSE P."sustituto1" END AS "Sustituto",
          PC."descripcion" AS "Descripcion",
          P."cantidad" AS "Cantidad",
          P."costo" AS "Costo Unitario",
          (P."cantidad" * P."costo") AS "Costo Total"
        FROM
          critical_parts_db.PartesEquipoIBM P
        JOIN
          (SELECT COUNT(*) as rows, "fk_idEquipo" as id FROM critical_parts_db.PartesEquipoIBM WHERE "activo" = 1 GROUP BY "fk_idEquipo") AS T
        ON
          T.id = P."fk_idEquipo" AND P."fk_id_Requerimiento" = ${idRequest}
        INNER JOIN
          critical_parts_db.CantidadEquiposIBM E
        ON
          P."fk_idEquipo" = E."id_CantidadEquipos"
        INNER JOIN
          critical_parts_db.TiempoCambioParte TCP
        ON
          E."fk_id_TiempoCambioParte" = TCP."id_TiempoCambioParte"
        INNER JOIN
          critical_parts_db.PartesCriticas PC
        ON
          P."fk_idParteCritica" = PC."id_PartesCriticas"
        INNER JOIN
          critical_parts_db.Requerimientos R
        ON
          E."fk_id_Requerimiento" = R."id_Requerimiento"
        WHERE
          R."id_Requerimiento" = ${idRequest} AND R."activo" = 1 AND P."activo" = 1
        ORDER BY
          P."id_PartesEquipoIBM" ASC, E."tipoModelo" ASC
      ) AS T;`
          : `SELECT
          *
        FROM (
          SELECT
            --T.rows AS "Cantidad Equipos",
            E."tipoModelo" AS "Modelo",
            TCP."nombre" AS "sla",
            --PC."plataforma" AS "Plataforma",
            --PC."categoria" AS "Categoría",
            P."frus" AS "FRU",
            CASE WHEN P."sustituto1" IS NULL THEN 'N/A' ELSE P."sustituto1" END AS "Sustituto",
            PC."descripcion" AS "Descripcion",
            P."cantidad" AS "Cantidad",
            P."costo" AS "Costo Unitario",
            (P."cantidad" * P."costo") AS "Costo Total"
          FROM
            critical_parts_db.PartesEquipoIBM P
          JOIN
            (SELECT COUNT(*) as rows, "fk_idEquipo" as id FROM critical_parts_db.PartesEquipoIBM WHERE "activo" = 1 GROUP BY "fk_idEquipo") AS T
          ON
            T.id = P."fk_idEquipo" AND P."fk_id_Requerimiento" = ${idRequest}
          INNER JOIN
            critical_parts_db.EquiposIBM E
          ON
            P."fk_idEquipo" = E."id_Equipo"
          INNER JOIN
            critical_parts_db.TiempoCambioParte TCP
          ON
            E."fk_id_TiempoCambioParte" = TCP."id_TiempoCambioParte"
          INNER JOIN
            critical_parts_db.PartesCriticas PC
          ON
            P."fk_idParteCritica" = PC."id_PartesCriticas"
          INNER JOIN
            critical_parts_db.Requerimientos R
          ON
            E."fk_id_Requerimiento" = R."id_Requerimiento"
          WHERE
            R."id_Requerimiento" = ${idRequest} AND R."activo" = 1 AND P."activo" = 1
          ORDER BY
            P."id_PartesEquipoIBM" ASC, E."tipoModelo" ASC
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

  static getEquipmentsSpareResumeByDigitalRequest(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        E."partNumber" AS "PartNumber",
        E."descripcion" AS "Descripcion",
        E."cantidadEquipos" AS "Cantidad",
        E."costo" AS "Costo Unitario",
        (E."cantidadEquipos" * E."costo") AS "Costo Total"
      FROM
        critical_parts_db.EquiposSpare E
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

  static getWorkedEngineersResumeByDigitalRequest(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        U."id_Asignacion" AS "id",
        U."idUsuario" AS "idUser",
        U."nombreUsuario" AS "engineer",
        B."descripcion" AS "description",
        B."createdBy"
      FROM
        critical_parts_db.UsuariosAsignados U
      INNER JOIN
        critical_parts_db.BitacoraAsignaciones B
      ON
        U."id_Asignacion" = B."fk_id_Asignacion" AND B."activo" = 1
      WHERE
        U."fk_id_Requerimiento" = ${idRequest} AND U."activo" = 1 AND U."estado" = 1;`;
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

  static createNewVersionByDigitalRequest(values, createdBy) {
    const {
      newVersion,
      state,
      opportunityNumber,
      customer,
      salesRep,
      requestedExecutive,
      amountOfEquipment,
      applicationNotes,
      amountOfEquipmentIn,
      amountOfEquipmentOut,
      localtionNotes,
      country,
      typeSupport,
      operatingSystemType,
      businessModel,
      officeHours,
      responseTime,
      timeChangePart,
      validityService,
      wayPay,
      physicalLocation,
      equipmentServiceCenterIn,
      equipmentServiceCenterOut,
      amountMaintenance,
      scheduleMaintenance,
    } = values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.Requerimientos (
          "numeroVersion", "estado", "numeroOportunidad", "nombreCliente", "nombreRepresentanteVentas", "nombreEjecutivoSolicitud", "cantidadEquipos", "notasSolicitud", "equiposDentroRadio", "equiposFueraRadio", "notasUbicacion", "pais", "fk_id_TipoSoporte", "fk_id_SistemaOperativo", "fk_id_ModeloDeNegocio", "fk_id_HorarioAtencion", "fk_id_TiempoRespuesta", "fk_id_TiempoCambioParte", "fk_id_VigenciaServicio", "fk_id_FormaPagoServicio", "fk_id_TipoUbicacion", "fk_id_DistanciaDentro", "fk_id_DistanciaFuera", "fk_id_CantidadMantenimiento", "fk_id_HorarioMantenimiento" , "createdBy"
        )
      VALUES (
        ${newVersion}, ${state}, ${opportunityNumber}, '${customer}', '${salesRep}', '${requestedExecutive}', ${amountOfEquipment}, '${
        applicationNotes ? applicationNotes : "N/A"
      }', ${amountOfEquipmentIn}, ${amountOfEquipmentOut}, '${
        localtionNotes ? localtionNotes : "N/A"
      }', '${country}', ${typeSupport}, ${operatingSystemType}, ${businessModel}, ${officeHours}, ${responseTime}, ${timeChangePart}, ${validityService}, ${wayPay}, ${physicalLocation}, ${
        parseInt(equipmentServiceCenterIn, 10) === 0
          ? null
          : equipmentServiceCenterIn
      }, ${
        parseInt(equipmentServiceCenterOut, 10) === 0
          ? null
          : equipmentServiceCenterOut
      }, ${
        amountMaintenance === "0"
          ? officeHours === "2" && timeChangePart === "4"
            ? 1
            : 2
          : amountMaintenance
      }, ${scheduleMaintenance}, '${createdBy}'
      ) returning "id_Requerimiento" AS "newIdRequest";`;
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

  static createCopyEquipmentIBMByDigitalRequestVersioned(
    newIdRequest,
    idRequest
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.EquiposIBM (
          "pais", "tipoModelo", "serial", "cantidadMantenimientos", "cantidadEquipos", "garantiaVigente", "viaticos", "precio", "fk_id_Practica", "fk_id_Plataforma", "fk_id_HorarioAtencion", "fk_id_TiempoCambioParte", "fk_id_VigenciaServicio", "fk_id_RenovacionAutomatica", "fk_id_IncluyePartesEquipos", "fk_id_Requerimiento"
        )
      SELECT
        "pais", "tipoModelo", "serial", "cantidadMantenimientos", "cantidadEquipos", "garantiaVigente", "viaticos", "precio", "fk_id_Practica", "fk_id_Plataforma", "fk_id_HorarioAtencion", "fk_id_TiempoCambioParte", "fk_id_VigenciaServicio", "fk_id_RenovacionAutomatica", "fk_id_IncluyePartesEquipos", ${newIdRequest}
      FROM
        critical_parts_db.EquiposIBM
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

  static createCopyActivitiesFlowByDigitalRequestVersioned(
    newIdRequest,
    idRequest
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.FlujoActividades (
          "descripcion", "estado", "fk_id_Requerimiento", "createdBy"
        )
      SELECT
        "descripcion", "estado", ${newIdRequest}, "createdBy"
      FROM
        critical_parts_db.FlujoActividades
      WHERE
        "fk_id_Requerimiento" = ${idRequest};`;
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

  static createCopyServicesOrdersByDigitalRequestVersioned(
    newIdRequest,
    idRequest
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.OrdenesServicio (
          "ordenServicio", "fk_id_Requerimiento"
        )
      SELECT
        "ordenServicio", ${newIdRequest}
      FROM
        critical_parts_db.OrdenesServicio
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

  static createCopyAsignedUsersByDigitalRequestVersioned(
    newIdRequest,
    idRequest
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.UsuariosAsignados (
          "idUsuario", "nombreUsuario", "fk_id_Requerimiento", "estado"
        )
      SELECT
        "idUsuario", "nombreUsuario", ${newIdRequest}, "estado"
      FROM
        critical_parts_db.UsuariosAsignados
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

  static createCopyInventoriesListByDigitalRequestVersioned(
    newIdRequest,
    idRequest
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.ListaInventarios (
          "estado", "fk_id_Requerimiento"
        )
      SELECT
        "estado", ${newIdRequest}
      FROM
        critical_parts_db.ListaInventarios
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

  static createCopyEquipmentIBMCustomByDigitalRequestVersioned(
    newIdRequest,
    idRequest,
    idOfficeHour
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.EquiposIBM (
          "pais", "tipoModelo", "serial", "cantidadMantenimientos", "cantidadEquipos", "garantiaVigente", "viaticos", "precio", "fk_id_Practica", "fk_id_Plataforma", "fk_id_HorarioAtencion", "fk_id_TiempoCambioParte", "fk_id_VigenciaServicio", "fk_id_RenovacionAutomatica", "fk_id_IncluyePartesEquipos", "fk_id_Requerimiento"
        )
      SELECT
        "pais", "tipoModelo", "serial", "cantidadMantenimientos", "cantidadEquipos", "garantiaVigente", "viaticos", "precio", "fk_id_Practica", "fk_id_Plataforma", ${idOfficeHour}, "fk_id_TiempoCambioParte", "fk_id_VigenciaServicio", "fk_id_RenovacionAutomatica", "fk_id_IncluyePartesEquipos", ${newIdRequest}
      FROM
        critical_parts_db.EquiposIBM
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

  static createCopyEquipmentIBMTermsOfServiceByDigitalRequestVersioned(
    newIdRequest,
    idRequest,
    validityService
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.EquiposIBM (
          "pais", "tipoModelo", "serial", "cantidadMantenimientos", "cantidadEquipos", "garantiaVigente", "viaticos", "precio", "fk_id_Practica", "fk_id_Plataforma", "fk_id_HorarioAtencion", "fk_id_TiempoCambioParte", "fk_id_VigenciaServicio", "fk_id_RenovacionAutomatica", "fk_id_IncluyePartesEquipos", "fk_id_Requerimiento"
        )
      SELECT
        "pais", "tipoModelo", "serial", "cantidadMantenimientos", "cantidadEquipos", "garantiaVigente", "viaticos", "precio", "fk_id_Practica", "fk_id_Plataforma", "fk_id_HorarioAtencion", "fk_id_TiempoCambioParte", ${validityService}, "fk_id_RenovacionAutomatica", "fk_id_IncluyePartesEquipos", ${newIdRequest}
      FROM
        critical_parts_db.EquiposIBM
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

  static createCopyEquipmentSpareByDigitalRequestVersioned(
    newIdRequest,
    idRequest
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.EquiposSpare (
          "partNumber", "descripcion", "cantidadEquipos", "costo", "fk_id_Requerimiento"
        )
      SELECT
        "partNumber", "descripcion", "cantidadEquipos", "costo", ${newIdRequest}
      FROM
        critical_parts_db.EquiposSpare
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

  static createCopyReferencesByDigitalRequestVersioned(
    newIdRequest,
    idRequest
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.ReferenciasPrecios (
          "nombre", "codificacion", "tipo", "ruta", "fk_id_Requerimiento", "createdBy"
        )
      SELECT
        "nombre", "codificacion", "tipo", "ruta", ${newIdRequest}, "createdBy"
      FROM
        critical_parts_db.ReferenciasPrecios
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

  static createCopyJustifyByDigitalRequestVersioned(newIdRequest, idRequest) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.JustificacionPrecios (
          "justificacion", "fk_id_Requerimiento", "createdBy"
        )
      SELECT
        "justificacion", ${newIdRequest}, "createdBy"
      FROM
        critical_parts_db.JustificacionPrecios
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

  static createCopyConfigurationsByDigitalRequestVersioned(
    newIdRequest,
    idRequest
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.Configuraciones (
          "nombre", "codificacion", "tipo", "ruta", "fk_id_Requerimiento", "createdBy"
        )
      SELECT
        "nombre", "codificacion", "tipo", "ruta", ${newIdRequest}, "createdBy"
      FROM
        critical_parts_db.Configuraciones
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

  static createCopyCommentaryConfigurationsByDigitalRequestVersioned(
    newIdRequest,
    idRequest
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.ComentariosConfiguracion (
          "comentario", "tieneConfiguracion", "fk_id_Requerimiento", "createdBy"
        )
      SELECT
        "comentario", "tieneConfiguracion", ${newIdRequest}, "createdBy"
      FROM
        critical_parts_db.ComentariosConfiguracion
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

  static createCopyReferencesSpareByDigitalRequestVersioned(
    newIdRequest,
    idRequest
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.ReferenciasSpare (
          "nombre", "codificacion", "tipo", "ruta", "fk_id_Requerimiento", "createdBy"
        )
      SELECT
        "nombre", "codificacion", "tipo", "ruta", ${newIdRequest}, "createdBy"
      FROM
        critical_parts_db.ReferenciasSpare
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

  static getLogsAssignmentsByDigitalRequest(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        U."id_Asignacion" AS "idAsign",
        B."descripcion" AS "description",
        B."createdBy"
      FROM
        critical_parts_db.BitacoraAsignaciones B
      INNER JOIN
        critical_parts_db.UsuariosAsignados U
      ON
        B."fk_id_Asignacion" = U."id_Asignacion" AND U."activo" = 1 AND U."fk_id_Requerimiento" = ${idRequest};`;
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

  static getIdsAssignmentsByDigitalRequest(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        U."id_Asignacion" AS "idAssignment"
      FROM
        critical_parts_db.UsuariosAsignados U
      WHERE
        U."fk_id_Requerimiento" = ${idRequest} AND U."activo" = 1;`;
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

  static createLogAssignmentsByID(description, createdBy, id) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.BitacoraAsignaciones (
          "descripcion", "fk_id_Asignacion", "createdBy"
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

  static getEquipmentsPartsToVersionByDigitalRequest(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        "frus" AS "fru",
        "cantidad" AS "amount",
        "sustituto1" AS "sustitute1",
        "sustituto2" AS "sustitute2",
        "sustituto3" AS "sustitute3",
        "costo" AS "cost",
        "fk_idEquipo" AS "idEquipment",
        "fk_idParteCritica" AS "idCriticalPart",
        "fk_id_Requerimiento" AS "idRequest",
        "createdBy",
        "updatedBy"
      FROM
        critical_parts_db.PartesEquipoIBM
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

  static getActivitiesPlatformsPracticeEquipmentsByDigitalRequest(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `select
        e."tipoModelo" AS "typeModel",
        --p."practica" AS "practice",
        pp."plataforma" AS "platform",
        a."nombre" AS "activity"
      from
        critical_parts_db.equiposibm e
      inner join
        critical_parts_db.practica p
      on
        e."fk_id_Practica" = p."id_Practica"
      inner join
        critical_parts_db.plataformapractica pp
      on
        e."fk_id_Plataforma"  = pp."id_Plataforma"
      inner join
        critical_parts_db.actividadesplataforma a
      on
        pp."id_Plataforma" = a."fk_id_Plataforma"
      where
        e."fk_id_Requerimiento" = ${idRequest} and e."cantidadMantenimientos" > 0;`;
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

  static getIdsEquipmentsPartsByDigitalRequest(
    idBusinessModel,
    newIdRequest,
    idRequest
  ) {
    return new Promise((resolve, reject) => {
      const query =
        idBusinessModel === 1
          ? `SELECT
        t1."id_CantidadEquipos" AS "lasID",
        t1."fk_id_EquipoIBM" AS "lasIDE",
        t2."id_CantidadEquipos" AS "newID",
        t2."fk_id_EquipoIBM" AS "newIDE"
      FROM
        (SELECT "id_CantidadEquipos", "fk_id_EquipoIBM", "tipoModelo" FROM critical_parts_db.CantidadEquiposIBM WHERE "fk_id_Requerimiento" = ${idRequest} AND "activo" = 1) t1
      LEFT JOIN
        (SELECT "id_CantidadEquipos", "fk_id_EquipoIBM", "tipoModelo" FROM critical_parts_db.CantidadEquiposIBM WHERE "fk_id_Requerimiento" = ${newIdRequest} AND "activo" = 1) t2
      ON
        t1."tipoModelo" = t2."tipoModelo";`
          : `SELECT
        t1."id_Equipo" AS "lasID",
        t2."id_Equipo" AS "newID"
      FROM
        (SELECT "id_Equipo", "tipoModelo" FROM critical_parts_db.EquiposIBM WHERE "fk_id_Requerimiento" = ${idRequest} AND "activo" = 1) t1
      LEFT JOIN
        (SELECT "id_Equipo", "tipoModelo" FROM critical_parts_db.EquiposIBM WHERE "fk_id_Requerimiento" = ${newIdRequest} AND "activo" = 1) t2
      ON
        t1."tipoModelo" = t2."tipoModelo";`;
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

  static createCopyEquipmentsPartsBy(values, idEquipment, idRequest) {
    const {
      fru,
      amount,
      sustitute1,
      sustitute2,
      sustitute3,
      cost,
      idCriticalPart,
      createdBy,
      updatedBy,
    } = values;
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.PartesEquipoIBM (
          "frus", "cantidad", "sustituto1", "sustituto2", "sustituto3", "costo", "fk_idParteCritica", "fk_idEquipo", "fk_id_Requerimiento", "createdBy", "updatedBy"
        )
      VALUES (
        '${fru}', ${amount}, '${sustitute1}', '${sustitute2}', '${sustitute3}', ${cost}, ${idCriticalPart}, ${idEquipment}, ${idRequest}, '${createdBy}', '${updatedBy}'
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

  static updateAmountEquipmentsLDR(id, amountLDR, amountIn, amountOut) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.Requerimientos
      SET
        "cantidadEquipos" = ${amountLDR},
        "equiposDentroRadio" = ${amountIn ? amountIn : 0},
        "equiposFueraRadio" = ${amountOut ? amountOut : 0},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Requerimiento" = ${id} returning *;`;
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

  static createCopyPartsEquipmentIBMByDigitalRequest(
    newIdRequest,
    idEquipment,
    newIdEquipment
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.PartesEquipoIBM (
          "frus", "cantidad", "fk_idParteCritica", "fk_idEquipo", "fk_id_Requerimiento", "createdBy"
        )
      SELECT
        "frus", "cantidad", "fk_idParteCritica", ${newIdEquipment}, ${newIdRequest}, "createdBy"
      FROM
        critical_parts_db.PartesEquipoIBM
      WHERE
        "fk_idEquipo" = ${idEquipment} AND "activo" = 1;`;
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
