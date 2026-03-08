import { Router } from "express";
import Controller from "./irrigationController";

const controller = new Controller();

const ir = Router();

ir.get("/schedules", controller.getAllSchedules);
ir.get("/schedules/:id", controller.getScheduleById);
ir.post("/schedules", controller.createSchedule);
ir.put("/schedules/:id", controller.updateSchedule);
ir.delete("/schedules/:id", controller.deleteSchedule);
ir.put("/schedules/:id/toggle", controller.toggleSchedule);
ir.get("/logs", controller.getLogs);
ir.get("/gpio-status", controller.getGpioStatus);
ir.post("/gpio-toggle/:id", controller.toggleGpio);

export default ir;