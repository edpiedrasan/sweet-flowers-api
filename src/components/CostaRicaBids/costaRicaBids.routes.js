import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import Controller from "./costaRicaBids.controller";

const controller = new Controller();
const CRBRouter = Router();

CRBRouter.get("/get-data", controller.getOptions);
CRBRouter.post("/get-purchase-order", verifyToken,controller.getPurchaseOrder);
CRBRouter.post("/update-purchase-order",verifyToken, controller.updatePurchaseOrder);
CRBRouter.post("/get-contacts",verifyToken, controller.getContacts);
CRBRouter.post("/delete-file",verifyToken, controller.deleteFile);
CRBRouter.post("/upload-files/:bidNumber",verifyToken, controller.uploadFile);
CRBRouter.post("/delete-all-files",verifyToken, controller.deleteAllFiles);
CRBRouter.post("/get-products",verifyToken, controller.getProductsPurchaseOrder);
CRBRouter.get("/download-file/:documentId/:fileName", controller.downloadAttachmentByPath);
CRBRouter.get("/get-files-purchase-order/:documentId",verifyToken, controller.getFilesByPurchaseOrder);
CRBRouter.post("/get-excel-report",verifyToken, controller.getExcelReport);
CRBRouter.post("/insert-salesTeam",verifyToken, controller.insertSalesTeam);
CRBRouter.post("/delete-salesTeam",verifyToken, controller.deleteSalesTeam);



export default CRBRouter;
