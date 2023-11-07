/* eslint-disable no-undef */
/* eslint-disable no-process-env */
import * as dotenv from "dotenv";

dotenv.config();

export default {
  // APP: process.env.APP || "PRD",
  // PORT: process.env.PORT || "43888", // 43888

  APP: process.env.APP || "PRD",
  // PORT: process.env.PORT || "43888", // 43888
  PORT: process.env.PORT || 43888, // 43888

  // Nodemailer Credenciales para el envio de correos
  NM_EMAIL: process.env.NM_EMAIL || "Scom",
  NM_PASSWORD: process.env.NM_PASSWORD || "",

  // Data Base
  DB2_PROTOCOL: process.env.DB2_PROTOCOL || "TCPIP",

  // Database Connection
  DB_HOST: process.env.DB_HOST || "FlowFlowers",
  DB_PASSWORD: process.env.DB_PASSWORD || "Vhnfod24",
  DB_PORT: process.env.DB_PORT || "3306",
  DB_USER: process.env.DB_USER || "root",

  // Database PostgreSQL Connection
  DBPOSGRESQL_HOST: process.env.DBPOSGRESQL_HOST || "",
  DBPOSGRESQL_PORT: process.env.DBPOSGRESQL_PORT || "",
  DBPOSGRESQL_NAME: process.env.DBPOSGRESQL_NAME || "",
  DBPOSGRESQL_USER: process.env.DBPOSGRESQL_USER || "",
  DBPOSGRESQL_PASSWORD: process.env.DBPOSGRESQL_PASSWORD || "",

  // Database DB2 Conection
  DB2_HOST: process.env.DB2_HOST || "",
  DB2_PORT: process.env.DB2_PORT || "",
  DB2_NAME: process.env.DB2_NAME || "",
  DB2_USER: process.env.DB2_USER || "",
  DB2_PASSWORD: process.env.DB2_PASSWORD || "",

  // Cognos Database DB2 Conection
  CG_HOST: process.env.CG_HOST || "",
  CG_PORT: process.env.CG_PORT || "",
  CG_NAME: process.env.CG_NAME || "",
  CG_USER: process.env.CG_USER || "",
  CG_PASSWORD: process.env.CG_PASSWORD || "",

  JWT_ENCRYPTION: process.env.JWT_ENCRYPTION || "U21hcnRBbmRTaW1wbGUyMDE5",
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || "1d",

  // Usuario Para uso de servicios SOAP
  SW_USERNAME: process.env.SW_USERNAME || "",
  SW_PASSWORD: process.env.SW_PASSWORD || "",

  API_KEY_MAIL_NEW_POSITION:
    process.env.API_KEY_MAIL_NEW_POSITION ||
    "S",

  BPM_USER: process.env.BPM_DEADMIN || "deadmin",

  BPM_PASSWORD: process.env.BPM_PASSWORD || "",

  //Databot Database Connection
  DB_HOST_DT: process.env.DB_HOST_DT || "",
  DB_USER_DT: process.env.DB_USER_DT || "",
  DB_PASSWORD_DT: process.env.DB_PASSWORD_DT || "",
  DB_PORT_DT: process.env.DB_PORT_DT || "",

  //redis
  REDIS_HOST: process.env.REDIS_HOST || "",
  REDIS_PORT: process.env.REDIS_PORT || 2,
};
