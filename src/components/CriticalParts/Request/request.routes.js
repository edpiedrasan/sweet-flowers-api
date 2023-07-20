import { request, Router } from "express";
import verifyToken from '../../../helpers/verifyToken';
import registerApiAccess from "../../../helpers/registerApiAccess";
import Controller from "./request.controller";

const controller = new Controller();

const requests = Router();

requests.get("/find-form-values-request-opportunity/:idOpportunity", verifyToken, registerApiAccess, controller.findFormValuesRequestOpportunity);

requests.get("/find-form-values-equipments-request", verifyToken, registerApiAccess, controller.findFormValuesEquipmentsRequest);

requests.get("/find-requeriments-by-user", verifyToken, registerApiAccess, controller.findRequestsByUser);

requests.get("/find-activity-flow-request/:id", verifyToken, registerApiAccess, controller.findActivityFlowRequest);

requests.get("/find-equipments-by-request/:id", verifyToken, registerApiAccess, controller.findEquipmentsByRequest);

requests.get("/find-equipments-ibm-created-by-request/:id", verifyToken, registerApiAccess, controller.findEquipmentsCreatedByRequest);

requests.get("/find-equipments-spare-by-request/:id", verifyToken, registerApiAccess, controller.findEquipmentsSpareByRequest);

requests.get("/find-references-by-request/:id", verifyToken, registerApiAccess, controller.findReferencesByRequest);

requests.get("/find-references-spare-by-request/:id", verifyToken, registerApiAccess, controller.findReferencesSpareByRequest);

requests.get("/find-justifications-by-request/:id", verifyToken, registerApiAccess, controller.findJustificationsByRequest);

requests.get("/find-configurations-by-request/:id", verifyToken, registerApiAccess, controller.findConfigurationsByRequest);

requests.get("/find-resume-offers-request-by-id/:id", verifyToken, registerApiAccess, controller.findResumeOffersRequestById);

requests.get("/find-last-version-by-request/:opp", verifyToken, registerApiAccess, controller.findLastVersionByRequest);

requests.get("/find-options-request-to-version", verifyToken, registerApiAccess, controller.findOptionsRequestToVersion);

requests.post("/create-requirement", verifyToken, registerApiAccess, controller.createRequirements);

requests.post("/create-one-equipment/:id", verifyToken, registerApiAccess, controller.createOneEquipment);

requests.post("/create-many-equipments/:id", verifyToken, registerApiAccess, controller.createManyEquipment);

requests.post("/create-equipment-spare/:id", verifyToken, registerApiAccess, controller.createEquipmentSpare);

requests.post("/create-justify-by-request/:id", verifyToken, registerApiAccess, controller.createJustifyByRequest);

requests.post("/create-commentary-by-request/:id", verifyToken, registerApiAccess, controller.createCommentaryByRequest);

requests.post("/create-service-order-by-request/:id", verifyToken, registerApiAccess, controller.createServiceOrderRequest);

requests.post("/create-ajust-offer-by-request/:id", verifyToken, registerApiAccess, controller.createAjustOfferRequest);

requests.post("/create-new-version-by-request/:id", verifyToken, registerApiAccess, controller.createNewVersionByRequest);

requests.post("/update-equipment-by-id/:id", verifyToken, registerApiAccess, controller.updateEquipmentById);

requests.post("/update-activity-flow/:id", verifyToken, registerApiAccess, controller.updateActivityFlow);

requests.put("/update-state-request/:id/:state", verifyToken, registerApiAccess, controller.updateStateRequest);

requests.post("/update-equipment-spare-by-id/:id", verifyToken, registerApiAccess, controller.updateEquipmentSpareById);

requests.put("/deactivate-equipment-by-id/:id", verifyToken, registerApiAccess, controller.deactivateEquipmentById);

requests.put("/deactivate-references", verifyToken, registerApiAccess, controller.deactivateReferences);

requests.put("/deactivate-configurations", verifyToken, registerApiAccess, controller.deactivateConfigurations);

requests.put("/deactivate-references-spare", verifyToken, registerApiAccess, controller.deactivateReferencesSpare);

requests.put("/deactivate-equipment-spare-by-id/:id", verifyToken, registerApiAccess, controller.deactivateEquipmentSpareById);

requests.put("/deactivate-references-ajust-offer", verifyToken, registerApiAccess, controller.deactivateReferencesAjustOffers);

requests.post("/upload-references-files/:idRequest", verifyToken, registerApiAccess, controller.uploadReferencesFiles);

requests.post("/upload-configuration-files/:idRequest", verifyToken, registerApiAccess, controller.uploadConfigurationFiles);

requests.post("/upload-reference-spare/:idRequest", verifyToken, registerApiAccess, controller.uploadReferenceSpare);

requests.post("/upload-reference-ajust-offer/:idRequest", verifyToken, registerApiAccess, controller.uploadReferenceAjustOffer);

requests.get("/get-equipments-template/:id", controller.downloadEquipmentsTemplates);

requests.get("/download-attachment/:path/:name", controller.downloadAttachmentByPath);

requests.post("/send-email-offer-won-request/:id", verifyToken, registerApiAccess, controller.sendEmailOfferWonRequest);

requests.post("/update-amount-equipments-by-request/:id", verifyToken, registerApiAccess, controller.updateAmountEquipmentsByRequest);

requests.post("/create-new-version-by-reject-request/:id", verifyToken, registerApiAccess, controller.createNewVersionByRejectRequest);

export default requests;