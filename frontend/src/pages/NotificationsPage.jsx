import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { ExternalLink, Eye, MessageSquare, ThumbsUp, Trash2, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { formatDistanceToNow } from "date-fns";
import NotificationCard from "../components/elements/NotificationCard";
import { useState } from "react";

const NotificationsPage = () => {
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);

    const { data: notificationsData, isLoading } = useQuery({
        queryKey: ["notifications", page],
        queryFn: () => axiosInstance.get(`/notifications?page=${page}&limit=15`),
    });

    const { mutate: markAsReadMutation } = useMutation({
        mutationFn: (id) => axiosInstance.put(`/notifications/${id}/read`),
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications"]);
        },
    });

    const { mutate: deleteNotificationMutation } = useMutation({
        mutationFn: (id) => axiosInstance.delete(`/notifications/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries(["notifications"]);
            toast.success("Notification deleted");
        },
    });

    const renderNotificationIcon = (type) => {
        switch (type) {
            case "like":
                return <ThumbsUp className='text-blue-500' />;

            case "comment":
                return <MessageSquare className='text-green-500' />;
            case "connectionAccepted":
                return <UserPlus className='text-purple-500' />;
            default:
                return null;
        }
    };

    const renderNotificationContent = (notification) => {
        switch (notification.type) {
            case "like":
                return (
                    <span>
                        <strong>{notification.relatedUser.name}</strong> liked your post
                    </span>
                );
            case "comment":
                return (
                    <span>
                        <Link to={`/profile/${notification.relatedUser.username}`} className='font-bold'>
                            {notification.relatedUser.name}
                        </Link>{" "}
                        commented on your post
                    </span>
                );
            case "connectionAccepted":
                return (
                    <span>
                        <Link to={`/profile/${notification.relatedUser.username}`} className='font-bold'>
                            {notification.relatedUser.name}
                        </Link>{" "}
                        accepted your connection request
                    </span>
                );
            default:
                return null;
        }
    };

    const renderRelatedPost = (relatedPost) => {
        if (!relatedPost) return null;

        return (
            <Link
                to={`/post/${relatedPost._id}`}
                className='mt-2 p-2 bg-gray-50 rounded-md flex items-center space-x-2 hover:bg-gray-100 transition-colors'
            >
                {relatedPost.image && (
                    <img src={relatedPost.image} alt='Post preview' className='w-10 h-10 object-cover rounded' />
                )}
                <div className='flex-1 overflow-hidden'>
                    <p className='text-sm text-gray-600 break-words'>{relatedPost.content.substring(0, 100)}</p>
                </div>
                <ExternalLink size={14} className='text-gray-400' />
            </Link>
        );
    };

    const handleNextPage = () => {
        if (page < notificationsData.data.totalPages) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    return (
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            <div className='col-span-1 lg:col-span-1'>
                <Sidebar user={authUser} />
            </div>
            <div className='col-span-1 lg:col-span-3'>
                <div className='bg-white rounded-lg shadow p-6'>
                    <h1 className='text-2xl font-bold mb-6'>Notificaciones</h1>

                    {isLoading ? (
                        <p>Cargando notificaciones...</p>
                    ) : notificationsData && notificationsData.data.notifications.length > 0 ? (
                        <>
                            <ul>
                                {notificationsData.data.notifications.map((notification) => (
                                    <NotificationCard
                                        key={notification._id}
                                        notification={notification}
                                        markAsReadMutation={markAsReadMutation}
                                        deleteNotificationMutation={deleteNotificationMutation}
                                        renderNotificationIcon={renderNotificationIcon}
                                        renderNotificationContent={renderNotificationContent}
                                        renderRelatedPost={renderRelatedPost}
                                    />
                                ))}
                            </ul>
                            <div className='flex justify-between mt-4'>
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={page === 1}
                                    className='px-4 py-2 bg-gray-200 rounded disabled:opacity-50'
                                >
                                    Anterior
                                </button>
                                <button
                                    onClick={handleNextPage}
                                    disabled={page === notificationsData.data.totalPages}
                                    className='px-4 py-2 bg-gray-200 rounded disabled:opacity-50'
                                >
                                    Siguiente
                                </button>
                            </div>
                        </>
                    ) : (
                        <p>No notification at the moment.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;