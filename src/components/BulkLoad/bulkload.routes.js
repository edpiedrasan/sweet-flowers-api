import { Router } from "express";
import Controller from "./bulkload.controller";

const controller = new Controller();

const bulkLoad = Router();

// find all data with Keys
bulkLoad.get("/find-all-information", controller.findAllInformation);

export default bulkLoad;