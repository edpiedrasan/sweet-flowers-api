import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import registerApiAccess from "../../helpers/registerApiAccess";
import Controller from "./hcmHiring.controller";
// import RFController from "../../helpers/RFC/SAPrfc";

const controller = new Controller();
//const rfc = new RFController();

const hcmh = Router();

// ds.get("/dsrequest", controller.getRows);
hcmh.get("/options", controller.getOptions);
hcmh.get("/request-rows", verifyToken, controller.getRows); 
hcmh.post("/new-request", verifyToken, controller.newRequest);
hcmh.post("/update-request", verifyToken, controller.updateRequest);
hcmh.post("/delete-file", verifyToken, controller.deleteFile);
hcmh.post("/delete-all-files", verifyToken, controller.deleteAllFiles);
hcmh.post("/change-status-bot", verifyToken, controller.changeStatusBot);
hcmh.get("/get-candidate-info/:id",verifyToken, controller.getCandidateInfoById);
hcmh.get("/get-position-info/:position", controller.getPositionInfo);
hcmh.post("/upload-files/:id", verifyToken, controller.uploadFile);
hcmh.get("/download-file/:id/:fileName", controller.downloadAttachmentByPath);
hcmh.get("/download-all-files/:id", controller.downloadAllAttachment);

export default hcmh;