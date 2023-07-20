import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import registerApiAccess from "../../helpers/registerApiAccess";
import Controller from "./wms.controller";

const controller = new Controller();

const WMSRoutes = Router();

//DEV AND TESTING
WMSRoutes.post("/logs", controller.insertWMSLog);
WMSRoutes.get("/logs", verifyToken, registerApiAccess, controller.getWMSLog);
WMSRoutes.get("/logs/count", verifyToken, registerApiAccess, controller.getWMSLogCount);

//SS Dashboard
WMSRoutes.get("/transactions/count", verifyToken, registerApiAccess, controller.getTransactionCount);
WMSRoutes.get("/transactions/login/count", verifyToken, registerApiAccess, controller.getLoginTransactionCount);
WMSRoutes.get("/transactions/movements/totals", verifyToken, registerApiAccess, controller.getMovementTotals);
WMSRoutes.get("/transactions/country/count", verifyToken, registerApiAccess, controller.getMovementByCountry);
WMSRoutes.get("/transactions/traffic", verifyToken, registerApiAccess, controller.getTrafficPerDay);
WMSRoutes.get("/transactions/months", verifyToken, registerApiAccess, controller.getMonthMovements);
WMSRoutes.get(
  "/transactions/most-executed", verifyToken, registerApiAccess,
  controller.getMostExecutedTransaction
);

WMSRoutes.get(
  "/transactions/executed", verifyToken, registerApiAccess,
  controller.getTotalsByExecutedTransaction
);

export default WMSRoutes;