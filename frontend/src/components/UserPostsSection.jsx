import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Post from "./Post";
import Loader from "./loaders/Loader";
import Typewriter from "./loaders/typewriter";

const UserPostsSection = ({ userId }) => {
    const { data: posts, isLoading, error } = useQuery({
        queryKey: ["userPosts", userId],
        queryFn: async () => {
            const res = await axiosInstance.get(`/posts/users/${userId}/posts`);
            return res.data;
        },
    });

    if (isLoading) return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Loader />
        </div>
    );

    if (error) return <div>Error al cargar las publicaciones</div>;

    if (!posts || posts.length === 0) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: '50px' }}>
            <div>No hay publicaciones disponibles</div>
            <div style={{ marginTop: '50px' }}>
            <Typewriter />
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <h1>Mis Publicaciones</h1>
            {posts.map((post) => (
                <Post key={post._id} post={post} />
            ))}
        </div>
    );
};

export default UserPostsSection;