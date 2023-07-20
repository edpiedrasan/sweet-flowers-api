import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import registerApiAccess from "../../helpers/registerApiAccess";
import Controller from "./performance.controller";

const controller = new Controller();

const performance = Router();

performance.get("/find-all-data-dashboard", verifyToken, registerApiAccess, controller.findAllDataDashoard);

performance.get("/find-all-signin-dashboard/:year/:month", verifyToken, registerApiAccess, controller.findAllSignInDashoard);

performance.get("/find-all-transactions-dashboard/:year/:month", verifyToken, registerApiAccess, controller.findAllTransactionsDashoard);

export default performance;