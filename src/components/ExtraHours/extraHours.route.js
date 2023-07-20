/* eslint-disable line-comment-position */
/* eslint-disable no-inline-comments */
import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import registerApiAccess from "../../helpers/registerApiAccess";
import Controller from "./extraHours.controller";

const controller = new Controller();

const extraHours = Router();

extraHours.get(
  "/find-hc-with-access",
  verifyToken,
  registerApiAccess,
  controller.findHCWithAccess
);

// find all user with access by payrrol countries
extraHours.get(
  "/find-users-with-access",
  verifyToken,
  registerApiAccess,
  controller.findUsersWithAccess
);

// find all positions
extraHours.post(
  "/find-extras",
  verifyToken,
  registerApiAccess,
  controller.findExtras
);

extraHours.post(
  "/find-extras-send",
  verifyToken,
  registerApiAccess,
  controller.findExtrasSend
);

extraHours.get(
  "/get-roles-extra",
  verifyToken,
  registerApiAccess,
  controller.findRoles
);

extraHours.post(
  "/find-date-extras",
  verifyToken,
  registerApiAccess,
  controller.findDateExtras
);

// widget
extraHours.post(
  "/widget-year-extras",
  verifyToken,
  registerApiAccess,
  controller.allYearHourSumWidget
);

// widget
extraHours.post(
  "/widget-country-extras",
  verifyToken,
  registerApiAccess,
  controller.countryYearHourSumWidget
);

// graph
extraHours.post(
  "/graph-year-extras",
  verifyToken,
  registerApiAccess,
  controller.allYearHourSumGraph
);

// graph
extraHours.post(
  "/graph-country-extras",
  verifyToken,
  registerApiAccess,
  controller.countryYearHourSumGraph
);

// graph
extraHours.post(
  "/get-user-year",
  verifyToken,
  registerApiAccess,
  controller.userByYear
);

// hours users
extraHours.post(
  "/get-hours-user",
  verifyToken,
  registerApiAccess,
  controller.hoursByUser
);

// hours users
extraHours.post(
  "/get-hours-month",
  verifyToken,
  registerApiAccess,
  controller.hoursByMonth
);

// hours users
extraHours.post(
  "/get-hours-month-country",
  verifyToken,
  registerApiAccess,
  controller.hoursByMonthCountry
);

// hours users
extraHours.put(
  "/update-extras-SAP",
  verifyToken,
  registerApiAccess,
  controller.updateSAPExtras
);

// hours users get-years-extra
extraHours.put(
  "/update-extra-info",
  verifyToken,
  registerApiAccess,
  controller.updateExtraInfo
);

extraHours.get(
  "/get-years-extra",
  verifyToken,
  registerApiAccess,
  controller.getYears
);

extraHours.put(
  "/deactivate-user-role/:id",
  verifyToken,
  registerApiAccess,
  controller.deactivateUserRole
);

extraHours.post(
  "/create-user-rol",
  verifyToken,
  registerApiAccess,
  controller.createUserRol
);

extraHours.post(
  "/find-extra-hour-by-ceo",
  verifyToken,
  registerApiAccess,
  controller.findExtraHourByCeo
);

extraHours.post(
  "/create-user-hc-access",
  verifyToken,
  registerApiAccess,
  controller.createUserHCAccess
);

extraHours.put(
  "/deactivate-hc-with-access/:id",
  verifyToken,
  registerApiAccess,
  controller.deactivatedHCWithAccess
);

export default extraHours;
