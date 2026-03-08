import { IRRConnection } from "../connection";

export default class irrigationDB {

  static getAllSchedules() {
    const query = `SELECT * FROM irrigation_schedules ORDER BY time_hour, time_minute`;
    return new Promise((resolve, reject) => {
      try {
        IRRConnection.query(query, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  static getScheduleById(id) {
    const query = `SELECT * FROM irrigation_schedules WHERE id = ?`;
    return new Promise((resolve, reject) => {
      try {
        IRRConnection.query(query, [id], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  static getEnabledSchedulesByDay(day) {
    const query = `SELECT * FROM irrigation_schedules WHERE enabled = 1 AND FIND_IN_SET(?, active_days)`;
    return new Promise((resolve, reject) => {
      try {
        IRRConnection.query(query, [day], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  static createSchedule(data) {
    const query = `INSERT INTO irrigation_schedules (gpio_id, gpio_label, time_hour, time_minute, duration_minutes, active_days, enabled, created_by)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      data.gpio_id,
      data.gpio_label,
      data.time_hour,
      data.time_minute,
      data.duration_minutes,
      data.active_days,
      data.enabled !== undefined ? data.enabled : 1,
      data.created_by || null
    ];
    return new Promise((resolve, reject) => {
      try {
        IRRConnection.query(query, params, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  static updateSchedule(id, data) {
    const query = `UPDATE irrigation_schedules SET gpio_id = ?, gpio_label = ?, time_hour = ?, time_minute = ?, duration_minutes = ?, active_days = ?, enabled = ? WHERE id = ?`;
    const params = [
      data.gpio_id,
      data.gpio_label,
      data.time_hour,
      data.time_minute,
      data.duration_minutes,
      data.active_days,
      data.enabled !== undefined ? data.enabled : 1,
      id
    ];
    return new Promise((resolve, reject) => {
      try {
        IRRConnection.query(query, params, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  static deleteSchedule(id) {
    const query = `DELETE FROM irrigation_schedules WHERE id = ?`;
    return new Promise((resolve, reject) => {
      try {
        IRRConnection.query(query, [id], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  static toggleSchedule(id, enabled) {
    const query = `UPDATE irrigation_schedules SET enabled = ? WHERE id = ?`;
    return new Promise((resolve, reject) => {
      try {
        IRRConnection.query(query, [enabled, id], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  static insertLog(data) {
    const query = `INSERT INTO irrigation_logs (schedule_id, gpio_id, gpio_label, action, cancelled_by, message, scheduled_time)
                   VALUES (?, ?, ?, ?, ?, ?, ?)`;
    const params = [
      data.schedule_id || null,
      data.gpio_id,
      data.gpio_label || null,
      data.action,
      data.cancelled_by || null,
      data.message || null,
      data.scheduled_time || null
    ];
    return new Promise((resolve, reject) => {
      try {
        IRRConnection.query(query, params, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }

  static getLogs(limit = 50, offset = 0) {
    const query = `SELECT * FROM irrigation_logs ORDER BY executed_at DESC LIMIT ? OFFSET ?`;
    return new Promise((resolve, reject) => {
      try {
        IRRConnection.query(query, [limit, offset], (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      } catch (error) {
        console.log(error);
        reject(error);
      }
    });
  }
}