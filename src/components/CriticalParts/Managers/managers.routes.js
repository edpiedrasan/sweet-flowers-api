import { Router } from "express";
import verifyToken from '../../../helpers/verifyToken';
import registerApiAccess from "../../../helpers/registerApiAccess";
import Controller from "./managers.controller";

const controller = new Controller();

const managers = Router();

managers.get("/find-all-information-digital-request", verifyToken, registerApiAccess, controller.findAllInformationDigitalRequest);

managers.get("/find-all-data-by-digital-request/:id", verifyToken, registerApiAccess, controller.findAllDataByDigitalRequest);

// nuevos endpoints
managers.get("/find-years-and-countries-digital-request", verifyToken, registerApiAccess, controller.findYearsAndCountriesDigitalRequest);

// nuevos endpoints
managers.get("/find-all-data-dashboard-digital-request/:year/:country", verifyToken, registerApiAccess, controller.findAllDataDashboardDigitalRequest);

export default managers;