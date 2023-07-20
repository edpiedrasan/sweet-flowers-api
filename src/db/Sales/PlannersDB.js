/* eslint-disable no-ternary */
/* eslint-disable multiline-ternary */
/* eslint-disable max-lines */
import { runQuery } from "../posgreSQL";

export default class POSTGRESQL {
  constructor() {}

  static getDigitalRequestByAssigning() {
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
      LEFT JOIN
        critical_parts_db.UsuariosAsignados UA
      ON
        R."id_Requerimiento" = UA."fk_id_Requerimiento" AND UA."activo" = 1 AND UA."estado" = 0
      WHERE
        R."activo" = 1 AND (R."estado" = 5 OR R."estado" = 6 OR R."estado" = 9) AND UA."fk_id_Requerimiento" IS NULL
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

  static getValidAssigningByDigitalRequest(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        *
      FROM
        critical_parts_db.UsuariosAsignados
      WHERE
        "fk_id_Requerimiento" = ${idRequest} AND "activo" = 1 AND "estado" = 0;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static createUserAssignmentByDigitalRequest(
    userID,
    username,
    idRequest,
    startDate
  ) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.UsuariosAsignados (
          "idUsuario", "nombreUsuario", "fk_id_Requerimiento", "fechaInicio"
        )
      VALUES (
        ${userID}, '${username}', ${idRequest}, '${startDate}'
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

  static deactivateEquipmentsPartsPendingByDigitalRequest(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.PendientePartesEquipoIBM
      SET
        "activo" = 0,
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

  static getServicesOrdersByDigitalRequest(idRequest) {
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
        OS."fk_id_Requerimiento" = ${idRequest} AND OS."activo" = 1;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static getAllDigitalRequestByAssignment() {
    return new Promise((resolve, reject) => {
      const query = `SELECT DISTINCT
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
      LEFT JOIN
        critical_parts_db.UsuariosAsignados UA
      ON
        R."id_Requerimiento" = UA."fk_id_Requerimiento" AND UA."activo" = 1 AND UA."estado" = 0
      WHERE
        R."activo" = 1 AND (R."estado" = 5 OR R."estado" = 6 OR R."estado" = 9)
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

  static getDigitalRequestAssignmentByID(id) {
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
      LEFT JOIN
        critical_parts_db.UsuariosAsignados UA
      ON
        R."id_Requerimiento" = UA."fk_id_Requerimiento" AND UA."activo" = 1 AND UA."estado" = 0
      WHERE
        R."activo" = 1 AND R."id_Requerimiento" = ${id} AND R."estado" >= 5
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

  static getEquipmentsByDigitalRequest(idRequest, idBusinessModel) {
    return new Promise((resolve, reject) => {
      const query =
        idBusinessModel === 1
          ? `SELECT
          CE."id_CantidadEquipos" as "id",
          UA."id_Asignacion" as "idAssign",
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
          H."nombre" AS "officeHour",
          E."tipoModelo" AS "typeModel",
          P."practica" AS "practice",
          PP."plataforma" AS "platform",
          CASE WHEN UA."nombreUsuario" IS NULL THEN 'Sin Asignar' ELSE UA."nombreUsuario" END AS "engineer",
          CASE
            WHEN UA."estado" = 0 THEN 'Pendiente'
            WHEN UA."estado" = 1 THEN 'Completado'
            WHEN UA."estado" = 2 THEN 'Rechazado'
            WHEN UA."estado" IS NULL THEN 'N/A'
          END AS "status"
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
      INNER JOIN
        critical_parts_db.PlataformaPractica PP
      ON
        E."fk_id_Plataforma" = PP."id_Plataforma"
      INNER JOIN
        critical_parts_db.HorarioAtencion H
      ON
        E."fk_id_HorarioAtencion" = H."id_HorarioAtencion"
      LEFT JOIN
          critical_parts_db.IncluyePartesEquipos IPE
      ON
          E."fk_id_IncluyePartesEquipos" = IPE."id_IncluyePartesEquipos"
      LEFT JOIN
          critical_parts_db.UsuariosEquipos UE
      ON
          CE."id_CantidadEquipos" = UE."fk_idEquipo" AND UE."activo" = 1
      LEFT JOIN
          critical_parts_db.UsuariosAsignados UA
      ON
          UE."fk_id_Asignacion" = UA."id_Asignacion" AND UA.activo = 1
      WHERE
          E."fk_id_Requerimiento" = ${idRequest} AND E."activo" = 1 AND CE."activo" = 1 AND (IPE."id_IncluyePartesEquipos"= 1 OR IPE."id_IncluyePartesEquipos"= 3)
      ORDER BY
          CE."id_CantidadEquipos" ASC;`
          : `SELECT distinct
          E."id_Equipo" AS "id",
          UA."id_Asignacion" as "idAssign",
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
          H."nombre" AS "officeHour",
          E."tipoModelo" AS "typeModel",
          P."practica" AS "practice",
          PP."plataforma" AS "platform",
          CASE WHEN UA."nombreUsuario" IS NULL THEN 'Sin Asignar' ELSE UA."nombreUsuario" END AS "engineer",
          CASE
            WHEN UA."estado" = 0 THEN 'Pendiente'
            WHEN UA."estado" = 1 THEN 'Completado'
            WHEN UA."estado" = 2 THEN 'Rechazado'
            WHEN UA."estado" IS NULL THEN 'N/A'
          END AS "status"
      FROM
          critical_parts_db.EquiposIBM E
      INNER JOIN
        critical_parts_db.Practica P
      ON
        E."fk_id_Practica" = P."id_Practica"
      INNER JOIN
        critical_parts_db.PlataformaPractica PP
      ON
        E."fk_id_Plataforma" = PP."id_Plataforma"
      INNER JOIN
        critical_parts_db.HorarioAtencion H
      ON
        E."fk_id_HorarioAtencion" = H."id_HorarioAtencion"
      LEFT JOIN
          critical_parts_db.IncluyePartesEquipos IPE
      ON
          E."fk_id_IncluyePartesEquipos" = IPE."id_IncluyePartesEquipos"
      LEFT JOIN
          critical_parts_db.UsuariosEquipos UE
      ON
          E."id_Equipo" = UE."fk_idEquipo" AND UE."activo" = 1
      LEFT JOIN
          critical_parts_db.UsuariosAsignados UA
      ON
          UE."fk_id_Asignacion" = UA."id_Asignacion" AND UA.activo = 1
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

  static createUserAssignmentWithEquipments(idEquipment, idAssignment) {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO
        critical_parts_db.UsuariosEquipos (
          "fk_id_Asignacion", "fk_idEquipo"
        )
      VALUES (
        ${idAssignment}, ${idEquipment}
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

  static getUserAssignmentByDigitalRequest(id) {
    return new Promise((resolve, reject) => {
      const query = `select
        u."nombreUsuario" as "username"
      from
        critical_parts_db.usuariosasignados u
      where
        "fk_id_Requerimiento" = ${id}
      and
        u."activo" = 1;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static deactivatedUserAssignmentByDigitalRequest(id) {
    return new Promise((resolve, reject) => {
      const query = `update
        critical_parts_db.usuariosasignados u
      SET
        "activo" = 0
      where
        "fk_id_Requerimiento" = ${id}`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static getPartsEquipmentsByDigitalRequest(id) {
    return new Promise((resolve, reject) => {
      const query = `select
        *
      from
        critical_parts_db.partesequipoibm p
      where
        "fk_id_Requerimiento" = ${id}
      and
        p."activo" = 1;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static deactivatedUserAssignmentByID(id) {
    return new Promise((resolve, reject) => {
      const query = `update
        critical_parts_db.usuariosasignados u
      SET
        "activo" = 0
      where
        "id_Asignacion" = ${id}`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static deactivatedUserEquipmentsByIDAssignment(id) {
    return new Promise((resolve, reject) => {
      const query = `update
        critical_parts_db.usuariosequipos u
      SET
        "activo" = 0
      where
        "fk_id_Asignacion" = ${id}`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static getAllDigitalRequestByAssignmentEscalation() {
    return new Promise((resolve, reject) => {
      const query = `SELECT DISTINCT
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
      LEFT JOIN
        critical_parts_db.UsuariosAsignados UA
      ON
        R."id_Requerimiento" = UA."fk_id_Requerimiento" AND UA."activo" = 1 AND UA."estado" = 0
      WHERE
        R."activo" = 1 AND (R."estado" = 5 OR R."estado" = 6 OR R."estado" = 9) AND (R."updatedAt" + '1 day') < NOW()
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

  static getAllEquipmentsJTRByRequest(idRequest) {
    return new Promise((resolve, reject) => {
      const query = `select
        p."fk_idEquipo" as "id"
      from
        critical_parts_db.pendientepartesequipoibm p
      where
        p."fk_id_Requerimiento" = ${idRequest} and
        p."activo" = 1`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static deactivateEquipmentsPartsPendingByEquipmentID(idEquipment) {
    return new Promise((resolve, reject) => {
      const query = `UPDATE
        critical_parts_db.PendientePartesEquipoIBM
      SET
        "activo" = 0,
        "updatedAt" = CURRENT_TIMESTAMP
      WHERE
        "fk_idEquipo" = ${idEquipment} returning *;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static findAllEquipmentsAssigned() {
    return new Promise((resolve, reject) => {
      const query = `SELECT
          R."id_Requerimiento" AS "id",
          R."fk_id_ModeloDeNegocio" as "idModel",
          case when  R."fk_id_ModeloDeNegocio" = 1 then T3.equipments else T.equipments end as "equipments",
          T2.equipAssigned as "equipAssigned"
      FROM
        critical_parts_db.Requerimientos R
      LEFT JOIN
        (SELECT COUNT(*) as equipments, "fk_id_Requerimiento" as idRequest FROM critical_parts_db.equiposibm WHERE "activo" = 1 GROUP BY "fk_id_Requerimiento") AS T
      ON
        T.idRequest = R."id_Requerimiento"
      LEFT JOIN
        (SELECT COUNT(*) as equipments, "fk_id_Requerimiento" as idRequest FROM critical_parts_db.cantidadequiposibm WHERE "activo" = 1 GROUP BY "fk_id_Requerimiento") AS T3
      ON
        T3.idRequest = R."id_Requerimiento"
      JOIN
        (SELECT COUNT(*) as equipAssigned, ua."fk_id_Requerimiento" as idR from critical_parts_db.UsuariosAsignados ua inner join critical_parts_db.usuariosequipos ue on
        ua."id_Asignacion" = ue."fk_id_Asignacion" and ua.activo = 1 WHERE ue."activo" = 1 GROUP BY ua."fk_id_Requerimiento") AS T2
      ON
        T2.idR = R."id_Requerimiento"
      WHERE
        R."activo" = 1 AND (R."estado" = 5 OR R."estado" = 6 OR R."estado" = 9)
        group by R."id_Requerimiento", T.equipments, T3.equipments , T2.equipAssigned
      ORDER BY
        R."id_Requerimiento", "equipments" DESC;`;
      console.log(query);
      runQuery.query(query, (error, results) => {
        if (error) {
          console.log(error);
          reject([]);
        } else {
          resolve(results.rows);
        }
      });
    });
  }

  static getValidAssigningByID(id) {
    return new Promise((resolve, reject) => {
      const query = `SELECT
        *
      FROM
        critical_parts_db.UsuariosAsignados
      WHERE
        "id_Asignacion" = ${id};`;
      console.log(query);
      runQuery.query(query, (error, results) => {
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
