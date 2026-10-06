import { Router } from "express";

import { register, login, logout, refreshToken } from "../controllers/auth.controller.js";

const router = Router();




router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/refresh-token", refreshToken);

export default router;