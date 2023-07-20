import { Router } from "express";
import verifyToken from "../../../helpers/verifyToken";
import registerApiAccess from "../../../helpers/registerApiAccess";
import Controller from "./planners.controller";

const controller = new Controller();

const planners = Router();

planners.get(
  "/find-requests-pending-assignation",
  verifyToken,
  registerApiAccess,
  controller.findRequestsPendingAssignation
);

planners.get(
  "/find-all-requests-assignment",
  verifyToken,
  registerApiAccess,
  controller.findAllRequestsAssignment
);

planners.get(
  "/find-equipments-assignment-by-request/:id",
  verifyToken,
  registerApiAccess,
  controller.findEquipmentsAssignmentByRequest
);

planners.get(
  "/find-user-assignment-by-request/:id",
  verifyToken,
  registerApiAccess,
  controller.findUserAssignmentByRequest
);

planners.get(
  "/find-all-parts-equipments-by-request/:id",
  verifyToken,
  registerApiAccess,
  controller.findAllPartsEquipmentsByRequest
);

planners.post(
  "/create-user-assignment-by-planner/:id",
  verifyToken,
  registerApiAccess,
  controller.createUserAssignmentByPlanner
);

planners.post(
  "/create-user-assignment-with-equipments-by-planner/:id",
  verifyToken,
  registerApiAccess,
  controller.createUserAssignmentWithEquipmentsByPlanner
);

planners.post(
  "/validate-gbm-collaborator",
  verifyToken,
  registerApiAccess,
  controller.validateGbmCollaborator
);

export default planners;
