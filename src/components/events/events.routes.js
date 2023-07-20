import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import registerApiAccess from "../../helpers/registerApiAccess";
import Controller from "./events.controller";

const controller = new Controller();

const Events = Router();

Events.post(
  "/hide/:event",
  verifyToken,
  registerApiAccess,
  controller.userHideEvent
);
Events.post(
  "/donation/monetary/:event",
  verifyToken,
  controller.MonetaryDonation
);
Events.post("/donation/days/:event", verifyToken, controller.DaysDonation);
export default Events;