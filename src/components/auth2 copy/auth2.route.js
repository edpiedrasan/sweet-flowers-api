import { Router } from "express";
import verifyToken from "../../helpers/verifyToken";
import Controller from "./auth.controller";

const controller = new Controller();

const auth = Router();

// Authenticate a User
auth.post("/", controller.authenticate);

// Retrieve a user once authenticated
auth.get("/protected", verifyToken, controller.protected);

// Sign Out Sesion SS
auth.put("/sign-out", verifyToken, controller.signOut);

auth.post("/signature", verifyToken, controller.signature);

auth.post("/test", controller.test);

export default auth;
