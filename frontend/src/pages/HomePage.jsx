import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import Sidebar from "../components/Sidebar";
import PostCreation from "../components/PostCreation";
import Post from "../components/Post";
import { Users } from "lucide-react";
import RecommendedUser from "../components/RecommendedUser";
import NoticeCard from "../components/elements/Noticecard";
import { useInView } from "react-intersection-observer";
import Loader from "../components/loaders/Loader";
import { useMediaQuery } from 'react-responsive';

const HomePage = () => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const { data: recommendedUsers } = useQuery({
        queryKey: ["recommendedUsers"],
        queryFn: async () => {
            const res = await axiosInstance.get("/users/suggestions");
            return res.data;
        },
    });

    const {
        data: posts,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["posts"],
        queryFn: async ({ pageParam = 1 }) => {
            const res = await axiosInstance.get(`/posts?page=${pageParam}&limit=20`);
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

    const isDesktop = useMediaQuery({ minWidth: 1024 });

    return (
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            {isDesktop ? (
                <>
                    <div className='hidden lg:block lg:col-span-1'>
                        <Sidebar user={authUser} />
                        <div className='bg-white rounded-lg shadow p-4 mt-3'>
                            <h1 className='text-center'>Sobre los Rangos</h1>
                            <p className='text-sm text-gray-600 mt-2'>
                                Los rangos son una forma de reconocer a los usuarios más activos y participativos de la comunidad.</p>
                        
                                <div className='grid grid-cols-2 gap-2 mt-2'>
                                    <div className='flex justify-center'><img src='/img_rank/rank_6.png' alt='Black' width="25" height="25" /></div>
                                    <div className='text-left'>Black</div>
                                    <div className='flex justify-center'><img src='/img_rank/rank_5.png' alt='Platino' width="25" height="25" /></div>
                                    <div className='text-left'>Platino</div>
                                    <div className='flex justify-center'><img src='/img_rank/rank_4.png' alt='Oro' width="25" height="25" /></div>
                                    <div className='text-left'>Oro</div>
                                    <div className='flex justify-center'><img src='/img_rank/rank_3.png' alt='Plata' width="25" height="25" /></div>
                                    <div className='text-left'>Plata</div>
                                    <div className='flex justify-center'><img src='/img_rank/rank_2.png' alt='Bronce' width="25" height="25" /></div>
                                    <div className='text-left'>Bronce</div>
                                    <div className='flex justify-center'><img src='/img_rank/rank_1.png' alt='basico' width="25" height="25" /></div>
                                    <div className='text-left'>Básico</div>
                                </div>
                                <p className='text-sm text-gray-600 mt-2'>
                                Completa tu perfil, haz publicaciones e interactúa con otros usuarios para sumar puntos.</p>
                        </div>

                        <div className='bg-white rounded-lg shadow p-4 mt-3'>
                            <h1 className='text-center'>Ten Cuidado con lo que publicas</h1>
                            <p className='text-sm text-gray-600 mt-2'>
                            Los moderadores de la comunidad revisan las publicaciones y comentarios para asegurarse de que cumplan con las normas de la comunidad.   
                            Recuerda que nadie es anónimo en la comunidad y que tus publicaciones pueden ser vistas por cualquier persona.
                            </p>
                        </div>
                    </div>

                    <div className='col-span-1 lg:col-span-2'>
                        <PostCreation user={authUser} />
                        {posts?.pages.map((page) =>
                            page.map((post) => (
                                <Post key={post._id} post={post} />
                            ))
                        )}
                        <div ref={ref}></div>
                        {posts?.pages[0]?.length === 0 && (
                        <div className='bg-white rounded-lg shadow p-8 text-center'>
                            <div className='mb-6'>
                            <Users size={64} className='mx-auto text-blue-500' />
                            </div>
                            <h2 className='text-2xl font-bold mb-4 text-gray-800'>Aún no hay publicaciones</h2>
                            <p className='text-gray-600 mb-6'>¡Conéctate con otras personas para empezar a ver publicaciones en tu feed!</p>
                        </div>
                        )}

                        {isFetchingNextPage && (
                            <div className='flex justify-center'>
                                <Loader />
                            </div>
                        )}
                    </div>

                    <div className='col-span-1 lg:col-span-1'>
                        {recommendedUsers?.length > 0 && (
                            <div className='bg-secondary rounded-lg shadow p-4 mt-6'>
                                <h2 className='font-semibold mb-4'>Personas para conectarte</h2>
                                {recommendedUsers?.map((user) => (
                                    <RecommendedUser key={user._id} user={user} />
                                ))}
                            </div>
                        )}
                        <div className='mt-2 flex justify-center'>
                            <div>
                                <h1 className='mt-6 mb-3'>Las 5 Noticias del Día</h1>
                                <NoticeCard />
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className='col-span-1'>
                        <PostCreation user={authUser} />
                    </div>

                    <div className='col-span-1'>
                        {recommendedUsers?.length > 0 && (
                            <div className='bg-secondary rounded-lg shadow p-4 mt-6'>
                                <h2 className='font-semibold mb-4'>Personas para conectarte</h2>
                                {recommendedUsers?.map((user) => (
                                    <RecommendedUser key={user._id} user={user} />
                                ))}
                            </div>
                        )}
                    </div>

                    <div className='col-span-1'>
                        <div className='mt-2 flex justify-center'>
                            <div>
                                <h1 className='mt-6 mb-3'>Las 5 Noticias del Día</h1>
                                <NoticeCard />
                            </div>
                        </div>
                    </div>

                    <div className='col-span-1'>
                        {posts?.pages.map((page) =>
                            page.map((post) => (
                                <Post key={post._id} post={post} />
                            ))
                        )}
                        <div ref={ref}></div>
                        {posts?.pages[0]?.length === 0 && (
                        <div className='bg-white rounded-lg shadow p-8 text-center'>
                            <div className='mb-6'>
                            <Users size={64} className='mx-auto text-blue-500' />
                            </div>
                            <h2 className='text-2xl font-bold mb-4 text-gray-800'>Aún no hay publicaciones</h2>
                            <p className='text-gray-600 mb-6'>¡Conéctate con otras personas para empezar a ver publicaciones en tu feed!</p>
                        </div>
                        )}
                        {isFetchingNextPage && (
                            <div className='flex justify-center'>
                                <Loader />
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default HomePage;