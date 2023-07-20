import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import Controller from "./gbmContacts.controller";
import registerApiAccess from "../../helpers/registerApiAccess";

const controller = new Controller();

const GcRouter = Router();

GcRouter.post("/get-customers", verifyToken, controller.getCustomers);

GcRouter.post("/get-contacts", verifyToken, controller.getContacts);

GcRouter.get("/get-function", verifyToken, controller.getFunctions);

GcRouter.get("/get-departament", verifyToken, controller.getDepartament);

GcRouter.get("/get-country", verifyToken, controller.getCountry);

GcRouter.get("/get-history", verifyToken, controller.getHistory);

GcRouter.post("/get-file-update", verifyToken, controller.getFileUpdate);

GcRouter.post("/create-new-contact", verifyToken, controller.createContact);

GcRouter.post("/update-contact", verifyToken, controller.updateContact);

GcRouter.post("/confirm-contact", verifyToken, controller.confirmContact);

GcRouter.delete("/delete-confirm-contact/:id", verifyToken, controller.removeConfirmContact);

GcRouter.post("/lock-contact", verifyToken, controller.lockContact);

GcRouter.post("/report-history", verifyToken, controller.reportHistory);

GcRouter.post("/contacts-updated-request/:idCustomer", verifyToken, registerApiAccess, controller.contactsUpdatedRequest);

GcRouter.post("/download-excel", verifyToken, registerApiAccess, controller.downloadExcel);

GcRouter.post("/user-percentage", verifyToken, controller.getUserPercent);

GcRouter.post("/get-user-stats", verifyToken, controller.getStatsEmployee);

GcRouter.post("/get-manager-stats", verifyToken, controller.getStatsManagerial)

GcRouter.post("/get-customer-stats", verifyToken, controller.getContactInfo);

export default GcRouter;