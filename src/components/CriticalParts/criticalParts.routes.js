import { Router } from "express";
import verifyToken from '../../helpers/verifyToken';
import registerApiAccess from "../../helpers/registerApiAccess";
import Controller from "./criticalParts.controller";

const controller = new Controller();

const criticalParts = Router();

criticalParts.get("/find-filtered-models/:page/:sizePerPage", verifyToken, registerApiAccess, controller.findFilteredModels);

criticalParts.post("/find-critical-parts/:page/:sizePerPage", /*verifyToken,*/ registerApiAccess, controller.findCriticalParts);

criticalParts.post("/find-values-and-equipments-by-requirement/:id", verifyToken, registerApiAccess, controller.findValuesAndEquipmentsByRequirement);

criticalParts.get("/find-all-requeriments-by-user", verifyToken, registerApiAccess, controller.findAllRequerimentByUser);

criticalParts.post("/create-filter-model", verifyToken, registerApiAccess, controller.createModelFilter);

criticalParts.post("/create-critical-parts", verifyToken, registerApiAccess, controller.createCriticalParts);

criticalParts.post("/create-requirement", verifyToken, registerApiAccess, controller.createRequirements);

criticalParts.post("/create-ibm-equipment", verifyToken, registerApiAccess, controller.createIbmEquipment);

criticalParts.post("/create-cisco-equipment", verifyToken, registerApiAccess, controller.createCiscoEquipment);

criticalParts.put("/delete-debugged-model/:id", verifyToken, registerApiAccess, controller.deleteDebuggedModel);

criticalParts.put("/update-critical-part/:id", verifyToken, registerApiAccess, controller.updateCriticalParts);

criticalParts.put("/delete-critical-part/:id", verifyToken, registerApiAccess, controller.deleteCriticalPart);

export default criticalParts;