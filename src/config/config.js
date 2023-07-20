/* eslint-disable no-undef */
/* eslint-disable no-process-env */
import * as dotenv from "dotenv";

dotenv.config();

export default {
  // APP: process.env.APP || "PRD",
  // PORT: process.env.PORT || "43888", // 43888

  APP: process.env.APP || "PRD",
  PORT: process.env.PORT || "43888", // 43888

  // Nodemailer Credenciales para el envio de correos
  NM_EMAIL: process.env.NM_EMAIL || "SmartSimple@mailgbm.com",
  NM_PASSWORD: process.env.NM_PASSWORD || "Validate$$20a",

  // Data Base
  DB2_PROTOCOL: process.env.DB2_PROTOCOL || "TCPIP",

  // Database Connection
  DB_HOST: process.env.DB_HOST || "localhost",//"10.7.60.151",
  DB_PASSWORD: process.env.DB_PASSWORD || "",//"4md34dm1n",
  DB_PORT: process.env.DB_PORT || "3306",//"3307",
  DB_USER: process.env.DB_USER || "root",

  // Database PostgreSQL Connection
  DBPOSGRESQL_HOST: process.env.DBPOSGRESQL_HOST || "10.7.60.151",
  DBPOSGRESQL_PORT: process.env.DBPOSGRESQL_PORT || "5432",
  DBPOSGRESQL_NAME: process.env.DBPOSGRESQL_NAME || "MIS",
  DBPOSGRESQL_USER: process.env.DBPOSGRESQL_USER || "root",
  DBPOSGRESQL_PASSWORD: process.env.DBPOSGRESQL_PASSWORD || "MIS2021",

  // Database DB2 Conection
  DB2_HOST: process.env.DB2_HOST || "10.7.11.128",
  DB2_PORT: process.env.DB2_PORT || "60006",
  DB2_NAME: process.env.DB2_NAME || "SORDB",
  DB2_USER: process.env.DB2_USER || "db2admin",
  DB2_PASSWORD: process.env.DB2_PASSWORD || "manager",

  // Cognos Database DB2 Conection
  CG_HOST: process.env.CG_HOST || "10.7.11.14",
  CG_PORT: process.env.CG_PORT || "50001",
  CG_NAME: process.env.CG_NAME || "DHWBI",
  CG_USER: process.env.CG_USER || "am_consu",
  CG_PASSWORD: process.env.CG_PASSWORD || "Gbmgbm19",

  JWT_ENCRYPTION: process.env.JWT_ENCRYPTION || "U21hcnRBbmRTaW1wbGUyMDE5",
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || "1d",

  // Usuario Para uso de servicios SOAP
  SW_USERNAME: process.env.SW_USERNAME || "mrs_user",
  SW_PASSWORD: process.env.SW_PASSWORD || "Gbm2018*",

  // API_KEY_MAIL_NEW_POSITION: process.env.API_KEY_MAIL_NEW_POSITION || "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",
  API_KEY_MAIL_NEW_POSITION:
    process.env.API_KEY_MAIL_NEW_POSITION ||
    "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",

  BPM_USER: process.env.BPM_DEADMIN || "deadmin",

  // BPM_PASSWORD: process.env.BPM_PASSWORD_DEV || 'desamanager',

  // BPM_PASSWORD: process.env.BPM_PASSWORD_DEV || 'BPMQAAdmin',

  BPM_PASSWORD: process.env.BPM_PASSWORD || "AdministratorBPM2020",

  //Databot Database Connection
  DB_HOST_DT: process.env.DB_HOST_DT || "10.7.60.72",
  DB_USER_DT: process.env.DB_USER_DT || "databot",
  DB_PASSWORD_DT: process.env.DB_PASSWORD_DT || "UqJkkoxRVkIXSJYf",
  DB_PORT_DT: process.env.DB_PORT_DT || "3306",

  //redis
  REDIS_HOST: process.env.REDIS_HOST || "10.7.60.72",
  REDIS_PORT: process.env.REDIS_PORT || 6379,
};
