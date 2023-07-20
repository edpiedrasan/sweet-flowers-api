import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import registerApiAccess from "../../helpers/registerApiAccess";
import Controller from "./notifications.controller";

const controller = new Controller();

const notifications = Router();

// find all user notifications
notifications.get(
  "/find-notifications",
  verifyToken,
  registerApiAccess,
  controller.findNotificationsUser
);

export default notifications;