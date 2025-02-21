import Notification from "../models/notification.model.js";

export const getAllNotifications = async (req, res) => {
	try {
		const notifications = await Notification.find({ recipient: req.user._id })
			.sort({ createdAt: -1 })
			.populate("relatedUser", "name username profilePicture")
			.populate("relatedPost", "content image");

		res.status(200).json(notifications);
	} catch (error) {
		console.error("Error in getUserNotifications controller:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};


export const getUserNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 5 } = req.query;
        const notifications = await Notification.find({ recipient: req.user._id })
            .sort({ read: 1, createdAt: -1 }) // Ordenar por 'read' y luego por 'createdAt'
            .populate("relatedUser", "name username profilePicture")
            .populate("relatedPost", "content image")
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const totalNotifications = await Notification.countDocuments({ recipient: req.user._id });

        res.status(200).json({
            notifications,
            totalPages: Math.ceil(totalNotifications / limit),
            currentPage: parseInt(page),
        });
    } catch (error) {
        console.error("Error in getUserNotifications controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const markNotificationAsRead = async (req, res) => {
	const notificationId = req.params.id;
	try {
		const notification = await Notification.findByIdAndUpdate(
			{ _id: notificationId, recipient: req.user._id },
			{ read: true },
			{ new: true }
		);

		res.json(notification);
	} catch (error) {
		console.error("Error in markNotificationAsRead controller:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const deleteNotification = async (req, res) => {
	const notificationId = req.params.id;

	try {
		await Notification.findOneAndDelete({
			_id: notificationId,
			recipient: req.user._id,
		});

		res.json({ message: "Notification deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: "Server error" });
	}
};
