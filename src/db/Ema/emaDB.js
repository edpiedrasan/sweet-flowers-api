/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
/* eslint-disable max-params */
import { connectionEma } from "../../db/connection";

export default class EmaDB {
  static getAllClients() {
    const query = "SELECT Cli_ID AS id, Cli_Nombre AS name FROM M_Clientes;";
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllContracts() {
    const query = `SELECT
      Con_ID AS id,
      Con_Numero AS name,
      Cli_ID AS fk_idClient
    FROM
      M_Contratos;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllServices() {
    const query = `SELECT S.Ser_ID as id, S.Ser_Nombre as name, CS.Con_ID as fk_idContract FROM M_Servicios S INNER JOIN P_ContratoServicio CS ON S.Ser_ID = CS.Ser_ID;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllCoEs() {
    const query = `SELECT DISTINCT C.CoE_ID as id, C.CoE_Nombre as name, CS.Con_ID AS fk_Contract FROM M_CoEs C INNER JOIN P_ServicioXCoE SC ON SC.CoE_ID = C.CoE_ID INNER JOIN M_Servicios S ON SC.Ser_ID = S.Ser_ID INNER JOIN P_ContratoServicio CS ON S.Ser_ID = CS.Ser_ID`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllEquipments() {
    const query = `SELECT E.Equ_ID AS id, E.Equ_Nombre AS name, E.CoE_ID AS fk_idCoe from M_Equipos E;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllSpecialities() {
    const query = `SELECT E.Esp_ID AS id, E.Esp_Nombre AS name, E.Equ_ID as fk_idEquipment FROM M_Especialidades E`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllCollaborators() {
    const query = `SELECT C.Col_LoginRed AS id, C.Col_Nombre AS name, EC.Esp_ID AS fk_idSpeciality FROM M_Colaboradores C INNER JOIN P_EspecialidadColaborador EC ON C.Col_LoginRed = EC.Login_Red GROUP BY C.Col_LoginRed, C.Col_Nombre, fk_idSpeciality`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllActivities() {
    const query = `SELECT
        CA.Act_id AS id,
        CA.Act_id AS name,
        EC.Login_Red AS fk_idCollaborator
    FROM
        RPAConsolidado_Actividades CA
    INNER JOIN M_Colaboradores CO ON
        (CA.Col_Mail = CO.Col_Mail OR CA.Col_Mail = CO.Col_Mail2)
    INNER JOIN P_EspecialidadColaborador EC ON
        CO.Col_LoginRed = EC.Login_Red
    GROUP BY
        CA.Act_id,
        CA.Act_id,
        EC.Login_Red
    ORDER BY
        name;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Consultas para el reporte de Horas Reales vs Horas Planeadas por dia

  static getAllHoursReportedByDay(day) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      -- ROUND(
      --   SUM(CA.Act_DuracionEstimadaSLA) / 60,
      --  2
      -- ) AS plannedHours,
      CL.Cli_Nombre AS name
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = CO.Con_ID AND (CA.Col_Mail LIKE COL.Col_Mail OR CA.Col_Mail LIKE COL.Col_Mail2)
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") = '${day}'
    GROUP BY
      CL.Cli_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursPlannedByDay(day) {
    const query = `SELECT
        -- ROUND(
        --    SUM(CA.Act_DuracionEstimadaSLA) / 60,
        --    2
        --  ) AS plannedHours,
        ROUND(
          (CA.Act_DuracionEstimadaSLA / 60) / (ABS(
              DATEDIFF(
                  CA.Act_FechaCreacion,
                  CA.Act_FechaFinEstimada
              )) + 1),
          2
        ) AS plannedHours,
        CL.Cli_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = CO.Con_ID
    WHERE
        DATE_FORMAT(CA.Act_FechaFinEstimada, "%Y/%m/%d") = '${day}' OR DATE_FORMAT(CA.Act_FechaCreacion, "%Y/%m/%d") = '${day}'
    GROUP BY
      CA.Act_FechaCreacion,
      CA.Act_FechaFinEstimada,
      CA.Act_DuracionEstimadaSLA,
      CL.Cli_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursReportedByDayFilterClient(idClient, day) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      CO.Con_Numero AS name
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = CO.Con_ID AND (CA.Col_Mail LIKE COL.Col_Mail OR CA.Col_Mail LIKE COL.Col_Mail2)
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") = '${day}'
    GROUP BY
      CO.Con_Numero;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursPlannedByDayFilterClient(idClient, day) {
    const query = `SELECT
        ROUND(
          (CA.Act_DuracionEstimadaSLA / 60) / (ABS(
              DATEDIFF(
                  CA.Act_FechaCreacion,
                  CA.Act_FechaFinEstimada
              )) + 1),
          2
        ) AS plannedHours,
        CO.Con_Numero AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = CO.Con_ID
    WHERE
        DATE_FORMAT(CA.Act_FechaFinEstimada, "%Y/%m/%d") = '${day}' OR DATE_FORMAT(CA.Act_FechaCreacion, "%Y/%m/%d") = '${day}'
    GROUP BY
      CA.Act_FechaCreacion,
      CA.Act_FechaFinEstimada,
      CA.Act_DuracionEstimadaSLA,
      CO.Con_Numero;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursReportedByDayFilterContract(idClient, idContract, day) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      COE.CoE_Nombre AS name
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract} AND (CA.Col_Mail LIKE COL.Col_Mail OR CA.Col_Mail LIKE COL.Col_Mail2)
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") = '${day}'
    GROUP BY
      COE.CoE_Nombre`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursPlannedByDayFilterContract(idClient, idContract, day) {
    const query = `SELECT
        ROUND(
              (CA.Act_DuracionEstimadaSLA / 60) / (ABS(
                  DATEDIFF(
                      CA.Act_FechaCreacion,
                      CA.Act_FechaFinEstimada
                  )) + 1),
              2
        ) AS plannedHours,
        COE.CoE_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
        DATE_FORMAT(CA.Act_FechaFinEstimada, "%Y/%m/%d") = '${day}' OR DATE_FORMAT(CA.Act_FechaCreacion, "%Y/%m/%d") = '${day}'
    GROUP BY
      CA.Act_FechaCreacion,
      CA.Act_FechaFinEstimada,
      CA.Act_DuracionEstimadaSLA,
      COE.CoE_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursReportedByDayFilterService(
    idClient,
    idContract,
    idService,
    day
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      COE.CoE_Nombre AS name
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract} AND (CA.Col_Mail LIKE COL.Col_Mail OR CA.Col_Mail LIKE COL.Col_Mail2)
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") = '${day}'
    GROUP BY
      COE.CoE_Nombre`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursPlannedByDayFilterService(
    idClient,
    idContract,
    idService,
    day
  ) {
    const query = `SELECT
        ROUND(
              (CA.Act_DuracionEstimadaSLA / 60) / (ABS(
                  DATEDIFF(
                      CA.Act_FechaCreacion,
                      CA.Act_FechaFinEstimada
                  )) + 1),
              2
        ) AS plannedHours,
        COE.CoE_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
        DATE_FORMAT(CA.Act_FechaFinEstimada, "%Y/%m/%d") = '${day}' OR DATE_FORMAT(CA.Act_FechaCreacion, "%Y/%m/%d") = '${day}'
    GROUP BY
      CA.Act_FechaCreacion,
      CA.Act_FechaFinEstimada,
      CA.Act_DuracionEstimadaSLA,
      COE.CoE_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursReportedByDayFilterCoe(
    idClient,
    idContract,
    idService,
    idCoe,
    day
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      EQ.Equ_Nombre AS name
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract} AND (CA.Col_Mail LIKE COL.Col_Mail OR CA.Col_Mail LIKE COL.Col_Mail2)
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") = '${day}'
    GROUP BY
      EQ.Equ_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursPlannedByDayFilterCoe(
    idClient,
    idContract,
    idService,
    idCoe,
    day
  ) {
    const query = `SELECT
        ROUND(
              (CA.Act_DuracionEstimadaSLA / 60) / (ABS(
                  DATEDIFF(
                      CA.Act_FechaCreacion,
                      CA.Act_FechaFinEstimada
                  )) + 1),
              2
        ) AS plannedHours,
        EQ.Equ_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
        DATE_FORMAT(CA.Act_FechaFinEstimada, "%Y/%m/%d") = '${day}' OR DATE_FORMAT(CA.Act_FechaCreacion, "%Y/%m/%d") = '${day}'
    GROUP BY
      CA.Act_FechaCreacion,
      CA.Act_FechaFinEstimada,
      CA.Act_DuracionEstimadaSLA,
      EQ.Equ_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursReportedByDayFilterEquipments(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    day
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      ES.Esp_Nombre AS name
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract} AND (CA.Col_Mail LIKE COL.Col_Mail OR CA.Col_Mail LIKE COL.Col_Mail2)
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") = '${day}'
    GROUP BY
      ES.Esp_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursPlannedByDayFilterEquipments(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    day
  ) {
    const query = `SELECT
        ROUND(
              (CA.Act_DuracionEstimadaSLA / 60) / (ABS(
                  DATEDIFF(
                      CA.Act_FechaCreacion,
                      CA.Act_FechaFinEstimada
                  )) + 1),
              2
        ) AS plannedHours,
        ES.Esp_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
        DATE_FORMAT(CA.Act_FechaFinEstimada, "%Y/%m/%d") = '${day}' OR DATE_FORMAT(CA.Act_FechaCreacion, "%Y/%m/%d") = '${day}'
    GROUP BY
      CA.Act_FechaCreacion,
      CA.Act_FechaFinEstimada,
      CA.Act_DuracionEstimadaSLA,
      ES.Esp_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursReportedByDayFilterSpecialities(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    day
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      COL.Col_Nombre AS name
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract} AND (CA.Col_Mail LIKE COL.Col_Mail OR CA.Col_Mail LIKE COL.Col_Mail2)
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") = '${day}'
    GROUP BY
      COL.Col_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursPlannedByDayFilterSpecialities(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    day
  ) {
    const query = `SELECT
        ROUND(
              (CA.Act_DuracionEstimadaSLA / 60) / (ABS(
                  DATEDIFF(
                      CA.Act_FechaCreacion,
                      CA.Act_FechaFinEstimada
                  )) + 1),
              2
        ) AS plannedHours,
        COL.Col_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
        DATE_FORMAT(CA.Act_FechaFinEstimada, "%Y/%m/%d") = '${day}' OR DATE_FORMAT(CA.Act_FechaCreacion, "%Y/%m/%d") = '${day}'
    GROUP BY
      CA.Act_FechaCreacion,
      CA.Act_FechaFinEstimada,
      CA.Act_DuracionEstimadaSLA,
      COL.Col_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursReportedByDayFilterCollaborator(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    day
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      CA.Act_id AS name
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract} AND CA.Col_Mail LIKE '%${collaborator}%'
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") = '${day}'
    GROUP BY
      CA.Act_id;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursPlannedByDayFilterCollaborator(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    day
  ) {
    const query = `SELECT
        ROUND(
              (CA.Act_DuracionEstimadaSLA / 60) / (ABS(
                  DATEDIFF(
                      CA.Act_FechaCreacion,
                      CA.Act_FechaFinEstimada
                  )) + 1),
              2
        ) AS plannedHours,
        CA.Act_id AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
        DATE_FORMAT(CA.Act_FechaFinEstimada, "%Y/%m/%d") = '${day}' OR DATE_FORMAT(CA.Act_FechaCreacion, "%Y/%m/%d") = '${day}'
    GROUP BY
      CA.Act_FechaCreacion,
      CA.Act_FechaFinEstimada,
      CA.Act_DuracionEstimadaSLA,
      CA.Act_id;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursReportedByDayFilterActivity(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    idActivity,
    day
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      CA.Act_id AS name
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID AND RA.Act_ID = '${idActivity}'
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract}
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") = '${day}'
    GROUP BY
      CA.Act_id;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursPlannedByDayFilterActivity(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    idActivity,
    day
  ) {
    const query = `SELECT
        ROUND(
              (CA.Act_DuracionEstimadaSLA / 60) / (ABS(
                  DATEDIFF(
                      CA.Act_FechaCreacion,
                      CA.Act_FechaFinEstimada
                  )) + 1),
              2
        ) AS plannedHours,
        CA.Act_id AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Act_id = '${idActivity}' AND CA.Con_Id = ${idContract}
    WHERE
        DATE_FORMAT(CA.Act_FechaFinEstimada, "%Y/%m/%d") = '${day}' OR DATE_FORMAT(CA.Act_FechaCreacion, "%Y/%m/%d") = '${day}'
    GROUP BY
      CA.Act_FechaCreacion,
      CA.Act_FechaFinEstimada,
      CA.Act_DuracionEstimadaSLA,
      CA.Act_id;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Consultas para el reporte de Horas Reales vs Horas Planeadas por Semana

  static getAllHoursReportedByWeek(startDate, endDate) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      -- ROUND(
      --   SUM(CA.Act_DuracionEstimadaSLA) / 60,
      --   2
      -- ) AS plannedHours,
      CL.Cli_Nombre AS name
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = CO.Con_ID AND (CA.Col_Mail LIKE COL.Col_Mail OR CA.Col_Mail LIKE COL.Col_Mail2)
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
      CL.Cli_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursPlannedByWeek(startDate, endDate) {
    const query = `SELECT
        -- ROUND(
        --  (CA.Act_DuracionEstimadaSLA / 60) / (ABS(
        --      DATEDIFF(
        --          CA.Act_FechaCreacion,
        --          CA.Act_FechaFinEstimada
        --      )) + 1),
        --  2
        -- ) AS plannedHours,
        (ROUND(
            (
                CA.Act_DuracionEstimadaSLA / 60
            ) / (ABS(DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada)) + 1),
            2
        ) * (ABS((CASE WHEN CA.Act_FechaFinEstimada <= '${endDate}' AND CA.Act_FechaCreacion >= '${startDate}' THEN DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada) WHEN CA.Act_FechaCreacion <= '${startDate}' AND CA.Act_FechaFinEstimada <= '${endDate}' THEN DATEDIFF('${startDate}',CA.Act_FechaFinEstimada) WHEN CA.Act_FechaCreacion >= '${startDate}' AND CA.Act_FechaFinEstimada >= '${endDate}' THEN DATEDIFF(CA.Act_FechaCreacion, '${endDate}') END)) + 1))  AS plannedHours,
        CL.Cli_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
      (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = CO.Con_ID
    WHERE
        DATE_FORMAT(
            CA.Act_FechaFinEstimada,
            "%Y/%m/%d"
        ) BETWEEN '${startDate}' AND '${endDate}' OR DATE_FORMAT(
            CA.Act_FechaCreacion,
            "%Y/%m/%d"
        ) BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA,
        CL.Cli_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursReportedByWeekFilterClient(idClient, startDate, endDate) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      CO.Con_Numero AS name
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = CO.Con_ID AND (CA.Col_Mail LIKE COL.Col_Mail OR CA.Col_Mail LIKE COL.Col_Mail2)
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
      CO.Con_Numero;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursPlannedByWeekFilterClient(idClient, startDate, endDate) {
    const query = `SELECT
          (ROUND(
            (
                CA.Act_DuracionEstimadaSLA / 60
            ) / (ABS(DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada)) + 1),
            2
        ) * (ABS((CASE WHEN CA.Act_FechaFinEstimada <= '${endDate}' AND CA.Act_FechaCreacion >= '${startDate}' THEN DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada) WHEN CA.Act_FechaCreacion <= '${startDate}' AND CA.Act_FechaFinEstimada <= '${endDate}' THEN DATEDIFF('${startDate}',CA.Act_FechaFinEstimada) WHEN CA.Act_FechaCreacion >= '${startDate}' AND CA.Act_FechaFinEstimada >= '${endDate}' THEN DATEDIFF(CA.Act_FechaCreacion, '${endDate}') END)) + 1))  AS plannedHours,
        CO.Con_Numero AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
      (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = CO.Con_ID
    WHERE
        DATE_FORMAT(
            CA.Act_FechaFinEstimada,
            "%Y/%m/%d"
        ) BETWEEN '${startDate}' AND '${endDate}' OR DATE_FORMAT(
            CA.Act_FechaCreacion,
            "%Y/%m/%d"
        ) BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA,
        CO.Con_Numero;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursReportedByWeekFilterContract(
    idClient,
    idContract,
    startDate,
    endDate
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      COE.CoE_Nombre AS name
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract} AND (CA.Col_Mail LIKE COL.Col_Mail OR CA.Col_Mail LIKE COL.Col_Mail2)
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
      COE.CoE_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursPlannedByWeekFilterContract(
    idClient,
    idContract,
    startDate,
    endDate
  ) {
    const query = `SELECT
          (ROUND(
            (
                CA.Act_DuracionEstimadaSLA / 60
            ) / (ABS(DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada)) + 1),
            2
        ) * (ABS((CASE WHEN CA.Act_FechaFinEstimada <= '${endDate}' AND CA.Act_FechaCreacion >= '${startDate}' THEN DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada) WHEN CA.Act_FechaCreacion <= '${startDate}' AND CA.Act_FechaFinEstimada <= '${endDate}' THEN DATEDIFF('${startDate}',CA.Act_FechaFinEstimada) WHEN CA.Act_FechaCreacion >= '${startDate}' AND CA.Act_FechaFinEstimada >= '${endDate}' THEN DATEDIFF(CA.Act_FechaCreacion, '${endDate}') END)) + 1))  AS plannedHours,
        COE.CoE_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
      (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
        DATE_FORMAT(
            CA.Act_FechaFinEstimada,
            "%Y/%m/%d"
        ) BETWEEN '${startDate}' AND '${endDate}' OR DATE_FORMAT(
            CA.Act_FechaCreacion,
            "%Y/%m/%d"
        ) BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA,
        COE.CoE_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursReportedByWeekFilterService(
    idClient,
    idContract,
    idService,
    startDate,
    endDate
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      COE.CoE_Nombre AS name
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract}
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
      COE.CoE_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursPlannedByWeekFilterService(
    idClient,
    idContract,
    idService,
    startDate,
    endDate
  ) {
    const query = `SELECT
          (ROUND(
            (
                CA.Act_DuracionEstimadaSLA / 60
            ) / (ABS(DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada)) + 1),
            2
        ) * (ABS((CASE WHEN CA.Act_FechaFinEstimada <= '${endDate}' AND CA.Act_FechaCreacion >= '${startDate}' THEN DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada) WHEN CA.Act_FechaCreacion <= '${startDate}' AND CA.Act_FechaFinEstimada <= '${endDate}' THEN DATEDIFF('${startDate}',CA.Act_FechaFinEstimada) WHEN CA.Act_FechaCreacion >= '${startDate}' AND CA.Act_FechaFinEstimada >= '${endDate}' THEN DATEDIFF(CA.Act_FechaCreacion, '${endDate}') END)) + 1))  AS plannedHours,
        COE.CoE_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
      (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
        DATE_FORMAT(
            CA.Act_FechaFinEstimada,
            "%Y/%m/%d"
        ) BETWEEN '${startDate}' AND '${endDate}' OR DATE_FORMAT(
            CA.Act_FechaCreacion,
            "%Y/%m/%d"
        ) BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA,
        COE.CoE_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursReportedByWeekFilterCoe(
    idClient,
    idContract,
    idService,
    idCoe,
    startDate,
    endDate
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      EQ.Equ_Nombre AS name
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract} AND (CA.Col_Mail LIKE COL.Col_Mail OR CA.Col_Mail LIKE COL.Col_Mail2)
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
      EQ.Equ_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursPlannedByWeekFilterCoe(
    idClient,
    idContract,
    idService,
    idCoe,
    startDate,
    endDate
  ) {
    const query = `SELECT
          (ROUND(
            (
                CA.Act_DuracionEstimadaSLA / 60
            ) / (ABS(DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada)) + 1),
            2
        ) * (ABS((CASE WHEN CA.Act_FechaFinEstimada <= '${endDate}' AND CA.Act_FechaCreacion >= '${startDate}' THEN DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada) WHEN CA.Act_FechaCreacion <= '${startDate}' AND CA.Act_FechaFinEstimada <= '${endDate}' THEN DATEDIFF('${startDate}',CA.Act_FechaFinEstimada) WHEN CA.Act_FechaCreacion >= '${startDate}' AND CA.Act_FechaFinEstimada >= '${endDate}' THEN DATEDIFF(CA.Act_FechaCreacion, '${endDate}') END)) + 1))  AS plannedHours,
        EQ.Equ_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
      (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
        DATE_FORMAT(
            CA.Act_FechaFinEstimada,
            "%Y/%m/%d"
        ) BETWEEN '${startDate}' AND '${endDate}' OR DATE_FORMAT(
            CA.Act_FechaCreacion,
            "%Y/%m/%d"
        ) BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA,
        EQ.Equ_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursReportedByWeekFilterEquipment(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    startDate,
    endDate
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      ES.Esp_Nombre AS name
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract} AND (CA.Col_Mail LIKE COL.Col_Mail OR CA.Col_Mail LIKE COL.Col_Mail2)
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
      ES.Esp_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursPlannedByWeekFilterEquipment(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    startDate,
    endDate
  ) {
    const query = `SELECT
          (ROUND(
            (
                CA.Act_DuracionEstimadaSLA / 60
            ) / (ABS(DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada)) + 1),
            2
        ) * (ABS((CASE WHEN CA.Act_FechaFinEstimada <= '${endDate}' AND CA.Act_FechaCreacion >= '${startDate}' THEN DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada) WHEN CA.Act_FechaCreacion <= '${startDate}' AND CA.Act_FechaFinEstimada <= '${endDate}' THEN DATEDIFF('${startDate}',CA.Act_FechaFinEstimada) WHEN CA.Act_FechaCreacion >= '${startDate}' AND CA.Act_FechaFinEstimada >= '${endDate}' THEN DATEDIFF(CA.Act_FechaCreacion, '${endDate}') END)) + 1))  AS plannedHours,
        ES.Esp_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
        DATE_FORMAT(
            CA.Act_FechaFinEstimada,
            "%Y/%m/%d"
        ) BETWEEN '${startDate}' AND '${endDate}' OR DATE_FORMAT(
            CA.Act_FechaCreacion,
            "%Y/%m/%d"
        ) BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA,
        ES.Esp_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursReportedByWeekFilterSpeciality(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    startDate,
    endDate
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      COL.Col_Nombre AS name
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract} AND (CA.Col_Mail LIKE COL.Col_Mail OR CA.Col_Mail LIKE COL.Col_Mail2)
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
      COL.Col_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursPlannedByWeekFilterSpeciality(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    startDate,
    endDate
  ) {
    const query = `SELECT
          (ROUND(
            (
                CA.Act_DuracionEstimadaSLA / 60
            ) / (ABS(DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada)) + 1),
            2
        ) * (ABS((CASE WHEN CA.Act_FechaFinEstimada <= '${endDate}' AND CA.Act_FechaCreacion >= '${startDate}' THEN DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada) WHEN CA.Act_FechaCreacion <= '${startDate}' AND CA.Act_FechaFinEstimada <= '${endDate}' THEN DATEDIFF('${startDate}',CA.Act_FechaFinEstimada) WHEN CA.Act_FechaCreacion >= '${startDate}' AND CA.Act_FechaFinEstimada >= '${endDate}' THEN DATEDIFF(CA.Act_FechaCreacion, '${endDate}') END)) + 1))  AS plannedHours,
        COL.Col_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
      (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
        DATE_FORMAT(
            CA.Act_FechaFinEstimada,
            "%Y/%m/%d"
        ) BETWEEN '${startDate}' AND '${endDate}' OR DATE_FORMAT(
            CA.Act_FechaCreacion,
            "%Y/%m/%d"
        ) BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA,
        COL.Col_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursReportedByWeekFilterCollaborator(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    startDate,
    endDate
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      CA.Act_id AS name
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract} AND CA.Col_Mail LIKE '%${collaborator}%'
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
      CA.Act_id;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursPlannedByWeekFilterCollaborator(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    startDate,
    endDate
  ) {
    const query = `SELECT
          (ROUND(
            (
                CA.Act_DuracionEstimadaSLA / 60
            ) / (ABS(DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada)) + 1),
            2
        ) * (ABS((CASE WHEN CA.Act_FechaFinEstimada <= '${endDate}' AND CA.Act_FechaCreacion >= '${startDate}' THEN DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada) WHEN CA.Act_FechaCreacion <= '${startDate}' AND CA.Act_FechaFinEstimada <= '${endDate}' THEN DATEDIFF('${startDate}',CA.Act_FechaFinEstimada) WHEN CA.Act_FechaCreacion >= '${startDate}' AND CA.Act_FechaFinEstimada >= '${endDate}' THEN DATEDIFF(CA.Act_FechaCreacion, '${endDate}') END)) + 1))  AS plannedHours,
        CA.Act_id AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
        DATE_FORMAT(
            CA.Act_FechaFinEstimada,
            "%Y/%m/%d"
        ) BETWEEN '${startDate}' AND '${endDate}' OR DATE_FORMAT(
            CA.Act_FechaCreacion,
            "%Y/%m/%d"
        ) BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA,
        CA.Act_id;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursReportedByWeekFilterActivity(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    idActivity,
    startDate,
    endDate
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      CA.Act_id AS name
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID AND RA.Act_id = '${idActivity}'
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract}
    WHERE
      DATE_FORMAT(CA.Act_FechaFinReal, "%Y/%m/%d") BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
      CA.Act_id;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHoursPlannedByWeekFilterActivity(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    idActivity,
    startDate,
    endDate
  ) {
    const query = `SELECT
          (ROUND(
            (
                CA.Act_DuracionEstimadaSLA / 60
            ) / (ABS(DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada)) + 1),
            2
        ) * (ABS((CASE WHEN CA.Act_FechaFinEstimada <= '${endDate}' AND CA.Act_FechaCreacion >= '${startDate}' THEN DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada) WHEN CA.Act_FechaCreacion <= '${startDate}' AND CA.Act_FechaFinEstimada <= '${endDate}' THEN DATEDIFF('${startDate}',CA.Act_FechaFinEstimada) WHEN CA.Act_FechaCreacion >= '${startDate}' AND CA.Act_FechaFinEstimada >= '${endDate}' THEN DATEDIFF(CA.Act_FechaCreacion, '${endDate}') END)) + 1))  AS plannedHours,
        CA.Act_id AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Act_id = '${idActivity}' AND CA.Con_Id = ${idContract}
    WHERE
        DATE_FORMAT(
            CA.Act_FechaFinEstimada,
            "%Y/%m/%d"
        ) BETWEEN '${startDate}' AND '${endDate}' OR DATE_FORMAT(
            CA.Act_FechaCreacion,
            "%Y/%m/%d"
        ) BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA,
        CA.Act_id;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Consultas para el reporte del Historico de Horas Reales vs Horas Planeadas por semana

  static getAllHistoryHoursByWeek(startDate, endDate) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      -- ROUND(
      --     SUM(CA.Act_DuracionEstimadaSLA) / 60,
      --     2
      -- ) AS plannedHours,
      DAY(R.Rep_ItemFecha) AS day
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = CO.Con_ID AND (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail)
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
      DAY(R.Rep_ItemFecha)
    ORDER BY DAY`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryPlannedByWeek(startDate, endDate) {
    const query = `SELECT
        ROUND((CA.Act_DuracionEstimadaSLA / 60) /(ABS(
          DATEDIFF(
            CA.Act_FechaCreacion,
            CA.Act_FechaFinEstimada
        )) + 1), 2) AS plannedHours,
        CASE WHEN DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") < '${startDate}' THEN DAY('${startDate}') ELSE DAY(CA.Act_FechaCreacion) END AS startDay,
        CASE WHEN DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") > '${endDate}' THEN DAY('${endDate}') ELSE DAY(CA.Act_FechaFinEstimada) END AS endDay
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = CO.Con_ID
    WHERE
        (DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") >= '${startDate}' OR DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") >= '${startDate}')
    AND
      (DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") <= '${endDate}' OR DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") <= '${endDate}')
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA
    ORDER BY
        startDay ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryHoursByWeekFilterClient(idClient, startDate, endDate) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      DAY(R.Rep_ItemFecha) AS day
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = CO.Con_ID AND (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail)
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
      DAY(R.Rep_ItemFecha)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryPlannedByWeekFilterClient(idClient, startDate, endDate) {
    const query = `SELECT
        ROUND((CA.Act_DuracionEstimadaSLA / 60) /(ABS(
          DATEDIFF(
            CA.Act_FechaCreacion,
            CA.Act_FechaFinEstimada
        )) + 1), 2) AS plannedHours,
        CASE WHEN DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") < '${startDate}' THEN DAY('${startDate}') ELSE DAY(CA.Act_FechaCreacion) END AS startDay,
        CASE WHEN DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") > '${endDate}' THEN DAY('${endDate}') ELSE DAY(CA.Act_FechaFinEstimada) END AS endDay
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
      (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = CO.Con_ID
    WHERE
      (DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") >= '${startDate}' OR DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") >= '${startDate}')
    AND
      (DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") <= '${endDate}' OR DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") <= '${endDate}')
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA
    ORDER BY
        startDay ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryHoursByWeekFilterContract(
    idClient,
    idContract,
    startDate,
    endDate
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      DAY(R.Rep_ItemFecha) AS day
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract} AND (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail)
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
      DAY(R.Rep_ItemFecha)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryPlannedByWeekFilterContract(
    idClient,
    idContract,
    startDate,
    endDate
  ) {
    const query = `SELECT
        ROUND((CA.Act_DuracionEstimadaSLA / 60) /(ABS(
          DATEDIFF(
            CA.Act_FechaCreacion,
            CA.Act_FechaFinEstimada
        )) + 1), 2) AS plannedHours,
        CASE WHEN DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") < '${startDate}' THEN DAY('${startDate}') ELSE DAY(CA.Act_FechaCreacion) END AS startDay,
        CASE WHEN DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") > '${endDate}' THEN DAY('${endDate}') ELSE DAY(CA.Act_FechaFinEstimada) END AS endDay
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
      (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
      (DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") >= '${startDate}' OR DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") >= '${startDate}')
    AND
      (DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") <= '${endDate}' OR DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") <= '${endDate}')
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA
    ORDER BY
        startDay ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryHoursByWeekFilterService(
    idClient,
    idContract,
    idService,
    startDate,
    endDate
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      DAY(R.Rep_ItemFecha) AS day
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract} AND S.Ser_ID = ${idService}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
      DAY(R.Rep_ItemFecha)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryPlannedByWeekFilterService(
    idClient,
    idContract,
    idService,
    startDate,
    endDate
  ) {
    const query = `SELECT
        ROUND((CA.Act_DuracionEstimadaSLA / 60) /(ABS(
          DATEDIFF(
            CA.Act_FechaCreacion,
            CA.Act_FechaFinEstimada
        )) + 1), 2) AS plannedHours,
        CASE WHEN DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") < '${startDate}' THEN DAY('${startDate}') ELSE DAY(CA.Act_FechaCreacion) END AS startDay,
        CASE WHEN DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") > '${endDate}' THEN DAY('${endDate}') ELSE DAY(CA.Act_FechaFinEstimada) END AS endDay
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract} AND S.Ser_ID = ${idService}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id
    WHERE
      (DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") >= '${startDate}' OR DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") >= '${startDate}')
    AND
      (DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") <= '${endDate}' OR DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") <= '${endDate}')
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA
    ORDER BY
        startDay ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryHoursByWeekFilterCoe(
    idClient,
    idContract,
    idService,
    idCoe,
    startDate,
    endDate
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      DAY(R.Rep_ItemFecha) AS day
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract} AND (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail)
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
      DAY(R.Rep_ItemFecha)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryPlannedByWeekFilterCoe(
    idClient,
    idContract,
    idService,
    idCoe,
    startDate,
    endDate
  ) {
    const query = `SELECT
        ROUND((CA.Act_DuracionEstimadaSLA / 60) /(ABS(
          DATEDIFF(
            CA.Act_FechaCreacion,
            CA.Act_FechaFinEstimada
        )) + 1), 2) AS plannedHours,
        CASE WHEN DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") < '${startDate}' THEN DAY('${startDate}') ELSE DAY(CA.Act_FechaCreacion) END AS startDay,
        CASE WHEN DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") > '${endDate}' THEN DAY('${endDate}') ELSE DAY(CA.Act_FechaFinEstimada) END AS endDay
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
      (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
      (DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") >= '${startDate}' OR DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") >= '${startDate}')
    AND
      (DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") <= '${endDate}' OR DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") <= '${endDate}')
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA
    ORDER BY
        startDay ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryHoursByWeekFilterEquipment(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    startDate,
    endDate
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      DAY(R.Rep_ItemFecha) AS day
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract} AND (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail)
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
      DAY(R.Rep_ItemFecha)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryPlannedByWeekFilterEquipment(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    startDate,
    endDate
  ) {
    const query = `SELECT
        ROUND((CA.Act_DuracionEstimadaSLA / 60) /(ABS(
          DATEDIFF(
            CA.Act_FechaCreacion,
            CA.Act_FechaFinEstimada
        )) + 1), 2) AS plannedHours,
        CASE WHEN DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") < '${startDate}' THEN DAY('${startDate}') ELSE DAY(CA.Act_FechaCreacion) END AS startDay,
        CASE WHEN DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") > '${endDate}' THEN DAY('${endDate}') ELSE DAY(CA.Act_FechaFinEstimada) END AS endDay
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID  AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
      (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
      (DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") >= '${startDate}' OR DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") >= '${startDate}')
    AND
      (DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") <= '${endDate}' OR DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") <= '${endDate}')
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA
    ORDER BY
        startDay ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryHoursByWeekFilterSpeciality(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    startDate,
    endDate
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      DAY(R.Rep_ItemFecha) AS day
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract} AND (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail)
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
      DAY(R.Rep_ItemFecha)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryPlannedByWeekFilterSpeciality(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    startDate,
    endDate
  ) {
    const query = `SELECT
        ROUND((CA.Act_DuracionEstimadaSLA / 60) /(ABS(
          DATEDIFF(
            CA.Act_FechaCreacion,
            CA.Act_FechaFinEstimada
        )) + 1), 2) AS plannedHours,
        CASE WHEN DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") < '${startDate}' THEN DAY('${startDate}') ELSE DAY(CA.Act_FechaCreacion) END AS startDay,
        CASE WHEN DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") > '${endDate}' THEN DAY('${endDate}') ELSE DAY(CA.Act_FechaFinEstimada) END AS endDay
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID  AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
      (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
      (DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") >= '${startDate}' OR DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") >= '${startDate}')
    AND
      (DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") <= '${endDate}' OR DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") <= '${endDate}')
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA
    ORDER BY
        startDay ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryHoursByWeekFilterCollaborator(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    startDate,
    endDate
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      DAY(R.Rep_ItemFecha) AS day
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract} AND (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail)
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
      DAY(R.Rep_ItemFecha)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryPlannedByWeekFilterCollaborator(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    startDate,
    endDate
  ) {
    const query = `SELECT
        ROUND((CA.Act_DuracionEstimadaSLA / 60) /(ABS(
          DATEDIFF(
            CA.Act_FechaCreacion,
            CA.Act_FechaFinEstimada
        )) + 1), 2) AS plannedHours,
        CASE WHEN DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") < '${startDate}' THEN DAY('${startDate}') ELSE DAY(CA.Act_FechaCreacion) END AS startDay,
        CASE WHEN DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") > '${endDate}' THEN DAY('${endDate}') ELSE DAY(CA.Act_FechaFinEstimada) END AS endDay
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID  AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN RPAConsolidado_Actividades CA ON
      (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
      (DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") >= '${startDate}' OR DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") >= '${startDate}')
    AND
      (DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") <= '${endDate}' OR DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") <= '${endDate}')
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA
    ORDER BY
        startDay ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryHoursByWeekFilterActivity(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    idActivity,
    startDate,
    endDate
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      DAY(R.Rep_ItemFecha) AS day
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID AND RA.Act_id = '${idActivity}'
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract}
    WHERE
      DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") BETWEEN '${startDate}' AND '${endDate}'
    GROUP BY
      DAY(R.Rep_ItemFecha)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryPlannedByWeekFilterActivity(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    idActivity,
    startDate,
    endDate
  ) {
    const query = `SELECT
        ROUND((CA.Act_DuracionEstimadaSLA / 60) /(ABS(
          DATEDIFF(
            CA.Act_FechaCreacion,
            CA.Act_FechaFinEstimada
        )) + 1), 2) AS plannedHours,
        CASE WHEN DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") < '${startDate}' THEN DAY('${startDate}') ELSE DAY(CA.Act_FechaCreacion) END AS startDay,
        CASE WHEN DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") > '${endDate}' THEN DAY('${endDate}') ELSE DAY(CA.Act_FechaFinEstimada) END AS endDay
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID  AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN RPAConsolidado_Actividades CA ON
      (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Act_ID = '${idActivity}' AND CA.Con_Id = ${idContract}
    WHERE
      (DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") >= '${startDate}' OR DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") >= '${startDate}')
    AND
      (DATE_FORMAT(CA.Act_FechaCreacion,"%Y/%m/%d") <= '${endDate}' OR DATE_FORMAT(CA.Act_FechaFinEstimada,"%Y/%m/%d") <= '${endDate}')
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA
    ORDER BY
        startDay ASC;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Consultas para el reporte del Historico de Horas Reales vs Horas Planeadas por mes

  static getAllHistoryHoursByMonth(month, year) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      -- ROUND(
      --    SUM(CA.Act_DuracionEstimadaSLA) / 60,
      --    2
      -- ) AS plannedHours,
      WEEKDAY(R.Rep_ItemFecha) AS day
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id
    WHERE
      MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      WEEKDAY(R.Rep_ItemFecha)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryPlannedByMonth(month, year) {
    const query = `SELECT
        ROUND((CA.Act_DuracionEstimadaSLA / 60) /(ABS(
          DATEDIFF(
            CA.Act_FechaCreacion,
            CA.Act_FechaFinEstimada
        )) + 1), 2) AS plannedHours,
        DAY(CA.Act_FechaCreacion) AS startDay,
        DAY(CA.Act_FechaFinEstimada) AS endDay
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id
    WHERE
    MONTH(CA.Act_FechaFinEstimada) = ${month} AND YEAR(CA.Act_FechaFinEstimada) = ${year}
    GROUP BY
      WEEKDAY(CA.Act_FechaFinEstimada)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryHoursByMonthFilterClient(idClient, month, year) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      WEEKDAY(R.Rep_ItemFecha) AS day
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id
    WHERE
      MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      WEEKDAY(R.Rep_ItemFecha)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryPlannedByMonthFilterClient(idClient, month, year) {
    const query = `SELECT
        ROUND((CA.Act_DuracionEstimadaSLA / 60) /(ABS(
          DATEDIFF(
            CA.Act_FechaCreacion,
            CA.Act_FechaFinEstimada
        )) + 1), 2) AS plannedHours,
        DAY(CA.Act_FechaCreacion) AS startDay,
        DAY(CA.Act_FechaFinEstimada) AS endDay
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id
    WHERE
    MONTH(CA.Act_FechaFinEstimada) = ${month} AND YEAR(CA.Act_FechaFinEstimada) = ${year}
    GROUP BY
      WEEKDAY(CA.Act_FechaFinEstimada)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryHoursByMonthFilterContract(
    idClient,
    idContract,
    month,
    year
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      WEEKDAY(R.Rep_ItemFecha) AS day
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id
    WHERE
      MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      WEEKDAY(R.Rep_ItemFecha)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryPlannedByMonthFilterContract(
    idClient,
    idContract,
    month,
    year
  ) {
    const query = `SELECT
        ROUND((CA.Act_DuracionEstimadaSLA / 60) /(ABS(
          DATEDIFF(
            CA.Act_FechaCreacion,
            CA.Act_FechaFinEstimada
        )) + 1), 2) AS plannedHours,
        DAY(CA.Act_FechaCreacion) AS startDay,
        DAY(CA.Act_FechaFinEstimada) AS endDay
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id
    WHERE
    MONTH(CA.Act_FechaFinEstimada) = ${month} AND YEAR(CA.Act_FechaFinEstimada) = ${year}
    GROUP BY
      WEEKDAY(CA.Act_FechaFinEstimada)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryHoursByMonthFilterService(
    idClient,
    idContract,
    idService,
    month,
    year
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      WEEKDAY(R.Rep_ItemFecha) AS day
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract} AND S.Ser_ID = ${idService}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id
    WHERE
      MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      WEEKDAY(R.Rep_ItemFecha)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryPlannedByMonthFilterService(
    idClient,
    idContract,
    idService,
    month,
    year
  ) {
    const query = `SELECT
        ROUND((CA.Act_DuracionEstimadaSLA / 60) /(ABS(
          DATEDIFF(
            CA.Act_FechaCreacion,
            CA.Act_FechaFinEstimada
        )) + 1), 2) AS plannedHours,
        DAY(CA.Act_FechaCreacion) AS startDay,
        DAY(CA.Act_FechaFinEstimada) AS endDay
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract} AND S.Ser_ID = ${idService}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id
    WHERE
    MONTH(CA.Act_FechaFinEstimada) = ${month} AND YEAR(CA.Act_FechaFinEstimada) = ${year}
    GROUP BY
      WEEKDAY(CA.Act_FechaFinEstimada)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryHoursByMonthFilterCoe(
    idClient,
    idContract,
    idService,
    idCoe,
    month,
    year
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      WEEKDAY(R.Rep_ItemFecha) AS day
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract} AND S.Ser_ID = ${idService}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id
    WHERE
      MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      WEEKDAY(R.Rep_ItemFecha)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryPlannedByMonthFilterCoe(
    idClient,
    idContract,
    idService,
    idCoe,
    month,
    year
  ) {
    const query = `SELECT
        ROUND((CA.Act_DuracionEstimadaSLA / 60) /(ABS(
          DATEDIFF(
            CA.Act_FechaCreacion,
            CA.Act_FechaFinEstimada
        )) + 1), 2) AS plannedHours,
        DAY(CA.Act_FechaCreacion) AS startDay,
        DAY(CA.Act_FechaFinEstimada) AS endDay
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract} AND S.Ser_ID = ${idService}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id
    WHERE
    MONTH(CA.Act_FechaFinEstimada) = ${month} AND YEAR(CA.Act_FechaFinEstimada) = ${year}
    GROUP BY
      WEEKDAY(CA.Act_FechaFinEstimada)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryHoursByMonthFilterEquipment(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    month,
    year
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      WEEKDAY(R.Rep_ItemFecha) AS day
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract} AND S.Ser_ID = ${idService}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id
    WHERE
      MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      WEEKDAY(R.Rep_ItemFecha)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryPlannedByMonthFilterEquipment(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    month,
    year
  ) {
    const query = `SELECT
        ROUND((CA.Act_DuracionEstimadaSLA / 60) /(ABS(
          DATEDIFF(
            CA.Act_FechaCreacion,
            CA.Act_FechaFinEstimada
        )) + 1), 2) AS plannedHours,
        DAY(CA.Act_FechaCreacion) AS startDay,
        DAY(CA.Act_FechaFinEstimada) AS endDay
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract} AND S.Ser_ID = ${idService}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id
    WHERE
    MONTH(CA.Act_FechaFinEstimada) = ${month} AND YEAR(CA.Act_FechaFinEstimada) = ${year}
    GROUP BY
      WEEKDAY(CA.Act_FechaFinEstimada)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryHoursByMonthFilterSpeciality(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    month,
    year
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      WEEKDAY(R.Rep_ItemFecha) AS day
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract} AND S.Ser_ID = ${idService}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id
    WHERE
      MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      WEEKDAY(R.Rep_ItemFecha)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryPlannedByMonthFilterSpeciality(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    month,
    year
  ) {
    const query = `SELECT
        ROUND((CA.Act_DuracionEstimadaSLA / 60) /(ABS(
          DATEDIFF(
            CA.Act_FechaCreacion,
            CA.Act_FechaFinEstimada
        )) + 1), 2) AS plannedHours,
        DAY(CA.Act_FechaCreacion) AS startDay,
        DAY(CA.Act_FechaFinEstimada) AS endDay
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract} AND S.Ser_ID = ${idService}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id
    WHERE
    MONTH(CA.Act_FechaFinEstimada) = ${month} AND YEAR(CA.Act_FechaFinEstimada) = ${year}
    GROUP BY
      WEEKDAY(CA.Act_FechaFinEstimada)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryHoursByMonthFilterCollaborator(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    month,
    year
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      WEEKDAY(R.Rep_ItemFecha) AS day
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract} AND S.Ser_ID = ${idService}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id
    WHERE
      MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      WEEKDAY(R.Rep_ItemFecha)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryPlannedByMonthFilterCollaborator(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    month,
    year
  ) {
    const query = `SELECT
        ROUND((CA.Act_DuracionEstimadaSLA / 60) /(ABS(
          DATEDIFF(
            CA.Act_FechaCreacion,
            CA.Act_FechaFinEstimada
        )) + 1), 2) AS plannedHours,
        DAY(CA.Act_FechaCreacion) AS startDay,
        DAY(CA.Act_FechaFinEstimada) AS endDay
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract} AND S.Ser_ID = ${idService}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id
    WHERE
    MONTH(CA.Act_FechaFinEstimada) = ${month} AND YEAR(CA.Act_FechaFinEstimada) = ${year}
    GROUP BY
      WEEKDAY(CA.Act_FechaFinEstimada)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryHoursByMonthFilterActivity(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    idActivity,
    month,
    year
  ) {
    const query = `SELECT
      ROUND(
          SUM(DISTINCT RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      WEEKDAY(R.Rep_ItemFecha) AS day
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract} AND S.Ser_ID = ${idService}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID AND RA.Act_id = '${idActivity}'
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id
    WHERE
      MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      WEEKDAY(R.Rep_ItemFecha)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllHistoryPlannedByMonthFilterActivity(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    idActivity,
    month,
    year
  ) {
    const query = `SELECT
        ROUND((CA.Act_DuracionEstimadaSLA / 60) /(ABS(
          DATEDIFF(
            CA.Act_FechaCreacion,
            CA.Act_FechaFinEstimada
        )) + 1), 2) AS plannedHours,
        DAY(CA.Act_FechaCreacion) AS startDay,
        DAY(CA.Act_FechaFinEstimada) AS endDay
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract} AND S.Ser_ID = ${idService}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID AND RA.Act_id = '${idActivity}'
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id
    WHERE
    MONTH(CA.Act_FechaFinEstimada) = ${month} AND YEAR(CA.Act_FechaFinEstimada) = ${year}
    GROUP BY
      WEEKDAY(CA.Act_FechaFinEstimada)`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // Consultas para el reporte de los indicadores por mes

  static getAllIndicators(month, year) {
    const query = `SELECT
        ROUND(
            SUM(RA.Act_MinutosReportados) / 60,
            2
        ) AS realHours,
        CL.Cli_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
        R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
        R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
        RA.Act_ID = CA.Act_id AND CA.Con_Id = CO.Con_ID AND (CA.Col_Mail LIKE COL.Col_Mail OR CA.Col_Mail LIKE COL.Col_Mail2)
    WHERE
        MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
        CL.Cli_Nombre`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllIndicatorsPlanned(month, year) {
    const query = `SELECT
        ROUND(
            (CA.Act_DuracionEstimadaSLA / 60) / (
                ABS(DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada)) + 1
            ) * (ABS(CASE WHEN MONTH(CA.Act_FechaCreacion) >= ${month} AND MONTH(CA.Act_FechaFinEstimada) <= ${month} THEN DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada) WHEN MONTH(CA.Act_FechaCreacion) < ${month} AND MONTH(CA.Act_FechaFinEstimada) <= ${month} THEN DATEDIFF(DATE_SUB(CA.Act_FechaFinEstimada,INTERVAL DAYOFMONTH(CA.Act_FechaFinEstimada)-1 DAY), CA.Act_FechaFinEstimada) WHEN MONTH(CA.Act_FechaCreacion) >= ${month} AND MONTH(CA.Act_FechaFinEstimada) > ${month} THEN DATEDIFF(CA.Act_FechaCreacion, LAST_DAY(CA.Act_FechaCreacion)) END) + 1),
            2
        ) AS plannedHours,
        CL.Cli_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = CO.Con_ID
    WHERE
        (MONTH(CA.Act_FechaCreacion) = ${month} OR MONTH(CA.Act_FechaFinEstimada) = ${month}) AND (YEAR(CA.Act_FechaCreacion) = ${year} OR YEAR(CA.Act_FechaFinEstimada) = ${year})
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA,
        CL.Cli_Nombre`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCollaboratorsIndicator(month, year) {
    const query = `SELECT
        COUNT(DISTINCT R.ColLogin_ID) AS total,
        CL.Cli_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
        COL.Col_LoginRed = R.ColLogin_ID
    INNER JOIN T_ReporteActividades RA ON
        R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
        RA.Act_ID = CA.Act_id AND CA.Con_Id = CO.Con_ID
    WHERE
      MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      CL.Cli_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCollaboratorsIndicatorPlanned(month, year) {
    const query = `SELECT
        COUNT(DISTINCT COL.Col_LoginRed) AS total,
        CL.Cli_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = CO.Con_ID
    WHERE
      (MONTH(CA.Act_FechaCreacion) = ${month} OR MONTH(CA.Act_FechaFinEstimada) = ${month}) AND (YEAR(CA.Act_FechaCreacion) = ${year} OR YEAR(CA.Act_FechaFinEstimada) = ${year})
    GROUP BY
      CL.Cli_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllIndicatorsFilterClient(idClient, month, year) {
    const query = `SELECT
        ROUND(
            SUM(RA.Act_MinutosReportados) / 60,
            2
        ) AS realHours,
        CO.Con_Numero AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
        R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
        R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
        RA.Act_ID = CA.Act_id AND CA.Con_Id = CO.Con_ID AND (CA.Col_Mail LIKE COL.Col_Mail OR CA.Col_Mail LIKE COL.Col_Mail2)
    WHERE
        MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      CO.Con_Numero`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllIndicatorsPlannedFilterClient(idClient, month, year) {
    const query = `SELECT
        ROUND(
            (CA.Act_DuracionEstimadaSLA / 60) / (
                ABS(DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada)) + 1
            ) * (ABS(CASE WHEN MONTH(CA.Act_FechaCreacion) >= ${month} AND MONTH(CA.Act_FechaFinEstimada) <= ${month} THEN DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada) WHEN MONTH(CA.Act_FechaCreacion) < ${month} AND MONTH(CA.Act_FechaFinEstimada) <= ${month} THEN DATEDIFF(DATE_SUB(CA.Act_FechaFinEstimada,INTERVAL DAYOFMONTH(CA.Act_FechaFinEstimada)-1 DAY), CA.Act_FechaFinEstimada) WHEN MONTH(CA.Act_FechaCreacion) >= ${month} AND MONTH(CA.Act_FechaFinEstimada) > ${month} THEN DATEDIFF(CA.Act_FechaCreacion, LAST_DAY(CA.Act_FechaCreacion)) END) + 1),
            2
        ) AS plannedHours,
        CO.Con_Numero AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = CO.Con_ID
    WHERE
        (MONTH(CA.Act_FechaCreacion) = ${month} OR MONTH(CA.Act_FechaFinEstimada) = ${month}) AND (YEAR(CA.Act_FechaCreacion) = ${year} OR YEAR(CA.Act_FechaFinEstimada) = ${year})
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA,
        CO.Con_Numero`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCollaboratorsIndicatorFilterClient(idClient, month, year) {
    const query = `SELECT
        COUNT(DISTINCT R.ColLogin_ID) AS total,
        CO.Con_Numero AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
        COL.Col_LoginRed = R.ColLogin_ID
    INNER JOIN T_ReporteActividades RA ON
        R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
        RA.Act_ID = CA.Act_id AND CA.Con_Id = CO.Con_ID
    WHERE
      MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      CO.Con_Numero;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCollaboratorsIndicatorPlannedFilterClient(idClient, month, year) {
    const query = `SELECT
        COUNT(DISTINCT COL.Col_LoginRed) AS total,
        CO.Con_Numero AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = CO.Con_ID
    WHERE
      (MONTH(CA.Act_FechaCreacion) = ${month} OR MONTH(CA.Act_FechaFinEstimada) = ${month}) AND (YEAR(CA.Act_FechaCreacion) = ${year} OR YEAR(CA.Act_FechaFinEstimada) = ${year})
    GROUP BY
      CO.Con_Numero;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllIndicatorsFilterContract(idClient, idContract, month, year) {
    const query = `SELECT
        ROUND(
            SUM(RA.Act_MinutosReportados) / 60,
            2
        ) AS realHours,
        COE.CoE_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
        R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
        R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
        RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract} AND (CA.Col_Mail LIKE COL.Col_Mail OR CA.Col_Mail LIKE COL.Col_Mail2)
    WHERE
        MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      COE.CoE_Nombre`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllIndicatorsPlannedFilterContract(
    idClient,
    idContract,
    month,
    year
  ) {
    const query = `SELECT
        ROUND(
            (CA.Act_DuracionEstimadaSLA / 60) / (
                ABS(DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada)) + 1
            ) * (ABS(CASE WHEN MONTH(CA.Act_FechaCreacion) >= ${month} AND MONTH(CA.Act_FechaFinEstimada) <= ${month} THEN DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada) WHEN MONTH(CA.Act_FechaCreacion) < ${month} AND MONTH(CA.Act_FechaFinEstimada) <= ${month} THEN DATEDIFF(DATE_SUB(CA.Act_FechaFinEstimada,INTERVAL DAYOFMONTH(CA.Act_FechaFinEstimada)-1 DAY), CA.Act_FechaFinEstimada) WHEN MONTH(CA.Act_FechaCreacion) >= ${month} AND MONTH(CA.Act_FechaFinEstimada) > ${month} THEN DATEDIFF(CA.Act_FechaCreacion, LAST_DAY(CA.Act_FechaCreacion)) END) + 1),
            2
        ) AS plannedHours,
        COE.CoE_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
        (MONTH(CA.Act_FechaCreacion) = ${month} OR MONTH(CA.Act_FechaFinEstimada) = ${month}) AND (YEAR(CA.Act_FechaCreacion) = ${year} OR YEAR(CA.Act_FechaFinEstimada) = ${year})
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA,
        COE.CoE_Nombre`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCollaboratorsIndicatorFilterContract(
    idClient,
    idContract,
    month,
    year
  ) {
    const query = `SELECT
        COUNT(DISTINCT R.ColLogin_ID) AS total,
        COE.CoE_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
        COL.Col_LoginRed = R.ColLogin_ID
    INNER JOIN T_ReporteActividades RA ON
        R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
        RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract}
    WHERE
      MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      COE.CoE_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCollaboratorsIndicatorPlannedFilterContract(
    idClient,
    idContract,
    month,
    year
  ) {
    const query = `SELECT
        COUNT(DISTINCT COL.Col_LoginRed) AS total,
        COE.CoE_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
      (MONTH(CA.Act_FechaCreacion) = ${month} OR MONTH(CA.Act_FechaFinEstimada) = ${month}) AND (YEAR(CA.Act_FechaCreacion) = ${year} OR YEAR(CA.Act_FechaFinEstimada) = ${year})
    GROUP BY
      COE.CoE_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllIndicatorsFilterService(
    idClient,
    idContract,
    idService,
    month,
    year
  ) {
    const query = `SELECT
      ROUND(
          SUM(RA.Act_MinutosReportados) / 60,
          2
      ) AS realHours,
      COE.CoE_Nombre AS name
    FROM
      M_Clientes CL
    INNER JOIN M_Contratos CO ON
      CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
      CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract} AND S.Ser_ID = ${idService}
    INNER JOIN P_ServicioXCoE SC ON
      CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
      SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
      COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
      EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
      ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
      EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
      R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
      R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id
    WHERE
      MONTH(CA.Act_FechaFinReal) = ${month} AND YEAR(CA.Act_FechaFinReal) = ${year}
    GROUP BY
      COE.CoE_Nombre`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCollaboratorsIndicatorFilterService(
    idClient,
    idContract,
    idService,
    month,
    year
  ) {
    const query = `SELECT
        COUNT(DISTINCT R.ColLogin_ID) AS total
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17')
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
        COL.Col_LoginRed = R.ColLogin_ID
    INNER JOIN T_ReporteActividades RA ON
        R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
        RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract}
    WHERE
      MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year};`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllIndicatorsFilterCoe(
    idClient,
    idContract,
    idService,
    idCoe,
    month,
    year
  ) {
    const query = `SELECT
        ROUND(
            SUM(RA.Act_MinutosReportados) / 60,
            2
        ) AS realHours,
        EQ.Equ_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
        R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
        R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
        RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract} AND (CA.Col_Mail LIKE COL.Col_Mail OR CA.Col_Mail LIKE COL.Col_Mail2)
    WHERE
        MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      EQ.Equ_Nombre`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllIndicatorsPlannedFilterCoe(
    idClient,
    idContract,
    idService,
    idCoe,
    month,
    year
  ) {
    const query = `SELECT
        ROUND(
            (CA.Act_DuracionEstimadaSLA / 60) / (
                ABS(DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada)) + 1
            ) * (ABS(CASE WHEN MONTH(CA.Act_FechaCreacion) >= ${month} AND MONTH(CA.Act_FechaFinEstimada) <= ${month} THEN DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada) WHEN MONTH(CA.Act_FechaCreacion) < ${month} AND MONTH(CA.Act_FechaFinEstimada) <= ${month} THEN DATEDIFF(DATE_SUB(CA.Act_FechaFinEstimada,INTERVAL DAYOFMONTH(CA.Act_FechaFinEstimada)-1 DAY), CA.Act_FechaFinEstimada) WHEN MONTH(CA.Act_FechaCreacion) >= ${month} AND MONTH(CA.Act_FechaFinEstimada) > ${month} THEN DATEDIFF(CA.Act_FechaCreacion, LAST_DAY(CA.Act_FechaCreacion)) END) + 1),
            2
        ) AS plannedHours,
        EQ.Equ_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
        (MONTH(CA.Act_FechaCreacion) = ${month} OR MONTH(CA.Act_FechaFinEstimada) = ${month}) AND (YEAR(CA.Act_FechaCreacion) = ${year} OR YEAR(CA.Act_FechaFinEstimada) = ${year})
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA,
        EQ.Equ_Nombre`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCollaboratorsIndicatorFilterCoe(
    idClient,
    idContract,
    idService,
    idCoe,
    month,
    year
  ) {
    const query = `SELECT
        COUNT(DISTINCT R.ColLogin_ID) AS total,
        EQ.Equ_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
        COL.Col_LoginRed = R.ColLogin_ID
    INNER JOIN T_ReporteActividades RA ON
        R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
        RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract}
    WHERE
      MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      EQ.Equ_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCollaboratorsIndicatorPlannedFilterCoe(
    idClient,
    idContract,
    idService,
    idCoe,
    month,
    year
  ) {
    const query = `SELECT
        COUNT(DISTINCT COL.Col_LoginRed) AS total,
        EQ.Equ_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
      (MONTH(CA.Act_FechaCreacion) = ${month} OR MONTH(CA.Act_FechaFinEstimada) = ${month}) AND (YEAR(CA.Act_FechaCreacion) = ${year} OR YEAR(CA.Act_FechaFinEstimada) = ${year})
    GROUP BY
      EQ.Equ_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllIndicatorsFilterEquipment(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    month,
    year
  ) {
    const query = `SELECT
        ROUND(
            SUM(RA.Act_MinutosReportados) / 60,
            2
        ) AS realHours,
        ES.Esp_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
        R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
        R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
        RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract} AND (CA.Col_Mail LIKE COL.Col_Mail OR CA.Col_Mail LIKE COL.Col_Mail2)
    WHERE
        MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      ES.Esp_Nombre`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllIndicatorsPlannedFilterEquipment(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    month,
    year
  ) {
    const query = `SELECT
        ROUND(
            (CA.Act_DuracionEstimadaSLA / 60) / (
                ABS(DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada)) + 1
            ) * (ABS(CASE WHEN MONTH(CA.Act_FechaCreacion) >= ${month} AND MONTH(CA.Act_FechaFinEstimada) <= ${month} THEN DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada) WHEN MONTH(CA.Act_FechaCreacion) < ${month} AND MONTH(CA.Act_FechaFinEstimada) <= ${month} THEN DATEDIFF(DATE_SUB(CA.Act_FechaFinEstimada,INTERVAL DAYOFMONTH(CA.Act_FechaFinEstimada)-1 DAY), CA.Act_FechaFinEstimada) WHEN MONTH(CA.Act_FechaCreacion) >= ${month} AND MONTH(CA.Act_FechaFinEstimada) > ${month} THEN DATEDIFF(CA.Act_FechaCreacion, LAST_DAY(CA.Act_FechaCreacion)) END) + 1),
            2
        ) AS plannedHours,
        ES.Esp_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
        (MONTH(CA.Act_FechaCreacion) = ${month} OR MONTH(CA.Act_FechaFinEstimada) = ${month}) AND (YEAR(CA.Act_FechaCreacion) = ${year} OR YEAR(CA.Act_FechaFinEstimada) = ${year})
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA,
        ES.Esp_Nombre`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCollaboratorsIndicatorFilterEquipment(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    month,
    year
  ) {
    const query = `SELECT
        COUNT(DISTINCT R.ColLogin_ID) AS total,
        ES.Esp_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
        COL.Col_LoginRed = R.ColLogin_ID
    INNER JOIN T_ReporteActividades RA ON
        R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
        RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract}
    WHERE
      MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      ES.Esp_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCollaboratorsIndicatorPlannedFilterEquipment(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    month,
    year
  ) {
    const query = `SELECT
        COUNT(DISTINCT COL.Col_LoginRed) AS total,
        ES.Esp_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
      (MONTH(CA.Act_FechaCreacion) = ${month} OR MONTH(CA.Act_FechaFinEstimada) = ${month}) AND (YEAR(CA.Act_FechaCreacion) = ${year} OR YEAR(CA.Act_FechaFinEstimada) = ${year})
    GROUP BY
      ES.Esp_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllIndicatorsFilterSpeciality(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    month,
    year
  ) {
    const query = `SELECT
        ROUND(
            SUM(RA.Act_MinutosReportados) / 60,
            2
        ) AS realHours,
        COL.Col_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
        R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
        R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
        RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract} AND (CA.Col_Mail LIKE COL.Col_Mail OR CA.Col_Mail LIKE COL.Col_Mail2)
    WHERE
        MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      COL.Col_Nombre`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllIndicatorsPlannedFilterSpeciality(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    month,
    year
  ) {
    const query = `SELECT
        ROUND(
            (CA.Act_DuracionEstimadaSLA / 60) / (
                ABS(DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada)) + 1
            ) * (ABS(CASE WHEN MONTH(CA.Act_FechaCreacion) >= ${month} AND MONTH(CA.Act_FechaFinEstimada) <= ${month} THEN DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada) WHEN MONTH(CA.Act_FechaCreacion) < ${month} AND MONTH(CA.Act_FechaFinEstimada) <= ${month} THEN DATEDIFF(DATE_SUB(CA.Act_FechaFinEstimada,INTERVAL DAYOFMONTH(CA.Act_FechaFinEstimada)-1 DAY), CA.Act_FechaFinEstimada) WHEN MONTH(CA.Act_FechaCreacion) >= ${month} AND MONTH(CA.Act_FechaFinEstimada) > ${month} THEN DATEDIFF(CA.Act_FechaCreacion, LAST_DAY(CA.Act_FechaCreacion)) END) + 1),
            2
        ) AS plannedHours,
        COL.Col_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
        (MONTH(CA.Act_FechaCreacion) = ${month} OR MONTH(CA.Act_FechaFinEstimada) = ${month}) AND (YEAR(CA.Act_FechaCreacion) = ${year} OR YEAR(CA.Act_FechaFinEstimada) = ${year})
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA,
        COL.Col_Nombre`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCollaboratorsIndicatorFilterSpeciality(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    month,
    year
  ) {
    const query = `SELECT
        COUNT(DISTINCT R.ColLogin_ID) AS total,
        COL.Col_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN M_Reportes R ON
        COL.Col_LoginRed = R.ColLogin_ID
    INNER JOIN T_ReporteActividades RA ON
        R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
        RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract}
    WHERE
      MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      COL.Col_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCollaboratorsIndicatorPlannedFilterSpeciality(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    month,
    year
  ) {
    const query = `SELECT
        COUNT(DISTINCT COL.Col_LoginRed) AS total,
        COL.Col_Nombre AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
      (MONTH(CA.Act_FechaCreacion) = ${month} OR MONTH(CA.Act_FechaFinEstimada) = ${month}) AND (YEAR(CA.Act_FechaCreacion) = ${year} OR YEAR(CA.Act_FechaFinEstimada) = ${year})
    GROUP BY
      COL.Col_Nombre;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllIndicatorsFilterCollaborator(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    month,
    year
  ) {
    const query = `SELECT
        ROUND(
            SUM(RA.Act_MinutosReportados) / 60,
            2
        ) AS realHours,
        RA.Act_ID AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN M_Reportes R ON
        R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
        R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
        RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract} AND CA.Col_Mail LIKE '%${collaborator}%'
    WHERE
        MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      RA.Act_ID`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllIndicatorsPlannedFilterCollaborator(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    month,
    year
  ) {
    const query = `SELECT
        ROUND(
            (CA.Act_DuracionEstimadaSLA / 60) / (
                ABS(DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada)) + 1
            ) * (ABS(CASE WHEN MONTH(CA.Act_FechaCreacion) >= ${month} AND MONTH(CA.Act_FechaFinEstimada) <= ${month} THEN DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada) WHEN MONTH(CA.Act_FechaCreacion) < ${month} AND MONTH(CA.Act_FechaFinEstimada) <= ${month} THEN DATEDIFF(DATE_SUB(CA.Act_FechaFinEstimada,INTERVAL DAYOFMONTH(CA.Act_FechaFinEstimada)-1 DAY), CA.Act_FechaFinEstimada) WHEN MONTH(CA.Act_FechaCreacion) >= ${month} AND MONTH(CA.Act_FechaFinEstimada) > ${month} THEN DATEDIFF(CA.Act_FechaCreacion, LAST_DAY(CA.Act_FechaCreacion)) END) + 1),
            2
        ) AS plannedHours,
        CA.Act_ID AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
        (MONTH(CA.Act_FechaCreacion) = ${month} OR MONTH(CA.Act_FechaFinEstimada) = ${month}) AND (YEAR(CA.Act_FechaCreacion) = ${year} OR YEAR(CA.Act_FechaFinEstimada) = ${year})
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA,
        CA.Act_ID`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCollaboratorsIndicatorFilterCollaborator(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    month,
    year
  ) {
    const query = `SELECT
        COUNT(DISTINCT R.ColLogin_ID) AS total,
        RA.Act_ID AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN M_Reportes R ON
      COL.Col_LoginRed = R.ColLogin_ID
    INNER JOIN T_ReporteActividades RA ON
        R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
        RA.Act_ID = CA.Act_id AND CA.Con_Id = ${idContract}
    WHERE
      MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      RA.Act_ID;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCollaboratorsIndicatorPlannedFilterCollaborator(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    month,
    year
  ) {
    const query = `SELECT
        COUNT(DISTINCT COL.Col_LoginRed) AS total,
        CA.Act_ID AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Con_Id = ${idContract}
    WHERE
      (MONTH(CA.Act_FechaCreacion) = ${month} OR MONTH(CA.Act_FechaFinEstimada) = ${month}) AND (YEAR(CA.Act_FechaCreacion) = ${year} OR YEAR(CA.Act_FechaFinEstimada) = ${year})
    GROUP BY
      CA.Act_ID;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllIndicatorsFilterActivity(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    idActivity,
    month,
    year
  ) {
    const query = `SELECT
        ROUND(
            SUM(DISTINCT RA.Act_MinutosReportados) / 60,
            2
        ) AS realHours,
        CA.Act_id AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN M_Reportes R ON
        R.ColLogin_ID = COL.Col_LoginRed
    INNER JOIN T_ReporteActividades RA ON
        R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
        RA.Act_ID = CA.Act_id AND RA.Act_ID = '${idActivity}' AND CA.Con_Id = ${idContract}
    WHERE
        MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      CA.Act_id`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllIndicatorsPlannedFilterActivity(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    idActivity,
    month,
    year
  ) {
    const query = `SELECT
        ROUND(
            (CA.Act_DuracionEstimadaSLA / 60) / (
                ABS(DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada)) + 1
            ) * (ABS(CASE WHEN MONTH(CA.Act_FechaCreacion) >= ${month} AND MONTH(CA.Act_FechaFinEstimada) <= ${month} THEN DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada) WHEN MONTH(CA.Act_FechaCreacion) < ${month} AND MONTH(CA.Act_FechaFinEstimada) <= ${month} THEN DATEDIFF(DATE_SUB(CA.Act_FechaFinEstimada,INTERVAL DAYOFMONTH(CA.Act_FechaFinEstimada)-1 DAY), CA.Act_FechaFinEstimada) WHEN MONTH(CA.Act_FechaCreacion) >= ${month} AND MONTH(CA.Act_FechaFinEstimada) > ${month} THEN DATEDIFF(CA.Act_FechaCreacion, LAST_DAY(CA.Act_FechaCreacion)) END) + 1),
            2
        ) AS plannedHours,
        CA.Act_ID AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Act_ID = '${idActivity}' AND CA.Con_Id = ${idContract}
    WHERE
        (MONTH(CA.Act_FechaCreacion) = ${month} OR MONTH(CA.Act_FechaFinEstimada) = ${month}) AND (YEAR(CA.Act_FechaCreacion) = ${year} OR YEAR(CA.Act_FechaFinEstimada) = ${year})
    GROUP BY
        CA.Act_FechaCreacion,
        CA.Act_FechaFinEstimada,
        CA.Act_DuracionEstimadaSLA,
        CA.Act_ID`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCollaboratorsIndicatorFilterActivity(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    idActivity,
    month,
    year
  ) {
    const query = `SELECT
        COUNT(DISTINCT R.ColLogin_ID) AS total,
        RA.Act_ID AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN M_Reportes R ON
      COL.Col_LoginRed = R.ColLogin_ID
    INNER JOIN T_ReporteActividades RA ON
        R.Rep_ID = RA.Rep_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
        RA.Act_ID = CA.Act_id AND RA.Act_ID = '${idActivity}' AND CA.Con_Id = ${idContract}
    WHERE
      MONTH(R.Rep_ItemFecha) = ${month} AND YEAR(R.Rep_ItemFecha) = ${year}
    GROUP BY
      RA.Act_ID;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCollaboratorsIndicatorPlannedFilterActivity(
    idClient,
    idContract,
    idService,
    idCoe,
    idEquipment,
    idSpeciality,
    collaborator,
    idActivity,
    month,
    year
  ) {
    const query = `SELECT
        COUNT(DISTINCT COL.Col_LoginRed) AS total,
        CA.Act_ID AS name
    FROM
        M_Clientes CL
    INNER JOIN M_Contratos CO ON
        CL.Cli_ID = CO.Cli_ID AND CL.Cli_ID = ${idClient}
    INNER JOIN P_ContratoServicio CS ON
        CO.Con_ID = CS.Con_ID AND CO.Con_ID = ${idContract}
    INNER JOIN P_ServicioXCoE SC ON
        CS.Ser_ID = SC.Ser_ID
    INNER JOIN M_CoEs COE ON
        SC.CoE_ID = COE.CoE_ID AND COE.CoE_ID not in('17') AND COE.CoE_ID = ${idCoe}
    INNER JOIN M_Equipos EQ ON
        COE.CoE_ID = EQ.CoE_ID AND EQ.Equ_ID = ${idEquipment}
    INNER JOIN M_Especialidades ES ON
        EQ.Equ_ID = ES.Equ_ID AND ES.Esp_ID = ${idSpeciality}
    INNER JOIN P_EspecialidadColaborador EC ON
        ES.Esp_ID = EC.Esp_ID
    INNER JOIN M_Colaboradores COL ON
        EC.Login_Red = COL.Col_LoginRed AND COL.Col_LoginRed = '${collaborator}'
    INNER JOIN RPAConsolidado_Actividades CA ON
        (COL.Col_Mail = CA.Col_Mail OR COL.Col_Mail2 = CA.Col_Mail) AND CA.Act_ID = '${idActivity}' AND CA.Con_Id = ${idContract}
    WHERE
      (MONTH(CA.Act_FechaCreacion) = ${month} OR MONTH(CA.Act_FechaFinEstimada) = ${month}) AND (YEAR(CA.Act_FechaCreacion) = ${year} OR YEAR(CA.Act_FechaFinEstimada) = ${year})
    GROUP BY
      CA.Act_ID;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getWorkinHours(month, year) {
    const query = `SELECT
        HA.HorasHabiles
    FROM
        M_HorasHabiles HA
    WHERE
        HA.Mes = ${month} AND YEAR(HA.Año) = ${year}`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCollaboratorsReported(startDate, endDate) {
    const query = `SELECT
        C.Col_LoginRed AS username,
        C.Col_Nombre AS name,
        R.Rep_ID AS reportID,
        DATE_FORMAT(R.Rep_ItemFecha, "%d/%m/%Y") AS reportDate,
        RA.Act_ID AS activityID,
        COE.CoE_Nombre AS coeName,
        EQ.Equ_Nombre AS equipmentName,
        CA.Act_Nombre AS activityName,
        CA.Act_FechaCreacion AS createdDate,
        CASE WHEN CA.Act_FechaFinEstimada IS NULL THEN 'N/A' ELSE CA.Act_FechaFinEstimada END AS estimatedEndDate,
        CASE WHEN CA.Act_FechaFinReal IS NULL THEN 'N/A' ELSE CA.Act_FechaFinReal END as actualEndDate,
        CASE WHEN CA.Act_FechaFinEstimada IS NULL THEN 'N/A' ELSE ABS(DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinEstimada)) + 1 END AS estimatedTotalDays ,
        CASE WHEN CA.Act_FechaFinReal IS NULL THEN 'N/A' ELSE ABS(DATEDIFF(CA.Act_FechaCreacion, CA.Act_FechaFinReal)) + 1 END AS actualTotalDays,
        ROUND(
            CA.Act_DuracionEstimadaSLA / 60,
            2
        ) AS hoursPlanned,
        ROUND(
            RA.Act_MinutosReportados / 60,
            2
        ) AS hoursReported,
        ROUND(
            TA2.totalHoursReported / 60,
            2
        ) AS totalHoursReported,
        'Actividades Cargables' AS typeActivity
    FROM
        M_Colaboradores C
    INNER JOIN M_Reportes R ON
        C.Col_LoginRed = R.ColLogin_ID
    INNER JOIN T_ReporteActividades RA ON
        R.Rep_ID = RA.Rep_ID
    INNER JOIN M_CoEs COE ON
        C.CoE_ID = COE.CoE_ID
    INNER JOIN M_Equipos EQ ON
        C.Equ_ID = EQ.Equ_ID
    INNER JOIN RPAConsolidado_Actividades CA ON
      RA.Act_ID = CA.Act_id AND (C.Col_Mail = CA.Col_Mail OR C.Col_Mail2 = CA.Col_Mail)
    JOIN (SELECT SUM(RA.Act_MinutosReportados) as totalHoursReported, RA.Act_ID  as id FROM T_ReporteActividades RA GROUP BY id) TA2 ON RA.Act_ID = TA2.id
    WHERE
        DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") BETWEEN '${startDate}' AND '${endDate}'
    ORDER BY
        reportID ASC`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection New Position DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getCollaboratorsReportedNotChargeable(startDate, endDate) {
    const query = `SELECT
        C.Col_LoginRed AS username,
        C.Col_Nombre AS name,
        R.Rep_ID AS reportID,
        DATE_FORMAT(R.Rep_ItemFecha, "%d/%m/%Y") AS reportDate,
        RA.Act_ID AS activityID,
        COE.CoE_Nombre AS coeName,
        EQ.Equ_Nombre AS equipmentName,
        ANC.Act_Nombre AS activityName,
        'N/A' AS createdDate,
        'N/A' AS estimatedEndDate,
        'N/A' AS actualEndDate,
        'N/A' AS estimatedTotalDays,
        'N/A' AS actualTotalDays,
        'N/A' AS hoursPlanned,
        ROUND(
            RA.Act_MinutosReportados / 60,
            2
        ) AS hoursReported,
        ROUND(
                TA2.totalHoursReported / 60,
                2
            ) AS totalHoursReported,
        'Actividades No Cargables' AS typeActivity
    FROM
        M_Colaboradores C
    INNER JOIN M_Reportes R ON
        C.Col_LoginRed = R.ColLogin_ID
    INNER JOIN T_ReporteActividades RA ON
        R.Rep_ID = RA.Rep_ID
    INNER JOIN M_CoEs COE ON
        C.CoE_ID = COE.CoE_ID
    INNER JOIN M_Equipos EQ ON
        C.Equ_ID = EQ.Equ_ID
    INNER JOIN M_ActividadesNoCargables ANC ON
        RA.Act_ID = ANC.ActNoCargables_ID
    JOIN (SELECT SUM(RA.Act_MinutosReportados) as totalHoursReported, RA.Act_ID  as id FROM T_ReporteActividades RA GROUP BY id) TA2 ON RA.Act_ID = TA2.id
    WHERE
        DATE_FORMAT(R.Rep_ItemFecha, "%Y/%m/%d") BETWEEN '${startDate}' AND '${endDate}'
    ORDER BY
        reportID ASC`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getHoursAccused(startDate, endDate) {
    const query = `CALL REPORTEHORASIMPUTADAS ('${startDate}', '${endDate}')`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getValuesMaintenanceUsers() {
    const query = `CALL OBTENERVALORESMANTENIMIENTOUSUARIOS ()`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getActivitiesReport(month, year) {
    let query = ""; //`CALL REPORTEDEACTIVIDADES ('${month}', '${year}')`;
    if (month === 0) {
      query = `CALL REPORTEDEACTIVIDADES_ALL ('${year}')`;
    } else {
      query = `CALL REPORTEDEACTIVIDADES ('${month}', '${year}')`;
    }
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getYearsActivitiesReport() {
    const query = `SELECT DISTINCT YEAR(Rep_ItemFecha) AS year FROM M_Reportes;`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createUserCoe(values) {
    const {
      coe,
      country,
      equipment,
      idColab,
      username,
      fullname,
      email,
      email2,
      lider,
    } = values;
    const query = `INSERT INTO M_Colaboradores(
      Col_LoginRed,
      Col_Nombre,
      Col_Mail,
      CoE_ID,
      Equ_ID,
      Col_Mail2,
      Col_ID,
      liderCoE,
      Pai_ID
    )
    VALUES(
      '${username}',
      '${fullname}',
      '${email}',
      ${coe},
      ${equipment},
      '${email2 ? email2 : null}',
      ${idColab},
      ${lider ? 1 : 0},
      ${country}
    );`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateUserCoe(values) {
    const {
      coeID,
      countryID,
      equipID,
      idUser,
      username,
      name,
      email,
      email2,
      lider,
    } = values;
    const query = `UPDATE
        M_Colaboradores
      SET
        Col_LoginRed = '${username}',
        Col_Nombre = '${name}',
        Col_Mail = '${email}',
        CoE_ID = ${coeID},
        Equ_ID = ${equipID},
        Col_Mail2 = '${email2}',
        Col_ID = ${idUser},
        liderCoE = ${lider ? 1 : 0},
        Pai_ID = ${countryID}
    WHERE
        Col_LoginRed = '${username}';`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createSpecialityColab(username, speciality) {
    const query = `INSERT INTO P_EspecialidadColaborador(
      Login_Red,
      Esp_ID
    )
    VALUES(
      '${username}',
      ${speciality}
    );`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateSpecialityColab(username, speciality) {
    const query = `UPDATE
        P_EspecialidadColaborador
    SET
        Esp_ID = ${speciality}
    WHERE
        Login_Red = '${username}';`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static getAllEmaUsersActive() {
    const query = `SELECT
        C.Col_ID AS 'idUser',
        C.Col_LoginRed AS 'username',
        C.Col_Nombre AS 'name',
        C.Col_Mail AS 'email',
        CASE WHEN C.Col_Mail2 IS NULL THEN 'N/A' ELSE C.Col_Mail2 END AS 'email2',
        CASE WHEN C.liderCoE = 0 THEN 'NO' ELSE "SÍ" END AS "coeLider",
        C.CoE_ID AS "coeID",
        CO.CoE_Nombre AS "coeName",
        C.Equ_ID AS "equipID",
        E.Equ_Nombre AS "equipName",
        EC.Esp_ID AS "espID",
        ES.Esp_Nombre AS "espName",
        C.Pai_ID AS "countryID",
        P.Pai_Nombre AS "countryName"
    FROM
        M_Colaboradores C
    INNER JOIN M_CoEs CO ON
        C.CoE_ID = CO.CoE_ID
    INNER JOIN M_Equipos E ON
        C.Equ_ID = E.Equ_ID
    INNER JOIN P_EspecialidadColaborador EC ON
        C.Col_LoginRed = EC.Login_Red
    INNER JOIN M_Especialidades ES ON
        EC.Esp_ID = ES.Esp_ID
    INNER JOIN M_Pais P ON
        C.Pai_ID = P.Pai_ID`;
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findUserByUsername(username) {
    const query = `SELECT
        *
    FROM
        M_Colaboradores C
    WHERE
        C.Col_LoginRed = '${username}'`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createMasterVarible(name, type) {
    let query = ``;
    if (type === "coes") {
      query = `INSERT INTO M_CoEs(
        CoE_Nombre
      )
      VALUES(
        '${name}'
      );`;
    } else if (type === "equipments") {
      query = `INSERT INTO M_Equipos(
        Equ_Nombre
      )
      VALUES(
        '${name}'
      );`;
    } else if (type === "countries") {
      query = `INSERT INTO M_Pais(
        Pai_Nombre
      )
      VALUES(
        '${name}'
      );`;
    } else if (type === "specialities") {
      query = `INSERT INTO M_Especialidades(
        Esp_Nombre
      )
      VALUES(
        '${name}'
      );`;
    }
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static updateMasterVaribleByID(id, name, type) {
    let query = ``;
    if (type === "coes") {
      query = `UPDATE
        M_CoEs
      SET
        CoE_Nombre = '${name}'
      WHERE
        CoE_ID = ${id};`;
    } else if (type === "equipments") {
      query = `UPDATE
        M_Equipos
      SET
        Equ_Nombre = '${name}'
      WHERE
        Equ_ID = ${id};`;
    } else if (type === "countries") {
      query = `UPDATE
        M_Pais
      SET
        Pai_Nombre = '${name}'
      WHERE
        Pai_ID = ${id};`;
    } else if (type === "specialities") {
      query = `UPDATE
        M_Especialidades
      SET
        Esp_Nombre = '${name}'
      WHERE
        Esp_ID = ${id};`;
    }
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static deactivateMasterVaribleByID(id, type) {
    let query = ``;
    if (type === "coes") {
      query = `UPDATE
        M_CoEs
      SET
        activo = 0
      WHERE
        CoE_ID = ${id};`;
    } else if (type === "equipments") {
      query = `UPDATE
        M_Equipos
      SET
        activo = 0
      WHERE
        Equ_ID = ${id};`;
    } else if (type === "countries") {
      query = `UPDATE
        M_Pais
      SET
        activo = 0
      WHERE
        Pai_ID = ${id};`;
    } else if (type === "specialities") {
      query = `UPDATE
        M_Especialidades
      SET
        activo = 0
      WHERE
        Esp_ID = ${id};`;
    }
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static findActivePeriod() {
    const query = `select * from M_Periodos ORDER BY Per_Id DESC LIMIT 1;`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
            reject(err);
          }
          resolve(rows);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  static createReportByPeriod(idPeriod, username, date) {
    const query = `INSERT INTO M_Reportes(Per_ID, ColLogin_ID, Rep_ItemFecha) VALUES (${idPeriod}, '${username}', '${date}');`;
    console.log(query);
    return new Promise((resolve, reject) => {
      try {
        connectionEma.query(query, (err, rows) => {
          if (err) {
            console.log(`Error Conection COE DB: ${err}`);
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
