import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import Controller from "./masterDataController";

const controller = new Controller();

const md = Router();



md.post("/new-masterdata",  controller.newMasterData); 

// md.post("/request-rows",  controller.getRowsRequestsTable); 
// md.post("/lineal-masive-request/",  controller.getLinealAndMasiveRequest);
 md.get("/options", /*verifyToken,*/ controller.getOptions);
// md.get("/download-document/:idGestion/:nameFile", controller.downloadDocumentByName);
// md.post("/request-approvals-rows",  controller.getRowsApprovalsRequestsTable); 
// md.post("/approval-reject-request", /*verifyToken,*/ controller.approvalRejectRequest);
// md.post("/upload-files/:gestion", verifyToken, controller.uploadFile);
// md.post("/delete-file", verifyToken, controller.deleteFile);









export default md;