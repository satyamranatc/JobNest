import { Router } from "express";
import { applyJob } from "../controllers/application.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/",authMiddleware,applyJob)


export default router;
