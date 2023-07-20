import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import Controller from "./incidentsReports.controller";

const controller = new Controller();

const IRRouter = Router();

IRRouter.get("/get-platforms", verifyToken, controller.GetPlatforms);

IRRouter.get("/get-services", verifyToken, controller.GetServices);

IRRouter.get("/get-products", verifyToken, controller.GetProducts);

IRRouter.post("/delete-data", verifyToken, controller.deleteTable);

IRRouter.post("/insert-data", verifyToken, controller.insertTable);

IRRouter.post("/get-data", verifyToken, controller.GetData)

export default IRRouter;