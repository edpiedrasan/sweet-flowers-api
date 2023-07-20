import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import Controller from "./planningMRS.controller";

const controller = new Controller();

const planningMRS = Router();

// find all nodes
planningMRS.get("/find-nodes", verifyToken, controller.findNodes);

// Find resourses of nodes
planningMRS.post("/find-resourses", verifyToken, controller.findResourses);

export default planningMRS;
