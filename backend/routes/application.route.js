import { Router } from "express";
import {
    applyJob,
    getApplicationStatus,
    getUserApplications,
    updateApplicationStatus
} from "../controllers/application.controller.js";

import { handleFeadback } from "../controllers/ai.controller.js";

import { authMiddleware, roleMiddleware, optionalAuthMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// Get The Feedback of Interview (Allows testing & candidate submission)
router.post("/feadback", optionalAuthMiddleware, handleFeadback);


router.use(authMiddleware);

// Apply for a job
router.post("/", applyJob);

// Get all applications of logged-in candidate
router.get("/user", getUserApplications);

// Check application status by application ID
router.get("/status/:id", getApplicationStatus);
router.get("/:id", getApplicationStatus);

// Update application status (Company only)
router.patch("/:id/status", roleMiddleware("Company"), updateApplicationStatus);
router.put("/:id/status", roleMiddleware("Company"), updateApplicationStatus);

export default router;

