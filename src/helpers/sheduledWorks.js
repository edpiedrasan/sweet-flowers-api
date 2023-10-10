/* eslint-disable complexity */
/* eslint-disable no-loop-func */
/* eslint-disable multiline-ternary */
/* eslint-disable no-ternary */
/* eslint-disable no-sync */
/* eslint-disable max-depth */
/* eslint-disable no-await-in-loop */
import fs from "fs";
import json2xls from "json2xls";
import moment from "moment";
import "moment/locale/es";
import cron from "node-cron";
import config from "../config/config";
import DB2 from "../db/db2";
import DonationsDB from "../db/events/donationDB";
import EventsDB from "../db/events/eventsDB";
import SignDB from "../db/Mis/SignDB";
import CriticalPartsDB from "../db/Sales/CriticalPartsDB";
import EngineerDB from "../db/Sales/EngineersDB";
import PlannersDB from "../db/Sales/PlannersDB";
import InventoriesDB from "../db/Sales/InventoriesDB";
import SupportDB from "../db/Sales/SupportDB";
import {
  renderContectIMateriaReport,
  renderContentDonationReport,
  renderEmailNotifyUserNotificationMatrix,
  renderEmailNotifyUserEscalationMatrix,
  renderEmailEscaltionEngineer,
} from "./renderContent";
import SendMail from "./sendEmail";
import WebService from "./webService";
import POSTGRESQL from "./../db/SECOH/secohDB";

const getTimeZone = (country) => {
  let timezone = 0;
  switch (country) {
    case "PA":
      timezone = -300;
      break;
    case "CR":
      timezone = -360;
      break;
    case "HQ":
      timezone = -360;
      break;
    case "GT":
      timezone = -360;
      break;
    case "NI":
      timezone = -360;
      break;
    case "SV":
      timezone = -360;
      break;
    case "US":
      timezone = -300;
      break;
    case "HN":
      timezone = -360;
      break;
    case "DO":
      timezone = -240;
      break;
    case "BV01":
      timezone = -240;
      break;
    default:
      timezone = -300;
  }
  return timezone;
};

const convertUnicode = (input) =>
  input.replace(/\\u(\w{4,4})/g, (a, b) =>
    String.fromCharCode(parseInt(b, 16))
  );

const renderHumanCapitalGroupCountry = async () => {
  const data = [
    {
      country: "Regional",
      to: ["msalas@gbm.net", "mtcastro@gbm.net", "gvillalobos@gbm.net"],
      monetaryReport: [],
      vacationsReport: [],
    },
    {
      country: "NA",
      to: ["jcorrales@gbm.net"],
      monetaryReport: [],
      vacationsReport: [],
    },
  ];
  const humanCapitals = await EventsDB.getAllHumanCapitalsCountries();
  humanCapitals.forEach((element) => {
    const { country, email } = element;
    const index = data.findIndex((row) => row.country === element.country);
    if (index === -1) {
      // if (element.country !== 'CR' && element.country !== 'HQ') {
      data.push({
        country,
        to: [email],
        monetaryReport: [],
        vacationsReport: [],
      });
      // }
    } else {
      // if (element.country !== 'CR' && element.country !== 'HQ') {
      data[index].to.push(email);
      // }
    }
  });
  return data;
};

const compareJSON = (obj1, obj2) => {
  const ret = {};
  for (const i in obj2) {
    if (!obj1.hasOwnProperty(i) || obj2[i] !== obj1[i]) {
      ret[i] = obj2[i];
    }
  }
  return ret;
};
