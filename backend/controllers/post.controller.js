import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { sendCommentNotificationEmail } from "../emails/emailHandlers.js";
import { uploadImageToMinio } from '../lib/uploadMinio.js';
import minioClient from '../lib/minio.js';


/*export const getFeedPosts = async (req, res) => {
	try {
		const posts = await Post.find({ author: { $in: [...req.user.connections, req.user._id] } })
			.populate("author", "name username profilePicture headline rank perfil_personalizado")
			.populate("comments.user", "name profilePicture")
			.sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		console.error("Error in getFeedPosts controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};*/

export const getFeedPosts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const posts = await Post.find({ author: { $in: [...req.user.connections, req.user._id] } })
            .populate("author", "name username profilePicture headline rank perfil_personalizado")
            .populate("comments.user", "name profilePicture")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error in getFeedPosts controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};


export const getUserPosts = async (req, res) => {
    try {
        const userId = req.params.userId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const posts = await Post.find({ author: userId })
            .populate("author", "name username profilePicture headline rank perfil_personalizado")
            .populate("comments.user", "name profilePicture")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error in getUserPosts controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

/*export const getUserPosts = async (req, res) => {
	try {
		const userId = req.params.userId;
		const posts = await Post.find({ author: userId })
			.populate("author", "name username profilePicture headline rank perfil_personalizado")
			.populate("comments.user", "name profilePicture")
			.sort({ createdAt: -1 });

		res.status(200).json(posts);
	} catch (error) {
		console.error("Error in getUserPosts controller:", error);
		res.status(500).json({ message: "Server error" });
	}
}*/


export const createPost = async (req, res) => {
    try {
        const { content, image } = req.body;
        let newPost;

        if (image) {
           
			const imageUrl = await uploadImageToMinio(image,'post');

            //console.log("Image URL:", imageUrl);

            newPost = new Post({
                author: req.user._id,
                content,
                image: imageUrl,
            });
        } else {
            newPost = new Post({
                author: req.user._id,
                content,
            });
        }

        await newPost.save();

        // Incrementa el rank del usuario
        const user = await User.findById(req.user._id);
        user.rank += 1000;
        await user.save();

        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error in createPost controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deletePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const userId = req.user._id;

		const post = await Post.findById(postId);

		if (!post) {
			return res.status(404).json({ message: "Post not found" });
		}

		// check if the current user is the author of the post
		if (post.author.toString() !== userId.toString()) {
			return res.status(403).json({ message: "You are not authorized to delete this post" });
		}

		// delete the image from cloudinary as well!
		if (post.image) {
			const objectName = post.image.split('/').slice(-2).join('/');
            await minioClient.removeObject(process.env.MINIO_BUCKET_NAME, objectName);
		}

		await Post.findByIdAndDelete(postId);

		// Descontar 1000 del rank del usuario
		const user = await User.findById(req.user._id);
		user.rank -= 1000;
		await user.save();

		res.status(200).json({ message: "Post deleted successfully" });
	} catch (error) {
		console.log("Error in delete post controller", error.message);
		res.status(500).json({ message: "Server error" });
	}
};

export const getPostById = async (req, res) => {
	try {
		const postId = req.params.id;
		const post = await Post.findById(postId)
			.populate("author", "name username profilePicture headline")
			.populate("comments.user", "name profilePicture username headline");

		res.status(200).json(post);
	} catch (error) {
		console.error("Error in getPostById controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const createComment = async (req, res) => {
	try {
		const postId = req.params.id;
		const { content } = req.body;

		const post = await Post.findByIdAndUpdate(
			postId,
			{
				$push: { comments: { user: req.user._id, content } },
			},
			{ new: true }
		).populate("author", "name email username headline profilePicture");
		
		// Incrementar el rank del autor del post
		const postAuthor = await User.findById(post.author._id);
		postAuthor.rank += 400;
		await postAuthor.save();

		// Incrementar el rank del usuario que crea el comentario
		const user = await User.findById(req.user._id);
		user.rank += 200;
		await user.save();

		// create a notification if the comment owner is not the post owner
		if (post.author._id.toString() !== req.user._id.toString()) {
			const newNotification = new Notification({
				recipient: post.author,
				type: "comment",
				relatedUser: req.user._id,
				relatedPost: postId,
			});

			await newNotification.save();

			try {
				const postUrl = process.env.CLIENT_URL + "/post/" + postId;
				await sendCommentNotificationEmail(
					post.author.email,
					post.author.name,
					req.user.name,
					postUrl,
					content
				);
			} catch (error) {
				console.log("Error in sending comment notification email:", error);
			}
		}

		res.status(200).json(post);
	} catch (error) {
		console.error("Error in createComment controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};

export const deleteComment = async (req, res) => {
    try {
        const postId = req.params.postId;
        const commentId = req.params.commentId;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const comment = post.comments.id(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if the current user is the author of the comment
        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({ message: "You are not authorized to delete this comment" });
        }

        // Remove the comment
        post.comments.pull(commentId);
        await post.save();

        // Decrementar el rank del usuario que creó el comentario
        const user = await User.findById(userId);
        user.rank -= 200;
        await user.save();

        // Decrementar el rank del autor del post
        const postAuthor = await User.findById(post.author);
        postAuthor.rank -= 400;
        await postAuthor.save();

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.error("Error in deleteComment controller:", error);
        res.status(500).json({ message: "Server error" });
    }
};
export const likePost = async (req, res) => {
	try {
		const postId = req.params.id;
		const post = await Post.findById(postId);
		const userId = req.user._id;

		if (post.likes.includes(userId)) {
			// unlike the post
			post.likes = post.likes.filter((id) => id.toString() !== userId.toString());

			 // restar 200 puntos al usuario que dio el like
			 const user = await User.findById(userId);
			 user.rank -= 200;
			 await user.save();
 
			 // restar 400 puntos al autor del post
			 const postAuthor = await User.findById(post.author);
			 postAuthor.rank -= 400;
			 await postAuthor.save();

		} else {
			// like the post
			post.likes.push(userId);

			 // sumar 200 puntos al usuario que dio el like
			 const user = await User.findById(userId);
			 user.rank += 200;
			 await user.save();
 
			 // sumar 400 puntos al autor del post
			 const postAuthor = await User.findById(post.author);
			 postAuthor.rank += 400;
			 await postAuthor.save();

			// create a notification if the post owner is not the user who liked
			if (post.author.toString() !== userId.toString()) {
				const newNotification = new Notification({
					recipient: post.author,
					type: "like",
					relatedUser: userId,
					relatedPost: postId,
				});

				await newNotification.save();
			}
		}

		await post.save();

		res.status(200).json(post);
	} catch (error) {
		console.error("Error in likePost controller:", error);
		res.status(500).json({ message: "Server error" });
	}
};
