import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { Loader, MessageCircle, Send, Share2, ThumbsUp, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

import PostAction from "./PostAction";
import ShareModal from "./ShareModal";
import ProfileImage from "./elements/ProfileImage";

const formatText = (text) => {
    return text
        .replace(/\*(.*?)\*/g, '<b>$1</b>') // Negrita
        .replace(/_(.*?)_/g, '<i>$1</i>') // Cursiva
        .replace(/~(.*?)~/g, '<s>$1</s>') // Tachado
        .replace(/```(.*?)```/g, '<code>$1</code>'); // Monoespaciado
};

const Post = ({ post }) => {
    const { postId } = useParams();

    const { data: authUser } = useQuery({ queryKey: ["authUser"] });
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [comments, setComments] = useState(post.comments || []);
    const isOwner = authUser._id === post.author._id;
    const isLiked = post.likes.includes(authUser._id);

    const queryClient = useQueryClient();
    const [showFullContent, setShowFullContent] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false); 
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
        mutationFn: async () => {
            await axiosInstance.delete(`/posts/delete/${post._id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Post deleted successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const { mutate: createComment, isPending: isAddingComment } = useMutation({
        mutationFn: async (newComment) => {
            const response = await axiosInstance.post(`/posts/${post._id}/comment`, { content: newComment });
            return response.data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Comment added successfully");
            setComments([
                ...comments,
                {
                    _id: data.comments[data.comments.length - 1]._id, // Ensure the comment has an _id
                    content: newComment,
                    user: {
                        _id: authUser._id,
                        name: authUser.name,
                        profilePicture: authUser.profilePicture,
                    },
                    createdAt: new Date(),
                },
            ]);
        },
        onError: (err) => {
            toast.error(err.response.data.message || "Failed to add comment");
        },
    });

    const { mutate: likePost, isPending: isLikingPost } = useMutation({
        mutationFn: async () => {
            await axiosInstance.post(`/posts/${post._id}/like`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            queryClient.invalidateQueries({ queryKey: ["post", postId] });
        },
    });

    const handleDeletePost = () => {
        setShowConfirmModal(true);
    };

    const confirmDeletePost = () => {
        deletePost();
        setShowConfirmModal(false);
    };

    const handleLikePost = async () => {
        if (isLikingPost) return;
        likePost();
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (newComment.trim()) {
            createComment(newComment);
            setNewComment("");
        }
    };

    const toggleContent = () => {
        setShowFullContent(!showFullContent);
    };

    const handleShare = () => {
        setShowShareModal(true);
    };
    

    //eliminar comentario
    const { mutate: deleteComment, isPending: isDeletingComment } = useMutation({
        mutationFn: async (commentId) => {
            await axiosInstance.delete(`/posts/${post._id}/comment/${commentId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Comment deleted successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });

    const handleDeleteComment = (commentId) => {
        deleteComment(commentId, {
            onSuccess: () => {
                setComments((prevComments) => prevComments.filter(comment => comment._id !== commentId));
            }
        });
    };
    
    return (
        <div className='bg-white rounded-lg shadow mb-4'>
            <div className='p-4'>
                <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center'>
                        <Link to={`/profile/${post?.author?.username}`}>
                        <ProfileImage
                            userPerfilPersonalizado={post.author.perfil_personalizado}
                            profilePicture={post.author.profilePicture}
                            rank={post.author.rank}
                            username={post.author.username}
                            scale={10}
                            scale_rank={4}
                        />
                        </Link>

                        <div>
                            <Link to={`/profile/${post?.author?.username}`}>
                                <h3 className='font-semibold'>{post.author.name}</h3>
                            </Link>
                            <p className='text-xs text-info'>{post.author.headline}</p>
                            <p className='text-xs text-info'>
                                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                            </p>
                        </div>
                    </div>
                    {isOwner && (
                        <button onClick={handleDeletePost} className='text-red-500 hover:text-red-700'>
                            {isDeletingPost ? <Loader size={18} className='animate-spin' /> : <Trash2 size={18} />}
                        </button>
                    )}
                </div>
                <p className='mb-4' style={{ whiteSpace: 'pre-wrap' }}>
                    <span dangerouslySetInnerHTML={{ __html: formatText(showFullContent ? post.content : `${post.content.substring(0, 280)}${post.content.length > 280 ? '...' : ''}`) }}></span>
                    {post.content.length > 280 && (
                        <button onClick={toggleContent} className='text-blue-500 hover:underline ml-2'>
                            {showFullContent ? "Ver menos" : "Ver más"}
                        </button>
                    )}
                </p>
                {post.image && <img src={post.image} alt='Post content' className='rounded-lg w-full mb-4' />}

                <div className='flex justify-between text-info'>
                    <PostAction
                        icon={<ThumbsUp size={18} className={isLiked ? "text-blue-500  fill-blue-300" : ""} />}
                        text={`Like (${post.likes.length})`}
                        onClick={handleLikePost}
                    />

                    <PostAction
                        icon={<MessageCircle size={18} />}
                        text={`Comment (${comments.length})`}
                        onClick={() => setShowComments(!showComments)}
                    />
                    <PostAction icon={<Share2 size={18} />} text='Share' onClick={handleShare}/>
                </div>
            </div>

            {showComments && (
                <div className='px-4 pb-4'>
                    <div className='mb-4 max-h-60 overflow-y-auto'>
                    {comments.map((comment) => (
                            <div key={comment._id} className='mb-2 bg-gray-100 p-2 rounded flex items-start'>
                                <img
                                    src={comment.user.profilePicture || "/avatar.png"}
                                    alt={comment.user.name}
                                    className='w-8 h-8 rounded-full mr-2 flex-shrink-0'
                                />
                                <div className='flex-grow'>
                                    <div className='flex items-center mb-1'>
                                        <span className='font-semibold mr-2'>{comment.user.name}</span>
                                        <span className='text-xs text-info'>
                                            {formatDistanceToNow(new Date(comment.createdAt))}
                                        </span>
                                        {comment.user._id === authUser._id && (
                                            <button
                                                onClick={() => handleDeleteComment(comment._id)}
                                                className='text-red-500 hover:text-red-700 ml-2'
                                            >
                                                {isDeletingComment ? <Loader size={18} className='animate-spin' /> : <Trash2 size={18} />}
                                            </button>
                                        )}
                                    </div>
                                    <p>{comment.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleAddComment} className='flex items-center'>
                        <input
                            type='text'
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder='Add a comment...'
                            className='flex-grow p-2 rounded-l-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary'
                        />

                        <button
                            type='submit'
                            className='bg-primary text-white p-2 rounded-r-full hover:bg-primary-dark transition duration-300'
                            disabled={isAddingComment}
                        >
                            {isAddingComment ? <Loader size={18} className='animate-spin' /> : <Send size={18} />}
                        </button>
                    </form>
                </div>
            )}
             {showShareModal && (
                <ShareModal
                    url={`${window.location.origin}/post/${post._id}`}
                    onClose={() => setShowShareModal(false)}
                />
            )}
            {showConfirmModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="group select-none w-[250px] flex flex-col p-4 relative items-center justify-center bg-gray-800 border border-gray-800 shadow-lg rounded-2xl">
                        <div className="">
                            <div className="text-center p-3 flex-auto justify-center">
                                <svg
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    className="group-hover:animate-bounce w-12 h-12 flex items-center text-gray-600 fill-red-500 mx-auto"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        clipRule="evenodd"
                                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                        fillRule="evenodd"
                                    ></path>
                                </svg>
                                <h2 className="text-xl font-bold py-4 text-gray-200">¿Estás seguro?</h2>
                                <p className="font-bold text-sm text-gray-500 px-2">
                                    ¿Realmente quieres continuar? Este proceso no se puede deshacer.
                                </p>
                            </div>
                            <div className="p-2 mt-2 text-center space-x-1 md:block">
                                <button
                                    className="mb-2 md:mb-0 bg-gray-700 px-5 py-2 text-sm shadow-sm font-medium tracking-wider border-2 border-gray-600 hover:border-gray-700 text-gray-300 rounded-full hover:shadow-lg hover:bg-gray-800 transition ease-in duration-300"
                                    onClick={() => setShowConfirmModal(false)}
                                >
                                    Atrás
                                </button>
                                <button
                                    className="bg-red-500 hover:bg-transparent px-5 ml-4 py-2 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-red-500 hover:border-red-500 text-white hover:text-red-500 rounded-full transition ease-in duration-300"
                                    onClick={confirmDeletePost}
                                >
                                    Aceptar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Post;