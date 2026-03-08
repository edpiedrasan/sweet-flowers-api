CREATE DATABASE IF NOT EXISTS irrigation_db;
USE irrigation_db;

CREATE TABLE irrigation_schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  gpio_id INT NOT NULL,
  gpio_label VARCHAR(100) NOT NULL,
  time_hour TINYINT NOT NULL,            -- 0-23
  time_minute TINYINT NOT NULL,          -- 0-59
  duration_minutes INT NOT NULL,          -- minutos de riego
  active_days VARCHAR(20) NOT NULL,       -- "0,1,2,3,4,5,6" (0=Domingo)
  enabled TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(100) DEFAULT NULL
);

CREATE TABLE irrigation_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  schedule_id INT DEFAULT NULL,
  gpio_id INT NOT NULL,
  gpio_label VARCHAR(100) DEFAULT NULL,
  action ENUM('NOTIFICATION_SENT','CANCELLED','STARTED','COMPLETED','ERROR','MANUAL_ON','MANUAL_OFF') NOT NULL,
  cancelled_by VARCHAR(100) DEFAULT NULL,
  message TEXT DEFAULT NULL,
  scheduled_time DATETIME DEFAULT NULL,
  executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE irrigation_logs ADD COLUMN created_by VARCHAR(100)      DEFAULT NULL AFTER cancelled_by;pero