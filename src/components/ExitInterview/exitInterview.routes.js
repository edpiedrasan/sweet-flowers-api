import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import Controller from "./exitInterview.controller";

const controller = new Controller();
const EIRouter = Router();

EIRouter.get("/get-data", verifyToken,controller.getOptions);
EIRouter.post("/get-interviews",verifyToken, controller.getInterview);
EIRouter.get("/get-draft-interviews-status",verifyToken, controller.getDraftInterviewsStatus);
EIRouter.get("/get-draft-interviews",verifyToken, controller.getDraftInterview);
EIRouter.post("/insert-exitType",verifyToken, controller.insertExitType);
EIRouter.post("/insert-exitReason",verifyToken, controller.insertExitReason);
EIRouter.post("/change-status-exitType",verifyToken, controller.changeStatusExitType);
EIRouter.post("/change-status-exitReason",verifyToken, controller.changeStatusExitReason);
EIRouter.post("/get-data-chart-contry",verifyToken, controller.getDataChartCountry);
EIRouter.post("/get-data-charts-exitType",verifyToken, controller.getDataChartExitType);
EIRouter.post("/get-data-charts-exitReason", controller.getDataChatExitReasons);
EIRouter.post("/insert-interview",verifyToken, controller.insertInterview);
EIRouter.post("/insert-draftInterview",verifyToken, controller.insertDraftInterview);
EIRouter.get("/get-data-chart-words", verifyToken,controller.getDataChartWords);
EIRouter.post("/delete-draftInterview",verifyToken, controller.deleteDraftInterview);
EIRouter.post("/update-draftInterview",verifyToken, controller.updateDraftInterview);
EIRouter.post("/draftInterview-to-interview",verifyToken, controller.draftInterviewToInterview);
EIRouter.post("/get-info-userID", verifyToken,controller.getInfoByUser);
EIRouter.post("/send-email-user", verifyToken,controller.sendEmailToUser);
EIRouter.post("/send-email-hcm", verifyToken,controller.sendEmailToHCM);
EIRouter.post("/update-Interview",verifyToken, controller.updateInterview);




export default EIRouter;
