import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import registerApiAccess from "../../helpers/registerApiAccess";
import Controller from "./mis.controller";

const controller = new Controller();

const MIS = Router();

MIS.get("/find-internal-teams", verifyToken, registerApiAccess, controller.findInternalTeams);

MIS.get("/inactive", verifyToken, registerApiAccess, controller.findInactive);

MIS.put("/update-inactive-info", verifyToken, registerApiAccess, controller.updateInactiveInfo);

MIS.post("/insert-inactive", verifyToken, registerApiAccess, controller.insertInactive);

MIS.get("/maintenance", verifyToken, registerApiAccess, controller.findMaintenance);

MIS.put("/update-maintenance-info", verifyToken, registerApiAccess, controller.updateMaintenanceInfo);

MIS.post("/insert-maintenance", verifyToken, registerApiAccess, controller.insertMaintenance);

MIS.post("/projects", verifyToken, registerApiAccess, controller.findProjects);

MIS.put("/update-projects-info", verifyToken, registerApiAccess, controller.updateProjectsInfo);

MIS.post("/insert-projects", verifyToken, registerApiAccess, controller.insertProjects);

MIS.get("/count-projects", verifyToken, registerApiAccess, controller.countActiveProjects);

export default MIS;