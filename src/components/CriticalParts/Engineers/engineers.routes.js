import { Router } from "express";
import verifyToken from "../../../helpers/verifyToken";
import registerApiAccess from "../../../helpers/registerApiAccess";
import Controller from "./engineers.controller";

const controller = new Controller();

const engineers = Router();

engineers.get(
  "/find-requests-assignation-user",
  verifyToken,
  registerApiAccess,
  controller.findRequestsAssignationUser
);

engineers.get(
  "/find-critical-parts-kit/:typeModel",
  verifyToken,
  registerApiAccess,
  controller.findCriticalPartsKit
);

engineers.get(
  "/find-equipments-selected-parts/:idRequest",
  verifyToken,
  registerApiAccess,
  controller.findEquipmentsSelectedParts
);

engineers.get(
  "/find-equipments-pending-parts/:idRequest",
  verifyToken,
  registerApiAccess,
  controller.findEquipmentsPendingParts
);

engineers.get(
  "/find-equipments-ibm-by-request/:idRequest",
  verifyToken,
  registerApiAccess,
  controller.findEquipmentsIBMRequest
);

engineers.get(
  "/find-parts-equipments-by-request/:idRequest",
  verifyToken,
  registerApiAccess,
  controller.findPartsEquipmentsRequest
);

engineers.get(
  "/find-selected-parts-by-equipment/:idEquipment",
  verifyToken,
  registerApiAccess,
  controller.findSelectedPartsByEquipment
);

engineers.get(
  "/find-history-parts-equipments-by-request/:idRequest",
  verifyToken,
  registerApiAccess,
  controller.findHistoryPartsEquipmentsRequest
);

engineers.post(
  "/create-selected-parts-equipment/:idRequest/:idEquipment",
  verifyToken,
  registerApiAccess,
  controller.createSelectedPartsEquipment
);

engineers.post(
  "/create-pending-parts-equipment/:idRequest/:idEquipment",
  verifyToken,
  registerApiAccess,
  controller.createPendingPartsEquipment
);

engineers.post(
  "/create-comment-to-jtr/:idRequest",
  verifyToken,
  registerApiAccess,
  controller.createCommentaryToJTR
);

engineers.put(
  "/update-state-assignation-user/:id/:state",
  verifyToken,
  registerApiAccess,
  controller.updateStateAssignationUser
);

engineers.put(
  "/update-jtr-assignation-user/:id",
  verifyToken,
  registerApiAccess,
  controller.updateJTRAssignationUser
);

engineers.put(
  "/update-frus-and-amounts-selected-parts",
  verifyToken,
  registerApiAccess,
  controller.updateFrusAndAmountsSelectedParts
);

engineers.put(
  "/update-assignation-user-return-planning/:id",
  verifyToken,
  registerApiAccess,
  controller.updateAssignationUserReturnPlanning
);

export default engineers;
