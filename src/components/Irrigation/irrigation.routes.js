import { Router } from "express";
import Controller from "./irrigationController";
import verifyToken from "../../helpers/verifyToken";

const controller = new Controller();

const ir = Router();

ir.post("/schedules/list", verifyToken, controller.getAllSchedules);
ir.post("/schedules/get/:id", verifyToken, controller.getScheduleById);
ir.post("/schedules", verifyToken, controller.createSchedule);
ir.put("/schedules/:id", verifyToken, controller.updateSchedule);
ir.delete("/schedules/:id", verifyToken, controller.deleteSchedule);
ir.put("/schedules/:id/toggle", verifyToken, controller.toggleSchedule);
ir.post("/logs/list", verifyToken, controller.getLogs);
ir.post("/gpio-status", verifyToken, controller.getGpioStatus);
ir.post("/gpio-toggle/:id", verifyToken, controller.toggleGpio);

export default ir;