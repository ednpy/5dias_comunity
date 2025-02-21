import { Link } from "react-router-dom";
import { ExternalLink, Eye, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useEffect } from "react";

const NotificationCard = ({ notification, markAsReadMutation, deleteNotificationMutation, renderNotificationIcon, renderNotificationContent, renderRelatedPost }) => {
    
    useEffect(() => {
        if (!notification.read) {
            markAsReadMutation(notification._id); // Mark as read when component mounts
        }
    }, [notification, markAsReadMutation]);

    return (
        <li
            key={notification._id}
            className={`bg-white border rounded-lg p-4 my-4 transition-all hover:shadow-md ${
                !notification.read ? "border-blue-500" : "border-gray-200"
            }`}
        >
            <div className='flex items-start justify-between'>
                <div className='flex items-center space-x-4'>
                    <Link to={`/profile/${notification.relatedUser.username}`}>
                        <img
                            src={notification.relatedUser.profilePicture || "/avatar.png"}
                            alt={notification.relatedUser.name}
                            className='w-12 h-12 rounded-full object-cover'
                        />
                    </Link>

                    <div>
                        <div className='flex items-center gap-2'>
                            <div className='p-1 bg-gray-100 rounded-full'>
                                {renderNotificationIcon(notification.type)}
                            </div>
                            <p className='text-sm'>{renderNotificationContent(notification)}</p>
                        </div>
                        <p className='text-xs text-gray-500 mt-1'>
                            {formatDistanceToNow(new Date(notification.createdAt), {
                                addSuffix: true,
                            })}
                        </p>
                        {renderRelatedPost(notification.relatedPost)}
                    </div>
                </div>

                <div className='flex gap-2'>
                    {!notification.read && (
                        <button
                            onClick={() => markAsReadMutation(notification._id)}
                            className='p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors'
                            aria-label='Mark as read'
                        >
                            <Eye size={16} />
                        </button>
                    )}

                    <button
                        onClick={() => deleteNotificationMutation(notification._id)}
                        className='p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors'
                        aria-label='Delete notification'
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
        </li>
    );
};

export default NotificationCard;