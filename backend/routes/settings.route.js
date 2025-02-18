import express from "express";
import { get5NoticiasDelDia } from "../controllers/settings.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/5delDia", protectRoute, get5NoticiasDelDia);

export default router;