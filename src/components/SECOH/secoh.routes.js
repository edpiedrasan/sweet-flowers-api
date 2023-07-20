import { Router } from "express";
import verifyToken, { verifyTokenComptrollerServices } from "../../helpers/verifyToken";
import Controller from "./secoh.controller";
import registerApiAccess from "../../helpers/registerApiAccess";

const controller = new Controller();

const SecohRoutes = Router();

SecohRoutes.get("/find-contracts-on-hold", controller.findContractsOnHold);

SecohRoutes.post("/find-all-data-master-by-status/:status", controller.findAllDataMasterByStatus);

SecohRoutes.get("/find-all-contracts-on-hold/:type", verifyToken, registerApiAccess, controller.findAllContractsOnHold);

SecohRoutes.get("/find-contract-on-hold-by-id/:id", controller.findContractOnHoldByID);

SecohRoutes.get("/find-all-status-available", verifyToken, registerApiAccess, controller.findAllStatusAvailable);

SecohRoutes.get("/find-activity-logs-by-contract-id/:id", verifyToken, registerApiAccess, controller.findActivityLogsByContractID);

SecohRoutes.get("/find-users-notification-matrix", verifyToken, registerApiAccess, controller.findUsersNotificationMatrix);

SecohRoutes.get("/find-users-escalation-matrix", verifyToken, registerApiAccess, controller.findUsersEscalationMatrix);

SecohRoutes.get("/find-all-target-start-date-request-by-apply", controller.findAllTargetStartDateRequestByApply);

SecohRoutes.post("/find-dashboard-contracts-on-hold-by-type/:type", verifyToken, controller.findDashboardContractsOnHoldByType);

SecohRoutes.post("/find-contract-graph-detail", verifyToken, controller.findContractGraphDetail);

SecohRoutes.post("/find-contract-graph-detail-by-country/:country", verifyToken, controller.findContractGraphDetailByCountry);

SecohRoutes.post("/create-contract-on-hold", controller.createContractOnHold);

SecohRoutes.post("/create-activity-log-by-contract-on-hold-id/:id", verifyToken, registerApiAccess, controller.createActivityLogByContractOnHoldID);

SecohRoutes.post("/create-user-notification", verifyToken, registerApiAccess, controller.createUserNotification);

SecohRoutes.post("/create-user-escalation", verifyToken, registerApiAccess, controller.createUserEscalation);

SecohRoutes.post("/create-status-contract-on-hold", verifyToken, registerApiAccess, controller.createStatusContractOnHold);

SecohRoutes.post("/create-data-master", verifyToken, registerApiAccess, controller.createDataMaster);

SecohRoutes.put("/update-contract-on-hold-by-id/:id", controller.updateContractOnHoldByID);

SecohRoutes.put("/update-status-contract-on-hold-by-id/:id/:idState", verifyToken, registerApiAccess, controller.updateStatusContractOnHoldByID);

SecohRoutes.put("/update-target-start-date-contract-on-hold-by-id/:id", verifyToken, registerApiAccess, controller.updateTargetStartDateContractOnHoldByID);

SecohRoutes.get("/update-request-target-start-date-contract-on-hold-by-id/:token", verifyTokenComptrollerServices, controller.updateRequestTargetStartDateContractOnHoldByID);

SecohRoutes.put("/update-user-escalation-notification-by-id/:id", verifyToken, registerApiAccess, controller.updateUserEscalationNotificationByID);

SecohRoutes.put("/update-user-escalation-by-id/:id", verifyToken, registerApiAccess, controller.updateUserEscalationByID);

SecohRoutes.put("/update-status-by-id/:id", verifyToken, registerApiAccess, controller.updateStatusByID);

SecohRoutes.put("/update-target-start-date-request-applied", controller.updateTargetStartDateRequestApplied);

SecohRoutes.put("/deactivate-user-escalation-notification-by-id/:id", verifyToken, registerApiAccess, controller.deactivateUserEscalationNotificationByID);

SecohRoutes.put("/deactivate-user-escalation-by-id/:id", verifyToken, registerApiAccess, controller.deactivateUserEscalationByID);

SecohRoutes.put("/deactivate-status-by-id/:id", verifyToken, registerApiAccess, controller.deactivateStatusByID);

SecohRoutes.put("/update-data-master-by-id/:id", verifyToken, registerApiAccess, controller.updateDataMasterById);

SecohRoutes.put("/update-status-data-master-by-id/:id/:status", verifyToken, registerApiAccess, controller.updateStatusDataMasterById);

SecohRoutes.post("/upload-reference-request-target-start-date", verifyToken, registerApiAccess, controller.uploadReferenceRequestTargetStartDate);

SecohRoutes.post("/validate-gbm-collaborator", verifyToken, registerApiAccess, controller.validateGbmCollaborator);

export default SecohRoutes;