import { Router } from "express";
import Controller from "./irrigationController";
import verifyToken from "../../helpers/verifyToken";

const controller = new Controller();

const ir = Router();

ir.get("/schedules", verifyToken, controller.getAllSchedules);
ir.get("/schedules/:id", verifyToken, controller.getScheduleById);
ir.post("/schedules", verifyToken, controller.createSchedule);
ir.put("/schedules/:id", verifyToken, controller.updateSchedule);
ir.delete("/schedules/:id", verifyToken, controller.deleteSchedule);
ir.put("/schedules/:id/toggle", verifyToken, controller.toggleSchedule);
ir.get("/logs", verifyToken, controller.getLogs);
ir.get("/gpio-status", verifyToken, controller.getGpioStatus);
ir.post("/gpio-toggle/:id", verifyToken, controller.toggleGpio);

export default ir;