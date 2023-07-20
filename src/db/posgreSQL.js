/* eslint-disable prefer-promise-reject-errors */
/* eslint-disable no-useless-constructor */
import { Pool } from 'pg';
import CONFIG from "../config/config";

export const runQuery = new Pool({
  user: CONFIG.DBPOSGRESQL_USER,
  host: CONFIG.DBPOSGRESQL_HOST,
  database: CONFIG.DBPOSGRESQL_NAME,
  password: CONFIG.DBPOSGRESQL_PASSWORD,
  port: CONFIG.DBPOSGRESQL_PORT,
});