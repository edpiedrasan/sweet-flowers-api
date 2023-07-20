import { Router } from "express";
import verifyToken from "../../../helpers/verifyToken";
import registerApiAccess from "../../../helpers/registerApiAccess";
import Controller from "./inventories.controller";

const controller = new Controller();

const inventories = Router();

inventories.get(
  "/find-requests-in-quotes",
  verifyToken,
  registerApiAccess,
  controller.findRequestsInQuotes
);

inventories.get(
  "/find-info-request-in-quote/:idRequest",
  verifyToken,
  registerApiAccess,
  controller.findInfoRequestInQuote
);

inventories.get(
  "/find-comments-request-in-quote/:idList",
  verifyToken,
  registerApiAccess,
  controller.findCommentsRequestInQuote
);

inventories.get(
  "/find-files-request-in-quote/:idList",
  verifyToken,
  registerApiAccess,
  controller.findFilesRequestInQuote
);

inventories.post(
  "/download-parts-by-model-in-quote",
  verifyToken,
  registerApiAccess,
  controller.downloadPartsByModelInQuote
);

inventories.put(
  "/update-sustitutes-and-costs-parts",
  verifyToken,
  registerApiAccess,
  controller.updateSustituteCostParts
);

inventories.post(
  "/upload-reference-sustitutes-and-cost/:idList",
  verifyToken,
  registerApiAccess,
  controller.uploadReferencesSustitutesCost
);

inventories.put(
  "/deactivate-references",
  verifyToken,
  registerApiAccess,
  controller.deactivateReferences
);

inventories.get(
  "/download-attachment/:path/:name",
  controller.downloadAttachmentByPath
);

export default inventories;
