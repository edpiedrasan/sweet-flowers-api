import { Router } from "express";
import verifyToken from '../../../helpers/verifyToken';
import registerApiAccess from "../../../helpers/registerApiAccess";
import Controller from "./pricing.controller";

const controller = new Controller();

const pricing = Router();

pricing.get("/find-variables-master-data", verifyToken, registerApiAccess, controller.findVariablesMasterData);

pricing.get("/find-logs-master-data-by-id/:id", verifyToken, registerApiAccess, controller.findLogsMasterDataById);

pricing.get("/find-offers-request-by-id/:id", verifyToken, registerApiAccess, controller.findOffersRequestById);

pricing.get("/find-request-offers-in-ajustment", verifyToken, registerApiAccess, controller.findRequestOffersInAjustment);

pricing.get("/find-ajust-offer-with-log-by-id/:id", verifyToken, registerApiAccess, controller.findAjustOfferWithLogById);

pricing.post("/update-offer-calc-request-by-pricer/:id/:idList", verifyToken, registerApiAccess, controller.updateOfferCalcRequestByPricer);

pricing.post("/update-manual-offer-calc-request-by-pricer/:id/:idList", verifyToken, registerApiAccess, controller.updateManualOfferCalcRequestByPricer);

pricing.put("/update-variable-master-data-by-id/:id", verifyToken, registerApiAccess, controller.updateVariableMasterDataById);

pricing.put("/update-state-pricer-list-by-id/:id/:state", verifyToken, registerApiAccess, controller.updateStatePricerListById);

pricing.post("/download-calc-offer-by-type", verifyToken, registerApiAccess, controller.downloadCalsOfferByType);

export default pricing;