import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
	deleteNotification,
	getUserNotifications,
	markNotificationAsRead,
	getAllNotifications,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUserNotifications);
router.get("/all", protectRoute, getAllNotifications);


router.put("/:id/read", protectRoute, markNotificationAsRead);
router.delete("/:id", protectRoute, deleteNotification);

export default router;
