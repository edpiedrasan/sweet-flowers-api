import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import registerApiAccess from "../../helpers/registerApiAccess";
import Controller from "./documentSystem.controller";
// import RFController from "../../helpers/RFC/SAPrfc";

const controller = new Controller();
//const rfc = new RFController();

const ds = Router();

// ds.get("/dsrequest", controller.getRows);
ds.get("/options", controller.getOptions);
ds.post("/request-rows", verifyToken, controller.getRows);  
ds.post("/logs", verifyToken, controller.getLog);  
ds.post("/new-request", verifyToken, controller.newRequest);
ds.post("/update-request", verifyToken, controller.updateRequest);
ds.post("/upload-files/:documentId", verifyToken, controller.uploadFile);
ds.get("/download-file/:documentId/:fileName", controller.downloadAttachmentByPath);
ds.get("/download-all-files/:documentId", controller.downloadAllAttachment);
ds.get("/get-customers",verifyToken, controller.getCustomers);
ds.get("/get-files-customer/:documentId",verifyToken, controller.getFilesByCustomer);
ds.post("/delete-file", verifyToken, controller.deleteFile);
ds.post("/delete-all-files", verifyToken, controller.deleteAllFiles);

export default ds;