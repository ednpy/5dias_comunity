import { Link } from "react-router-dom";
import ProfileImage from "./elements/ProfileImage";

function UserCard({ user, isConnection }) {
	return (
		<div className='bg-white rounded-lg shadow p-4 flex flex-col items-center transition-all hover:shadow-md'>
			<Link to={`/profile/${user.username}`} className='flex flex-col items-center'>
				
				<ProfileImage
					profilePicture={user.profilePicture}
					rank={user.rank}
					username={user.username}
					scale={24}
					scale_rank={8}
				/>
				<h3 className='font-semibold text-lg text-center'>{user.name}</h3>
			</Link>
			<p className='text-gray-600 text-center'>{user.headline}</p>
			<p className='text-sm text-gray-500 mt-2'>{user.connections?.length} connections</p>
			<button className='mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors w-full'>
				{isConnection ? "Conectado" : "Conectar"}
			</button>
		</div>
	);
}

export default UserCard;
