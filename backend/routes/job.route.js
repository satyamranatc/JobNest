import Router from "express"
import { authMiddleware,roleMiddleware } from "../middlewares/auth.middleware.js"
import {getAllJobs,getJobById,createJob} from "../controllers/job.controller.js"


let router = Router();




router.get("/",getAllJobs);
router.get("/:id",getJobById);


router.post("/",authMiddleware, roleMiddleware('Company'),createJob);



export default router;