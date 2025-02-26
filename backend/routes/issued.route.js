import express from "express";
import { getLatestFile } from "../controllers/issued.controllers.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/latest-file", protectRoute, getLatestFile);

export default router;