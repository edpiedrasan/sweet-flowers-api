import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import registerApiAccess from "../../helpers/registerApiAccess";
import Controller from "./MR.controller";

const controller = new Controller();

const MRoutes = Router();

//OTHERS
MRoutes.get("/offices", verifyToken, registerApiAccess, controller.GetOffices);
MRoutes.get(
  "/country/:country",
  verifyToken,
  registerApiAccess,
  controller.GetCountryRecords
);

// REGISTRO
MRoutes.get("/:id", verifyToken, registerApiAccess, controller.GetMR);
MRoutes.post("/", verifyToken, registerApiAccess, controller.CreateMR);
MRoutes.put("/:id", verifyToken, registerApiAccess, controller.UpdateMR);
MRoutes.post("/hide/:id", verifyToken, registerApiAccess, controller.HideMR);

//ATTACHMENTS
MRoutes.post(
  "/attachment/:id",
  verifyToken,
  registerApiAccess,
  controller.uploadAttachments
);
MRoutes.get(
  "/attachment/:id",
  verifyToken,
  registerApiAccess,
  controller.getAttachment
);

// CONTACTS
MRoutes.get(
  "/contacts/:RecordID",
  verifyToken,
  registerApiAccess,
  controller.GetContacts
);
MRoutes.get(
  "/contact/:id",
  verifyToken,
  registerApiAccess,
  controller.GetContact
);
MRoutes.post(
  "/contact",
  verifyToken,
  registerApiAccess,
  controller.CreateContact
);
MRoutes.put(
  "/contact/:id",
  verifyToken,
  registerApiAccess,
  controller.UpdateContact
);
MRoutes.delete(
  "/contact/:id",
  verifyToken,
  registerApiAccess,
  controller.DeleteContact
);

// // MEDICAMENTOS
// MRoutes.get("/medication/:id", controller.GetMedication);
// MRoutes.post("/medications", controller.CreateMedication);
MRoutes.put(
  "/medication/:id",
  verifyToken,
  registerApiAccess,
  controller.UpdateMedication
);
MRoutes.delete(
  "/medication/:type/:id",
  verifyToken,
  registerApiAccess,
  controller.DeleteMedication
);

// ALLERGIES
MRoutes.get(
  "/allergies/:RecordID",
  verifyToken,
  registerApiAccess,
  controller.GetAllergies
);
MRoutes.get(
  "/allergy/:id",
  verifyToken,
  registerApiAccess,
  controller.GetAllergy
);
MRoutes.post(
  "/allergy",
  verifyToken,
  registerApiAccess,
  controller.CreateAllergy
);
MRoutes.put(
  "/allergy/:id",
  verifyToken,
  registerApiAccess,
  controller.UpdateAllergy
);
MRoutes.delete(
  "/allergy/:id",
  verifyToken,
  registerApiAccess,
  controller.DeleteAllergy
);

// DISEASES
MRoutes.get(
  "/diseases/:RecordID",
  verifyToken,
  registerApiAccess,
  controller.GetDiseases
);
MRoutes.get(
  "/disease/:id",
  verifyToken,
  registerApiAccess,
  controller.GetDisease
);
MRoutes.post(
  "/disease",
  verifyToken,
  registerApiAccess,
  controller.CreateDisease
);
MRoutes.put(
  "/disease/:id",
  verifyToken,
  registerApiAccess,
  controller.UpdateDisease
);
MRoutes.delete(
  "/disease/:id",
  verifyToken,
  registerApiAccess,
  controller.DeleteDisease
);

// INTERVENTIONS
MRoutes.get(
  "/interventions/:RecordID",
  verifyToken,
  registerApiAccess,
  controller.GetInterventions
);
MRoutes.get(
  "/intervention/:id",
  verifyToken,
  registerApiAccess,
  controller.GetIntervention
);
MRoutes.post(
  "/intervention",
  verifyToken,
  registerApiAccess,
  controller.CreateIntervention
);
MRoutes.put(
  "/intervention/:id",
  verifyToken,
  registerApiAccess,
  controller.UpdateIntervention
);
MRoutes.delete(
  "/intervention/:id",
  verifyToken,
  registerApiAccess,
  controller.DeleteIntervention
);

// OTHERS
MRoutes.get(
  "/others/types",
  verifyToken,
  registerApiAccess,
  controller.GetOthersTypes
);
MRoutes.get(
  "/others/:RecordID",
  verifyToken,
  registerApiAccess,
  controller.GetOthers
);
MRoutes.get("/other/:id", verifyToken, registerApiAccess, controller.GetOther);
MRoutes.post("/other", verifyToken, registerApiAccess, controller.CreateOther);
MRoutes.put(
  "/other/:id",
  verifyToken,
  registerApiAccess,
  controller.UpdateOther
);
MRoutes.delete(
  "/other/:id",
  verifyToken,
  registerApiAccess,
  controller.DeleteOther
);

// ADMIN
MRoutes.get("/admin-dashboard/:year", verifyToken, registerApiAccess, controller.findAllDataAdminDashboard);
MRoutes.post("/download-vaccine-data-location/:year", verifyToken, registerApiAccess, controller.downloadVaccineDataLocation);
MRoutes.get("/maintenance/find-user-with-access", verifyToken, registerApiAccess, controller.findUserWithAccessRecords);
MRoutes.post("/maintenance/create-user-access", verifyToken, registerApiAccess, controller.createUserAccess);
MRoutes.put("/maintenance/delete-user-access/:id", verifyToken, registerApiAccess, controller.deleteUserAccess);
MRoutes.post("/download-medical-records-admin", verifyToken, registerApiAccess, controller.downloadMedicalRecordsAdmin);
MRoutes.post("/download-attachments-records-admin", verifyToken, registerApiAccess, controller.downloadAttachmentsRecordsAdmin);

export default MRoutes;