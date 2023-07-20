import { Router } from "express";
//import auth from "./auth/auth.route";
import ExtraHours from "./ExtraHours/extraHours.route.js";
import MIS from "./MIS/mis.route";
import NewPosition from "./NewPosition/newPosition.route";
import PlanningMRS from "./PlanningMRS/planningMRS.route";
import SO from "./SO/so.routes";
import wms from "./WMS/wms.routes";
import BulkLoad from "./BulkLoad/bulkload.routes";
import COE from "./COE/coe.routes";
import DigitalSignature from "./DigitalSignature/digitalSignature.routes";
import Notifications from "./Notifications/notifications.routes";
import CriticalParts from "./CriticalParts/criticalParts.routes";
import DigitalRequests from "./CriticalParts/Request/request.routes";
import PlannersFlow from "./CriticalParts/Planners/planners.routes";
import EngineersFlow from "./CriticalParts/Engineers/engineers.routes";
import Inventories from "./CriticalParts/Inventories/inventories.routes";
import TargetLetter from "./TargetLetter/targetLetter.routes";
import Events from "./events/events.routes";
import Salary from "./Salary/salary.routes";
import Performance from "./Performance/performance.routes";
import Pricing from "./CriticalParts/Pricing/pricing.routes";
import Support from "./CriticalParts/Support/support.routes";
import Managers from "./CriticalParts/Managers/managers.routes";
import MedicalRecords from "./MedicalRecords/MR.routes";
import FinancialFlows from "./FinancialFlows/ff.routes";
import GBMContacts from "./GBMContacts/gbmContacts.routes";
import IncidentsReports from "./IncidentsReports/incidentsReports.routes";
import DocumentSystem from "./DocumentSystem/documentSystem.routes";
import SECOH from "./SECOH/secoh.routes";
import HcmHiring from "./HCMHiring/hcmHiring.routes";
import PanamaBids from "./PanamaBids/panamaBids.routes";
import CostRicaBids from "./CostaRicaBids/costaRicaBids.routes";
import ExitInterview from "./ExitInterview/exitInterview.routes";
import Autopp from "./AutoppLdrs/autoppLdrs.routes";
import MasterData from "./MasterData/masterData.routes";
import Production from "./Production/production.routes";
import Billing from "./Billing/billing.routes";




import auth from "./auth/auth.route";


const router = Router();

//router.use("/auth", auth);
router.use("/planning-mrs", PlanningMRS);
router.use("/new-position", NewPosition);
router.use("/mis", MIS);
router.use("/extra-hours", ExtraHours);

// WMS
router.use("/wms", wms);

// SO
router.use("/so", SO);
router.use("/bulk-load", BulkLoad);
// COE
router.use("/coe", COE);
router.use("/digital-signature", DigitalSignature);
router.use("/notifications", Notifications);
router.use("/critical-parts", CriticalParts);
router.use("/digital-request", DigitalRequests);
router.use("/planners-flow", PlannersFlow);
router.use("/engineers-flow", EngineersFlow);
router.use("/inventories", Inventories);
router.use("/target-letter", TargetLetter);
router.use("/performance", Performance);
router.use("/pricing", Pricing);
router.use("/support", Support);
router.use("/managers", Managers);

//Contacts
router.use("/gbm-contacts", GBMContacts);
//Incidents Reports
router.use("/incidents-reports", IncidentsReports);
// EVENTS
router.use("/events", Events);

// SALARY APPROVAL
router.use("/salary", Salary);

//MEDICAL RECORDS
router.use("/MR", MedicalRecords);
//FINANCIAL FLOWS
router.use("/financial", FinancialFlows);
//SECOH
router.use("/secoh", SECOH);

router.use("/document-system", DocumentSystem);

router.use("/hcm-hiring", HcmHiring);
//Panama Bids
router.use("/panama-bids", PanamaBids);

//CostRica Bids
router.use("/costa-rica-bids", CostRicaBids);

//exitInterview
router.use("/exit-interview", ExitInterview);
//AutoppLdrs
router.use("/autopp-ldrs", Autopp);

//NewMasterData
router.use("/master-data", MasterData);

//Production
router.use("/production", Production);

//Billing
router.use("/billing", Billing);









//Authentication
router.use("/auth", auth);



export default router;
