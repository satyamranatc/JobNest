import { Router } from "express";
import { register, login, logout, refreshToken } from "../controllers/auth.controller.js";
import { uploadAvatarMiddleware } from "../config/cloudinaryConfig.js";

const router = Router();

router.post("/register", uploadAvatarMiddleware, register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/refresh-token", refreshToken);

export default router;