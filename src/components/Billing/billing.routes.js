import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import Controller from "./billingController";

const controller = new Controller();

const bl = Router();



bl.post("/new-purchase-order",  controller.newPurchaseOrder); 
bl.post("/new-billing",  controller.newBilling); 
bl.post("/new-delete-order",  controller.newDeleteOrder); 
bl.post("/to-delete-order",  controller.toDeleteOrder); 
bl.post("/get-billings",  controller.getBillings); 
bl.post("/get-payment-history",  controller.getPaymentHistory); 
bl.post("/pay-billing",  controller.payBilling); 
bl.get("/print-billing/:idBilling/:typeBilling",  controller.printBilling); 
bl.post("/get-billing-details",  controller.getBillingDetails); 





// md.post("/request-rows",  controller.getRowsRequestsTable); 
// md.post("/lineal-masive-request/",  controller.getLinealAndMasiveRequest);
// md.get("/download-document/:idGestion/:nameFile", controller.downloadDocumentByName);
// md.post("/request-approvals-rows",  controller.getRowsApprovalsRequestsTable); 
// md.post("/approval-reject-request", /*verifyToken,*/ controller.approvalRejectRequest);
// md.post("/upload-files/:gestion", verifyToken, controller.uploadFile);
// md.post("/delete-file", verifyToken, controller.deleteFile);









export default bl;