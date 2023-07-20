import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import registerApiAccess from "../../helpers/registerApiAccess";
import Controller from "./targetLetter.controller";

const controller = new Controller();

const TargetLetter = Router();

TargetLetter.get("/find-targets-letter-hcm", verifyToken, registerApiAccess, controller.findTargetsLetterHC);

TargetLetter.get("/find-target-letter-by-user", verifyToken, registerApiAccess, controller.findTargetLetterByUser);

TargetLetter.get("/find-target-letter-by-headship", verifyToken, registerApiAccess, controller.findTargetLetterByHeadShip);

TargetLetter.get("/find-target-letter-by-general-manager", verifyToken, registerApiAccess, controller.findTargetLetterByGeneralManager);

TargetLetter.get("/find-target-letter-by-management-service-director", verifyToken, registerApiAccess, controller.findTargetLetterByManagementServicesDirector);

TargetLetter.get("/find-target-letter-by-hcrm", verifyToken, registerApiAccess, controller.findTargetLetterByHCRegional);

TargetLetter.get("/find-my-targets-letters", verifyToken, registerApiAccess, controller.findMyTargetsLetters);

TargetLetter.post("/find-targets-letters", verifyToken, registerApiAccess, controller.findTargetsLetters);

TargetLetter.post("/find-all-data-dashboard", verifyToken, registerApiAccess, controller.findAllDataDashboard);

TargetLetter.post("/create-target-letter", controller.createTargetLetter);

TargetLetter.put("/update-target-letter-flow/:id", verifyToken, registerApiAccess, controller.updateWorkFlowLetter);

TargetLetter.put("/delete-target-letter/:id", verifyToken, registerApiAccess, controller.deleteTargetLetter);

TargetLetter.put("/apply-measure-target-letter", verifyToken, registerApiAccess, controller.applyMeasureTargeLetter);

TargetLetter.put("/reject-target-letter-by-id/:id", verifyToken, registerApiAccess, controller.rejectTargeLetterById);

export default TargetLetter;