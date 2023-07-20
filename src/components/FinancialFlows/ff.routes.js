import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import Controller from "./ff.controller";
import registerApiAccess from "../../helpers/registerApiAccess";

const controller = new Controller();

const FinancialRoutes = Router();

//BUSINESS UNITS
FinancialRoutes.get(
  "/business-units",
  verifyToken,
  registerApiAccess,
  controller.getBusinessUnit
);

//CATEGORIES
FinancialRoutes.get(
  "/categories",
  verifyToken,
  registerApiAccess,
  controller.getCategories
);

//FIELD TYPES
FinancialRoutes.get(
  "/field-types",
  verifyToken,
  registerApiAccess,
  controller.getFieldTypes
);
FinancialRoutes.post(
  "/field-types",
  verifyToken,
  registerApiAccess,
  controller.createFieldType
);
FinancialRoutes.put(
  "/field-types/:id",
  verifyToken,
  registerApiAccess,
  controller.updateFieldType
);
FinancialRoutes.put(
  "/field-types/delete/:id",
  verifyToken,
  registerApiAccess,
  controller.deleteFieldType
);

//TEMPLATE POSITIONS
FinancialRoutes.get(
  "/positions",
  verifyToken,
  registerApiAccess,
  controller.getPositionTemplates
);
FinancialRoutes.get(
  "/positions/:id",
  verifyToken,
  registerApiAccess,
  controller.getPositionTemplateID
);
FinancialRoutes.get(
  "/positions/user/:user",
  verifyToken,
  registerApiAccess,
  controller.getUserSign
);
FinancialRoutes.put(
  "/positions/:id",
  verifyToken,
  registerApiAccess,
  controller.updatePosition
);
FinancialRoutes.post(
  "/positions",
  verifyToken,
  registerApiAccess,
  controller.createPosition
);
FinancialRoutes.put(
  "/position/away/:id",
  verifyToken,
  registerApiAccess,
  controller.isAway
);
FinancialRoutes.put(
  "/position/disable/:id",
  verifyToken,
  registerApiAccess,
  controller.disablePosition
);

//DOCUMENT TEMPLATES
FinancialRoutes.get(
  "/templates",
  verifyToken,
  registerApiAccess,
  controller.getDocumentTemplates
);
FinancialRoutes.get(
  "/templates/document/:id",
  verifyToken,
  registerApiAccess,
  controller.getDocumentIDTemplates
);
FinancialRoutes.get(
  "/templates/category/:category",
  verifyToken,
  registerApiAccess,
  controller.getDocumentTemplatesByCategory
);
FinancialRoutes.post(
  "/templates",
  verifyToken,
  registerApiAccess,
  controller.createDocumentTemplate
);
FinancialRoutes.put(
  "/templates/disable/:id",
  verifyToken,
  registerApiAccess,
  controller.disableDocumentTemplate
);
FinancialRoutes.put(
  "/templates/enable/:id",
  verifyToken,
  controller.enableDocumentTemplate
);
FinancialRoutes.put(
  "/templates/:id",
  verifyToken,
  registerApiAccess,
  controller.updateDocumentTemplate
);

//DOCUMENTS
FinancialRoutes.get(
  "/documents",
  verifyToken,
  registerApiAccess,
  controller.getDocuments
);

FinancialRoutes.post(
  "/documents",
  verifyToken,
  registerApiAccess,
  controller.createDocument
);

FinancialRoutes.put(
  "/documents/:id",
  verifyToken,
  registerApiAccess,
  controller.updateDocument
);

FinancialRoutes.get(
  "/documents/category/:category",
  verifyToken,
  registerApiAccess,
  controller.getDocumentsByCategory
);

//REQUESTS
FinancialRoutes.post(
  "/requests",
  verifyToken,
  registerApiAccess,
  controller.createRequest
);

FinancialRoutes.put(
  "/request/:id",
  verifyToken,
  registerApiAccess,
  controller.updateRequest
);

FinancialRoutes.get(
  "/requests",
  verifyToken,
  registerApiAccess,
  controller.getFilteredRequests
);

FinancialRoutes.get(
  "/request/:id",
  verifyToken,
  registerApiAccess,
  controller.getRequest
);

FinancialRoutes.get(
  "/requests/notifications",
  verifyToken,
  registerApiAccess,
  controller.myRequests
);

FinancialRoutes.get(
  "/requests/user",
  verifyToken,
  registerApiAccess,
  controller.userRequests
);

//REQUEST ACTIONS

FinancialRoutes.put(
  "/request/approval/:id",
  verifyToken,
  registerApiAccess,
  controller.ApproverAction
);

//REQUEST DOCUMENTS: pendiente

// VALIDATE TEMPLATES
FinancialRoutes.put(
  "/templates/query/:id",
  verifyToken,
  registerApiAccess,
  controller.validateTemplates
);

//REMINDER
FinancialRoutes.put(
  "/reminder/:id",
  verifyToken,
  registerApiAccess,
  controller.reminderApprover
);

//ADD REQUEST FILES
FinancialRoutes.put(
  "/files/:id",
  verifyToken,
  registerApiAccess,
  controller.addFiles
);

FinancialRoutes.get(
  "/files/:id",
  verifyToken,
  registerApiAccess,
  controller.downloadAttachment
);

FinancialRoutes.put(
  "/files/remove/:id",
  verifyToken,
  registerApiAccess,
  controller.removeAttachment
);

// TEMPORAL
FinancialRoutes.post(
  "/templates/update",
  // verifyToken,
  // registerApiAccess,
  controller.updateApprovers
);

//RELAUNCH
FinancialRoutes.put(
  "/relaunch/false/:id",
  verifyToken,
  registerApiAccess,
  controller.preventRelaunch
);

FinancialRoutes.put(
  "/relaunch/true/:id",
  verifyToken,
  registerApiAccess,
  controller.relaunchRequest
);

//PROFILES
FinancialRoutes.get(
  "/profiles",
  verifyToken,
  registerApiAccess,
  controller.getProfiles
);
FinancialRoutes.post(
  "/profile",
  verifyToken,
  registerApiAccess,
  controller.createProfile
);
FinancialRoutes.put(
  "/profile/:id",
  verifyToken,
  registerApiAccess,
  controller.updateProfile
);
FinancialRoutes.put(
  "/profile/toggle/:id",
  verifyToken,
  registerApiAccess,
  controller.toggleProfile
);

//STATES: Analizar viabilidad

//DOCUMENTS
FinancialRoutes.get(
  "/states",
  verifyToken,
  registerApiAccess,
  controller.getStates
);

//RR
FinancialRoutes.put(
  "/request/RR/:id",
  verifyToken,
  registerApiAccess,
  controller.updateRRstatus
);
export default FinancialRoutes;
