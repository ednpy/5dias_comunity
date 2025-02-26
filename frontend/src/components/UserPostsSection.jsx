import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Post from "./Post";
import Loader from "./loaders/Loader";
import { useInView } from "react-intersection-observer";

const UserPostsSection = ({ userId }) => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        isError,
    } = useInfiniteQuery({
        queryKey: ["userPosts", userId],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await axiosInstance.get(`/posts/users/${userId}/posts?page=${pageParam}&limit=20`);
            return res.data;
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 20 ? allPages.length + 1 : undefined;
        },
    });

    const { ref, inView } = useInView({
        threshold: 1.0,
        onChange: (inView) => {
            if (inView && hasNextPage) {
                fetchNextPage();
            }
        },
    });

    if (isLoading) return <Loader />;
    if (isError) return <div>Error al cargar las publicaciones</div>;

    if (data?.pages[0]?.length === 0) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: '50px' }}>
            <div>No hay publicaciones disponibles</div>
            <div style={{ marginTop: '50px' }}>
                <Loader />
            </div>
        </div>
    );

    return (
        <div className="space-y-4">
            <h1>Mis Publicaciones</h1>
            {data?.pages.map((page) =>
                page.map((post) => (
                    <Post key={post._id} post={post} />
                ))
            )}
            <div ref={ref}></div>
            {isFetchingNextPage && (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Loader />
                </div>
            )}
        </div>
    );
};

export default UserPostsSection;