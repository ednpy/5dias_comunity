import User from "../models/user.model.js";
import { uploadImageToMinio } from '../lib/uploadMinio.js';


export const getSuggestedConnections = async (req, res) => {
	try {
		const currentUser = await User.findById(req.user._id).select("connections");

		// find users who are not already connected, and also do not recommend our own profile!! right?
		const suggestedUser = await User.find({
			_id: {
				$ne: req.user._id,
				$nin: currentUser.connections,
			},
		})
			.select("name username profilePicture headline rank perfil_personalizado")
			.limit(3);

		res.json(suggestedUser);
	} catch (error) {
		console.error("Error in getSuggestedConnections controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const getPublicProfile = async (req, res) => {
	try {
		const user = await User.findOne({ username: req.params.username }).select("-password");

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json(user);
	} catch (error) {
		console.error("Error in getPublicProfile controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const updateProfile = async (req, res) => {
    try {
        const allowedFields = [
            "name",
            "username",
            "headline",
            "about",
            "location",
            "profilePicture",
            "bannerImg",
            "skills",
            "experience",
            "education",
            "rank",
			"perfil_personalizado",
        ];

        const updatedData = {};
        const perfilPersonalizadoUpdates = {};
		let rankIncrement = 0;

        for (const field of allowedFields) {
            if (req.body[field]) {
                updatedData[field] = req.body[field];
                if (field === "profilePicture" && req.body[field] !== "") {
					if (!req.user.perfil_personalizado.photo_profile) rankIncrement += 1000;
					perfilPersonalizadoUpdates.photo_profile = true;
				}
				if (field === "bannerImg" && req.body[field] !== "") {
					if (!req.user.perfil_personalizado.photo_cover) rankIncrement += 1000;
					perfilPersonalizadoUpdates.photo_cover = true;
				}
				if (field === "headline" && req.body[field] !== "Usuario de la comunidad") {
					if (!req.user.perfil_personalizado.profesion) rankIncrement += 1000;
					perfilPersonalizadoUpdates.profesion = true;
				}
				if (field === "location" && req.body[field] !== "Paraguay") {
					if (!req.user.perfil_personalizado.ubicacion) rankIncrement += 1000;
					perfilPersonalizadoUpdates.ubicacion = true;
				}
				if (field === "about" && req.body[field] !== "") {
					if (!req.user.perfil_personalizado.about) rankIncrement += 1000;
					perfilPersonalizadoUpdates.about = true;
				}
				if (field === "skills" && req.body[field].length > 0) {
					if (!req.user.perfil_personalizado.skills) rankIncrement += 1000;
					perfilPersonalizadoUpdates.skills = true;
				}
				if (field === "experience" && req.body[field].length > 0) {
					if (!req.user.perfil_personalizado.experience) rankIncrement += 1000;
					perfilPersonalizadoUpdates.experience = true;
				}
				if (field === "education" && req.body[field].length > 0) {
					if (!req.user.perfil_personalizado.education) rankIncrement += 1000;
					perfilPersonalizadoUpdates.education = true;
				}
            }
        }

        if (req.body.profilePicture) {
            const result = await uploadImageToMinio(req.body.profilePicture, 'profile');
            updatedData.profilePicture = result;
        }

        if (req.body.bannerImg) {
            const result = await uploadImageToMinio(req.body.bannerImg, 'banner');
            updatedData.bannerImg = result;
        }

		// Actualiza el perfil personalizado
        if (Object.keys(perfilPersonalizadoUpdates).length > 0) {
			updatedData.perfil_personalizado = { ...req.user.perfil_personalizado, ...perfilPersonalizadoUpdates };
		}
		
		// Incrementa el rank 
		if (rankIncrement > 0) {
			updatedData.rank = req.user.rank + rankIncrement;
		}

        const user = await User.findByIdAndUpdate(req.user._id, updatedData, { new: true });

        res.json(user);
    } catch (error) {
        console.error("Error in updateProfile controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};
