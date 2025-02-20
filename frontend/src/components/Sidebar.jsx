import { Link } from "react-router-dom";
import { Home, UserPlus, Bell, Database, Server, Cloud, HardDrive } from "lucide-react";
import ProfileImage from './elements/ProfileImage';


export default function Sidebar({ user }) {
	return (
		<div className='bg-white rounded-lg shadow'>
			<div className='p-4 text-center'>
				<div
					className='h-16 rounded-t-lg bg-cover bg-center'
					style={{
						backgroundImage: `url("${user.bannerImg || "/banner.png"}")`,
					}}
				/>
				 <Link to={`/profile/${user.username}`}>
                    <div className='w-20 h-20 rounded-full mx-auto mt-[-40px]'>
                        <ProfileImage
                            profilePicture={user.profilePicture}
                            rank={user.rank}
                            username={user.username}
							scale={20}
							scale_rank={8}
                        />
                    </div>
                    <h2 className='text-xl font-semibold mt-2'>{user.name}</h2>
                </Link>
				<p className='text-info'>{user.headline}</p>
				<p className='text-info text-xs'>{user.connections.length} conexiones</p>
			</div>
			<div className='border-t border-base-100 p-4'>
				<nav>
					<ul className='space-y-2'>
						<li>
							<Link
								to='/'
								className='flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors'
							>
								<Home className='mr-2' size={20} /> Home
							</Link>
						</li>
						<li>
							<Link
								to='/network'
								className='flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors'
							>
								<UserPlus className='mr-2' size={20} /> My Network
							</Link>
						</li>
						<li>
							<Link
								to='/notifications'
								className='flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors'
							>
								<Bell className='mr-2' size={20} /> Notificaciones
							</Link>
						</li>
						<li>
							<Link
								to='/bigdata'
								className='flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors'
							>
								<Database className='mr-2' size={20} /> Big Data
								
							</Link>
						</li>
					</ul>
				</nav>
			</div>
			<div className='border-t border-base-100 p-4'>
				<Link to={`/profile/${user.username}`} className='text-sm font-semibold'>
					Visita tu perfil
				</Link>
			</div>
		</div>
	);
}
