import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import RHModuleAccess from "../../helpers/moduleAccess";
import Controller from "./salary.controller";
import multer from "multer";
import fs from "fs";
import path from "path";

import registerApiAccess from "../../helpers/registerApiAccess";

const controller = new Controller();

const SalaryRoutes = Router();

SalaryRoutes.put(
  "/approvers",
  verifyToken,
  RHModuleAccess,
  registerApiAccess,
  controller.getApprovers
); //se quito middleware
SalaryRoutes.get(
  "/approvers/others",
  verifyToken,
  RHModuleAccess,
  registerApiAccess,
  controller.getOtherApprovers
);
SalaryRoutes.get(
  "/notifications",
  verifyToken,
  RHModuleAccess,
  registerApiAccess,
  controller.getUserNotifications
);

//REQUEST
SalaryRoutes.post(
  "/",
  verifyToken,
  RHModuleAccess,
  registerApiAccess,
  controller.createRequest
);
SalaryRoutes.get(
  "/pending",
  verifyToken,
  RHModuleAccess,
  registerApiAccess,
  controller.getPendingRequests
);
SalaryRoutes.get(
  "/complete",
  verifyToken,
  RHModuleAccess,
  registerApiAccess,
  controller.getCompleteRequests
);
SalaryRoutes.get(
  "/cancelled",
  verifyToken,
  RHModuleAccess,
  registerApiAccess,
  controller.getCancelledRequests
);
SalaryRoutes.post(
  "/action/:id",
  verifyToken,
  // RHModuleAccess,
  registerApiAccess,
  controller.approverAction
);

SalaryRoutes.put(
  "/action/bypass/:id",
  verifyToken,
  RHModuleAccess,
  registerApiAccess,
  controller.bypassApproverAction
);

SalaryRoutes.get(
  "/bypass/doc/:id",
  verifyToken,
  RHModuleAccess,
  registerApiAccess,
  controller.getBypassDocument
);

SalaryRoutes.get(
  "/status/:id",
  verifyToken,
  //RHModuleAccess,
  registerApiAccess,
  controller.getRequest
);
SalaryRoutes.put(
  "/cancel/:id",
  verifyToken,
  RHModuleAccess,
  registerApiAccess,
  controller.cancelRequest
);
SalaryRoutes.put(
  "/document/:id",
  verifyToken,
  // RHModuleAccess,
  registerApiAccess,
  controller.getRequestFullDocument
);
SalaryRoutes.put(
  "/reminder/:id",
  verifyToken,
  RHModuleAccess,
  registerApiAccess,
  controller.reminderApprover
);
SalaryRoutes.get(
  "/approval/info/:id",
  verifyToken,
  RHModuleAccess,
  registerApiAccess,
  controller.getApproverInfo
);

//SHOW SENSITIVE INFORMATION
SalaryRoutes.get(
  "/session/check/:document",
  verifyToken,
  //RHModuleAccess,
  registerApiAccess,
  controller.checkSession
);

//MEJORAS

SalaryRoutes.put(
  "/action/upload/:id",
  verifyToken,
  RHModuleAccess,
  registerApiAccess,
  controller.uploadRequestFile
);

SalaryRoutes.get(
  "/action/download/:id",
  verifyToken,
  RHModuleAccess,
  registerApiAccess,
  controller.downloadRequestFiles
);

SalaryRoutes.put(
  "/action/delete/:id",
  verifyToken,
  RHModuleAccess,
  registerApiAccess,
  controller.deleteFile
);

export default SalaryRoutes;
