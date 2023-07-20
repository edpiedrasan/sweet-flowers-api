/* eslint-disable max-lines */
/* eslint-disable max-params */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
import { runQuery } from "../posgreSQL";

export default class POSTGRESQL {
  constructor() {}

  static getDigitalRequestAssigningByUser(userID) {
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
        MN."nombre" AS "businessModel",
        R."fk_id_ModeloDeNegocio" AS "idBusinessModel",
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
        CASE
          WHEN UA."estado" = 0 THEN 'Asignada'
          WHEN UA."estado" = 1 THEN 'Completada'
        END AS "assignmentStatus",
        UA."id_Asignacion" AS "idAssignment",
        UA."fechaInicio" AS "assignmentCreation",
        UA."updatedAt" AS "assignmentUpdate",
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
      INNER JOIN
        critical_parts_db.UsuariosAsignados UA
      ON
        R."id_Requerimiento" = UA."fk_id_Requerimiento" AND
        UA."activo" = 1 AND
        UA."idUsuario" = ${userID} AND
        (R."estado" = 5 OR R."estado" = 6) AND
        UA."estado" = 0
      WHERE
        R."activo" = 1 AND UA."fechaInicio" <= NOW()
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

  static getDigitalRequestAssigningByUserIDRequest(userID, idRequest) {
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
        MN."nombre" AS "businessModel",
        R."fk_id_ModeloDeNegocio" AS "idBusinessModel",
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
        CASE
          WHEN UA."estado" = 0 THEN 'Asignada'
          WHEN UA."estado" = 1 THEN 'Completada'
        END AS "assignmentStatus",
        UA."id_Asignacion" AS "idAssignment",
        UA."createdAt" AS "assignmentCreation",
        UA."updatedAt" AS "assignmentUpdate",
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
      INNER JOIN
        critical_parts_db.UsuariosAsignados UA
      ON
        R."id_Requerimiento" = UA."fk_id_Requerimiento" AND
        UA."activo" = 1 AND
        UA."idUsuario" = ${userID} AND
        (R."estado" = 5 OR R."estado" = 6) AND
        UA."estado" = 0
      WHERE
        R."activo" = 1 AND UA."fechaInicio" <= NOW() AND R."id_Requerimiento" = ${idRequest}
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

  static getEquipmentsWithPartsByDigitalRequest(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `SELECT DISTINCT
        P."fk_idParteCritica" AS "idCriticalPart",
        P."fk_idEquipo" AS "idEquipment"
      FROM
        critical_parts_db.PartesEquipoIBM P
      WHERE
        P."activo" = 1 AND P."fk_id_Requerimiento" = ${idRequest};`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static getEquipmentsPartsPendingsByDigitalRequest(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `SELECT DISTINCT
        P."fk_idEquipo" AS "idEquipment"
      FROM
        critical_parts_db.PendientePartesEquipoIBM P
      WHERE
        P."activo" = 1 AND P."fk_id_Requerimiento" = ${idRequest};`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static getEquipmentsConsolidatesByDigitalRequest(idBusinessModel, idRequest) {
    return new Promise((resolve, reject) => {
      const query =
        idBusinessModel === 1
          ? `SELECT
        E."id_CantidadEquipos" AS "id",
        CASE
          WHEN CE."pais" = 'CR' THEN 'Costa Rica'
          WHEN CE."pais" = 'SV' THEN 'El Salvador'
          WHEN CE."pais" = 'GT' THEN 'Guatemala'
          WHEN CE."pais" = 'HN' THEN 'Honduras'
          WHEN CE."pais" = 'MD' THEN 'Miami'
          WHEN CE."pais" = 'NI' THEN 'Nicaragua'
          WHEN CE."pais" = 'PA' THEN 'Panamá'
          WHEN CE."pais" = 'DO' THEN 'República Dominicana'
        END AS "country",
        CE."tipoModelo" AS "typeModel",
        CE."serial" AS "serial",
        CE."cantidadMantenimientos" AS "amountMaintenance",
        E."cantidadEquipos" AS "amountEquipments",
        CE."garantiaVigente" AS "validWarranty",
        HA."nombre" AS "officeHour",
        CE."fk_id_HorarioAtencion" AS "idOfficeHours",
        TCP."nombre" AS "timeChangePart",
        CE."fk_id_TiempoCambioParte" AS "idTimeChangePart",
        VS."nombre" AS "validityService",
        CE."fk_id_VigenciaServicio" AS "idValidityService",
        RA."nombre" AS "automaticRenewal",
        CE."fk_id_RenovacionAutomatica" AS "idAutomaticRenewal",
        IPE."nombre" AS "equipmentParts",
        CE."fk_id_IncluyePartesEquipos" AS "idEquipmentParts",
        RE."numeroOportunidad" AS "opportunityNumber"
      FROM
        critical_parts_db.EquiposIBM CE
      INNER JOIN
        critical_parts_db.CantidadEquiposIBM E
      ON
        CE."id_Equipo" = E."fk_id_EquipoIBM"
      LEFT JOIN
        critical_parts_db.HorarioAtencion HA
      ON
        CE."fk_id_HorarioAtencion" = HA."id_HorarioAtencion"
      LEFT JOIN
        critical_parts_db.TiempoCambioParte TCP
      ON
        CE."fk_id_TiempoCambioParte" = TCP."id_TiempoCambioParte"
      LEFT JOIN
        critical_parts_db.VigenciaServicio VS
      ON
        CE."fk_id_VigenciaServicio" = VS."id_VigenciaServicio"
      LEFT JOIN
        critical_parts_db.RenovacionAutomatica RA
      ON
        CE."fk_id_RenovacionAutomatica" = RA."id_RenovacionAutomatica"
      LEFT JOIN
        critical_parts_db.IncluyePartesEquipos IPE
      ON
        CE."fk_id_IncluyePartesEquipos" = IPE."id_IncluyePartesEquipos"
      LEFT JOIN
        critical_parts_db.Requerimientos RE
      ON
        CE."fk_id_Requerimiento" = RE."id_Requerimiento"
      WHERE
        CE."fk_id_Requerimiento" = ${idRequest} AND CE."activo" = 1 AND E."activo" = 1 AND (IPE."id_IncluyePartesEquipos"= 1 OR IPE."id_IncluyePartesEquipos"= 3)
      ORDER BY
        E."id_CantidadEquipos" ASC;`
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
          E."cantidadMantenimientos" AS "amountMaintenance",
          E."cantidadEquipos" AS "amountEquipments",
          E."garantiaVigente" AS "validWarranty",
          P."practica" AS "practice",
          E."fk_id_Practica" AS "idPractice",
          PP."plataforma" AS "platform",
          E."fk_id_Plataforma" AS "idPlatform",
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
          E."fk_id_Requerimiento" = ${idRequest} AND E."activo" = 1 AND (IPE."id_IncluyePartesEquipos"= 1 OR IPE."id_IncluyePartesEquipos"= 3)
        ORDER BY
          E."id_Equipo" ASC;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static getEquipmentsConsolidatesAssignmentByDigitalRequest(
    idBusinessModel,
    idRequest,
    idAssignment
  ) {
    return new Promise((resolve, reject) => {
      const query =
        idBusinessModel === 1
          ? `SELECT
        E."id_CantidadEquipos" AS "id",
        CASE
          WHEN CE."pais" = 'CR' THEN 'Costa Rica'
          WHEN CE."pais" = 'SV' THEN 'El Salvador'
          WHEN CE."pais" = 'GT' THEN 'Guatemala'
          WHEN CE."pais" = 'HN' THEN 'Honduras'
          WHEN CE."pais" = 'MD' THEN 'Miami'
          WHEN CE."pais" = 'NI' THEN 'Nicaragua'
          WHEN CE."pais" = 'PA' THEN 'Panamá'
          WHEN CE."pais" = 'DO' THEN 'República Dominicana'
        END AS "country",
        CE."tipoModelo" AS "typeModel",
        CE."serial" AS "serial",
        CE."cantidadMantenimientos" AS "amountMaintenance",
        E."cantidadEquipos" AS "amountEquipments",
        CE."garantiaVigente" AS "validWarranty",
        HA."nombre" AS "officeHour",
        CE."fk_id_HorarioAtencion" AS "idOfficeHours",
        TCP."nombre" AS "timeChangePart",
        CE."fk_id_TiempoCambioParte" AS "idTimeChangePart",
        VS."nombre" AS "validityService",
        CE."fk_id_VigenciaServicio" AS "idValidityService",
        RA."nombre" AS "automaticRenewal",
        CE."fk_id_RenovacionAutomatica" AS "idAutomaticRenewal",
        IPE."nombre" AS "equipmentParts",
        CE."fk_id_IncluyePartesEquipos" AS "idEquipmentParts",
        RE."numeroOportunidad" AS "opportunityNumber"
      FROM
        critical_parts_db.EquiposIBM CE
      INNER JOIN
        critical_parts_db.CantidadEquiposIBM E
      ON
        CE."id_Equipo" = E."fk_id_EquipoIBM"
      LEFT JOIN
        critical_parts_db.HorarioAtencion HA
      ON
        CE."fk_id_HorarioAtencion" = HA."id_HorarioAtencion"
      LEFT JOIN
        critical_parts_db.TiempoCambioParte TCP
      ON
        CE."fk_id_TiempoCambioParte" = TCP."id_TiempoCambioParte"
      LEFT JOIN
        critical_parts_db.VigenciaServicio VS
      ON
        CE."fk_id_VigenciaServicio" = VS."id_VigenciaServicio"
      LEFT JOIN
        critical_parts_db.RenovacionAutomatica RA
      ON
        CE."fk_id_RenovacionAutomatica" = RA."id_RenovacionAutomatica"
      LEFT JOIN
        critical_parts_db.IncluyePartesEquipos IPE
      ON
        CE."fk_id_IncluyePartesEquipos" = IPE."id_IncluyePartesEquipos"
      LEFT JOIN
        critical_parts_db.Requerimientos RE
      ON
        CE."fk_id_Requerimiento" = RE."id_Requerimiento"
      INNER JOIN
        critical_parts_db.usuariosequipos UE
      ON
        UE."fk_id_Asignacion" = ${idAssignment} AND UE."fk_idEquipo" = E."id_CantidadEquipos"
      WHERE
        CE."fk_id_Requerimiento" = ${idRequest} AND CE."activo" = 1 AND E."activo" = 1 AND (IPE."id_IncluyePartesEquipos"= 1 OR IPE."id_IncluyePartesEquipos"= 3)
      ORDER BY
        E."id_CantidadEquipos" ASC;`
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
          E."cantidadMantenimientos" AS "amountMaintenance",
          E."cantidadEquipos" AS "amountEquipments",
          E."garantiaVigente" AS "validWarranty",
          P."practica" AS "practice",
          E."fk_id_Practica" AS "idPractice",
          PP."plataforma" AS "platform",
          E."fk_id_Plataforma" AS "idPlatform",
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
        INNER JOIN
          critical_parts_db.usuariosequipos UE
      	ON
          UE."fk_id_Asignacion" = ${idAssignment} AND UE."fk_idEquipo" = E."id_Equipo" AND UE.activo  = 1
        WHERE
          E."fk_id_Requerimiento" = ${idRequest} AND E."activo" = 1 AND (IPE."id_IncluyePartesEquipos"= 1 OR IPE."id_IncluyePartesEquipos"= 3)
        ORDER BY
          E."id_Equipo" ASC;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
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
        critical_parts_db.PartesCriticas PC
      ON
        P."fk_idParteCritica" = PC."id_PartesCriticas"
      INNER JOIN
        critical_parts_db.CantidadEquiposIBM E
      ON
        P."fk_idEquipo" = E."id_CantidadEquipos"
      INNER JOIN
        critical_parts_db.Requerimientos R
      ON
        E."fk_id_Requerimiento" = R."id_Requerimiento"
      AND
        R."activo" = 1
      AND
        R."id_Requerimiento" = ${idRequest}
      AND
        P."fk_id_Requerimiento" = ${idRequest}
      AND
        P."activo" = 1
      ORDER BY
        P."fk_idEquipo" ASC;`
          : `SELECT
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
        critical_parts_db.PartesCriticas PC
      ON
        P."fk_idParteCritica" = PC."id_PartesCriticas"
      INNER JOIN
        critical_parts_db.EquiposIBM E
      ON
        P."fk_idEquipo" = E."id_Equipo"
      INNER JOIN
        critical_parts_db.Requerimientos R
      ON
        E."fk_id_Requerimiento" = R."id_Requerimiento"
      AND
        R."activo" = 1
      AND
        R."id_Requerimiento" = ${idRequest}
      AND
        P."fk_id_Requerimiento" = ${idRequest}
      AND
        P."activo" = 1
      ORDER BY
        P."fk_idEquipo" ASC;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static getEquipmentsAssignmentPartsByDigitalRequest(
    idBusinessModel,
    idRequest,
    idAssignment
  ) {
    return new Promise((resolve, reject) => {
      const query =
        idBusinessModel === 1
          ? `SELECT
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
        critical_parts_db.PartesCriticas PC
      ON
        P."fk_idParteCritica" = PC."id_PartesCriticas"
      INNER JOIN
        critical_parts_db.CantidadEquiposIBM E
      ON
        P."fk_idEquipo" = E."id_CantidadEquipos"
      INNER JOIN
        critical_parts_db.Requerimientos R
      ON
        E."fk_id_Requerimiento" = R."id_Requerimiento"
      INNER JOIN
        critical_parts_db.usuariosequipos UE
      ON
        UE."fk_id_Asignacion" = ${idAssignment} AND UE."fk_idEquipo" = E."id_CantidadEquipos"
      AND
        R."activo" = 1
      AND
        R."id_Requerimiento" = ${idRequest}
      AND
        P."fk_id_Requerimiento" = ${idRequest}
      AND
        P."activo" = 1
      ORDER BY
        P."fk_idEquipo" ASC;`
          : `SELECT distinct
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
        critical_parts_db.PartesCriticas PC
      ON
        P."fk_idParteCritica" = PC."id_PartesCriticas"
      INNER JOIN
        critical_parts_db.EquiposIBM E
      ON
        P."fk_idEquipo" = E."id_Equipo"
      INNER JOIN
        critical_parts_db.Requerimientos R
      ON
        E."fk_id_Requerimiento" = R."id_Requerimiento"
      INNER JOIN
        critical_parts_db.usuariosequipos UE
      ON
        UE."fk_id_Asignacion" = ${idAssignment} AND UE."fk_idEquipo" = E."id_Equipo"
      AND
        R."activo" = 1
      AND
        R."id_Requerimiento" = ${idRequest}
      AND
        P."fk_id_Requerimiento" = ${idRequest}
      AND
        P."activo" = 1
      ORDER BY
        P."fk_idEquipo" ASC;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static getPartSelectedByEquipmentIBM(idEquipment) {
    return new Promise((resolve, reject) => {
      const query = `SELECT DISTINCT
        P."id_PartesEquipoIBM" AS "id",
        P."fk_idParteCritica" AS "idCriticalPart",
        P."fk_idEquipo" AS "idEquipment",
        P."activo" AS "active",
        P."createdBy",
        P."updatedBy",
        P."createdAt",
        P."updatedAt"
      FROM
        critical_parts_db.PartesEquipoIBM P
      WHERE
        P."activo" = 1 AND P."fk_idEquipo" = ${idEquipment};`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static getCommentEngineerByDigitalRequest(idRequest, type) {
    return new Promise((resolve, reject) => {
      const query = `SELECT DISTINCT
        C."id_Comentario" AS "id",
        C."comentario" AS "comment",
        C."fk_id_Requerimiento" AS "idRequest",
        C."activo" AS "active",
        C."createdBy",
        C."createdAt",
        C."updatedAt"
      FROM
        critical_parts_db.ComentariosIngeniero C
      WHERE
        C."activo" = 1 AND C."fk_id_Requerimiento" = ${idRequest} AND "type" = ${type}
      ORDER BY
        C."id_Comentario" DESC
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

  static validCritialPartEquipmentByDigitalRequest(
    idCriticalPart,
    idRequest,
    idEquipment
  ) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        *
      FROM
        critical_parts_db.PartesEquipoIBM P
      WHERE
        P."fk_idParteCritica" = ${idCriticalPart} AND P."fk_id_Requerimiento" = ${idRequest} AND P."fk_idEquipo" = ${idEquipment} AND P."activo" = 1;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static createPartsEquipmentByDigitalRequest(
    idCriticalPart,
    idEquipment,
    idRequest,
    createdBy
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.PartesEquipoIBM (
          "fk_idParteCritica", "fk_idEquipo", "fk_id_Requerimiento", "createdBy"
        )
      VALUES (
        ${idCriticalPart}, ${idEquipment}, ${idRequest}, '${createdBy}'
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

  static deactivatePartEquipmentByDigitalRequest(
    idEquipment,
    idCriticalPart,
    idRequest,
    updatedBy
  ) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.PartesEquipoIBM
      SET
        "activo" = 0,
        "updatedBy" = '${updatedBy}',
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "fk_idEquipo" = ${idEquipment} AND "fk_idParteCritica" = ${idCriticalPart} AND "fk_id_Requerimiento" = ${idRequest} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static createPartsPendingsEquipmentByDigitalRequest(
    idEquipment,
    idRequest,
    createdBy
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.PendientePartesEquipoIBM (
          "fk_idEquipo", "fk_id_Requerimiento", "createdBy"
        )
      VALUES (
        ${idEquipment}, ${idRequest}, '${createdBy}'
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

  static createCommentaryJTRByDigitalRequest(
    idRequest,
    comment,
    type,
    createdBy
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.ComentariosIngeniero (
          "comentario", "fk_id_Requerimiento", "type", "createdBy"
        )
      VALUES (
        '${comment}', ${idRequest}, ${type}, '${createdBy}'
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

  static deactivateAllPartsEquipmentsByDigitalRequest(
    idEquipment,
    idRequest,
    updatedBy
  ) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.PartesEquipoIBM
      SET
        "activo" = 0,
        "updatedBy" = '${updatedBy}',
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "fk_idEquipo" = ${idEquipment} AND "fk_id_Requerimiento" = ${idRequest} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static updateStatusAssigningUserByID(state, id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.UsuariosAsignados
      SET
        "estado" = ${state},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Asignacion" = ${id} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static deactivateAssigningUserByID(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.UsuariosAsignados
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Asignacion" = ${id} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static deactivateEquipmentsAssigningUserByID(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.UsuariosEquipos
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "fk_id_Asignacion" = ${id} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static updateFrusAmountsPartsEquipmentsByID(fru, amount, updatedBy, idPart) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.PartesEquipoIBM
      SET
        "frus" = '${fru}',
        "cantidad" = ${amount},
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

  static updateAssigningUserReturnPlanningByID(id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.UsuariosAsignados
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "id_Asignacion" = ${id} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findEquipmentIdByModelAndRequest(model, idBusinessModel, id) {
    return new Promise((resolve, reject) => {
      const query =
        idBusinessModel === 1
          ? `SELECT
        E."id_CantidadEquipos" AS "idE"
      FROM
        critical_parts_db.EquiposIBM CE
      INNER JOIN
        critical_parts_db.CantidadEquiposIBM E
      ON
        CE."id_Equipo" = E."fk_id_EquipoIBM"
      WHERE
        CE."tipoModelo" = '${model}' AND CE."fk_id_Requerimiento" = ${id}`
          : `SELECT
        E."id_CantidadEquipos" AS "id"
      FROM
        critical_parts_db.EquiposIBM CE
      WHERE
        CE."tipoModelo" = '${model}' AND CE."fk_id_Requerimiento" = ${id}`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static getHistoryEquipmentsPartsByDigitalRequest(
    idBusinessModel,
    idRequest,
    opportunityNumber
  ) {
    return new Promise((resolve, reject) => {
      const query =
        idBusinessModel === 1
          ? `SELECT
        T.rows AS "counts",
        P."id_PartesEquipoIBM" AS "id",
        P."fk_idParteCritica" AS "idCriticalPart",
        P."fk_idEquipo" AS "idEquipment",
        R."numeroVersion" AS "version",
        E."tipoModelo" AS "typeModel",
        E."cantidadEquipos" AS "amountEquipments",
        PC."plataforma" AS "platform",
        PC."categoria" AS "category",
        PC."descripcion" AS "description",
        P."frus" AS "fru",
        P."cantidad" AS "amount",
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
        critical_parts_db.PartesCriticas PC
      ON
        P."fk_idParteCritica" = PC."id_PartesCriticas"
      INNER JOIN
        critical_parts_db.CantidadEquiposIBM E
      ON
        P."fk_idEquipo" = E."id_CantidadEquipos"
      AND
        E."fk_id_Requerimiento"  = P."fk_id_Requerimiento"
      INNER JOIN
        critical_parts_db.Requerimientos R
      ON
        E."fk_id_Requerimiento" = R."id_Requerimiento"
      WHERE
        R."activo" = 1
      AND
        R."id_Requerimiento" != ${idRequest} AND R."numeroOportunidad" = ${opportunityNumber}
      AND
        P."fk_id_Requerimiento" != ${idRequest}
      AND
        P."activo" = 1
      ORDER BY
        P."fk_id_Requerimiento" ASC, P."fk_idEquipo" ASC;`
          : `SELECT
        T.rows AS "counts",
        P."id_PartesEquipoIBM" AS "id",
        P."fk_idParteCritica" AS "idCriticalPart",
        P."fk_idEquipo" AS "idEquipment",
        R."numeroVersion" AS "version",
        E."tipoModelo" AS "typeModel",
        E."cantidadEquipos" AS "amountEquipments",
        PC."plataforma" AS "platform",
        PC."categoria" AS "category",
        PC."descripcion" AS "description",
        P."frus" AS "fru",
        P."cantidad" AS "amount",
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
        critical_parts_db.PartesCriticas PC
      ON
        P."fk_idParteCritica" = PC."id_PartesCriticas"
      INNER JOIN
        critical_parts_db.EquiposIBM E
      ON
        P."fk_idEquipo" = E."id_Equipo"
      AND
          E."fk_id_Requerimiento"  = P."fk_id_Requerimiento"
      INNER JOIN
        critical_parts_db.Requerimientos R
      ON
        E."fk_id_Requerimiento" = R."id_Requerimiento"
      WHERE
        R."activo" = 1
      AND
        R."id_Requerimiento" != ${idRequest} AND R."numeroOportunidad" = ${opportunityNumber}
      AND
        P."fk_id_Requerimiento" != ${idRequest}
      AND
        P."activo" = 1
      ORDER BY
        P."fk_id_Requerimiento" ASC, P."fk_idEquipo" ASC;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static getEquipmentsAssignmentByAssignment(idAssignment) {
    return new Promise((resolve, reject) => {
      const query = `select
        *
      from
        critical_parts_db.usuariosequipos ue
      inner join
        critical_parts_db.usuariosasignados ua
      on
        ue."fk_id_Asignacion" = ua."id_Asignacion"
      and
        ua."id_Asignacion" = ${idAssignment}
      where
        ue.activo = 1 and ua.activo  = 1;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static getAllEquipmentsCompleteByDigitalRequest(idBusinessModel, idRequest) {
    return new Promise((resolve, reject) => {
      const query =
        idBusinessModel === 1
          ? `select distinct
          CE."id_CantidadEquipos" as "id"
          from
          critical_parts_db.equiposibm E
          inner join
          critical_parts_db.cantidadequiposibm CE
          on
          E."id_Equipo"  = CE."fk_id_EquipoIBM" and E."activo" = 1
          inner join
          critical_parts_db.partesequipoibm P
          on
          CE."id_CantidadEquipos" = P."fk_idEquipo" and CE."activo" = 1
          where
          P."fk_id_Requerimiento"  = ${idRequest}
          and
          P.frus is not null;`
          : `select distinct
          E."id_Equipo" as "id"
          from
          critical_parts_db.equiposibm E
          inner join
          critical_parts_db.partesequipoibm P
          on
          E."id_Equipo"  = P."fk_idEquipo" and E."activo" = 1
          where
          P."fk_id_Requerimiento"  = ${idRequest}
          and
          P.frus is not null;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static updateStatusAllAssigningUserByidRequest(state, id) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.UsuariosAsignados
      SET
        "estado" = ${state},
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "fk_id_Requerimiento" = ${id} AND "estado" = 0 AND "activo" = 1 returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static getAllAssignmentEscalation() {
    return new Promise((resolve, reject) => {
      const query = `select
        u."id_Asignacion" as "id",
        u."nombreUsuario"  as "engineer",
        r."numeroOportunidad" as "opp",
        r."createdBy" as "salesRep"
      from
        critical_parts_db.usuariosasignados u
      left join
        critical_parts_db.escalacionusuarios e
      on
        u."id_Asignacion" = e."fk_id_Asignacion"
      inner join
        critical_parts_db.requerimientos r
      on
        u."fk_id_Requerimiento" = r."id_Requerimiento"
      where
        now() - '1 day'::interval  >= u."fechaInicio"
      and
        u."estado" = 0
      and
        u."activo" = 1
      and
        r."activo" = 1
      and
        e."fk_id_Asignacion" is null ;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static createdEscalationAssignment(id) {
    return new Promise((resolve, reject) => {
      const query = `insert into
        critical_parts_db.escalacionusuarios ("fk_id_Asignacion")
      values
        (${id});`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static getAllAssignmentTSSEscalation() {
    return new Promise((resolve, reject) => {
      const query = `select
        u."id_Asignacion" as "id",
        u."nombreUsuario"  as "engineer",
        r."numeroOportunidad" as "opp",
        r."createdBy" as "salesRep"
      from
        critical_parts_db.usuariosasignados u
      inner join
        critical_parts_db.requerimientos r
      on
        u."fk_id_Requerimiento" = r."id_Requerimiento"
      where
        now() - '2 day'::interval  >= u."fechaInicio"
      and
        u."estado" = 0
      and
        u."activo" = 1
      and
        r."estado" < 7
      and
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
}
