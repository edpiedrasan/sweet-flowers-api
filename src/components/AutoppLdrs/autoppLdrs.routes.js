import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import Controller from "./autoppController";

const controller = new Controller();

const aupp = Router();

aupp.post("/request-rows", verifyToken, controller.getRowsRequestsTable); 
aupp.post("/requestBAW-rows", verifyToken, controller.getRowsBAW); 
aupp.get("/download-ldr/:oppNumber/:idNumber", controller.downloadLDRByOpp);
aupp.get("/options", verifyToken, controller.getOptions);
aupp.get("/ldrs-data", verifyToken, controller.getLDRDropdowns);
aupp.post("/get-contacts", verifyToken, controller.getContacts);
aupp.get("/get-costumers", verifyToken, controller.getCostumers);
aupp.get("/get-employees", verifyToken, controller.getEmployees);
aupp.post("/new-request", verifyToken, controller.newRequest);
aupp.post("/new-BawDevolutionReq", verifyToken, controller.newBawDevolutionReq);
aupp.post("/upload-files/:temporalFolderFilesId", verifyToken, controller.uploadFile);
aupp.post("/delete-file", verifyToken, controller.deleteFile);
aupp.get("/download-bom/:idNumber/:company", controller.downloadDocumentFiles);
aupp.post("/delete-folder-bom", verifyToken, controller.deleteFolderBOM);






export default aupp;