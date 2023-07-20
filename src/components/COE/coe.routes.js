import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import registerApiAccess from "../../helpers/registerApiAccess";
import Controller from "./coe.controller";

const controller = new Controller();

const COE = Router();

COE.get("/find-available-filters", verifyToken, registerApiAccess, controller.findAvailableFilters);

COE.post("/find-data-by-calendar-mode", verifyToken, registerApiAccess, controller.findDataByCalendarMode);

COE.post("/find-history-data-by-calendar-mode", verifyToken, registerApiAccess, controller.findHistoryDataByCalendarMode);

COE.post("/find-indicator-data-by-calendar-mode", verifyToken, registerApiAccess, controller.findIndicatorDataByCalendarMode);

COE.post("/find-collaborators-reported", verifyToken, registerApiAccess, controller.findCollaboratorsReported);

COE.post("/find-hours-accused-by-dates", verifyToken, registerApiAccess, controller.findHoursAccusedByDates);

COE.get("/find-values-maintenance-users", verifyToken, registerApiAccess, controller.findValuesMaintenanceUsers);

COE.get("/find-all-ema-users-active", verifyToken, registerApiAccess, controller.findAllEmaUsersActive);

COE.post("/find-activities-report-by-dates", verifyToken, registerApiAccess, controller.findActivitiesReportByDates);

COE.post("/create-user-coe", verifyToken, registerApiAccess, controller.createUserCoe);

COE.put("/update-user-coe", verifyToken, registerApiAccess, controller.updateUserCoe);

COE.post("/create-master-variable", verifyToken, registerApiAccess, controller.createMasterVariable);

COE.put("/update-master-variable-by-id/:id", verifyToken, registerApiAccess, controller.updateMasterVariableByID);

COE.put("/delete-master-variable-by-id/:id/:type", verifyToken, registerApiAccess, controller.deactivateMasterVariableByID);

export default COE;