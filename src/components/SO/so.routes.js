import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import registerApiAccess from "../../helpers/registerApiAccess";
import Controller from "./so.controller";

const controller = new Controller();

const SORoutes = Router();

SORoutes.get("/", verifyToken, registerApiAccess, controller.getSO);
SORoutes.get("/country/:country", verifyToken, registerApiAccess, controller.getSOByCountry);
SORoutes.get("/user/:user", verifyToken, registerApiAccess, controller.getSOByUser);
SORoutes.get("/:id", verifyToken, registerApiAccess, controller.getSOByID);

export default SORoutes;