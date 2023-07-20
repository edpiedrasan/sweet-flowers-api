import { Router } from "express";
import verifyToken from '../../helpers/verifyToken';
import registerApiAccess from "../../helpers/registerApiAccess";
import Controller from "./newPosition.controller";

const controller = new Controller();

const newPosition = Router();

// find all positions
newPosition.get("/find-positions", verifyToken, registerApiAccess, controller.findPositions);

// find data by position
newPosition.get("/find-data/:idPosition/:idCountry", verifyToken, registerApiAccess, controller.findData);

// find data by position to update
newPosition.get("/find-data-by-position/:idPosition", verifyToken, registerApiAccess, controller.findDataByPosition);

// find data by position to relations
newPosition.get("/find-relation-data-by-position/:idPosition", verifyToken, registerApiAccess, controller.findRelationsDataByPosition);

// find vacant position pending approved
newPosition.get("/find-unapproved-vacant-position", verifyToken, registerApiAccess, controller.findVacantPositionUnapproved);

// find raking total request by users
newPosition.get("/find-all-request-by-users", verifyToken, registerApiAccess, controller.findAllRequestByUsers);

// find vacant position by id
newPosition.get("/find-vacant-position-by-id/:id", verifyToken, registerApiAccess, controller.findVacantPositionById);

// find users with acces new positions
newPosition.get("/find-users-with-access", verifyToken, registerApiAccess, controller.findUsersWithAccess);

// find total requests created by user
newPosition.post("/find-request-by-user", verifyToken, registerApiAccess, controller.findRequestsByUser);

// find total daba by positions created
newPosition.post("/find-total-positions-created", verifyToken, registerApiAccess, controller.findTotalPositionCreated);

// create an unplanned position
newPosition.post("/create-unplanned-position", verifyToken, registerApiAccess, controller.createUnplannedPosition);

// create position with staff
newPosition.post("/create-staff-position", verifyToken, registerApiAccess, controller.createStaffPosition);

// create position vacant
newPosition.post("/create-vacant-position", verifyToken, registerApiAccess, controller.createVacantPosition);

// approved update vacant position
newPosition.put("/approved-vacant-position/:idVacant", verifyToken, registerApiAccess, controller.approvedVacantPosition);

// unapproved update vacant position
newPosition.put("/unapproved-vacant-position/:idVacant", verifyToken, registerApiAccess, controller.unapprovedVacantPosition);

// create and delete relations by position
newPosition.post("/create-relations-position", verifyToken, registerApiAccess, controller.createRelationsByPosition);

// update vacant position by id
newPosition.put("/update-vacant-position/:id", verifyToken, registerApiAccess, controller.updateVacantPosition);

// create vacant position by id
newPosition.post("/create-user-with-access", verifyToken, registerApiAccess, controller.createUserWithAccess);

// update vacant position by id
newPosition.put("/deactivate-user-with-access/:id", verifyToken, registerApiAccess, controller.deactivatedUserWithAccess);

// update ceco by id
newPosition.post("/update-new-ceco", verifyToken, registerApiAccess, controller.updateNewCecoPosition);

export default newPosition;