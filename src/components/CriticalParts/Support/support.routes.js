import { Router } from "express";
import verifyToken from "../../../helpers/verifyToken";
import registerApiAccess from "../../../helpers/registerApiAccess";
import Controller from "./support.controller";

const controller = new Controller();

const support = Router();

support.get(
  "/find-master-variables-by-table-master/:type",
  verifyToken,
  registerApiAccess,
  controller.findMasterVariablesByMasterTable
);

support.get(
  "/find-all-user-escalation-tss",
  verifyToken,
  registerApiAccess,
  controller.findAllUserEscalationTss
);

support.post(
  "/create-master-variables-by-table-master",
  verifyToken,
  registerApiAccess,
  controller.createMasterVariablesByMasterTable
);

support.post(
  "/create-user-escalation-tss",
  verifyToken,
  registerApiAccess,
  controller.createUserEscalationTSS
);

support.put(
  "/update-master-variables-by-table-master",
  verifyToken,
  registerApiAccess,
  controller.updateMasterVariablesByMasterTable
);

support.put(
  "/deactivate-master-variables-by-table-master/:id/:type",
  verifyToken,
  registerApiAccess,
  controller.deactivatedMasterVariablesByMasterTable
);

support.put(
  "/deactivate-user-escalation-tss/:id",
  verifyToken,
  registerApiAccess,
  controller.deactivatedUserEscalationTss
);

export default support;
