import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import Controller from "./panamaBids.controller";

const controller = new Controller();
const PBRouter = Router();

PBRouter.get("/get-data", controller.getOptions);
PBRouter.get("/get-entities", controller.getEntities);
PBRouter.post("/insert-entity", verifyToken, controller.insertEntity);
PBRouter.post("/update-entity", verifyToken, controller.updateEntity);
PBRouter.put("/delete-entity/:id", controller.deleteEntity);
PBRouter.post("/get-contacts", controller.getContacts);
PBRouter.get("/get-products", controller.getProducts);
PBRouter.post("/get-purchaseOrderMacro", controller.getPurchaseOrderMacro);
PBRouter.get("/get-colums-purchaseOrderMacro", controller.getColumsPurchaseOrderMacro);
PBRouter.get("/get-data-entities",controller.getDataEntities)
PBRouter.post("/update-purchaseOrderMacro" ,controller.updatePurchaseOrderMacro);
PBRouter.put("/get-purchaseOrderMacro-products/:id" ,controller.getPurchaseOrderProduct);
PBRouter.post("/get-competitions", controller.getPurchaseOrderCompetition);
PBRouter.put("/get-competitions-products/:id", controller.getCompetitionProducts);
PBRouter.get("/get-colums-competition", controller.getColumsCompetition);
PBRouter.get("/get-deliveryMethod" ,controller.getAllDeliveryMethod);
PBRouter.post("/get-fastCotyzationReport" ,controller.getAllFastCotyzationReport);
PBRouter.post("/get-productsFastCotyzation/:id" ,controller.getAllProductsFastCotyzation);
PBRouter.get("/get-colums-fastCotyzationReport", controller.getColumsFastCotyzationReport);
PBRouter.post("/update-fastCotyzationReport" ,controller.updateFastCotyzationReport);
PBRouter.post("/update-fastCotyzationReport-status" ,controller.updateFastCotyzationGBMStatus);
PBRouter.get("/download-file/:documentId/:fileName/:type", controller.downloadAttachmentByPath);
PBRouter.get("/download-all-files/:documentId/:type", controller.downloadAllAttachment);
PBRouter.get("/get-all-files/:Id", controller.getFilesByID);
PBRouter.post("/data-report", verifyToken, controller.getDataReportExcel);
PBRouter.post("/data-competition-report", verifyToken, controller.getDataReportCompetitionExcel);

export default PBRouter;

