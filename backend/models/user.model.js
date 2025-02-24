import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		profilePicture: {
			type: String,
			default: "",
		},
		bannerImg: {
			type: String,
			default: "",
		},
		rank: {
			type: Number,
			default: 0,
		},
		headline: {
			type: String,
			default: "Usuario de la comunidad",
		},
		location: {
			type: String,
			default: "Paraguay",
		},
		about: {
			type: String,
			default: "",
		},
		skills: [String],
		experience: [
			{
				title: String,
				company: String,
				startDate: Date,
				endDate: Date,
				description: String,
			},
		],
		education: [
			{
				school: String,
				fieldOfStudy: String,
				startYear: Number,
				endYear: Number,
			},
		],
		connections: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		perfil_personalizado: {
            about: { type: Boolean, default: false },
            experience: { type: Boolean, default: false },
            education: { type: Boolean, default: false },
            skills: { type: Boolean, default: false },
            photo_profile: { type: Boolean, default: false },
            photo_cover: { type: Boolean, default: false },
            ubicacion: { type: Boolean, default: false },
            profesion: { type: Boolean, default: false },
        },
		resetPasswordToken: String,
        resetPasswordExpires: Date,
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
