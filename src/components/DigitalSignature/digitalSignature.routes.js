import { Router } from "express";
import verifyToken from '../../helpers/verifyToken';
import registerApiAccess from "../../helpers/registerApiAccess";
import Controller from "./digitalSignature.controller";

const controller = new Controller();

const digitalSignature = Router();

digitalSignature.get("/find-users-with-access", verifyToken, registerApiAccess, controller.findUsersWithAccess);

// find all years by signatures
digitalSignature.get("/find-all-years-signatures", verifyToken, registerApiAccess, controller.findAllYearsSignatures);

// find all signatures by dashboard
digitalSignature.get("/find-data-by-dashboard", verifyToken, registerApiAccess, controller.findDataByDashboard);

// find data that register signature
digitalSignature.get("/find-data-register-form/:id", verifyToken, registerApiAccess, controller.findDataRegisterSignature);

// find all signatures of user
digitalSignature.get("/find-signatures-by-user", verifyToken, registerApiAccess, controller.findSignaturesByUser);

// send to user email all signatures signed
digitalSignature.get("/send-all-documents-signed", verifyToken, registerApiAccess, controller.sendAllDocumentsSigned);

// find all signature by country that dashboard
digitalSignature.post("/find-data-by-countrys-dashboard", verifyToken, registerApiAccess, controller.findDataByCountrysDashboard);

// find all signatures pending flow by supervisor
digitalSignature.get("/find-signatures-pending-by-supervisor", verifyToken, registerApiAccess, controller.findSignaturesPendingBySupervisor);

// find all signatures pending flow by collaborator
digitalSignature.get("/find-signatures-pending-by-collaborator", verifyToken, registerApiAccess, controller.findSignaturesPendingByCollaborator);

// find flow log by id
digitalSignature.get("/find-flow-log-by-id/:idFlow", verifyToken, registerApiAccess, controller.findFlowLogByIdFlow);

// find home office information by id signature
digitalSignature.get("/find-home-office-info-by-id/:idSignature", verifyToken, registerApiAccess, controller.findHomeOfficeInfoById);

// create manual signatures by collaborator
digitalSignature.post("/create-policy-signature", verifyToken, registerApiAccess, controller.createGbmPolicySignatures);

// create automatization signatures by collaborator
digitalSignature.post("/create-policy-user-signature/:id", verifyToken, registerApiAccess, controller.createPolicyUserSignature);

digitalSignature.post("/create-user-access", verifyToken, registerApiAccess, controller.createUserAccess);

// create exception user signature
digitalSignature.post("/create-exception-user-signature/:id", verifyToken, registerApiAccess, controller.createExeptionUserSignature);

// update state aproval flow signature by supervisor
digitalSignature.put("/update-state-signature-in-flow/:idSignature/:idFlow", verifyToken, registerApiAccess, controller.updateStateSignatureInFlow);

// update signature data by collaborator
digitalSignature.put("/update-signature-by-collaborator/:idSignature", verifyToken, registerApiAccess, controller.updateSigntureByCollaborator);

// relaunch signature by collaborator
digitalSignature.put("/relaunch-signature-by-collaborator/:idSignature", verifyToken, registerApiAccess, controller.relaunchSigntureByCollaborator);

digitalSignature.put("/deactivate-user-with-access/:id", verifyToken, registerApiAccess, controller.deactivatedUserWithAccess);

export default digitalSignature;