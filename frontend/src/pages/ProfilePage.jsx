import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";

import ProfileHeader from "../components/ProfileHeader";
import AboutSection from "../components/AboutSection";
import ExperienceSection from "../components/ExperienceSection";
import EducationSection from "../components/EducationSection";
import SkillsSection from "../components/SkillsSection";
import UserPostsSection from "../components/UserPostsSection";
import toast from "react-hot-toast";

const ProfilePage = () => {
	const { username } = useParams();
	const queryClient = useQueryClient();

	const { data: authUser, isLoading } = useQuery({
		queryKey: ["authUser"],
	});

	const { data: userProfile, isLoading: isUserProfileLoading } = useQuery({
		queryKey: ["userProfile", username],
		queryFn: () => axiosInstance.get(`/users/${username}`),
	});

	const { mutate: updateProfile } = useMutation({
		mutationFn: async (updatedData) => {
			await axiosInstance.put("/users/profile", updatedData);
		},
		onSuccess: () => {
			toast.success("Profile updated successfully");
			queryClient.invalidateQueries(["userProfile", username]);
		},
	});

	if (isLoading || isUserProfileLoading) return null;

	const isOwnProfile = authUser.username === userProfile.data.username;
	const userData = isOwnProfile ? authUser : userProfile.data;

	const handleSave = (updatedData) => {
		updateProfile(updatedData);
	};

	return (
		<div className='max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6'>
			<div className='col-span-1 space-y-6'>
				<AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} userId={userData._id} />
				<ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} userId={userData._id} />
				<EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} userId={userData._id} />
				<SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} userId={userData._id} />
			</div>
			<div className='col-span-1 lg:col-span-2'>
				<ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave} userId={userData._id} />
				<UserPostsSection userId={userData._id} />	
			</div>
		</div>
	);
};
export default ProfilePage;
