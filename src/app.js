/* eslint-disable no-process-env */
/* eslint-disable no-undef */
/* eslint-disable func-style */
/* eslint-disable require-jsdoc */
/* eslint-disable no-use-before-define */
import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import fileUpload from "express-fileupload";
import helmet from "helmet";
import morgan from "morgan";
import components from "./components/index.js";
import * as errorHandler from "./helpers/errorHandler";
import * as works from "./helpers/sheduledWorks";
import path from "path";

const app = express();
setMiddlewares();
setRoutes();
catchErrors();
sheduledWorks();


function setMiddlewares() {
  app.use(cors());
  app.use(morgan("dev"));
  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: 1024 * 1024 * 20,
      parameterLimit: 1024 * 1024 * 20,
      type: "application/x-www-form-urlencoding",
    })
  );
  app.use(
    bodyParser.json({
      limit: 1024 * 1024 * 20,
      type: "application/json",
    })
  );
  app.use(
    fileUpload({
      limits: { fileSize: 1024 * 1024 * 50 },
    })
  );
  app.use(helmet());
}

function setRoutes() {
  app.use(
    "/secoh/update-request-target-start-date-contract-on-hold-by-id",
    express.static("public")
  );
  app.use("/", components, express.static("public"));
}

function catchErrors() {
  app.use(errorHandler.handleNotFound);
  app.use(errorHandler.handleError);
}

function sheduledWorks() {
}

process.env.UPLOAD_PATH = path.join(__dirname, "..", "uploads");

export default app;
